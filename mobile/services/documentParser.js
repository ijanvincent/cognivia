import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import api from './api';

/**
 * Supported MIME types for document parsing.
 */
const SUPPORTED_MIME_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

/**
 * Supported file extensions for validation.
 */
const SUPPORTED_EXTENSIONS = ['pdf', 'docx', 'pptx'];

/**
 * Max file size: 10MB in bytes.
 */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Open document picker and let user select a PDF, DOCX, or PPTX file.
 * Returns the picked file asset or null if cancelled.
 *
 * @returns {Promise<object|null>}
 */
export const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
        type: SUPPORTED_MIME_TYPES,
        copyToCacheDirectory: true,
    });

    if (result.canceled) return null;

    const file = result.assets[0];

    // Client-side size validation before uploading
    if (file.size && file.size > MAX_FILE_SIZE_BYTES) {
        throw new Error('File exceeds the 10MB size limit.');
    }

    // Client-side extension validation
    const extension = file.name?.split('.').pop()?.toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(extension)) {
        throw new Error('Only PDF, DOCX, and PPTX files are supported.');
    }

    return file;
};

/**
 * Send picked document to Laravel backend for parsing.
 * Uses axios so the auth interceptor attaches Bearer token automatically.
 *
 * @param {object} file - File asset from pickDocument()
 * @returns {Promise<{text: string, filename: string, extension: string}>}
 */
export const parseDocument = async (file) => {
    // Build FormData — React Native requires uri, name, type
    const formData = new FormData();
    formData.append('file', {
        uri: Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
        name: file.name,
        type: file.mimeType,
    });

    const response = await api.post('/document/parse', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    if (!response.data.success) {
        throw new Error(response.data.message || 'Document parsing failed.');
    }

    return response.data.data; // { text, filename, extension }
};

/**
 * Convenience function — pick and parse in one call.
 * Returns extracted text string, or null if user cancelled.
 *
 * @returns {Promise<string|null>}
 */
export const pickAndParseDocument = async () => {
    const file = await pickDocument();
    if (!file) return null;

    const result = await parseDocument(file);
    return result.text;
};