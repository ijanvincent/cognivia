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
// WaveBackground — unchanged
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
// Shell geometry constants — single source of truth for label positioning.
// Adjust TRANSLATE_Y_FLOATED to fine-tune the floated label vertical position:
//   more negative (e.g. -35) → label moves UP
//   less negative (e.g. -33) → label moves DOWN
// ─────────────────────────────────────────────────────────────────────────────
const SHELL_HEIGHT         = 60;
const SHELL_PADDING_T      = 18;
const SHELL_PADDING_B      = 6;
const SHELL_BORDER_W       = 1;
const LABEL_SIZE_REST      = 15;
const LABEL_SIZE_FLOAT     = 11;

/*
 * CHANGE 1 — TRANSLATE_Y_FLOATED constant introduced.
 *
 * What:  Replaces the magic number -28 that was inline in the interpolate
 *        outputRange. Value set to -34 (same as LoginScreen).
 *
 * Why:   -28 was insufficient to lift the label out of the shell and onto
 *        the top border line. The floatContainer sits 19px below the shell
 *        top (1px border + 18px paddingTop). top:'50%' resolves to 18px
 *        (half of 36px container), so the label anchor is 29.5px from the
 *        shell top. -28 left the label 1.5px inside the shell. -34 centers
 *        the label's midpoint on the top border, matching the web target.
 */
const TRANSLATE_Y_FLOATED  = -34;

// ─────────────────────────────────────────────────────────────────────────────
// useFloatAnim — unchanged
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
// FloatingLabel
// ─────────────────────────────────────────────────────────────────────────────
const FloatingLabel = ({ label, floatAnim, isFocused }) => {
    /*
     * CHANGE 2 — translateY outputRange: [0, -28] → [0, TRANSLATE_Y_FLOATED]
     *
     * What:  Animation end value changed from -28 to -34.
     * Why:   See CHANGE 1 above. -34 is the tuned value that lands the label
     *        centered on the top border line. Adjust TRANSLATE_Y_FLOATED at
     *        the top of the file to fine-tune without touching this code.
     */
    const labelTranslateY = floatAnim.interpolate({
        inputRange:  [0, 1],
        outputRange: [0, TRANSLATE_Y_FLOATED],
    });

    const labelFontSize = floatAnim.interpolate({
        inputRange:  [0, 1],
        outputRange: [LABEL_SIZE_REST, LABEL_SIZE_FLOAT],
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
// FloatingLabelInput
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
        /*
         * CHANGE 3 — inputWrap: alignItems 'flex-start' → 'center'
         *
         * What:  alignItems on the shell row changed from 'flex-start' to 'center'.
         * Why:   'flex-start' anchored the icon to the top of the content area
         *        (after paddingTop: 18), pushing it visually downward. 'center'
         *        vertically centers the icon within the 60px shell, matching
         *        the web version. The floatContainer's absolutely-positioned
         *        label children are unaffected by this change.
         */
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
// ForgotPasswordScreen — unchanged
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

    // ── Input shell ───────────────────────────────────────────────────────────
    /*
     * CHANGE 3 — alignItems: 'flex-start' → 'center'
     * CHANGE 4 — iconWrap: removed alignSelf:'stretch' + justifyContent:'center'
     *
     * What:  Shell row now centers its children vertically. iconWrap no longer
     *        needs to stretch and self-center since the parent handles it.
     *
     * Why:   Same reasoning as LoginScreen — 'flex-start' pushed the icon down
     *        to after paddingTop:18, leaving it visually low in the shell.
     *        'center' places it at the shell's true vertical midpoint.
     *        The absolutely-positioned floating label is unaffected.
     */
    inputWrap: {
        flexDirection:     'row',
        alignItems:        'center',          // ← was 'flex-start'
        borderWidth:       SHELL_BORDER_W,
        borderColor:       'rgba(255,255,255,0.15)',
        borderRadius:      12,
        paddingHorizontal: 16,
        paddingTop:        SHELL_PADDING_T,
        paddingBottom:     SHELL_PADDING_B,
        height:            SHELL_HEIGHT,
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
        // CHANGE 4 — removed alignSelf:'stretch' and justifyContent:'center'
        // Parent alignItems:'center' handles vertical centering now.
        marginRight: 12,
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
        marginTop:     -Math.round(LABEL_SIZE_REST / 2),  // = -8, unchanged
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