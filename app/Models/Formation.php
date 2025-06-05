<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    /** @use HasFactory<\Database\Factories\FormationFactory> */
    use HasFactory;

    protected $guarded = [];

    public function cours()
    {
        return $this->belongsToMany(Cour::class);
    }

    public function camps()
    {
        return $this->hasMany(Camp::class);
    }
}
