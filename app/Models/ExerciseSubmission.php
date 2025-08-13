<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExerciseSubmission extends Model
{
    use HasFactory; 
    protected $guarded = [];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function exercise() {
        return $this->belongsTo(SeanceExercise::class, 'seance_exercise_id');
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
