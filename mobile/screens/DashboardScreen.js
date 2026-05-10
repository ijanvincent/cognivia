import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TextInput, TouchableOpacity, Dimensions,
    Alert, Share, ActivityIndicator, StatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useDecks } from '../DeckContext';
import { useTheme } from '../ThemeContext';
import { getEcho, disconnectEcho } from '../services/echoService';

const { width } = Dimensions.get('window');

const ProgressBar = ({ progress, color, themeColors }) => (
    <View style={[styles.progressBarContainer, { backgroundColor: themeColors.border }]}>
        <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: color }]} />
    </View>
);

// ── Mastery ring ──────────────────────────────────────────────────────────────
const MasteryRing = ({ value, color }) => {
    const size = 44;
    const stroke = 3;
    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{
                position: 'absolute', width: size, height: size,
                borderRadius: size / 2,
                borderWidth: stroke, borderColor: 'rgba(255,255,255,0.08)',
            }} />
            <View style={{
                position: 'absolute', width: size, height: size,
                borderRadius: size / 2,
                borderWidth: stroke,
                borderColor: 'transparent',
                borderTopColor: color,
                borderRightColor: value > 25 ? color : 'transparent',
                borderBottomColor: value > 50 ? color : 'transparent',
                borderLeftColor: value > 75 ? color : 'transparent',
                transform: [{ rotate: '-45deg' }],
            }} />
            <Text style={{ color, fontSize: 10, fontWeight: '700' }}>{value}%</Text>
        </View>
    );
};

// ── Stat pill ──────────────────────────────────────────────────────────────────
const StatPill = ({ icon, label, value, colors }) => (
    <View style={[styles.statPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <MaterialCommunityIcons name={icon} size={16} color={colors.primary} />
        <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: colors.subtext }]}>{label}</Text>
    </View>
);



