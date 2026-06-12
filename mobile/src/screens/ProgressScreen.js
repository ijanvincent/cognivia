import React, { useMemo, useState } from 'react';
import {
    View, Text, StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useDecks } from '../contexts/DeckContext';
import { useTheme } from '../contexts/ThemeContext';
import {
    Screen, ScreenHeader, Card, SectionHeader,
    Pill, ProgressBar, EmptyState, MetricCard,
} from '../components';
import { radius, spacing, typography } from '../theme/theme';

const clampPercent = (value) => Math.min(100, Math.max(0, Number(value) || 0));

const ProgressScreen = () => {
    const { decks, loading, refreshDecks } = useDecks();
    const { colors } = useTheme();
    const [refreshing, setRefreshing] = useState(false);

    const masteryTone = (mastery) => {
        if (mastery >= 80) return { color: colors.success, pill: 'success', label: 'Strong', icon: 'check-circle-outline' };
        if (mastery >= 50) return { color: colors.warning, pill: 'warning', label: 'Improving', icon: 'trending-up' };
        return { color: colors.danger, pill: 'danger', label: 'Needs review', icon: 'alert-circle-outline' };
    };

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
            <Screen scroll={false} contentStyle={styles.loadingContent}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.subtext }]}>Loading your progress…</Text>
            </Screen>
        );
    }

    return (
        <Screen
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={colors.primary}
                    colors={[colors.primary]}
                />
            }
        >
            <ScreenHeader eyebrow="Learning analytics" title="Progress" />

            <Card style={styles.overviewCard}>
                <View style={styles.overviewHeader}>
                    <View>
                        <Text style={[styles.overviewLabel, { color: colors.subtext }]}>Overall mastery</Text>
                        <Text style={[styles.overviewValue, { color: colors.text }]}>
                            {progressStats.overallMastery}%
                        </Text>
                    </View>
                    <View style={[styles.overviewIcon, { backgroundColor: colors.primarySoft }]}>
                        <ActivityIndicator 
                            size="small" 
                            color={colors.primary} 
                            animating={false} 
                            style={{ position: 'absolute' }}
                        />
                        <Pill icon="trophy-outline" label="Pro" tone="primary" />
                    </View>
                </View>
                
                <ProgressBar value={progressStats.overallMastery} style={styles.overviewBar} />
                
                <Text style={[styles.overviewNote, { color: colors.subtext }]}>
                    {progressStats.hasMasteryProgress && progressStats.strongestDeck
                        ? `Strongest deck: ${progressStats.strongestDeck.title || 'Untitled Deck'}`
                        : decks.length > 0
                            ? 'Your decks are ready. Complete a study session to start building mastery.'
                            : 'Create a deck and complete reviews to start tracking mastery.'}
                </Text>
            </Card>

            <View style={styles.metricRow}>
                <MetricCard icon="cards-outline" label="Cards" value={progressStats.totalCards} tone="primary" />
                <MetricCard icon="check-decagram-outline" label="Mastered" value={progressStats.totalCardsMastered} tone="success" />
            </View>
            <View style={[styles.metricRow, styles.metricRowLast]}>
                <MetricCard icon="book-open-variant" label="Decks" value={decks.length} tone="neutral" />
                <MetricCard icon="alert-circle-outline" label="Review" value={progressStats.reviewDecks} tone="warning" />
            </View>

            <SectionHeader
                title="Deck Breakdown"
                subtitle={`${decks.length} ${decks.length === 1 ? 'deck' : 'decks'} tracked`}
            />

            {sortedDecks.length > 0 ? (
                sortedDecks.map((deck) => {
                    const cardCount = deck.card_count || deck.cardCount || 0;
                    const mastery = clampPercent(deck.mastery);
                    const mastered = Math.round(cardCount * (mastery / 100));
                    const tone = masteryTone(mastery);

                    return (
                        <Card key={deck.id} style={styles.breakdownCard}>
                            <View style={styles.deckHeader}>
                                <View style={styles.deckTitleWrap}>
                                    <Text style={[styles.deckTitle, { color: colors.text }]} numberOfLines={1}>
                                        {deck.title || 'Untitled Deck'}
                                    </Text>
                                    <Text style={[styles.deckSubtitle, { color: colors.subtext }]} numberOfLines={1}>
                                        {mastered} of {cardCount} cards mastered
                                    </Text>
                                </View>
                                <View style={[styles.percentBadge, { backgroundColor: colors.surfaceSubtle }]}>
                                    <Text style={[styles.deckPercent, { color: tone.color }]}>{mastery}%</Text>
                                </View>
                            </View>

                            <ProgressBar value={mastery} color={tone.color} style={styles.deckBar} />

                            <View style={styles.deckFooter}>
                                <Pill icon={tone.icon} label={tone.label} tone={tone.pill} />
                                <Text style={[styles.deckSource, { color: colors.subtext }]} numberOfLines={1}>
                                    {deck.source || 'CogniVia deck'}
                                </Text>
                            </View>
                        </Card>
                    );
                })
            ) : (
                <EmptyState
                    icon="chart-timeline-variant"
                    title="No progress yet"
                    body="Generate a deck and complete a study session to see analytics here."
                />
            )}
        </Screen>
    );
};

const styles = StyleSheet.create({
    loadingContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    loadingText:    { marginTop: spacing.md, fontSize: typography.size.body },

    overviewCard: {
        padding: spacing.xl,
        borderWidth: 1,
        borderRadius: radius.xl,
    },
    overviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    overviewLabel: {
        fontSize: typography.size.micro,
        fontWeight: typography.weight.bold,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    overviewValue: {
        fontSize: 42,
        fontWeight: typography.weight.bold,
        marginTop: 2,
        letterSpacing: -1,
    },
    overviewIcon: {
        padding: spacing.xs,
        borderRadius: radius.md,
    },
    overviewBar:  { 
        height: 10,
        marginBottom: spacing.lg 
    },
    overviewNote: { 
        fontSize: typography.size.caption, 
        lineHeight: 20,
        fontWeight: typography.weight.medium,
    },

    metricRow:     { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
    metricRowLast: { marginBottom: spacing.xl },

    breakdownCard: {
        padding: spacing.lg,
    },
    deckHeader:    { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
    deckTitleWrap: { flex: 1, paddingRight: spacing.md },
    deckTitle:     { fontSize: typography.size.heading, fontWeight: typography.weight.bold, marginBottom: 4 },
    deckSubtitle:  { fontSize: typography.size.caption, fontWeight: typography.weight.medium },
    percentBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.md,
    },
    deckPercent:   { fontSize: typography.size.body, fontWeight: typography.weight.bold },
    deckBar:       { marginBottom: spacing.lg },
    deckFooter:    { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    deckSource:    { flex: 1, fontSize: typography.size.micro + 1, textAlign: 'right', fontWeight: typography.weight.medium },
});

export default ProgressScreen;
