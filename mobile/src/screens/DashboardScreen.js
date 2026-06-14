import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    Alert, Share, ActivityIndicator, Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import * as SecureStore from '../services/secureStorage';
import { refreshUserProfile, resolveAvatarUrl } from '../services/api';
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
    const [isOnline, setIsOnline]     = useState(true);

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
        // Server is the source of truth — pick up profile changes made on web
        // even if the realtime event was missed. Cache shown above stays if
        // this fails (e.g. offline).
        try {
            const fresh = await refreshUserProfile();
            if (fresh) {
                setUserName(fresh.username || fresh.name || 'User');
                setUserAvatar(fresh.avatar || null);
            }
        } catch { /* offline or token expired — keep cached values */ }
    };

    useEffect(() => { loadUser(); }, []);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOnline(state.isConnected && state.isInternetReachable !== false);
        });
        return unsubscribe;
    }, []);

    useFocusEffect(
        React.useCallback(() => { loadUser(); }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            refreshDecks?.({ silent: true });
        }, [refreshDecks])
    );

    // Near-realtime dashboard: while this screen is focused, poll the deck list
    // so newly generated decks and updated mastery/progress appear on their own
    // without a manual reload. The interval is cleared on blur to avoid waking
    // the screen in the background. (True server push would require backend
    // broadcast events for deck create/update.)
    useFocusEffect(
        React.useCallback(() => {
            const id = setInterval(() => {
                refreshDecks?.({ silent: true });
            }, 30000);
            return () => clearInterval(id);
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
                        // REALTIME PROFILE SYNC FIX.
                        //
                        // What: Apply the update for every source_platform, including
                        //       'mobile'. Removed the prior
                        //       `if (event.source_platform !== 'mobile')` guard.
                        //
                        // Why:  The guard meant a profile edit made in one mobile
                        //       session never reached another mobile session — both
                        //       report X-Platform: mobile, so the second device stayed
                        //       stale until a manual reload. The merge only re-applies
                        //       the broadcast username/avatar, so re-processing this
                        //       device's own event is idempotent and harmless.
                        const stored = await SecureStore.getItemAsync('user');
                        const current = stored ? JSON.parse(stored) : {};
                        const merged  = { ...current, username: event.username, avatar: event.avatar };
                        await SecureStore.setItemAsync('user', JSON.stringify(merged));
                        setUserName(event.username);
                        setUserAvatar(event.avatar || null);
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
                activeOpacity={0.85}
                style={styles.deckCardWrapper}
            >
                <Card style={styles.deckCard} padded={false}>
                    <View style={styles.deckContent}>
                        <View style={styles.deckHeaderRow}>
                            <View style={styles.deckTitleWrap}>
                                <Text style={[styles.deckTitle, { color: colors.text }]} numberOfLines={1}>
                                    {deck.title}
                                </Text>
                                <View style={styles.deckMetaRow}>
                                    <MaterialCommunityIcons name="layers-outline" size={12} color={colors.subtext} />
                                    <Text style={[styles.deckSource, { color: colors.subtext }]}>
                                        {cardCount} cards • {deck.source || 'CogniVia'}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={handleOptions}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                style={[styles.optionBtn, { backgroundColor: colors.surfaceSubtle }]}
                            >
                                <MaterialCommunityIcons name="dots-horizontal" size={18} color={colors.subtext} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.deckFooter}>
                            <View style={styles.masterySection}>
                                <View style={styles.deckProgressRow}>
                                    <Text style={[styles.deckProgressLabel, { color: colors.subtext }]}>Mastery</Text>
                                    <Text style={[styles.deckProgressValue, { color: tone }]}>{mastery}%</Text>
                                </View>
                                <ProgressBar value={mastery} color={tone} style={styles.deckProgressBar} />
                            </View>
                            
                            <View style={[styles.statusBadge, { backgroundColor: needsWork ? colors.dangerSoft : colors.successSoft }]}>
                                <Text style={[styles.statusText, { color: needsWork ? colors.danger : colors.success }]}>
                                    {needsWork ? 'Review' : 'Ready'}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.deckAccent, { backgroundColor: tone }]} />
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
                    <View style={styles.avatarWrapper}>
                        <TouchableOpacity
                            style={[styles.avatarBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={() => navigation.navigate('Profile')}
                            activeOpacity={0.8}
                        >
                            {userAvatar ? (
                                <Image
                                    source={{ uri: resolveAvatarUrl(userAvatar) }}
                                    style={styles.avatarImg}
                                    onError={() => setUserAvatar(null)}
                                />
                            ) : (
                                <Text style={[styles.avatarInitial, { color: colors.text }]}>{userInitial}</Text>
                            )}
                        </TouchableOpacity>
                        <View style={[
                            styles.statusDot,
                            {
                                backgroundColor: isOnline ? colors.success : colors.subtext,
                                borderColor: colors.background,
                            },
                        ]} />
                    </View>
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

    avatarWrapper: {
        position: 'relative',
    },
    avatarBtn: {
        width: 44, height: 44, borderRadius: radius.pill, borderWidth: 1,
        alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    },
    avatarImg:     { width: 44, height: 44, borderRadius: radius.pill },
    avatarInitial: { fontSize: typography.size.heading, fontWeight: typography.weight.bold },
    statusDot: {
        position: 'absolute',
        bottom: 1,
        right: 1,
        width: 11,
        height: 11,
        borderRadius: radius.pill,
        borderWidth: 2,
    },

    statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },

    searchBar: {
        flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
        borderRadius: radius.lg, borderWidth: 1,
        paddingHorizontal: spacing.md, height: 48, marginBottom: spacing.xl,
    },
    searchInput: { flex: 1, fontSize: typography.size.body },

    newDeckBtn: {
        flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
        height: 32, paddingHorizontal: spacing.md, borderRadius: radius.pill,
    },
    newDeckText: { fontSize: typography.size.caption, fontWeight: typography.weight.semibold },

    // ── DeckCard Redesign ───────────────────────────────────────────────────
    deckCardWrapper: { marginBottom: spacing.md },
    deckCard: {
        marginBottom: 0,
        overflow: 'hidden',
        flexDirection: 'row',
    },
    deckContent: {
        flex: 1,
        padding: spacing.lg,
    },
    deckAccent: {
        width: 6,
        height: '100%',
    },
    deckHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
    },
    deckTitleWrap: { flex: 1, paddingRight: spacing.sm },
    deckTitle: {
        fontSize: typography.size.heading,
        fontWeight: typography.weight.bold,
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    deckMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    deckSource: {
        fontSize: typography.size.micro + 1,
        fontWeight: typography.weight.medium,
    },
    optionBtn: {
        width: 32,
        height: 32,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deckFooter: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: spacing.lg,
    },
    masterySection: { flex: 1 },
    deckProgressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    deckProgressLabel: {
        fontSize: typography.size.micro,
        fontWeight: typography.weight.bold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    deckProgressValue: {
        fontSize: typography.size.micro + 1,
        fontWeight: typography.weight.bold,
    },
    deckProgressBar: { marginBottom: 0 },
    statusBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        borderRadius: radius.pill,
    },
    statusText: {
        fontSize: typography.size.micro,
        fontWeight: typography.weight.bold,
        textTransform: 'uppercase',
    },
});

export default DashboardScreen;
