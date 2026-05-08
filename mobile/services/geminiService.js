/**
 * geminiService.js
 *
 * All AI calls are proxied through the Laravel backend via OpenRouter.
 * The Gemini/OpenRouter API key is NOT present here or anywhere in the
 * mobile bundle — it lives exclusively in backend/.env.
 *
 * Public function signatures are intentionally unchanged so GenerateScreen.js
 * and FlashcardStudyScreen.js require zero import modifications.
 */

import api from './api';

// =============================================================================
// Card type constants
// Kept here so GenerateScreen.js still imports from this file unchanged.
// =============================================================================

export const CARD_TYPES = {
    IDENTIFICATION:  'identification',
    MULTIPLE_CHOICE: 'multiple_choice',
    EXPLANATORY:     'explanatory',
    TRUE_FALSE:      'true_false',
    MIXED:           'mixed',
};

export const CARD_TYPE_META = {
    [CARD_TYPES.IDENTIFICATION]: {
        label:       'Identification',
        description: 'What is / Who is / Define',
        icon:        'label-outline',
    },
    [CARD_TYPES.MULTIPLE_CHOICE]: {
        label:       'Multiple Choice',
        description: 'Question with 4 options (A–D)',
        icon:        'format-list-bulleted',
    },
    [CARD_TYPES.EXPLANATORY]: {
        label:       'Explanatory',
        description: 'Explain how / why / what causes',
        icon:        'text-box-outline',
    },
    [CARD_TYPES.TRUE_FALSE]: {
        label:       'True or False',
        description: 'Statement + reasoning',
        icon:        'check-circle-outline',
    },
    [CARD_TYPES.MIXED]: {
        label:       'Mixed (Recommended)',
        description: 'AI picks the best type per card',
        icon:        'shuffle-variant',
    },
};

// =============================================================================
// generateFlashcardsWithGemini
//
// Previously: called Gemini SDK directly using EXPO_PUBLIC_GEMINI_API_KEY.
// Now:         calls POST /api/flashcards/generate on the Laravel backend.
//              The backend owns the key, quota, and model selection.
// =============================================================================

/**
 * Generate flashcards from document text via the backend proxy.
 *
 * @param {string}   documentText   Raw extracted text from the uploaded document.
 * @param {number}   numberOfCards  How many cards to generate (1–60).
 * @param {string[]} cardTypes      Array of CARD_TYPES values.
 * @returns {Promise<Array>}        Normalised flashcard objects.
 */
export const generateFlashcardsWithGemini = async (
    documentText,
    numberOfCards = 20,
    cardTypes     = [CARD_TYPES.MIXED],
) => {
    if (!documentText?.trim()) {
        throw new Error('Document text is required to generate flashcards.');
    }

    if (!Array.isArray(cardTypes) || cardTypes.length === 0) {
        cardTypes = [CARD_TYPES.MIXED];
    }

    try {
        const response = await api.post('/flashcards/generate', {
            document_text:   documentText,
            number_of_cards: numberOfCards,
            card_types:      cardTypes,
        });

        const { flashcards } = response.data;

        if (!Array.isArray(flashcards) || flashcards.length === 0) {
            throw new Error('No flashcards were generated. Please try again.');
        }

        return flashcards;

    } catch (error) {
        // Surface the backend error message if present, otherwise generic.
        const serverMessage = error?.response?.data?.message;
        throw new Error(serverMessage ?? error?.message ?? 'Failed to generate flashcards. Please try again.');
    }
};

// =============================================================================
// checkAnswerWithGemini
//
// Previously: called Gemini SDK directly.
// Now:         calls POST /api/flashcards/check-answer on the Laravel backend.
// =============================================================================

/**
 * Evaluate a student's answer against the correct answer via the backend.
 *
 * @param {string} question       The original flashcard question.
 * @param {string} correctAnswer  The expected correct answer.
 * @param {string} studentAnswer  The student's submitted answer.
 * @returns {Promise<{ correct: boolean, feedback: string }>}
 */
export const checkAnswerWithGemini = async (question, correctAnswer, studentAnswer) => {
    if (!question || !correctAnswer || !studentAnswer?.trim()) {
        throw new Error('All fields are required to check an answer.');
    }

    try {
        const response = await api.post('/flashcards/check-answer', {
            question,
            correct_answer: correctAnswer,
            student_answer: studentAnswer,
        });

        return {
            correct:  Boolean(response.data.correct),
            feedback: response.data.feedback ?? 'No feedback available.',
        };

    } catch (error) {
        const serverMessage = error?.response?.data?.message;
        throw new Error(serverMessage ?? error?.message ?? 'Failed to check answer. Please try again.');
    }
};