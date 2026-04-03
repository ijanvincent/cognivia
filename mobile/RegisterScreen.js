import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, ActivityIndicator,
    StyleSheet, KeyboardAvoidingView, Platform,
    ScrollView, TextInput, Dimensions, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from './components/AuthInput';
import api from './services/api';

const { height: H } = Dimensions.get('window');

// ─── Web URL (from env, falls back to production domain) ─────────────────────
const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL || 'https://cognivia.com';

/**
 * Opens the legal page in the device's default browser.
 * @param {'terms' | 'privacy'} page
 */
const openLegal = async (page) => {
    const url = `${WEB_URL}/${page}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
        await Linking.openURL(url);
    }
};

// ─── Wave Background ──────────────────────────────────────────────────────────
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

// ─── Reusable Input ───────────────────────────────────────────────────────────
const Input = ({
    value, onChangeText, placeholder, secureTextEntry,
    keyboardType, icon, rightIcon, onRightIconPress,
    editable, autoCapitalize, onFocusCallback, onBlurCallback,
}) => {
    const [focused, setFocused] = useState(false);
    return (
        <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
            <MaterialCommunityIcons
                name={icon}
                size={20}
                color={focused ? COLORS.cyan : 'rgba(255,255,255,0.3)'}
                style={styles.inputIcon}
            />
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="rgba(255,255,255,0.3)"
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType || 'default'}
                autoCapitalize={autoCapitalize || 'none'}
                autoCorrect={false}
                onFocus={() => { setFocused(true); onFocusCallback?.(); }}
                onBlur={() => { setFocused(false); onBlurCallback?.(); }}
                editable={editable !== false}
            />
            {rightIcon && (
                <TouchableOpacity
                    onPress={onRightIconPress}
                    style={styles.eyeBtn}
                    disabled={editable === false}
                >
                    <MaterialCommunityIcons
                        name={rightIcon}
                        size={20}
                        color={focused ? COLORS.cyan : 'rgba(255,255,255,0.3)'}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

// ─── Password Requirement Row ─────────────────────────────────────────────────
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

// ─── Password Rules ───────────────────────────────────────────────────────────
const PASSWORD_RULES = [
    { key: 'lowercase', label: 'At least one lowercase letter', test: (p) => /[a-z]/.test(p) },
    { key: 'uppercase', label: 'At least one uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { key: 'number',    label: 'At least one number',           test: (p) => /[0-9]/.test(p) },
    { key: 'special',   label: 'At least one special character', test: (p) => /[^a-zA-Z0-9]/.test(p) },
    { key: 'length',    label: 'Minimum 8 characters',          test: (p) => p.length >= 8 },
];

// ─── Register Screen ──────────────────────────────────────────────────────────
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

    // Show meter only when password is focused or has content (and not dismissed)
    const showPasswordRules = !strengthDismissed &&
        (passwordFocused || (!confirmFocused && formData.password.length > 0));

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
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        style={styles.backBtn}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={22} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>

                    {/* Brand Section */}
                    <View style={styles.brandSection}>
                        <Text style={styles.brandSub}>
                            Join and start learning smarter today.
                        </Text>
                    </View>

                    <View style={styles.formSection}>

                        {/* General Error */}
                        {!!errors.general && (
                            <View style={styles.errorAlert}>
                                <MaterialCommunityIcons name="alert-circle-outline" size={16} color={COLORS.error} />
                                <Text style={styles.errorAlertText}>{errors.general}</Text>
                            </View>
                        )}

                        {/* Username */}
                        <Input
                            value={formData.username}
                            onChangeText={v => updateField('username', v)}
                            placeholder="Username"
                            icon="account-outline"
                            editable={!isLoading}
                            onFocusCallback={() => setStrengthDismissed(true)}
                        />
                        {!!errors.username && <Text style={styles.fieldError}>{errors.username}</Text>}

                        {/* Email */}
                        <Input
                            value={formData.email}
                            onChangeText={v => updateField('email', v)}
                            placeholder="Email"
                            keyboardType="email-address"
                            icon="email-outline"
                            editable={!isLoading}
                            onFocusCallback={() => setStrengthDismissed(true)}
                        />
                        {!!errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}

                        {/* Password */}
                        <View style={[styles.inputWrap, passwordFocused && styles.inputWrapFocused]}>
                            <MaterialCommunityIcons
                                name="lock-outline"
                                size={20}
                                color={passwordFocused ? COLORS.cyan : 'rgba(255,255,255,0.3)'}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                value={formData.password}
                                onChangeText={v => updateField('password', v)}
                                placeholder="Password"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onFocus={() => {
                                    setPasswordFocused(true);
                                    setStrengthDismissed(false);
                                }}
                                onBlur={() => setPasswordFocused(false)}
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(p => !p)}
                                style={styles.eyeBtn}
                            >
                                <MaterialCommunityIcons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color={passwordFocused ? COLORS.cyan : 'rgba(255,255,255,0.3)'}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Password Strength Meter */}
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
                        {!!errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}

                        {/* Confirm Password */}
                        <Input
                            value={formData.password_confirmation}
                            onChangeText={v => updateField('password_confirmation', v)}
                            placeholder="Confirm Password"
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

                        {/* ── Terms & Privacy ───────────────────────────────────
                            CHANGED: Wrapped "Terms" and "Privacy Policy" in
                            Text with onPress → openLegal().
                            WHY: Tapping opens the web legal page in the device
                            browser via Linking.openURL() — React Native standard.
                        ─────────────────────────────────────────────────────── */}
                        <Text style={styles.termsText}>
                            By signing up you agree to our{' '}
                            <Text
                                style={styles.termsLink}
                                onPress={() => openLegal('terms')}
                            >
                                Terms
                            </Text>
                            {' '}and{' '}
                            <Text
                                style={styles.termsLink}
                                onPress={() => openLegal('privacy')}
                            >
                                Privacy Policy
                            </Text>.
                        </Text>

                        {/* Create Account Button */}
                        <TouchableOpacity
                            onPress={handleRegister}
                            disabled={isLoading}
                            activeOpacity={0.88}
                            style={[styles.btnCreate, isLoading && styles.btnDisabled]}
                        >
                            {isLoading
                                ? <ActivityIndicator color="#07080f" />
                                : <Text style={styles.btnCreateText}>Create account</Text>
                            }
                        </TouchableOpacity>

                        {/* Sign In Link */}
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

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safeArea:         { flex: 1, backgroundColor: COLORS.bg },
    flex:             { flex: 1 },
    overlay:          { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(7,8,15,0.55)' },
    scrollContent:    { flexGrow: 1, paddingHorizontal: 28, paddingTop: 16, paddingBottom: 40, minHeight: H, justifyContent: 'center' },
    backBtn:          { position: 'absolute', top: 16, left: 28, zIndex: 10, padding: 4 },
    brandSection:     { alignItems: 'center', marginBottom: 32 },
    brandName:        { fontFamily: 'Syne_700Bold', fontSize: 20, fontWeight: '700', color: '#f1f5f9', letterSpacing: -0.3, marginBottom: 20 },
    brandWelcome:     { fontFamily: 'Syne_700Bold', fontSize: 22, fontWeight: '800', color: '#ffffff', letterSpacing: 1.5, textTransform: 'uppercase', textAlign: 'center', marginBottom: 6 },
    brandSub:         { fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: '300', textAlign: 'left' },
    formSection:      { width: '100%' },
    inputWrap:        { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 16, height: 56, marginBottom: 14, backgroundColor: 'rgba(255,255,255,0.04)' },
    inputWrapNoMb:    { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 16, height: 56, marginBottom: 14, backgroundColor: 'rgba(255,255,255,0.04)' },
    inputWrapFocused: { borderColor: COLORS.cyan, backgroundColor: 'rgba(34,211,238,0.04)' },
    inputIcon:        { marginRight: 12 },
    input:            { flex: 1, fontSize: 16, color: '#ffffff', paddingVertical: 0 },
    eyeBtn:           { paddingLeft: 10 },
    errorAlert:       { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.errorBg, borderLeftWidth: 3, borderLeftColor: COLORS.error, borderRadius: 10, padding: 14, marginBottom: 16 },
    errorAlertText:   { flex: 1, fontSize: 13, color: COLORS.error, fontWeight: '500' },
    fieldError:       { fontSize: 12, color: COLORS.error, marginTop: -8, marginBottom: 10, marginLeft: 4 },
    termsText:        { fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 20, marginBottom: 24, marginTop: 4 },
    termsLink:        { color: '#ffffff', fontWeight: '700' },
    btnCreate:        { height: 56, backgroundColor: '#ffffff', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    btnDisabled:      { opacity: 0.6 },
    btnCreateText:    { fontFamily: 'Syne_700Bold', fontSize: 15, fontWeight: '700', color: '#07080f', letterSpacing: 0.3 },
    loginRow:         { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    loginPrompt:      { fontSize: 14, color: 'rgba(255,255,255,0.4)' },
    loginLink:        { fontFamily: 'Syne_700Bold', fontSize: 14, color: '#ffffff', fontWeight: '700' },
    reqContainer:     { paddingVertical: 10, paddingHorizontal: 4, marginBottom: 14, gap: 6 },
    reqRow:           { flexDirection: 'row', alignItems: 'center', gap: 8 },
    reqDot:           { width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.25)' },
    reqText:          { fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: '400' },
    reqTextMet:       { color: '#22c55e', fontWeight: '500' },
});

export default RegisterScreen;