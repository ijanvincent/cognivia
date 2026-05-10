<?php

namespace App\Exceptions\Auth;

use RuntimeException;

/**
 * PlatformConflictException.
 *
 * What: Thrown when a user attempts to log in on Platform B while an
 *       active session exists on Platform A.
 *
 * Change from previous version:
 * - Added $approvalToken property.
 * Why:  The old version only returned a conflict_token used to subscribe
 *       to the WebSocket channel. Now we return two distinct tokens:
 *       1. conflict_token  — short-lived Sanctum token for WS auth only
 *       2. approval_token  — plaintext token Platform B uses to identify
 *          its pending_login record when the WS event arrives
 *       Separating these ensures the approval flow is decoupled from
 *       the WebSocket authentication mechanism.
 */
class PlatformConflictException extends RuntimeException
{
    public function __construct(
        public readonly string $otherPlatform,
        public readonly int    $userId,
        public readonly string $conflictToken,
        public readonly string $approvalToken,
    ) {
        parent::__construct(
            "This account is currently active on {$otherPlatform}. " .
            "A sign-in request has been sent to your {$otherPlatform} device."
        );
    }
}