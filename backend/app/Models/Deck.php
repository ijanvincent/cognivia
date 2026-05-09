<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Deck extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'source',
        'card_count',
        'mastery',
        'progress',
        'status',
        'share_code',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function flashcards()
    {
        return $this->hasMany(Flashcard::class);
    }
}