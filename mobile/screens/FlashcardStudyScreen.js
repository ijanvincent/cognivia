import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { collection, query, where, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db , auth} from '../firebaseConfig';
import { GoogleGenerativeAI } from "@google/generative-ai";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const genAI = new GoogleGenerativeAI("AIzaSyDxKtKTLlHxRPcuPy0GR7B9tUiXcorbs4M");

const FlashcardStudyScreen = ({ route, navigation }) => {
    const { deck } = route.params;
    const { colors } = useTheme();
    
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userAnswer, setUserAnswer] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [masteredCards, setMasteredCards] = useState(new Set());

    useEffect(() => {
        loadFlashcards();
    }, []);

    const loadFlashcards = async () => {
        try {
            const flashcardsRef = collection(db, 'flashcards');
            const q = query(flashcardsRef, where('deckId', '==', deck.id));
            const querySnapshot = await getDocs(q);
            
            const cards = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setFlashcards(cards);
            setLoading(false);
        } catch (error) {
            console.error('Error loading flashcards:', error);
            Alert.alert('Error', 'Could not load flashcards');
            setLoading(false);
        }
    };

    const checkAnswer = async () => {
        if (!userAnswer.trim()) {
            Alert.alert('Empty Answer', 'Please type your answer first.');
            return;
        }

        setIsChecking(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            
            const prompt = `You are a flashcard answer checker. Compare the student's answer with the correct answer and determine if it's correct.

Question: ${flashcards[currentIndex].question}
Correct Answer: ${flashcards[currentIndex].answer}
Student's Answer: ${userAnswer}

Respond ONLY with a JSON object in this exact format:
{
  "correct": true or false,
  "feedback": "Brief explanation (1-2 sentences)"
}

Rules:
- Mark as correct if the student's answer captures the main idea, even if wording differs
- Be lenient with minor spelling or grammar mistakes
- Be strict with factual errors or missing key information`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            // Clean and parse JSON
            let cleanedText = text.trim();
            cleanedText = cleanedText.replace(/```json\s*/g, '');
            cleanedText = cleanedText.replace(/```\s*/g, '');
            cleanedText = cleanedText.trim();
            
            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid AI response');
            }
            
            const evaluation = JSON.parse(jsonMatch[0]);
            
            setIsCorrect(evaluation.correct);
            setFeedback(evaluation.feedback);
            setShowResult(true);
            
            // Track mastered cards
            if (evaluation.correct) {
                setMasteredCards(prev => new Set([...prev, flashcards[currentIndex].id]));
            }
            
        } catch (error) {
            console.error('Error checking answer:', error);
            Alert.alert('Error', 'Could not check your answer. Please try again.');
        } finally {
            setIsChecking(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setUserAnswer('');
            setShowResult(false);
            setIsCorrect(false);
            setFeedback('');
        } else {
            finishStudySession();
        }
    };

    const handleSkip = () => {
        handleNext();
    };

    const finishStudySession = async () => {
        try {
            const masteryPercentage = Math.round((masteredCards.size / flashcards.length) * 100);
            
            // Update deck mastery in Firestore
            const deckRef = doc(db, 'decks', deck.id);
            await updateDoc(deckRef, {
                mastery: masteryPercentage,
                progress: 100,
                updatedAt: new Date().toISOString(),
            });

            // Save study session for progress tracking
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            await addDoc(collection(db, 'studySessions'), {
                userId: auth.currentUser.uid,
                deckId: deck.id,
                deckTitle: deck.title,
                date: today.toISOString(),
                cardsStudied: flashcards.length,
                correctAnswers: masteredCards.size,
                masteryAchieved: masteryPercentage,
                timestamp: new Date().toISOString(),
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
                        }
                    },
                    { text: 'Go Back', onPress: () => navigation.goBack() }
                ]
            );
        } catch (error) {
            console.error('Error updating mastery:', error);
            Alert.alert('Error', 'Could not save your progress');
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>{deck.title}</Text>
                    <View style={{ width: 28 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.text }]}>Loading flashcards...</Text>
                </View>
            </View>
        );
    }

    if (flashcards.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>{deck.title}</Text>
                    <View style={{ width: 28 }} />
                </View>
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="cards-outline" size={80} color={colors.subtext} />
                    <Text style={[styles.emptyText, { color: colors.text }]}>No flashcards in this deck</Text>
                </View>
            </View>
        );
    }

    const currentCard = flashcards[currentIndex];

    return (
        <KeyboardAvoidingView 
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{deck.title}</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Progress */}
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
                {/* Question Card */}
                <View style={[styles.questionCard, { backgroundColor: colors.card }]}>
                    <Text style={[styles.cardLabel, { color: colors.primary }]}>QUESTION</Text>
                    <Text style={[styles.questionText, { color: colors.text }]}>
                        {currentCard.question}
                    </Text>
                </View>

                {/* Answer Input */}
                <View style={styles.answerSection}>
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>Your Answer:</Text>
                    <TextInput
                        style={[
                            styles.answerInput,
                            { 
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                                color: colors.text 
                            }
                        ]}
                        placeholder="Type your answer here..."
                        placeholderTextColor={colors.subtext}
                        value={userAnswer}
                        onChangeText={setUserAnswer}
                        multiline
                        editable={!showResult}
                    />

                    {/* Check Answer Button */}
                    {!showResult && (
                        <TouchableOpacity
                            style={[
                                styles.checkButton,
                                { backgroundColor: colors.primary },
                                isChecking && styles.checkButtonDisabled
                            ]}
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

                    {/* Result */}
                    {showResult && (
                        <View style={[
                            styles.resultBox,
                            { 
                                backgroundColor: isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                borderColor: isCorrect ? '#4CAF50' : '#F44336'
                            }
                        ]}>
                            <View style={styles.resultHeader}>
                                <MaterialCommunityIcons 
                                    name={isCorrect ? "check-circle" : "close-circle"} 
                                    size={32} 
                                    color={isCorrect ? '#4CAF50' : '#F44336'} 
                                />
                                <Text style={[
                                    styles.resultTitle,
                                    { color: isCorrect ? '#4CAF50' : '#F44336' }
                                ]}>
                                    {isCorrect ? 'Correct!' : 'Not Quite'}
                                </Text>
                            </View>
                            
                            <Text style={[styles.feedbackText, { color: colors.text }]}>
                                {feedback}
                            </Text>

                            <View style={[styles.correctAnswerBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <Text style={[styles.correctAnswerLabel, { color: colors.subtext }]}>
                                    Correct Answer:
                                </Text>
                                <Text style={[styles.correctAnswerText, { color: colors.text }]}>
                                    {currentCard.answer}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
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
                        onPress={handleSkip}
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
    container: {
        flex: 1,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        marginTop: 20,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    scoreText: {
        fontSize: 14,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    questionCard: {
        padding: 25,
        borderRadius: 15,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardLabel: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 15,
    },
    questionText: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
    },
    answerSection: {
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    answerInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 15,
    },
    checkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
        marginBottom: 10,
    },
    checkButtonDisabled: {
        opacity: 0.7,
    },
    checkButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
    },
    correctAnswerBox: {
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        marginTop: 10,
    },
    correctAnswerLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    correctAnswerText: {
        fontSize: 16,
        lineHeight: 22,
    },
    resultBox: {
        padding: 20,
        borderRadius: 15,
        borderWidth: 2,
        marginTop: 15,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 15,
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: '700',
    },
    feedbackText: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 15,
    },
    bottomButtons: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingBottom: 30,
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    nextButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
    },
    skipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        gap: 8,
    },
    skipButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default FlashcardStudyScreen;