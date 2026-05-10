import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, ActivityIndicator,
    StyleSheet, KeyboardAvoidingView, Platform,
    ScrollView, TextInput, Dimensions, Animated, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from './components/AuthInput';
import api from './services/api';
import { getEchoWithToken, disconnectEcho } from './services/echoService';

const { height: H } = Dimensions.get('window');

// Approval window must match backend APPROVAL_TTL_SECONDS (60).
const APPROVAL_TTL_SECONDS = 60;

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
// Constants — shell geometry (unchanged)
// ─────────────────────────────────────────────────────────────────────────────
const SHELL_HEIGHT     = 60;
const SHELL_PADDING_T  = 18;
const SHELL_PADDING_B  = 6;
const LABEL_SIZE_REST  = 15;
const LABEL_SIZE_FLOAT = 11;
const SHELL_BORDER_W   = 1;
const TRANSLATE_Y_FLOATED = -34;

// ─────────────────────────────────────────────────────────────────────────────
// FloatingLabel — unchanged
// ─────────────────────────────────────────────────────────────────────────────
const FloatingLabel = ({ label, floatAnim, isFocused }) => {
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
            style={[styles.floatingLabelWrapper, { transform: [{ translateY: labelTranslateY }] }]}
        >
            <Animated.View style={[styles.labelBgPatch, { opacity: labelBgOpacity }]} />
            <Animated.Text
                style={[styles.floatingLabel, { fontSize: labelFontSize, color: labelColor }]}
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
    label, value, onChangeText, secureTextEntry, keyboardType,
    icon, rightIcon, onRightIconPress, editable, autoCapitalize,
    onFocusCallback, onBlurCallback,
}) => {
    const { isFocused, floatAnim, handleFocus, handleBlur } = useFloatAnim({
        value, onFocusCallback, onBlurCallback,
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
// ApprovalRequestModal
//
// What: Shown when mobile (Platform A) is already logged in and receives a
//       NewLoginRequest event — i.e. web (Platform B) is trying to log in.
//
// Why a Modal: The LoginScreen might not be the active screen when the event
//       arrives. Using a Modal (rendered at the LoginScreen level here, but
//       ideally lifted to a global provider) ensures it overlays whatever
//       screen is visible. For now it lives here because the echo subscription
//       for the *active* session is managed in the Dashboard/App level.
//       See NOTE below about where to ultimately move this listener.
// ─────────────────────────────────────────────────────────────────────────────
const ApprovalRequestModal = ({ visible, requestData, onAllow, onDeny, isActioning }) => {
    const [secondsLeft, setSecondsLeft] = useState(APPROVAL_TTL_SECONDS);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!visible) {
            setSecondsLeft(APPROVAL_TTL_SECONDS);
            clearInterval(timerRef.current);
            return;
        }

        setSecondsLeft(requestData?.expiresIn ?? APPROVAL_TTL_SECONDS);

        timerRef.current = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [visible, requestData?.approvalToken]);

    if (!visible || !requestData) return null;

    const platform = requestData.requestingPlatform === 'web' ? 'web browser' : 'mobile device';

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={modalStyles.scrim}>
                <View style={modalStyles.card}>
                    {/* Icon */}
                    <View style={modalStyles.iconRow}>
                        <View style={modalStyles.iconCircle}>
                            <MaterialCommunityIcons
                                name="shield-account-outline"
                                size={28}
                                color={COLORS.cyan}
                            />
                        </View>
                    </View>

                    {/* Title */}
                    <Text style={modalStyles.title}>New Sign-In Request</Text>
                    <Text style={modalStyles.body}>
                        Someone is trying to sign in to your account from a{' '}
                        <Text style={modalStyles.highlight}>{platform}</Text>.
                        Is this you?
                    </Text>

                    {/* Countdown */}
                    <View style={modalStyles.countdownRow}>
                        <MaterialCommunityIcons
                            name="clock-outline"
                            size={14}
                            color={secondsLeft <= 10 ? COLORS.error : 'rgba(255,255,255,0.4)'}
                        />
                        <Text style={[
                            modalStyles.countdownText,
                            secondsLeft <= 10 && { color: COLORS.error },
                        ]}>
                            Expires in {secondsLeft}s
                        </Text>
                    </View>

                    <View style={modalStyles.divider} />

                    {/* Actions */}
                    <View style={modalStyles.actions}>
                        {/* Deny */}
                        <TouchableOpacity
                            style={[modalStyles.btnDeny, isActioning && modalStyles.btnDisabled]}
                            onPress={onDeny}
                            disabled={isActioning}
                            activeOpacity={0.8}
                        >
                            {isActioning ? (
                                <ActivityIndicator size="small" color={COLORS.error} />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="close" size={16} color={COLORS.error} />
                                    <Text style={modalStyles.btnDenyText}>Deny</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Allow */}
                        <TouchableOpacity
                            style={[modalStyles.btnAllow, isActioning && modalStyles.btnDisabled]}
                            onPress={onAllow}
                            disabled={isActioning}
                            activeOpacity={0.88}
                        >
                            {isActioning ? (
                                <ActivityIndicator size="small" color="#07080f" />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="check" size={16} color="#07080f" />
                                    <Text style={modalStyles.btnAllowText}>Allow</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
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

    // ── Approval gate — Platform B waiting state ──────────────────────────────
    // What: when mobile is Platform B (web is logged in, mobile trying to login).
    // mobile gets 422 PLATFORM_CONFLICT, subscribes to WS, waits for approval.
    const [conflictState, setConflictState] = useState(null);
    // conflictState shape: { userId, conflictToken, approvalToken, secondsLeft }

    // ── Incoming request state — Platform A receiving a request ───────────────
    // What: when mobile is Platform A (already logged in), web tries to login.
    // mobile receives .new.login.request via its active session Echo instance.
    // NOTE: In a production app this listener belongs in a global provider
    //       (e.g. App.js or a context) so it works regardless of active screen.
    //       It lives here for now because LoginScreen owns the auth flow.
    const [incomingRequest, setIncomingRequest] = useState(null);
    // incomingRequest shape: { approvalToken, requestingPlatform, expiresIn }
    const [isActioning, setIsActioning]         = useState(false);

    const conflictEchoRef   = useRef(null);  // Echo for Platform B waiting
    const countdownRef      = useRef(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanupConflictEcho();
            clearInterval(countdownRef.current);
        };
    }, []);

    const cleanupConflictEcho = useCallback(() => {
        if (conflictEchoRef.current) {
            try { conflictEchoRef.current.disconnect(); } catch (_) {}
            conflictEchoRef.current = null;
        }
    }, []);

    // ── Countdown for Platform B waiting ─────────────────────────────────────
    useEffect(() => {
        if (!conflictState) {
            clearInterval(countdownRef.current);
            return;
        }

        countdownRef.current = setInterval(() => {
            setConflictState(prev => {
                if (!prev) return null;
                if (prev.secondsLeft <= 1) {
                    clearInterval(countdownRef.current);
                    cleanupConflictEcho();
                    return null;
                }
                return { ...prev, secondsLeft: prev.secondsLeft - 1 };
            });
        }, 1000);

        return () => clearInterval(countdownRef.current);
    }, [conflictState?.userId, cleanupConflictEcho]);

    // ── Platform B: subscribe to approval channel after PLATFORM_CONFLICT ─────
    /**
     * What: Platform B (mobile) subscribes to private user.{userId} using
     *       the short-lived conflict_token, listens for login.approved /
     *       login.denied events.
     *
     * Why: Mobile has no real session token yet at this point. The
     *      conflict_token is a limited Sanctum token that only authenticates
     *      the WS channel subscription.
     */
    const subscribeToApprovalChannel = useCallback((userId, conflictToken) => {
        const echo = getEchoWithToken(conflictToken);
        if (!echo) {
            setErrors({ general: 'Could not connect to approval channel. Please try again.' });
            return;
        }

        conflictEchoRef.current = echo;

        echo.private(`user.${userId}`)
            .listen('.login.approved', async (event) => {
                // Only handle if this approval is for mobile (our platform)
                if (event.platform !== 'mobile') return;

                clearInterval(countdownRef.current);
                cleanupConflictEcho();
                setConflictState(null);
                setIsLoading(true);

                try {
                    const userToStore = {
                        id:       event.user.id,
                        username: event.user.username,
                        email:    event.user.email,
                        avatar:   event.user.avatar || null,
                        role:     event.user.role,
                    };

                    await SecureStore.setItemAsync('token', event.token);
                    await SecureStore.setItemAsync('user', JSON.stringify(userToStore));

                    navigation.replace('HomeTabs');
                } catch (err) {
                    setErrors({ general: 'Sign-in approved but session setup failed. Please try again.' });
                    setIsLoading(false);
                }
            })
            .listen('.login.denied', (event) => {
                if (event.platform !== 'mobile') return;

                clearInterval(countdownRef.current);
                cleanupConflictEcho();
                setConflictState(null);
                setErrors({ general: event.reason || 'Your sign-in request was denied.' });
            });
    }, [cleanupConflictEcho, navigation]);

    // ── Platform A: listen for incoming login requests on active session ──────
    /**
     * What: When mobile is already logged in and navigates to LoginScreen
     *       (edge case), or more importantly — this pattern should be lifted
     *       to App.js/DashboardScreen so the active session always listens.
     *
     * This useEffect wires up the listener using the stored session token
     * so mobile can receive .new.login.request events while authenticated.
     *
     * IMPORTANT: Move this to your DashboardScreen or a global Echo context
     * so it runs whenever the user is authenticated, not just on LoginScreen.
     */
    useEffect(() => {
        let activeEcho = null;

        const setupActiveSessionListener = async () => {
            const storedToken = await SecureStore.getItemAsync('token');
            if (!storedToken) return;

            // User is already logged in — set up listener for incoming requests
            activeEcho = getEchoWithToken(storedToken);
            if (!activeEcho) return;

            const storedUserRaw = await SecureStore.getItemAsync('user');
            if (!storedUserRaw) return;
            const storedUser = JSON.parse(storedUserRaw);

            activeEcho.private(`user.${storedUser.id}`)
                .listen('.new.login.request', (event) => {
                    setIncomingRequest({
                        approvalToken:      event.approval_token,
                        requestingPlatform: event.requesting_platform,
                        expiresIn:          event.expires_in ?? APPROVAL_TTL_SECONDS,
                    });
                });
        };

        setupActiveSessionListener();

        return () => {
            if (activeEcho) {
                try { activeEcho.disconnect(); } catch (_) {}
            }
        };
    }, []);

    // ── Platform A: Allow handler ─────────────────────────────────────────────
    const handleAllow = async () => {
        if (!incomingRequest?.approvalToken) return;
        setIsActioning(true);
        try {
            await api.post('/auth/login/approve', {
                approval_token: incomingRequest.approvalToken,
            });
            setIncomingRequest(null);
        } catch (err) {
            setErrors({ general: 'Failed to approve sign-in. Please try again.' });
            setIncomingRequest(null);
        } finally {
            setIsActioning(false);
        }
    };

    // ── Platform A: Deny handler ──────────────────────────────────────────────
    const handleDeny = async () => {
        if (!incomingRequest?.approvalToken) return;
        setIsActioning(true);
        try {
            await api.post('/auth/login/deny', {
                approval_token: incomingRequest.approvalToken,
            });
            setIncomingRequest(null);
        } catch (err) {
            setIncomingRequest(null);
        } finally {
            setIsActioning(false);
        }
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field])  setErrors(prev => ({ ...prev, [field]: null }));
        if (errors.general) setErrors(prev => ({ ...prev, general: null }));
        // If user types again while waiting, cancel the conflict wait
        if (conflictState) {
            clearInterval(countdownRef.current);
            cleanupConflictEcho();
            setConflictState(null);
        }
    };

    const validate = () => {
        const e = {};
        if (!formData.email.trim())    e.email    = 'Email is required.';
        if (!formData.password.trim()) e.password = 'Password is required.';
        return e;
    };

    const handleLogin = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

        // Cancel any previous conflict wait
        clearInterval(countdownRef.current);
        cleanupConflictEcho();
        setConflictState(null);

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
            const status = error.response?.status;
            const code   = error.response?.data?.error_code;

            if (status === 422 && code === 'PLATFORM_CONFLICT') {
                /**
                 * What: Mobile is Platform B — web is logged in, mobile is waiting.
                 * Why:  Subscribe to approval channel with conflict_token so we
                 *       receive LoginApproved/LoginDenied events from the backend
                 *       when the web user responds.
                 */
                const conflictToken = error.response.data.conflict_token;
                const approvalToken = error.response.data.approval_token;
                const userId        = error.response.data.conflict_user_id;

                setConflictState({
                    userId,
                    conflictToken,
                    approvalToken,
                    secondsLeft: APPROVAL_TTL_SECONDS,
                });

                if (conflictToken && userId) {
                    subscribeToApprovalChannel(userId, conflictToken);
                }

            } else if (status === 401) {
                const message = error.response?.data?.message;
                switch (code) {
                    case 'EMAIL_NOT_FOUND':
                        setErrors({ email: message || 'No account found with this email.' });
                        break;
                    case 'WRONG_PASSWORD':
                        setErrors({ password: message || 'The password you entered is incorrect.' });
                        break;
                    default:
                        setErrors({ general: 'Invalid email or password.' });
                }
            } else if (status === 429) {
                const retryAfter = error.response?.data?.retry_after;
                setErrors({
                    general: retryAfter
                        ? `Too many attempts. Try again in ${retryAfter}s.`
                        : 'Too many login attempts. Please try again later.',
                });
            } else if (status === 422 && code === 'ADMIN_ACCOUNT') {
                setErrors({ email: 'This account is not authorized here.' });
            } else if (error.message === 'Network Error') {
                setErrors({ general: 'Cannot connect to server. Please check your connection.' });
            } else {
                setErrors({ general: error.response?.data?.message || 'Login failed. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isWaiting = !!conflictState;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar style="light" backgroundColor={COLORS.bg} translucent={false} />
            <WaveBackground />
            <View style={styles.overlay} />

            {/* ── Platform A: incoming request modal ─────────────────────── */}
            <ApprovalRequestModal
                visible={!!incomingRequest}
                requestData={incomingRequest}
                onAllow={handleAllow}
                onDeny={handleDeny}
                isActioning={isActioning}
            />

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

                        {/* General error alert */}
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

                        {/* Platform B: waiting for approval banner */}
                        {isWaiting && (
                            <View style={styles.waitingBanner}>
                                <MaterialCommunityIcons
                                    name="clock-outline"
                                    size={18}
                                    color={COLORS.cyan}
                                    style={{ marginTop: 1 }}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.waitingTitle}>
                                        Waiting for web approval…
                                    </Text>
                                    <Text style={styles.waitingBody}>
                                        Open your web browser and tap{' '}
                                        <Text style={{ fontWeight: '700', color: '#fff' }}>Allow</Text>
                                        {' '}to sign in here. Expires in{' '}
                                        <Text style={{ color: conflictState.secondsLeft <= 10 ? COLORS.error : COLORS.cyan }}>
                                            {conflictState.secondsLeft}s
                                        </Text>
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        clearInterval(countdownRef.current);
                                        cleanupConflictEcho();
                                        setConflictState(null);
                                    }}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <MaterialCommunityIcons
                                        name="close"
                                        size={18}
                                        color="rgba(255,255,255,0.4)"
                                    />
                                </TouchableOpacity>
                            </View>
                        )}

                        <FloatingLabelInput
                            label="Email"
                            value={formData.email}
                            onChangeText={v => updateField('email', v)}
                            keyboardType="email-address"
                            icon="email-outline"
                            editable={!isLoading && !isWaiting}
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
                            editable={!isLoading && !isWaiting}
                        />
                        {!!errors.password && (
                            <Text style={styles.fieldError}>{errors.password}</Text>
                        )}

                        <TouchableOpacity
                            onPress={() => navigation.navigate('ForgotPassword')}
                            disabled={isLoading || isWaiting}
                            style={styles.forgotRow}
                        >
                            <Text style={styles.forgotLink}>Forgot your password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={isLoading || isWaiting}
                            activeOpacity={0.88}
                            style={[styles.btnSignIn, (isLoading || isWaiting) && styles.btnDisabled]}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#07080f" />
                            ) : isWaiting ? (
                                <Text style={styles.btnSignInText}>
                                    Waiting… ({conflictState.secondsLeft}s)
                                </Text>
                            ) : (
                                <Text style={styles.btnSignInText}>Sign in</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.registerRow}>
                            <Text style={styles.registerPrompt}>
                                Don't have an account?{' '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Register')}
                                disabled={isLoading || isWaiting}
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
// Styles — LoginScreen (all original styles preserved)
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safeArea:      { flex: 1, backgroundColor: COLORS.bg },
    flex:          { flex: 1 },
    overlay:       { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(7,8,15,0.55)' },
    scrollContent: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 16, paddingBottom: 40, minHeight: H, justifyContent: 'center' },
    brandSection:  { alignItems: 'center', marginBottom: 32 },
    brandSub:      { fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: '300', textAlign: 'left' },
    formSection:   { width: '100%' },

    inputWrap: {
        flexDirection:     'row',
        alignItems:        'center',
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
    iconWrap: { marginRight: 12 },
    eyeWrap:  { paddingLeft: 10 },

    floatContainer: {
        flex:           1,
        position:       'relative',
        justifyContent: 'center',
    },
    floatingLabelWrapper: {
        position:      'absolute',
        top:           '50%',
        marginTop:     -Math.round(LABEL_SIZE_REST / 2),
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
    floatingLabel: { fontWeight: '400', letterSpacing: 0.1 },
    input: {
        flex:            1,
        fontSize:        15,
        color:           '#ffffff',
        paddingVertical: 0,
        paddingTop:      2,
    },

    // ── Error alert ────────────────────────────────────────────────────────────
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
    errorAlertIconWrap: { marginTop: 1, flexShrink: 0 },
    errorAlertText: {
        flex:       1,
        fontSize:   13.5,
        lineHeight: 20,
        color:      COLORS.error,
        fontWeight: '500',
    },

    // ── Waiting banner (Platform B) ────────────────────────────────────────────
    waitingBanner: {
        flexDirection:   'row',
        alignItems:      'flex-start',
        gap:             12,
        backgroundColor: 'rgba(34,211,238,0.06)',
        borderWidth:     1,
        borderColor:     'rgba(34,211,238,0.25)',
        borderRadius:    12,
        padding:         14,
        marginBottom:    16,
    },
    waitingTitle: {
        fontSize:    13.5,
        fontWeight:  '600',
        color:       COLORS.cyan,
        marginBottom: 3,
    },
    waitingBody: {
        fontSize:   13,
        lineHeight: 19,
        color:      'rgba(255,255,255,0.6)',
    },

    fieldError:     { fontSize: 12, color: COLORS.error, marginTop: -10, marginBottom: 10, marginLeft: 4 },
    forgotRow:      { alignItems: 'flex-end', marginBottom: 24 },
    forgotLink:     { fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecorationLine: 'underline' },
    btnSignIn:      { height: 56, backgroundColor: '#ffffff', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    btnDisabled:    { opacity: 0.6 },
    btnSignInText:  { fontFamily: 'Syne_700Bold', fontSize: 15, fontWeight: '700', color: '#07080f', letterSpacing: 0.3 },
    registerRow:    { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    registerPrompt: { fontSize: 14, color: 'rgba(255,255,255,0.4)' },
    registerLink:   { fontFamily: 'Syne_700Bold', fontSize: 14, color: '#ffffff', fontWeight: '700' },
});

// ─────────────────────────────────────────────────────────────────────────────
// Modal styles
// ─────────────────────────────────────────────────────────────────────────────
const modalStyles = StyleSheet.create({
    scrim: {
        flex:            1,
        backgroundColor: 'rgba(7,8,15,0.85)',
        alignItems:      'center',
        justifyContent:  'center',
        paddingHorizontal: 28,
    },
    card: {
        width:           '100%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.12)',
        borderRadius:    20,
        padding:         24,
        alignItems:      'center',
    },
    iconRow: {
        marginBottom: 16,
    },
    iconCircle: {
        width:           56,
        height:          56,
        borderRadius:    28,
        backgroundColor: 'rgba(34,211,238,0.1)',
        borderWidth:     1,
        borderColor:     'rgba(34,211,238,0.3)',
        alignItems:      'center',
        justifyContent:  'center',
    },
    title: {
        fontSize:     18,
        fontWeight:   '700',
        color:        '#ffffff',
        marginBottom: 10,
        textAlign:    'center',
    },
    body: {
        fontSize:   14,
        lineHeight: 22,
        color:      'rgba(255,255,255,0.6)',
        textAlign:  'center',
        marginBottom: 16,
    },
    highlight: {
        color:      '#ffffff',
        fontWeight: '600',
    },
    countdownRow: {
        flexDirection: 'row',
        alignItems:    'center',
        gap:           6,
        marginBottom:  16,
    },
    countdownText: {
        fontSize:   13,
        color:      'rgba(255,255,255,0.4)',
        fontWeight: '500',
    },
    divider: {
        width:           '100%',
        height:          1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginBottom:    20,
    },
    actions: {
        flexDirection: 'row',
        gap:           12,
        width:         '100%',
    },
    btnDeny: {
        flex:            1,
        height:          48,
        borderRadius:    12,
        borderWidth:     1,
        borderColor:     'rgba(248,113,113,0.4)',
        backgroundColor: 'rgba(248,113,113,0.08)',
        flexDirection:   'row',
        alignItems:      'center',
        justifyContent:  'center',
        gap:             6,
    },
    btnDenyText: {
        fontSize:   15,
        fontWeight: '600',
        color:      COLORS.error,
    },
    btnAllow: {
        flex:            1,
        height:          48,
        borderRadius:    12,
        backgroundColor: '#ffffff',
        flexDirection:   'row',
        alignItems:      'center',
        justifyContent:  'center',
        gap:             6,
    },
    btnAllowText: {
        fontSize:   15,
        fontWeight: '700',
        color:      '#07080f',
    },
    btnDisabled: {
        opacity: 0.6,
    },
});

export default LoginScreen;