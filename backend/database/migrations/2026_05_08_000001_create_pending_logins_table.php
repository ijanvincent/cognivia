<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Creates the pending_logins table.
 *
 * What: Stores short-lived login approval requests.
 * Why:  When Platform B attempts login while Platform A has an active session,
 *       the backend creates a pending_login record and fires a real-time event
 *       to Platform A. Platform A approves or denies. The token is single-use,
 *       hashed, and expires in 60 seconds. This table is the source of truth
 *       for the approval gate — no approval without a valid record here.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pending_logins', function (Blueprint $table) {
            $table->id();

            // The user whose session is being contested
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // SHA-256 hash of the approval token — never store plaintext
            $table->string('token_hash', 64)->unique();

            // Which platform is requesting to log in (web or mobile)
            $table->enum('requesting_platform', ['web', 'mobile']);

            // Which platform currently holds the active session
            $table->enum('active_platform', ['web', 'mobile']);

            // Approval status
            $table->enum('status', ['pending', 'approved', 'denied'])->default('pending');

            // Hard expiry — backend rejects any action after this timestamp
            $table->timestamp('expires_at');

            $table->timestamps();

            // Index for fast lookup and cleanup queries
            $table->index(['user_id', 'status']);
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pending_logins');
    }
};