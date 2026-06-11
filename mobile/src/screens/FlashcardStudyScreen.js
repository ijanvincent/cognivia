import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    Alert, ActivityIndicator, KeyboardAvoidingView,
    Platform, ScrollView, StatusBar, Vibration,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { checkAnswer } from '../services/flashcardService';
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
        <View style={[styles.badge, { backgroundColor: colors.primary + '22', borderColor: colors.primary + '55' }]}>
            <MaterialCommunityIcons name={meta.icon} size={12} color={colors.primary} />
            <Text style={[styles.badgeText, { color: colors.primary }]}>{meta.label}</Text>
        </View>
    );
};

const TimerPill = ({ seconds, limit, colors }) => {
    if (!limit) return null;

    const isUrgent = seconds <= 3;
    const isWarning = seconds <= TIMER_WARNING_SECONDS;
    const accent = isUrgent ? '#f87171' : isWarning ? '#f59e0b' : '#38bdf8';

    return (
        <View style={[styles.timerPill, { backgroundColor: `${accent}18`, borderColor: `${accent}44` }]}>
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
        backgroundColor: isCorrect ? 'rgba(52,211,153,0.10)' : 'rgba(248,113,113,0.10)',
        borderColor:     isCorrect ? '#34d399' : '#f87171',
    }]}>
        <View style={styles.resultHeader}>
            <MaterialCommunityIcons
                name={isCorrect ? 'check-circle' : 'close-circle'}
                size={30}
                color={isCorrect ? '#34d399' : '#f87171'}
            />
            <Text style={[styles.resultTitle, { color: isCorrect ? '#34d399' : '#f87171' }]}>
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

