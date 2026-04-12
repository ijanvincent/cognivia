<?php

namespace App\Exceptions\Auth;

use RuntimeException;

/**
 * NEW FILE — what: dedicated exception for platform session conflicts.
 * why: previously PLATFORM_CONFLICT was thrown as a generic
 * ValidationException with the message stuffed into the 'email' field.
 * That worked for displaying a message, but gave us no structured way
 * to attach conflict_token and conflict_user_id to the response.
 *
 * This exception carries those values so AuthController can return them
 * in a clean, typed JSON response without any string-parsing hacks.
 */
class PlatformConflictException extends RuntimeException
{
    public function __construct(
        public readonly string $otherPlatform,
        public readonly int    $userId,
        public readonly string $conflictToken,
    ) {
        parent::__construct(
            "This account is currently active on {$otherPlatform}. " .
            "Please log out from {$otherPlatform} first before logging in here."
        );
    }
}