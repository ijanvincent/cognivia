import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, ActivityIndicator,
    StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
    TextInput, Dimensions, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../components/AuthInput';
import api from '../services/api';

const { height: H } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
// WaveBackground
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
// useFloatAnim  (ported from RegisterScreen)
// ─────────────────────────────────────────────────────────────────────────────
const useFloatAnim = ({ value, onFocusCallback, onBlurCallback }) => {
    const [isFocused, setIsFocused] = useState(false);
    const floatAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        if (!isFocused) {
            Animated.timing(floatAnim, {
                toValue:         value ? 1 : 0,
                duration:        0,
                useNativeDriver: false,
            }).start();
        }
    }, [value]);

    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(floatAnim, {
            toValue:         1,
            duration:        180,
            useNativeDriver: false,
        }).start();
        onFocusCallback?.();
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (!value) {
            Animated.timing(floatAnim, {
                toValue:         0,
                duration:        180,
                useNativeDriver: false,
            }).start();
        }
        onBlurCallback?.();
    };

    return { isFocused, floatAnim, handleFocus, handleBlur };
};

// ─────────────────────────────────────────────────────────────────────────────
// FloatingLabel  (ported from RegisterScreen)
// ─────────────────────────────────────────────────────────────────────────────
const FloatingLabel = ({ label, floatAnim, isFocused }) => {
    const labelTranslateY = floatAnim.interpolate({
        inputRange:  [0, 1],
        outputRange: [0, -28],
    });
    const labelFontSize = floatAnim.interpolate({
        inputRange:  [0, 1],
        outputRange: [15, 11],
    });
    const labelColor = floatAnim.interpolate({
        inputRange:  [0, 1],
        outputRange: [
            'rgba(255,255,255,0.35)',
            isFocused ? COLORS.cyan : 'rgba(255,255,255,0.55)',
        ],
    });
    const labelBgOpacity = floatAnim.interpolate({
        inputRange:  [0, 0.8, 1],
        outputRange: [0, 0, 1],
    });

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                styles.floatingLabelWrapper,
                { transform: [{ translateY: labelTranslateY }] },
            ]}
        >
            <Animated.View
                style={[styles.labelBgPatch, { opacity: labelBgOpacity }]}
            />
            <Animated.Text
                style={[
                    styles.floatingLabel,
                    { fontSize: labelFontSize, color: labelColor },
                ]}
                numberOfLines={1}
            >
                {label}
            </Animated.Text>
        </Animated.View>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// FloatingLabelInput  (ported from RegisterScreen)
