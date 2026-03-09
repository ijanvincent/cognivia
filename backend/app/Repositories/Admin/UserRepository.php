<?php

namespace App\Repositories\Admin;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository
{
    public function getAllUsers(): Collection
    {
        return User::where('role', 'user')
                   ->orderBy('created_at', 'desc')
                   ->get();
    }

    public function getTotalUsers(): int
    {
        return User::where('role', 'user')->count();
    }

    public function getNewUsersToday(): int
    {
        return User::where('role', 'user')
                   ->whereDate('created_at', today())
                   ->count();
    }

    public function getNewUsersThisMonth(): int
    {
        return User::where('role', 'user')
                   ->whereMonth('created_at', now()->month)
                   ->whereYear('created_at', now()->year)
                   ->count();
    }

    public function getUserById(int $id): ?User
    {
        return User::where('role', 'user')->find($id);
    }

    public function deleteUser(int $id): bool
    {
        $user = $this->getUserById($id);
        if (!$user) return false;
        $user->tokens()->delete();
        return $user->delete();
    }
}