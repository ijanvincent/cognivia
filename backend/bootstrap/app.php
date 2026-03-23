<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\EnsurePlatformMatch;
use App\Http\Middleware\UserMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
        then: function () {
            \Illuminate\Support\Facades\Broadcast::routes([
                'middleware' => [
                    \Illuminate\Http\Middleware\HandleCors::class,
                    'auth:sanctum',
                ],
                'prefix' => 'api',
            ]);
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {

        // ── CORS must run on every request including OPTIONS preflight ──
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        $middleware->alias([
            'admin'          => AdminMiddleware::class,
            'user'           => UserMiddleware::class,
            'platform.match' => EnsurePlatformMatch::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();