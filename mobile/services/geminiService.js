import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error(
        '[geminiService] EXPO_PUBLIC_GEMINI_API_KEY is not defined. ' +
        'Add it to your mobile/.env file.'
    );
}

const MODEL_NAME  = "gemini-2.5-flash";
const MAX_DOC_LEN = 30000;
const MAX_CARDS   = 60;
const MIN_CARDS   = 1;

/**
 * Supported flashcard types.
 * Keeping this as a const object (not enum) for React Native compatibility.
 */
export const CARD_TYPES = {
    IDENTIFICATION:   'identification',
    MULTIPLE_CHOICE:  'multiple_choice',
    EXPLANATORY:      'explanatory',
    TRUE_FALSE:       'true_false',
    MIXED:            'mixed',
};

/**
 * Human-readable labels and descriptions for the UI.
 */
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

// ---------------------------------------------------------------------------
// Prompt builders — one per card type
// ---------------------------------------------------------------------------

const FORMAT_IDENTIFICATION = `
Each flashcard MUST follow this JSON format:
{ "question": "What is [term]?", "answer": "[clear definition]", "type": "identification" }
- Questions must start with: What is, Who is, Define, What are, or Name
- Answers must be concise definitions (1–3 sentences)`;

const FORMAT_MULTIPLE_CHOICE = `
Each flashcard MUST follow this JSON format:
{
  "question": "[clear question]",
  "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "answer": "A",
  "explanation": "[why this option is correct]",
  "type": "multiple_choice"
}
- Exactly 4 options (A, B, C, D)
- Only ONE correct answer
- Distractors must be plausible, not obviously wrong
- "answer" field must be only the letter: "A", "B", "C", or "D"
- Include a brief explanation of why the correct answer is right`;

const FORMAT_EXPLANATORY = `
Each flashcard MUST follow this JSON format:
{ "question": "[explain/how/why question]", "answer": "[detailed explanation]", "type": "explanatory" }
- Questions must start with: Explain, How does, Why does, What causes, Describe, How is
- Answers must be thorough (2–5 sentences), covering the mechanism or reasoning`;

const FORMAT_TRUE_FALSE = `
Each flashcard MUST follow this JSON format:
{ "question": "[statement that is true or false]", "answer": "[True/False]. [1-2 sentence explanation]", "type": "true_false" }
- The question is a declarative statement (not a question)
- Answers must start with "True." or "False." followed by a brief explanation
- Mix true and false statements roughly 50/50`;

const FORMAT_MIXED = `
Each flashcard MUST follow ONE of these formats based on what best suits the content:

Identification: { "question": "What is X?", "answer": "...", "type": "identification" }
Multiple Choice: { "question": "...", "options": {"A":"...","B":"...","C":"...","D":"..."}, "answer": "A", "explanation": "...", "type": "multiple_choice" }
Explanatory: { "question": "Explain how X works.", "answer": "...", "type": "explanatory" }
True/False: { "question": "[statement]", "answer": "True/False. [reason]", "type": "true_false" }

- Vary the types throughout the deck for best learning outcomes
- Aim for roughly: 30% identification, 30% multiple choice, 25% explanatory, 15% true/false`;

const TYPE_FORMAT_MAP = {
    [CARD_TYPES.IDENTIFICATION]:  FORMAT_IDENTIFICATION,
    [CARD_TYPES.MULTIPLE_CHOICE]: FORMAT_MULTIPLE_CHOICE,
    [CARD_TYPES.EXPLANATORY]:     FORMAT_EXPLANATORY,
    [CARD_TYPES.TRUE_FALSE]:      FORMAT_TRUE_FALSE,
    [CARD_TYPES.MIXED]:           FORMAT_MIXED,
};

/**
 * Resolves the effective prompt type when the user selects multiple types.
 * If only one type is selected, use that type's prompt directly.
 * If multiple are selected (but not MIXED), instruct the AI to distribute evenly.
 */
const resolvePromptType = (cardTypes) => {
    if (!cardTypes || cardTypes.length === 0) return CARD_TYPES.MIXED;
    if (cardTypes.length === 1)              return cardTypes[0];
    if (cardTypes.includes(CARD_TYPES.MIXED)) return CARD_TYPES.MIXED;
    return '__multi__';
};

const buildMultiTypeFormat = (cardTypes) => {
    const parts = cardTypes.map((t) => TYPE_FORMAT_MAP[t]).filter(Boolean);
    return `
Distribute cards evenly across these selected types.
${parts.join('\n\n')}
Use the types that best match each piece of content.`;
};

/**
 * Builds the full Gemini prompt for flashcard generation.
 */
const buildPrompt = (documentText, numberOfCards, cardTypes) => {
    const promptType  = resolvePromptType(cardTypes);
    const formatBlock = promptType === '__multi__'
        ? buildMultiTypeFormat(cardTypes)
        : TYPE_FORMAT_MAP[promptType] || FORMAT_MIXED;

    return `You are an expert educational content creator specializing in active recall and spaced repetition.
Analyze the following document and create exactly ${numberOfCards} high-quality flashcards.

DOCUMENT CONTENT:
${documentText.substring(0, MAX_DOC_LEN)}

CARD TYPE INSTRUCTIONS:
${formatBlock}

GENERAL RULES:
- Create EXACTLY ${numberOfCards} flashcards
- Cover the most important concepts from the document
- Questions must be unambiguous and test genuine understanding
- Do NOT repeat the same question twice
- Return ONLY a valid JSON array — no markdown, no code fences, no extra text

Generate the flashcards now:`;
};

