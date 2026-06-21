/**
 * flashcardService.js
 *
 * AI flashcard generation and answer checking, proxied through the Laravel
 * backend. The AI provider key is NOT present here or anywhere in the mobile
 * bundle — it lives exclusively in backend/.env.
 */

import api from './api';
import { getEcho } from './echoService';
import * as SecureStore from './secureStorage';

// Worst-case wait for the async result before giving up. Must exceed the
// backend job timeout (150s) so a slow-but-valid generation isn't cut off.
const ASYNC_RESULT_TIMEOUT_MS = 160000;

/**
 * Wait for an async generation result delivered over the private user.{id}
 * channel after the backend responded 202. Resolves with the flashcards, or
 * rejects on a broadcast failure / timeout. Only the two flashcard listeners
 * are removed on cleanup, so any other subscriber on the same channel
 * (e.g. the dashboard's profile.updated listener) is left intact.
 *
 * @param {string} requestId  Correlates the broadcast with this request.
 * @returns {Promise<Array>}
 */
const awaitAsyncGeneration = async (requestId) => {
    const echo = await getEcho();
    if (!echo) {
        throw new Error('Realtime connection unavailable, so the generated cards can’t be delivered. Please try again.');
    }

    let userId = null;
    try {
        const userStr = await SecureStore.getItemAsync('user');
        userId = userStr ? JSON.parse(userStr)?.id : null;
    } catch (_) {
        userId = null;
    }
    if (!userId) {
        throw new Error('Your session has expired. Please log in again.');
    }

    return new Promise((resolve, reject) => {
        const channel = echo.private(`user.${userId}`);
        let settled = false;

        const cleanup = () => {
            clearTimeout(timer);
            channel.stopListening('.flashcards.generated');
            channel.stopListening('.flashcards.generation-failed');
        };

        const timer = setTimeout(() => {
            if (settled) return;
            settled = true;
            cleanup();
            reject(new Error('Generation is taking longer than expected. Please try again.'));
        }, ASYNC_RESULT_TIMEOUT_MS);

        channel.listen('.flashcards.generated', (event) => {
            if (settled || (requestId && event?.request_id !== requestId)) return;
            settled = true;
            cleanup();
            const cards = event?.flashcards;
            if (!Array.isArray(cards) || cards.length === 0) {
                reject(new Error('No flashcards were generated. Please try again.'));
                return;
            }
            resolve(cards);
        });

        channel.listen('.flashcards.generation-failed', (event) => {
            if (settled || (requestId && event?.request_id !== requestId)) return;
            settled = true;
            cleanup();
            reject(new Error(event?.message || 'Failed to generate flashcards. Please try again.'));
        });
    });
};

// =============================================================================
// Card type constants
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

/**
 * Generate flashcards from document text via POST /api/flashcards/generate.
 * The backend owns the AI provider key, quota, and model selection.
 *
 * @param {string}   documentText   Raw extracted text from the uploaded document.
 * @param {number}   numberOfCards  How many cards to generate (1–60).
 * @param {string[]} cardTypes      Array of CARD_TYPES values.
 * @returns {Promise<Array>}        Normalised flashcard objects.
 */
export const generateFlashcards = async (
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
        }, {
            // Generation is the longest request in the app: a possible backend
            // cold start (~30s on the free tier) plus a 15-30s AI call. The
            // default client timeout would abort mid-flight, so give it room.
            timeout: 90000,
        });

        // Async mode: the backend queued the job (202) and will deliver the
        // result over the realtime channel. Wait for it here so the caller's
        // contract is unchanged — it still just awaits an array of cards.
        if (response.status === 202 || response.data?.async) {
            return await awaitAsyncGeneration(response.data?.request_id);
        }

        const { flashcards } = response.data;

        if (!Array.isArray(flashcards) || flashcards.length === 0) {
            throw new Error('No flashcards were generated. Please try again.');
        }

        return flashcards;

    } catch (error) {
        // A timeout means the request ran out of time — usually a cold backend.
        // Give an actionable message instead of an opaque failure.
        if (error?.code === 'ECONNABORTED') {
            throw new Error('The server is taking longer than usual (it may be waking up). Please try again in a moment.');
        }

        // Surface the backend error message if present, otherwise generic.
        const serverMessage = error?.response?.data?.message;
        throw new Error(serverMessage ?? error?.message ?? 'Failed to generate flashcards. Please try again.');
    }
};

/**
 * Evaluate a student's answer via POST /api/flashcards/check-answer.
 *
 * @param {string} question       The original flashcard question.
 * @param {string} correctAnswer  The expected correct answer.
 * @param {string} studentAnswer  The student's submitted answer.
 * @returns {Promise<{ correct: boolean, feedback: string }>}
 */
export const checkAnswer = async (question, correctAnswer, studentAnswer) => {
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