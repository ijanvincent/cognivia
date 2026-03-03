import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit'; 
import { useDecks } from '../DeckContext'; 
import { useTheme } from '../ThemeContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const screenWidth = Dimensions.get('window').width;

const MasteryDeckCard = ({ deck }) => {
    const { colors } = useTheme();
    const answeredCorrectly = Math.round(deck.cardCount * (deck.mastery / 100));
    const masteryColor = deck.mastery >= 80 ? '#4CAF50' : deck.mastery >= 50 ? '#FFC107' : '#FF5722';
    
    return (
        <View style={[styles.masteryCard, { 
            backgroundColor: colors.card,
            borderLeftColor: masteryColor, 
            shadowColor: colors.shadow,
        }]}>
            <View style={styles.masteryHeader}>
                <Text style={[styles.masteryTitle, { color: colors.text }]}>{deck.title}</Text>
                <Text style={[styles.masteryPercent, { color: masteryColor }]}>{deck.mastery}%</Text>
            </View>
            <Text style={[styles.masterySubtitle, { color: colors.subtext }]}>
                {answeredCorrectly} / {deck.cardCount} Cards Answered Correctly
            </Text>
            
            <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
                <View style={[
                    styles.progressBarFill, 
                    { width: `${deck.mastery}%`, backgroundColor: masteryColor }
                ]} />
            </View>
        </View>
    );
};

