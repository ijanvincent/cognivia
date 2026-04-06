<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\User\FlashcardResource;
use App\Services\User\FlashcardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FlashcardController extends Controller
{
    /**
     * Allowed card types — mirrors the DB check constraint and mobile constants.
     * Single source of truth on the backend.
     */
    private const ALLOWED_TYPES = [
        'identification',
        'multiple_choice',
        'explanatory',
        'true_false',
        'mixed',
    ];

    public function __construct(
        private FlashcardService $flashcardService
    ) {}

    public function index(Request $request, int $deckId): JsonResponse
    {
        $flashcards = $this->flashcardService->getFlashcards(
            $deckId,
            $request->user()->id
        );

        return response()->json([
            'flashcards' => FlashcardResource::collection($flashcards),
        ]);
    }

    public function store(Request $request, int $deckId): JsonResponse
    {
        $allowedTypes = implode(',', self::ALLOWED_TYPES);

        $request->validate([
            'flashcards'                => ['required', 'array', 'min:1', 'max:60'],
            'flashcards.*.question'     => ['required', 'string', 'max:1000'],
            'flashcards.*.answer'       => ['required', 'string', 'max:2000'],

            // type is required and must be one of the allowed values
            'flashcards.*.type'         => ['required', 'string', "in:{$allowedTypes}"],

            // options only required when type is multiple_choice
            'flashcards.*.options'      => ['nullable', 'array'],
            'flashcards.*.options.A'    => ['required_if:flashcards.*.type,multiple_choice', 'string', 'max:500'],
            'flashcards.*.options.B'    => ['required_if:flashcards.*.type,multiple_choice', 'string', 'max:500'],
            'flashcards.*.options.C'    => ['required_if:flashcards.*.type,multiple_choice', 'string', 'max:500'],
            'flashcards.*.options.D'    => ['required_if:flashcards.*.type,multiple_choice', 'string', 'max:500'],

            // explanation optional but encouraged for MCQ
            'flashcards.*.explanation'  => ['nullable', 'string', 'max:1000'],
        ]);

        $this->flashcardService->saveFlashcards(
            $deckId,
            $request->user()->id,
            $request->flashcards
        );

        return response()->json([
            'message' => 'Flashcards saved successfully.',
        ], 201);
    }
}