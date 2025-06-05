<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cour extends Model
{
    /** @use HasFactory<\Database\Factories\CourFactory> */
    use HasFactory;

    protected $guarded = [];

    public function formations()
    {
        return $this->belongsToMany(Formation::class);
    }

    public function camps()
    {
        return $this->hasMany(Camp::class);
    }
}
