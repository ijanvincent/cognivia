<?php

namespace App\Services\Auth;

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

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password'],
            ]);
        }

        if ($user->isAdmin()) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password'],
            ]);
        }

        $user->tokens()->delete();
        
        // Remember Me — longer expiration if checked
        $tokenName     = 'user_token';
        $expiresAt     = isset($data['remember_me']) && $data['remember_me']
            ? now()->addDays(30)
            : now()->addHours(24);

        $token = $user->createToken($tokenName, ['*'], $expiresAt)->plainTextToken;

        return [
            'user'  => $user,
            'token' => $token,
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    public function sendPasswordResetLink(string $email): void
    {
        $user = $this->authRepository->findByEmail($email);

        // Security: always return success even if email not found
        // This prevents email enumeration attacks
        if (!$user) return;

        // Generate secure random token
        $token = Str::random(64);

        // Store hashed token in database
        $this->authRepository->storeResetToken($email, $token);

        // Send email with reset link
        $resetUrl = config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($email);

        Mail::send('emails.password-reset', ['resetUrl' => $resetUrl, 'user' => $user], function ($message) use ($email) {
            $message->to($email)
                    ->subject('CogniVia — Reset Your Password');
        });
    }

    public function resetPassword(array $data): void
    {
        $record = $this->authRepository->findResetToken($data['email']);

        // Check token exists
        if (!$record) {
            throw ValidationException::withMessages([
                'token' => ['Invalid or expired reset link.'],
            ]);
        }

        // Check token not expired (60 minutes)
        if (now()->diffInMinutes($record->created_at) > 60) {
            $this->authRepository->deleteResetToken($data['email']);
            throw ValidationException::withMessages([
                'token' => ['Reset link has expired. Please request a new one.'],
            ]);
        }

        // Verify token
        if (!Hash::check($data['token'], $record->token)) {
            throw ValidationException::withMessages([
                'token' => ['Invalid or expired reset link.'],
            ]);
        }

        // Update password
        $user = $this->authRepository->findByEmail($data['email']);
        $user->update(['password' => Hash::make($data['password'])]);

        // Delete token — single use only
        $this->authRepository->deleteResetToken($data['email']);

        // Revoke all existing tokens — force re-login everywhere
        $user->tokens()->delete();
    }
}