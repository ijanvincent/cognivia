<?php

namespace App\Services\User;

use App\Models\Deck;
use App\Repositories\User\FlashcardRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class FlashcardService
{
    public function __construct(
        private FlashcardRepository $flashcardRepository
    ) {}

    public function getFlashcards(int $deckId, int $userId): Collection
    {

        $deck = Deck::where('id', $deckId)
                    ->where('user_id', $userId)
                    ->first();

        if (!$deck) {
            throw ValidationException::withMessages([
                'deck' => ['Deck not found or access denied.'],
            ]);
        }

        return $this->flashcardRepository->getByDeckAndUser($deckId, $userId);
    }

    public function saveFlashcards(int $deckId, int $userId, array $cards): void
    {
      
        $deck = Deck::where('id', $deckId)
                    ->where('user_id', $userId)
                    ->first();

        if (!$deck) {
            throw ValidationException::withMessages([
                'deck' => ['Deck not found or access denied.'],
            ]);
        }

        $this->flashcardRepository->deleteByDeck($deckId, $userId);

        $now = now()->toDateTimeString();

        $flashcards = array_map(fn($card) => [
            'deck_id'      => $deckId,
            'user_id'      => $userId,
            'question'     => $card['question'],
            'answer'       => $card['answer'],
            'mastered'     => false,
            'review_count' => 0,
            'created_at'   => $now,
            'updated_at'   => $now,
        ], $cards);

        $this->flashcardRepository->createMany($flashcards);

   
        $deck->update(['card_count' => count($flashcards)]);
    }
}