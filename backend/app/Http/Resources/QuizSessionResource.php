<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
class QuizSessionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'score' => $this->score,
            'total_questions' => $this->total_questions,
            'correct_answers' => $this->correct_answers,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}