import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    Alert, Share, ActivityIndicator, Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useDecks } from '../contexts/DeckContext';
import { useTheme } from '../contexts/ThemeContext';
import { getEcho, disconnectEcho } from '../services/echoService';
import {
    Screen, ScreenHeader, Card, SectionHeader,
    Pill, ProgressBar, EmptyState, MetricCard,
} from '../components';
import { radius, spacing, typography } from '../theme/theme';

const DashboardScreen = ({ navigation }) => {
    const { decks, removeDeck, loading, refreshDecks } = useDecks();
    const { colors } = useTheme();
    const [searchText, setSearchText] = useState('');
    const [userName, setUserName]     = useState('User');
    const [userAvatar, setUserAvatar] = useState(null);

    const loadUser = async () => {
        try {
            const userStr = await SecureStore.getItemAsync('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setUserName(user.username || user.name || 'User');
                setUserAvatar(user.avatar || null);
            }
        } catch (e) {
            console.error('Error loading user:', e);
        }
    };

    useEffect(() => { loadUser(); }, []);

    useFocusEffect(
        React.useCallback(() => { loadUser(); }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            refreshDecks?.({ silent: true });
        }, [refreshDecks])
    );

    useEffect(() => {
        let userId = null;

        const setupEcho = async () => {
            try {
                const userStr = await SecureStore.getItemAsync('user');
                if (!userStr) return;
                const user = JSON.parse(userStr);
                userId = user?.id;
                if (!userId) return;
                const echo = await getEcho();
                if (!echo) return;
                echo.private(`user.${userId}`)
                    .listen('.profile.updated', async (event) => {
                        if (event.source_platform !== 'mobile') {
                            const stored = await SecureStore.getItemAsync('user');
                            const current = stored ? JSON.parse(stored) : {};
                            const merged  = { ...current, username: event.username, avatar: event.avatar };
                            await SecureStore.setItemAsync('user', JSON.stringify(merged));
                            setUserName(event.username);
                            setUserAvatar(event.avatar || null);
                        }
                    })
                    .listen('.force.logout', async (e) => {
                        if (e.platform === 'mobile') {
                            await SecureStore.deleteItemAsync('token');
                            await SecureStore.deleteItemAsync('user');
                            disconnectEcho();
                            navigation.replace('Login');
                        }
                    });
            } catch (err) {
                console.error('Echo setup error:', err);
            }
        };

        setupEcho();
        return () => { if (userId) disconnectEcho(); };
    }, []);

    // ── derived stats ────────────────────────────────────────────────────────
    const totalCards  = decks.reduce((s, d) => s + (d.card_count || d.cardCount || 0), 0);
    const avgMastery  = decks.length
        ? Math.round(decks.reduce((s, d) => s + (d.mastery || 0), 0) / decks.length)
        : 0;
    const needsReview = decks.filter(d => d.status === 'Needs Review').length;

    // ── greeting ─────────────────────────────────────────────────────────────
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const displayName = userName?.trim() || 'Learner';
    const userInitial = displayName.charAt(0).toUpperCase();

    const masteryTone = (mastery) =>
        mastery >= 75 ? colors.success : mastery >= 50 ? colors.warning : colors.danger;

    const DeckCard = ({ deck }) => {
        const mastery   = deck.mastery ?? 0;
        const tone      = masteryTone(mastery);
        const cardCount = deck.card_count || deck.cardCount || 0;
        const shareCode = deck.share_code;
        const needsWork = deck.status === 'Needs Review';

        const handleOptions = (event) => {
            if (event) event.stopPropagation();
            Alert.alert(deck.title, 'Choose an action:', [
                {
                    text: 'Share Deck',
                    onPress: async () => {
                        try {
                            await Share.share({ message: shareCode });
                        } catch (error) {
                            console.error('Error sharing:', error);
                        }
                    },
                },
                {
                    text: 'Remove Deck',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert(
                            'Confirm Removal',
                            `Are you sure you want to remove "${deck.title}"? This cannot be undone.`,
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Remove', style: 'destructive', onPress: () => removeDeck(deck.id) },
                            ],
                        );
                    },
                },
                { text: 'Cancel', style: 'cancel' },
            ]);
        };

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('FlashcardStudy', { deck })}
                activeOpacity={0.75}
            >
                <Card>
                    <View style={styles.deckHeaderRow}>
                        <View style={styles.deckTitleWrap}>
                            <Text style={[styles.deckTitle, { color: colors.text }]} numberOfLines={1}>
                                {deck.title}
                            </Text>
                            <Text style={[styles.deckSource, { color: colors.subtext }]} numberOfLines={1}>
                                {deck.status === 'Imported' ? 'Imported' : 'Generated'} from {deck.source || 'CogniVia'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleOptions}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <MaterialCommunityIcons name="dots-horizontal" size={20} color={colors.subtext} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.deckProgressRow}>
                        <Text style={[styles.deckProgressLabel, { color: colors.subtext }]}>Mastery</Text>
                        <Text style={[styles.deckProgressValue, { color: tone }]}>{mastery}%</Text>
                    </View>
                    <ProgressBar value={mastery} color={tone} style={styles.deckProgressBar} />

                    <View style={styles.deckFooter}>
                        <Pill icon="cards-outline" label={`${cardCount} cards`} />
                        <Pill
                            icon={needsWork ? 'alert-circle-outline' : 'check-circle-outline'}
                            label={needsWork ? 'Review' : 'Ready'}
                            tone={needsWork ? 'danger' : 'success'}
                        />
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={18}
                            color={colors.subtext}
                            style={styles.deckChevron}
                        />
                    </View>
                </Card>
            </TouchableOpacity>
        );
    };

    const filteredDecks = decks.filter(d =>
        String(d.title || '').toLowerCase().includes(searchText.toLowerCase()),
    );

    if (loading) {
        return (
            <Screen scroll={false} contentStyle={styles.loadingContent}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.subtext }]}>Loading your decks…</Text>
            </Screen>
        );
    }

    return (
        <Screen>
            <ScreenHeader
                eyebrow={greeting}
                title={displayName}
                right={
                    <TouchableOpacity
                        style={[styles.avatarBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => navigation.navigate('Profile')}
                        activeOpacity={0.8}
                    >
                        {userAvatar ? (
                            <Image
                                source={{ uri: userAvatar }}
                                style={styles.avatarImg}
                                onError={() => setUserAvatar(null)}
                            />
                        ) : (
                            <Text style={[styles.avatarInitial, { color: colors.text }]}>{userInitial}</Text>
                        )}
                    </TouchableOpacity>
                }
            />

            <View style={styles.statsRow}>
                <MetricCard icon="cards-outline" label="Cards" value={totalCards} tone="primary" />
                <MetricCard icon="trophy-outline" label="Mastery" value={`${avgMastery}%`} tone="success" />
                <MetricCard icon="alert-circle-outline" label="Review" value={needsReview} tone="warning" />
            </View>

            <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <MaterialCommunityIcons name="magnify" size={20} color={colors.subtext} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search decks"
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholderTextColor={colors.subtext}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchText('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <MaterialCommunityIcons name="close-circle" size={18} color={colors.subtext} />
                    </TouchableOpacity>
                )}
            </View>

            <SectionHeader
                title="Deck Library"
                subtitle={searchText ? `${filteredDecks.length} matching` : `${decks.length} total`}
                right={
                    <TouchableOpacity
                        style={[styles.newDeckBtn, { backgroundColor: colors.primarySoft }]}
                        onPress={() => navigation.navigate('Generate')}
                        activeOpacity={0.8}
                    >
                        <MaterialCommunityIcons name="plus" size={15} color={colors.primary} />
                        <Text style={[styles.newDeckText, { color: colors.primary }]}>New deck</Text>
                    </TouchableOpacity>
                }
            />

            {filteredDecks.length === 0 ? (
                <EmptyState
                    icon={searchText ? 'magnify-close' : 'cards-outline'}
                    title={searchText ? 'No matching decks' : 'No decks yet'}
                    body={searchText
                        ? 'Try a different deck name.'
                        : 'Generate your first deck or import one from Profile.'}
                    actionLabel={searchText ? undefined : 'Generate Deck'}
                    onAction={() => navigation.navigate('Generate')}
                />
            ) : (
                filteredDecks.map(deck => <DeckCard key={deck.id} deck={deck} />)
            )}
        </Screen>
    );
};

