<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserHandStateChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $seanceId,
        public User $user,
        public bool $isRaised // True if they raised, false if they lowered
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('seance.' . $this->seanceId)];
    }
}
