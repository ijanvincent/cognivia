<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AdminLoginRequest;
use App\Http\Resources\Auth\UserResource;
use App\Services\Auth\AdminAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    public function __construct(
        private AdminAuthService $adminAuthService
    ) {}

    public function login(AdminLoginRequest $request): JsonResponse
    {
        $result = $this->adminAuthService->login($request->validated());

        return response()->json([
            'message' => 'Admin login successful',
            'token'   => $result['token'],
            'user'    => new UserResource($result['user']),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->adminAuthService->logout($request->user());

        return response()->json([
            'message' => 'Admin logged out successfully',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($request->user()),
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'username'         => ['sometimes', 'string', 'min:3', 'max:30', 'regex:/^[a-zA-Z0-9_ ]+$/'],
            'email'            => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'current_password' => ['required_with:new_password', 'string'],
            'new_password'     => ['sometimes', 'string', 'confirmed', Password::min(8)],
        ]);

        if (! empty($validated['new_password'])) {
            if (! Hash::check($validated['current_password'], $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['Current password is incorrect.'],
                ]);
            }
            // 'hashed' cast on the model hashes this on assignment.
            $user->password = $validated['new_password'];
        }

        if (array_key_exists('username', $validated)) {
            $user->username = $validated['username'];
        }

        if (array_key_exists('email', $validated)) {
            $user->email = $validated['email'];
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user'    => new UserResource($user),
        ]);
    }
}