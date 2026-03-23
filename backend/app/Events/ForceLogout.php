<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ForceLogout implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $platform;

    public function __construct(string $platform)
    {
        // The platform being logged OUT (the other one)
        $this->platform = $platform;
    }

    // Broadcast on the user's private channel
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . auth()->id()),
        ];
    }

    // Event name the frontend listens for
    public function broadcastAs(): string
    {
        return 'force.logout';
    }

    // Data sent to the client
    public function broadcastWith(): array
    {
        return [
            'platform' => $this->platform,
            'message'  => 'You have been logged out because your account signed in on another platform.',
        ];
    }
}