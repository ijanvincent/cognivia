<?php

namespace App\Services\User;

use App\Models\Deck;
use App\Repositories\User\DeckRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;
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
            'source'     => $data['source']    ?? null,
            'card_count' => $data['card_count'] ?? 0,
            'mastery'    => $data['mastery']    ?? 0,
            'progress'   => $data['progress']   ?? 0,
            'status'     => $data['status']     ?? 'New',
            'share_code' => $this->generateUniqueShareCode(),
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

    private function generateUniqueShareCode(): string
    {
        do {
            $code = 'FC-' . strtoupper(substr(bin2hex(random_bytes(6)), 0, 8));
        } while (Deck::where('share_code', $code)->exists());

        return $code;
    }

    public function importDeck(string $shareCode, int $importerId): Deck
    {
        // Find the original deck by share code
        $original = Deck::where('share_code', strtoupper($shareCode))->first();

        if (!$original) {
            throw ValidationException::withMessages([
                'share_code' => ['No deck found with that share code.'],
            ]);
        }

        // Prevent importing your own deck
        if ($original->user_id === $importerId) {
            throw ValidationException::withMessages([
                'share_code' => ['You cannot import your own deck.'],
            ]);
        }

        // Prevent duplicate imports — track by original deck's id
        $alreadyImported = Deck::where('user_id', $importerId)
            ->where('original_deck_id', $original->id)
            ->exists();

        if ($alreadyImported) {
            throw ValidationException::withMessages([
                'share_code' => ['You have already imported this deck.'],
            ]);
        }

        // Copy deck to importer — new share_code so they can re-share their copy
        $newDeck = $this->deckRepository->create([
            'user_id'          => $importerId,
            'title'            => $original->title,
            'source'           => $original->source,
            'card_count'       => $original->card_count,
            'mastery'          => 0,
            'progress'         => 0,
            'status'           => 'Imported',
            'share_code'       => $this->generateUniqueShareCode(),
            'original_deck_id' => $original->id,
        ]);

        // Copy all flashcards to the new deck
        $originalCards = $original->flashcards()->get();

        if ($originalCards->isNotEmpty()) {
            $now  = now()->toDateTimeString();
            $rows = $originalCards->map(fn($c) => [
                'deck_id'      => $newDeck->id,
                'user_id'      => $importerId,
                'type'         => $c->type,
                'question'     => $c->question,
                'answer'       => $c->answer,
                'options'      => is_array($c->options) ? json_encode($c->options) : $c->options,
                'explanation'  => $c->explanation,
                'mastered'     => false,
                'review_count' => 0,
                'created_at'   => $now,
                'updated_at'   => $now,
            ])->toArray();

            \Illuminate\Support\Facades\DB::table('flashcards')->insert($rows);
        }

        return $newDeck;
    }
}