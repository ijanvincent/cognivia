<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\User\FlashcardGenerationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class CheckAnswerController extends Controller
{
    public function __construct(
        private readonly FlashcardGenerationService $generationService,
    ) {}

    /**
     * POST /api/flashcards/check-answer
     */
    public function check(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question'       => ['required', 'string', 'max:1000'],
            'correct_answer' => ['required', 'string', 'max:5000'],
            'student_answer' => ['required', 'string', 'min:1', 'max:5000'],
        ]);

        try {
            $result = $this->generationService->checkAnswer(
                question:      $validated['question'],
                correctAnswer: $validated['correct_answer'],
                studentAnswer: $validated['student_answer'],
            );
        } catch (RuntimeException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }

        return response()->json([
            'success'  => true,
            'correct'  => $result['correct'],
            'feedback' => $result['feedback'],
        ]);
    }
}