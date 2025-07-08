<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Whiteboard extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'is_public',
        'scene_data',
    ];

    protected $casts = [
        'scene_data' => 'array', // Automatically cast JSON to/from array
        'is_public' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