const SessionReview = ({ deck, responses, masteryPercentage, onStudyAgain, onGoBack, colors }) => {
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
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.background === '#000000' ? 'light-content' : 'dark-content'} />
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
                    <View style={styles.reviewSummaryIcon}>
                        <MaterialCommunityIcons name="clipboard-check-outline" size={28} color="#07111f" />
                    </View>
                    <Text style={[styles.reviewSummaryTitle, { color: colors.text }]}>Study Complete</Text>
                    <Text style={[styles.reviewSummaryText, { color: colors.subtext }]}>
                        Compare your answers with the correct answers below.
                    </Text>

                    <View style={styles.reviewStatsRow}>
                        <View style={[styles.reviewStat, { backgroundColor: colors.background, borderColor: colors.border }]}>
                            <Text style={[styles.reviewStatValue, { color: '#34d399' }]}>{correctCount}</Text>
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
                        <View style={[styles.focusIcon, { backgroundColor: missedResponses.length ? 'rgba(248,113,113,0.14)' : 'rgba(52,211,153,0.14)' }]}>
                            <MaterialCommunityIcons
                                name={missedResponses.length ? 'lightbulb-on-outline' : 'trophy-outline'}
                                size={20}
                                color={missedResponses.length ? '#f87171' : '#34d399'}
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
                                    <Text style={styles.coachingMetricValue}>{missedCount}</Text>
                                    <Text style={[styles.coachingMetricLabel, { color: colors.subtext }]}>to revisit</Text>
                                </View>
                                <View style={styles.coachingDivider} />
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
                                        <View style={[styles.weaknessSeverity, { backgroundColor: item.count > 1 ? 'rgba(248,113,113,0.14)' : 'rgba(251,191,36,0.16)' }]}>
                                            <Text style={[styles.weaknessSeverityText, { color: item.count > 1 ? '#f87171' : '#f59e0b' }]}>
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
                                        <Text style={styles.focusItemBadge}>{CARD_TYPE_LABELS[response.card?.type] || 'Card'}</Text>
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
                                <Text style={[styles.coachingMetricValue, { color: '#34d399' }]}>100%</Text>
                                <Text style={[styles.coachingMetricLabel, { color: colors.subtext }]}>accuracy</Text>
                            </View>
                            <View style={styles.coachingDivider} />
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
                                { backgroundColor: response.isCorrect ? 'rgba(52,211,153,0.14)' : 'rgba(248,113,113,0.14)' },
                            ]}>
                                <MaterialCommunityIcons
                                    name={response.isCorrect ? 'check-circle-outline' : 'alert-circle-outline'}
                                    size={14}
                                    color={response.isCorrect ? '#34d399' : '#f87171'}
                                />
                                <Text style={[styles.reviewStatusText, { color: response.isCorrect ? '#34d399' : '#f87171' }]}>
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
                    <Text style={styles.primaryButtonText}>Done</Text>
                    <MaterialCommunityIcons name="check" size={18} color="#000000" />
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
                        bgColor     = 'rgba(52,211,153,0.15)';
                        borderColor = '#34d399';
                        textColor   = '#34d399';
                    } else {
                        bgColor     = 'rgba(248,113,113,0.15)';
                        borderColor = '#f87171';
                        textColor   = '#f87171';
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
                            backgroundColor: showResult && isSelected && isAnswer
                                ? '#34d399'
                                : showResult && isSelected && !isAnswer
                                    ? '#f87171'
                                    : isSelected
                                        ? colors.primary
                                        : colors.border,
                        }]}>
                            <Text style={styles.mcqOptionKeyText}>{key}</Text>
                        </View>
                        <Text style={[styles.mcqOptionText, { color: textColor, flex: 1 }]}>
                            {options[key]}
                        </Text>
                        {showResult && isSelected && isAnswer && (
                            <MaterialCommunityIcons name="check-circle" size={20} color="#34d399" />
                        )}
                        {showResult && isSelected && !isAnswer && (
                            <MaterialCommunityIcons name="close-circle" size={20} color="#f87171" />
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
                bgColor     = 'rgba(52,211,153,0.15)';
                borderColor = '#34d399';
                iconColor   = '#34d399';
                textColor   = '#34d399';
            } else {
                bgColor     = 'rgba(248,113,113,0.15)';
                borderColor = '#f87171';
                iconColor   = '#f87171';
                textColor   = '#f87171';
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
        try {
            const masteryPercentage = Math.round(
                (masteredCards.size / flashcards.length) * 100
            );

            await api.put(`/decks/${deck.id}`, {
                mastery:  masteryPercentage,
                progress: 100,
                status:   masteryPercentage >= 75 ? 'Mastered' : 'Needs Review',
            });

            setFinalMastery(masteryPercentage);
            setSessionComplete(true);
        } catch {
            Alert.alert('Error', 'Could not save your progress. Please try again.');
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
            />
        );
    }

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
    const activeTimeLimit = CARD_TIME_LIMITS[cardType] || null;
    const progressPercent = Math.round(((currentIndex + 1) / flashcards.length) * 100);

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle={colors.background === '#000000' ? 'light-content' : 'dark-content'} />
            <Header />

            {/* Progress row */}
            <View style={styles.progressContainer}>
                <View style={styles.progressLeft}>
                    <Text style={[styles.progressText, { color: colors.text }]}>
                        Card {currentIndex + 1} of {flashcards.length}
                    </Text>
                    <View style={[styles.sessionProgressTrack, { backgroundColor: colors.border }]}>
                        <View style={[styles.sessionProgressFill, { width: `${progressPercent}%` }]} />
                    </View>
                </View>
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
                    >
                        <Text style={styles.nextButtonText}>
                            {currentIndex === flashcards.length - 1 ? 'Finish' : 'Next Card'}
                        </Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#000000" />
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
    container:          { flex: 1, paddingTop: 50 },
    header:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
    headerTitle:        { fontSize: 19, fontWeight: '900', flex: 1, textAlign: 'center', marginHorizontal: 10 },
    centeredContainer:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText:        { marginTop: 10, fontSize: 16 },
    emptyText:          { fontSize: 18, marginTop: 20 },

    progressContainer:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14 },
    progressLeft:       { flex: 1, paddingRight: 14 },
    progressText:       { fontSize: 14, fontWeight: '800', marginBottom: 7 },
    sessionProgressTrack:{ height: 6, borderRadius: 999, overflow: 'hidden' },
    sessionProgressFill: { height: '100%', borderRadius: 999, backgroundColor: '#38bdf8' },
    scoreContainer:     { flexDirection: 'row', alignItems: 'center', gap: 5 },
    scoreText:          { fontSize: 13, fontWeight: '800' },

    scrollView:         { flex: 1 },
    scrollContent:      { paddingHorizontal: 20, paddingBottom: 30 },

    // Question card
    questionCard:       { padding: 22, borderRadius: 18, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
    questionCardTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    questionMeta:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
    cardLabel:          { fontSize: 12, fontWeight: '900', letterSpacing: 2 },
    questionText:       { fontSize: 20, fontWeight: '800', lineHeight: 29 },

    // Badge
    badge:              { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
    badgeText:          { fontSize: 11, fontWeight: '800' },
    timerPill:          { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
    timerText:          { fontSize: 11, fontWeight: '900' },

    // Answer section
    answerSection:      { marginBottom: 20 },
    sectionLabel:       { fontSize: 16, fontWeight: '900', marginBottom: 12 },
    answerInput:        { borderWidth: 1, borderRadius: 16, padding: 15, fontSize: 16, minHeight: 112, textAlignVertical: 'top', marginBottom: 15 },

    // Check button
    checkButton:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, gap: 8, marginBottom: 10 },
    checkButtonText:    { color: '#000000', fontSize: 16, fontWeight: '900' },
    disabled:           { opacity: 0.7 },

    // Result box
    resultBox:          { padding: 18, borderRadius: 18, borderWidth: 1.5, marginTop: 15 },
    resultHeader:       { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
    resultTitle:        { fontSize: 23, fontWeight: '900' },
    feedbackText:       { fontSize: 16, lineHeight: 24 },
    correctAnswerBox:   { padding: 15, borderRadius: 12, borderWidth: 1, marginTop: 10 },
    correctAnswerLabel: { fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    correctAnswerText:  { fontSize: 16, lineHeight: 22 },

    // MCQ
    mcqOption:          { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 16, padding: 14, marginBottom: 10, gap: 12 },
    mcqOptionKey:       { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    mcqOptionKeyText:   { color: '#fff', fontWeight: '700', fontSize: 14 },
    mcqOptionText:      { fontSize: 15, lineHeight: 22 },

    // Explanation box (MCQ)
    explanationBox:     { marginTop: 15, padding: 15, borderRadius: 16, borderWidth: 1 },
    explanationLabel:   { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 6 },
    explanationText:    { fontSize: 15, lineHeight: 22 },

    // True/False
    tfRow:              { flexDirection: 'row', gap: 12, marginBottom: 10 },
    tfButton:           { flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderRadius: 16, paddingVertical: 22, gap: 8 },
    tfButtonText:       { fontSize: 16, fontWeight: '900' },

    // Review
    reviewHeader:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
    reviewTitleWrap:    { flex: 1, paddingRight: 12 },
    reviewEyebrow:      { fontSize: 11, fontWeight: '900', letterSpacing: 1.4, marginBottom: 3 },
    reviewTitle:        { fontSize: 21, fontWeight: '900' },
    closeButton:        { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    reviewContent:      { paddingHorizontal: 20, paddingBottom: 120 },
    reviewSummaryCard:  { borderRadius: 18, borderWidth: 1, padding: 18, alignItems: 'center', marginBottom: 16 },
    reviewSummaryIcon:  { width: 56, height: 56, borderRadius: 18, backgroundColor: '#38bdf8', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    reviewSummaryTitle: { fontSize: 22, fontWeight: '900', marginBottom: 6 },
    reviewSummaryText:  { fontSize: 14, lineHeight: 20, textAlign: 'center', marginBottom: 16 },
    reviewStatsRow:     { flexDirection: 'row', gap: 8, width: '100%' },
    reviewStat:         { flex: 1, borderRadius: 14, borderWidth: 1, paddingVertical: 12, alignItems: 'center' },
    reviewStatValue:    { fontSize: 20, fontWeight: '900', marginBottom: 2 },
    reviewStatLabel:    { fontSize: 11, fontWeight: '800' },
    focusCard:          { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 12 },
    focusHeader:        { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    focusIcon:          { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    focusTitleWrap:     { flex: 1 },
    focusEyebrow:       { fontSize: 11, fontWeight: '900', letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 2 },
    focusTitle:         { fontSize: 18, fontWeight: '900' },
    focusInsight:       { fontSize: 14, lineHeight: 21, fontWeight: '700', marginBottom: 12 },
    coachingRow:        { flexDirection: 'row', borderWidth: 1, borderRadius: 15, padding: 12, marginBottom: 14 },
    coachingMetric:     { width: 72, alignItems: 'center', justifyContent: 'center' },
    coachingMetricValue:{ color: '#f87171', fontSize: 22, fontWeight: '900', marginBottom: 2 },
    coachingMetricLabel:{ fontSize: 11, fontWeight: '800' },
    coachingDivider:    { width: 1, backgroundColor: 'rgba(148,163,184,0.25)', marginHorizontal: 12 },
    coachingCopy:       { flex: 1, justifyContent: 'center' },
    coachingCopyTitle:  { fontSize: 14, fontWeight: '900', marginBottom: 4 },
    coachingCopyText:   { fontSize: 13, lineHeight: 18 },
    focusSectionLabel:  { fontSize: 11, fontWeight: '900', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8, marginTop: 2 },
    focusSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 2, marginBottom: 8 },
    focusSectionCount:  { fontSize: 11, fontWeight: '800' },
    weaknessList:       { gap: 8, marginBottom: 12 },
    weaknessRow:        { minHeight: 64, borderWidth: 1, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
    weaknessRowLeft:    { flex: 1 },
    weaknessRowTitle:   { fontSize: 14, fontWeight: '900', marginBottom: 3 },
    weaknessRowMeta:    { fontSize: 12, fontWeight: '700' },
    weaknessSeverity:   { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
    weaknessSeverityText:{ fontSize: 11, fontWeight: '900' },
    focusItem:          { borderTopWidth: 1, paddingTop: 10, marginTop: 10 },
    focusItemTop:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 5 },
    focusItemLabel:     { fontSize: 11, fontWeight: '900', letterSpacing: 0.7, textTransform: 'uppercase' },
    focusItemBadge:     { backgroundColor: 'rgba(56,189,248,0.14)', color: '#38bdf8', fontSize: 11, fontWeight: '900', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, overflow: 'hidden' },
    focusItemText:      { fontSize: 14, lineHeight: 20, fontWeight: '700' },
    reviewCard:         { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
    reviewCardTop:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    reviewCardNumber:   { fontSize: 12, fontWeight: '800' },
    reviewStatusPill:   { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 20 },
    reviewStatusText:   { fontSize: 11, fontWeight: '900' },
    reviewQuestion:     { fontSize: 16, fontWeight: '800', lineHeight: 23, marginBottom: 12 },
    answerCompareGrid:  { gap: 8 },
    answerCompareBox:   { borderRadius: 13, borderWidth: 1, padding: 12 },
    answerCompareLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 },
    answerCompareText:  { fontSize: 15, lineHeight: 21, fontWeight: '700' },
    reviewFeedback:     { borderRadius: 13, borderWidth: 1, padding: 12, marginTop: 8 },
    reviewFeedbackText: { fontSize: 14, lineHeight: 21 },
    reviewActions:      { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 30, borderTopWidth: 1 },
    secondaryButton:    { flex: 1, height: 50, borderRadius: 15, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
    secondaryButtonText:{ fontSize: 15, fontWeight: '900' },
    primaryButton:      { flex: 1, height: 50, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
    primaryButtonText:  { color: '#000000', fontSize: 15, fontWeight: '900' },

    // Bottom nav
    bottomButtons:      { paddingHorizontal: 20, paddingVertical: 15, paddingBottom: 30 },
    nextButton:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, gap: 8 },
    nextButtonText:     { color: '#000000', fontSize: 16, fontWeight: '900' },
});

export default FlashcardStudyScreen;