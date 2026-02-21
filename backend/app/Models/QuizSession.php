<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class QuizSession extends Model
{
    protected $fillable = ['user_id', 'category_id', 'score', 'total_questions', 'correct_answers', 'status'];
}