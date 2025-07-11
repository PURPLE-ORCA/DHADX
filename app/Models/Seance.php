<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seance extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
    ];

    public function course() {
        return $this->belongsTo(Cour::class, 'course_id');
    }

    public function mentor() {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function exercises() {
        return $this->hasMany(SeanceExercise::class);
    }

    // Defines the many-to-many relationship for attendance
    public function attendees() {
        return $this->belongsToMany(Collaborator::class, 'seance_attendances')->withPivot('status', 'checked_in_at')->withTimestamps();
    }
}
