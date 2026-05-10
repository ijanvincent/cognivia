import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TextInput, TouchableOpacity, Dimensions,
    Alert, Share, ActivityIndicator, StatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { useDecks } from '../DeckContext';
import { useTheme } from '../ThemeContext';
import { getEcho, disconnectEcho } from '../services/echoService';

const ProgressBar = ({ progress, color, themeColors }) => (
    <View style={[styles.progressBarContainer, { backgroundColor: themeColors.border }]}>
        <View style={[styles.progressBarFill, { width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: color }]} />
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
const StatCard = ({ icon, label, value, colors, accent }) => (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.statIconWrap, { backgroundColor: `${accent}18` }]}>
            <MaterialCommunityIcons name={icon} size={17} color={accent} />
        </View>
        <View style={styles.statCopy}>
            <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>{value}</Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]} numberOfLines={1}>{label}</Text>
        </View>
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
    const displayName = userName?.trim() || 'Learner';
    const userInitial = displayName.charAt(0).toUpperCase();
    const deckCountLabel = `${decks.length} ${decks.length === 1 ? 'deck' : 'decks'}`;
    const overviewCopy = decks.length > 0
        ? `${totalCards} cards available across ${deckCountLabel}.`
        : 'Create or import a deck to start studying.';

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
                                {deck.status === 'Imported' ? 'Imported' : 'Generated'} from {deck.source || 'CogniVia'}
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

                    <View style={styles.cardProgressRow}>
                        <Text style={[styles.cardProgressLabel, { color: colors.subtext }]}>Mastery</Text>
                        <Text style={[styles.cardProgressValue, { color: masteryColor }]}>{mastery}%</Text>
                    </View>
                    <ProgressBar progress={mastery} color={masteryColor} themeColors={colors} />

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
        String(d.title || '').toLowerCase().includes(searchText.toLowerCase()),
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
                    <View style={styles.headerCopy}>
                        <Text style={[styles.greetingLabel, { color: colors.subtext }]}>
                            {greeting}
                        </Text>
                        <Text style={[styles.greetingName, { color: colors.text }]} numberOfLines={1}>
                            {displayName}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.avatarBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => navigation.navigate('Profile')}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.avatarInitial, { color: colors.text }]}>{userInitial}</Text>
                    </TouchableOpacity>
                </View>

                {/* ── Stats row ──────────────────────────────────────────── */}
                <LinearGradient
                    colors={isDark ? ['#171923', '#0f172a'] : ['#ffffff', '#eef6ff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.overviewCard, { borderColor: colors.border }]}
                >
                    <View style={styles.overviewTopRow}>
                        <View style={styles.overviewIcon}>
                            <MaterialCommunityIcons name="view-dashboard-outline" size={20} color="#38bdf8" />
                        </View>
                        <View style={styles.overviewMeta}>
                            <Text style={[styles.overviewLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>Learning overview</Text>
                            <Text style={[styles.overviewTitle, { color: colors.text }]}>{deckCountLabel}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.generateBtn}
                            onPress={() => navigation.navigate('Generate')}
                            activeOpacity={0.85}
                        >
                            <MaterialCommunityIcons name="plus" size={18} color="#07111f" />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.overviewCopy, { color: isDark ? '#cbd5e1' : '#475569' }]}>
                        {overviewCopy}
                    </Text>

                    <View style={styles.statsRow}>
                        <StatCard icon="cards-outline" label="Cards" value={totalCards} colors={colors} accent="#38bdf8" />
                        <StatCard icon="trophy-outline" label="Mastery" value={`${avgMastery}%`} colors={colors} accent="#34d399" />
                        <StatCard icon="alert-circle-outline" label="Review" value={needsReview} colors={colors} accent="#f59e0b" />
                    </View>
                </LinearGradient>

                {/* ── Search ─────────────────────────────────────────────── */}
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

                {/* ── Section label ──────────────────────────────────────── */}
                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Deck Library</Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>
                            {searchText ? `${filteredDecks.length} matching` : `${decks.length} total`}
                        </Text>
                    </View>
                </View>

                {/* ── Deck list / empty state ─────────────────────────────── */}
                {filteredDecks.length === 0 ? (
                    <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={[styles.emptyIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc' }]}>
                            <MaterialCommunityIcons
                                name={searchText ? 'magnify-close' : 'cards-outline'}
                                size={36}
                                color={colors.subtext}
                            />
                        </View>
                        <Text style={[styles.emptyText, { color: colors.text }]}>
                            {searchText ? 'No matching decks' : 'No decks yet'}
                        </Text>
                        <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
                            {searchText ? 'Try a different deck name.' : 'Generate your first deck or import one from Profile.'}
                        </Text>
                        {!searchText && (
                            <TouchableOpacity
                                style={styles.emptyAction}
                                onPress={() => navigation.navigate('Generate')}
                                activeOpacity={0.85}
                            >
                                <MaterialCommunityIcons name="plus" size={17} color="#07111f" />
                                <Text style={styles.emptyActionText}>Generate Deck</Text>
                            </TouchableOpacity>
                        )}
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
    scrollContent:  { paddingHorizontal: 20, paddingTop: Dimensions.get('window').height > 800 ? 58 : 42, paddingBottom: 32 },

    // header
    header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
    headerCopy:     { flex: 1, paddingRight: 16 },
    greetingLabel:  { fontSize: 13, fontWeight: '600', letterSpacing: 0.2, marginBottom: 3 },
    greetingName:   { fontSize: 28, fontWeight: '800' },
    avatarBtn:      { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    avatarInitial:  { fontSize: 17, fontWeight: '800' },

    // overview
    overviewCard:   { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 16, overflow: 'hidden' },
    overviewTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    overviewIcon:   { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(56,189,248,0.14)', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    overviewMeta:   { flex: 1 },
    overviewLabel:  { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 },
    overviewTitle:  { fontSize: 22, fontWeight: '800' },
    overviewCopy:   { fontSize: 13, lineHeight: 19, marginBottom: 14 },
    generateBtn:    { width: 36, height: 36, borderRadius: 18, backgroundColor: '#38bdf8', alignItems: 'center', justifyContent: 'center' },

    // stats
    statsRow:       { flexDirection: 'row', gap: 8 },
    statCard:       { flex: 1, minHeight: 72, borderRadius: 14, borderWidth: 1, padding: 10, justifyContent: 'space-between' },
    statIconWrap:   { width: 28, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    statCopy:       { gap: 1 },
    statValue:      { fontSize: 17, fontWeight: '800' },
    statLabel:      { fontSize: 11, fontWeight: '600' },

    // search
    searchBar:      { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, height: 48, marginBottom: 20 },
    searchInput:    { flex: 1, fontSize: 15 },

    // section
    sectionHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    sectionTitle:   { fontSize: 17, fontWeight: '800' },
    sectionSubtitle:{ fontSize: 12, fontWeight: '600', marginTop: 2 },

    // card
    card:           {
        flexDirection: 'row', borderRadius: 16, marginBottom: 12,
        borderWidth: 1, overflow: 'hidden',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
    },
    cardAccent:         { width: 5 },
    cardInner:          { flex: 1, padding: 15 },
    cardHeaderRow:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    cardTitleContainer: { flex: 1, paddingRight: 10 },
    cardTitle:          { fontSize: 16, fontWeight: '800', marginBottom: 4 },
    cardSource:         { fontSize: 12, lineHeight: 17 },
    cardRightCol:       { alignItems: 'center', gap: 2 },
    cardProgressRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 },
    cardProgressLabel:  { fontSize: 11, fontWeight: '700' },
    cardProgressValue:  { fontSize: 11, fontWeight: '800' },
    progressBarContainer: { height: 5, borderRadius: 999, overflow: 'hidden', marginBottom: 13 },
    progressBarFill:    { height: '100%', borderRadius: 999 },
    cardFooter:         { flexDirection: 'row', alignItems: 'center', gap: 8 },
    cardBadge:          { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
    cardBadgeText:      { fontSize: 12, fontWeight: '600' },

    // empty
    emptyState:     { alignItems: 'center', borderWidth: 1, borderRadius: 18, paddingHorizontal: 22, paddingVertical: 34 },
    emptyIcon:      { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    emptyText:      { fontSize: 18, fontWeight: '800', marginBottom: 8 },
    emptySubtext:   { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 18 },
    emptyAction:    { height: 42, borderRadius: 21, backgroundColor: '#38bdf8', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 6 },
    emptyActionText:{ color: '#07111f', fontSize: 14, fontWeight: '800' },

    // loading
    loadingText:    { marginTop: 12, fontSize: 15 },
});

export default DashboardScreen;
