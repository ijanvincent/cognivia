import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../components/AuthInput';

const { height: H } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
// WaveBackground — identical to LoginScreen / RegisterScreen
// ─────────────────────────────────────────────────────────────────────────────
const WaveBackground = () => (
    <Svg
        style={StyleSheet.absoluteFill}
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
    >
        {[...Array(8)].map((_, i) => (
            <Path
                key={`pink-${i}`}
                d={`M ${-20 + i * 6} ${200 + i * 8} C ${80 + i * 5} ${80 + i * 6}, ${220 + i * 3} ${340 + i * 4}, ${300 + i * 5} ${160 + i * 5} S ${380 + i * 3} ${400 + i * 3}, ${460 + i * 4} ${240 + i * 4}`}
                fill="none"
                stroke={`rgba(200, 80, 200, ${0.3 - i * 0.025})`}
                strokeWidth="1.2"
            />
        ))}
        {[...Array(8)].map((_, i) => (
            <Path
                key={`cyan-${i}`}
                d={`M ${200 + i * 5} ${700} C ${280 + i * 4} ${520 + i * 5}, ${340 + i * 3} ${640 + i * 3}, ${420 + i * 4} ${440 + i * 5} S ${500 + i * 3} ${600 + i * 3}, ${560 + i * 4} ${480 + i * 4}`}
                fill="none"
                stroke={`rgba(30, 180, 255, ${0.3 - i * 0.025})`}
                strokeWidth="1.2"
            />
        ))}
        {[...Array(5)].map((_, i) => (
            <Path
                key={`purple-${i}`}
                d={`M ${80 + i * 10} ${400 + i * 4} C ${160 + i * 6} ${240 + i * 5}, ${280 + i * 4} ${560 + i * 3}, ${400 + i * 5} ${320 + i * 4}`}
                fill="none"
                stroke={`rgba(130, 80, 255, ${0.18 - i * 0.02})`}
                strokeWidth="1"
            />
        ))}
    </Svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// RegisterSuccessScreen
//
// Visual layout:
//
//   ┌────────────────────────────────────────────────┐
//   │         [icon badge — green check]             │
//   │   "Account ready — start learning now."        │
//   │         [account pill]                         │
//   │         [hint text]                            │
//   │  ─────────────── divider ───────────────────── │
//   │     Already have an account?  [Sign in]        │
//   └────────────────────────────────────────────────┘
//   [      Continue to Sign In button      ]
//
// ─────────────────────────────────────────────────────────────────────────────
const RegisterSuccessScreen = () => {
    const navigation = useNavigation();

    /*
     * Animation architecture:
     *   - cardAnim  : drives the entrance wrapper (opacity + translateX).
     *                 Applied to an Animated.View that wraps scroll content,
     *                 NOT the ScrollView itself — avoids Android transform
     *                 jank when useNativeDriver is true on a scroll container.
     *   - iconAnim  : spring scale for the badge — delayed 160ms so the
     *                 card settles before the icon pops in.
     *   - contentAnim: staggered fade + translateY for body copy and button.
     */
    const cardAnim    = useRef(new Animated.Value(0)).current;
    const iconAnim    = useRef(new Animated.Value(0.5)).current;
    const contentAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(cardAnim, {
            toValue:         1,
            duration:        380,
            useNativeDriver: true,
        }).start();

        Animated.spring(iconAnim, {
            toValue:         1,
            tension:         65,
            friction:        8,
            delay:           160,
            useNativeDriver: true,
        }).start();

        Animated.timing(contentAnim, {
            toValue:         1,
            duration:        340,
            delay:           220,
            useNativeDriver: true,
        }).start();
    }, []);

    const cardTranslateX = cardAnim.interpolate({
        inputRange:  [0, 1],
        outputRange: [24, 0],       // mirrors web @keyframes fadeRight
    });

    const contentTranslateY = contentAnim.interpolate({
        inputRange:  [0, 1],
        outputRange: [10, 0],
    });

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar style="light" backgroundColor={COLORS.bg} translucent={false} />

            <WaveBackground />
            <View style={styles.overlay} />

            {/*
             * ScrollView is plain — no animation props on it.
             * The Animated.View inside carries the entrance transform so
             * useNativeDriver never touches the scroll container.
             */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={[
                        styles.entranceWrapper,
                        {
                            opacity:   cardAnim,
                            transform: [{ translateX: cardTranslateX }],
                        },
                    ]}
                >
                    {/* ════════════════════════════════════════════════════
                        SUCCESS BODY
                    ════════════════════════════════════════════════════ */}
                    <Animated.View
                        style={[
                            styles.successBody,
                            {
                                opacity:   contentAnim,
                                transform: [{ translateY: contentTranslateY }],
                            },
                        ]}
                    >
                        {/* ── Icon badge ─────────────────────────────── */}
                        <Animated.View
                            style={[
                                styles.iconBadge,
                                { transform: [{ scale: iconAnim }] },
                            ]}
                            accessible
                            accessibilityRole="image"
                            accessibilityLabel="Success checkmark"
                        >
                            <MaterialCommunityIcons
                                name="check"
                                size={26}
                                color="#34d399"
                            />
                        </Animated.View>

                        {/* ── Bold confirmation ──────────────────────── */}
                        <Text style={styles.successMessage}>
                            Account ready — start learning now.
                        </Text>

                        {/* ── Account pill ───────────────────────────── */}
                        <View style={styles.accountPill}>
                            <MaterialCommunityIcons
                                name="account-check-outline"
                                size={13}
                                color="rgba(255,255,255,0.45)"
                                style={styles.pillIcon}
                            />
                            <Text style={styles.accountPillText} numberOfLines={1}>
                                Your account has been created
                            </Text>
                        </View>

                        {/* ── Hint ───────────────────────────────────── */}
                        <Text style={styles.hintText}>
                            You can now sign in with your email and password to
                            access your dashboard and start studying.
                        </Text>

                        {/* ── Divider ────────────────────────────────── */}
                        <View style={styles.divider} />

                        {/* ── Inline sign-in row ─────────────────────── */}
                        <View style={styles.signInRow}>
                            <Text style={styles.signInPrompt}>
                                Already have an account?{' '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.replace('Login')}
                                activeOpacity={0.75}
                                accessible
                                accessibilityRole="link"
                                accessibilityLabel="Sign in to your existing account"
                            >
                                <Text style={styles.signInLink}>Sign in</Text>
                            </TouchableOpacity>
                        </View>

                    </Animated.View>

                    {/* ════════════════════════════════════════════════════
                        CTA BUTTON
                        Mirrors the white .submitButton used across all
                        mobile auth screens (Login, Register, ResetPassword)
                    ════════════════════════════════════════════════════ */}
                    <Animated.View
                        style={[
                            styles.btnWrapper,
                            {
                                opacity:   contentAnim,
                                transform: [{ translateY: contentTranslateY }],
                            },
                        ]}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.replace('Login')}
                            activeOpacity={0.88}
                            style={styles.btnSignIn}
                            accessible
                            accessibilityRole="button"
                            accessibilityLabel="Continue to sign in"
                        >
                            <Text style={styles.btnSignInText}>Continue to Sign In</Text>
                        </TouchableOpacity>
                    </Animated.View>

                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// Values translated 1:1 from login.module.css and its ≤768px mobile overrides.
