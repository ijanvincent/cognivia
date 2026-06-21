<?php

namespace Tests\Feature;

use App\Events\FlashcardsGenerated;
use App\Events\FlashcardsGenerationFailed;
use App\Jobs\GenerateFlashcardsJob;
use App\Services\User\FlashcardGenerationService;
use Illuminate\Support\Facades\Event;
use Mockery;
use RuntimeException;
use Tests\TestCase;

/**
 * Covers the async generation job's contract: a successful generation must
 * broadcast FlashcardsGenerated to the requesting user with the correct
 * request_id, and any expected generation error must instead broadcast
 * FlashcardsGenerationFailed — so a client that received a 202 is never left
 * waiting forever.
 */
class GenerateFlashcardsJobTest extends TestCase
{
    private function makeJob(): GenerateFlashcardsJob
    {
        return new GenerateFlashcardsJob(
            userId: 7,
            requestId: 'req-abc',
            documentText: 'Some source material long enough to be valid.',
            numberOfCards: 3,
            cardTypes: ['identification'],
        );
    }

    public function test_successful_generation_broadcasts_generated_event(): void
    {
        Event::fake([FlashcardsGenerated::class, FlashcardsGenerationFailed::class]);

        $cards = [['id' => 'card_1', 'question' => 'Q', 'answer' => 'A', 'type' => 'identification']];

        $service = Mockery::mock(FlashcardGenerationService::class);
        $service->shouldReceive('generate')->once()->andReturn($cards);

        $this->makeJob()->handle($service);

        Event::assertDispatched(
            FlashcardsGenerated::class,
            fn (FlashcardsGenerated $e) => $e->userId === 7
                && $e->requestId === 'req-abc'
                && $e->flashcards === $cards,
        );
        Event::assertNotDispatched(FlashcardsGenerationFailed::class);
    }

    public function test_generation_error_broadcasts_failed_event(): void
    {
        Event::fake([FlashcardsGenerated::class, FlashcardsGenerationFailed::class]);

        $service = Mockery::mock(FlashcardGenerationService::class);
        $service->shouldReceive('generate')->once()->andThrow(new RuntimeException('AI quota exceeded. Please try again later.'));

        $this->makeJob()->handle($service);

        Event::assertDispatched(
            FlashcardsGenerationFailed::class,
            fn (FlashcardsGenerationFailed $e) => $e->userId === 7
                && $e->requestId === 'req-abc'
                && $e->message === 'AI quota exceeded. Please try again later.',
        );
        Event::assertNotDispatched(FlashcardsGenerated::class);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
