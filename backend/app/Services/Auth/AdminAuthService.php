<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Repositories\Auth\AuthRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class AdminAuthService
{
    public function __construct(
        private AuthRepository $authRepository
    ) {}

    public function login(array $data): array
    {
        \Illuminate\Support\Facades\Log::debug('Admin login attempt', [
            'email' => $data['email'],
            'ip'    => request()->ip()
        ]);

        $key = 'admin_attempts_' . request()->ip();
        $attempts = Cache::get($key, 0);

        if ($attempts >= 3) {
            \Illuminate\Support\Facades\Log::warning('Admin login blocked: too many attempts', ['email' => $data['email']]);
            throw ValidationException::withMessages([
                'email' => ['Too many failed attempts. Please try again in 5 minutes.'],
            ]);
        }

        $admin = $this->authRepository->findAdminByEmail($data['email']);

        if (!$admin) {
            \Illuminate\Support\Facades\Log::warning('Admin login failed: user not found', ['email' => $data['email']]);
            Cache::put($key, $attempts + 1, now()->addMinutes(5));
            $remaining = 3 - ($attempts + 1);
            throw ValidationException::withMessages([
                'email' => [$remaining > 0
                    ? "Invalid credentials. {$remaining} attempt(s) remaining."
                    : 'Too many failed attempts. Please try again in 5 minutes.'],
            ]);
        }

        if (!Hash::check($data['password'], $admin->password)) {
            \Illuminate\Support\Facades\Log::warning('Admin login failed: password mismatch', ['email' => $data['email']]);
            Cache::put($key, $attempts + 1, now()->addMinutes(5));
            $remaining = 3 - ($attempts + 1);
            throw ValidationException::withMessages([
                'email' => [$remaining > 0
                    ? "Invalid credentials. {$remaining} attempt(s) remaining."
                    : 'Too many failed attempts. Please try again in 5 minutes.'],
            ]);
        }

        \Illuminate\Support\Facades\Log::info('Admin login successful', ['email' => $data['email']]);
        Cache::forget($key);
        $admin->tokens()->delete();
        $token = $admin->createToken('admin_token')->plainTextToken;

        return [
            'user'  => $admin,
            'token' => $token,
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }
}