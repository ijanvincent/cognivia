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
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}