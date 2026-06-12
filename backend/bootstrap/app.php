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

 
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        // Behind a proxy every request reaches PHP with the proxy as
        // REMOTE_ADDR. Without trusting it, request()->ip() is identical for
        // all visitors, so the IP-keyed login throttles share one global
        // bucket — any client can exhaust everyone's attempts. The trusted
        // range differs per environment: the Docker bridge locally (default),
        // and '*' on Render, whose load-balancer CIDR is unpublished but is
        // the only path to reach the container.
        $trustedProxies = env('TRUSTED_PROXIES', '172.16.0.0/12');
        $middleware->trustProxies(
            at: $trustedProxies === '*' ? '*' : array_map('trim', explode(',', $trustedProxies)),
        );

        $middleware->alias([
            'admin'          => AdminMiddleware::class,
            'user'           => UserMiddleware::class,
            'platform.match' => EnsurePlatformMatch::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();