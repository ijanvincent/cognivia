<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * PendingLogin model.
 *
 * Represents a short-lived login approval request created when a user
 * attempts to log in on a platform while already active on another.
 *
 * @property int    $id
 * @property int    $user_id
 * @property string $token_hash
 * @property string $requesting_platform
 * @property string $active_platform
 * @property string $status
 * @property \Carbon\Carbon $expires_at
 */
class PendingLogin extends Model
{
    protected $fillable = [
        'user_id',
        'token_hash',
        'requesting_platform',
        'active_platform',
        'status',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Whether this pending login has passed its expiry timestamp.
     * Why: Expiry is enforced at the model layer, not just DB queries,
     *      so any code path that loads a record can check it uniformly.
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Whether this record is still actionable.
     * Why: Both conditions must hold — status must be pending AND not expired.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending' && ! $this->isExpired();
    }
}