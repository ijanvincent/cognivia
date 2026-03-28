import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import api from './api';


const SUPPORTED_MIME_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];


const SUPPORTED_EXTENSIONS = ['pdf', 'docx', 'pptx'];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
        type: SUPPORTED_MIME_TYPES,
        copyToCacheDirectory: true,
    });

    if (result.canceled) return null;

    const file = result.assets[0];

    if (file.size && file.size > MAX_FILE_SIZE_BYTES) {
        throw new Error('File exceeds the 10MB size limit.');
    }

    const extension = file.name?.split('.').pop()?.toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(extension)) {
        throw new Error('Only PDF, DOCX, and PPTX files are supported.');
    }

    return file;
};

export const parseDocument = async (file) => {

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

    return response.data.data; 
};


export const pickAndParseDocument = async () => {
    const file = await pickDocument();
    if (!file) return null;

    const result = await parseDocument(file);
    return result.text;
};