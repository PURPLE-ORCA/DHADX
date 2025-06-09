<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\TaskComment;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'assignee_id',
        'assigner_id',
        'due_date',
        'status',
        'priority',
        'completed_at',
        'submitted_at',
    ];

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function assigner()
    {
        return $this->belongsTo(User::class, 'assigner_id');
    }

    public function comments()
    {
        return $this->hasMany(TaskComment::class)->orderBy('created_at', 'asc');
    }
}