// Dead rules (cardHeader, cardTitle, cardSubtitle, ctaRow, ctaPrompt, ctaLink)
// removed — no corresponding JSX elements exist.
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

    // ── Shell ─────────────────────────────────────────────────────────────────
    safeArea: {
        flex:            1,
        backgroundColor: COLORS.bg,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(7,8,15,0.55)',
    },
    scrollContent: {
        flexGrow:          1,
        paddingHorizontal: 28,
        paddingTop:        16,
        paddingBottom:     40,
        minHeight:         H,
        justifyContent:    'center',
    },

    // ── Entrance wrapper ──────────────────────────────────────────────────────
    // Isolates the entrance animation from the ScrollView container.
    // Prevents useNativeDriver transform conflicts on Android.
    entranceWrapper: {
        width: '100%',
    },

    // ── Success body ──────────────────────────────────────────────────────────
    successBody: {
        alignItems:    'center',
        paddingTop:    4,
        paddingBottom: 4,
        marginBottom:  24,
    },

    // ── Icon badge ────────────────────────────────────────────────────────────
    // Source: .successIconBadge — 72px, green-tinted circle
    iconBadge: {
        width:           72,
        height:          72,
        borderRadius:    36,
        backgroundColor: 'rgba(52,211,153,0.08)',
        borderWidth:     1,
        borderColor:     'rgba(52,211,153,0.22)',
        alignItems:      'center',
        justifyContent:  'center',
        marginBottom:    24,
    },

    // ── Bold confirmation ─────────────────────────────────────────────────────
    // Source: .successMessage — Syne 600, 15px, #f1f5f9
    successMessage: {
        fontFamily:    'Syne_700Bold',
        fontSize:      15,
        fontWeight:    '600',
        color:         '#f1f5f9',
        letterSpacing: -0.2,
        textAlign:     'center',
        marginBottom:  14,
    },

    // ── Account pill ──────────────────────────────────────────────────────────
    // Source: .successEmail — pill container
    accountPill: {
        flexDirection:     'row',
        alignItems:        'center',
        backgroundColor:   'rgba(255,255,255,0.04)',
        borderWidth:       1,
        borderColor:       'rgba(255,255,255,0.09)',
        borderRadius:      100,
        paddingVertical:   6,
        paddingHorizontal: 16,
        marginBottom:      20,
        maxWidth:          '100%',
    },
    // gap: 7 replaced with marginRight on icon — safe for RN < 0.71
    pillIcon: {
        marginRight: 7,
    },
    accountPillText: {
        fontSize:  13,
        color:     'rgba(241,245,249,0.55)',
        flexShrink: 1,
    },

    // ── Hint text ─────────────────────────────────────────────────────────────
    // Source: .successHint — 13px, muted, centered
    hintText: {
        fontSize:   13,
        color:      'rgba(241,245,249,0.35)',
        lineHeight: 21,
        textAlign:  'center',
        maxWidth:   280,
    },

    // ── Divider ───────────────────────────────────────────────────────────────
    // Source: .linksSection border-top
    divider: {
        width:           '100%',
        height:          1,
        backgroundColor: 'rgba(255,255,255,0.06)',
        marginTop:       22,
        marginBottom:    20,
    },

    // ── Inline sign-in row ────────────────────────────────────────────────────
    // Source: .registerPrompt + mobile .registerLink
    signInRow: {
        flexDirection:  'row',
        alignItems:     'center',
        justifyContent: 'center',
    },
    signInPrompt: {
        fontSize:   13,
        color:      'rgba(241,245,249,0.35)',
        fontWeight: '400',
    },
    signInLink: {
        fontFamily:  'Syne_700Bold',
        fontSize:    13,
        fontWeight:  '700',
        color:       COLORS.cyan,
    },

    // ── CTA button ────────────────────────────────────────────────────────────
    // Source: mobile .submitButton — white, 56px, Syne 700
    btnWrapper: {
        width: '100%',
    },
    btnSignIn: {
        height:          56,
        backgroundColor: '#ffffff',
        borderRadius:    12,
        alignItems:      'center',
        justifyContent:  'center',
    },
    btnSignInText: {
        fontFamily:    'Syne_700Bold',
        fontSize:      15,
        fontWeight:    '700',
        color:         '#07080f',
        letterSpacing: 0.3,
    },
});

export default RegisterSuccessScreen;