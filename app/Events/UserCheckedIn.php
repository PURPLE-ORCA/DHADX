<?php
namespace App\Events;

use App\Models\User; // Import the User model
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserCheckedIn implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    // Public properties will be automatically included in the broadcast payload
    public function __construct(
        public int $seanceId,
        public User $user // Send the whole user object
    )
    {
    }

    public function broadcastOn(): array
    {
        return [new PrivateChannel('seance.' . $this->seanceId)];
    }
}
