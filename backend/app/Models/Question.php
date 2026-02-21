<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['category_id', 'question', 'difficulty', 'points'];

    public function choices()
    {
        return $this->hasMany(Choice::class);
    }
}