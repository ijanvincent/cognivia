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
        $key = 'admin_attempts_' . request()->ip();
        $attempts = Cache::get($key, 0);

        if ($attempts >= 3) {
            throw ValidationException::withMessages([
                'email' => ['Too many failed attempts. Please try again in 5 minutes.'],
            ]);
        }

        $admin = $this->authRepository->findAdminByEmail($data['email']);

        if (!$admin || !Hash::check($data['password'], $admin->password)) {
            Cache::put($key, $attempts + 1, now()->addMinutes(5));
            $remaining = 3 - ($attempts + 1);
            throw ValidationException::withMessages([
                'email' => [$remaining > 0
                    ? "Invalid credentials. {$remaining} attempt(s) remaining."
                    : 'Too many failed attempts. Please try again in 5 minutes.'],
            ]);
        }

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