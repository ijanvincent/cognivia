<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Deck;
use App\Models\Flashcard;
use App\Models\PendingLogin;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class ContentController extends Controller
{
    public function overview(): JsonResponse
    {
        return response()->json([
            'total_decks'       => Deck::count(),
            'total_flashcards'  => Flashcard::count(),
            'ai_generated'      => Flashcard::whereHas('deck', fn ($q) => $q->where('source', 'ai'))->count(),
            'mastered_cards'    => Flashcard::where('mastered', true)->count(),
            'pending_approvals' => PendingLogin::where('status', 'pending')
                                               ->where('expires_at', '>', now())
                                               ->count(),
            'deck_sources'      => [
                'ai'     => Deck::where('source', 'ai')->count(),
                'manual' => Deck::where('source', 'manual')->count(),
                'import' => Deck::where('source', 'import')->count(),
            ],
            'card_types'        => Flashcard::selectRaw('type, count(*) as total')
                                            ->groupBy('type')
                                            ->pluck('total', 'type'),
        ]);
    }

    public function decks(): JsonResponse
    {
        $decks = Deck::with('user:id,username,email')
            ->withCount('flashcards')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($d) => [
                'id'           => $d->id,
                'title'        => $d->title,
                'source'       => $d->source,
                'card_count'   => $d->flashcards_count,
                'mastery'      => $d->mastery,
                'progress'     => $d->progress,
                'status'       => $d->status,
                'share_code'   => $d->share_code,
                'created_at'   => $d->created_at,
                'user'         => $d->user,
            ]);

        return response()->json(['decks' => $decks]);
    }

    public function loginApprovals(): JsonResponse
    {
        $approvals = PendingLogin::with('user:id,username,email')
            ->orderBy('created_at', 'desc')
            ->take(100)
            ->get()
            ->map(fn ($a) => [
                'id'                   => $a->id,
                'user'                 => $a->user,
                'requesting_platform'  => $a->requesting_platform,
                'active_platform'      => $a->active_platform,
                'status'               => $a->status,
                'is_expired'           => $a->isExpired(),
                'expires_at'           => $a->expires_at,
                'created_at'           => $a->created_at,
            ]);

        $stats = [
            'pending'  => PendingLogin::where('status', 'pending')->where('expires_at', '>', now())->count(),
            'approved' => PendingLogin::where('status', 'approved')->count(),
            'denied'   => PendingLogin::where('status', 'denied')->count(),
            'expired'  => PendingLogin::where('expires_at', '<=', now())->count(),
        ];

        return response()->json(['approvals' => $approvals, 'stats' => $stats]);
    }
}
