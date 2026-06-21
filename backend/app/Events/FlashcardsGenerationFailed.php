<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * FlashcardsGenerationFailed event.
 *
 * What: Fired by GenerateFlashcardsJob when async generation fails.
 * Why:  Without it the client that received a 202 would wait forever. The
 *       message mirrors what the synchronous path returns in its 422 body, so
 *       the client can surface the same error text in either mode.
 *
 * Broadcast channel: private user.{userId}
 * Broadcast event name: .flashcards.generation-failed
 */
class FlashcardsGenerationFailed implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int $userId,
        public readonly string $requestId,
        public readonly string $message,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.'.$this->userId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'flashcards.generation-failed';
    }

    public function broadcastWith(): array
    {
        return [
            'request_id' => $this->requestId,
            'message' => $this->message,
        ];
    }
}
