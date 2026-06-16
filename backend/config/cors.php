<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'broadcasting/auth'],
    'allowed_methods' => ['*'],
    'allowed_origins' => array_values(array_filter([
        'http://localhost:3001',
        'http://localhost:8081', // Expo web preview of the mobile app
        env('DEV_TUNNEL_URL'),   // optional local tunnel origin (e.g. an ngrok dev URL), set per-developer
        env('FRONTEND_URL'),     // production web app (e.g. https://cognivia.vercel.app)
    ])),
    'allowed_origins_patterns' => [
        '#^http://10\.\d+\.\d+\.\d+:3001$#',
        '#^http://192\.168\.\d+\.\d+:3001$#',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
