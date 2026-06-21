<?php

use App\Http\Controllers\Admin\ActivityController;
use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\LoginApprovalController;
use App\Http\Controllers\User\CheckAnswerController;
use App\Http\Controllers\User\DeckController;
use App\Http\Controllers\User\DocumentParserController;
use App\Http\Controllers\User\FlashcardController;
use App\Http\Controllers\User\FlashcardGenerationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public authentication routes
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/login/status', [LoginApprovalController::class, 'status'])->middleware('throttle:30,1');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:5,1');
});

Route::prefix('admin')->group(function (): void {
    Route::post('/login', [AdminAuthController::class, 'login'])->middleware('throttle:3,5');
});

/*
|--------------------------------------------------------------------------
| Health — database warm-up
|--------------------------------------------------------------------------
|
| Public, side-effect-free DB ping for the keep-warm cron, so the free-tier
| database doesn't pause and the first real login isn't a slow cold start.
| Deliberately separate from the framework's /up liveness probe — Render's
| health check must not depend on database availability (otherwise a paused
| DB would make Render restart the instance).
*/
Route::get('/health/db', function () {
    try {
        DB::select('select 1');

        return response()->json(['status' => 'ok']);
    } catch (Throwable $e) {
        return response()->json(['status' => 'error'], 503);
    }
})->middleware('throttle:30,1');

/*
|--------------------------------------------------------------------------
| Broadcasting authentication
|--------------------------------------------------------------------------
|
| This route intentionally requires only Sanctum authentication. During the
| cross-platform approval flow, a requester may hold a short-lived conflict
| token before a normal platform session exists, and still needs to subscribe
| to their private approval channel.
*/
Route::post('/broadcasting/auth', function (Request $request) {
    return Broadcast::auth($request);
})->middleware('auth:sanctum');

/*
|--------------------------------------------------------------------------
| Login approval routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'user'])
    ->prefix('auth')
    ->group(function (): void {
        Route::get('/login/pending', [LoginApprovalController::class, 'pending'])
            ->middleware('throttle:30,1');

        Route::post('/login/approve', [LoginApprovalController::class, 'approve'])
            ->middleware('throttle:30,1');

        Route::post('/login/deny', [LoginApprovalController::class, 'deny'])
            ->middleware('throttle:30,1');
    });

/*
|--------------------------------------------------------------------------
| Authenticated user routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'user', 'platform.match'])->group(function (): void {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/profile/update', [AuthController::class, 'updateProfile']);

    Route::get('/decks', [DeckController::class, 'index']);
    Route::post('/decks', [DeckController::class, 'store']);
    Route::post('/decks/import', [DeckController::class, 'import']);
    Route::put('/decks/{id}', [DeckController::class, 'update']);
    Route::delete('/decks/{id}', [DeckController::class, 'destroy']);

    Route::get('/decks/{deckId}/flashcards', [FlashcardController::class, 'index']);
    Route::post('/decks/{deckId}/flashcards', [FlashcardController::class, 'store']);

    // These three endpoints each make a synchronous, multi-second outbound
    // call (OpenRouter for AI; CPU-heavy document parsing) that holds a
    // PHP-FPM worker for the whole duration. Without a per-user throttle a
    // single client can fire them in a tight loop and exhaust every worker,
    // starving cheap endpoints like login. The limits are keyed by the
    // authenticated user (Sanctum) and sized to real usage: generation and
    // parsing are deliberate, low-frequency actions; answer-checking happens
    // repeatedly during a study session, so it gets a higher ceiling.
    Route::post('/document/parse', [DocumentParserController::class, 'parse'])
        ->middleware('throttle:20,1');
    Route::post('/flashcards/generate', [FlashcardGenerationController::class, 'generate'])
        ->middleware('throttle:15,1');
    Route::post('/flashcards/check-answer', [CheckAnswerController::class, 'check'])
        ->middleware('throttle:60,1');
});

/*
|--------------------------------------------------------------------------
| Authenticated admin routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function (): void {
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me', [AdminAuthController::class, 'me']);
    Route::post('/profile', [AdminAuthController::class, 'updateProfile']);

    Route::get('/dashboard', [UserController::class, 'dashboard']);
    Route::get('/activity', [ActivityController::class, 'feed']);
    Route::get('/activity/engagement', [ActivityController::class, 'engagement']);
    Route::get('/users/trashed', [UserController::class, 'trashed']);
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show'])->whereNumber('id');
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::post('/users/{id}/restore', [UserController::class, 'restore']);
    Route::delete('/users/{id}/force', [UserController::class, 'forceDelete']);

    Route::get('/content/overview', [ContentController::class, 'overview']);
    Route::get('/decks', [ContentController::class, 'decks']);
    Route::get('/login-approvals', [ContentController::class, 'loginApprovals']);
});
