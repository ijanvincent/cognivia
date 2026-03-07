<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\AdminAuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});


Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);
});


Route::middleware(['auth:sanctum', 'user'])->group(function () {
    Route::post('/logout',   [AuthController::class, 'logout']);
    Route::get('/me',        [AuthController::class, 'me']);
});


Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::post('/logout',   [AdminAuthController::class, 'logout']);
    Route::get('/me',        [AdminAuthController::class, 'me']);
});