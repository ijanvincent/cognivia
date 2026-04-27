import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { COLORS } from '../components/AuthInput';

const { height: H, width: W } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
// WaveBackground — same wave system used in LoginScreen / RegisterScreen
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
// SuccessIcon — animated checkmark ring using Cognivia's cyan accent
// ─────────────────────────────────────────────────────────────────────────────
const SuccessIcon = ({ scaleAnim, opacityAnim }) => (
    <Animated.View
        style={[
            styles.iconContainer,
            {
                transform: [{ scale: scaleAnim }],
                opacity:   opacityAnim,
            },
        ]}
    >
        {/* Outer glow ring */}
        <Svg width={120} height={120} style={StyleSheet.absoluteFill}>
            <Defs>
                <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
                    <Stop offset="0%"   stopColor={COLORS.cyan} stopOpacity="0.25" />
                    <Stop offset="100%" stopColor={COLORS.cyan} stopOpacity="0"    />
                </RadialGradient>
            </Defs>
            <Circle cx={60} cy={60} r={58} fill="url(#glow)" />
        </Svg>

        {/* Icon shell — mirrors the dark aesthetic of the app */}
        <View style={styles.iconShell}>
            <MaterialCommunityIcons
                name="check-circle-outline"
                size={52}
                color={COLORS.cyan}
            />
        </View>
    </Animated.View>
);

// ─────────────────────────────────────────────────────────────────────────────
// RegisterSuccessScreen
// ─────────────────────────────────────────────────────────────────────────────
const RegisterSuccessScreen = () => {
    const navigation = useNavigation();

    // Animation refs — scale + fade in on mount
    const scaleAnim   = useRef(new Animated.Value(0.6)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const contentAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Icon entrance
        Animated.spring(scaleAnim, {
            toValue:         1,
            tension:         60,
            friction:        7,
            useNativeDriver: true,
        }).start();

        Animated.timing(opacityAnim, {
            toValue:         1,
            duration:        400,
            useNativeDriver: true,
        }).start();

        // Content stagger — slightly delayed so icon lands first
        Animated.timing(contentAnim, {
            toValue:         1,
            duration:        420,
            delay:           180,
            useNativeDriver: true,
        }).start();
    }, []);

    const contentTranslateY = contentAnim.interpolate({
        inputRange:  [0, 1],
        outputRange: [18, 0],
    });

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar style="light" backgroundColor={COLORS.bg} translucent={false} />

            <WaveBackground />
            <View style={styles.overlay} />

            <View style={styles.container}>

                {/* ── Success icon ────────────────────────────────────────── */}
                <SuccessIcon scaleAnim={scaleAnim} opacityAnim={opacityAnim} />

                {/* ── Copy ────────────────────────────────────────────────── */}
                <Animated.View
                    style={[
                        styles.copyBlock,
                        {
                            opacity:   contentAnim,
                            transform: [{ translateY: contentTranslateY }],
                        },
                    ]}
                >
                    <Text style={styles.heading}>Account Created!</Text>
                    <Text style={styles.subheading}>
                        Welcome to Cognivia. You're all set{'\n'}to start learning smarter.
                    </Text>
                </Animated.View>

                {/* ── Divider detail ──────────────────────────────────────── */}
                <Animated.View
                    style={[styles.divider, { opacity: contentAnim }]}
                >
                    <View style={styles.dividerLine} />
                    <MaterialCommunityIcons
                        name="star-four-points-outline"
                        size={14}
                        color="rgba(255,255,255,0.2)"
                        style={styles.dividerIcon}
                    />
                    <View style={styles.dividerLine} />
                </Animated.View>

                {/* ── CTA button ──────────────────────────────────────────── */}
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
                    >
                        <Text style={styles.btnSignInText}>Continue to Sign In</Text>
                        <MaterialCommunityIcons
                            name="arrow-right"
                            size={18}
                            color="#07080f"
                            style={styles.btnArrow}
                        />
                    </TouchableOpacity>
                </Animated.View>

            </View>
        </SafeAreaView>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safeArea: {
        flex:            1,
        backgroundColor: COLORS.bg,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(7,8,15,0.55)',
    },
    container: {
        flex:            1,
        alignItems:      'center',
        justifyContent:  'center',
        paddingHorizontal: 36,
    },

    // ── Icon ─────────────────────────────────────────────────────────────────
    iconContainer: {
        width:           120,
        height:          120,
        alignItems:      'center',
        justifyContent:  'center',
        marginBottom:    32,
    },
    iconShell: {
        width:           88,
        height:          88,
        borderRadius:    44,
        backgroundColor: 'rgba(34,211,238,0.08)',
        borderWidth:     1,
        borderColor:     'rgba(34,211,238,0.25)',
        alignItems:      'center',
        justifyContent:  'center',
    },

    // ── Copy ─────────────────────────────────────────────────────────────────
    copyBlock: {
        alignItems:   'center',
        marginBottom: 28,
    },
    heading: {
        fontFamily:    'Syne_700Bold',
        fontSize:      28,
        fontWeight:    '700',
        color:         '#ffffff',
        letterSpacing: 0.2,
        marginBottom:  12,
        textAlign:     'center',
    },
    subheading: {
        fontSize:   15,
        color:      'rgba(255,255,255,0.45)',
        fontWeight: '300',
        textAlign:  'center',
        lineHeight: 22,
    },

    // ── Divider ──────────────────────────────────────────────────────────────
    divider: {
        flexDirection:  'row',
        alignItems:     'center',
        width:          '70%',
        marginBottom:   32,
    },
    dividerLine: {
        flex:            1,
        height:          1,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    dividerIcon: {
        marginHorizontal: 10,
    },

    // ── Button ───────────────────────────────────────────────────────────────
    btnWrapper: {
        width: '100%',
    },
    btnSignIn: {
        height:          56,
        backgroundColor: '#ffffff',
        borderRadius:    12,
        flexDirection:   'row',
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
    btnArrow: {
        marginLeft: 8,
    },
});

export default RegisterSuccessScreen;