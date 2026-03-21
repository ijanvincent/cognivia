import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    Alert, ActivityIndicator, KeyboardAvoidingView,
    Platform, ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { checkAnswerWithGemini } from '../services/geminiService';
import api from '../services/api';

const FlashcardStudyScreen = ({ route, navigation }) => {
    const { deck }   = route.params;
    const { colors } = useTheme();

    const [flashcards,    setFlashcards]    = useState([]);
    const [currentIndex,  setCurrentIndex]  = useState(0);
    const [loading,       setLoading]       = useState(true);
    const [userAnswer,    setUserAnswer]    = useState('');
    const [isChecking,    setIsChecking]    = useState(false);
    const [showResult,    setShowResult]    = useState(false);
    const [isCorrect,     setIsCorrect]     = useState(false);
    const [feedback,      setFeedback]      = useState('');
    const [masteredCards, setMasteredCards] = useState(new Set());

    useEffect(() => { loadFlashcards(); }, []);

    // ── Data fetching ─────────────────────────────────────────
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

    // ── Answer checking ───────────────────────────────────────
    const checkAnswer = async () => {
        if (!userAnswer.trim()) {
            Alert.alert('Empty Answer', 'Please type your answer first.');
            return;
        }

        setIsChecking(true);
        try {
            const evaluation = await checkAnswerWithGemini(
                flashcards[currentIndex].question,
                flashcards[currentIndex].answer,
                userAnswer
            );

            setIsCorrect(evaluation.correct);
            setFeedback(evaluation.feedback);
            setShowResult(true);

            if (evaluation.correct) {
                setMasteredCards(prev => new Set([...prev, flashcards[currentIndex].id]));
            }
        } catch {
            Alert.alert('Error', 'Could not check your answer. Please try again.');
        } finally {
            setIsChecking(false);
        }
    };

    // ── Navigation ────────────────────────────────────────────
    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setUserAnswer('');
            setShowResult(false);
            setIsCorrect(false);
            setFeedback('');
        } else {
            finishStudySession();
        }
    };

    const finishStudySession = async () => {
        try {
            const masteryPercentage = Math.round((masteredCards.size / flashcards.length) * 100);

            await api.put(`/decks/${deck.id}`, {
                mastery:  masteryPercentage,
                progress: 100,
                status:   masteryPercentage >= 75 ? 'Mastered' : 'Needs Review',
            });

            Alert.alert(
                'Study Session Complete! 🎉',
                `Great job!\n\nCorrect: ${masteredCards.size} / ${flashcards.length}\nMastery: ${masteryPercentage}%`,
                [
                    {
                        text: 'Study Again',
                        onPress: () => {
                            setCurrentIndex(0);
                            setMasteredCards(new Set());
                            setUserAnswer('');
                            setShowResult(false);
                        },
                    },
                    { text: 'Go Back', onPress: () => navigation.goBack() },
                ]
            );
        } catch {
            Alert.alert('Error', 'Could not save your progress. Please try again.');
        }
    };

    // ── Shared header ─────────────────────────────────────────
    const Header = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons name="arrow-left" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>{deck.title}</Text>
            <View style={{ width: 28 }} />
        </View>
    );

    // ── Loading state ─────────────────────────────────────────
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

    // ── Empty state ───────────────────────────────────────────
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

    // ── Main render ───────────────────────────────────────────
    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Header />

            <View style={styles.progressContainer}>
                <Text style={[styles.progressText, { color: colors.text }]}>
                    Card {currentIndex + 1} of {flashcards.length}
                </Text>
                <View style={styles.scoreContainer}>
                    <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
                    <Text style={[styles.scoreText, { color: colors.text }]}>{masteredCards.size} correct</Text>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={[styles.questionCard, { backgroundColor: colors.card }]}>
                    <Text style={[styles.cardLabel, { color: colors.primary }]}>QUESTION</Text>
                    <Text style={[styles.questionText, { color: colors.text }]}>{currentCard.question}</Text>
                </View>

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
                            onPress={checkAnswer}
                            disabled={isChecking}
                        >
                            {isChecking ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="check-circle" size={20} color="#000000" />
                                    <Text style={styles.checkButtonText}>Check Answer</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}

                    {showResult && (
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
                            <Text style={[styles.feedbackText, { color: colors.text }]}>{feedback}</Text>
                            <View style={[styles.correctAnswerBox, {
                                backgroundColor: colors.background,
                                borderColor:     colors.border,
                            }]}>
                                <Text style={[styles.correctAnswerLabel, { color: colors.subtext }]}>Correct Answer:</Text>
                                <Text style={[styles.correctAnswerText,  { color: colors.text }]}>{currentCard.answer}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

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

const styles = StyleSheet.create({
    container:          { flex: 1, paddingTop: 50 },
    header:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
    headerTitle:        { fontSize: 20, fontWeight: '700' },
    centeredContainer:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText:        { marginTop: 10, fontSize: 16 },
    emptyText:          { fontSize: 18, marginTop: 20 },
    progressContainer:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
    progressText:       { fontSize: 14, fontWeight: '600' },
    scoreContainer:     { flexDirection: 'row', alignItems: 'center', gap: 5 },
    scoreText:          { fontSize: 14, fontWeight: '600' },
    scrollView:         { flex: 1 },
    scrollContent:      { paddingHorizontal: 20, paddingBottom: 20 },
    questionCard:       { padding: 25, borderRadius: 15, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    cardLabel:          { fontSize: 12, fontWeight: '700', letterSpacing: 2, marginBottom: 15 },
    questionText:       { fontSize: 20, fontWeight: '600', lineHeight: 28 },
    answerSection:      { marginBottom: 20 },
    sectionLabel:       { fontSize: 16, fontWeight: '600', marginBottom: 10 },
    answerInput:        { borderWidth: 1, borderRadius: 12, padding: 15, fontSize: 16, minHeight: 100, textAlignVertical: 'top', marginBottom: 15 },
    checkButton:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 8, marginBottom: 10 },
    checkButtonText:    { color: '#000000', fontSize: 16, fontWeight: '600' },
    disabled:           { opacity: 0.7 },
    resultBox:          { padding: 20, borderRadius: 15, borderWidth: 2, marginTop: 15 },
    resultHeader:       { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
    resultTitle:        { fontSize: 24, fontWeight: '700' },
    feedbackText:       { fontSize: 16, lineHeight: 24, marginBottom: 15 },
    correctAnswerBox:   { padding: 15, borderRadius: 12, borderWidth: 1, marginTop: 10 },
    correctAnswerLabel: { fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    correctAnswerText:  { fontSize: 16, lineHeight: 22 },
    bottomButtons:      { paddingHorizontal: 20, paddingVertical: 15, paddingBottom: 30 },
    nextButton:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 8 },
    nextButtonText:     { color: '#000000', fontSize: 16, fontWeight: '600' },
    skipButton:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, borderWidth: 1, gap: 8 },
    skipButtonText:     { fontSize: 16, fontWeight: '600' },
});

export default FlashcardStudyScreen;