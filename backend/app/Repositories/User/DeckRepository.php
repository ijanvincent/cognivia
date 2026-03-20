<?php

namespace App\Repositories\User;

use App\Models\Deck;
use Illuminate\Database\Eloquent\Collection;

class DeckRepository
{
    public function getAllByUser(int $userId): Collection
    {
        return Deck::where('user_id', $userId)
                   ->orderBy('created_at', 'desc')
                   ->get();
    }

    public function findByIdAndUser(int $id, int $userId): ?Deck
    {
        return Deck::where('id', $id)
                   ->where('user_id', $userId)
                   ->first();
    }

    public function create(array $data): Deck
    {
        return Deck::create($data);
    }

    public function update(Deck $deck, array $data): Deck
    {
        $deck->update($data);
        return $deck->fresh();
    }

    public function delete(Deck $deck): void
    {
        $deck->delete();
    }
}