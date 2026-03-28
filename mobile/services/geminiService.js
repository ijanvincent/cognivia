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
const MAX_CARDS   = 50;
const MIN_CARDS   = 1;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const buildPrompt = (documentText, numberOfCards, complexityLevel) => `
You are an expert educational content creator.
Analyze the following document and create exactly ${numberOfCards} high-quality flashcards.

DOCUMENT CONTENT:
${documentText.substring(0, MAX_DOC_LEN)}

INSTRUCTIONS:
- Create EXACTLY ${numberOfCards} flashcards
- Each flashcard must have a "question" and an "answer"
- Questions should be clear, specific, and test understanding
- Answers should be ${complexityLevel}
- Cover the most important concepts from the document
- Vary the question types (definitions, explanations, applications, comparisons)
- Return ONLY a valid JSON array, no markdown, no extra text

REQUIRED FORMAT:
[
  { "question": "What is...", "answer": "..." }
]

Generate the flashcards now:`;

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


export const generateFlashcardsWithGemini = async (
    documentText,
    numberOfCards = 20,
    simpleDefinition = false
) => {
    if (!documentText || typeof documentText !== 'string' || !documentText.trim()) {
        throw new Error('Document text is required to generate flashcards.');
    }

    const cardCount       = Math.min(Math.max(MIN_CARDS, numberOfCards), MAX_CARDS);
    const complexityLevel = simpleDefinition
        ? 'simple and easy to understand'
        : 'detailed and comprehensive';

    try {
        const prompt = buildPrompt(documentText, cardCount, complexityLevel);
        const result = await model.generateContent(prompt);
        const text   = result.response.text();
        const parsed = parseJSON(text);

        return parsed.slice(0, cardCount).map((card, index) => ({
            id:          `${Date.now()}-${index}`,
            question:    card.question || 'Question not available',
            answer:      card.answer   || 'Answer not available',
            mastered:    false,
            reviewCount: 0,
        }));

    } catch (error) {
        throw normalizeError(error);
    }
};

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