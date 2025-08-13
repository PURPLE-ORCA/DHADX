<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Notifications\Notifiable;
use App\Models\Task;
use App\Models\TaskComment;
use App\Models\Whiteboard;
use App\Models\Seance;
use App\Models\ExerciseSubmission;
use App\Models\Speciality;
use App\Models\Camp;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    public function mentoredSeances()
    {
        return $this->hasMany(Seance::class, 'mentor_id');
    }

    public function hasRole(string $roleName): bool
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    public function hasAnyRoles(array $roleNames): bool
    {
        return $this->roles()->whereIn('name', $roleNames)->exists();
    }


    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'assignee_id')->orderBy('due_date', 'asc');
    }

    public function createdTasks()
    {
        return $this->hasMany(Task::class, 'assigner_id')->orderBy('created_at', 'desc');
    }

    public function taskComments()
    {
        return $this->hasMany(TaskComment::class);
    }

    public function whiteboards()
    {
        return $this->hasMany(Whiteboard::class);
    }

    public function seanceAttendance()
    {
        return $this->belongsToMany(Seance::class, 'seance_attendances')->withPivot('status', 'checked_in_at')->withTimestamps();
    }

    public function exerciseSubmissions()
    {
        return $this->hasMany(ExerciseSubmission::class);
    }

    public function specialities()
    {
        return $this->belongsToMany(Speciality::class, 'user_speciality');
    }

    public function camps()
    {
        return $this->hasMany(Camp::class);
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'birth_date',
        'cin',
        'gender',
        'image',
        'phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
