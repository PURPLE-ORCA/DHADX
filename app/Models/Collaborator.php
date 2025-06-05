<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collaborator extends Model
{
    /** @use HasFactory<\Database\Factories\CollaboratorFactory> */
    use HasFactory;

    protected $fillable = ['name'];

    public function specialities()
    {
        return $this->belongsToMany(Speciality::class);
    }

    public function camps()
    {
        return $this->hasMany(Camp::class);
    }
}
