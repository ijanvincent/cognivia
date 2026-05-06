<?php

namespace App\Exceptions\Auth;

use RuntimeException;

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