// ─────────────────────────────────────────────────────────────────────────────
const FloatingLabelInput = ({
    label,
    value,
    onChangeText,
    keyboardType,
    icon,
    editable,
}) => {
    const { isFocused, floatAnim, handleFocus, handleBlur } = useFloatAnim({ value });

    return (
        <View style={[styles.inputWrap, isFocused && styles.inputWrapFocused]}>
            <View style={styles.iconWrap}>
                <MaterialCommunityIcons
                    name={icon}
                    size={20}
                    color={isFocused ? COLORS.cyan : 'rgba(255,255,255,0.3)'}
                />
            </View>
            <View style={styles.floatContainer}>
                <FloatingLabel label={label} floatAnim={floatAnim} isFocused={isFocused} />
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder=""
                    keyboardType={keyboardType || 'default'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    editable={editable !== false}
                />
            </View>
        </View>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// ForgotPasswordScreen
// ─────────────────────────────────────────────────────────────────────────────
const ForgotPasswordScreen = () => {
    const navigation              = useNavigation();
    const [email, setEmail]       = useState('');
    const [error, setError]       = useState('');
    const [success, setSuccess]   = useState(false);
    const [isLoading, setLoading] = useState(false);

    const validate = () => {
        if (!email.trim()) return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email.';
        return null;
    };

    const handleSubmit = async () => {
        const validationError = validate();
        if (validationError) { setError(validationError); return; }
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/forgot-password', { email: email.trim() });
        } catch {
            // always show success to avoid email enumeration
        } finally {
            setLoading(false);
            setSuccess(true);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar style="light" backgroundColor={COLORS.bg} translucent={false} />
            <WaveBackground />
            <View style={styles.overlay} />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backBtn}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={22} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>

                    <View style={styles.brandSection}>
                        <Text style={styles.brandSub}>
                            Provide email and we'll send you a reset link.
                        </Text>
                    </View>

                    <View style={styles.formSection}>

                        {success ? (
                            <View style={styles.successAlert}>
                                <MaterialCommunityIcons
                                    name="check-circle-outline"
                                    size={20}
                                    color={COLORS.successBorder}
                                />
                                <Text style={styles.successText}>
                                    If that email is registered, a reset link has been sent. Check your inbox.
                                </Text>
                            </View>
                        ) : (
                            <>
                                {!!error && (
                                    <View style={styles.errorAlert}>
                                        <View style={styles.errorAlertIconWrap}>
                                            <MaterialCommunityIcons
                                                name="alert-circle-outline"
                                                size={18}
                                                color={COLORS.error}
                                            />
                                        </View>
                                        <Text style={styles.errorAlertText}>{error}</Text>
                                    </View>
                                )}

                                <FloatingLabelInput
                                    label="Email"
                                    value={email}
                                    onChangeText={(v) => { setEmail(v); setError(''); }}
                                    keyboardType="email-address"
                                    icon="email-outline"
                                    editable={!isLoading}
                                />

                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    disabled={isLoading}
                                    activeOpacity={0.88}
                                    style={[styles.btnSubmit, isLoading && styles.btnDisabled]}
                                >
                                    {isLoading
                                        ? <ActivityIndicator color="#07080f" />
                                        : <Text style={styles.btnSubmitText}>Send Reset Link</Text>
                                    }
                                </TouchableOpacity>
                            </>
                        )}

                        <View style={styles.loginRow}>
                            <Text style={styles.loginPrompt}>Remember your password? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Sign in</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safeArea:      { flex: 1, backgroundColor: COLORS.bg },
    flex:          { flex: 1 },
    overlay:       { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(7,8,15,0.55)' },
    scrollContent: {
        flexGrow:          1,
        paddingHorizontal: 28,
        paddingTop:        16,
        paddingBottom:     40,
        justifyContent:    'center',
        minHeight:         H,
    },

    backBtn:      { position: 'absolute', top: 16, left: 28, zIndex: 10, padding: 4 },

    brandSection: { alignItems: 'flex-start', marginBottom: 32 },
    brandSub:     { fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: '300' },

    formSection:  { width: '100%' },

    // ── Input shell (matches RegisterScreen) ─────────────────────────────────
    inputWrap: {
        flexDirection:     'row',
        alignItems:        'flex-start',
        borderWidth:       1,
        borderColor:       'rgba(255,255,255,0.15)',
        borderRadius:      12,
        paddingHorizontal: 16,
        paddingTop:        18,
        paddingBottom:     6,
        height:            60,
        marginBottom:      20,
        backgroundColor:   'rgba(255,255,255,0.04)',
        overflow:          'visible',
    },
    inputWrapFocused: {
        borderColor:     COLORS.cyan,
        backgroundColor: 'rgba(34,211,238,0.04)',
    },

    // ── Icon wrapper ──────────────────────────────────────────────────────────
    iconWrap: {
        alignSelf:      'stretch',
        justifyContent: 'center',
        marginRight:    12,
    },

    // ── Floating label ────────────────────────────────────────────────────────
    floatContainer: {
        flex:           1,
        position:       'relative',
        justifyContent: 'center',
    },
    floatingLabelWrapper: {
        position:      'absolute',
        top:           '50%',
        marginTop:     -8,
        left:          0,
        flexDirection: 'row',
        alignItems:    'center',
        zIndex:        10,
    },
    labelBgPatch: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor:  COLORS.bg,
        marginHorizontal: -3,
        borderRadius:     2,
    },
    floatingLabel: {
        fontWeight:    '400',
        letterSpacing: 0.1,
    },

    // ── TextInput ─────────────────────────────────────────────────────────────
    input: {
        flex:            1,
        fontSize:        15,
        color:           '#ffffff',
        paddingVertical: 0,
        paddingTop:      2,
    },

    // ── Alerts ────────────────────────────────────────────────────────────────
    /*
      CHANGE 1 — successAlert:
        borderLeftWidth: 3, borderLeftColor removed.
        Replaced with borderWidth: 1, borderColor: rgba(52,211,153,0.35).
        Why: directional border on borderRadius container produces a visible
        gap artifact on Android between the curved corner and the straight
        border edge — the same double-line issue fixed in LoginScreen.

      CHANGE 2 — errorAlert:
        borderLeftWidth: 3, borderLeftColor removed.
        Replaced with borderWidth: 1, borderColor: rgba(248,113,113,0.35).
        alignItems changed from 'center' to 'flex-start' so the icon anchors
        to the first line of text when the message wraps.
        errorAlertIconWrap added for consistent vertical icon offset.
        errorAlertText lineHeight: 20 added for breathing room on wrap.
    */
    successAlert: {
        flexDirection:   'row',
        alignItems:      'flex-start',
        gap:             12,
        backgroundColor: COLORS.successBg,
        borderWidth:     1,
        borderColor:     'rgba(52, 211, 153, 0.35)',
        borderRadius:    12,
        padding:         16,
        marginBottom:    24,
    },
    successText: {
        flex:       1,
        fontSize:   14,
        color:      COLORS.successBorder,
        fontWeight: '500',
        lineHeight: 22,
    },

    errorAlert: {
        flexDirection:   'row',
        alignItems:      'flex-start',
        gap:             12,
        backgroundColor: COLORS.errorBg,
        borderWidth:     1,
        borderColor:     'rgba(248, 113, 113, 0.35)',
        borderRadius:    12,
        padding:         14,
        marginBottom:    16,
    },
    errorAlertIconWrap: {
        marginTop:  1,
        flexShrink: 0,
    },
    errorAlertText: {
        flex:       1,
        fontSize:   13.5,
        lineHeight: 20,
        color:      COLORS.error,
        fontWeight: '500',
    },

    // ── Submit ────────────────────────────────────────────────────────────────
    btnSubmit:     { height: 56, backgroundColor: '#ffffff', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    btnDisabled:   { opacity: 0.6 },
    btnSubmitText: { fontFamily: 'Syne_700Bold', fontSize: 15, fontWeight: '700', color: '#07080f', letterSpacing: 0.3 },

    // ── Footer ────────────────────────────────────────────────────────────────
    loginRow:    { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    loginPrompt: { fontSize: 14, color: 'rgba(255,255,255,0.4)' },
    loginLink:   { fontFamily: 'Syne_700Bold', fontSize: 14, color: '#ffffff', fontWeight: '700' },
});

export default ForgotPasswordScreen;