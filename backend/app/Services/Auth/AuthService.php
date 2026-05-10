<?php

namespace App\Services\Auth;

use App\Events\ForceLogout;
use App\Events\LoginApproved;
use App\Events\LoginDenied;
use App\Events\NewLoginRequest;
use App\Exceptions\Auth\EmailNotFoundException;
use App\Exceptions\Auth\PlatformConflictException;
use App\Exceptions\Auth\WrongPasswordException;
use App\Mail\PasswordResetMail;
use App\Models\PendingLogin;
use App\Models\User;
use App\Repositories\Auth\AuthRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    // Approval window in seconds.
    // Why 60: long enough for the user to see the notification and respond,
    // short enough to not leave stale pending records accumulating in the DB.
    private const APPROVAL_TTL_SECONDS = 60;

    public function __construct(
        private AuthRepository $authRepository
    ) {}

    // =========================================================================
    // Register
    // =========================================================================

    public function register(array $data): array
    {
        $user = $this->authRepository->createUser([
            'username' => $data['username'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('user_token')->plainTextToken;

        return [
            'user'  => $user,
            'token' => $token,
        ];
    }

    // =========================================================================
    // Login
    // =========================================================================

    /**
     * Attempt to log in a user.
     *
     * Change: login() now implements the full approval gate flow instead of
     * the old "block until other platform logs out" pattern.
     *
     * What changed:
     * - Creates a PendingLogin record with a hashed approval token
     * - Fires NewLoginRequest event to the active platform
     * - Throws PlatformConflictException with both conflict_token (WS auth)
     *   and approval_token (plaintext, for the client to identify its request)
     *
     * Why: The old flow required the active session to voluntarily log out
     * before the new login could proceed. This was fragile — if the active
     * user ignored the prompt, the requesting user was blocked indefinitely.
     * The approval gate gives the active user explicit control (Allow/Deny)
     * with a hard timeout fallback, which is both more secure and better UX.
     */
    public function login(array $data): array
    {
        $user = $this->authRepository->findByEmail($data['email']);

        if (! $user) {
            throw new EmailNotFoundException();
        }

        if (! Hash::check($data['password'], $user->password)) {
            throw new WrongPasswordException();
        }

        if ($user->isAdmin()) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password'],
            ]);
        }

        $platform      = $data['platform'];
        $otherPlatform = $platform === 'web' ? 'mobile' : 'web';

        $hasOtherSession = $user->tokens()
            ->where('platform', $otherPlatform)
            ->exists();

        if ($hasOtherSession) {
            // Clean up any expired pending logins for this user first.
            // Why: prevents stale records from accumulating; keeps the table lean.
            PendingLogin::where('user_id', $user->id)
                ->where('expires_at', '<', now())
                ->delete();

            // Generate a cryptographically random approval token.
            // Why Str::random(64): 64 chars of URL-safe random = ~380 bits entropy.
            // Well above OWASP minimum of 128 bits for session tokens.
            $approvalToken = Str::random(64);

            // Store the hash, never the plaintext.
            // Why: if the DB is compromised, hashed tokens cannot be replayed.
            PendingLogin::create([
                'user_id'              => $user->id,
                'token_hash'           => hash('sha256', $approvalToken),
                'requesting_platform'  => $platform,
                'active_platform'      => $otherPlatform,
                'status'               => 'pending',
                'expires_at'           => now()->addSeconds(self::APPROVAL_TTL_SECONDS),
            ]);

            // Short-lived Sanctum token for WebSocket channel authentication only.
            // Why separate from approvalToken: WS auth and approval are different
            // concerns. The conflict_token authenticates the WS subscription;
            // the approval_token identifies the pending login record.
            $conflictToken = $user->createToken(
                'conflict_token',
                ['broadcast.conflict.only'],
                now()->addMinutes(5)
            )->plainTextToken;

            // Notify the active platform in real-time.
            broadcast(new NewLoginRequest(
                userId:             $user->id,
                requestingPlatform: $platform,
                approvalToken:      $approvalToken,
                expiresInSeconds:   self::APPROVAL_TTL_SECONDS,
            ));

            throw new PlatformConflictException(
                otherPlatform:  $otherPlatform,
                userId:         $user->id,
                conflictToken:  $conflictToken,
                approvalToken:  $approvalToken,
            );
        }

        // No conflict — proceed with normal login.
        $this->authRepository->revokeTokensByPlatform($user, $platform);

        $expiresAt = isset($data['remember_me']) && $data['remember_me']
            ? now()->addDays(30)
            : now()->addHours(24);

        $token = $this->authRepository->createPlatformToken(
            $user,
            'user_token',
            $platform,
            $expiresAt
        );

        return [
            'user'     => $user,
            'token'    => $token,
            'platform' => $platform,
        ];
    }

    // =========================================================================
    // Approve pending login
    // =========================================================================

    /**
     * Approve a pending login request.
     *
     * What: Called by Platform A when the user taps "Allow".
     *       Creates a real session token for Platform B and fires LoginApproved.
     *
     * Why: Platform B is listening on its private channel. On receiving
     *      LoginApproved it stores the token and navigates to the dashboard
     *      without requiring another login round-trip.
     *
     * Security:
     * - Token is looked up by SHA-256 hash only
     * - Record must be pending and not expired
     * - Single-use: status set to 'approved' immediately, preventing replay
     */
    public function approvePendingLogin(string $approvalToken, User $approvingUser): void
    {
        $pending = PendingLogin::where('token_hash', hash('sha256', $approvalToken))
            ->where('user_id', $approvingUser->id)
            ->where('status', 'pending')
            ->first();

        if (! $pending || $pending->isExpired()) {
            // Expired or not found — fire denied so Platform B stops waiting.
            if ($pending) {
                $pending->update(['status' => 'denied']);
                broadcast(new LoginDenied(
                    userId:         $approvingUser->id,
                    reason:         'The approval window has expired. Please try logging in again.',
                    deniedPlatform: $pending->requesting_platform,
                ));
            }
            return;
        }

        // Mark as approved immediately to prevent replay attacks.
        $pending->update(['status' => 'approved']);

        // Revoke any existing tokens on the requesting platform.
        $this->authRepository->revokeTokensByPlatform($approvingUser, $pending->requesting_platform);

        // Create a real session token for Platform B.
        $sessionToken = $this->authRepository->createPlatformToken(
            $approvingUser,
            'user_token',
            $pending->requesting_platform,
            now()->addHours(24)
        );

        // Fire LoginApproved so Platform B can proceed.
        broadcast(new LoginApproved(
            userId:           $approvingUser->id,
            sessionToken:     $sessionToken,
            user:             $approvingUser->only(['id', 'username', 'email', 'avatar', 'role']),
            approvedPlatform: $pending->requesting_platform,
        ));
    }

    // =========================================================================
    // Deny pending login
    // =========================================================================

    /**
     * Deny a pending login request.
     *
     * What: Called by Platform A when the user taps "Deny", or automatically
     *       after the 60-second timeout (via a scheduled cleanup job).
     *
     * Why: Platform B must receive an explicit denial so it can stop waiting
     *      and show a clear message rather than timing out silently.
     */
    public function denyPendingLogin(string $approvalToken, User $denyingUser): void
    {
        $pending = PendingLogin::where('token_hash', hash('sha256', $approvalToken))
            ->where('user_id', $denyingUser->id)
            ->where('status', 'pending')
            ->first();

        if (! $pending) {
            return;
        }

        $pending->update(['status' => 'denied']);

        broadcast(new LoginDenied(
            userId:         $denyingUser->id,
            reason:         'Your sign-in request was denied by the active session.',
            deniedPlatform: $pending->requesting_platform,
        ));
    }

    // =========================================================================
    // Logout
    // =========================================================================

    /**
     * What: Unchanged from previous version.
     * Why ForceLogout is still broadcast on logout: even after we add the
     * approval gate, if the active user proactively logs out, the other
     * platform (if it's sitting on a denied/waiting screen) should be
     * notified to retry normally.
     */
    public function logout(User $user): void
    {
        $currentToken = $user->currentAccessToken();
        $platform     = $currentToken->platform ?? 'unknown';

        broadcast(new ForceLogout($platform, $user->id));

        $currentToken->delete();
    }

    // =========================================================================
    // Password reset
    // =========================================================================

    public function sendPasswordResetLink(string $email): void
    {
        $user = $this->authRepository->findByEmail($email);

        if (! $user) return;

        $token = Str::random(64);
        $this->authRepository->storeResetToken($email, $token);

        $resetUrl = config('app.frontend_url')
            . '/reset-password?token=' . $token
            . '&email=' . urlencode($email);

        Mail::to($email)->send(new PasswordResetMail($resetUrl, $user->username));
    }

    public function resetPassword(array $data): void
    {
        $record = $this->authRepository->findResetToken($data['email']);

        if (! $record) {
            throw ValidationException::withMessages([
                'token' => ['Invalid or expired reset link.'],
            ]);
        }

        if (now()->diffInMinutes($record->created_at) > 60) {
            $this->authRepository->deleteResetToken($data['email']);
            throw ValidationException::withMessages([
                'token' => ['Reset link has expired. Please request a new one.'],
            ]);
        }

        if (! Hash::check($data['token'], $record->token)) {
            throw ValidationException::withMessages([
                'token' => ['Invalid or expired reset link.'],
            ]);
        }

        $user = $this->authRepository->findByEmail($data['email']);
        $user->update(['password' => Hash::make($data['password'])]);
        $this->authRepository->deleteResetToken($data['email']);

        $user->tokens()->delete();
    }

    // =========================================================================
    // Profile
    // =========================================================================

    public function updateProfile(User $user, array $data): User
    {
        $updateData = [];

        if (! empty($data['username'])) {
            $existing = $this->authRepository->findByUsername($data['username']);
            if ($existing && $existing->id !== $user->id) {
                throw ValidationException::withMessages([
                    'username' => ['Username is already taken.'],
                ]);
            }
            $updateData['username'] = $data['username'];
        }

        if (! empty($data['avatar'])) {
            $updateData['avatar'] = $data['avatar'];
        }

        return $this->authRepository->updateUser($user->id, $updateData);
    }
}