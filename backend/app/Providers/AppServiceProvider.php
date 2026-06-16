<?php

namespace App\Providers;

use App\Mail\Transport\GmailApiTransport;
use App\Models\PersonalAccessToken;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        if (config('app.env') === 'local') {
            URL::forceScheme('http');
        }

        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);

        // Register the "gmail" mail transport (config/mail.php → mailers.gmail).
        Mail::extend('gmail', function (): GmailApiTransport {
            return new GmailApiTransport(
                (string) config('services.gmail.client_id'),
                (string) config('services.gmail.client_secret'),
                (string) config('services.gmail.refresh_token'),
            );
        });
    }
}
