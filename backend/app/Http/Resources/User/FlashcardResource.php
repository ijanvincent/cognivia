<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FlashcardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'deck_id'      => $this->deck_id,
            'question'     => $this->question,
            'answer'       => $this->answer,
            'mastered'     => $this->mastered,
            'review_count' => $this->review_count,
            'created_at'   => $this->created_at,
            'updated_at'   => $this->updated_at,
        ];
    }
}