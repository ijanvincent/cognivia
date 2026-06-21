<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * FlashcardsGenerated event.
 *
 * What: Fired by GenerateFlashcardsJob when async generation succeeds.
 * Why:  The requesting client received a 202 + request_id and is listening on
 *       its private user.{id} channel for the result. The request_id lets the
 *       client correlate this payload with the generation it kicked off.
 *
 * Broadcast channel: private user.{userId}
 * Broadcast event name: .flashcards.generated
 */
class FlashcardsGenerated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @param  array<int, array<string, mixed>>  $flashcards
     */
    public function __construct(
        public readonly int $userId,
        public readonly string $requestId,
        public readonly array $flashcards,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.'.$this->userId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'flashcards.generated';
    }

    public function broadcastWith(): array
    {
        return [
            'request_id' => $this->requestId,
            'flashcards' => $this->flashcards,
            'count' => count($this->flashcards),
        ];
    }
}
