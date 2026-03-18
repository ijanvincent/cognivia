<?php

namespace App\Repositories\Auth;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

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

    public function findResetToken(string $email): ?object
    {
        return DB::table('password_reset_tokens')
            ->where('email', $email)
            ->first();
    }

    public function storeResetToken(string $email, string $token): void
    {
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token'      => Hash::make($token),
                'created_at' => now(),
            ]
        );
    }

    public function deleteResetToken(string $email): void
    {
        DB::table('password_reset_tokens')
            ->where('email', $email)
            ->delete();
    }
}