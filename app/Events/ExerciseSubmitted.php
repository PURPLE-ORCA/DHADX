<?php
namespace App\Events;

use App\Models\ExerciseSubmission;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;

class ExerciseSubmitted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public ExerciseSubmission $submission,
        public int $mentorId
    )
    {
    }

    public function broadcastOn(): array
    {
        // Instead of broadcasting to the seance channel,
        // we broadcast to the mentor's personal, private channel.
        return [new PrivateChannel('App.Models.User.' . $this->mentorId)];
    }
}
