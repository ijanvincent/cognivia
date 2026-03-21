import React, { useRef, useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    Dimensions, StatusBar, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width: W } = Dimensions.get('window');

// ── Fixed professional color palette — no per-slide color changes ──
const C = {
    bg:       '#07080f',
    card:     'rgba(255,255,255,0.04)',
    border:   'rgba(255,255,255,0.09)',
    cyan:     '#22d3ee',
    purple:   '#a855f7',
    text:     '#f1f5f9',
    sub:      'rgba(241,245,249,0.55)',
    muted:    'rgba(241,245,249,0.30)',
    dotActive:'#f1f5f9',
    dotInactive: 'rgba(255,255,255,0.25)',
};

const SLIDES = [
    {
        id:    '1',
        icon:  'brain',
        title: 'Where Learning\nMeets Play.',
        body:  'CogniVia is an AI-powered learning companion that turns everyday knowledge into an engaging, gamified adventure — built for curious minds.',
        stats: [
            { value: '500+', label: 'Topics'       },
            { value: '10K+', label: 'Learners'     },
            { value: '98%',  label: 'Satisfaction' },
        ],
    },
    {
        id:    '2',
        icon:  'cards-outline',
        title: 'Smart Tools\nBuilt for You.',
        body:  'Auto-generated flashcards, AI-powered answer checking, spaced repetition scheduling, and detailed progress analytics — all in one place.',
        features: [
            { icon: 'flash',        label: 'AI Flashcard Generation' },
            { icon: 'check-circle', label: 'Smart Answer Checking'   },
            { icon: 'chart-line',   label: 'Progress Analytics'      },
            { icon: 'trophy',       label: 'Mastery Tracking'        },
        ],
    },
    {
        id:    '3',
        icon:  'lightning-bolt',
        title: 'One Platform.\nEvery Learner.',
        body:  'Whether you\'re a student, professional, or lifelong learner — CogniVia adapts to your pace, turning any free moment into a productive session.',
        features: [
            { icon: 'account',       label: 'Personalized Learning'  },
            { icon: 'file-document', label: 'Document to Flashcards' },
            { icon: 'robot',         label: 'Gemini AI Powered'      },
            { icon: 'shield-check',  label: 'Secure & Private'       },
        ],
    },
    {
        id:    '4',
        icon:  'rocket-launch',
        title: 'Start Your\nJourney Today.',
        body:  'Join thousands of curious learners already levelling up with CogniVia. Your first flashcard deck is just minutes away.',
    },
];

