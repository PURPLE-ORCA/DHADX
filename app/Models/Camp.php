<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Camp extends Model
{
    /** @use HasFactory<\Database\Factories\CampFactory> */
    use HasFactory;

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cour()
    {
        return $this->belongsTo(Cour::class);
    }

    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }
}
