<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Leaderboard extends Model
{
    protected $fillable = ['user_id', 'total_score', 'quizzes_played', 'rank'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}