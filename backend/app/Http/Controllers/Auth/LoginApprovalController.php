<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * LoginApprovalController
 *
 * What: Handles approve and deny actions for pending cross-platform logins.
 * Why:  These are separate endpoints (not merged into AuthController) to
 *       keep the approval gate concern isolated and independently testable.
 *       Both endpoints require auth:sanctum — only the active session holder
 *       can approve or deny their own pending login requests.
 *
 * Routes:
 *   POST /api/auth/login/approve   — Platform A approves Platform B's login
 *   POST /api/auth/login/deny      — Platform A denies Platform B's login
 */
class LoginApprovalController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    public function pending(Request $request): JsonResponse
    {
        return response()->json([
            'pending_login' => $this->authService->getPendingLoginForActiveSession($request->user()),
        ]);
    }

    /**
     * Return the current status of a pending login for the requesting client.
     *
     * What: Allows Platform B to complete login after Platform A approves,
     *       even if the real-time LoginApproved event is not delivered.
     *
     * Security:
     * - Uses the high-entropy approval token and never accepts database IDs
     * - AuthService hashes the token before lookup
     * - Approved requests are consumed as single-use records
     */
    public function status(Request $request): JsonResponse
    {
        $request->validate([
            'approval_token' => ['required', 'string', 'size:64'],
        ]);

        return response()->json(
            $this->authService->getPendingLoginStatus($request->input('approval_token'))
        );
    }

    /**
     * Approve a pending login.
     *
     * What: Validates the approval_token, creates a real session for the
     *       requesting platform, and fires LoginApproved via WebSocket.
     *
     * Security:
     * - Requires authenticated session (auth:sanctum middleware)
     * - Token ownership validated in AuthService (user_id must match)
     * - Single-use: record marked approved immediately
     */
    public function approve(Request $request): JsonResponse
    {
        $request->validate([
            'approval_token' => ['required_without:pending_login_id', 'string', 'size:64'],
            'pending_login_id' => ['required_without:approval_token', 'integer'],
        ]);

        if ($request->filled('pending_login_id')) {
            $this->authService->approvePendingLoginById((int) $request->input('pending_login_id'), $request->user());
        } else {
            $this->authService->approvePendingLogin($request->input('approval_token'), $request->user());
        }

        return response()->json([
            'message' => 'Login approved.',
        ]);
    }

    /**
     * Deny a pending login.
     *
     * What: Marks the pending login as denied and fires LoginDenied
     *       via WebSocket so Platform B stops waiting.
     *
     * Security: same constraints as approve().
     */
    public function deny(Request $request): JsonResponse
    {
        $request->validate([
            'approval_token' => ['required_without:pending_login_id', 'string', 'size:64'],
            'pending_login_id' => ['required_without:approval_token', 'integer'],
        ]);

        if ($request->filled('pending_login_id')) {
            $this->authService->denyPendingLoginById((int) $request->input('pending_login_id'), $request->user());
        } else {
            $this->authService->denyPendingLogin($request->input('approval_token'), $request->user());
        }

        return response()->json([
            'message' => 'Login denied.',
        ]);
    }
}
