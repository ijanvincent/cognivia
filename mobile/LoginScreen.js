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
// useFloatAnim
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
// LoginScreen
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
        if (error.response?.data?.message) {
            return error.response.data.message;
        }
        if (error.response?.data?.errors) {
            const firstKey = Object.keys(error.response.data.errors)[0];
            return error.response.data.errors[firstKey][0];
        }
        if (error.response?.status === 401) {
            return 'Invalid email or password.';
        }
        if (error.message === 'Network Error') {
            return 'Cannot connect to server. Please check your connection.';
        }
        return 'Login failed. Please try again.';
    };

    const handleLogin = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

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

                        {/*
                          CHANGE 1 — Error alert redesign.
                          Old: borderLeftWidth: 3 + borderLeftColor on a rounded container
                               → Android renders a visib`le gap between the curved corner
                                 and the straight border, producing the double-line artifact.
                          New: Uniform borderWidth: 1 with a subtle red tint + icon row.
                               Industry standard pattern (Expo, Firebase, Supabase mobile UIs).
                               No directional border = zero artifact risk on any platform.
                        */}
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

    // ── iconWrap & eyeWrap ────────────────────────────────────────────────────
    iconWrap: {
        alignSelf:      'stretch',
        justifyContent: 'center',
        marginRight:    12,
    },
    eyeWrap: {
        alignSelf:      'stretch',
        justifyContent: 'center',
        paddingLeft:    10,
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

    // ── Error alert ───────────────────────────────────────────────────────────
    /*
      CHANGE 1 — What was removed and why:
        borderLeftWidth: 3      → removed. A thick directional border on a
        borderLeftColor: ...      borderRadius container creates a visible gap
                                  artifact on Android where the corner curve
                                  separates from the straight edge, rendering
                                  as a double line. No directional borders on
                                  rounded containers.

      What was added:
        borderWidth: 1          → single uniform border, fully compatible with
        borderColor: ...          borderRadius on all platforms.
        errorAlertIconWrap      → dedicated icon container with consistent
                                  vertical centering, independent of text height.

      CHANGE 2 — errorAlertText:
        fontSize: 13 → 13.5, lineHeight: 20 added.
        Multi-line error messages were cramped. lineHeight gives breathing
        room without changing the card's padding or layout.
    */
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
        marginTop: 1,
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