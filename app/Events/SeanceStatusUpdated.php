<?php

namespace App\Events;

use App\Models\Seance;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;

class SeanceStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public function __construct(public Seance $seance)
    {
    }
    
    public function broadcastOn(): array
    {
        // Broadcast on the public seance channel for all to hear
        return [new PrivateChannel('seance.' . $this->seance->id)];
    }
}
