import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    Switch, Alert, ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { useDecks } from '../DeckContext';
import { useTheme } from '../ThemeContext';
import { generateFlashcardsWithGemini } from '../geminiService';
import api from '../services/api';

const GenerateScreen = () => {
    const { colors, theme } = useTheme();
    const [deckName, setDeckName]                   = useState('');
    const [simpleDefinition, setSimpleDefinition]   = useState(false);
    const [numberOfCards, setNumberOfCards]         = useState(35);
    const [selectedFileName, setSelectedFileName]   = useState('No file selected');
    const [selectedFileUri, setSelectedFileUri]     = useState(null);
    const [fileContent, setFileContent]             = useState('');
    const [isLoading, setIsLoading]                 = useState(false);
    const [loadingMessage, setLoadingMessage]       = useState('');

    const navigation = useNavigation();
    const { addDeck } = useDecks();

    const handleSelectFile = async () => {
        if (isLoading) return;
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['text/plain'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                const file     = result.assets[0];
                const fileName = file.name;
                const fileUri  = file.uri;

                setSelectedFileName(fileName);
                setSelectedFileUri(fileUri);
                setDeckName(fileName.replace(/\.[^/.]+$/, ""));

                setLoadingMessage('Reading file...');
                setIsLoading(true);

                try {
                    if (fileName.endsWith('.txt')) {
                        const content = await FileSystem.readAsStringAsync(fileUri);
                        setFileContent(content);
                        Alert.alert("File Selected", `Ready to generate flashcards from ${fileName}`);
                    } else {
                        Alert.alert(
                            "Unsupported Format",
                            `Only .txt files are supported.\n\nPlease convert your file to plain text (.txt) first.`,
                            [
                                { text: "Cancel", onPress: () => {
                                    setSelectedFileName('No file selected');
                                    setSelectedFileUri(null);
                                    setFileContent('');
                                }},
                            ]
                        );
                    }
                } catch (readError) {
                    console.error('Error reading file:', readError);
                    setFileContent('');
                } finally {
                    setIsLoading(false);
                    setLoadingMessage('');
                }
            }
        } catch (err) {
            Alert.alert("Error", "Could not select file. Please try again.");
            setIsLoading(false);
        }
    };

    const handleGenerateFlashcards = async () => {
        if (!deckName || selectedFileName === 'No file selected') {
            Alert.alert("Error", "Please select a file and enter a deck name.");
            return;
        }
        if (!fileContent || fileContent.length < 100) {
            Alert.alert(
                "Limited Content",
                "The file appears to have very little text. Continue anyway?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Continue", onPress: () => proceedWithGeneration() }
                ]
            );
            return;
        }
        await proceedWithGeneration();
    };

    const proceedWithGeneration = async () => {
        setIsLoading(true);
        setLoadingMessage('AI is analyzing your document...');

        try {
            setLoadingMessage('Generating flashcards with AI...');
            const flashcards = await generateFlashcardsWithGemini(
                fileContent, numberOfCards, simpleDefinition
            );

            if (!flashcards || flashcards.length === 0) {
                throw new Error('No flashcards were generated');
            }

            setLoadingMessage('Saving to database...');

            // Step 1 — Create deck via Laravel API
            const deckResponse = await api.post('/decks', {
                title:      deckName,
                source:     selectedFileName,
                card_count: flashcards.length,
                mastery:    0,
                progress:   0,
                status:     'New',
            });

            const newDeck = deckResponse.data.deck;

            // Step 2 — Save flashcards via Laravel API
            await api.post(`/decks/${newDeck.id}/flashcards`, {
                flashcards: flashcards.map(card => ({
                    question: card.question,
                    answer:   card.answer,
                })),
            });

            // Step 3 — Update local deck context
            addDeck({
                deckName:      deckName,
                fileName:      selectedFileName,
                numberOfCards: flashcards.length,
                status:        'New',
            }).catch(() => {}); // non-blocking

            Alert.alert(
                "Success!",
                `Generated ${flashcards.length} flashcards for "${deckName}"`,
                [{ text: "OK", onPress: () => navigation.navigate('Home') }]
            );

            // Reset form
            setDeckName('');
            setSelectedFileName('No file selected');
            setSelectedFileUri(null);
            setFileContent('');
            setNumberOfCards(35);

        } catch (error) {
            console.error("Generation Error:", error);
            let msg = "An error occurred while generating flashcards.";
            if (error.message.includes('API key'))   msg = "Invalid API key. Check your Gemini API configuration.";
            else if (error.message.includes('quota')) msg = "API quota exceeded. Please try again later.";
            else if (error.message)                  msg = error.message;
            Alert.alert("Generation Failed", msg);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <View style={[styles.loadingBox, { backgroundColor: colors.card }]}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={[styles.loadingText, { color: colors.text }]}>{loadingMessage}</Text>
                    </View>
                </View>
            )}

            <TouchableOpacity
                style={[styles.selectFileButton, { backgroundColor: colors.primary }, isLoading && styles.disabled]}
                onPress={handleSelectFile}
                disabled={isLoading}
            >
                <MaterialCommunityIcons name="cloud-upload-outline" size={24} color="black" />
                <Text style={styles.selectFileButtonText}>Select TXT File</Text>
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
                {selectedFileName === 'No file selected' ? 'No file selected yet' : `Generate from "${selectedFileName}"`}
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

            <Text style={[styles.label, { color: colors.text }]}>Number of Cards ({Math.round(numberOfCards)} / 60)</Text>
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
            <Text style={[styles.sliderValueText, { color: colors.text }]}>{Math.round(numberOfCards)}</Text>

            <TouchableOpacity
                style={[styles.generateButton, { backgroundColor: colors.primary },
                    (isLoading || selectedFileName === 'No file selected') && styles.disabled]}
                onPress={handleGenerateFlashcards}
                disabled={isLoading || selectedFileName === 'No file selected'}
            >
                <Text style={styles.generateButtonText}>
                    {isLoading ? 'Generating...' : 'Generate Flashcards with AI'}
                </Text>
            </TouchableOpacity>

            <Text style={[styles.footerNote, { color: colors.subtext }]}>⚡ Powered by Google Gemini AI</Text>

            <View style={styles.banner}>
                <Text style={styles.bannerTitle}>⚠️ System Notice</Text>
                <Text style={styles.bannerMsg}>Only .txt files are supported for flashcard generation.</Text>
                <Text style={styles.bannerMsg}>Convert PDF or Word files to plain text (.txt) using WPS or any text editor.</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 40 },
    loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    loadingBox: { padding: 30, borderRadius: 15, alignItems: 'center', minWidth: 200 },
    loadingText: { marginTop: 15, fontSize: 16, textAlign: 'center' },
    selectFileButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 10, marginBottom: 30, marginTop: 20, elevation: 3 },
    selectFileButtonText: { color: 'black', fontSize: 18, fontWeight: '600', marginLeft: 10 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    textInput: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20, elevation: 1 },
    generatedFromFileText: { fontSize: 14, marginBottom: 25, fontStyle: 'italic' },
    optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderRadius: 8, padding: 15, marginBottom: 20, elevation: 1 },
    optionLabel: { fontSize: 16, fontWeight: '500' },
    slider: { width: '100%', height: 40, marginTop: 10, marginBottom: 5 },
    sliderValueText: { fontSize: 16, textAlign: 'center', marginBottom: 30 },
    generateButton: { padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 5, elevation: 3 },
    generateButtonText: { color: 'black', fontSize: 18, fontWeight: '600' },
    footerNote: { textAlign: 'center', fontSize: 12, marginTop: 15, fontStyle: 'italic' },
    disabled: { opacity: 0.5 },
    banner: { backgroundColor: '#fff3cd', borderColor: '#ffeeba', borderWidth: 1, borderRadius: 8, padding: 15, margin: 10 },
    bannerTitle: { fontWeight: 'bold', fontSize: 16, color: '#856404', marginBottom: 8 },
    bannerMsg: { fontSize: 14, color: '#856404', marginBottom: 4 },
});

export default GenerateScreen;