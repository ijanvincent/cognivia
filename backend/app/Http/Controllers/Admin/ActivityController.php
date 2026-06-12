<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Deck;
use App\Models\Flashcard;
use App\Models\PendingLogin;
use App\Models\PersonalAccessToken;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Read-only activity monitoring for the admin panel.
 *
 * No dedicated audit table exists yet, so events are derived from the
 * timestamps already recorded by the product tables:
 *
 *   signup    users.created_at
 *   session   personal_access_tokens.created_at  (platform login)
 *   deck      decks.created_at                   (manual / ai / import)
 *   mastered  flashcards.updated_at where mastered = true
 *   approval  pending_logins (requested / approved / denied)
 */
class ActivityController extends Controller
{
    private const FEED_LIMIT = 80;
    private const PER_SOURCE = 40;

    public function feed(Request $request): JsonResponse
    {
        $type = $request->query('type', 'all');

        $events = collect();

        if (in_array($type, ['all', 'signup'], true)) {
            $events = $events->concat($this->signupEvents());
        }
        if (in_array($type, ['all', 'session'], true)) {
            $events = $events->concat($this->sessionEvents());
        }
        if (in_array($type, ['all', 'deck'], true)) {
            $events = $events->concat($this->deckEvents());
        }
        if (in_array($type, ['all', 'study'], true)) {
            $events = $events->concat($this->studyEvents());
        }
        if (in_array($type, ['all', 'approval'], true)) {
            $events = $events->concat($this->approvalEvents());
        }

        $events = $events
            ->sortByDesc('timestamp')
            ->take((int) $request->query('limit', self::FEED_LIMIT))
            ->values();

        return response()->json(['events' => $events]);
    }

    public function engagement(): JsonResponse
    {
        $now = now();

        $userTokens = PersonalAccessToken::query()
            ->where('tokenable_type', User::class)
            ->whereNotNull('platform');

        $activeSince = fn ($since) => (clone $userTokens)
            ->where('last_used_at', '>=', $since)
            ->distinct('tokenable_id')
            ->count('tokenable_id');

        // Signups per day, last 30 days — grouped in PHP to stay driver-agnostic.
        $signups = User::where('role', 'user')
            ->where('created_at', '>=', $now->copy()->subDays(29)->startOfDay())
            ->pluck('created_at')
            ->groupBy(fn ($d) => $d->toDateString())
            ->map->count();

        $logins = (clone $userTokens)
            ->where('created_at', '>=', $now->copy()->subDays(29)->startOfDay())
            ->pluck('created_at')
            ->groupBy(fn ($d) => $d->toDateString())
            ->map->count();

        $days = collect(range(29, 0))->map(
            fn ($i) => $now->copy()->subDays($i)->toDateString()
        );

        return response()->json([
            'active_now'      => $activeSince($now->copy()->subMinutes(5)),
            'active_today'    => $activeSince($now->copy()->startOfDay()),
            'active_7d'       => $activeSince($now->copy()->subDays(7)),
            'active_30d'      => $activeSince($now->copy()->subDays(30)),
            'sessions'        => [
                'web'    => (clone $userTokens)->where('platform', 'web')->count(),
                'mobile' => (clone $userTokens)->where('platform', 'mobile')->count(),
            ],
            'signups_by_day'  => $days->map(fn ($d) => [
                'date'    => $d,
                'signups' => $signups[$d] ?? 0,
                'logins'  => $logins[$d] ?? 0,
            ]),
            'study'           => [
                'total_reviews'  => (int) Flashcard::sum('review_count'),
                'mastered_cards' => Flashcard::where('mastered', true)->count(),
                'total_cards'    => Flashcard::count(),
            ],
        ]);
    }

    // -------------------------------------------------------------------------
    // Event sources
    // -------------------------------------------------------------------------

    private function signupEvents()
    {
        return User::where('role', 'user')
            ->orderByDesc('created_at')
            ->take(self::PER_SOURCE)
            ->get(['id', 'username', 'email', 'created_at'])
            ->map(fn ($u) => [
                'type'      => 'signup',
                'timestamp' => $u->created_at,
                'user'      => ['id' => $u->id, 'username' => $u->username, 'email' => $u->email],
                'meta'      => [],
            ]);
    }

    private function sessionEvents()
    {
        return PersonalAccessToken::with('tokenable:id,username,email')
            ->where('tokenable_type', User::class)
            ->whereNotNull('platform')
            ->orderByDesc('created_at')
            ->take(self::PER_SOURCE)
            ->get()
            ->filter(fn ($t) => $t->tokenable !== null)
            ->map(fn ($t) => [
                'type'      => 'session',
                'timestamp' => $t->created_at,
                'user'      => [
                    'id'       => $t->tokenable->id,
                    'username' => $t->tokenable->username,
                    'email'    => $t->tokenable->email,
                ],
                'meta'      => [
                    'platform'     => $t->platform,
                    'last_used_at' => $t->last_used_at,
                ],
            ]);
    }

    private function deckEvents()
    {
        return Deck::with('user:id,username,email')
            ->withCount('flashcards')
            ->orderByDesc('created_at')
            ->take(self::PER_SOURCE)
            ->get()
            ->filter(fn ($d) => $d->user !== null)
            ->map(fn ($d) => [
                'type'      => 'deck',
                'timestamp' => $d->created_at,
                'user'      => [
                    'id'       => $d->user->id,
                    'username' => $d->user->username,
                    'email'    => $d->user->email,
                ],
                'meta'      => [
                    'deck_id'    => $d->id,
                    'title'      => $d->title,
                    'source'     => $d->source,
                    'card_count' => $d->flashcards_count,
                ],
            ]);
    }

    private function studyEvents()
    {
        return Flashcard::with(['user:id,username,email', 'deck:id,title'])
            ->where('mastered', true)
            ->orderByDesc('updated_at')
            ->take(self::PER_SOURCE)
            ->get()
            ->filter(fn ($f) => $f->user !== null)
            ->map(fn ($f) => [
                'type'      => 'study',
                'timestamp' => $f->updated_at,
                'user'      => [
                    'id'       => $f->user->id,
                    'username' => $f->user->username,
                    'email'    => $f->user->email,
                ],
                'meta'      => [
                    'deck_id'      => $f->deck?->id,
                    'deck_title'   => $f->deck?->title,
                    'review_count' => $f->review_count,
                ],
            ]);
    }

    private function approvalEvents()
    {
        return PendingLogin::with('user:id,username,email')
            ->orderByDesc('updated_at')
            ->take(self::PER_SOURCE)
            ->get()
            ->filter(fn ($a) => $a->user !== null)
            ->map(fn ($a) => [
                'type'      => 'approval',
                'timestamp' => $a->updated_at,
                'user'      => [
                    'id'       => $a->user->id,
                    'username' => $a->user->username,
                    'email'    => $a->user->email,
                ],
                'meta'      => [
                    'status'              => $a->isExpired() && $a->status === 'pending' ? 'expired' : $a->status,
                    'requesting_platform' => $a->requesting_platform,
                    'active_platform'     => $a->active_platform,
                ],
            ]);
    }
}
