<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ForceLogout implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $platform;
    public int    $userId;

    /**
     * CHANGED — what: accepts $userId explicitly as a parameter.
     * why: by the time broadcastOn() is called by the framework, the token
     * may already be deleted in some edge cases. Passing userId in the
     * constructor makes the channel binding reliable regardless of token state.
     */
    public function __construct(string $platform, int $userId)
    {
        $this->platform = $platform;
        $this->userId   = $userId;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->userId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'force.logout';
    }

    public function broadcastWith(): array
    {
        return [
            'platform' => $this->platform,
            'message'  => 'You have been logged out because your account signed in on another platform.',
        ];
    }
}