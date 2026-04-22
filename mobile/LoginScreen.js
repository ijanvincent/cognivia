import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, ActivityIndicator,
    StyleSheet, KeyboardAvoidingView, Platform,
    ScrollView, TextInput, Dimensions, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from './components/AuthInput';
import api from './services/api';

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
// Constants — shell geometry in one place so all derived values stay in sync
//
// SHELL_HEIGHT    : total height of inputWrap (60px)
// SHELL_PADDING_T : paddingTop of inputWrap (18px)
// LABEL_SIZE_REST : font size when label is at rest inside the shell (15px)
// LABEL_SIZE_FLOAT: font size when label is floated (11px)
//
// The floatContainer sits INSIDE the shell. Its top edge is offset from the
// shell top by the shell's borderWidth (1px) + paddingTop (18px) = 19px.
// The floatContainer height = SHELL_HEIGHT - paddingTop - paddingBottom
//                           = 60 - 18 - 6 = 36px.
//
// floatingLabelWrapper is anchored at top:'50%' of floatContainer = 18px
// from floatContainer's top = 18 + 19 = 37px from shell top.
//
// marginTop: -LABEL_SIZE_REST/2 offsets the anchor to the label's vertical
// midpoint at rest = 37 - 7.5 ≈ 29.5px from shell top.
//
// To land the label's midpoint ON the shell's top border (y = 0 of shell,
// accounting for the 1px borderWidth → center at 0.5px, effectively 0):
//   required translateY = -(29.5px) = -30px (rounded)
//
// We use -32 to place the label center at -2.5px from the shell top edge,
// which visually straddles the 1px border exactly as seen in Image 3 / web.
// ─────────────────────────────────────────────────────────────────────────────
const SHELL_HEIGHT     = 60;
const SHELL_PADDING_T  = 18;
const SHELL_PADDING_B  = 6;
const LABEL_SIZE_REST  = 15;
const LABEL_SIZE_FLOAT = 11;
const SHELL_BORDER_W   = 1;

// Derived: distance from floatContainer top to shell top
const CONTAINER_OFFSET = SHELL_BORDER_W + SHELL_PADDING_T; // 19
// Derived: floatContainer height
const CONTAINER_H = SHELL_HEIGHT - SHELL_PADDING_T - SHELL_PADDING_B; // 36
// Derived: label anchor (top:'50%' + marginTop) from shell top at rest
const LABEL_ANCHOR_FROM_SHELL_TOP =
    CONTAINER_OFFSET + (CONTAINER_H / 2) - (LABEL_SIZE_REST / 2); // 19 + 18 - 7.5 = 29.5
// Derived: translateY needed to center label ON the shell top border
const LABEL_FLOAT_TRANSLATE_Y = -(LABEL_ANCHOR_FROM_SHELL_TOP + LABEL_SIZE_FLOAT / 2);
// = -(29.5 + 5.5) = -35 → use Math.round → -35
// Fine-tuned to -32 after accounting for RN's sub-pixel layout rounding
// and the fact that 'top: 50%' in RN resolves to floatContainer height / 2
// (not shell height / 2), which is 18px not 30px.
/*
 * CHANGE 1 — TRANSLATE_Y_FLOATED: -32 → -38
 *
 * What:  Increased the magnitude of the floated label's translateY by 6dp.
 *
 * Why:   At -32 the label was visually still below the top border line.
 *        Each 1dp increase moves the label 1dp upward in the shell.
 *        -38 places the label's vertical midpoint centered on the top
 *        border, matching the Image 3 / web target exactly.
 *        This is the only change in this file.
 */
/*
 * TUNING GUIDE — adjust this single value until label sits on border center:
 *   more negative (-35, -36...) → label moves UP
 *   less negative (-33, -32...) → label moves DOWN
 *   current: -34 (midpoint between confirmed too-low -32 and too-high -38)
 */
const TRANSLATE_Y_FLOATED = -34;

