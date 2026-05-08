<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\GenerateFlashcardsRequest;
use App\Services\User\FlashcardGenerationService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class FlashcardGenerationController extends Controller
{
    public function __construct(
        private readonly FlashcardGenerationService $generationService,
    ) {}

    /**
     * POST /api/flashcards/generate
     */
    public function generate(GenerateFlashcardsRequest $request): JsonResponse
    {
        try {
            $flashcards = $this->generationService->generate(
                documentText:  $request->validated('document_text'),
                numberOfCards: (int) $request->validated('number_of_cards'),
                cardTypes:     $request->validated('card_types'),
            );
        } catch (RuntimeException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }

        return response()->json([
            'success'    => true,
            'flashcards' => $flashcards,
            'count'      => count($flashcards),
        ]);
    }
}