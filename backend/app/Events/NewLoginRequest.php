<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * NewLoginRequest event.
 *
 * What: Fired when Platform B attempts login while Platform A is active.
 * Why:  Notifies Platform A in real-time so the user can approve or deny
 *       the incoming login attempt. ShouldBroadcastNow is used (not queued)
 *       because the requesting platform is actively waiting — any queue
 *       latency would degrade the UX and risk the 60s expiry window.
 *
 * Broadcast channel: private user.{userId}
 * Broadcast event name: .new.login.request
 */
class NewLoginRequest implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int    $userId,
        public readonly string $requestingPlatform,
        public readonly string $approvalToken,
        public readonly int    $expiresInSeconds,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->userId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'new.login.request';
    }

    public function broadcastWith(): array
    {
        return [
            'requesting_platform' => $this->requestingPlatform,
            'approval_token'      => $this->approvalToken,
            'expires_in'          => $this->expiresInSeconds,
            'message'             => "A new sign-in was attempted from {$this->requestingPlatform}. Is this you?",
        ];
    }
}