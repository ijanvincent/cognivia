<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\QuizController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);

// Protected routes (need token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);

    // Quiz
    Route::get('/questions', [QuizController::class, 'getQuestions']);
    Route::post('/quiz/start', [QuizController::class, 'startQuiz']);
    Route::post('/quiz/answer', [QuizController::class, 'submitAnswer']);
    Route::get('/leaderboard', [QuizController::class, 'leaderboard']);
});