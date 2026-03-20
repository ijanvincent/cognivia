<?php

return [
    'paths'                    => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods'          => ['*'],
    'allowed_origins'          => [
        'http://localhost:3001',
        'https://intercity-nonbibulously-brylee.ngrok-free.dev',
    ],
    'allowed_origins_patterns' => [
        '#^http://10\.\d+\.\d+\.\d+:3001$#',   // any 10.x.x.x network
        '#^http://192\.168\.\d+\.\d+:3001$#',  // any 192.168.x.x network
        '#^http://172\.\d+\.\d+\.\d+:3001$#',  // any 172.x.x.x network
    ],
    'allowed_headers'          => ['*'],
    'exposed_headers'          => [],
    'max_age'                  => 0,
    'supports_credentials'     => true,
];