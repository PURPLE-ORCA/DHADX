<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Camp extends Model
{
    /** @use HasFactory<\Database\Factories\CampFactory> */
    use HasFactory;

    protected $guarded = [];

    public function collaborator()
    {
        return $this->belongsTo(Collaborator::class);
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
