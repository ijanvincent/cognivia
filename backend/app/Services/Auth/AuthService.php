<?php

namespace App\Services\Auth;

use App\Events\ForceLogout;
use App\Exceptions\Auth\EmailNotFoundException;
use App\Exceptions\Auth\PlatformConflictException;
use App\Exceptions\Auth\WrongPasswordException;
use App\Mail\PasswordResetMail;
use App\Models\User;
use App\Repositories\Auth\AuthRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private AuthRepository $authRepository
    ) {}

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

    public function login(array $data): array
    {
        $user = $this->authRepository->findByEmail($data['email']);

        if (!$user) {
            throw new EmailNotFoundException();
        }

        if (!Hash::check($data['password'], $user->password)) {
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
            $conflictToken = $user->createToken(
                'conflict_token',
                ['broadcast.conflict.only'],
                now()->addMinutes(5)
            )->plainTextToken;

            throw new PlatformConflictException(
                $otherPlatform,
                $user->id,
                $conflictToken
            );
        }

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

    public function logout(User $user): void
    {
        $currentToken = $user->currentAccessToken();
        $platform     = $currentToken->platform ?? 'unknown';

        broadcast(new ForceLogout($platform, $user->id));

        $currentToken->delete();
    }

    public function sendPasswordResetLink(string $email): void
    {
        $user = $this->authRepository->findByEmail($email);

        if (!$user) return;

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

        if (!$record) {
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

        if (!Hash::check($data['token'], $record->token)) {
            throw ValidationException::withMessages([
                'token' => ['Invalid or expired reset link.'],
            ]);
        }

        $user = $this->authRepository->findByEmail($data['email']);
        $user->update(['password' => Hash::make($data['password'])]);
        $this->authRepository->deleteResetToken($data['email']);

        $user->tokens()->delete();
    }

    public function updateProfile(User $user, array $data): User
    {
        $updateData = [];

        if (!empty($data['username'])) {
            $existing = $this->authRepository->findByUsername($data['username']);
            if ($existing && $existing->id !== $user->id) {
                throw ValidationException::withMessages([
                    'username' => ['Username is already taken.'],
                ]);
            }
            $updateData['username'] = $data['username'];
        }

        if (!empty($data['avatar'])) {
            $updateData['avatar'] = $data['avatar'];
        }

        return $this->authRepository->updateUser($user->id, $updateData);
    }
}