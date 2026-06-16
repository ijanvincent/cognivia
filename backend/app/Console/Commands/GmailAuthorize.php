<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

/**
 * One-time helper to obtain a Gmail API refresh token for the mail transport.
 *
 * Usage:
 *   1. Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET in .env (from the Google
 *      Cloud OAuth client).
 *   2. Run `php artisan gmail:authorize`, open the printed URL, approve access.
 *   3. Copy the `code` from the http://localhost/?code=... redirect and run
 *      `php artisan gmail:authorize --code=THE_CODE`.
 *   4. Store the printed GMAIL_REFRESH_TOKEN as an environment variable.
 *
 * The loopback redirect (http://localhost) is used because Google removed the
 * out-of-band (OOB) flow; the redirected page failing to load is expected — only
 * the `code` query parameter is needed.
 */
class GmailAuthorize extends Command
{
    protected $signature = 'gmail:authorize {--code= : The authorization code from the redirect URL}';

    protected $description = 'Obtain a Gmail API refresh token for sending application email';

    private const SCOPE = 'https://www.googleapis.com/auth/gmail.send';

    private const REDIRECT_URI = 'http://localhost';

    private const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';

    private const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

    public function handle(): int
    {
        $clientId = (string) config('services.gmail.client_id');
        $clientSecret = (string) config('services.gmail.client_secret');

        if ($clientId === '' || $clientSecret === '') {
            $this->error('Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET in .env first.');

            return self::FAILURE;
        }

        $code = $this->option('code');

        if (! $code) {
            $this->printAuthorizationInstructions($clientId);

            return self::SUCCESS;
        }

        return $this->exchangeCode($clientId, $clientSecret, (string) $code);
    }

    private function printAuthorizationInstructions(string $clientId): void
    {
        $url = self::AUTH_ENDPOINT.'?'.http_build_query([
            'client_id' => $clientId,
            'redirect_uri' => self::REDIRECT_URI,
            'response_type' => 'code',
            'scope' => self::SCOPE,
            'access_type' => 'offline', // request a refresh token
            'prompt' => 'consent',      // force a refresh token even on re-auth
        ]);

        $this->info('1) Open this URL in your browser and approve access:');
        $this->newLine();
        $this->line($url);
        $this->newLine();
        $this->info('2) Google redirects to http://localhost/?code=...  (the page will not load — that is expected).');
        $this->info('3) Copy the value of "code" from the address bar, then run:');
        $this->newLine();
        $this->line('   php artisan gmail:authorize --code=PASTE_CODE_HERE');
    }

    private function exchangeCode(string $clientId, string $clientSecret, string $code): int
    {
        $response = Http::asForm()->post(self::TOKEN_ENDPOINT, [
            'code' => $code,
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'redirect_uri' => self::REDIRECT_URI,
            'grant_type' => 'authorization_code',
        ]);

        $refreshToken = $response->json('refresh_token');

        if ($response->failed() || ! is_string($refreshToken)) {
            $this->error('Token exchange failed ('.$response->status().'):');
            $this->line($response->body());
            $this->newLine();
            $this->warn('No refresh_token? Revoke prior access at https://myaccount.google.com/permissions and retry — the URL already forces prompt=consent.');

            return self::FAILURE;
        }

        $this->newLine();
        $this->info('Success. Store this as the GMAIL_REFRESH_TOKEN environment variable:');
        $this->newLine();
        $this->line('GMAIL_REFRESH_TOKEN='.$refreshToken);
        $this->newLine();

        return self::SUCCESS;
    }
}
