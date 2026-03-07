<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isUser()) {
            return response()->json([
                'message' => 'Unauthorized. User access only.'
            ], 403);
        }

        return $next($request);
    }
}