// ── Slide ─────────────────────────────────────────────────────
const Slide = ({ item }) => (
    <View style={styles.slide}>
        {/* Icon */}
        <View style={styles.iconWrap}>
            <MaterialCommunityIcons name={item.icon} size={44} color={C.cyan} />
        </View>

        {/* Accent bar */}
        <LinearGradient
            colors={[C.cyan, C.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.accentBar}
        />

        {/* Title */}
        <Text style={styles.title}>{item.title}</Text>

        {/* Body */}
        <Text style={styles.body}>{item.body}</Text>

        {/* Stats — slide 1 */}
        {item.stats && (
            <View style={styles.statsRow}>
                {item.stats.map((s, i) => (
                    <View key={i} style={styles.statCard}>
                        <Text style={styles.statValue}>{s.value}</Text>
                        <Text style={styles.statLabel}>{s.label}</Text>
                    </View>
                ))}
            </View>
        )}

        {/* Features — slides 2-3 */}
        {item.features && (
            <View style={styles.featuresGrid}>
                {item.features.map((f, i) => (
                    <View key={i} style={styles.featureItem}>
                        <MaterialCommunityIcons name={f.icon} size={16} color={C.cyan} />
                        <Text style={styles.featureLabel}>{f.label}</Text>
                    </View>
                ))}
            </View>
        )}
    </View>
);

// ── Main ──────────────────────────────────────────────────────
const OnboardingScreen = () => {
    const navigation  = useNavigation();
    const flatListRef = useRef(null);
    const [activeIdx, setActiveIdx] = useState(0);

    const isLast = activeIdx === SLIDES.length - 1;

    const onScroll = (e) => {
        const idx = Math.round(e.nativeEvent.contentOffset.x / W);
        setActiveIdx(idx);
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar barStyle="light-content" backgroundColor={C.bg} />

            {/* Skip */}
            <TouchableOpacity
                onPress={() => navigation.replace('Login')}
                style={styles.skipBtn}
            >
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            {/* Slides */}
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                renderItem={({ item }) => <Slide item={item} />}
                style={styles.flatList}
            />

            {/* Bottom */}
            <View style={styles.bottom}>
                {/* Dots */}
                <View style={styles.dotsRow}>
                    {SLIDES.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                i === activeIdx ? styles.dotActive : styles.dotInactive,
                            ]}
                        />
                    ))}
                </View>

                {/* Primary CTA */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.ctaPrimaryWrapper}
                    onPress={() => navigation.replace(isLast ? 'Register' : 'Register')}
                >
                    <LinearGradient
                        colors={[C.cyan, C.purple]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.ctaPrimary}
                    >
                        <Text style={styles.ctaPrimaryText}>Sign Up</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Sign in link */}
                <TouchableOpacity
                    onPress={() => navigation.replace('Login')}
                    style={styles.signInRow}
                >
                    <Text style={styles.signInPrompt}>Already have an account? </Text>
                    <Text style={styles.signInLink}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea:         { flex: 1, backgroundColor: C.bg },
    flatList:         { flex: 1 },

    // Skip
    skipBtn:          { alignSelf: 'flex-end', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 4 },
    skipText:         { fontSize: 14, color: C.muted, fontWeight: '500' },

    // Slide
    slide:            { width: W, paddingHorizontal: 32, justifyContent: 'center', flex: 1 },

    // Icon
    iconWrap:         { width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(34,211,238,0.08)', borderWidth: 1, borderColor: 'rgba(34,211,238,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 32 },

    // Accent bar
    accentBar:        { width: 40, height: 3, borderRadius: 2, marginBottom: 24 },

    // Text
    title:            { fontSize: 34, fontWeight: '800', color: C.text, letterSpacing: -1.5, lineHeight: 42, marginBottom: 16 },
    body:             { fontSize: 15, lineHeight: 26, color: C.sub, fontWeight: '300', marginBottom: 32 },

    // Stats
    statsRow:         { flexDirection: 'row', gap: 12 },
    statCard:         { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, alignItems: 'center' },
    statValue:        { fontSize: 22, fontWeight: '800', color: C.text, letterSpacing: -1 },
    statLabel:        { fontSize: 11, color: C.muted, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 4 },

    // Features
    featuresGrid:     { gap: 10 },
    featureItem:      { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
    featureLabel:     { fontSize: 14, color: C.sub, fontWeight: '500' },

    // Bottom
    bottom:           { paddingHorizontal: 32, paddingBottom: 16 },
    dotsRow:          { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 24 },
    dot:              { height: 6, borderRadius: 3 },
    dotActive:        { width: 28, backgroundColor: C.dotActive },
    dotInactive:      { width: 6, backgroundColor: C.dotInactive },

    // CTA
    ctaPrimaryWrapper:{ borderRadius: 14, overflow: 'hidden', marginBottom: 16 },
    ctaPrimary:       { height: 56, alignItems: 'center', justifyContent: 'center' },
    ctaPrimaryText:   { fontSize: 16, fontWeight: '700', color: '#07080f', letterSpacing: 0.3 },

    // Sign in
    signInRow:        { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 8 },
    signInPrompt:     { fontSize: 13, color: C.muted },
    signInLink:       { fontSize: 13, color: C.cyan, fontWeight: '700' },
});

export default OnboardingScreen;