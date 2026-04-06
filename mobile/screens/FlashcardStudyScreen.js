import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    Alert, ActivityIndicator, KeyboardAvoidingView,
    Platform, ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { checkAnswerWithGemini } from '../services/geminiService';
import api from '../services/api';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CARD_TYPES = {
    IDENTIFICATION:  'identification',
    MULTIPLE_CHOICE: 'multiple_choice',
    EXPLANATORY:     'explanatory',
    TRUE_FALSE:      'true_false',
    MIXED:           'mixed',
};

const MCQ_OPTION_KEYS = ['A', 'B', 'C', 'D'];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Type badge shown on the question card so the user knows
 * what kind of interaction is expected before they see the input.
 */
const CardTypeBadge = ({ type, colors }) => {
    const META = {
        [CARD_TYPES.IDENTIFICATION]:  { label: 'Identification', icon: 'label-outline' },
        [CARD_TYPES.MULTIPLE_CHOICE]: { label: 'Multiple Choice', icon: 'format-list-bulleted' },
        [CARD_TYPES.EXPLANATORY]:     { label: 'Explanatory',     icon: 'text-box-outline' },
        [CARD_TYPES.TRUE_FALSE]:      { label: 'True or False',   icon: 'check-circle-outline' },
        [CARD_TYPES.MIXED]:           { label: 'Mixed',           icon: 'shuffle-variant' },
    };

    const meta = META[type] || META[CARD_TYPES.IDENTIFICATION];

    return (
        <View style={[styles.badge, { backgroundColor: colors.primary + '22', borderColor: colors.primary + '55' }]}>
            <MaterialCommunityIcons name={meta.icon} size={12} color={colors.primary} />
            <Text style={[styles.badgeText, { color: colors.primary }]}>{meta.label}</Text>
        </View>
    );
};

/**
 * Result box — shared across all card types.
 */
const ResultBox = ({ isCorrect, feedback, correctAnswer, colors }) => (
    <View style={[styles.resultBox, {
        backgroundColor: isCorrect ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)',
        borderColor:     isCorrect ? '#4CAF50' : '#F44336',
    }]}>
        <View style={styles.resultHeader}>
            <MaterialCommunityIcons
                name={isCorrect ? 'check-circle' : 'close-circle'}
                size={32}
                color={isCorrect ? '#4CAF50' : '#F44336'}
            />
            <Text style={[styles.resultTitle, { color: isCorrect ? '#4CAF50' : '#F44336' }]}>
                {isCorrect ? 'Correct!' : 'Not Quite'}
            </Text>
        </View>

        {!!feedback && (
            <Text style={[styles.feedbackText, { color: colors.text }]}>{feedback}</Text>
        )}

        <View style={[styles.correctAnswerBox, {
            backgroundColor: colors.background,
            borderColor:     colors.border,
        }]}>
            <Text style={[styles.correctAnswerLabel, { color: colors.subtext }]}>Correct Answer:</Text>
            <Text style={[styles.correctAnswerText, { color: colors.text }]}>{correctAnswer}</Text>
        </View>
    </View>
);

// ---------------------------------------------------------------------------
// Card-type interaction components
// ---------------------------------------------------------------------------

/**
 * Identification & Explanatory — text input + AI check.
 */
const TextAnswerMode = ({
    card, userAnswer, setUserAnswer,
    isChecking, showResult, isCorrect, feedback,
    onCheck, colors,
}) => (
    <View style={styles.answerSection}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Your Answer:</Text>
        <TextInput
            style={[styles.answerInput, {
                backgroundColor: colors.card,
                borderColor:     colors.border,
                color:           colors.text,
            }]}
            placeholder="Type your answer here..."
            placeholderTextColor={colors.subtext}
            value={userAnswer}
            onChangeText={setUserAnswer}
            multiline
            editable={!showResult}
        />

        {!showResult && (
            <TouchableOpacity
                style={[styles.checkButton, { backgroundColor: colors.primary }, isChecking && styles.disabled]}
                onPress={onCheck}
                disabled={isChecking}
            >
                {isChecking ? (
                    <ActivityIndicator color="#000000" />
                ) : (
                    <>
                        <MaterialCommunityIcons name="check-circle" size={20} color="#000000" />
                        <Text style={styles.checkButtonText}>Check Answer</Text>
                    </>
                )}
            </TouchableOpacity>
        )}

        {showResult && (
            <ResultBox
                isCorrect={isCorrect}
                feedback={feedback}
                correctAnswer={card.answer}
                colors={colors}
            />
        )}
    </View>
);