const styles = StyleSheet.create({
    loadingContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    loadingText:    { marginTop: spacing.md, fontSize: typography.size.body },

    avatarBtn: {
        width: 44, height: 44, borderRadius: radius.pill, borderWidth: 1,
        alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    },
    avatarImg:     { width: 44, height: 44, borderRadius: radius.pill },
    avatarInitial: { fontSize: typography.size.heading, fontWeight: typography.weight.bold },

    statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },

    searchBar: {
        flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
        borderRadius: radius.md, borderWidth: 1,
        paddingHorizontal: spacing.md, height: 48, marginBottom: spacing.xl,
    },
    searchInput: { flex: 1, fontSize: typography.size.body },

    newDeckBtn: {
        flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
        height: 32, paddingHorizontal: spacing.md, borderRadius: radius.pill,
    },
    newDeckText: { fontSize: typography.size.caption, fontWeight: typography.weight.semibold },

    deckHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
    deckTitleWrap: { flex: 1, paddingRight: spacing.md },
    deckTitle:     { fontSize: typography.size.heading, fontWeight: typography.weight.bold, marginBottom: 3 },
    deckSource:    { fontSize: typography.size.micro + 1, lineHeight: 17 },

    deckProgressRow: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: spacing.xs + 2,
    },
    deckProgressLabel: { fontSize: typography.size.micro, fontWeight: typography.weight.semibold },
    deckProgressValue: { fontSize: typography.size.micro, fontWeight: typography.weight.bold },
    deckProgressBar:   { marginBottom: spacing.md },

    deckFooter:  { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    deckChevron: { marginLeft: 'auto' },
});

export default DashboardScreen;
