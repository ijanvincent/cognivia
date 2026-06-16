<?php

namespace Tests\Feature;

use App\Mail\Transport\GmailApiTransport;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Symfony\Component\Mime\Email;
use Tests\TestCase;

/**
 * Guards the security contract of the Gmail API transport's token cache:
 * the short-lived access token must be stored encrypted (the production cache
 * store is the shared database), a tampered entry must be treated as a miss,
 * and a valid entry must be reused without an extra OAuth round-trip.
 */
class GmailApiTransportTest extends TestCase
{
    private const CACHE_KEY = 'gmail_api_access_token';

    private const ACCESS_TOKEN = 'ya29.fake-access-token';

    protected function setUp(): void
    {
        parent::setUp();

        Cache::forget(self::CACHE_KEY);

        Http::fake([
            'oauth2.googleapis.com/token' => Http::response(['access_token' => self::ACCESS_TOKEN], 200),
            'gmail.googleapis.com/*' => Http::response(['id' => 'sent-message-id'], 200),
        ]);
    }

    private function sendOnce(): void
    {
        $transport = new GmailApiTransport('client-id', 'client-secret', 'refresh-token');

        $email = (new Email)
            ->from('sender@example.com')
            ->to('recipient@example.com')
            ->subject('Test')
            ->text('Body');

        $transport->send($email);
    }

    private function tokenEndpointCallCount(): int
    {
        return collect(Http::recorded())
            ->filter(fn (array $pair): bool => str_contains($pair[0]->url(), 'oauth2.googleapis.com/token'))
            ->count();
    }

    public function test_cached_access_token_is_encrypted_not_plaintext(): void
    {
        $this->sendOnce();

        $stored = Cache::get(self::CACHE_KEY);

        $this->assertIsString($stored);
        $this->assertNotSame(self::ACCESS_TOKEN, $stored, 'Token must not be cached in plaintext.');
        $this->assertSame(self::ACCESS_TOKEN, Crypt::decryptString($stored), 'Cached value must decrypt to the token.');
    }

    public function test_valid_cached_token_is_reused_without_refreshing(): void
    {
        $this->sendOnce();
        $this->sendOnce();

        $this->assertSame(1, $this->tokenEndpointCallCount(), 'A valid cached token must not trigger a second OAuth refresh.');
    }

    public function test_corrupt_cache_entry_forces_a_refresh(): void
    {
        Cache::put(self::CACHE_KEY, 'not-a-valid-ciphertext', now()->addMinutes(50));

        $this->sendOnce();

        $this->assertSame(1, $this->tokenEndpointCallCount(), 'An undecryptable entry must be treated as a miss and refreshed.');
        $this->assertSame(self::ACCESS_TOKEN, Crypt::decryptString(Cache::get(self::CACHE_KEY)), 'The refreshed token must be re-stored encrypted.');
    }
}