/**
 * Multiple Choice — tap A/B/C/D, instant feedback.
 */
const MultipleChoiceMode = ({
    card, showResult, isCorrect, selectedOption,
    onSelectOption, colors,
}) => {
    const options = card.options || {};

    return (
        <View style={styles.answerSection}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Choose the correct answer:</Text>

            {MCQ_OPTION_KEYS.map((key) => {
                if (!options[key]) return null;

                const isSelected = selectedOption === key;
                const isAnswer   = card.answer === key;

                let bgColor     = colors.card;
                let borderColor = colors.border;
                let textColor   = colors.text;

                if (showResult) {
                    if (isAnswer) {
                        bgColor     = 'rgba(76,175,80,0.15)';
                        borderColor = '#4CAF50';
                        textColor   = '#4CAF50';
                    } else if (isSelected && !isAnswer) {
                        bgColor     = 'rgba(244,67,54,0.15)';
                        borderColor = '#F44336';
                        textColor   = '#F44336';
                    }
                } else if (isSelected) {
                    bgColor     = colors.primary + '22';
                    borderColor = colors.primary;
                }

                return (
                    <TouchableOpacity
                        key={key}
                        style={[styles.mcqOption, { backgroundColor: bgColor, borderColor }]}
                        onPress={() => onSelectOption(key)}
                        disabled={showResult}
                        activeOpacity={0.75}
                    >
                        <View style={[styles.mcqOptionKey, {
                            backgroundColor: showResult && isAnswer
                                ? '#4CAF50'
                                : showResult && isSelected && !isAnswer
                                    ? '#F44336'
                                    : isSelected
                                        ? colors.primary
                                        : colors.border,
                        }]}>
                            <Text style={styles.mcqOptionKeyText}>{key}</Text>
                        </View>
                        <Text style={[styles.mcqOptionText, { color: textColor, flex: 1 }]}>
                            {options[key]}
                        </Text>
                        {showResult && isAnswer && (
                            <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                        )}
                        {showResult && isSelected && !isAnswer && (
                            <MaterialCommunityIcons name="close-circle" size={20} color="#F44336" />
                        )}
                    </TouchableOpacity>
                );
            })}

            {showResult && card.explanation ? (
                <View style={[styles.explanationBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.explanationLabel, { color: colors.subtext }]}>WHY</Text>
                    <Text style={[styles.explanationText, { color: colors.text }]}>{card.explanation}</Text>
                </View>
            ) : null}
        </View>
    );
};

/**
 * True or False — two large buttons, instant feedback.
 */
