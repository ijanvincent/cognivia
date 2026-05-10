<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * LoginDenied event.
 *
 * What: Fired when Platform A denies the pending login, or when the
 *       60-second approval window expires without a response.
 * Why:  Platform B must be notified in real-time so it can stop waiting
 *       and show the user a clear rejection message rather than hanging
 *       indefinitely or timing out silently.
 *
 * Broadcast channel: private user.{userId}
 * Broadcast event name: .login.denied
 */
class LoginDenied implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int    $userId,
        public readonly string $reason,
        public readonly string $deniedPlatform,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->userId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'login.denied';
    }

    public function broadcastWith(): array
    {
        return [
            'reason'   => $this->reason,
            'platform' => $this->deniedPlatform,
        ];
    }
}