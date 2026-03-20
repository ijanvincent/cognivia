<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\User\DeckResource;
use App\Services\User\DeckService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeckController extends Controller
{
    public function __construct(
        private DeckService $deckService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $decks = $this->deckService->getDecks($request->user()->id);

        return response()->json([
            'decks' => DeckResource::collection($decks),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title'      => ['required', 'string', 'max:255'],
            'source'     => ['nullable', 'string', 'max:255'],
            'card_count' => ['required', 'integer', 'min:1'],
            'mastery'    => ['nullable', 'integer', 'min:0', 'max:100'],
            'progress'   => ['nullable', 'integer', 'min:0', 'max:100'],
            'status'     => ['nullable', 'string', 'max:50'],
        ]);

        $deck = $this->deckService->createDeck(
            $request->user()->id,
            $request->only(['title', 'source', 'card_count', 'mastery', 'progress', 'status'])
        );

        return response()->json([
            'message' => 'Deck created successfully.',
            'deck'    => new DeckResource($deck),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'mastery'  => ['nullable', 'integer', 'min:0', 'max:100'],
            'progress' => ['nullable', 'integer', 'min:0', 'max:100'],
            'status'   => ['nullable', 'string', 'max:50'],
        ]);

        $deck = $this->deckService->updateDeck(
            $id,
            $request->user()->id,
            $request->only(['mastery', 'progress', 'status'])
        );

        return response()->json([
            'message' => 'Deck updated successfully.',
            'deck'    => new DeckResource($deck),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->deckService->deleteDeck($id, $request->user()->id);

        return response()->json([
            'message' => 'Deck removed successfully.',
        ]);
    }
}