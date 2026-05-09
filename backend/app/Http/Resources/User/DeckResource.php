<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeckResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'user_id'    => $this->user_id,
            'title'      => $this->title,
            'source'     => $this->source,
            'card_count' => $this->card_count,
            'mastery'    => $this->mastery,
            'progress'   => $this->progress,
            'status'     => $this->status,
            'share_code' => $this->share_code,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}