// ---------------------------------------------------------------------------
// JSON parsing helpers
// ---------------------------------------------------------------------------

const parseJSON = (text) => {
    const cleaned = text
        .trim()
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();

    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('AI returned an unexpected response. Please try again.');

    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) throw new Error('AI returned an unexpected response. Please try again.');

    return parsed;
};

const parseJSONObject = (text) => {
    const cleaned = text
        .trim()
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();

    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Invalid response format.');

    return JSON.parse(match[0]);
};

// ---------------------------------------------------------------------------
// Error normalization — never expose raw API errors to users
// ---------------------------------------------------------------------------

const normalizeError = (error) => {
    const msg = error?.message || '';

    if (msg.includes('API key') || msg.includes('API_KEY_INVALID'))
        return new Error('AI service configuration error. Please contact support.');
    if (msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED'))
        return new Error('AI service is temporarily unavailable. Please try again later.');
    if (msg.includes('404') || msg.includes('not found'))
        return new Error('AI service is temporarily unavailable. Please try again later.');
    if (msg.includes('JSON') || msg.includes('unexpected response'))
        return new Error('AI returned an unexpected response. Please try again.');

    return new Error('Something went wrong. Please try again.');
};

// ---------------------------------------------------------------------------
// Card normalizer — ensures every card has a consistent shape
// regardless of what type the AI produced
// ---------------------------------------------------------------------------

const normalizeCard = (card, index, fallbackType) => {
    const type = card.type || fallbackType || CARD_TYPES.IDENTIFICATION;

    const base = {
        id:          `${Date.now()}-${index}`,
        type,
        question:    card.question    || 'Question not available',
        answer:      card.answer      || 'Answer not available',
        mastered:    false,
        reviewCount: 0,
    };

    if (type === CARD_TYPES.MULTIPLE_CHOICE) {
        base.options     = card.options     || { A: '', B: '', C: '', D: '' };
        base.answer      = card.answer      || 'A';
        base.explanation = card.explanation || '';
    }

    if (type === CARD_TYPES.TRUE_FALSE) {
        // answer is always "True. [reason]" or "False. [reason]"
        base.answer = card.answer || 'True.';
    }

    return base;
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

/**
 * Generates flashcards from a document using Gemini AI.
 *
 * @param {string}   documentText - Extracted text from the uploaded document.
 * @param {number}   numberOfCards - How many cards to generate (1–60).
 * @param {string[]} cardTypes - Array of CARD_TYPES values. Defaults to ['mixed'].
 * @returns {Promise<Array>} Normalized flashcard objects.
 */
export const generateFlashcardsWithGemini = async (
    documentText,
    numberOfCards = 20,
    cardTypes     = [CARD_TYPES.MIXED]
) => {
    if (!documentText || typeof documentText !== 'string' || !documentText.trim()) {
        throw new Error('Document text is required to generate flashcards.');
    }

    if (!Array.isArray(cardTypes) || cardTypes.length === 0) {
        cardTypes = [CARD_TYPES.MIXED];
    }

    const cardCount    = Math.min(Math.max(MIN_CARDS, numberOfCards), MAX_CARDS);
    const fallbackType = cardTypes.length === 1 ? cardTypes[0] : CARD_TYPES.MIXED;

    try {
        const prompt = buildPrompt(documentText, cardCount, cardTypes);
        const result = await model.generateContent(prompt);
        const text   = result.response.text();
        const parsed = parseJSON(text);

        return parsed
            .slice(0, cardCount)
            .map((card, index) => normalizeCard(card, index, fallbackType));

    } catch (error) {
        throw normalizeError(error);
    }
};

/**
 * Checks a student's written answer against the correct answer using Gemini.
 * Unchanged from original — kept for FlashcardStudyScreen compatibility.
 */
export const checkAnswerWithGemini = async (question, correctAnswer, studentAnswer) => {
    if (!question || !correctAnswer || !studentAnswer?.trim()) {
        throw new Error('All fields are required to check an answer.');
    }

    const prompt = `You are a flashcard answer checker. Compare the student's answer with the correct answer.

Question: ${question}
Correct Answer: ${correctAnswer}
Student's Answer: ${studentAnswer}

Respond ONLY with a JSON object:
{
  "correct": true or false,
  "feedback": "Brief explanation (1-2 sentences)"
}`;

    try {
        const result     = await model.generateContent(prompt);
        const text       = result.response.text();
        const evaluation = parseJSONObject(text);

        return {
            correct:  Boolean(evaluation.correct),
            feedback: evaluation.feedback || 'No feedback available.',
        };

    } catch (error) {
        throw normalizeError(error);
    }
};