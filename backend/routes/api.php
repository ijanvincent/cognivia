<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\User\DeckController;
use App\Http\Controllers\User\FlashcardController;
use Illuminate\Support\Facades\Route;

// ─── User Auth ───────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register',        [AuthController::class, 'register']);
    Route::post('/login',           [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:30,1');
    Route::post('/reset-password',  [AuthController::class, 'resetPassword'])->middleware('throttle:5,1');
});

// ─── Admin Auth ───────────────────────────────────────────────
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login'])
         ->middleware('throttle:3,5');
});

// ─── Authenticated User Routes ────────────────────────────────
Route::middleware(['auth:sanctum', 'user'])->group(function () {
    Route::post('/auth/logout',         [AuthController::class, 'logout']);
    Route::get('/auth/me',              [AuthController::class, 'me']);
    Route::post('/auth/profile/update', [AuthController::class, 'updateProfile']);
    
    // ─── Decks ────────────────────────────────────────────────
    Route::get('/decks',         [DeckController::class, 'index']);
    Route::post('/decks',        [DeckController::class, 'store']);
    Route::put('/decks/{id}',    [DeckController::class, 'update']);
    Route::delete('/decks/{id}', [DeckController::class, 'destroy']);

    // ─── Flashcards ───────────────────────────────────────────
    Route::get('/decks/{deckId}/flashcards',  [FlashcardController::class, 'index']);
    Route::post('/decks/{deckId}/flashcards', [FlashcardController::class, 'store']);
});

// ─── Authenticated Admin Routes ───────────────────────────────
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::post('/logout',       [AdminAuthController::class, 'logout']);
    Route::get('/me',            [AdminAuthController::class, 'me']);

    // User management
    Route::get('/dashboard',     [UserController::class, 'dashboard']);
    Route::get('/users',         [UserController::class, 'index']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});