<?php

namespace App\Models;
use App\Models\User;
use App\Models\Cour; // Add this line

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    protected $fillable = [
        'user_id',
        'course_id', // Add this line
        'code',
        'image',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course() // Add this function
    {
        return $this->belongsTo(Cour::class);
    }
}
