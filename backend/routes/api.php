<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

// User Auth
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// Admin Auth
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);
});

Route::middleware(['auth:sanctum', 'user'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::post('/logout',           [AdminAuthController::class, 'logout']);
    Route::get('/me',                [AdminAuthController::class, 'me']);

    // User management
    Route::get('/dashboard',         [UserController::class, 'dashboard']);
    Route::get('/users',             [UserController::class, 'index']);
    Route::delete('/users/{id}',     [UserController::class, 'destroy']);
});