<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * LoginApproved event.
 *
 * What: Fired when Platform A approves the pending login from Platform B.
 * Why:  Platform B is polling/listening on its private channel waiting for
 *       this event. The event is only a realtime wake-up signal; the actual
 *       session token is issued through the HTTPS status endpoint.
 *
 * Broadcast channel: private user.{userId}
 * Broadcast event name: .login.approved
 */
class LoginApproved implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int    $userId,
        public readonly string $approvedPlatform,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->userId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'login.approved';
    }

    public function broadcastWith(): array
    {
        return [
            'status'   => 'approved',
            'platform' => $this->approvedPlatform,
        ];
    }
}
