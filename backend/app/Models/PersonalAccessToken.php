<?php

namespace App\Models;

use App\Services\JwtService;
use Laravel\Sanctum\PersonalAccessToken as SanctumToken;

class PersonalAccessToken extends SanctumToken
{
    protected $fillable = [
        'name',
        'token',
        'abilities',
        'expires_at',
        'platform',
    ];

    /**
     * Resolve a token string to its DB record.
     *
     * JWT tokens (header.payload.signature) are verified by signature before
     * the JTI is used to locate the row — no hash comparison required.
     * Conflict tokens and any other plain Sanctum tokens fall through to the
     * standard {id}|{plaintext} lookup so the approval flow is unaffected.
     */
    public static function findToken($token): ?static
    {
        if (substr_count($token, '.') === 2) {
            try {
                $payload = app(JwtService::class)->verify($token);
                $jti = isset($payload['jti']) ? (int) $payload['jti'] : null;

                return $jti ? static::find($jti) : null;
            } catch (\Exception) {
                // Invalid signature, expired, or malformed — hard-fail, do not fall back.
                return null;
            }
        }

        return parent::findToken($token);
    }
}
