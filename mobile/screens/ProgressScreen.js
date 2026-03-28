import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Dimensions,
    Platform, ActivityIndicator, RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useDecks } from '../DeckContext';
import { useTheme } from '../ThemeContext';

const screenWidth = Dimensions.get('window').width;

const MasteryDeckCard = ({ deck }) => {
    const { colors } = useTheme();
    const cardCount        = deck.card_count || deck.cardCount || 0;
    const answeredCorrectly = Math.round(cardCount * (deck.mastery / 100));
    const masteryColor     = deck.mastery >= 80 ? '#4CAF50' : deck.mastery >= 50 ? '#FFC107' : '#FF5722';

    return (
        <View style={[styles.masteryCard, { backgroundColor: colors.card, borderLeftColor: masteryColor, shadowColor: colors.shadow }]}>
            <View style={styles.masteryHeader}>
                <Text style={[styles.masteryTitle, { color: colors.text }]}>{deck.title}</Text>
                <Text style={[styles.masteryPercent, { color: masteryColor }]}>{deck.mastery}%</Text>
            </View>
            <Text style={[styles.masterySubtitle, { color: colors.subtext }]}>
                {answeredCorrectly} / {cardCount} Cards Answered Correctly
            </Text>
            <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
                <View style={[styles.progressBarFill, { width: `${deck.mastery}%`, backgroundColor: masteryColor }]} />
            </View>
        </View>
    );
};

const ProgressScreen = () => {
    const { decks }    = useDecks();
    const { colors }   = useTheme();
    const [loading, setLoading]       = useState(false);
    const [refreshing, setRefreshing] = useState(false);


    const getLast7DayLabels = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const labels = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            labels.push(days[d.getDay()]);
        }
        return labels;
    };

  
    const chartData = {
        labels: getLast7DayLabels(),
        datasets: [{
            data: decks.length > 0
                ? [...Array(7)].map((_, i) => decks[i % decks.length]?.mastery || 0)
                : [0, 0, 0, 0, 0, 0, 0],
            color: (opacity = 1) => `rgba(42, 93, 255, ${opacity})`,
            strokeWidth: 2,
        }],
    };

    const chartConfig = {
        backgroundColor: colors.card,
        backgroundGradientFrom: colors.card,
        backgroundGradientTo: colors.card,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(42, 93, 255, ${opacity})`,
        labelColor: (opacity = 1) => colors.text.startsWith('#')
            ? (() => {
                const hex = colors.text.replace('#', '');
                const r = parseInt(hex.substr(0, 2), 16);
                const g = parseInt(hex.substr(2, 2), 16);
                const b = parseInt(hex.substr(4, 2), 16);
                return `rgba(${r}, ${g}, ${b}, ${opacity})`;
            })()
            : `rgba(51, 51, 51, ${opacity})`,
        style: { borderRadius: 16 },
        propsForDots: { r: '6', strokeWidth: '2', stroke: colors.primary },
    };

    const totalCardsMastered = decks.reduce((sum, d) => {
        const count = d.card_count || d.cardCount || 0;
        return sum + Math.round(count * (d.mastery / 100));
    }, 0);

    const overallMastery = decks.length > 0
        ? decks.reduce((sum, d) => sum + d.mastery, 0) / decks.length
        : 0;

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 500);
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
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
            }
        >
            <Text style={[styles.header, { color: colors.text }]}>Your Progress</Text>

        
            <View style={[styles.statsCard, { backgroundColor: colors.card, shadowColor: colors.shadow, borderTopColor: colors.border }]}>
                <View style={styles.statRow}>
                    <MaterialCommunityIcons name="cards" size={20} color={colors.primary} />
                    <Text style={[styles.statText, { color: colors.subtext }]}>
                        Total Cards Mastered: <Text style={[styles.statValue, { color: colors.text }]}>{totalCardsMastered}</Text>
                    </Text>
                </View>
                <View style={styles.statRow}>
                    <MaterialCommunityIcons name="book-open-variant" size={20} color={colors.primary} />
                    <Text style={[styles.statText, { color: colors.subtext }]}>
                        Total Decks: <Text style={[styles.statValue, { color: colors.text }]}>{decks.length}</Text>
                    </Text>
                </View>
                <Text style={[styles.overallMasteryText, { color: colors.primary, borderTopColor: colors.border }]}>
                    Overall Mastery: <Text style={styles.overallMasteryValue}>{overallMastery.toFixed(0)}%</Text>
                </Text>
            </View>

            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Mastery Overview (Last 7 Days)</Text>
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

         
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Mastery Breakdown by Deck</Text>
            <View style={styles.breakdownContainer}>
                {decks.length > 0 ? (
                    decks.map(deck => <MasteryDeckCard key={deck.id} deck={deck} />)
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
    container: { flex: 1 },
    loadingContainer: { justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16 },
    header: { fontSize: 28, fontWeight: '700', marginTop: Platform.OS === 'ios' ? 60 : 50, marginBottom: 20, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10, paddingHorizontal: 20 },
    statsCard: { marginHorizontal: 20, padding: 20, borderRadius: 12, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, marginBottom: 15 },
    statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
    statText: { fontSize: 16 },
    statValue: { fontWeight: '700' },
    overallMasteryText: { fontSize: 18, fontWeight: '600', marginTop: 10, paddingTop: 12, borderTopWidth: 1 },
    overallMasteryValue: { fontSize: 20, fontWeight: '900' },
    chartContainer: { marginHorizontal: 20, borderRadius: 12, paddingTop: 10, paddingBottom: 5, alignItems: 'center', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    chart: { marginVertical: 8, borderRadius: 16 },
    breakdownContainer: { paddingHorizontal: 20 },
    masteryCard: { padding: 15, borderRadius: 10, marginBottom: 10, borderLeftWidth: 5, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    masteryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    masteryTitle: { fontSize: 17, fontWeight: '600' },
    masteryPercent: { fontSize: 17, fontWeight: '900' },
    masterySubtitle: { fontSize: 13, marginBottom: 8 },
    progressBarContainer: { height: 8, borderRadius: 4, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 4 },
    emptyState: { alignItems: 'center', paddingVertical: 40 },
    emptyText: { fontSize: 18, fontWeight: '600', marginTop: 10 },
    emptySubtext: { fontSize: 14, marginTop: 5, textAlign: 'center' },
});

export default ProgressScreen;