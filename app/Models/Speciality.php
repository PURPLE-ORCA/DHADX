<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Speciality extends Model
{
    /** @use HasFactory<\Database\Factories\SpecialityFactory> */
    use HasFactory;

    protected $guarded = [];

    public function collaborators()
    {
        return $this->belongsToMany(Collaborator::class);
    }
}
