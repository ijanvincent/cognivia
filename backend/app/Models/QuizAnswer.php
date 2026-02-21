<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class QuizAnswer extends Model
{
    protected $fillable = ['quiz_session_id', 'question_id', 'choice_id', 'is_correct'];
}