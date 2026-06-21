<?php

namespace Tests\Feature;

use App\Services\User\FlashcardGenerationService;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * Guards the output-token budget: max_tokens must scale with the requested card
 * count rather than using a flat ceiling. The flat 8192 was rejected by
 * OpenRouter with a 402 when the credit balance couldn't "afford" it, so these
 * tests pin the request to a size a low/free balance can satisfy.
 */
class FlashcardGenerationServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.openrouter.api_key' => 'test-key',
            'services.openrouter.model' => 'test-model',
            'services.openrouter.base_url' => 'https://openrouter.ai/api/v1',
        ]);
    }

    private function fakeSuccessfulGeneration(): void
    {
        Http::fake([
            'openrouter.ai/*' => Http::response([
                'choices' => [[
                    'message' => [
                        'content' => json_encode([
                            ['question' => 'Q', 'answer' => 'A', 'type' => 'identification'],
                        ]),
                    ],
                ]],
            ], 200),
        ]);
    }

    public function test_max_tokens_scales_with_card_count_and_stays_below_the_old_flat_ceiling(): void
    {
        $this->fakeSuccessfulGeneration();

        (new FlashcardGenerationService)->generate('Document text long enough to be valid.', 3, ['identification']);

        Http::assertSent(function ($request) {
            return str_contains($request->url(), '/chat/completions')
                && $request['max_tokens'] === (256 + 320 * 3) // 1216
                && $request['max_tokens'] < 8192;
        });
    }

    public function test_default_twenty_card_request_fits_within_the_free_tier_allowance(): void
    {
        $this->fakeSuccessfulGeneration();

        (new FlashcardGenerationService)->generate('Document text long enough to be valid.', 20, ['mixed']);

        // 256 + 320*20 = 6656, comfortably under the observed ~7707 free ceiling.
        Http::assertSent(fn ($request) => $request['max_tokens'] === 6656);
    }

    public function test_minimum_floor_applies_for_a_single_card(): void
    {
        $this->fakeSuccessfulGeneration();

        (new FlashcardGenerationService)->generate('Document text long enough to be valid.', 1, ['identification']);

        // max(1024, 256 + 320*1) = 1024
        Http::assertSent(fn ($request) => $request['max_tokens'] === 1024);
    }
}
