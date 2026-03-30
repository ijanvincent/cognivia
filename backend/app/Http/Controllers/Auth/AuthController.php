<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\Auth\UserResource;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return response()->json([
            'message' => 'Registration successful.',
            'token'   => $result['token'],
            'user'    => new UserResource($result['user']),
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $throttleKey = 'login:' . strtolower($request->input('email')) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            return response()->json([
                'message'     => "Too many login attempts. Please try again in {$seconds} seconds.",
                'error_code'  => 'TOO_MANY_ATTEMPTS',
                'retry_after' => $seconds,
            ], 429);
        }

        try {
            $result = $this->authService->login($request->validated());

            RateLimiter::clear($throttleKey);

            return response()->json([
                'message' => 'Login successful.',
                'token'   => $result['token'],
                'user'    => new UserResource($result['user']),
            ]);

        } catch (\App\Exceptions\Auth\EmailNotFoundException $e) {
            RateLimiter::hit($throttleKey, 60);

            return response()->json([
                'message'    => 'No account found with this email address.',
                'error_code' => 'EMAIL_NOT_FOUND',
            ], 401);

        } catch (\App\Exceptions\Auth\WrongPasswordException $e) {
            RateLimiter::hit($throttleKey, 60);

            return response()->json([
                'message'    => 'The password you entered is incorrect.',
                'error_code' => 'WRONG_PASSWORD',
            ], 401);

        } catch (ValidationException $e) {
            RateLimiter::hit($throttleKey, 60);

            $errors  = $e->errors();
            $message = collect($errors)->flatten()->first();

            $code = 'VALIDATION_ERROR';
            if (str_contains($message, 'active on')) {
                $code = 'PLATFORM_CONFLICT';
            } elseif (str_contains($message, 'Invalid email or password')) {
                $code = 'ADMIN_ACCOUNT';
            }

            return response()->json([
                'message'    => $message,
                'error_code' => $code,
                'errors'     => $errors,
            ], 422);

        } catch (\Exception $e) {
            RateLimiter::hit($throttleKey, 60);

            return response()->json([
                'message'    => 'Invalid credentials. Please try again.',
                'error_code' => 'INVALID_CREDENTIALS',
            ], 401);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json([
            'message' => 'Logged out successfully.',
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
            'email' => ['required', 'email', 'max:255'],
        ]);

        $throttleKey = 'forgot-password:' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 3)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            return response()->json([
                'message' => "Too many requests. Please try again in {$seconds} seconds.",
            ], 429);
        }

        RateLimiter::hit($throttleKey, 600);

        $this->authService->sendPasswordResetLink($request->input('email'));

        return response()->json([
            'message' => 'If that email is registered, a reset link has been sent.',
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token'                 => ['required', 'string'],
            'email'                 => ['required', 'email', 'max:255'],
            'password'              => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/',
            ],
            'password_confirmation' => ['required'],
        ]);

        $throttleKey = 'reset-password:' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            return response()->json([
                'message' => "Too many requests. Please try again in {$seconds} seconds.",
            ], 429);
        }

        RateLimiter::hit($throttleKey, 900);

        $this->authService->resetPassword($request->only([
            'token',
            'email',
            'password',
        ]));

        RateLimiter::clear($throttleKey);

        return response()->json([
            'message' => 'Password reset successfully. Please log in with your new password.',
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $request->validate([
            'username' => ['sometimes', 'string', 'min:3', 'max:30', 'regex:/^[a-zA-Z0-9_]+$/'],
            'avatar'   => [
                'sometimes',
                'file',
                'mimes:jpeg,png,jpg,webp',
                'max:2048',
            ],
        ]);

        $data = $request->only(['username']);

        if ($request->hasFile('avatar')) {
            $file      = $request->file('avatar');
            $extension = $file->guessExtension() ?? 'jpg';
            $filename  = sprintf(
                'avatar_%d_%d_%s.%s',
                $request->user()->id,
                time(),
                bin2hex(random_bytes(4)),
                $extension
            );
            $path = $file->storeAs('avatars', $filename, 'public');
            $data['avatar'] = '/storage/' . $path;
        }

        $user = $this->authService->updateProfile($request->user(), $data);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user'    => new UserResource($user),
        ]);
    }
}