import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    Alert, ActivityIndicator, KeyboardAvoidingView,
    Platform, ScrollView, StatusBar, Vibration,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { checkAnswer } from '../services/flashcardService';
import { radius, spacing, typography } from '../theme/theme';
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
const TIMER_WARNING_SECONDS = 5;

const CARD_TIME_LIMITS = {
    [CARD_TYPES.IDENTIFICATION]: 30,
    [CARD_TYPES.MULTIPLE_CHOICE]: 15,
    [CARD_TYPES.TRUE_FALSE]: 10,
};

const CARD_TYPE_LABELS = {
    [CARD_TYPES.IDENTIFICATION]:  'Identification',
    [CARD_TYPES.MULTIPLE_CHOICE]: 'Multiple Choice',
    [CARD_TYPES.EXPLANATORY]:     'Explanatory',
    [CARD_TYPES.TRUE_FALSE]:      'True or False',
    [CARD_TYPES.MIXED]:           'Mixed',
};

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
        <View style={[styles.badge, { backgroundColor: colors.primarySoft, borderColor: colors.primary }]}>
            <MaterialCommunityIcons name={meta.icon} size={12} color={colors.primary} />
            <Text style={[styles.badgeText, { color: colors.primary }]}>{meta.label}</Text>
        </View>
    );
};

const TimerPill = ({ seconds, limit, colors }) => {
    if (!limit) return null;

    const isUrgent = seconds <= 3;
    const isWarning = seconds <= TIMER_WARNING_SECONDS;
    const accent = isUrgent ? colors.danger : isWarning ? colors.warning : colors.primary;
    const accentSoft = isUrgent ? colors.dangerSoft : isWarning ? colors.warningSoft : colors.primarySoft;

    return (
        <View style={[styles.timerPill, { backgroundColor: accentSoft, borderColor: accent }]}>
            <MaterialCommunityIcons name={isWarning ? 'timer-alert-outline' : 'timer-outline'} size={14} color={accent} />
            <Text style={[styles.timerText, { color: accent }]}>{seconds}s</Text>
        </View>
    );
};

/**
 * Result box — shared across all card types.
 */
const ResultBox = ({ isCorrect, feedback, colors }) => (
    <View style={[styles.resultBox, {
        backgroundColor: isCorrect ? colors.successSoft : colors.dangerSoft,
        borderColor:     isCorrect ? colors.success : colors.danger,
    }]}>
        <View style={styles.resultHeader}>
            <MaterialCommunityIcons
                name={isCorrect ? 'check-circle' : 'close-circle'}
                size={26}
                color={isCorrect ? colors.success : colors.danger}
            />
            <Text style={[styles.resultTitle, { color: isCorrect ? colors.success : colors.danger }]}>
                {isCorrect ? 'Answer Recorded' : 'Needs Review'}
            </Text>
        </View>

        {!!feedback && (
            <Text style={[styles.feedbackText, { color: colors.text }]}>{feedback}</Text>
        )}
    </View>
);

const formatUserAnswer = (card, answer) => {
    if (!answer) return 'No answer';
    if (card?.type === CARD_TYPES.MULTIPLE_CHOICE) {
        return `${answer}. ${card.options?.[answer] || ''}`.trim();
    }
    return answer;
};

const formatCorrectAnswer = (card) => {
    if (card?.type === CARD_TYPES.MULTIPLE_CHOICE) {
        return `${card.answer}. ${card.options?.[card.answer] || ''}`.trim();
    }
    return card?.answer || 'No answer provided';
};

const shuffleCards = (cards) => {
    const shuffled = [...cards];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
};

