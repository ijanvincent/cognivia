<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'username'   => $this->username,
            'email'      => $this->email,
            'avatar'     => $this->avatar,
            'created_at' => $this->created_at,
            'deleted_at' => $this->deleted_at,
            'decks_count'      => $this->decks_count ?? 0,
            'flashcards_count' => $this->flashcards_count ?? 0,
            'last_active_at'   => $this->last_active_at,
        ];
    }
}