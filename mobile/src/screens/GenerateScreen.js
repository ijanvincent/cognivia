import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    Alert, ActivityIndicator, ScrollView, StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useDecks } from '../contexts/DeckContext';
import { useTheme } from '../contexts/ThemeContext';
import {
    generateFlashcards,
    CARD_TYPES,
    CARD_TYPE_META,
} from '../services/flashcardService';
import { pickDocument, parseDocument } from '../services/documentParser';
import api from '../services/api';

// ---------------------------------------------------------------------------
// Card type selector — multi-select chip list
// ---------------------------------------------------------------------------

const getControlTextColor = (selected, colors, theme) => {
    if (!selected) return colors.text;
    return theme === 'dark' ? '#07111f' : '#ffffff';
};

const getControlIconColor = (selected, colors, theme) => {
    if (!selected) return colors.subtext;
    return theme === 'dark' ? '#07111f' : '#ffffff';
};

const CardTypeSelector = ({ selectedTypes, onToggle, disabled, colors, theme }) => (
    <View style={styles.chipContainer}>
        {Object.values(CARD_TYPES).map((type) => {
            const meta     = CARD_TYPE_META[type];
            const selected = selectedTypes.includes(type);
            const selectedTextColor = getControlTextColor(selected, colors, theme);
            const selectedIconColor = getControlIconColor(selected, colors, theme);

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
                        size={18}
                        color={selectedIconColor}
                        style={{ marginRight: 10 }}
                    />
                    <View style={styles.chipCopy}>
                        <Text style={[
                            styles.chipLabel,
                            { color: selectedTextColor },
                        ]}>
                            {meta.label}
                        </Text>
                        <Text style={[
                            styles.chipDescription,
                            { color: selected ? selectedTextColor : colors.subtext },
                        ]}>
                            {meta.description}
                        </Text>
                    </View>
                    {selected && (
                        <MaterialCommunityIcons
                            name="check-circle"
                            size={18}
                            color={selectedIconColor}
                            style={styles.chipCheck}
                        />
                    )}
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
    const isDark = theme === 'dark';
    const hasSelectedFile = selectedFileName !== 'No file selected' && !!fileContent;
    const selectedTypeSummary = selectedTypes.includes(CARD_TYPES.MIXED)
        ? 'Mixed generation'
        : CARD_TYPE_META[selectedTypes[0]]?.label ?? 'One type selected';
    const canDecreaseCards = numberOfCards > 10 && !isLoading;
    const canIncreaseCards = numberOfCards < 60 && !isLoading;

    // -----------------------------------------------------------------------
    // Type toggle — enforces at least one selection at all times
    // -----------------------------------------------------------------------

    const handleTypeToggle = (type) => {
        setSelectedTypes([type]);
    };

    const adjustCardCount = (delta) => {
        if (isLoading) return;

        setNumberOfCards((current) => {
            const nextValue = current + delta;
            return Math.min(60, Math.max(10, nextValue));
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

            const flashcards = await generateFlashcards(
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
                // FIX: was 'Home' which does not exist in the navigator.
                // The correct screen name is 'HomeTabs' (see App.js).
                // The old value caused a RouteNotFoundException that was
                // caught by the catch block and shown as "Generation Failed".
                [{ text: 'OK', onPress: () => navigation.navigate('HomeTabs') }]
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
        || !hasSelectedFile
        || !deckName.trim();

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------

    return (
        <View style={[styles.screen, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <View style={[styles.loadingBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={[styles.loadingTitle, { color: colors.text }]}>Building your deck</Text>
                        <Text style={[styles.loadingText, { color: colors.subtext }]}>
                            {loadingMessage}
                        </Text>
                    </View>
                </View>
            )}

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={isDark ? ['#171923', '#0f172a'] : ['#ffffff', '#eef6ff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.heroCard, { borderColor: colors.border }]}
                >
                    <View style={styles.heroTopRow}>
                        <View style={styles.heroIcon}>
                            <MaterialCommunityIcons name="creation-outline" size={22} color="#38bdf8" />
                        </View>
                        <View style={styles.heroCopy}>
                            <Text style={[styles.heroEyebrow, { color: isDark ? '#94a3b8' : '#64748b' }]}>AI deck builder</Text>
                            <Text style={[styles.heroTitle, { color: colors.text }]}>Generate flashcards</Text>
                        </View>
                    </View>
                    <Text style={[styles.heroBody, { color: isDark ? '#cbd5e1' : '#475569' }]}>
                        Upload a study document, choose the card style, and let CogniVia prepare a focused review deck.
                    </Text>
                </LinearGradient>

                <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Source Document</Text>
                            <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>PDF, DOCX, or PPTX</Text>
                        </View>
                        <View style={[styles.statusPill, { backgroundColor: hasSelectedFile ? 'rgba(52,211,153,0.14)' : 'rgba(148,163,184,0.14)' }]}>
                            <MaterialCommunityIcons
                                name={hasSelectedFile ? 'check-circle-outline' : 'clock-outline'}
                                size={14}
                                color={hasSelectedFile ? '#34d399' : colors.subtext}
                            />
                            <Text style={[styles.statusPillText, { color: hasSelectedFile ? '#34d399' : colors.subtext }]}>
                                {hasSelectedFile ? 'Ready' : 'Required'}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.fileDropzone,
                            { borderColor: hasSelectedFile ? '#38bdf8' : colors.border, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' },
                            isLoading && styles.disabled,
                        ]}
                        onPress={handleSelectFile}
                        disabled={isLoading}
                        activeOpacity={0.82}
                    >
                        <View style={[styles.fileIconWrap, { backgroundColor: hasSelectedFile ? 'rgba(56,189,248,0.14)' : 'rgba(148,163,184,0.14)' }]}>
                            <MaterialCommunityIcons
                                name={hasSelectedFile ? 'file-check-outline' : 'cloud-upload-outline'}
                                size={28}
                                color={hasSelectedFile ? '#38bdf8' : colors.subtext}
                            />
                        </View>
                        <View style={styles.fileCopy}>
                            <Text style={[styles.fileTitle, { color: colors.text }]} numberOfLines={1}>
                                {hasSelectedFile ? selectedFileName : 'Select study material'}
                            </Text>
                            <Text style={[styles.fileSubtitle, { color: colors.subtext }]} numberOfLines={2}>
                                {hasSelectedFile ? 'Tap to replace this document.' : 'Upload a document with enough readable text for generation.'}
                            </Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={22} color={colors.subtext} />
                    </TouchableOpacity>
                </View>

                <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Deck Details</Text>
                            <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>Name and output size</Text>
                        </View>
                    </View>

                    <Text style={[styles.fieldLabel, { color: colors.text }]}>Deck Name</Text>
                    <TextInput
                        style={[
                            styles.textInput,
                            { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc', borderColor: colors.border, color: colors.text },
                        ]}
                        value={deckName}
                        onChangeText={setDeckName}
                        placeholder="Enter deck name"
                        placeholderTextColor={colors.subtext}
                        editable={!isLoading}
                    />

                    <View style={styles.quantityHeader}>
                        <View>
                            <Text style={[styles.fieldLabel, { color: colors.text }]}>Number of Cards</Text>
                            <Text style={[styles.fieldHint, { color: colors.subtext }]}>Adjust in sets of 5. Range: 10-60.</Text>
                        </View>
                    </View>

                    <View style={[styles.stepper, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc', borderColor: colors.border }]}>
                        <TouchableOpacity
                            style={[styles.stepperButton, { borderColor: colors.border }, !canDecreaseCards && styles.disabledStepperButton]}
                            onPress={() => adjustCardCount(-5)}
                            disabled={!canDecreaseCards}
                            activeOpacity={0.82}
                        >
                            <MaterialCommunityIcons name="minus" size={20} color={canDecreaseCards ? colors.text : colors.subtext} />
                        </TouchableOpacity>

                        <View style={styles.stepperValueWrap}>
                            <Text style={[styles.stepperValue, { color: colors.text }]}>{numberOfCards}</Text>
                            <Text style={[styles.stepperLabel, { color: colors.subtext }]}>cards</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.stepperButton, { borderColor: colors.border }, !canIncreaseCards && styles.disabledStepperButton]}
                            onPress={() => adjustCardCount(5)}
                            disabled={!canIncreaseCards}
                            activeOpacity={0.82}
                        >
                            <MaterialCommunityIcons name="plus" size={20} color={canIncreaseCards ? colors.text : colors.subtext} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Card Types</Text>
                            <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>
                                Choose one format. Mixed lets AI decide per card.
                            </Text>
                        </View>
                        <View style={[styles.statusPill, { backgroundColor: 'rgba(56,189,248,0.14)' }]}>
                            <MaterialCommunityIcons name="card-multiple-outline" size={14} color="#38bdf8" />
                            <Text style={[styles.statusPillText, { color: '#38bdf8' }]}>
                                {selectedTypeSummary}
                            </Text>
                        </View>
                    </View>
                    <CardTypeSelector
                        selectedTypes={selectedTypes}
                        onToggle={handleTypeToggle}
                        disabled={isLoading}
                        colors={colors}
                        theme={theme}
                    />
                </View>

                <TouchableOpacity
                    style={[
                        styles.generateButton,
                        { backgroundColor: '#38bdf8' },
                        isGenerateDisabled && styles.disabled,
                    ]}
                    onPress={handleGenerateFlashcards}
                    disabled={isGenerateDisabled}
                    activeOpacity={0.88}
                >
                    <MaterialCommunityIcons name="creation" size={19} color="#07111f" />
                    <Text style={styles.generateButtonText}>
                        {isLoading ? 'Generating...' : 'Generate Flashcards'}
                    </Text>
                </TouchableOpacity>

                <Text style={[styles.footerNote, { color: colors.subtext }]}>
                    Generation quality depends on the clarity and amount of text in your source document.
                </Text>
            </ScrollView>
        </View>
    );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
    screen:              { flex: 1 },
    scroll:              { flex: 1 },
    container:           { paddingHorizontal: 20, paddingTop: 42, paddingBottom: 72 },

    loadingOverlay:      {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(7,8,15,0.72)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: 28,
    },
    loadingBox:          {
        width: '100%',
        maxWidth: 320,
        borderWidth: 1,
        borderRadius: 18,
        padding: 24,
        alignItems: 'center',
    },
    loadingTitle:        { marginTop: 14, fontSize: 18, fontWeight: '800', textAlign: 'center' },
    loadingText:         { marginTop: 6, fontSize: 14, lineHeight: 20, textAlign: 'center' },

    heroCard:            { borderRadius: 18, borderWidth: 1, padding: 18, marginBottom: 16, overflow: 'hidden' },
    heroTopRow:          { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    heroIcon:            { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(56,189,248,0.14)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    heroCopy:            { flex: 1 },
    heroEyebrow:         { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 3 },
    heroTitle:           { fontSize: 26, fontWeight: '800' },
    heroBody:            { fontSize: 14, lineHeight: 21 },

    sectionCard:         { borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 14 },
    sectionHeader:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
    sectionTitle:        { fontSize: 17, fontWeight: '800' },
    sectionSubtitle:     { fontSize: 12, fontWeight: '600', marginTop: 2 },
    statusPill:          { height: 28, borderRadius: 14, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', gap: 5 },
    statusPillText:      { fontSize: 11, fontWeight: '800' },

    fileDropzone:        { minHeight: 94, borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center' },
    fileIconWrap:        { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    fileCopy:            { flex: 1, paddingRight: 8 },
    fileTitle:           { fontSize: 15, fontWeight: '800', marginBottom: 4 },
    fileSubtitle:        { fontSize: 12, lineHeight: 17 },

    fieldLabel:          { fontSize: 14, fontWeight: '800', marginBottom: 8 },
    fieldHint:           { fontSize: 12, fontWeight: '600', marginTop: -2 },
    textInput:           { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, height: 48, fontSize: 15, marginBottom: 18 },
    quantityHeader:      { marginBottom: 12 },
    stepper:             { height: 68, borderWidth: 1, borderRadius: 18, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    stepperButton:       { width: 44, height: 44, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    disabledStepperButton: { opacity: 0.42 },
    stepperValueWrap:    { alignItems: 'center', justifyContent: 'center' },
    stepperValue:        { fontSize: 28, fontWeight: '900' },
    stepperLabel:        { fontSize: 11, fontWeight: '800', marginTop: -2, textTransform: 'uppercase', letterSpacing: 0.7 },

    chipContainer:       { gap: 10 },
    chip:                { minHeight: 64, flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 15, paddingVertical: 12, paddingHorizontal: 14 },
    chipCopy:            { flex: 1 },
    chipCheck:           { marginLeft: 10 },
    chipLabel:           { fontSize: 14, fontWeight: '800' },
    chipDescription:     { fontSize: 12, marginTop: 2, lineHeight: 16 },

    generateButton:      { height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginTop: 4, flexDirection: 'row', gap: 8, elevation: 3 },
    generateButtonText:  { color: '#07111f', fontSize: 16, fontWeight: '900' },
    footerNote:          { marginTop: 12, fontSize: 12, lineHeight: 18, textAlign: 'center', paddingHorizontal: 10 },
    disabled:            { opacity: 0.5 },
});

export default GenerateScreen;
