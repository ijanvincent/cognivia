<?php

namespace App\Services;

use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        protected UserRepository $userRepository
    ) {}

    public function register(array $data): array
    {
        $user = $this->userRepository->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'user',
        ]);

        $token = $user->createToken('cognivia_user')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function login(array $data): array
    {
        $user = $this->userRepository->findByEmail($data['email']);

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Block admin from logging in via user login
        if ($user->role === 'admin') {
            throw ValidationException::withMessages([
                'email' => ['Please use the admin portal to login.'],
            ]);
        }

        $token = $user->createToken('cognivia_user')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function adminLogin(array $data): array
    {
        $user = $this->userRepository->findByEmail($data['email']);

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Block non-admins from admin portal
        if ($user->role !== 'admin') {
            throw ValidationException::withMessages([
                'email' => ['Access denied. Admin only.'],
            ]);
        }

        $token = $user->createToken('cognivia_admin')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function logout($user): void
    {
        $user->currentAccessToken()->delete();
    }
}