<?php

namespace App\Policies;

use App\Models\Seance;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SeancePolicy
{
    /**
     * Determine whether the user can start a presence check for the model.
     */
    public function startPresenceCheck(User $user, Seance $seance): bool
    {
        // Only the assigned mentor for this specific seance can start a check.
        return $user->id === $seance->mentor_id;
    }

    public function update(User $user, Seance $seance): bool
    {
        return $user->id === $seance->mentor_id;
    }
}
