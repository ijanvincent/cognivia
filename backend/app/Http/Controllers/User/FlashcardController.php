<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\User\FlashcardResource;
use App\Services\User\FlashcardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FlashcardController extends Controller
{
    public function __construct(
        private FlashcardService $flashcardService
    ) {}

    public function index(Request $request, int $deckId): JsonResponse
    {
        $flashcards = $this->flashcardService->getFlashcards(
            $deckId,
            $request->user()->id
        );

        return response()->json([
            'flashcards' => FlashcardResource::collection($flashcards),
        ]);
    }

    public function store(Request $request, int $deckId): JsonResponse
    {
        $request->validate([
            'flashcards'              => ['required', 'array', 'min:1'],
            'flashcards.*.question'   => ['required', 'string', 'max:1000'],
            'flashcards.*.answer'     => ['required', 'string', 'max:2000'],
        ]);

        $this->flashcardService->saveFlashcards(
            $deckId,
            $request->user()->id,
            $request->flashcards
        );

        return response()->json([
            'message' => 'Flashcards saved successfully.',
        ], 201);
    }
}