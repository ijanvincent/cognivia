<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Repositories\Auth\AuthRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminAuthService
{
    public function __construct(
        private AuthRepository $authRepository
    ) {}

    public function login(array $data): array
    {
        $admin = $this->authRepository->findAdminByEmail($data['email']);

        if (!$admin || !Hash::check($data['password'], $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid admin credentials'],
            ]);
        }

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