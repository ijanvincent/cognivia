import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDecks } from '../contexts/DeckContext';
import { useTheme } from '../contexts/ThemeContext';
import {
    generateFlashcards,
    CARD_TYPES,
    CARD_TYPE_META,
} from '../services/flashcardService';
import { pickDocument, parseDocument } from '../services/documentParser';
import api, { warmUpBackend } from '../services/api';
import {
    Screen, ScreenHeader, Card, SectionHeader,
    Pill, TextField, Button, LoadingOverlay,
} from '../components';
import { radius, spacing, typography } from '../theme/theme';

// ---------------------------------------------------------------------------
// Card type selector — single-select chip list
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
                            backgroundColor: selected ? colors.primarySoft : colors.surfaceSubtle,
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
                        color={selected ? colors.primary : colors.subtext}
                        style={styles.chipIcon}
                    />
                    <View style={styles.chipCopy}>
                        <Text style={[styles.chipLabel, { color: selected ? colors.primary : colors.text }]}>
                            {meta.label}
                        </Text>
                        <Text style={[styles.chipDescription, { color: colors.subtext }]}>
                            {meta.description}
                        </Text>
                    </View>
                    {selected && (
                        <MaterialCommunityIcons
                            name="check-circle"
                            size={18}
                            color={colors.primary}
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
    const { colors }       = useTheme();
    const { refreshDecks } = useDecks();
    const navigation       = useNavigation();

    const [deckName, setDeckName]                 = useState('');
    const [selectedTypes, setSelectedTypes]       = useState([CARD_TYPES.MIXED]);
    const [numberOfCards, setNumberOfCards]       = useState(35);
    const [selectedFileName, setSelectedFileName] = useState('No file selected');
    const [fileContent, setFileContent]           = useState('');
    const [isLoading, setIsLoading]               = useState(false);
    const [loadingMessage, setLoadingMessage]     = useState('');

    const hasSelectedFile = selectedFileName !== 'No file selected' && !!fileContent;
    const selectedTypeSummary = selectedTypes.includes(CARD_TYPES.MIXED)
        ? 'Mixed generation'
        : CARD_TYPE_META[selectedTypes[0]]?.label ?? 'One type selected';
    const canDecreaseCards = numberOfCards > 10 && !isLoading;
    const canIncreaseCards = numberOfCards < 60 && !isLoading;

    // Spin the free-tier backend up the moment this screen opens, so the long
    // generation request later doesn't pay a ~30s cold start on top of the AI
    // call (the combined time is what fails on-device). Best-effort; runs while
    // the user is still picking a file and naming the deck.
    useFocusEffect(
        useCallback(() => {
            warmUpBackend();
        }, [])
    );

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
        <Screen>
            <LoadingOverlay
                visible={isLoading}
                title="Building your deck"
                message={loadingMessage}
            />

            <ScreenHeader eyebrow="AI deck builder" title="Generate" />

            <Card>
                <SectionHeader
                    title="Source Document"
                    subtitle="PDF, DOCX, or PPTX"
                    right={
                        <Pill
                            icon={hasSelectedFile ? 'check-circle-outline' : 'clock-outline'}
                            label={hasSelectedFile ? 'Ready' : 'Required'}
                            tone={hasSelectedFile ? 'success' : 'neutral'}
                        />
                    }
                />

                <TouchableOpacity
                    style={[
                        styles.fileDropzone,
                        {
                            borderColor: hasSelectedFile ? colors.primary : colors.border,
                            backgroundColor: colors.surfaceSubtle,
                        },
                        isLoading && styles.disabled,
                    ]}
                    onPress={handleSelectFile}
                    disabled={isLoading}
                    activeOpacity={0.82}
                >
                    <View style={[
                        styles.fileIconWrap,
                        { backgroundColor: hasSelectedFile ? colors.primarySoft : colors.surfaceSubtle },
                    ]}>
                        <MaterialCommunityIcons
                            name={hasSelectedFile ? 'file-check-outline' : 'cloud-upload-outline'}
                            size={26}
                            color={hasSelectedFile ? colors.primary : colors.subtext}
                        />
                    </View>
                    <View style={styles.fileCopy}>
                        <Text style={[styles.fileTitle, { color: colors.text }]} numberOfLines={1}>
                            {hasSelectedFile ? selectedFileName : 'Select study material'}
                        </Text>
                        <Text style={[styles.fileSubtitle, { color: colors.subtext }]} numberOfLines={2}>
                            {hasSelectedFile
                                ? 'Tap to replace this document.'
                                : 'Upload a document with enough readable text for generation.'}
                        </Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={22} color={colors.subtext} />
                </TouchableOpacity>
            </Card>

            <Card>
                <SectionHeader title="Deck Details" subtitle="Name and output size" />

                <TextField
                    label="Deck Name"
                    value={deckName}
                    onChangeText={setDeckName}
                    placeholder="Enter deck name"
                    editable={!isLoading}
                />

                <Text style={[styles.fieldLabel, { color: colors.text }]}>Number of Cards</Text>
                <Text style={[styles.fieldHint, { color: colors.subtext }]}>
                    Adjust in sets of 5. Range: 10–60.
                </Text>

                <View style={[styles.stepper, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
                    <TouchableOpacity
                        style={[
                            styles.stepperButton,
                            { borderColor: colors.border, backgroundColor: colors.card },
                            !canDecreaseCards && styles.disabled,
                        ]}
                        onPress={() => adjustCardCount(-5)}
                        disabled={!canDecreaseCards}
                        activeOpacity={0.82}
                    >
                        <MaterialCommunityIcons name="minus" size={20} color={colors.text} />
                    </TouchableOpacity>

                    <View style={styles.stepperValueWrap}>
                        <Text style={[styles.stepperValue, { color: colors.text }]}>{numberOfCards}</Text>
                        <Text style={[styles.stepperLabel, { color: colors.subtext }]}>cards</Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.stepperButton,
                            { borderColor: colors.border, backgroundColor: colors.card },
                            !canIncreaseCards && styles.disabled,
                        ]}
                        onPress={() => adjustCardCount(5)}
                        disabled={!canIncreaseCards}
                        activeOpacity={0.82}
                    >
                        <MaterialCommunityIcons name="plus" size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </Card>

            <Card>
                <SectionHeader
                    title="Card Types"
                    subtitle="Choose one format. Mixed lets AI decide per card."
                    right={<Pill icon="card-multiple-outline" label={selectedTypeSummary} tone="primary" />}
                />
                <CardTypeSelector
                    selectedTypes={selectedTypes}
                    onToggle={handleTypeToggle}
                    disabled={isLoading}
                    colors={colors}
                />
            </Card>

            <Button
                label={isLoading ? 'Generating…' : 'Generate Flashcards'}
                icon="creation"
                onPress={handleGenerateFlashcards}
                disabled={isGenerateDisabled}
            />

            <Text style={[styles.footerNote, { color: colors.subtext }]}>
                Generation quality depends on the clarity and amount of text in your source document.
            </Text>
        </Screen>
    );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
    fileDropzone: {
        minHeight: 88,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderRadius: radius.md,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
    },
    fileIconWrap: {
        width: 46,
        height: 46,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    fileCopy:     { flex: 1, paddingRight: spacing.sm },
    fileTitle:    { fontSize: typography.size.body, fontWeight: typography.weight.semibold, marginBottom: 3 },
    fileSubtitle: { fontSize: typography.size.micro + 1, lineHeight: 17 },

    fieldLabel: { fontSize: typography.size.caption, fontWeight: typography.weight.semibold },
    fieldHint:  { fontSize: typography.size.micro + 1, marginTop: 2, marginBottom: spacing.md },

    stepper: {
        height: 64,
        borderWidth: 1,
        borderRadius: radius.md,
        paddingHorizontal: spacing.sm + 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stepperButton: {
        width: 44,
        height: 44,
        borderRadius: radius.sm + 2,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepperValueWrap: { alignItems: 'center', justifyContent: 'center' },
    stepperValue:     { fontSize: 26, fontWeight: typography.weight.bold },
    stepperLabel: {
        fontSize: typography.size.micro,
        fontWeight: typography.weight.semibold,
        textTransform: 'uppercase',
        letterSpacing: 0.7,
        marginTop: -2,
    },

    chipContainer: { gap: spacing.sm + 2 },
    chip: {
        minHeight: 60,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: radius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
    },
    chipIcon:        { marginRight: spacing.sm + 2 },
    chipCopy:        { flex: 1 },
    chipCheck:       { marginLeft: spacing.sm + 2 },
    chipLabel:       { fontSize: typography.size.caption + 1, fontWeight: typography.weight.semibold },
    chipDescription: { fontSize: typography.size.micro + 1, marginTop: 2, lineHeight: 16 },

    footerNote: {
        marginTop: spacing.md,
        fontSize: typography.size.micro + 1,
        lineHeight: 18,
        textAlign: 'center',
        paddingHorizontal: spacing.sm,
    },
    disabled: { opacity: 0.5 },
});

export default GenerateScreen;
