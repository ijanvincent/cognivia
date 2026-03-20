<?php

namespace App\Services\User;

use App\Models\Deck;
use App\Repositories\User\DeckRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class DeckService
{
    public function __construct(
        private DeckRepository $deckRepository
    ) {}

    public function getDecks(int $userId): Collection
    {
        return $this->deckRepository->getAllByUser($userId);
    }

    public function createDeck(int $userId, array $data): Deck
    {
        return $this->deckRepository->create([
            'user_id'    => $userId,
            'title'      => $data['title'],
            'source'     => $data['source']     ?? null,
            'card_count' => $data['card_count']  ?? 0,
            'mastery'    => $data['mastery']     ?? 0,
            'progress'   => $data['progress']    ?? 0,
            'status'     => $data['status']      ?? 'New',
        ]);
    }

    public function updateDeck(int $id, int $userId, array $data): Deck
    {
        $deck = $this->deckRepository->findByIdAndUser($id, $userId);

        if (!$deck) {
            throw ValidationException::withMessages([
                'deck' => ['Deck not found or access denied.'],
            ]);
        }

        return $this->deckRepository->update($deck, $data);
    }

    public function deleteDeck(int $id, int $userId): void
    {
        $deck = $this->deckRepository->findByIdAndUser($id, $userId);

        if (!$deck) {
            throw ValidationException::withMessages([
                'deck' => ['Deck not found or access denied.'],
            ]);
        }

        $this->deckRepository->delete($deck);
    }
}