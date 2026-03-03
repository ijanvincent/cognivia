import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from 'expo-file-system/legacy';

// Your actual Gemini API key
const API_KEY = "AIzaSyDxKtKTLlHxRPcuPy0GR7B9tUiXcorbs4M";

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generate flashcards using Gemini AI
 */
export const generateFlashcardsWithGemini = async (
    documentText, 
    numberOfCards = 20, 
    simpleDefinition = false
) => {
    try {
        console.log(`🤖 Starting Gemini AI generation for ${numberOfCards} cards...`);
        
        // Use gemini-1.5-flash (works with new API keys)
      const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash"
});

        const complexityLevel = simpleDefinition 
            ? "simple, easy-to-understand" 
            : "detailed and comprehensive";
        
        const prompt = `You are an expert educational content creator. Analyze the following document and create exactly ${numberOfCards} high-quality flashcards.

DOCUMENT CONTENT:
${documentText.substring(0, 30000)} 

INSTRUCTIONS:
- Create EXACTLY ${numberOfCards} flashcards
- Each flashcard should have a "question" and an "answer"
- Questions should be clear, specific, and test understanding
- Answers should be ${complexityLevel}
- Cover the most important concepts from the document
- Vary the question types (definitions, explanations, applications, comparisons)
- Return ONLY valid JSON array format, no markdown code blocks

REQUIRED FORMAT:
[
  {
    "question": "What is...",
    "answer": "..."
  },
  {
    "question": "Explain...",
    "answer": "..."
  }
]

Generate the flashcards now:`;

        console.log("📤 Sending request to Gemini API...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("📥 Received response from Gemini");
        console.log("Raw response preview:", text.substring(0, 200));
        
        // Clean the response - remove markdown code blocks
        let cleanedText = text.trim();
        cleanedText = cleanedText.replace(/```json\s*/g, '');
        cleanedText = cleanedText.replace(/```\s*/g, '');
        cleanedText = cleanedText.trim();
        
        // Find JSON array in the response
        const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.error("❌ No JSON array found in response");
            console.log("Full response:", cleanedText);
            throw new Error('Could not find valid JSON in AI response');
        }
        
        // Parse JSON
        const flashcards = JSON.parse(jsonMatch[0]);
        
        if (!Array.isArray(flashcards)) {
            throw new Error('Invalid response format from AI');
        }
        
        console.log(`✅ Successfully parsed ${flashcards.length} flashcards`);
        
        // Add IDs and ensure we have the requested number
        const flashcardsWithIds = flashcards.slice(0, numberOfCards).map((card, index) => ({
            id: `card_${Date.now()}_${index}`,
            question: card.question || card.q || "Question not provided",
            answer: card.answer || card.a || "Answer not provided",
            mastered: false,
            reviewCount: 0
        }));
        
        console.log(`🎉 Returning ${flashcardsWithIds.length} flashcards`);
        return flashcardsWithIds;
        
    } catch (error) {
        console.error('❌ Gemini Error Details:', error);
        console.error('Error message:', error.message);
        
        if (error.message.includes('API key') || error.message.includes('API_KEY_INVALID')) {
            throw new Error('Invalid API key. Please create a new API key at https://aistudio.google.com/app/apikey');
        } else if (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
            throw new Error('API quota exceeded. Please try again later.');
        } else if (error.message.includes('404') || error.message.includes('not found')) {
            throw new Error('Model not available. Your API key may be incompatible. Please create a NEW API key at https://aistudio.google.com/app/apikey');
        } else if (error.message.includes('JSON')) {
            throw new Error('AI returned invalid format. Please try again.');
        } else {
            throw new Error(error.message || 'Failed to generate flashcards.');
        }
    }
};

/**
 * Test function to verify API key is working
 */
export const testGeminiAPI = async () => {
    try {
        console.log("🧪 Testing Gemini API...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("Say hello in one word");
        const response = await result.response;
        const text = response.text();
        console.log("✅ Gemini API Test Successful:", text);
        return { success: true, message: text };
    } catch (error) {
        console.error('❌ Test API Error:', error);
        return { success: false, error: error.message };
    }
    
};
/**
 * List all available models for your API key
 */
export const listAvailableModels = async () => {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );
        const data = await response.json();
        console.log("📋 Available models:", JSON.stringify(data, null, 2));
        
        if (data.models) {
            const modelNames = data.models.map(m => m.name);
            console.log("✅ Model names:", modelNames);
            return modelNames;
        }
        return data;
    } catch (error) {
        console.error("❌ Error listing models:", error);
        return null;
    }
};