const ProgressScreen = () => {
    const { decks } = useDecks();
    const { colors } = useTheme();
    const [studyData, setStudyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadStudyData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadStudyData();
        setRefreshing(false);
    };

    const loadStudyData = async () => {
        try {
            if (!auth.currentUser) {
                setLoading(false);
                setStudyData({
                    dailyStats: getLast7Days().map(date => ({
                        date,
                        cardsStudied: 0,
                        correctAnswers: 0
                    })),
                    sessions: [],
                    streak: 0
                });
                return;
            }

            // Fetch study sessions from Firestore
            const sessionsRef = collection(db, 'studySessions');
            
            // Try query with index first
            try {
                const q = query(
                    sessionsRef, 
                    where('userId', '==', auth.currentUser.uid),
                    orderBy('date', 'desc')
                );
                
                const querySnapshot = await getDocs(q);
                const sessions = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                processSessionData(sessions);
            } catch (indexError) {
                console.log('Index not ready, using fallback query');
                // Fallback: fetch without orderBy
                const q = query(
                    sessionsRef, 
                    where('userId', '==', auth.currentUser.uid)
                );
                
                const querySnapshot = await getDocs(q);
                const sessions = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort in memory

                processSessionData(sessions);
            }
            
        } catch (error) {
            console.error('Error loading study data:', error);
            // Set empty data instead of failing
            setStudyData({
                dailyStats: getLast7Days().map(date => ({
                    date,
                    cardsStudied: 0,
                    correctAnswers: 0
                })),
                sessions: [],
                streak: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const processSessionData = (sessions) => {
        // Process data for last 7 days
        const last7Days = getLast7Days();
        const dailyStats = last7Days.map(date => {
            const sessionsOnDate = sessions.filter(s => 
                new Date(s.date).toDateString() === date.toDateString()
            );
            
            return {
                date,
                cardsStudied: sessionsOnDate.reduce((sum, s) => sum + (s.cardsStudied || 0), 0),
                correctAnswers: sessionsOnDate.reduce((sum, s) => sum + (s.correctAnswers || 0), 0)
            };
        });

        // Calculate streak
        const streak = calculateStreak(sessions);

        setStudyData({
            dailyStats,
            sessions,
            streak
        });
    };

    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date);
        }
        return days;
    };

    const calculateStreak = (sessions) => {
        if (sessions.length === 0) return 0;
        
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            
            const hasSession = sessions.some(s => 
                new Date(s.date).toDateString() === checkDate.toDateString()
            );
            
            if (hasSession) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }
        
        return streak;
    };

    const formatDateLabel = (date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    };

    // Calculate stats
    const totalCardsMastered = decks.reduce((sum, deck) => 
        sum + Math.round(deck.cardCount * (deck.mastery / 100)), 0
    );
    
    const overallMasteryScore = decks.length > 0
        ? decks.reduce((sum, deck) => sum + deck.mastery, 0) / decks.length
        : 0;

    const totalCardsStudied = studyData?.sessions.reduce((sum, s) => 
        sum + (s.cardsStudied || 0), 0
    ) || 0;

    const totalCorrectAnswers = studyData?.sessions.reduce((sum, s) => 
        sum + (s.correctAnswers || 0), 0
    ) || 0;

    // Prepare chart data
    const chartData = studyData ? {
        labels: studyData.dailyStats.map(d => formatDateLabel(d.date)),
        datasets: [{
            data: studyData.dailyStats.map(d => d.correctAnswers),
            color: (opacity = 1) => `rgba(42, 93, 255, ${opacity})`,
            strokeWidth: 2,
        }],
    } : {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
    };

    const chartConfig = {
        backgroundColor: colors.card,
        backgroundGradientFrom: colors.card,
        backgroundGradientTo: colors.card,
        decimalPlaces: 0,
        color: (opacity = 1) => {
            if (colors.primary.startsWith('#')) {
                const hex = colors.primary.replace('#', '');
                const r = parseInt(hex.substr(0, 2), 16);
                const g = parseInt(hex.substr(2, 2), 16);
                const b = parseInt(hex.substr(4, 2), 16);
                return `rgba(${r}, ${g}, ${b}, ${opacity})`;
            }
            return `rgba(42, 93, 255, ${opacity})`;
        },
        labelColor: (opacity = 1) => {
            if (colors.text.startsWith('#')) {
                const hex = colors.text.replace('#', '');
                const r = parseInt(hex.substr(0, 2), 16);
                const g = parseInt(hex.substr(2, 2), 16);
                const b = parseInt(hex.substr(4, 2), 16);
                return `rgba(${r}, ${g}, ${b}, ${opacity})`;
            }
            return `rgba(51, 51, 51, ${opacity})`;
        },
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: colors.primary,
        },
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.text }]}>Loading your progress...</Text>
            </View>
        );
    }

    return (
        <ScrollView 
            style={[styles.container, { backgroundColor: colors.background }]} 
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl 
                    refreshing={refreshing} 
                    onRefresh={onRefresh}
                    tintColor={colors.primary}
                    colors={[colors.primary]}
                />
            }
        >
            <Text style={[styles.header, { color: colors.text }]}>Your Progress</Text>

            {/* Stats Card */}
            <View style={[styles.statsCard, { backgroundColor: colors.card, shadowColor: colors.shadow, borderTopColor: colors.border }]}>
                <View style={styles.statRow}>
                    <MaterialCommunityIcons name="cards" size={20} color={colors.primary} />
                    <Text style={[styles.statText, { color: colors.subtext }]}>
                        Total Cards Mastered: <Text style={[styles.statValue, { color: colors.text }]}>{totalCardsMastered}</Text>
                    </Text>
                </View>
                
                <View style={styles.statRow}>
                    <MaterialCommunityIcons name="fire" size={20} color="#FF9500" />
                    <Text style={[styles.statText, { color: colors.subtext }]}>
                        Study Streak: <Text style={[styles.statValue, { color: colors.text }]}>{studyData?.streak || 0} Days</Text>
                    </Text>
                </View>
                <View style={styles.statRow}>
                    <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                    <Text style={[styles.statText, { color: colors.subtext }]}>
                        Total Correct: <Text style={[styles.statValue, { color: colors.text }]}>{totalCorrectAnswers}</Text>
                    </Text>
                </View>

                <View style={styles.statRow}>
                    <MaterialCommunityIcons name="book-open-variant" size={20} color={colors.primary} />
                    <Text style={[styles.statText, { color: colors.subtext }]}>
                        Total Studied: <Text style={[styles.statValue, { color: colors.text }]}>{totalCardsStudied} cards</Text>
                    </Text>
                </View>
                
                <Text style={[styles.overallMasteryText, { color: colors.primary, borderTopColor: colors.border }]}>
                    Overall Mastery: <Text style={styles.overallMasteryValue}>{overallMasteryScore.toFixed(0)}%</Text>
                </Text>
            </View>

            {/* Chart */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Correct Answers (Last 7 Days)</Text>
            <View style={[styles.chartContainer, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
                <LineChart
                    data={chartData}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                />
            </View>

            {/* Mastery Breakdown */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Mastery Breakdown by Deck</Text>
            <View style={styles.breakdownContainer}>
                {decks.length > 0 ? (
                    decks.map((deck) => (
                        <MasteryDeckCard key={deck.id} deck={deck} />
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="cards-outline" size={60} color={colors.subtext} />
                        <Text style={[styles.emptyText, { color: colors.text }]}>No decks yet</Text>
                        <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
                            Create a deck to start tracking your progress
                        </Text>
                    </View>
                )}
            </View>

            <View style={{ height: 50 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        marginTop: Platform.OS === 'ios' ? 60 : 50,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    statsCard: {
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 15,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 10,
    },
    statText: {
        fontSize: 16,
    },
    statValue: {
        fontWeight: '700',
    },
    overallMasteryText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
        paddingTop: 12,
        borderTopWidth: 1,
    },
    overallMasteryValue: {
        fontSize: 20,
        fontWeight: '900',
    },
    chartContainer: {
        marginHorizontal: 20,
        borderRadius: 12,
        paddingTop: 10,
        paddingBottom: 5,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    breakdownContainer: {
        paddingHorizontal: 20,
    },
    masteryCard: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderLeftWidth: 5,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    masteryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    masteryTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    masteryPercent: {
        fontSize: 17,
        fontWeight: '900',
    },
    masterySubtitle: {
        fontSize: 13,
        marginBottom: 8,
    },
    progressBarContainer: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
    },
    emptySubtext: {
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
    },
});

export default ProgressScreen;