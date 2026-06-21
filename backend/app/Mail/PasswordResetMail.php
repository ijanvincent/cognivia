<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Implements ShouldQueue so delivery is pushed onto the queue instead of
 * blocking the HTTP request: the Gmail API transport makes an outbound HTTPS
 * call that can take a second or more, and the user's forgot-password response
 * should not wait on it. With QUEUE_CONNECTION=sync (current free-tier default)
 * Laravel runs the job inline, so behaviour is unchanged; once a Redis-backed
 * worker exists the same code delivers mail asynchronously, off the request.
 */
class PasswordResetMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public string $resetUrl,
        public string $username
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'CogniVia — Secure Password Reset',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.password-reset',
            with: [
                'resetUrl' => $this->resetUrl,
                'user' => (object) ['username' => $this->username],
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        // Explicitly return empty array to prevent auto-attachments
        return [];
    }
}
