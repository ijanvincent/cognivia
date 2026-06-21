<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Asynchronous generation
    |--------------------------------------------------------------------------
    |
    | When true, POST /api/flashcards/generate dispatches the (slow, multi-second)
    | AI call to the queue and responds 202 with a request_id; the result is then
    | delivered over the private user.{id} broadcast channel. This keeps the AI
    | call off the web worker so a slow generation can't occupy a request slot.
    |
    | It REQUIRES both a running queue worker AND a real broadcast driver
    | (pusher/soketi). With QUEUE_CONNECTION=sync or BROADCAST_CONNECTION=log the
    | result can never reach the client, so leave this false until both exist
    | (see SCALING.md). When false (default), generation runs synchronously and
    | responds 200 with the flashcards — the original, always-safe behaviour.
    |
    */
    'async' => env('FLASHCARD_GENERATION_ASYNC', false),
];
