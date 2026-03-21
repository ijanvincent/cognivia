<?php

namespace App\Repositories\User;

use App\Models\Flashcard;
use Illuminate\Database\Eloquent\Collection;

class FlashcardRepository
{
    public function getByDeckAndUser(int $deckId, int $userId): Collection
    {
        return Flashcard::where('deck_id', $deckId)
                        ->where('user_id', $userId)
                        ->orderBy('created_at', 'asc')
                        ->get();
    }

    public function createMany(array $flashcards): void
    {
        Flashcard::insert($flashcards);
    }

    public function deleteByDeck(int $deckId, int $userId): void
    {
        Flashcard::where('deck_id', $deckId)
                 ->where('user_id', $userId)
                 ->delete();
    }
}