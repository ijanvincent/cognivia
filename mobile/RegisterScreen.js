import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, ActivityIndicator,
    StyleSheet, KeyboardAvoidingView, Platform,
    ScrollView, TextInput, Dimensions, Linking, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from './components/AuthInput';
import api from './services/api';

const { height: H } = Dimensions.get('window');

const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL || 'https://cognivia.com';

const openLegal = async (page) => {
    const url = `${WEB_URL}/${page}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
        await Linking.openURL(url);
    }
};

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
const SHELL_HEIGHT        = 60;
const SHELL_PADDING_T     = 18;
const SHELL_PADDING_B     = 6;
const SHELL_BORDER_W      = 1;
const LABEL_SIZE_REST     = 15;
const LABEL_SIZE_FLOAT    = 11;

/*
 * CHANGE 1 — TRANSLATE_Y_FLOATED constant introduced.
 *
 * What:  Replaces the inline magic number -28 in the interpolate outputRange.
 *        Value set to -34 (same as LoginScreen and ForgotPasswordScreen).
 *
 * Why:   -28 was insufficient to lift the label onto the top border line.
 *        The floatContainer sits 19px below the shell top (1px border +
 *        18px paddingTop). top:'50%' resolves to 18px (half of 36px
 *        container height), so the label anchor is 29.5px from the shell
 *        top. -28 left the label 1.5px inside the shell. -34 centers the
 *        label midpoint on the top border, matching the web target.
 *        To fine-tune: adjust only this constant.
 */
const TRANSLATE_Y_FLOATED = -34;

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
     * Why:   See CHANGE 1. -34 lands the label centered on the top border.
     *        Adjust TRANSLATE_Y_FLOATED at the top to fine-tune.
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
        /*
         * CHANGE 3 — inputWrap: alignItems 'flex-start' → 'center'
         *
         * What:  Shell row alignment changed from 'flex-start' to 'center'.
         * Why:   'flex-start' anchored direct children after paddingTop:18,
         *        pushing the icon visually low. 'center' vertically centers
         *        iconWrap and eyeWrap within the full 60px shell height.
         *        The absolutely-positioned floating label is unaffected.
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
// PasswordInput
// ─────────────────────────────────────────────────────────────────────────────
const PasswordInput = ({
    label,
    value,
    onChangeText,
    secureTextEntry,
    onToggleSecure,
    editable,
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
                    name="lock-outline"
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
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    editable={editable !== false}
                />
            </View>
            <View style={styles.eyeWrap}>
                <TouchableOpacity
                    onPress={onToggleSecure}
                    disabled={editable === false}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <MaterialCommunityIcons
                        name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={isFocused ? COLORS.cyan : 'rgba(255,255,255,0.3)'}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// PasswordRequirement — unchanged
// ─────────────────────────────────────────────────────────────────────────────
const PasswordRequirement = ({ met, label }) => (
    <View style={styles.reqRow}>
        {met ? (
            <MaterialCommunityIcons name="check-circle" size={16} color="#22c55e" />
        ) : (
            <View style={styles.reqDot} />
        )}
        <Text style={[styles.reqText, met && styles.reqTextMet]}>{label}</Text>
    </View>
);

const PASSWORD_RULES = [
    { key: 'lowercase', label: 'At least one lowercase letter', test: (p) => /[a-z]/.test(p) },
    { key: 'uppercase', label: 'At least one uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { key: 'number',    label: 'At least one number',           test: (p) => /[0-9]/.test(p) },
    { key: 'special',   label: 'At least one special character', test: (p) => /[^a-zA-Z0-9]/.test(p) },
    { key: 'length',    label: 'Minimum 8 characters',          test: (p) => p.length >= 8 },
];

// ─────────────────────────────────────────────────────────────────────────────
// ConsentNotice
//
// CHANGE 1 — ConsentCheckbox replaced with ConsentNotice.
// What:  Interactive checkbox + error state removed. Replaced with a single
//        static text line: "By signing up you agree to our Terms and Privacy Policy".
// Why:   Implicit consent copy is the requested pattern. No interaction needed.
// ─────────────────────────────────────────────────────────────────────────────
const ConsentNotice = () => (
    <Text style={styles.consentNotice}>
        By signing up you agree to our{' '}
        <Text style={styles.consentNoticeLink} onPress={() => openLegal('terms')}>Terms</Text>
        {' '}and{' '}
        <Text style={styles.consentNoticeLink} onPress={() => openLegal('privacy')}>Privacy Policy</Text>
    </Text>
);

// ─────────────────────────────────────────────────────────────────────────────
// RegisterScreen — unchanged
// ─────────────────────────────────────────────────────────────────────────────
const RegisterScreen = () => {
    const navigation = useNavigation();

    const [formData, setFormData] = useState({
        username:              '',
        email:                 '',
        password:              '',
        password_confirmation: '',
    });
    const [errors, setErrors]                           = useState({});
    const [isLoading, setIsLoading]                     = useState(false);
    const [showPassword, setShowPassword]               = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordFocused, setPasswordFocused]         = useState(false);
    const [confirmFocused, setConfirmFocused]           = useState(false);
    const [strengthDismissed, setStrengthDismissed]     = useState(false);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field])  setErrors(prev => ({ ...prev, [field]: null }));
        if (errors.general) setErrors(prev => ({ ...prev, general: null }));
    };

    const validate = () => {
        const e = {};
        if (!formData.username.trim()) {
            e.username = 'Username is required.';
        } else if (formData.username.trim().length < 3) {
            e.username = 'Username must be at least 3 characters.';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
            e.username = 'Letters, numbers and underscores only.';
        }
        if (!formData.email.trim()) {
            e.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            e.email = 'Please enter a valid email.';
        }
        if (!formData.password) {
            e.password = 'Password is required.';
        }
        if (!formData.password_confirmation) {
            e.password_confirmation = 'Please confirm your password.';
        } else if (formData.password !== formData.password_confirmation) {
            e.password_confirmation = 'Passwords do not match.';
        }
        return e;
    };

    const handleRegister = async () => {
        setStrengthDismissed(true);

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            await api.post('/auth/register', {
                username:              formData.username.trim(),
                email:                 formData.email.trim(),
                password:              formData.password,
                password_confirmation: formData.password_confirmation,
            });
            navigation.replace('Login');
        } catch (error) {
            if (error.response?.data?.errors) {
                const firstKey   = Object.keys(error.response.data.errors)[0];
                const firstError = error.response.data.errors[firstKey][0];
                setErrors({ general: firstError });
            } else if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            } else if (error.message === 'Network Error') {
                setErrors({ general: 'Cannot connect to server. Check your connection.' });
            } else {
                setErrors({ general: 'Registration failed. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const showPasswordRules = !strengthDismissed &&
        (passwordFocused || (!confirmFocused && formData.password.length > 0));

    const isButtonDisabled = isLoading;

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
                        onPress={() => navigation.navigate('Login')}
                        style={styles.backBtn}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={22} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>

                    <View style={styles.brandSection}>
                        <Text style={styles.brandSub}>
                            Join and start learning smarter today.
                        </Text>
                    </View>

                    <View style={styles.formSection}>

                        {!!errors.general && (
                            <View style={styles.errorAlert}>
                                <MaterialCommunityIcons name="alert-circle-outline" size={16} color={COLORS.error} />
                                <Text style={styles.errorAlertText}>{errors.general}</Text>
                            </View>
                        )}

                        <FloatingLabelInput
                            label="Username"
                            value={formData.username}
                            onChangeText={v => updateField('username', v)}
                            icon="account-outline"
                            editable={!isLoading}
                            onFocusCallback={() => setStrengthDismissed(true)}
                        />
                        {!!errors.username && <Text style={styles.fieldError}>{errors.username}</Text>}

                        <FloatingLabelInput
                            label="Email"
                            value={formData.email}
                            onChangeText={v => updateField('email', v)}
                            keyboardType="email-address"
                            icon="email-outline"
                            editable={!isLoading}
                            onFocusCallback={() => setStrengthDismissed(true)}
                        />
                        {!!errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}

                        <View style={styles.passwordRow}>

                            <View style={styles.passwordCol}>
                                <PasswordInput
                                    label="Password"
                                    value={formData.password}
                                    onChangeText={v => updateField('password', v)}
                                    secureTextEntry={!showPassword}
                                    onToggleSecure={() => setShowPassword(p => !p)}
                                    editable={!isLoading}
                                    onFocusCallback={() => {
                                        setPasswordFocused(true);
                                        setStrengthDismissed(false);
                                    }}
                                    onBlurCallback={() => setPasswordFocused(false)}
                                />
                                {!!errors.password && (
                                    <Text style={styles.fieldError}>{errors.password}</Text>
                                )}
                            </View>

                            <View style={styles.passwordCol}>
                                <FloatingLabelInput
                                    label="Confirm"
                                    value={formData.password_confirmation}
                                    onChangeText={v => updateField('password_confirmation', v)}
                                    secureTextEntry={!showConfirmPassword}
                                    icon="lock-check-outline"
                                    rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                    onRightIconPress={() => setShowConfirmPassword(p => !p)}
                                    editable={!isLoading}
                                    onFocusCallback={() => {
                                        setConfirmFocused(true);
                                        setStrengthDismissed(true);
                                    }}
                                    onBlurCallback={() => setConfirmFocused(false)}
                                />
                                {!!errors.password_confirmation && (
                                    <Text style={styles.fieldError}>{errors.password_confirmation}</Text>
                                )}
                            </View>

                        </View>

                        {showPasswordRules && (
                            <View style={styles.reqContainer}>
                                {PASSWORD_RULES.map(rule => (
                                    <PasswordRequirement
                                        key={rule.key}
                                        met={rule.test(formData.password)}
                                        label={rule.label}
                                    />
                                ))}
                            </View>
                        )}

                        <ConsentNotice />

                        <TouchableOpacity
                            onPress={handleRegister}
                            disabled={isButtonDisabled}
                            activeOpacity={0.88}
                            style={[
                                styles.btnCreate,
                                isButtonDisabled && styles.btnDisabled,
                            ]}
                        >
                            {isLoading
                                ? <ActivityIndicator color="#07080f" />
                                : <Text style={styles.btnCreateText}>Create account</Text>
                            }
                        </TouchableOpacity>

                        <View style={styles.loginRow}>
                            <Text style={styles.loginPrompt}>Already have an account? </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Login')}
                                disabled={isLoading}
                            >
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
    scrollContent: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 16, paddingBottom: 40, minHeight: H, justifyContent: 'center' },
    backBtn:       { position: 'absolute', top: 16, left: 28, zIndex: 10, padding: 4 },
    brandSection:  { alignItems: 'center', marginBottom: 32 },
    brandSub:      { fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: '300', textAlign: 'left' },
    formSection:   { width: '100%' },

    // ── Input shell ───────────────────────────────────────────────────────────
    /*
     * CHANGE 3 — alignItems: 'flex-start' → 'center'
     *
     * What:  Shell row alignment changed from 'flex-start' to 'center'.
     * Why:   'flex-start' anchored direct children after paddingTop:18,
     *        pushing the icon and eye button visually low. 'center'
     *        vertically centers iconWrap and eyeWrap within the full
     *        60px shell height. The absolutely-positioned floating label
     *        is unaffected by this change.
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

    // ── Icon / eye wrappers ───────────────────────────────────────────────────
    /*
     * CHANGE 4 — iconWrap / eyeWrap: removed alignSelf:'stretch' +
     *            justifyContent:'center'
     *
     * What:  Both properties removed from iconWrap and eyeWrap.
     * Why:   Those properties were the original workaround for a flex-start
     *        parent — stretching the wrapper to full height and self-centering
     *        within it. Now that inputWrap uses alignItems:'center', the
     *        parent handles vertical centering automatically. Keeping
     *        alignSelf:'stretch' would override the parent and reintroduce
     *        the downward offset.
     */
    iconWrap: {
        marginRight: 12,                      // alignSelf/justifyContent removed
    },
    eyeWrap: {
        paddingLeft: 10,                      // alignSelf/justifyContent removed
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

    // ── Password side-by-side row ─────────────────────────────────────────────
    passwordRow: { flexDirection: 'row', gap: 10, marginBottom: 0 },
    passwordCol: { flex: 1 },

    // ── Errors ────────────────────────────────────────────────────────────────
    errorAlert:     { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.errorBg, borderLeftWidth: 3, borderLeftColor: COLORS.error, borderRadius: 10, padding: 14, marginBottom: 16 },
    errorAlertText: { flex: 1, fontSize: 13, color: COLORS.error, fontWeight: '500' },
    fieldError:     { fontSize: 12, color: COLORS.error, marginTop: -10, marginBottom: 10, marginLeft: 4 },

    // ── Consent notice ────────────────────────────────────────────────────────
    consentNotice:     { fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 20, marginBottom: 20, marginTop: 4, fontWeight: '300' },
    consentNoticeLink: { color: '#ffffff', fontWeight: '600' },

    // ── Submit ────────────────────────────────────────────────────────────────
    btnCreate:     { height: 56, backgroundColor: '#ffffff', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    btnDisabled:   { opacity: 0.35 },
    btnCreateText: { fontFamily: 'Syne_700Bold', fontSize: 15, fontWeight: '700', color: '#07080f', letterSpacing: 0.3 },
    loginRow:      { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    loginPrompt:   { fontSize: 14, color: 'rgba(255,255,255,0.4)' },
    loginLink:     { fontFamily: 'Syne_700Bold', fontSize: 14, color: '#ffffff', fontWeight: '700' },

    // ── Password strength ─────────────────────────────────────────────────────
    reqContainer: { paddingVertical: 10, paddingHorizontal: 4, marginBottom: 14, gap: 6 },
    reqRow:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
    reqDot:       { width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.25)' },
    reqText:      { fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: '400' },
    reqTextMet:   { color: '#22c55e', fontWeight: '500' },
});

export default RegisterScreen;