const TrueFalseMode = ({
    card, showResult, isCorrect, selectedOption,
    onSelectOption, colors,
}) => {
    // answer format: "True. [reason]" or "False. [reason]"
    const correctValue = card.answer?.toLowerCase().startsWith('true') ? 'True' : 'False';

    const renderButton = (label) => {
        const isSelected = selectedOption === label;
        const isAnswer   = correctValue === label;

        let bgColor     = colors.card;
        let borderColor = colors.border;
        let iconName    = label === 'True' ? 'check' : 'close';
        let iconColor   = colors.subtext;
        let textColor   = colors.text;

        if (showResult) {
            if (isAnswer) {
                bgColor     = 'rgba(76,175,80,0.15)';
                borderColor = '#4CAF50';
                iconColor   = '#4CAF50';
                textColor   = '#4CAF50';
            } else if (isSelected) {
                bgColor     = 'rgba(244,67,54,0.15)';
                borderColor = '#F44336';
                iconColor   = '#F44336';
                textColor   = '#F44336';
            }
        } else if (isSelected) {
            bgColor     = colors.primary + '22';
            borderColor = colors.primary;
            iconColor   = colors.primary;
            textColor   = colors.primary;
        }

        return (
            <TouchableOpacity
                key={label}
                style={[styles.tfButton, { backgroundColor: bgColor, borderColor }]}
                onPress={() => onSelectOption(label)}
                disabled={showResult}
                activeOpacity={0.75}
            >
                <MaterialCommunityIcons
                    name={label === 'True' ? 'check-circle-outline' : 'close-circle-outline'}
                    size={28}
                    color={iconColor}
                />
                <Text style={[styles.tfButtonText, { color: textColor }]}>{label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.answerSection}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Is this statement true or false?</Text>
            <View style={styles.tfRow}>
                {renderButton('True')}
                {renderButton('False')}
            </View>

            {showResult && (
                <ResultBox
                    isCorrect={isCorrect}
                    feedback={null}
                    correctAnswer={card.answer}
                    colors={colors}
                />
            )}
        </View>
    );
};

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

const FlashcardStudyScreen = ({ route, navigation }) => {
    const { deck }   = route.params;
    const { colors } = useTheme();

    const [flashcards,      setFlashcards]      = useState([]);
    const [currentIndex,    setCurrentIndex]    = useState(0);
    const [loading,         setLoading]         = useState(true);

    // Shared state
    const [userAnswer,      setUserAnswer]      = useState('');
    const [selectedOption,  setSelectedOption]  = useState(null); // for MCQ + T/F
    const [showResult,      setShowResult]      = useState(false);
    const [isCorrect,       setIsCorrect]       = useState(false);
    const [feedback,        setFeedback]        = useState('');
    const [isChecking,      setIsChecking]      = useState(false);
    const [masteredCards,   setMasteredCards]   = useState(new Set());

    useEffect(() => { loadFlashcards(); }, []);

    const loadFlashcards = async () => {
        try {
            const response = await api.get(`/decks/${deck.id}/flashcards`);
            setFlashcards(response.data.flashcards || []);
        } catch {
            Alert.alert('Error', 'Could not load flashcards. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------------------------------------
    // Answer handlers
    // -----------------------------------------------------------------------

    /**
     * Text-based answer check via Gemini (identification + explanatory).
     */
    const handleCheckTextAnswer = async () => {
        if (!userAnswer.trim()) {
            Alert.alert('Empty Answer', 'Please type your answer first.');
            return;
        }

        setIsChecking(true);
        try {
            const card       = flashcards[currentIndex];
            const evaluation = await checkAnswerWithGemini(
                card.question,
                card.answer,
                userAnswer,
            );

            setIsCorrect(evaluation.correct);
            setFeedback(evaluation.feedback);
            setShowResult(true);

            if (evaluation.correct) {
                setMasteredCards(prev => new Set([...prev, card.id]));
            }
        } catch {
            Alert.alert('Error', 'Could not check your answer. Please try again.');
        } finally {
            setIsChecking(false);
        }
    };

    /**
     * Instant check for MCQ — compare selected letter against correct answer.
     */
    const handleSelectMCQOption = useCallback((key) => {
        if (showResult) return;

        const card    = flashcards[currentIndex];
        const correct = card.answer === key;

        setSelectedOption(key);
        setIsCorrect(correct);
        setFeedback('');
        setShowResult(true);

        if (correct) {
            setMasteredCards(prev => new Set([...prev, card.id]));
        }
    }, [showResult, currentIndex, flashcards]);

    /**
     * Instant check for True/False.
     */
    const handleSelectTrueFalse = useCallback((value) => {
        if (showResult) return;

        const card         = flashcards[currentIndex];
        const correctValue = card.answer?.toLowerCase().startsWith('true') ? 'True' : 'False';
        const correct      = correctValue === value;

        setSelectedOption(value);
        setIsCorrect(correct);
        setFeedback('');
        setShowResult(true);

        if (correct) {
            setMasteredCards(prev => new Set([...prev, card.id]));
        }
    }, [showResult, currentIndex, flashcards]);

    // -----------------------------------------------------------------------
    // Navigation
    // -----------------------------------------------------------------------

    const resetCardState = () => {
        setUserAnswer('');
        setSelectedOption(null);
        setShowResult(false);
        setIsCorrect(false);
        setFeedback('');
    };

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            resetCardState();
        } else {
            finishStudySession();
        }
    };

    const finishStudySession = async () => {
        try {
            const masteryPercentage = Math.round(
                (masteredCards.size / flashcards.length) * 100
            );

            await api.put(`/decks/${deck.id}`, {
                mastery:  masteryPercentage,
                progress: 100,
                status:   masteryPercentage >= 75 ? 'Mastered' : 'Needs Review',
            });

            Alert.alert(
                'Study Session Complete!',
                `Great job!\n\nCorrect: ${masteredCards.size} / ${flashcards.length}\nMastery: ${masteryPercentage}%`,
                [
                    {
                        text: 'Study Again',
                        onPress: () => {
                            setCurrentIndex(0);
                            setMasteredCards(new Set());
                            resetCardState();
                        },
                    },
                    { text: 'Go Back', onPress: () => navigation.goBack() },
                ]
            );
        } catch {
            Alert.alert('Error', 'Could not save your progress. Please try again.');
        }
    };

    // -----------------------------------------------------------------------
    // Render helpers
    // -----------------------------------------------------------------------

    const Header = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons name="arrow-left" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
                {deck.title}
            </Text>
            <View style={{ width: 28 }} />
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header />
                <View style={styles.centeredContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.text }]}>Loading flashcards...</Text>
                </View>
            </View>
        );
    }

    if (flashcards.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header />
                <View style={styles.centeredContainer}>
                    <MaterialCommunityIcons name="cards-outline" size={80} color={colors.subtext} />
                    <Text style={[styles.emptyText, { color: colors.text }]}>No flashcards in this deck</Text>
                </View>
            </View>
        );
    }

    const currentCard = flashcards[currentIndex];
    const cardType    = currentCard.type || CARD_TYPES.IDENTIFICATION;

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Header />

            {/* Progress row */}
            <View style={styles.progressContainer}>
                <Text style={[styles.progressText, { color: colors.text }]}>
                    Card {currentIndex + 1} of {flashcards.length}
                </Text>
                <View style={styles.scoreContainer}>
                    <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
                    <Text style={[styles.scoreText, { color: colors.text }]}>
                        {masteredCards.size} correct
                    </Text>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Question card */}
                <View style={[styles.questionCard, { backgroundColor: colors.card }]}>
                    <View style={styles.questionCardTop}>
                        <Text style={[styles.cardLabel, { color: colors.primary }]}>QUESTION</Text>
                        <CardTypeBadge type={cardType} colors={colors} />
                    </View>
                    <Text style={[styles.questionText, { color: colors.text }]}>
                        {currentCard.question}
                    </Text>
                </View>

                {/* Type-specific answer UI */}
                {(cardType === CARD_TYPES.IDENTIFICATION ||
                  cardType === CARD_TYPES.EXPLANATORY    ||
                  cardType === CARD_TYPES.MIXED) && (
                    <TextAnswerMode
                        card={currentCard}
                        userAnswer={userAnswer}
                        setUserAnswer={setUserAnswer}
                        isChecking={isChecking}
                        showResult={showResult}
                        isCorrect={isCorrect}
                        feedback={feedback}
                        onCheck={handleCheckTextAnswer}
                        colors={colors}
                    />
                )}

                {cardType === CARD_TYPES.MULTIPLE_CHOICE && (
                    <MultipleChoiceMode
                        card={currentCard}
                        showResult={showResult}
                        isCorrect={isCorrect}
                        selectedOption={selectedOption}
                        onSelectOption={handleSelectMCQOption}
                        colors={colors}
                    />
                )}

                {cardType === CARD_TYPES.TRUE_FALSE && (
                    <TrueFalseMode
                        card={currentCard}
                        showResult={showResult}
                        isCorrect={isCorrect}
                        selectedOption={selectedOption}
                        onSelectOption={handleSelectTrueFalse}
                        colors={colors}
                    />
                )}
            </ScrollView>

            {/* Bottom navigation */}
            <View style={styles.bottomButtons}>
                {showResult ? (
                    <TouchableOpacity
                        style={[styles.nextButton, { backgroundColor: colors.primary }]}
                        onPress={handleNext}
                    >
                        <Text style={styles.nextButtonText}>
                            {currentIndex === flashcards.length - 1 ? 'Finish' : 'Next Card'}
                        </Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#000000" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.skipButton, { borderColor: colors.border }]}
                        onPress={handleNext}
                    >
                        <Text style={[styles.skipButtonText, { color: colors.text }]}>Skip</Text>
                        <MaterialCommunityIcons name="arrow-right" size={20} color={colors.subtext} />
                    </TouchableOpacity>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
    container:          { flex: 1, paddingTop: 50 },
    header:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
    headerTitle:        { fontSize: 20, fontWeight: '700', flex: 1, textAlign: 'center', marginHorizontal: 10 },
    centeredContainer:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText:        { marginTop: 10, fontSize: 16 },
    emptyText:          { fontSize: 18, marginTop: 20 },

    progressContainer:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
    progressText:       { fontSize: 14, fontWeight: '600' },
    scoreContainer:     { flexDirection: 'row', alignItems: 'center', gap: 5 },
    scoreText:          { fontSize: 14, fontWeight: '600' },

    scrollView:         { flex: 1 },
    scrollContent:      { paddingHorizontal: 20, paddingBottom: 30 },

    // Question card
    questionCard:       { padding: 25, borderRadius: 15, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    questionCardTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    cardLabel:          { fontSize: 12, fontWeight: '700', letterSpacing: 2 },
    questionText:       { fontSize: 20, fontWeight: '600', lineHeight: 28 },

    // Badge
    badge:              { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
    badgeText:          { fontSize: 11, fontWeight: '600' },

    // Answer section
    answerSection:      { marginBottom: 20 },
    sectionLabel:       { fontSize: 16, fontWeight: '600', marginBottom: 12 },
    answerInput:        { borderWidth: 1, borderRadius: 12, padding: 15, fontSize: 16, minHeight: 100, textAlignVertical: 'top', marginBottom: 15 },

    // Check button
    checkButton:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 8, marginBottom: 10 },
    checkButtonText:    { color: '#000000', fontSize: 16, fontWeight: '600' },
    disabled:           { opacity: 0.7 },

    // Result box
    resultBox:          { padding: 20, borderRadius: 15, borderWidth: 2, marginTop: 15 },
    resultHeader:       { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
    resultTitle:        { fontSize: 24, fontWeight: '700' },
    feedbackText:       { fontSize: 16, lineHeight: 24, marginBottom: 15 },
    correctAnswerBox:   { padding: 15, borderRadius: 12, borderWidth: 1, marginTop: 10 },
    correctAnswerLabel: { fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    correctAnswerText:  { fontSize: 16, lineHeight: 22 },

    // MCQ
    mcqOption:          { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, padding: 14, marginBottom: 10, gap: 12 },
    mcqOptionKey:       { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    mcqOptionKeyText:   { color: '#fff', fontWeight: '700', fontSize: 14 },
    mcqOptionText:      { fontSize: 15, lineHeight: 22 },

    // Explanation box (MCQ)
    explanationBox:     { marginTop: 15, padding: 15, borderRadius: 12, borderWidth: 1 },
    explanationLabel:   { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 6 },
    explanationText:    { fontSize: 15, lineHeight: 22 },

    // True/False
    tfRow:              { flexDirection: 'row', gap: 12, marginBottom: 10 },
    tfButton:           { flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderRadius: 12, paddingVertical: 20, gap: 8 },
    tfButtonText:       { fontSize: 16, fontWeight: '700' },

    // Bottom nav
    bottomButtons:      { paddingHorizontal: 20, paddingVertical: 15, paddingBottom: 30 },
    nextButton:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 8 },
    nextButtonText:     { color: '#000000', fontSize: 16, fontWeight: '600' },
    skipButton:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, borderWidth: 1, gap: 8 },
    skipButtonText:     { fontSize: 16, fontWeight: '600' },
});

export default FlashcardStudyScreen;