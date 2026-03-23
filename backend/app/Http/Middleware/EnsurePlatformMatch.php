<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePlatformMatch
{
    public function handle(Request $request, Closure $next): Response
    {
        $headerPlatform = $request->header('X-Platform');

        // Reject if header is missing or invalid
        if (!in_array($headerPlatform, ['web', 'mobile'], true)) {
            return response()->json([
                'message' => 'Missing or invalid X-Platform header.',
            ], 400);
        }

        $token = $request->user()?->currentAccessToken();

        if (!$token) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // If token platform doesn't match header platform — reject
        if ($token->platform !== $headerPlatform) {
            return response()->json([
                'message'    => 'Token platform mismatch. Please log in again.',
                'logged_out' => true,
            ], 401);
        }

        return $next($request);
    }
}