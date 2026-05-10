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
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\File;
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
                'message'    => $e->getMessage(),
                'error_code' => 'EMAIL_NOT_FOUND',
            ], 401);

        } catch (\App\Exceptions\Auth\WrongPasswordException $e) {
            RateLimiter::hit($throttleKey, 60);
            return response()->json([
                'message'    => $e->getMessage(),
                'error_code' => 'WRONG_PASSWORD',
            ], 401);

        } catch (\App\Exceptions\Auth\PlatformConflictException $e) {
            /*
             * What changed: added approval_token to the response payload.
             * Why: the client needs approval_token to identify its pending
             *      login request when the WebSocket LoginApproved/LoginDenied
             *      event arrives. conflict_token remains for WS auth only.
             */
            return response()->json([
                'message'          => $e->getMessage(),
                'error_code'       => 'PLATFORM_CONFLICT',
                'conflict_user_id' => $e->userId,
                'conflict_token'   => $e->conflictToken,
                'approval_token'   => $e->approvalToken,
            ], 422);

        } catch (ValidationException $e) {
            RateLimiter::hit($throttleKey, 60);
            $errors  = $e->errors();
            $message = collect($errors)->flatten()->first();
            $code = 'VALIDATION_ERROR';
            if (str_contains($message, 'Invalid email or password')) {
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

        $ipKey    = 'forgot-password-ip:'    . $request->ip();
        $emailKey = 'forgot-password-email:' . strtolower($request->input('email'));

        if (RateLimiter::tooManyAttempts($ipKey, 5)) {
            $seconds = RateLimiter::availableIn($ipKey);
            return response()->json(['message' => "Too many requests. Please try again in {$seconds} seconds."], 429);
        }

        if (RateLimiter::tooManyAttempts($emailKey, 3)) {
            $seconds = RateLimiter::availableIn($emailKey);
            return response()->json(['message' => "Too many requests. Please try again in {$seconds} seconds."], 429);
        }

        RateLimiter::hit($ipKey, 600);
        RateLimiter::hit($emailKey, 3600);

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
                'required', 'string', 'min:8', 'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/',
            ],
            'password_confirmation' => ['required'],
        ]);

        $throttleKey = 'reset-password:' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json(['message' => "Too many requests. Please try again in {$seconds} seconds."], 429);
        }

        RateLimiter::hit($throttleKey, 900);
        $this->authService->resetPassword($request->only(['token', 'email', 'password']));
        RateLimiter::clear($throttleKey);

        return response()->json([
            'message' => 'Password reset successfully. Please log in with your new password.',
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $request->validate([
            'username' => ['sometimes', 'string', 'min:3', 'max:30', 'regex:/^[a-zA-Z0-9_]+$/'],
            'avatar'   => ['sometimes', 'file', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        $data = $request->only(['username']);

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');

            $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
            $realMime     = finfo_file(finfo_open(FILEINFO_MIME_TYPE), $file->getRealPath());

            if (! in_array($realMime, $allowedMimes)) {
                return response()->json(['message' => 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'], 422);
            }

            $imageData = file_get_contents($file->getRealPath());
            $image     = imagecreatefromstring($imageData);

            if (! $image) {
                return response()->json(['message' => 'Could not process image. Please upload a valid image file.'], 422);
            }

            $filename = sprintf('avatar_%d_%d_%s.jpg', $request->user()->id, time(), bin2hex(random_bytes(4)));
            $tempDir  = storage_path('app/temp');
            $tempPath = $tempDir . '/' . $filename;

            if (! is_dir($tempDir)) mkdir($tempDir, 0755, true);

            imagejpeg($image, $tempPath, 85);
            imagedestroy($image);

            $path = Storage::disk('public')->putFileAs('avatars', new File($tempPath), $filename);
            unlink($tempPath);

            $data['avatar'] = '/storage/' . $path;
        }

        $user = $this->authService->updateProfile($request->user(), $data);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user'    => new UserResource($user),
        ]);
    }
}