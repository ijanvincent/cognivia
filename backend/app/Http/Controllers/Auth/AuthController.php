<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\Auth\UserResource;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return response()->json([
            'message' => 'Registration successful',
            'token'   => $result['token'],
            'user'    => new UserResource($result['user']),
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->validated());

        return response()->json([
            'message' => 'Login successful',
            'token'   => $result['token'],
            'user'    => new UserResource($result['user']),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($request->user()),
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $this->authService->sendPasswordResetLink($request->email);

        return response()->json([
            'message' => 'If that email is registered, a reset link has been sent.',
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token'                 => ['required', 'string'],
            'email'                 => ['required', 'email'],
            'password'              => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/',
            ],
            'password_confirmation' => ['required'],
        ]);

        $this->authService->resetPassword($request->only([
            'token',
            'email',
            'password',
        ]));

        return response()->json([
            'message' => 'Password reset successfully. Please log in with your new password.',
        ]);
    }
 public function updateProfile(Request $request): JsonResponse
{
    $request->validate([
        'username' => ['sometimes', 'string', 'min:3', 'max:30', 'regex:/^[a-zA-Z0-9_]+$/'],
        'avatar'   => ['sometimes', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
    ]);

    $data = $request->only(['username']);


    if ($request->hasFile('avatar')) {
        $file     = $request->file('avatar');
        $filename = 'avatar_' . $request->user()->id . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path     = $file->storeAs('avatars', $filename, 'public');
        $data['avatar'] = '/storage/' . $path;
    }

    $user = $this->authService->updateProfile($request->user(), $data);

    return response()->json([
        'message' => 'Profile updated successfully.',
        'user'    => new UserResource($user),
    ]);
}
}