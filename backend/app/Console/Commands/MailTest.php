<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * Sends a plain test email through the currently configured mailer, so mail
 * delivery can be verified end-to-end (e.g. after wiring up the Gmail API)
 * without going through the forgot-password flow.
 */
class MailTest extends Command
{
    protected $signature = 'mail:test {to : Recipient email address}';

    protected $description = 'Send a test email through the configured mailer';

    public function handle(): int
    {
        $to = (string) $this->argument('to');

        $this->info("Sending test email to {$to} via mailer [".config('mail.default').'] ...');

        try {
            Mail::raw('CogniVia mail test — if you can read this, delivery works.', function ($message) use ($to) {
                $message->to($to)->subject('CogniVia mail test');
            });
        } catch (Throwable $e) {
            $this->error('Send failed: '.$e->getMessage());

            return self::FAILURE;
        }

        $this->info('Sent without error. Check the inbox (and spam) for the recipient.');

        return self::SUCCESS;
    }
}
