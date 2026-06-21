<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\GenerateFlashcardsRequest;
use App\Jobs\GenerateFlashcardsJob;
use App\Services\User\FlashcardGenerationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use RuntimeException;

class FlashcardGenerationController extends Controller
{
    public function __construct(
        private readonly FlashcardGenerationService $generationService,
    ) {}

    /**
     * POST /api/flashcards/generate
     *
     * Two modes, selected by config('flashcards.async'):
     *   - async (202): dispatch the AI call to the queue and return a
     *     request_id; the client receives the result over its private
     *     user.{id} channel. Keeps the slow call off the web worker.
     *   - sync  (200): run generation inline and return the cards directly —
     *     the original, always-safe default (no worker/broadcast required).
     */
    public function generate(GenerateFlashcardsRequest $request): JsonResponse
    {
        if (config('flashcards.async')) {
            $requestId = (string) Str::uuid();

            GenerateFlashcardsJob::dispatch(
                userId: (int) $request->user()->id,
                requestId: $requestId,
                documentText: $request->validated('document_text'),
                numberOfCards: (int) $request->validated('number_of_cards'),
                cardTypes: $request->validated('card_types'),
            );

            return response()->json([
                'success' => true,
                'async' => true,
                'request_id' => $requestId,
            ], 202);
        }

        try {
            $flashcards = $this->generationService->generate(
                documentText: $request->validated('document_text'),
                numberOfCards: (int) $request->validated('number_of_cards'),
                cardTypes: $request->validated('card_types'),
            );
        } catch (RuntimeException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }

        return response()->json([
            'success' => true,
            'flashcards' => $flashcards,
            'count' => count($flashcards),
        ]);
    }
}
