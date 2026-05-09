<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\UserResource;
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