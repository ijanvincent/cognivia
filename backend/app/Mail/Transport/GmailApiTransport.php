<?php

namespace App\Mail\Transport;

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;

/**
 * Sends mail through the Gmail API over HTTPS (port 443) instead of SMTP.
 *
 * Why this exists: Render's free tier blocks outbound SMTP ports (25/465/587),
 * so Gmail's SMTP server is unreachable from production. A relay like Brevo can
 * use port 2525, but it is not authorized to send "From" an @gmail.com address
 * (gmail.com's SPF only authorizes Google), so those messages are dropped. The
 * Gmail API lets Google itself send as the authenticated account over HTTPS —
 * fully SPF/DKIM/DMARC-aligned and not subject to the SMTP port block — which is
 * the only free, no-custom-domain way to reliably deliver to real inboxes.
 *
 * Auth is OAuth2: a long-lived refresh token (obtained once via the
 * `gmail:authorize` command) is exchanged for short-lived access tokens, which
 * are cached just under their lifetime to avoid a token round-trip per email.
 */
class GmailApiTransport extends AbstractTransport
{
    private const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

    private const SEND_ENDPOINT = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

    private const ACCESS_TOKEN_CACHE_KEY = 'gmail_api_access_token';

    public function __construct(
        private readonly string $clientId,
        private readonly string $clientSecret,
        private readonly string $refreshToken,
    ) {
        parent::__construct();
    }

    protected function doSend(SentMessage $message): void
    {
        // Gmail's send endpoint takes the full RFC 2822 message, base64url-encoded.
        $encoded = rtrim(strtr(base64_encode($message->toString()), '+/', '-_'), '=');

        $response = Http::withToken($this->accessToken())
            ->acceptJson()
            ->post(self::SEND_ENDPOINT, ['raw' => $encoded]);

        if ($response->failed()) {
            // AuthService wraps Mail::send in try/catch and logs the message, so a
            // descriptive exception here surfaces the real cause in the logs.
            throw new RuntimeException(
                'Gmail API send failed ('.$response->status().'): '.$response->body()
            );
        }
    }

    /**
     * Exchange the refresh token for an access token, cached just under its
     * ~1h lifetime so we don't hit the token endpoint on every send.
     *
     * The cached value is encrypted with APP_KEY: the cache store is the shared
     * database in production, so a DB/cache read alone must not yield a usable
     * `gmail.send` bearer token. A tampered or undecryptable entry is treated as
     * a miss and transparently refreshed.
     */
    private function accessToken(): string
    {
        $cached = Cache::get(self::ACCESS_TOKEN_CACHE_KEY);

        if (is_string($cached)) {
            try {
                return Crypt::decryptString($cached);
            } catch (DecryptException) {
                // Fall through to a fresh refresh below.
            }
        }

        $token = $this->refreshAccessToken();

        Cache::put(self::ACCESS_TOKEN_CACHE_KEY, Crypt::encryptString($token), now()->addMinutes(50));

        return $token;
    }

    /**
     * Trade the long-lived refresh token for a short-lived access token.
     */
    private function refreshAccessToken(): string
    {
        $response = Http::asForm()->post(self::TOKEN_ENDPOINT, [
            'grant_type' => 'refresh_token',
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'refresh_token' => $this->refreshToken,
        ]);

        $token = $response->json('access_token');

        if ($response->failed() || ! is_string($token)) {
            throw new RuntimeException(
                'Gmail OAuth token refresh failed ('.$response->status().'): '.$response->body()
            );
        }

        return $token;
    }

    public function __toString(): string
    {
        return 'gmail+api://gmail.googleapis.com';
    }
}
