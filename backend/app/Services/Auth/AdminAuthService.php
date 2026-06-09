<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Repositories\Auth\AuthRepository;
use App\Services\JwtService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AdminAuthService
{
    public function __construct(
        private AuthRepository $authRepository
    ) {}

    public function login(array $data): array
    {
        Log::debug('Admin login attempt', ['ip' => request()->ip()]);

        $key = 'admin_attempts_'.request()->ip();
        $attempts = Cache::get($key, 0);

        if ($attempts >= 3) {
            Log::warning('Admin login blocked: too many attempts', ['ip' => request()->ip()]);
            throw ValidationException::withMessages([
                'email' => ['Too many failed attempts. Please try again in 5 minutes.'],
            ]);
        }

        $admin = $this->authRepository->findAdminByEmail($data['email']);

        if (! $admin) {
            Log::warning('Admin login failed: invalid credentials', ['ip' => request()->ip()]);
            Cache::put($key, $attempts + 1, now()->addMinutes(5));
            $remaining = 3 - ($attempts + 1);
            throw ValidationException::withMessages([
                'email' => [$remaining > 0
                    ? "Invalid credentials. {$remaining} attempt(s) remaining."
                    : 'Too many failed attempts. Please try again in 5 minutes.'],
            ]);
        }

        if (! Hash::check($data['password'], $admin->password)) {
            Log::warning('Admin login failed: invalid credentials', ['ip' => request()->ip()]);
            Cache::put($key, $attempts + 1, now()->addMinutes(5));
            $remaining = 3 - ($attempts + 1);
            throw ValidationException::withMessages([
                'email' => [$remaining > 0
                    ? "Invalid credentials. {$remaining} attempt(s) remaining."
                    : 'Too many failed attempts. Please try again in 5 minutes.'],
            ]);
        }

        Log::info('Admin login successful', ['ip' => request()->ip()]);
        Cache::forget($key);
        $admin->tokens()->delete();

        $expiresAt = now()->addHours(8);
        $sanctumToken = $admin->createToken('admin_token', ['*'], $expiresAt);
        $jwt = app(JwtService::class)->sign(
            tokenId: $sanctumToken->accessToken->id,
            userId: $admin->id,
            platform: null,
            expiresAt: $expiresAt,
        );

        return [
            'user' => $admin,
            'token' => $jwt,
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }
}
