<?php

return [
    'paths'                    => ['api/*', 'sanctum/csrf-cookie', 'broadcasting/auth'],
    'allowed_methods'          => ['*'],
    'allowed_origins'          => [
        'http://localhost:3001',
        'http://10.76.253.117:3001',
        'https://intercity-nonbibulously-brylee.ngrok-free.dev',
    ],
    'allowed_origins_patterns' => [
        '#^http://10\.\d+\.\d+\.\d+:3001$#',
        '#^http://192\.168\.\d+\.\d+:3001$#',
        '#^http://172\.\d+\.\d+\.\d+:3001$#',
    ],
    'allowed_headers'          => ['*'],
    'exposed_headers'          => [],
    'max_age'                  => 0,
    'supports_credentials'     => true,
];