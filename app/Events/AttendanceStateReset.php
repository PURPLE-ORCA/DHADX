<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Support\Collection;

class AttendanceStateReset implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $seanceId, 
        public array $attendees // <-- CHANGE THIS TO `array`
    )
    {
    }

    public function broadcastOn(): array
    {
        // We only need to tell the mentor about this reset.
        // We can get the mentor's ID from the first attendee's seance relationship,
        // but it's cleaner to just send it to the main seance channel
        // since the mentor is already listening there.
        return [new PrivateChannel('seance.' . $this->seanceId)];
    }
}
