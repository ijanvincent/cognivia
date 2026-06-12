<?php

namespace App\Repositories\Admin;

use App\Models\PersonalAccessToken;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class UserRepository
{
    // -------------------------------------------------------------------------
    // Active users
    // -------------------------------------------------------------------------

    public function getAllUsers(): Collection
    {
        return User::where('role', 'user')
                   ->withCount(['decks', 'flashcards'])
                   ->addSelect(['last_active_at' => PersonalAccessToken::select('last_used_at')
                       ->whereColumn('tokenable_id', 'users.id')
                       ->where('tokenable_type', User::class)
                       ->whereNotNull('platform')
                       ->orderByDesc('last_used_at')
                       ->limit(1)])
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

    // -------------------------------------------------------------------------
    // Soft delete — stamps deleted_at, preserves all related data
    // -------------------------------------------------------------------------

    public function deleteUser(int $id): bool
    {
        $user = $this->getUserById($id);
        if (!$user) return false;

        $user->tokens()->delete();
        return (bool) $user->delete();
    }

    // -------------------------------------------------------------------------
    // Trashed users
    // -------------------------------------------------------------------------

    public function getDeletedUsers(): Collection
    {
        return User::where('role', 'user')
                   ->onlyTrashed()
                   ->withCount(['decks', 'flashcards'])
                   ->orderBy('deleted_at', 'desc')
                   ->get();
    }

    public function getTotalDeletedUsers(): int
    {
        return User::where('role', 'user')
                   ->onlyTrashed()
                   ->count();
    }

    public function getDeletedUserById(int $id): ?User
    {
        return User::where('role', 'user')
                   ->onlyTrashed()
                   ->find($id);
    }

    // -------------------------------------------------------------------------
    // Restore
    // -------------------------------------------------------------------------

    public function restoreUser(int $id): bool
    {
        $user = $this->getDeletedUserById($id);
        if (!$user) return false;

        return (bool) $user->restore();
    }

    // -------------------------------------------------------------------------
    // Permanent delete — transaction-wrapped, cascade handles child records
    //
    // Flow:
    //   1. Revoke all Sanctum tokens (security — prevents orphaned valid tokens)
    //   2. forceDelete() removes the user row
    //   3. DB cascade removes decks + flashcards automatically
    //   4. If anything fails, the transaction rolls back entirely
    // -------------------------------------------------------------------------

    public function forceDeleteUser(int $id): bool
    {
        $user = $this->getDeletedUserById($id);
        if (!$user) return false;

        DB::transaction(function () use ($user) {
            $user->tokens()->delete();
            $user->forceDelete();
        });

        return true;
    }
}