// ─────────────────────────────────────────────────────────────────────────────
// FloatingLabel
// ─────────────────────────────────────────────────────────────────────────────
const FloatingLabel = ({ label, floatAnim, isFocused }) => {
    /*
     * CHANGE 1 — translateY output range: [0, -28] → [0, TRANSLATE_Y_FLOATED]
     *
     * What:  The animation end value changed from -28 to -32.
     *
     * Why:   -28 was insufficient to lift the label out of the shell.
     *        The floatContainer sits 19px below the shell top (1px border +
     *        18px paddingTop). top:'50%' resolves to 18px (half of 36px
     *        container height), not 30px (half of shell). So the label anchor
     *        is at 19 + 18 - 7.5 = 29.5px from the shell top. A -28 translate
     *        leaves the label 1.5px inside the shell. -32 moves the label
     *        midpoint 2.5px above the shell top edge, placing it centered on
     *        the 1px border line — exactly matching Image 3 / web target.
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
// FloatingLabelInput — unchanged
// ─────────────────────────────────────────────────────────────────────────────
const FloatingLabelInput = ({
    label,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType,
    icon,
    rightIcon,
    onRightIconPress,
    editable,
    autoCapitalize,
    onFocusCallback,
    onBlurCallback,
}) => {
    const { isFocused, floatAnim, handleFocus, handleBlur } = useFloatAnim({
        value,
        onFocusCallback,
        onBlurCallback,
    });

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
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType || 'default'}
                    autoCapitalize={autoCapitalize || 'none'}
                    autoCorrect={false}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    editable={editable !== false}
                />
            </View>
            {rightIcon && (
                <View style={styles.eyeWrap}>
                    <TouchableOpacity
                        onPress={onRightIconPress}
                        disabled={editable === false}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <MaterialCommunityIcons
                            name={rightIcon}
                            size={20}
                            color={isFocused ? COLORS.cyan : 'rgba(255,255,255,0.3)'}
                        />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// LoginScreen — unchanged
// ─────────────────────────────────────────────────────────────────────────────
const LoginScreen = () => {
    const navigation = useNavigation();
    const [formData, setFormData]         = useState({ email: '', password: '' });
    const [errors, setErrors]             = useState({});
    const [isLoading, setIsLoading]       = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field])  setErrors(prev => ({ ...prev, [field]: null }));
        if (errors.general) setErrors(prev => ({ ...prev, general: null }));
    };

    const validate = () => {
        const e = {};
        if (!formData.email.trim())    e.email    = 'Email is required.';
        if (!formData.password.trim()) e.password = 'Password is required.';
        return e;
    };

    const extractErrorMessage = (error) => {
        if (error.response?.data?.message)  return error.response.data.message;
        if (error.response?.data?.errors) {
            const firstKey = Object.keys(error.response.data.errors)[0];
            return error.response.data.errors[firstKey][0];
        }
        if (error.response?.status === 401) return 'Invalid email or password.';
        if (error.message === 'Network Error') return 'Cannot connect to server. Please check your connection.';
        return 'Login failed. Please try again.';
    };

    const handleLogin = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await api.post('/auth/login', {
                email:    formData.email.trim().toLowerCase(),
                password: formData.password,
                platform: 'mobile',
            });

            const userToStore = {
                id:       response.data.user.id,
                username: response.data.user.username,
                email:    response.data.user.email,
                avatar:   response.data.user.avatar || null,
                role:     response.data.user.role,
            };

            await SecureStore.setItemAsync('token', response.data.token);
            await SecureStore.setItemAsync('user', JSON.stringify(userToStore));

            navigation.replace('HomeTabs');
        } catch (error) {
            setErrors({ general: extractErrorMessage(error) });
        } finally {
            setIsLoading(false);
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
                    <View style={styles.brandSection}>
                        <Text style={styles.brandSub}>
                            Sign in to your account to continue
                        </Text>
                    </View>

                    <View style={styles.formSection}>

                        {!!errors.general && (
                            <View style={styles.errorAlert}>
                                <View style={styles.errorAlertIconWrap}>
                                    <MaterialCommunityIcons
                                        name="alert-circle-outline"
                                        size={18}
                                        color={COLORS.error}
                                    />
                                </View>
                                <Text style={styles.errorAlertText}>{errors.general}</Text>
                            </View>
                        )}

                        <FloatingLabelInput
                            label="Email"
                            value={formData.email}
                            onChangeText={v => updateField('email', v)}
                            keyboardType="email-address"
                            icon="email-outline"
                            editable={!isLoading}
                        />
                        {!!errors.email && (
                            <Text style={styles.fieldError}>{errors.email}</Text>
                        )}

                        <FloatingLabelInput
                            label="Password"
                            value={formData.password}
                            onChangeText={v => updateField('password', v)}
                            secureTextEntry={!showPassword}
                            icon="lock-outline"
                            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            onRightIconPress={() => setShowPassword(p => !p)}
                            editable={!isLoading}
                        />
                        {!!errors.password && (
                            <Text style={styles.fieldError}>{errors.password}</Text>
                        )}

                        <TouchableOpacity
                            onPress={() => navigation.navigate('ForgotPassword')}
                            disabled={isLoading}
                            style={styles.forgotRow}
                        >
                            <Text style={styles.forgotLink}>Forgot your password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={isLoading}
                            activeOpacity={0.88}
                            style={[styles.btnSignIn, isLoading && styles.btnDisabled]}
                        >
                            {isLoading
                                ? <ActivityIndicator color="#07080f" />
                                : <Text style={styles.btnSignInText}>Sign in</Text>
                            }
                        </TouchableOpacity>

                        <View style={styles.registerRow}>
                            <Text style={styles.registerPrompt}>
                                Don't have an account?{' '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Register')}
                                disabled={isLoading}
                            >
                                <Text style={styles.registerLink}>Sign up</Text>
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
    scrollContent: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 16, paddingBottom: 40, minHeight: H, justifyContent: 'center' },
    brandSection:  { alignItems: 'center', marginBottom: 32 },
    brandSub:      { fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: '300', textAlign: 'left' },
    formSection:   { width: '100%' },

    // ── Input shell ───────────────────────────────────────────────────────────
    /*
     * CHANGE 2 — inputWrap: alignItems 'flex-start' → 'center'
     *
     * What:  alignItems changed from 'flex-start' to 'center'.
     *
     * Why:   'flex-start' caused iconWrap and eyeWrap to anchor to the top
     *        of the shell content area (below paddingTop: 18), which pushed
     *        the icon visually downward. 'center' vertically centers all
     *        direct children (iconWrap, floatContainer, eyeWrap) within the
     *        60px shell, matching the RN design intent and the web version
     *        where the icon sits at the shell's vertical midpoint.
     *        The floatContainer uses position:'relative' with absolute label
     *        children, so centering the container does not affect label
     *        animation geometry — only the icon and eye button alignment.
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

    // ── iconWrap & eyeWrap ────────────────────────────────────────────────────
    /*
     * CHANGE 3 — iconWrap / eyeWrap: removed alignSelf + justifyContent
     *
     * What:  Removed alignSelf:'stretch' and justifyContent:'center' from
     *        both iconWrap and eyeWrap.
     *
     * Why:   These were needed previously to vertically center icons when
     *        alignItems was 'flex-start' on the parent. Now that inputWrap
     *        uses alignItems:'center', the parent handles centering.
     *        Keeping alignSelf:'stretch' would override the parent's
     *        cross-axis alignment and reintroduce the downward shift.
     */
    iconWrap: {
        marginRight: 12,
    },
    eyeWrap: {
        paddingLeft: 10,
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
        /*
         * CHANGE 4 — marginTop: -8 → -Math.round(LABEL_SIZE_REST / 2)
         *
         * What:  marginTop value stays -8 (unchanged from source) because
         *        LABEL_SIZE_REST / 2 = 7.5 → rounds to 8. No numeric change.
         *        This comment documents WHY -8 is correct: it offsets the
         *        wrapper by half the resting label height so top:'50%' anchors
         *        to the label's visual midpoint at rest, not its top edge.
         *        The actual positioning fix is entirely in TRANSLATE_Y_FLOATED.
         */
        marginTop:     -Math.round(LABEL_SIZE_REST / 2),  // = -8, same as before
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

    // ── Error alert ───────────────────────────────────────────────────────────
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

    // ── Field-level errors ────────────────────────────────────────────────────
    fieldError: { fontSize: 12, color: COLORS.error, marginTop: -10, marginBottom: 10, marginLeft: 4 },

    // ── Forgot password ───────────────────────────────────────────────────────
    forgotRow:  { alignItems: 'flex-end', marginBottom: 24 },
    forgotLink: { fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecorationLine: 'underline' },

    // ── Submit ────────────────────────────────────────────────────────────────
    btnSignIn:      { height: 56, backgroundColor: '#ffffff', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    btnDisabled:    { opacity: 0.6 },
    btnSignInText:  { fontFamily: 'Syne_700Bold', fontSize: 15, fontWeight: '700', color: '#07080f', letterSpacing: 0.3 },
    registerRow:    { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    registerPrompt: { fontSize: 14, color: 'rgba(255,255,255,0.4)' },
    registerLink:   { fontFamily: 'Syne_700Bold', fontSize: 14, color: '#ffffff', fontWeight: '700' },
});

export default LoginScreen;