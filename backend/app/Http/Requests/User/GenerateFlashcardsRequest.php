<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class GenerateFlashcardsRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Authorization handled by auth:sanctum middleware on the route.
        return true;
    }

    /**
     * @return array<string, mixed[]>
     */
    public function rules(): array
    {
        return [
            'document_text'   => ['required', 'string', 'min:50', 'max:200000'],
            'number_of_cards' => ['required', 'integer', 'min:1', 'max:60'],
            'card_types'      => ['required', 'array', 'min:1'],
            'card_types.*'    => [
                'string',
                'in:identification,multiple_choice,explanatory,true_false,mixed',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'document_text.required'   => 'Document text is required.',
            'document_text.min'        => 'Document text is too short to generate flashcards.',
            'document_text.max'        => 'Document text exceeds the maximum allowed length.',
            'number_of_cards.required' => 'Number of cards is required.',
            'number_of_cards.integer'  => 'Number of cards must be a whole number.',
            'number_of_cards.min'      => 'You must request at least 1 flashcard.',
            'number_of_cards.max'      => 'Maximum 60 flashcards per generation.',
            'card_types.required'      => 'At least one card type must be selected.',
            'card_types.*.in'          => 'Invalid card type provided.',
        ];
    }
}