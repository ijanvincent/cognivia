import * as FileSystem from 'expo-file-system';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig';

/**
 * Upload document to Firebase Storage
 * @param {string} fileUri - Local file URI
 * @param {string} fileName - Name of the file
 * @returns {Promise<string>} - Download URL
 */
export const uploadDocumentToStorage = async (fileUri, fileName) => {
    try {
        // Read file as base64
        const fileContent = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        
        // Convert base64 to blob
        const response = await fetch(`data:application/octet-stream;base64,${fileContent}`);
        const blob = await response.blob();
        
        // Create storage reference
        const storageRef = ref(storage, `documents/${Date.now()}_${fileName}`);
        
        // Upload file
        await uploadBytes(storageRef, blob);
        
        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);
        
        return downloadURL;
    } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
    }
};

/**
 * Parse document using a free PDF parsing API
 * For production, consider using Firebase Functions with pdf-parse or mammoth
 */
export const parseDocumentWithAPI = async (fileUri, fileType) => {
    try {
        // Option 1: Use a free PDF parsing service like pdf.co (has free tier)
        // Option 2: Use Firebase Functions with pdf-parse npm package
        // Option 3: For simple text extraction, try reading as text
        
        if (fileType === 'txt' || fileType === 'text/plain') {
            const content = await FileSystem.readAsStringAsync(fileUri);
            return content;
        }
        
        // For PDF/DOCX, we'll upload to storage and use a backend service
        // This is a placeholder - you'll need to implement the backend
        const uploadedURL = await uploadDocumentToStorage(fileUri, `doc.${fileType}`);
        
        // Call your backend API or Firebase Function here
        // For now, return a sample text
        throw new Error('PDF/DOCX parsing requires backend setup. Please use the parseWithGeminiVision method for images or implement a Firebase Function.');
        
    } catch (error) {
        console.error('Error parsing document:', error);
        throw error;
    }
};

/**
 * Alternative: Use Gemini Vision to extract text from document images
 * Convert PDF pages to images and process with Gemini Pro Vision
 */
export const parseDocumentAsImage = async (imageUri) => {
    try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY_HERE");
        
        // Read image file
        const base64Data = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        
        const imageParts = [
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg",
                },
            },
        ];
        
        const prompt = "Extract all text content from this document image. Return only the text, nothing else.";
        
        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();
        
        return text;
    } catch (error) {
        console.error('Error parsing document as image:', error);
        throw error;
    }
};

/**
 * Simple text extraction fallback
 * Works for .txt files or content you can read directly
 */
export const extractSimpleText = async (fileUri) => {
    try {
        const content = await FileSystem.readAsStringAsync(fileUri);
        return content;
    } catch (error) {
        console.error('Error reading file:', error);
        // If direct reading fails, try as base64 then decode
        try {
            const base64 = await FileSystem.readAsStringAsync(fileUri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const decoded = atob(base64);
            return decoded;
        } catch (decodeError) {
            throw new Error('Could not read file content');
        }
    }
};