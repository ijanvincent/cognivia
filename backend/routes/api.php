<?php

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
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public authentication routes
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/login/status', [LoginApprovalController::class, 'status'])->middleware('throttle:30,1');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:30,1');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:5,1');
});

Route::prefix('admin')->group(function (): void {
    Route::post('/login', [AdminAuthController::class, 'login'])->middleware('throttle:3,5');
});

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

    Route::post('/document/parse', [DocumentParserController::class, 'parse']);
    Route::post('/flashcards/generate', [FlashcardGenerationController::class, 'generate']);
    Route::post('/flashcards/check-answer', [CheckAnswerController::class, 'check']);
});

/*
|--------------------------------------------------------------------------
| Authenticated admin routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function (): void {
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me', [AdminAuthController::class, 'me']);

    Route::get('/dashboard', [UserController::class, 'dashboard']);
    Route::get('/users/trashed', [UserController::class, 'trashed']);
    Route::get('/users', [UserController::class, 'index']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::post('/users/{id}/restore', [UserController::class, 'restore']);
    Route::delete('/users/{id}/force', [UserController::class, 'forceDelete']);

    Route::get('/content/overview',  [ContentController::class, 'overview']);
    Route::get('/decks',             [ContentController::class, 'decks']);
    Route::get('/login-approvals',   [ContentController::class, 'loginApprovals']);
});
