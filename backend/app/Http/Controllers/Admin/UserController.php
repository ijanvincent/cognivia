<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\UserResource;
use App\Models\PersonalAccessToken;
use App\Models\User;
use App\Services\Admin\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    public function dashboard(): JsonResponse
    {
        $stats = $this->userService->getDashboardStats();

        return response()->json(['stats' => $stats]);
    }

    public function index(): JsonResponse
    {
        $users = $this->userService->getAllUsers();

        return response()->json([
            'users' => UserResource::collection(collect($users)),
        ]);
    }

    // Full profile for the admin user-detail view: stats, sessions,
    // decks, and the login approval trail. Trashed users included so the
    // detail page still works from the Trash tab.
    public function show(int $id): JsonResponse
    {
        $user = User::withTrashed()
            ->where('role', 'user')
            ->withCount('decks')
            ->find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $cards = $user->flashcards()
            ->selectRaw('count(*) as total, sum(mastered) as mastered, sum(review_count) as reviews')
            ->first();

        $tokens = PersonalAccessToken::where('tokenable_type', User::class)
            ->where('tokenable_id', $user->id)
            ->whereNotNull('platform')
            ->orderByDesc('last_used_at')
            ->take(10)
            ->get(['id', 'platform', 'created_at', 'last_used_at', 'expires_at']);

        $decks = $user->decks()
            ->withCount('flashcards')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($d) => [
                'id'         => $d->id,
                'title'      => $d->title,
                'source'     => $d->source,
                'card_count' => $d->flashcards_count,
                'mastery'    => $d->mastery,
                'progress'   => $d->progress,
                'created_at' => $d->created_at,
                'updated_at' => $d->updated_at,
            ]);

        $approvals = \App\Models\PendingLogin::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->take(10)
            ->get()
            ->map(fn ($a) => [
                'id'                  => $a->id,
                'status'              => $a->isExpired() && $a->status === 'pending' ? 'expired' : $a->status,
                'requesting_platform' => $a->requesting_platform,
                'active_platform'     => $a->active_platform,
                'created_at'          => $a->created_at,
            ]);

        return response()->json([
            'user' => [
                'id'             => $user->id,
                'username'       => $user->username,
                'email'          => $user->email,
                'avatar'         => $user->avatar,
                'created_at'     => $user->created_at,
                'deleted_at'     => $user->deleted_at,
                'last_active_at' => $tokens->max('last_used_at'),
            ],
            'stats' => [
                'decks'          => $user->decks_count,
                'flashcards'     => (int) ($cards->total ?? 0),
                'mastered'       => (int) ($cards->mastered ?? 0),
                'reviews'        => (int) ($cards->reviews ?? 0),
            ],
            'sessions'  => $tokens,
            'decks'     => $decks,
            'approvals' => $approvals,
        ]);
    }

    // Soft delete
    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->userService->deleteUser($id);

        if (!$deleted) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(['message' => 'User deleted successfully']);
    }

    // Get all soft-deleted users
    public function trashed(): JsonResponse
    {
        $users = $this->userService->getDeletedUsers();

        return response()->json([
            'users' => UserResource::collection(collect($users)),
        ]);
    }

    // Restore a soft-deleted user
    public function restore(int $id): JsonResponse
    {
        $restored = $this->userService->restoreUser($id);

        if (!$restored) {
            return response()->json(['message' => 'User not found in trash'], 404);
        }

        return response()->json(['message' => 'User restored successfully']);
    }

    // Permanently delete
    public function forceDelete(int $id): JsonResponse
    {
        $deleted = $this->userService->forceDeleteUser($id);

        if (!$deleted) {
            return response()->json(['message' => 'User not found in trash'], 404);
        }

        return response()->json(['message' => 'User permanently deleted']);
    }
}