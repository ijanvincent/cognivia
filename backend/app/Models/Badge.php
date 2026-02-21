<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    protected $fillable = ['user_id', 'name', 'description', 'icon'];
}