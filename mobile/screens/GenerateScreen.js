import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { useDecks } from '../DeckContext';
import { useTheme } from '../ThemeContext';
import {
    generateFlashcardsWithGemini,
    CARD_TYPES,
    CARD_TYPE_META,
} from '../services/geminiService';
import { pickDocument, parseDocument } from '../services/documentParser';
import api from '../services/api';

// ---------------------------------------------------------------------------
// Card type selector — multi-select chip list
// ---------------------------------------------------------------------------

const CardTypeSelector = ({ selectedTypes, onToggle, disabled, colors }) => (
    <View style={styles.chipContainer}>
        {Object.values(CARD_TYPES).map((type) => {
            const meta     = CARD_TYPE_META[type];
            const selected = selectedTypes.includes(type);

            return (
                <TouchableOpacity
                    key={type}
                    style={[
                        styles.chip,
                        {
                            backgroundColor: selected ? colors.primary : colors.card,
                            borderColor:     selected ? colors.primary : colors.border,
                        },
                    ]}
                    onPress={() => onToggle(type)}
                    disabled={disabled}
                    activeOpacity={0.75}
                >
                    <MaterialCommunityIcons
                        name={meta.icon}
                        size={16}
                        color={selected ? '#000' : colors.subtext}
                        style={{ marginRight: 6 }}
                    />
                    <View>
                        <Text style={[
                            styles.chipLabel,
                            { color: selected ? '#000' : colors.text },
                        ]}>
                            {meta.label}
                        </Text>
                        <Text style={[
                            styles.chipDescription,
                            { color: selected ? '#000' : colors.subtext },
                        ]}>
                            {meta.description}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        })}
    </View>
);

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

const GenerateScreen = () => {
    const { colors, theme }                         = useTheme();
    const { refreshDecks }                          = useDecks();
    const navigation                                = useNavigation();

    const [deckName, setDeckName]                   = useState('');
    const [selectedTypes, setSelectedTypes]         = useState([CARD_TYPES.MIXED]);
    const [numberOfCards, setNumberOfCards]         = useState(35);
    const [selectedFileName, setSelectedFileName]   = useState('No file selected');
    const [fileContent, setFileContent]             = useState('');
    const [isLoading, setIsLoading]                 = useState(false);
    const [loadingMessage, setLoadingMessage]       = useState('');

    // -----------------------------------------------------------------------
    // Type toggle — enforces at least one selection at all times
    // -----------------------------------------------------------------------

    const handleTypeToggle = (type) => {
        setSelectedTypes((prev) => {
            if (prev.includes(type) && prev.length === 1) return prev;

            if (type !== CARD_TYPES.MIXED && prev.includes(CARD_TYPES.MIXED)) {
                return [type];
            }

            if (type === CARD_TYPES.MIXED) {
                return [CARD_TYPES.MIXED];
            }

            return prev.includes(type)
                ? prev.filter((t) => t !== type)
                : [...prev, type];
        });
    };

    // -----------------------------------------------------------------------
    // File selection
    // -----------------------------------------------------------------------

    const handleSelectFile = async () => {
        if (isLoading) return;

        setIsLoading(true);
        setLoadingMessage('Reading file...');

        try {
            const file = await pickDocument();
            if (!file) return;

            setLoadingMessage('Parsing document...');
            const result = await parseDocument(file);

            if (!result.text || !result.text.trim()) {
                Alert.alert('Empty File', 'The selected file appears to be empty or has no extractable text.');
                resetFileState();
                return;
            }

            const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
            setFileContent(result.text);
            setSelectedFileName(file.name);
            setDeckName(nameWithoutExtension);

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

    // -----------------------------------------------------------------------
    // Generation
    // -----------------------------------------------------------------------

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
                    // CHANGE — Bug 4 fix:
                    // What: Wrapped proceedWithGeneration in an async arrow
                    //       function instead of passing the reference directly.
                    // Why:  React Native's Alert.alert calls onPress handlers
                    //       synchronously and does not await their return value.
                    //       Passing `proceedWithGeneration` directly meant any
                    //       rejection it threw became an unhandled promise
                    //       rejection — silently swallowed, no error shown to
                    //       the user, no loading spinner dismissed. The async
                    //       wrapper ensures the promise is properly awaited
                    //       within its own async context and errors surface
                    //       through the try/catch inside proceedWithGeneration.
                    { text: 'Continue', onPress: () => { proceedWithGeneration(); } },
                ]
            );
            return;
        }

        await proceedWithGeneration();
    };

    const proceedWithGeneration = async () => {
        setIsLoading(true);

        try {
            setLoadingMessage('AI is analyzing your document...');

            const flashcards = await generateFlashcardsWithGemini(
                fileContent,
                numberOfCards,
                selectedTypes,
            );

            if (!flashcards || flashcards.length === 0) {
                throw new Error('No flashcards were generated. Please try again.');
            }

            setLoadingMessage('Saving deck...');
            const deckResponse = await api.post('/decks', {
                title:      deckName.trim(),
                source:     selectedFileName,
                card_count: flashcards.length,
                mastery:    0,
                progress:   0,
                status:     'New',
            });

            const newDeck = deckResponse.data.deck;

            setLoadingMessage('Saving flashcards...');
            await api.post(`/decks/${newDeck.id}/flashcards`, {
                flashcards: flashcards.map((card) => ({
                    type:        card.type,
                    question:    card.question,
                    answer:      card.answer,
                    options:     card.options     ?? null,
                    explanation: card.explanation ?? null,
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

    const resetFileState = () => {
        setDeckName('');
        setSelectedFileName('No file selected');
        setFileContent('');
        setNumberOfCards(35);
        setSelectedTypes([CARD_TYPES.MIXED]);
    };

    const isGenerateDisabled = isLoading
        || selectedFileName === 'No file selected'
        || !deckName.trim();

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------

    return (
        <ScrollView
            style={{ backgroundColor: colors.background }}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
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

            {/* File picker */}
            <TouchableOpacity
                style={[
                    styles.selectFileButton,
                    { backgroundColor: colors.primary },
                    isLoading && styles.disabled,
                ]}
                onPress={handleSelectFile}
                disabled={isLoading}
            >
                <MaterialCommunityIcons name="cloud-upload-outline" size={24} color="black" />
                <Text style={styles.selectFileButtonText}>Select File (PDF, DOCX, PPTX)</Text>
            </TouchableOpacity>

            {/* Deck name */}
            <Text style={[styles.label, { color: colors.text }]}>Deck Name</Text>
            <TextInput
                style={[
                    styles.textInput,
                    { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
                ]}
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

            {/* Card type selector */}
            <Text style={[styles.label, { color: colors.text }]}>Card Type</Text>
            <Text style={[styles.sublabel, { color: colors.subtext }]}>
                Select one or more types. Mixed lets the AI decide per card.
            </Text>
            <CardTypeSelector
                selectedTypes={selectedTypes}
                onToggle={handleTypeToggle}
                disabled={isLoading}
                colors={colors}
            />

            {/* Number of cards */}
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

            {/* Generate button */}
            <TouchableOpacity
                style={[
                    styles.generateButton,
                    { backgroundColor: colors.primary },
                    isGenerateDisabled && styles.disabled,
                ]}
                onPress={handleGenerateFlashcards}
                disabled={isGenerateDisabled}
            >
                <Text style={styles.generateButtonText}>
                    {isLoading ? 'Generating...' : 'Generate Flashcards with AI'}
                </Text>
            </TouchableOpacity>

        </ScrollView>
    );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
    container:            { padding: 20, paddingTop: 40, paddingBottom: 60 },
    loadingOverlay:       { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    loadingBox:           { padding: 30, borderRadius: 15, alignItems: 'center', minWidth: 200 },
    loadingText:          { marginTop: 15, fontSize: 16, textAlign: 'center' },
    selectFileButton:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 10, marginBottom: 30, marginTop: 20, elevation: 3 },
    selectFileButtonText: { color: 'black', fontSize: 18, fontWeight: '600', marginLeft: 10 },
    label:                { fontSize: 16, fontWeight: '600', marginBottom: 6 },
    sublabel:             { fontSize: 13, marginBottom: 12 },
    textInput:            { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20, elevation: 1 },
    generatedFromFileText:{ fontSize: 14, marginBottom: 25, fontStyle: 'italic' },
    chipContainer:        { flexDirection: 'column', gap: 10, marginBottom: 28 },
    chip:                 { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14 },
    chipLabel:            { fontSize: 15, fontWeight: '600' },
    chipDescription:      { fontSize: 12, marginTop: 1 },
    slider:               { width: '100%', height: 40, marginTop: 10, marginBottom: 5 },
    sliderValueText:      { fontSize: 16, textAlign: 'center', marginBottom: 30 },
    generateButton:       { padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 5, elevation: 3 },
    generateButtonText:   { color: 'black', fontSize: 18, fontWeight: '600' },
    disabled:             { opacity: 0.5 },
});

export default GenerateScreen;