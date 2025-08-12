<?php

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Broadcast;
use App\Models\Seance;
use App\Models\User;
use Illuminate\Support\Facades\DB;

// --- ADD THIS MISSING BLOCK ---
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    // This ensures a user can only listen to their own private channel.
    return (int) $user->id === (int) $id;
});
// -----------------------------

// Your existing, correct seance channel authorization
Broadcast::channel('seance.{seanceId}', function ($user, $seanceId) {
    Log::info('--- BROADCAST AUTH CHECK for seance.{seanceId} ---');
    Log::info('Checking auth for user:', $user->toArray());
    Log::info('For Seance ID: ' . $seanceId);

    $seance = Seance::find($seanceId);
    if (!$seance) {
        Log::warning('Seance not found.');
        return false;
    }
    Log::info('Seance found. Mentor ID: ' . $seance->mentor_id);

    if ($user->id === $seance->mentor_id) {
        Log::info('User is the mentor. AUTHORIZED.');
        return true;
    }

    if ($user->hasRole('collaborator')) {
        Log::info('User has collaborator role. User ID: ' . $user->id);
        $isAttendee = DB::table('seance_attendances')
                        ->where('seance_id', $seanceId)
                        ->where('user_id', $user->id) // Changed from collaborator_id
                        ->exists();

        if ($isAttendee) {
            Log::info('User is an attendee. AUTHORIZED.');
            return true;
        } else {
            Log::warning('User is NOT an attendee.');
        }
    } else {
        Log::warning('User does not have collaborator role.');
    }

    Log::error('Authorization failed for User ID: ' . $user->id);
    return false;
});