<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Events\FlashcardsGenerated;
use App\Events\FlashcardsGenerationFailed;
use App\Services\User\FlashcardGenerationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use RuntimeException;
use Throwable;

/**
 * Runs flashcard generation off the web request when async mode is enabled
 * (config flashcards.async). Broadcasts the result — or the failure — to the
 * requesting user's private channel.
 */
class GenerateFlashcardsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Generation is expensive and non-idempotent (each attempt spends AI
     * quota), so never auto-retry — a failure is reported to the user instead.
     */
    public int $tries = 1;

    /**
     * Must exceed the service's own 120s OpenRouter timeout so the worker does
     * not kill a generation that is still legitimately in flight.
     */
    public int $timeout = 150;

    /**
     * @param  string[]  $cardTypes
     */
    public function __construct(
        public readonly int $userId,
        public readonly string $requestId,
        public readonly string $documentText,
        public readonly int $numberOfCards,
        public readonly array $cardTypes,
    ) {}

    public function handle(FlashcardGenerationService $generationService): void
    {
        try {
            $flashcards = $generationService->generate(
                documentText: $this->documentText,
                numberOfCards: $this->numberOfCards,
                cardTypes: $this->cardTypes,
            );
        } catch (RuntimeException $e) {
            // Expected, user-facing generation errors (quota, bad AI output…).
            FlashcardsGenerationFailed::dispatch($this->userId, $this->requestId, $e->getMessage());

            return;
        }

        FlashcardsGenerated::dispatch($this->userId, $this->requestId, $flashcards);
    }

    /**
     * Last-resort notification if the job fails for an unexpected reason
     * (timeout, fatal error) so the waiting client is never left hanging.
     */
    public function failed(?Throwable $exception): void
    {
        FlashcardsGenerationFailed::dispatch(
            $this->userId,
            $this->requestId,
            'Flashcard generation failed unexpectedly. Please try again.',
        );
    }
}
