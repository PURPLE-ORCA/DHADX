<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeanceExercise extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function seance() {
        return $this->belongsTo(Seance::class);
    }

    public function submissions() {
        return $this->hasMany(ExerciseSubmission::class);
    }
}