const DashboardScreen = ({ navigation }) => {
    const { decks, removeDeck, loading } = useDecks();
    const { colors, theme }              = useTheme();
    const [searchText, setSearchText]    = React.useState('');
    const [userName, setUserName]        = useState('User');

    const isDark = theme === 'dark';

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userStr = await SecureStore.getItemAsync('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    setUserName(user.username || user.name || 'User');
                }
            } catch (e) {
                console.error('Error loading user:', e);
            }
        };
        loadUser();
    }, []);

    useEffect(() => {
        let channel = null;
        let userId  = null;

        const setupEcho = async () => {
            try {
                const userStr = await SecureStore.getItemAsync('user');
                if (!userStr) return;
                const user = JSON.parse(userStr);
                userId = user?.id;
                if (!userId) return;
                const echo = await getEcho();
                if (!echo) return;
                channel = echo.private(`user.${userId}`)
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

    const DeckCard = ({ deck }) => {
        const mastery      = deck.mastery ?? 0;
        const masteryColor = mastery >= 75 ? '#34d399' : mastery >= 50 ? '#fbbf24' : '#f87171';
        const cardCount    = deck.card_count || deck.cardCount || 0;

        // ✅ Use share_code directly from the backend
        const shareCode = deck.share_code;

        const handleOptions = (deck, event) => {
            if (event) event.stopPropagation();
            Alert.alert(deck.title, 'Choose an action:', [
                {
                    text: 'Share Deck',
                    onPress: async () => {
                        try {
                            await Share.share({
                                message: shareCode,
                            });
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
                style={[styles.card, {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    shadowColor: '#000',
                }]}
                onPress={() => navigation.navigate('FlashcardStudy', { deck })}
                activeOpacity={0.75}
            >
                {/* left accent bar */}
                <View style={[styles.cardAccent, { backgroundColor: masteryColor }]} />

                <View style={styles.cardInner}>
                    {/* header */}
                    <View style={styles.cardHeaderRow}>
                        <View style={styles.cardTitleContainer}>
                            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                                {deck.title}
                            </Text>
                            <Text style={[styles.cardSource, { color: colors.subtext }]} numberOfLines={1}>
                                {deck.status === 'Imported' ? 'Imported from' : 'Generated from'} "{deck.source}"
                            </Text>
                        </View>

                        {/* mastery ring + options */}
                        <View style={styles.cardRightCol}>
                            <MasteryRing value={mastery} color={masteryColor} />
                            <TouchableOpacity
                                onPress={(e) => { e.stopPropagation(); handleOptions(deck, e); }}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                style={{ marginTop: 4 }}
                            >
                                <MaterialCommunityIcons name="dots-vertical" size={20} color={colors.subtext} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* footer row */}
                    <View style={styles.cardFooter}>
                        <View style={[styles.cardBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]}>
                            <MaterialCommunityIcons name="cards-outline" size={13} color={colors.subtext} />
                            <Text style={[styles.cardBadgeText, { color: colors.subtext }]}>{cardCount} cards</Text>
                        </View>

                        <View style={[
                            styles.cardBadge,
                            { backgroundColor: deck.status === 'Needs Review'
                                ? 'rgba(248,113,113,0.12)'
                                : 'rgba(52,211,153,0.12)' }
                        ]}>
                            <MaterialCommunityIcons
                                name={deck.status === 'Needs Review' ? 'alert-circle-outline' : 'check-circle-outline'}
                                size={13}
                                color={deck.status === 'Needs Review' ? '#f87171' : '#34d399'}
                            />
                            <Text style={[
                                styles.cardBadgeText,
                                { color: deck.status === 'Needs Review' ? '#f87171' : '#34d399' }
                            ]}>
                                {deck.status === 'Needs Review' ? 'Review' : 'Ready'}
                            </Text>
                        </View>

                        <MaterialCommunityIcons name="chevron-right" size={18} color={colors.subtext} style={{ marginLeft: 'auto' }} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const filteredDecks = decks.filter(d =>
        d.title.toLowerCase().includes(searchText.toLowerCase()),
    );

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.subtext }]}>Loading your decks…</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* ── Header ─────────────────────────────────────────────── */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greetingLabel, { color: colors.subtext }]}>
                            {greeting},
                        </Text>
                        <Text style={[styles.greetingName, { color: colors.text }]}>
                            {userName}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.avatarBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <MaterialCommunityIcons name="account" size={22} color={colors.text} />
                    </TouchableOpacity>
                </View>

                {/* ── Stats row ──────────────────────────────────────────── */}
                {decks.length > 0 && (
                    <View style={styles.statsRow}>
                        <StatPill icon="cards-outline"        label="Cards"   value={totalCards}       colors={colors} />
                        <StatPill icon="trophy-outline"       label="Mastery" value={`${avgMastery}%`} colors={colors} />
                        <StatPill icon="alert-circle-outline" label="Review"  value={needsReview}      colors={colors} />
                    </View>
                )}

                {/* ── Search ─────────────────────────────────────────────── */}
                <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <MaterialCommunityIcons name="magnify" size={20} color={colors.subtext} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search decks…"
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholderTextColor={colors.subtext}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <MaterialCommunityIcons name="close-circle" size={18} color={colors.subtext} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* ── Section label ──────────────────────────────────────── */}
                {filteredDecks.length > 0 && (
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Decks</Text>
                        <Text style={[styles.sectionCount, { color: colors.subtext }]}>{filteredDecks.length}</Text>
                    </View>
                )}

                {/* ── Deck list / empty state ─────────────────────────────── */}
                {filteredDecks.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <MaterialCommunityIcons name="cards-outline" size={40} color={colors.subtext} />
                        </View>
                        <Text style={[styles.emptyText, { color: colors.text }]}>No decks yet</Text>
                        <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
                            Tap Generate to create your first flashcard deck
                        </Text>
                    </View>
                ) : (
                    filteredDecks.map(deck => <DeckCard key={deck.id} deck={deck} />)
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container:      { flex: 1 },
    scrollContent:  { paddingHorizontal: 20, paddingTop: Dimensions.get('window').height > 800 ? 60 : 44, paddingBottom: 32 },

    // header
    header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    greetingLabel:  { fontSize: 13, fontWeight: '500', letterSpacing: 0.2, marginBottom: 2 },
    greetingName:   { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
    avatarBtn:      { width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

    // stats
    statsRow:       { flexDirection: 'row', gap: 10, marginBottom: 20 },
    statPill:       { flex: 1, borderRadius: 12, borderWidth: 1, paddingVertical: 12, alignItems: 'center', gap: 4 },
    statValue:      { fontSize: 16, fontWeight: '700' },
    statLabel:      { fontSize: 11, fontWeight: '500' },

    // search
    searchBar:      { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, height: 46, marginBottom: 24 },
    searchInput:    { flex: 1, fontSize: 15 },

    // section
    sectionHeader:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
    sectionTitle:   { fontSize: 15, fontWeight: '700', letterSpacing: 0.1 },
    sectionCount:   { fontSize: 13, fontWeight: '600' },

    // card
    card:           {
        flexDirection: 'row', borderRadius: 14, marginBottom: 12,
        borderWidth: 1, overflow: 'hidden',
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
    },
    cardAccent:         { width: 4 },
    cardInner:          { flex: 1, padding: 14 },
    cardHeaderRow:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    cardTitleContainer: { flex: 1, paddingRight: 10 },
    cardTitle:          { fontSize: 16, fontWeight: '700', marginBottom: 3 },
    cardSource:         { fontSize: 12 },
    cardRightCol:       { alignItems: 'center', gap: 2 },
    cardFooter:         { flexDirection: 'row', alignItems: 'center', gap: 8 },
    cardBadge:          { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
    cardBadgeText:      { fontSize: 12, fontWeight: '600' },

    // empty
    emptyState:     { alignItems: 'center', paddingTop: 60, paddingBottom: 40 },
    emptyIcon:      { width: 80, height: 80, borderRadius: 40, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
    emptyText:      { fontSize: 18, fontWeight: '700', marginBottom: 8 },
    emptySubtext:   { fontSize: 14, textAlign: 'center', lineHeight: 20 },

    // loading
    loadingText:    { marginTop: 12, fontSize: 15 },
});

export default DashboardScreen;