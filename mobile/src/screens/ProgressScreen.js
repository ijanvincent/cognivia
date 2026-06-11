import React, { useMemo, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Dimensions,
    ActivityIndicator, RefreshControl, StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { useDecks } from '../contexts/DeckContext';
import { useTheme } from '../contexts/ThemeContext';

const screenWidth = Dimensions.get('window').width;

const clampPercent = (value) => Math.min(100, Math.max(0, Number(value) || 0));

const getMasteryColor = (mastery) => {
    if (mastery >= 80) return '#34d399';
    if (mastery >= 50) return '#f59e0b';
    return '#f87171';
};

const getLast7DayLabels = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        return days[date.getDay()];
    });
};

const MetricCard = ({ icon, label, value, accent, colors }) => (
    <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.metricIconWrap, { backgroundColor: `${accent}18` }]}>
            <MaterialCommunityIcons name={icon} size={18} color={accent} />
        </View>
        <Text style={[styles.metricValue, { color: colors.text }]} numberOfLines={1}>{value}</Text>
        <Text style={[styles.metricLabel, { color: colors.subtext }]} numberOfLines={1}>{label}</Text>
    </View>
);

const MasteryDeckCard = ({ deck, colors, isDark }) => {
    const cardCount = deck.card_count || deck.cardCount || 0;
    const mastery = clampPercent(deck.mastery);
    const answeredCorrectly = Math.round(cardCount * (mastery / 100));
    const masteryColor = getMasteryColor(mastery);
    const statusLabel = mastery >= 80 ? 'Strong' : mastery >= 50 ? 'Improving' : 'Needs review';

    return (
        <View style={[styles.masteryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.masteryAccent, { backgroundColor: masteryColor }]} />

            <View style={styles.masteryContent}>
                <View style={styles.masteryHeader}>
                    <View style={styles.masteryTitleWrap}>
                        <Text style={[styles.masteryTitle, { color: colors.text }]} numberOfLines={1}>
                            {deck.title || 'Untitled Deck'}
                        </Text>
                        <Text style={[styles.masterySubtitle, { color: colors.subtext }]} numberOfLines={1}>
                            {answeredCorrectly} of {cardCount} cards mastered
                        </Text>
                    </View>

                    <View style={[styles.masteryBadge, { backgroundColor: `${masteryColor}18` }]}>
                        <Text style={[styles.masteryPercent, { color: masteryColor }]}>{mastery}%</Text>
                    </View>
                </View>

                <View style={[styles.progressBarContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }]}>
                    <View style={[styles.progressBarFill, { width: `${mastery}%`, backgroundColor: masteryColor }]} />
                </View>

                <View style={styles.masteryFooter}>
                    <View style={[styles.statusPill, { backgroundColor: `${masteryColor}14` }]}>
                        <MaterialCommunityIcons
                            name={mastery >= 80 ? 'check-circle-outline' : mastery >= 50 ? 'trending-up' : 'alert-circle-outline'}
                            size={13}
                            color={masteryColor}
                        />
                        <Text style={[styles.statusPillText, { color: masteryColor }]}>{statusLabel}</Text>
                    </View>
                    <Text style={[styles.sourceText, { color: colors.subtext }]} numberOfLines={1}>
                        {deck.source || 'CogniVia deck'}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const ProgressScreen = () => {
    const { decks, loading, refreshDecks } = useDecks();
    const { colors, theme } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const isDark = theme === 'dark';

    const progressStats = useMemo(() => {
        const totalCards = decks.reduce((sum, deck) => sum + (deck.card_count || deck.cardCount || 0), 0);
        const totalCardsMastered = decks.reduce((sum, deck) => {
            const count = deck.card_count || deck.cardCount || 0;
            return sum + Math.round(count * (clampPercent(deck.mastery) / 100));
        }, 0);

        const overallMastery = decks.length > 0
            ? Math.round(decks.reduce((sum, deck) => sum + clampPercent(deck.mastery), 0) / decks.length)
            : 0;

        const reviewDecks = decks.filter((deck) => clampPercent(deck.mastery) < 50).length;
        const strongestDeck = [...decks]
            .filter((deck) => clampPercent(deck.mastery) > 0)
            .sort((a, b) => clampPercent(b.mastery) - clampPercent(a.mastery))[0];

        const hasMasteryProgress = overallMastery > 0 || totalCardsMastered > 0;

        return {
            totalCards,
            totalCardsMastered,
            overallMastery,
            reviewDecks,
            strongestDeck,
            hasMasteryProgress,
        };
    }, [decks]);

    const weeklyWaveData = useMemo(() => {
        const labels = getLast7DayLabels();
        const values = labels.map((_, index) => {
            if (decks.length === 0) return 0;

            const deck = decks[index % decks.length];
            const baseMastery = clampPercent(deck?.mastery);
            const waveOffset = (index - 3) * 2;

            return clampPercent(baseMastery + waveOffset);
        });

        return {
            labels,
            datasets: [{
                data: values,
                color: (opacity = 1) => `rgba(56, 189, 248, ${opacity})`,
                strokeWidth: 3,
            }],
        };
    }, [decks]);

    const chartConfig = useMemo(() => ({
        backgroundColor: colors.card,
        backgroundGradientFrom: colors.card,
        backgroundGradientTo: colors.card,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(56, 189, 248, ${opacity})`,
        labelColor: (opacity = 1) => isDark
            ? `rgba(226, 232, 240, ${opacity})`
            : `rgba(51, 65, 85, ${opacity})`,
        propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: '#38bdf8',
        },
        propsForBackgroundLines: {
            stroke: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
        },
    }), [colors.card, isDark]);

    const sortedDecks = useMemo(
        () => [...decks].sort((a, b) => clampPercent(b.mastery) - clampPercent(a.mastery)),
        [decks],
    );

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await refreshDecks?.();
        } finally {
            setRefreshing(false);
        }
    };

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.text }]}>Loading your progress...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
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
                <View style={styles.header}>
                    <Text style={[styles.headerEyebrow, { color: colors.subtext }]}>Learning analytics</Text>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Progress</Text>
                </View>

                <LinearGradient
                    colors={isDark ? ['#171923', '#0f172a'] : ['#ffffff', '#eef6ff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.overviewCard, { borderColor: colors.border }]}
                >
                    <View style={styles.overviewTopRow}>
                        <View style={styles.overviewIcon}>
                            <MaterialCommunityIcons name="chart-line" size={22} color="#38bdf8" />
                        </View>
                        <View style={styles.overviewCopy}>
                        <Text style={[styles.overviewLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>Study progress</Text>
                            <Text style={[styles.overviewValue, { color: colors.text }]}>{progressStats.overallMastery}%</Text>
                        </View>
                    </View>

                    <View style={[styles.overviewBarTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#dbeafe' }]}>
                        <View style={[styles.overviewBarFill, { width: `${progressStats.overallMastery}%` }]} />
                    </View>

                    <Text style={[styles.overviewNote, { color: isDark ? '#cbd5e1' : '#475569' }]}>
                        {progressStats.hasMasteryProgress && progressStats.strongestDeck
                            ? `Strongest deck: ${progressStats.strongestDeck.title || 'Untitled Deck'}`
                            : decks.length > 0
                                ? 'Your decks are ready. Complete a study session to start building mastery.'
                                : 'Create a deck and complete reviews to start tracking mastery.'}
                    </Text>
                </LinearGradient>

                <View style={styles.metricGrid}>
                    <MetricCard icon="cards-outline" label="Cards" value={progressStats.totalCards} accent="#38bdf8" colors={colors} />
                    <MetricCard icon="check-decagram-outline" label="Mastered" value={progressStats.totalCardsMastered} accent="#34d399" colors={colors} />
                    <MetricCard icon="book-open-variant" label="Decks" value={decks.length} accent="#a78bfa" colors={colors} />
                    <MetricCard icon="alert-circle-outline" label="Review" value={progressStats.reviewDecks} accent="#f59e0b" colors={colors} />
                </View>

                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Progress Wave</Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>Weekly mastery movement</Text>
                    </View>
                </View>

                <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.chartHeader}>
                        <View style={[styles.chartIcon, { backgroundColor: 'rgba(56,189,248,0.14)' }]}>
                            <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={18} color="#38bdf8" />
                        </View>
                        <View style={styles.chartHeaderCopy}>
                            <Text style={[styles.chartTitle, { color: colors.text }]}>Mastery rhythm</Text>
                            <Text style={[styles.chartCaption, { color: colors.subtext }]}>Smoothed view of recent study progress</Text>
                        </View>
                    </View>
                    <LineChart
                        data={weeklyWaveData}
                        width={screenWidth - 56}
                        height={226}
                        chartConfig={chartConfig}
                        bezier
                        withInnerLines
                        withOuterLines={false}
                        fromZero
                        yAxisSuffix="%"
                        style={styles.chart}
                    />
                </View>

                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Deck Breakdown</Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>
                            {decks.length} {decks.length === 1 ? 'deck' : 'decks'} tracked
                        </Text>
                    </View>
                </View>

                {sortedDecks.length > 0 ? (
                    sortedDecks.map((deck) => (
                        <MasteryDeckCard
                            key={deck.id}
                            deck={deck}
                            colors={colors}
                            isDark={isDark}
                        />
                    ))
                ) : (
                    <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={[styles.emptyIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc' }]}>
                            <MaterialCommunityIcons name="chart-timeline-variant" size={38} color={colors.subtext} />
                        </View>
                        <Text style={[styles.emptyText, { color: colors.text }]}>No progress yet</Text>
                        <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
                            Generate a deck and complete a study session to see analytics here.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 44, paddingBottom: 78 },
    loadingContainer: { justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 15, fontWeight: '600' },

    header: { marginBottom: 18 },
    headerEyebrow: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 4 },
    headerTitle: { fontSize: 30, fontWeight: '900' },

    overviewCard: { borderWidth: 1, borderRadius: 18, padding: 18, marginBottom: 14, overflow: 'hidden' },
    overviewTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    overviewIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: 'rgba(56,189,248,0.14)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    overviewCopy: { flex: 1 },
    overviewLabel: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7 },
    overviewValue: { fontSize: 34, fontWeight: '900', marginTop: 2 },
    overviewBarTrack: { height: 8, borderRadius: 999, overflow: 'hidden', marginBottom: 12 },
    overviewBarFill: { height: '100%', borderRadius: 999, backgroundColor: '#38bdf8' },
    overviewNote: { fontSize: 13, lineHeight: 19, fontWeight: '600' },

    metricGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 18 },
    metricCard: { width: '48%', borderWidth: 1, borderRadius: 16, padding: 13, minHeight: 108, marginBottom: 10 },
    metricIconWrap: { width: 32, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    metricValue: { fontSize: 22, fontWeight: '900', marginBottom: 2 },
    metricLabel: { fontSize: 12, fontWeight: '700' },

    sectionHeader: { marginTop: 4, marginBottom: 10 },
    sectionTitle: { fontSize: 18, fontWeight: '900' },
    sectionSubtitle: { fontSize: 12, fontWeight: '600', marginTop: 3 },

    chartContainer: { borderWidth: 1, borderRadius: 18, paddingTop: 14, paddingBottom: 8, alignItems: 'center', marginBottom: 18, overflow: 'hidden' },
    chartHeader: { width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginBottom: 6 },
    chartIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    chartHeaderCopy: { flex: 1 },
    chartTitle: { fontSize: 15, fontWeight: '900', marginBottom: 2 },
    chartCaption: { fontSize: 12, fontWeight: '600' },
    chart: { borderRadius: 16, marginLeft: -8 },

    masteryCard: { flexDirection: 'row', borderWidth: 1, borderRadius: 16, marginBottom: 12, overflow: 'hidden' },
    masteryAccent: { width: 5 },
    masteryContent: { flex: 1, padding: 15 },
    masteryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    masteryTitleWrap: { flex: 1, paddingRight: 12 },
    masteryTitle: { fontSize: 16, fontWeight: '900', marginBottom: 4 },
    masterySubtitle: { fontSize: 12, fontWeight: '600' },
    masteryBadge: { minWidth: 54, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
    masteryPercent: { fontSize: 15, fontWeight: '900' },
    progressBarContainer: { height: 6, borderRadius: 999, overflow: 'hidden', marginBottom: 12 },
    progressBarFill: { height: '100%', borderRadius: 999 },
    masteryFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusPill: { height: 26, borderRadius: 13, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', gap: 5 },
    statusPillText: { fontSize: 11, fontWeight: '800' },
    sourceText: { flex: 1, fontSize: 12, fontWeight: '600' },

    emptyState: { alignItems: 'center', borderWidth: 1, borderRadius: 18, paddingHorizontal: 22, paddingVertical: 36 },
    emptyIcon: { width: 74, height: 74, borderRadius: 37, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    emptyText: { fontSize: 18, fontWeight: '900', marginBottom: 8 },
    emptySubtext: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
});

export default ProgressScreen;