const SessionReview = ({ deck, responses, masteryPercentage, onStudyAgain, onGoBack, colors, theme }) => {
    const insets = useSafeAreaInsets();
    const correctCount = responses.filter(response => response.isCorrect).length;
    const missedResponses = responses.filter(response => !response.isCorrect);
    const weakestTypes = Object.values(
        missedResponses.reduce((groups, response) => {
            const type = response.card?.type || CARD_TYPES.IDENTIFICATION;
            const label = CARD_TYPE_LABELS[type] || 'Flashcards';

            if (!groups[type]) {
                groups[type] = { type, label, count: 0 };
            }

            groups[type].count += 1;
            return groups;
        }, {})
    ).sort((a, b) => b.count - a.count);
    const missedCount = missedResponses.length;
    const focusSummary = missedCount
        ? `${missedCount} ${missedCount === 1 ? 'answer was' : 'answers were'} missed. Review the question formats below, then go through each missed question before retrying.`
        : 'You completed this round without missed cards. Keep the momentum by reviewing again later.';

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + spacing.sm }]}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
            <View style={styles.reviewHeader}>
                <View style={styles.reviewTitleWrap}>
                    <Text style={[styles.reviewEyebrow, { color: colors.primary }]}>SESSION REVIEW</Text>
                    <Text style={[styles.reviewTitle, { color: colors.text }]} numberOfLines={1}>{deck.title}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.closeButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={onGoBack}
                    activeOpacity={0.78}
                >
                    <MaterialCommunityIcons name="close" size={20} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.reviewContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.reviewSummaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={[styles.reviewSummaryIcon, { backgroundColor: colors.primarySoft }]}>
                        <MaterialCommunityIcons name="clipboard-check-outline" size={28} color={colors.primary} />
                    </View>
                    <Text style={[styles.reviewSummaryTitle, { color: colors.text }]}>Study Complete</Text>
                    <Text style={[styles.reviewSummaryText, { color: colors.subtext }]}>
                        Compare your answers with the correct answers below.
                    </Text>

                    <View style={styles.reviewStatsRow}>
                        <View style={[styles.reviewStat, { backgroundColor: colors.background, borderColor: colors.border }]}>
                            <Text style={[styles.reviewStatValue, { color: colors.success }]}>{correctCount}</Text>
                            <Text style={[styles.reviewStatLabel, { color: colors.subtext }]}>Correct</Text>
                        </View>
                        <View style={[styles.reviewStat, { backgroundColor: colors.background, borderColor: colors.border }]}>
                            <Text style={[styles.reviewStatValue, { color: colors.text }]}>{responses.length}</Text>
                            <Text style={[styles.reviewStatLabel, { color: colors.subtext }]}>Cards</Text>
                        </View>
                        <View style={[styles.reviewStat, { backgroundColor: colors.background, borderColor: colors.border }]}>
                            <Text style={[styles.reviewStatValue, { color: colors.primary }]}>{masteryPercentage}%</Text>
                            <Text style={[styles.reviewStatLabel, { color: colors.subtext }]}>Mastery</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.focusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.focusHeader}>
                        <View style={[styles.focusIcon, { backgroundColor: missedResponses.length ? colors.dangerSoft : colors.successSoft }]}>
                            <MaterialCommunityIcons
                                name={missedResponses.length ? 'lightbulb-on-outline' : 'trophy-outline'}
                                size={20}
                                color={missedResponses.length ? colors.danger : colors.success}
                            />
                        </View>
                        <View style={styles.focusTitleWrap}>
                            <Text style={[styles.focusEyebrow, { color: colors.subtext }]}>Personalized Coaching</Text>
                            <Text style={[styles.focusTitle, { color: colors.text }]}>
                                {missedResponses.length ? 'Where to Focus Next' : 'Strong Session'}
                            </Text>
                        </View>
                    </View>

                    <Text style={[styles.focusInsight, { color: colors.text }]}>{focusSummary}</Text>

                    {missedResponses.length ? (
                        <>
                            <View style={[styles.coachingRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <View style={styles.coachingMetric}>
                                    <Text style={[styles.coachingMetricValue, { color: colors.danger }]}>{missedCount}</Text>
                                    <Text style={[styles.coachingMetricLabel, { color: colors.subtext }]}>to revisit</Text>
                                </View>
                                <View style={[styles.coachingDivider, { backgroundColor: colors.border }]} />
                                <View style={styles.coachingCopy}>
                                    <Text style={[styles.coachingCopyTitle, { color: colors.text }]}>Recommended plan</Text>
                                    <Text style={[styles.coachingCopyText, { color: colors.subtext }]}>
                                        Review the explanations, say the answer out loud, then use Study Again for a shuffled retry.
                                    </Text>
                                </View>
                            </View>

                            <Text style={[styles.focusSectionLabel, { color: colors.subtext }]}>Question formats to review</Text>
                            <View style={styles.weaknessList}>
                                {weakestTypes.map(item => (
                                    <View
                                        key={item.type}
                                        style={[styles.weaknessRow, { backgroundColor: colors.background, borderColor: colors.border }]}
                                    >
                                        <View style={styles.weaknessRowLeft}>
                                            <Text style={[styles.weaknessRowTitle, { color: colors.text }]}>{item.label}</Text>
                                            <Text style={[styles.weaknessRowMeta, { color: colors.subtext }]}>
                                                {item.count} {item.count === 1 ? 'missed answer' : 'missed answers'}
                                            </Text>
                                        </View>
                                        <View style={[styles.weaknessSeverity, { backgroundColor: item.count > 1 ? colors.dangerSoft : colors.warningSoft }]}>
                                            <Text style={[styles.weaknessSeverityText, { color: item.count > 1 ? colors.danger : colors.warning }]}>
                                                {item.count > 1 ? 'High focus' : 'Review'}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.focusSectionHeader}>
                                <Text style={[styles.focusSectionLabel, { color: colors.subtext }]}>Missed questions</Text>
                                <Text style={[styles.focusSectionCount, { color: colors.subtext }]}>
                                    {missedCount} {missedCount === 1 ? 'item' : 'items'}
                                </Text>
                            </View>
                            {missedResponses.map((response, index) => (
                                <View key={`focus-${response.card.id}-${index}`} style={[styles.focusItem, { borderTopColor: colors.border }]}>
                                    <View style={styles.focusItemTop}>
                                        <Text style={[styles.focusItemLabel, { color: colors.subtext }]}>
                                            Missed question {index + 1} of {missedCount}
                                        </Text>
                                        <Text style={[styles.focusItemBadge, { backgroundColor: colors.primarySoft, color: colors.primary }]}>
                                            {CARD_TYPE_LABELS[response.card?.type] || 'Card'}
                                        </Text>
                                    </View>
                                    <Text style={[styles.focusItemText, { color: colors.text }]} numberOfLines={2}>
                                        {response.card.question}
                                    </Text>
                                </View>
                            ))}
                        </>
                    ) : (
                        <View style={[styles.coachingRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
                            <View style={styles.coachingMetric}>
                                <Text style={[styles.coachingMetricValue, { color: colors.success }]}>100%</Text>
                                <Text style={[styles.coachingMetricLabel, { color: colors.subtext }]}>accuracy</Text>
                            </View>
                            <View style={[styles.coachingDivider, { backgroundColor: colors.border }]} />
                            <View style={styles.coachingCopy}>
                                <Text style={[styles.coachingCopyTitle, { color: colors.text }]}>Keep it fresh</Text>
                                <Text style={[styles.coachingCopyText, { color: colors.subtext }]}>
                                    Use Study Again later to reinforce recall with a shuffled question order.
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {responses.map((response, index) => (
                    <View
                        key={`${response.card.id}-${index}`}
                        style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                    >
                        <View style={styles.reviewCardTop}>
                            <Text style={[styles.reviewCardNumber, { color: colors.subtext }]}>Question {index + 1}</Text>
                            <View style={[
                                styles.reviewStatusPill,
                                { backgroundColor: response.isCorrect ? colors.successSoft : colors.dangerSoft },
                            ]}>
                                <MaterialCommunityIcons
                                    name={response.isCorrect ? 'check-circle-outline' : 'alert-circle-outline'}
                                    size={14}
                                    color={response.isCorrect ? colors.success : colors.danger}
                                />
                                <Text style={[styles.reviewStatusText, { color: response.isCorrect ? colors.success : colors.danger }]}>
                                    {response.isCorrect ? 'Correct' : 'Review'}
                                </Text>
                            </View>
                        </View>

                        <Text style={[styles.reviewQuestion, { color: colors.text }]}>{response.card.question}</Text>

                        <View style={styles.answerCompareGrid}>
                            <View style={[styles.answerCompareBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <Text style={[styles.answerCompareLabel, { color: colors.subtext }]}>Your Answer</Text>
                                <Text style={[styles.answerCompareText, { color: response.userAnswer ? colors.text : colors.subtext }]}>
                                    {formatUserAnswer(response.card, response.userAnswer)}
                                </Text>
                            </View>
                            <View style={[styles.answerCompareBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <Text style={[styles.answerCompareLabel, { color: colors.subtext }]}>Correct Answer</Text>
                                <Text style={[styles.answerCompareText, { color: colors.text }]}>
                                    {formatCorrectAnswer(response.card)}
                                </Text>
                            </View>
                        </View>

                        {!!response.feedback && (
                            <View style={[styles.reviewFeedback, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <Text style={[styles.answerCompareLabel, { color: colors.subtext }]}>Feedback</Text>
                                <Text style={[styles.reviewFeedbackText, { color: colors.text }]}>{response.feedback}</Text>
                            </View>
                        )}

                        {!!response.card.explanation && (
                            <View style={[styles.reviewFeedback, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <Text style={[styles.answerCompareLabel, { color: colors.subtext }]}>Explanation</Text>
                                <Text style={[styles.reviewFeedbackText, { color: colors.text }]}>{response.card.explanation}</Text>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>

            <View style={[styles.reviewActions, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.secondaryButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={onStudyAgain}
                    activeOpacity={0.82}
                >
                    <MaterialCommunityIcons name="refresh" size={18} color={colors.text} />
                    <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Study Again</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                    onPress={onGoBack}
                    activeOpacity={0.88}
                >
                    <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>Done</Text>
                    <MaterialCommunityIcons name="check" size={18} color={colors.onPrimary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

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
                    <ActivityIndicator color={colors.onPrimary} />
                ) : (
                    <>
                        <MaterialCommunityIcons name="check-circle" size={20} color={colors.onPrimary} />
                        <Text style={[styles.checkButtonText, { color: colors.onPrimary }]}>Check Answer</Text>
                    </>
                )}
            </TouchableOpacity>
        )}

        {showResult && (
            <ResultBox
                isCorrect={isCorrect}
                feedback={feedback}
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
    onSelectOption, feedback, colors,
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

                if (showResult && isSelected) {
                    if (isAnswer) {
                        bgColor     = colors.successSoft;
                        borderColor = colors.success;
                        textColor   = colors.success;
                    } else {
                        bgColor     = colors.dangerSoft;
                        borderColor = colors.danger;
                        textColor   = colors.danger;
                    }
                } else if (isSelected) {
                    bgColor     = colors.primarySoft;
                    borderColor = colors.primary;
                }

                const keyIsAccented = isSelected;
                const keyBackground = showResult && isSelected
                    ? (isAnswer ? colors.success : colors.danger)
                    : isSelected
                        ? colors.primary
                        : colors.surfaceSubtle;

                return (
                    <TouchableOpacity
                        key={key}
                        style={[styles.mcqOption, { backgroundColor: bgColor, borderColor }]}
                        onPress={() => onSelectOption(key)}
                        disabled={showResult}
                        activeOpacity={0.75}
                    >
                        <View style={[styles.mcqOptionKey, { backgroundColor: keyBackground }]}>
                            <Text style={[styles.mcqOptionKeyText, { color: keyIsAccented ? colors.onPrimary : colors.subtext }]}>
                                {key}
                            </Text>
                        </View>
                        <Text style={[styles.mcqOptionText, { color: textColor, flex: 1 }]}>
                            {options[key]}
                        </Text>
                        {showResult && isSelected && isAnswer && (
                            <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
                        )}
                        {showResult && isSelected && !isAnswer && (
                            <MaterialCommunityIcons name="close-circle" size={20} color={colors.danger} />
                        )}
                    </TouchableOpacity>
                );
            })}

            {showResult && (
                <ResultBox
                    isCorrect={isCorrect}
                    feedback={feedback || 'Your answer has been saved. Correct answers appear in the final review.'}
                    colors={colors}
                />
            )}
        </View>
    );
};

/**
 * True or False — two large buttons, instant feedback.
 */
const TrueFalseMode = ({
    card, showResult, isCorrect, selectedOption,
    onSelectOption, feedback, colors,
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

        if (showResult && isSelected) {
            if (isAnswer) {
                bgColor     = colors.successSoft;
                borderColor = colors.success;
                iconColor   = colors.success;
                textColor   = colors.success;
            } else {
                bgColor     = colors.dangerSoft;
                borderColor = colors.danger;
                iconColor   = colors.danger;
                textColor   = colors.danger;
            }
        } else if (isSelected) {
            bgColor     = colors.primarySoft;
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
                    feedback={feedback}
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
    const { colors, theme } = useTheme();
    const insets = useSafeAreaInsets();

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
    const [timeRemaining,   setTimeRemaining]   = useState(null);
    const [sessionResponses, setSessionResponses] = useState([]);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [finalMastery, setFinalMastery] = useState(0);
    const showResultRef = useRef(false);
    const lastWarningSecondRef = useRef(null);

    useEffect(() => { loadFlashcards(); }, []);
    useEffect(() => { showResultRef.current = showResult; }, [showResult]);

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

    const recordResponse = useCallback((card, answer, correct, responseFeedback = '') => {
        setSessionResponses(prev => {
            const nextResponse = {
                card,
                cardIndex: currentIndex,
                userAnswer: answer,
                isCorrect: correct,
                feedback: responseFeedback,
            };

            const existingIndex = prev.findIndex(item => item.cardIndex === currentIndex);
            if (existingIndex >= 0) {
                const next = [...prev];
                next[existingIndex] = nextResponse;
                return next;
            }

            return [...prev, nextResponse].sort((a, b) => a.cardIndex - b.cardIndex);
        });
    }, [currentIndex]);

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
            const evaluation = await checkAnswer(
                card.question,
                card.answer,
                userAnswer,
            );

            setIsCorrect(evaluation.correct);
            setFeedback(evaluation.correct
                ? 'Your answer has been saved.'
                : 'Your answer has been saved for the final review.');
            recordResponse(card, userAnswer.trim(), evaluation.correct, evaluation.feedback);
            showResultRef.current = true;
            setTimeRemaining(null);
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
        setFeedback(correct
            ? 'Your choice has been saved.'
            : 'Your choice has been saved for the final review.');
        recordResponse(card, key, correct);
        showResultRef.current = true;
        setTimeRemaining(null);
        setShowResult(true);

        if (correct) {
            setMasteredCards(prev => new Set([...prev, card.id]));
        }
    }, [showResult, currentIndex, flashcards, recordResponse]);

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
        setFeedback(correct
            ? 'Your answer has been saved.'
            : 'Your answer has been saved for the final review.');
        recordResponse(card, value, correct);
        showResultRef.current = true;
        setTimeRemaining(null);
        setShowResult(true);

        if (correct) {
            setMasteredCards(prev => new Set([...prev, card.id]));
        }
    }, [showResult, currentIndex, flashcards, recordResponse]);

    const handleTimedOut = useCallback(() => {
        if (showResultRef.current || flashcards.length === 0) return;

        const card = flashcards[currentIndex];
        if (!card) return;

        Vibration.vibrate([0, 90, 50, 160]);
        setIsCorrect(false);
        setFeedback('Time is up. This card has been saved for the final review.');
        recordResponse(card, '', false, 'Time expired before an answer was submitted.');
        showResultRef.current = true;
        setShowResult(true);
    }, [currentIndex, flashcards, recordResponse]);

    useEffect(() => {
        if (loading || flashcards.length === 0 || showResult) return undefined;

        const cardType = flashcards[currentIndex]?.type || CARD_TYPES.IDENTIFICATION;
        const limit = CARD_TIME_LIMITS[cardType];

        if (!limit) {
            setTimeRemaining(null);
            return undefined;
        }

        lastWarningSecondRef.current = null;
        setTimeRemaining(limit);

        const interval = setInterval(() => {
            setTimeRemaining((current) => {
                if (current === null) return current;
                if (current <= 1) {
                    clearInterval(interval);
                    handleTimedOut();
                    return 0;
                }

                const next = current - 1;
                if (
                    next <= TIMER_WARNING_SECONDS &&
                    next > 0 &&
                    lastWarningSecondRef.current !== next &&
                    Platform.OS !== 'web'
                ) {
                    lastWarningSecondRef.current = next;
                    Vibration.vibrate(next <= 3 ? 80 : 45);
                }

                return next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [currentIndex, flashcards, handleTimedOut, loading, showResult]);

    // -----------------------------------------------------------------------
    // Navigation
    // -----------------------------------------------------------------------

    const resetCardState = () => {
        setUserAnswer('');
        setSelectedOption(null);
        setShowResult(false);
        setIsCorrect(false);
        setFeedback('');
        setTimeRemaining(null);
        showResultRef.current = false;
        lastWarningSecondRef.current = null;
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
        // Guard against an empty deck (division by zero -> NaN mastery).
        const total = flashcards.length || 1;
        const masteryPercentage = Math.round((masteredCards.size / total) * 100);

        // Show the result immediately — the session review is computed locally,
        // so never block it on a server write that can blip on the free tier.
        setFinalMastery(masteryPercentage);
        setSessionComplete(true);

        const save = () => api.put(`/decks/${deck.id}`, {
            mastery:  masteryPercentage,
            progress: 100,
            status:   masteryPercentage >= 75 ? 'Mastered' : 'Needs Review',
        });

        try {
            await save();
        } catch (err) {
            // Retry once on a transient failure (network drop, or a cold-start
            // 502/503/504 from the free-tier backend) before surfacing anything.
            const transient = !err?.response || [502, 503, 504].includes(err.response.status);
            if (transient) {
                try {
                    await new Promise((r) => setTimeout(r, 1500));
                    await save();
                    return;
                } catch (_) { /* fall through to the notice below */ }
            }
            console.error(
                'finishStudySession save failed:',
                err?.response?.status,
                err?.response?.data || err?.message,
            );
            Alert.alert(
                'Saved locally',
                'Your results are shown above, but we couldn’t save them to the server. Check your connection and study again to update your deck.',
            );
        }
    };

    const handleStudyAgain = () => {
        setFlashcards(prev => shuffleCards(prev));
        setCurrentIndex(0);
        setMasteredCards(new Set());
        setSessionResponses([]);
        setFinalMastery(0);
        setSessionComplete(false);
        resetCardState();
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

    if (sessionComplete) {
        return (
            <SessionReview
                deck={deck}
                responses={sessionResponses}
                masteryPercentage={finalMastery}
                onStudyAgain={handleStudyAgain}
                onGoBack={() => navigation.goBack()}
                colors={colors}
                theme={theme}
            />
        );
    }

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + spacing.sm }]}>
                <Header />
                <View style={styles.centeredContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.text }]}>Loading flashcards…</Text>
                </View>
            </View>
        );
    }

    if (flashcards.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + spacing.sm }]}>
                <Header />
                <View style={styles.centeredContainer}>
                    <MaterialCommunityIcons name="cards-outline" size={72} color={colors.subtext} />
                    <Text style={[styles.emptyText, { color: colors.text }]}>No flashcards in this deck</Text>
                </View>
            </View>
        );
    }

    const currentCard = flashcards[currentIndex];
    const cardType    = currentCard.type || CARD_TYPES.IDENTIFICATION;
    const activeTimeLimit = CARD_TIME_LIMITS[cardType] || null;
    const progressPercent = Math.round(((currentIndex + 1) / flashcards.length) * 100);

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + spacing.sm }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
            <Header />

            {/* Progress row */}
            <View style={styles.progressContainer}>
                <View style={styles.progressLeft}>
                    <Text style={[styles.progressText, { color: colors.text }]}>
                        Card {currentIndex + 1} of {flashcards.length}
                    </Text>
                    <View style={[styles.sessionProgressTrack, { backgroundColor: colors.border }]}>
                        <View style={[styles.sessionProgressFill, { width: `${progressPercent}%`, backgroundColor: colors.primary }]} />
                    </View>
                </View>
                <View style={styles.scoreContainer}>
                    <MaterialCommunityIcons name="check-circle" size={16} color={colors.success} />
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
                <View style={[styles.questionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.questionCardTop}>
                        <Text style={[styles.cardLabel, { color: colors.primary }]}>QUESTION</Text>
                        <View style={styles.questionMeta}>
                            {!showResult && (
                                <TimerPill
                                    seconds={timeRemaining ?? activeTimeLimit}
                                    limit={activeTimeLimit}
                                    colors={colors}
                                />
                            )}
                            <CardTypeBadge type={cardType} colors={colors} />
                        </View>
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
                        feedback={feedback}
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
                        feedback={feedback}
                        colors={colors}
                    />
                )}
            </ScrollView>

            {/* Bottom navigation */}
            {showResult && (
                <View style={styles.bottomButtons}>
                    <TouchableOpacity
                        style={[styles.nextButton, { backgroundColor: colors.primary }]}
                        onPress={handleNext}
                        accessibilityRole="button"
                    >
                        <Text style={[styles.nextButtonText, { color: colors.onPrimary }]}>
                            {currentIndex === flashcards.length - 1 ? 'Finish' : 'Next Card'}
                        </Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.onPrimary} />
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
    container:          { flex: 1 },
    header:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
    headerTitle:        { fontSize: typography.size.heading, fontWeight: typography.weight.bold, flex: 1, textAlign: 'center', marginHorizontal: spacing.sm },
    centeredContainer:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText:        { marginTop: spacing.sm, fontSize: typography.size.body },
    emptyText:          { fontSize: typography.size.heading, marginTop: spacing.xl },

    progressContainer:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.md },
    progressLeft:       { flex: 1, paddingRight: spacing.md },
    progressText:       { fontSize: typography.size.caption, fontWeight: typography.weight.semibold, marginBottom: spacing.xs + 2 },
    sessionProgressTrack:{ height: 6, borderRadius: radius.pill, overflow: 'hidden' },
    sessionProgressFill: { height: '100%', borderRadius: radius.pill },
    scoreContainer:     { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    scoreText:          { fontSize: typography.size.caption, fontWeight: typography.weight.semibold },

    scrollView:         { flex: 1 },
    scrollContent:      { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },

    // Question card
    questionCard:       { padding: spacing.xl, borderRadius: radius.lg, borderWidth: 1, marginBottom: spacing.xl },
    questionCardTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
    questionMeta:       { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    cardLabel:          { fontSize: typography.size.micro, fontWeight: typography.weight.bold, letterSpacing: 1.5 },
    questionText:       { fontSize: typography.size.title - 2, fontWeight: typography.weight.semibold, lineHeight: 28 },

    // Badge
    badge:              { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: 5, borderRadius: radius.pill, borderWidth: 1 },
    badgeText:          { fontSize: typography.size.micro, fontWeight: typography.weight.semibold },
    timerPill:          { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: 5, borderRadius: radius.pill, borderWidth: 1 },
    timerText:          { fontSize: typography.size.micro, fontWeight: typography.weight.bold },

    // Answer section
    answerSection:      { marginBottom: spacing.xl },
    sectionLabel:       { fontSize: typography.size.body, fontWeight: typography.weight.bold, marginBottom: spacing.md },
    answerInput:        { borderWidth: 1, borderRadius: radius.md, padding: spacing.lg, fontSize: typography.size.body, minHeight: 112, textAlignVertical: 'top', marginBottom: spacing.lg },

    // Check button
    checkButton:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, borderRadius: radius.md, gap: spacing.sm, marginBottom: spacing.sm },
    checkButtonText:    { fontSize: typography.size.body, fontWeight: typography.weight.semibold },
    disabled:           { opacity: 0.7 },

    // Result box
    resultBox:          { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, marginTop: spacing.lg },
    resultHeader:       { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
    resultTitle:        { fontSize: typography.size.heading, fontWeight: typography.weight.bold },
    feedbackText:       { fontSize: typography.size.body, lineHeight: 23 },

    // MCQ
    mcqOption:          { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
    mcqOptionKey:       { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    mcqOptionKeyText:   { fontWeight: typography.weight.semibold, fontSize: typography.size.caption + 1 },
    mcqOptionText:      { fontSize: typography.size.body, lineHeight: 22 },

    // True/False
    tfRow:              { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm },
    tfButton:           { flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: radius.md, paddingVertical: spacing.xl, gap: spacing.sm },
    tfButtonText:       { fontSize: typography.size.body, fontWeight: typography.weight.bold },

    // Review
    reviewHeader:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
    reviewTitleWrap:    { flex: 1, paddingRight: spacing.md },
    reviewEyebrow:      { fontSize: typography.size.micro, fontWeight: typography.weight.semibold, letterSpacing: 1.2, marginBottom: 3 },
    reviewTitle:        { fontSize: typography.size.title, fontWeight: typography.weight.bold },
    closeButton:        { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    reviewContent:      { paddingHorizontal: spacing.xl, paddingBottom: 120 },
    reviewSummaryCard:  { borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.lg },
    reviewSummaryIcon:  { width: 56, height: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
    reviewSummaryTitle: { fontSize: typography.size.title, fontWeight: typography.weight.bold, marginBottom: spacing.xs },
    reviewSummaryText:  { fontSize: typography.size.caption + 1, lineHeight: 20, textAlign: 'center', marginBottom: spacing.lg },
    reviewStatsRow:     { flexDirection: 'row', gap: spacing.sm, width: '100%' },
    reviewStat:         { flex: 1, borderRadius: radius.md, borderWidth: 1, paddingVertical: spacing.md, alignItems: 'center' },
    reviewStatValue:    { fontSize: typography.size.title - 2, fontWeight: typography.weight.bold, marginBottom: 2 },
    reviewStatLabel:    { fontSize: typography.size.micro, fontWeight: typography.weight.semibold },
    focusCard:          { borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg, marginBottom: spacing.md },
    focusHeader:        { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
    focusIcon:          { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
    focusTitleWrap:     { flex: 1 },
    focusEyebrow:       { fontSize: typography.size.micro, fontWeight: typography.weight.semibold, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 2 },
    focusTitle:         { fontSize: typography.size.heading, fontWeight: typography.weight.bold },
    focusInsight:       { fontSize: typography.size.caption + 1, lineHeight: 21, marginBottom: spacing.md },
    coachingRow:        { flexDirection: 'row', borderWidth: 1, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
    coachingMetric:     { width: 72, alignItems: 'center', justifyContent: 'center' },
    coachingMetricValue:{ fontSize: typography.size.title, fontWeight: typography.weight.bold, marginBottom: 2 },
    coachingMetricLabel:{ fontSize: typography.size.micro, fontWeight: typography.weight.semibold },
    coachingDivider:    { width: 1, marginHorizontal: spacing.md },
    coachingCopy:       { flex: 1, justifyContent: 'center' },
    coachingCopyTitle:  { fontSize: typography.size.caption + 1, fontWeight: typography.weight.bold, marginBottom: spacing.xs },
    coachingCopyText:   { fontSize: typography.size.caption, lineHeight: 18 },
    focusSectionLabel:  { fontSize: typography.size.micro, fontWeight: typography.weight.semibold, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: spacing.sm, marginTop: 2 },
    focusSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm, marginTop: 2, marginBottom: spacing.sm },
    focusSectionCount:  { fontSize: typography.size.micro, fontWeight: typography.weight.semibold },
    weaknessList:       { gap: spacing.sm, marginBottom: spacing.md },
    weaknessRow:        { minHeight: 64, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
    weaknessRowLeft:    { flex: 1 },
    weaknessRowTitle:   { fontSize: typography.size.caption + 1, fontWeight: typography.weight.bold, marginBottom: 3 },
    weaknessRowMeta:    { fontSize: typography.size.micro + 1, fontWeight: typography.weight.medium },
    weaknessSeverity:   { borderRadius: radius.pill, paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.xs + 2 },
    weaknessSeverityText:{ fontSize: typography.size.micro, fontWeight: typography.weight.bold },
    focusItem:          { borderTopWidth: 1, paddingTop: spacing.sm + 2, marginTop: spacing.sm + 2 },
    focusItemTop:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm, marginBottom: spacing.xs },
    focusItemLabel:     { fontSize: typography.size.micro, fontWeight: typography.weight.semibold, letterSpacing: 0.7, textTransform: 'uppercase' },
    focusItemBadge:     { fontSize: typography.size.micro, fontWeight: typography.weight.semibold, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.pill, overflow: 'hidden' },
    focusItemText:      { fontSize: typography.size.caption + 1, lineHeight: 20, fontWeight: typography.weight.medium },
    reviewCard:         { borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg, marginBottom: spacing.md },
    reviewCardTop:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
    reviewCardNumber:   { fontSize: typography.size.micro + 1, fontWeight: typography.weight.semibold },
    reviewStatusPill:   { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.sm + 1, paddingVertical: spacing.xs + 1, borderRadius: radius.pill },
    reviewStatusText:   { fontSize: typography.size.micro, fontWeight: typography.weight.bold },
    reviewQuestion:     { fontSize: typography.size.body, fontWeight: typography.weight.semibold, lineHeight: 23, marginBottom: spacing.md },
    answerCompareGrid:  { gap: spacing.sm },
    answerCompareBox:   { borderRadius: radius.md, borderWidth: 1, padding: spacing.md },
    answerCompareLabel: { fontSize: typography.size.micro, fontWeight: typography.weight.semibold, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: spacing.xs + 2 },
    answerCompareText:  { fontSize: typography.size.body, lineHeight: 21, fontWeight: typography.weight.medium },
    reviewFeedback:     { borderRadius: radius.md, borderWidth: 1, padding: spacing.md, marginTop: spacing.sm },
    reviewFeedbackText: { fontSize: typography.size.caption + 1, lineHeight: 21 },
    reviewActions:      { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: spacing.sm + 2, paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xxxl - 2, borderTopWidth: 1 },
    secondaryButton:    { flex: 1, height: 48, borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
    secondaryButtonText:{ fontSize: typography.size.body, fontWeight: typography.weight.semibold },
    primaryButton:      { flex: 1, height: 48, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
    primaryButtonText:  { fontSize: typography.size.body, fontWeight: typography.weight.semibold },

    // Bottom nav
    bottomButtons:      { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, paddingBottom: spacing.xxxl - 2 },
    nextButton:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.md, gap: spacing.sm },
    nextButtonText:     { fontSize: typography.size.body, fontWeight: typography.weight.semibold },
});

export default FlashcardStudyScreen;