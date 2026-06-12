<?php

declare(strict_types=1);

namespace App\Services;

use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\SignatureInvalidException;
use RuntimeException;

class JwtService
{
    private const ALGO = 'HS256';

    private string $secret;

    public function __construct()
    {
        $this->secret = config('services.jwt.secret');

        if (empty($this->secret)) {
            throw new RuntimeException('JWT_SECRET is not configured.');
        }
    }

    /**
     * Issue a signed HS256 JWT tied to a Sanctum token row.
     *
     * The JTI is the personal_access_tokens.id — used to look up the row
     * on each request without storing the full token in the DB.
     */
    public function sign(int $tokenId, int $userId, ?string $platform, \DateTimeInterface $expiresAt): string
    {
        $payload = [
            'iss' => config('app.url'),
            'sub' => (string) $userId,
            'jti' => (string) $tokenId,
            'iat' => time(),
            'exp' => $expiresAt->getTimestamp(),
        ];

        if ($platform !== null) {
            $payload['plt'] = $platform;
        }

        return JWT::encode($payload, $this->secret, self::ALGO);
    }

    /**
     * Verify a JWT and return the decoded claims as an array.
     *
     * @throws ExpiredException
     * @throws SignatureInvalidException
     * @throws \UnexpectedValueException
     */
    public function verify(string $token): array
    {
        $decoded = (array) JWT::decode($token, new Key($this->secret, self::ALGO));

        if (($decoded['iss'] ?? null) !== config('app.url')) {
            throw new \UnexpectedValueException('Token issuer mismatch.');
        }

        return $decoded;
    }
}
