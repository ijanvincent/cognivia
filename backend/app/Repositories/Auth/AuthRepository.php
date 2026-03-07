<?php

namespace App\Repositories\Auth;

use App\Models\User;

class AuthRepository
{
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    public function findByUsername(string $username): ?User
    {
        return User::where('username', $username)->first();
    }

    public function createUser(array $data): User
    {
        return User::create([
            'username' => $data['username'],
            'email'    => $data['email'],
            'password' => $data['password'],
            'role'     => 'user',
        ]);
    }

    public function findAdminByEmail(string $email): ?User
    {
        return User::where('email', $email)
                   ->where('role', 'admin')
                   ->first();
    }
}