import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    Switch, Alert, ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { useDecks } from '../DeckContext';
import { useTheme } from '../ThemeContext';
import { generateFlashcardsWithGemini } from '../services/geminiService';
import { pickDocument, parseDocument } from '../services/documentParser';
import api from '../services/api';

const GenerateScreen = () => {
    const { colors, theme }                         = useTheme();
    const { refreshDecks }                          = useDecks();
    const navigation                                = useNavigation();

    const [deckName, setDeckName]                   = useState('');
    const [simpleDefinition, setSimpleDefinition]   = useState(false);
    const [numberOfCards, setNumberOfCards]         = useState(35);
    const [selectedFileName, setSelectedFileName]   = useState('No file selected');
    const [selectedFileUri, setSelectedFileUri]     = useState(null);
    const [fileContent, setFileContent]             = useState('');
    const [isLoading, setIsLoading]                 = useState(false);
    const [loadingMessage, setLoadingMessage]       = useState('');

    // ── File selection ────────────────────────────────────────
    // CHANGED — now supports PDF, DOCX, PPTX via Laravel backend parser
    // REMOVED — txt-only DocumentPicker and File class reader
    const handleSelectFile = async () => {
        if (isLoading) return;

        setIsLoading(true);
        setLoadingMessage('Reading file...');

        try {
            // Step 1 — pick file (get file object including name)
            const file = await pickDocument();

            // User cancelled the picker
            if (!file) return;

            setLoadingMessage('Parsing document...');

            // Step 2 — send to backend and get extracted text
            const result = await parseDocument(file);

            if (!result.text || !result.text.trim()) {
                Alert.alert('Empty File', 'The selected file appears to be empty or has no extractable text.');
                resetFileState();
                return;
            }

            const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');

            setFileContent(result.text);
            setSelectedFileName(file.name);       // ← real filename
            setDeckName(nameWithoutExtension);    // ← pre-fill deck name

            Alert.alert('File Ready', `"${file.name}" has been parsed and is ready for flashcard generation.`);

        } catch (error) {
            console.error('File parse error:', error);
            Alert.alert(
                'Parse Failed',
                error.message || 'Could not parse the document. Please ensure it is not corrupted.'
            );
            resetFileState();
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    // ── Generation ────────────────────────────────────────────
    // UNCHANGED
    const handleGenerateFlashcards = async () => {
        if (!deckName.trim()) {
            Alert.alert('Missing Deck Name', 'Please enter a name for your deck.');
            return;
        }
        if (selectedFileName === 'No file selected' || !fileContent) {
            Alert.alert('No File Selected', 'Please select a PDF, DOCX, or PPTX file first.');
            return;
        }
        if (fileContent.length < 100) {
            Alert.alert(
                'Limited Content',
                'The file appears to have very little text. Continue anyway?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Continue', onPress: proceedWithGeneration },
                ]
            );
            return;
        }

        await proceedWithGeneration();
    };

    // UNCHANGED — do not touch
    const proceedWithGeneration = async () => {
        setIsLoading(true);

        try {
            setLoadingMessage('AI is analyzing your document...');
            const flashcards = await generateFlashcardsWithGemini(
                fileContent,
                numberOfCards,
                simpleDefinition
            );

            if (!flashcards || flashcards.length === 0) {
                throw new Error('No flashcards were generated. Please try again.');
            }

            setLoadingMessage('Saving deck...');
            const deckResponse = await api.post('/decks', {
                title:      deckName.trim(),
                source:     selectedFileName,  // ← now real filename
                card_count: flashcards.length,
                mastery:    0,
                progress:   0,
                status:     'New',
            });

            const newDeck = deckResponse.data.deck;

            setLoadingMessage('Saving flashcards...');
            await api.post(`/decks/${newDeck.id}/flashcards`, {
                flashcards: flashcards.map(card => ({
                    question: card.question,
                    answer:   card.answer,
                })),
            });

            setLoadingMessage('Finishing up...');
            await refreshDecks();

            Alert.alert(
                'Success!',
                `Generated ${flashcards.length} flashcards for "${deckName.trim()}".`,
                [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
            );

            resetFileState();

        } catch (error) {
            Alert.alert(
                'Generation Failed',
                error.message || 'An error occurred. Please try again.'
            );
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    // ── Helpers ───────────────────────────────────────────────
    // UNCHANGED
    const resetFileState = () => {
        setDeckName('');
        setSelectedFileName('No file selected');
        setSelectedFileUri(null);
        setFileContent('');
        setNumberOfCards(35);
    };

    const isGenerateDisabled = isLoading || selectedFileName === 'No file selected' || !deckName.trim();

    // ── Render ────────────────────────────────────────────────
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>

            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <View style={[styles.loadingBox, { backgroundColor: colors.card }]}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={[styles.loadingText, { color: colors.text }]}>
                            {loadingMessage}
                        </Text>
                    </View>
                </View>
            )}

            {/* CHANGED — now supports PDF, DOCX, PPTX */}
            <TouchableOpacity
                style={[styles.selectFileButton, { backgroundColor: colors.primary }, isLoading && styles.disabled]}
                onPress={handleSelectFile}
                disabled={isLoading}
            >
                <MaterialCommunityIcons name="cloud-upload-outline" size={24} color="black" />
                <Text style={styles.selectFileButtonText}>Select File (PDF, DOCX, PPTX)</Text>
            </TouchableOpacity>

            <Text style={[styles.label, { color: colors.text }]}>Deck Name</Text>
            <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                value={deckName}
                onChangeText={setDeckName}
                placeholder="Enter deck name"
                placeholderTextColor={colors.subtext}
                editable={!isLoading}
            />

            <Text style={[styles.generatedFromFileText, { color: colors.subtext }]}>
                {selectedFileName === 'No file selected'
                    ? 'No file selected yet'
                    : `Generate from "${selectedFileName}"`}
            </Text>

            <View style={[styles.optionRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>Simple Definition</Text>
                <Switch
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={theme === 'dark' ? colors.card : '#f4f3f4'}
                    onValueChange={setSimpleDefinition}
                    value={simpleDefinition}
                    disabled={isLoading}
                />
            </View>

            <Text style={[styles.label, { color: colors.text }]}>
                Number of Cards ({Math.round(numberOfCards)} / 60)
            </Text>
            <Slider
                style={styles.slider}
                minimumValue={10}
                maximumValue={60}
                step={1}
                value={numberOfCards}
                onValueChange={setNumberOfCards}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.primary}
                disabled={isLoading}
            />
            <Text style={[styles.sliderValueText, { color: colors.text }]}>
                {Math.round(numberOfCards)}
            </Text>

            <TouchableOpacity
                style={[styles.generateButton, { backgroundColor: colors.primary }, isGenerateDisabled && styles.disabled]}
                onPress={handleGenerateFlashcards}
                disabled={isGenerateDisabled}
            >
                <Text style={styles.generateButtonText}>
                    {isLoading ? 'Generating...' : 'Generate Flashcards with AI'}
                </Text>
            </TouchableOpacity>

            <Text style={[styles.footerNote, { color: colors.subtext }]}>
                ⚡ Powered by Google Gemini AI
            </Text>

            {/* REMOVED — warning banner no longer needed */}

        </View>
    );
};

// UNCHANGED — banner styles removed, everything else preserved
const styles = StyleSheet.create({
    container:            { flex: 1, padding: 20, paddingTop: 40 },
    loadingOverlay:       { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    loadingBox:           { padding: 30, borderRadius: 15, alignItems: 'center', minWidth: 200 },
    loadingText:          { marginTop: 15, fontSize: 16, textAlign: 'center' },
    selectFileButton:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 10, marginBottom: 30, marginTop: 20, elevation: 3 },
    selectFileButtonText: { color: 'black', fontSize: 18, fontWeight: '600', marginLeft: 10 },
    label:                { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    textInput:            { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20, elevation: 1 },
    generatedFromFileText:{ fontSize: 14, marginBottom: 25, fontStyle: 'italic' },
    optionRow:            { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderRadius: 8, padding: 15, marginBottom: 20, elevation: 1 },
    optionLabel:          { fontSize: 16, fontWeight: '500' },
    slider:               { width: '100%', height: 40, marginTop: 10, marginBottom: 5 },
    sliderValueText:      { fontSize: 16, textAlign: 'center', marginBottom: 30 },
    generateButton:       { padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 5, elevation: 3 },
    generateButtonText:   { color: 'black', fontSize: 18, fontWeight: '600' },
    footerNote:           { textAlign: 'center', fontSize: 12, marginTop: 15, fontStyle: 'italic' },
    disabled:             { opacity: 0.5 },
});

export default GenerateScreen;