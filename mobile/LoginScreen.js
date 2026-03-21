import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    ActivityIndicator, StyleSheet, StatusBar,
    KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './services/api';

// ── Constants ─────────────────────────────────────────────────
const COLORS = {
    bg:           '#07080f',
    bgCard:       'rgba(255,255,255,0.04)',
    bgCardBorder: 'rgba(255,255,255,0.09)',
    inputBg:      'rgba(255,255,255,0.05)',
    inputBorder:  'rgba(255,255,255,0.10)',
    inputFocus:   'rgba(34,211,238,0.45)',
    cyan:         '#22d3ee',
    pink:         '#e879f9',
    purple:       '#a855f7',
    textPrimary:  '#f1f5f9',
    textSecondary:'rgba(241,245,249,0.55)',
    textMuted:    'rgba(241,245,249,0.35)',
    error:        '#f87171',
    errorBg:      'rgba(248,113,113,0.08)',
};

// ── Gradient accent bar ───────────────────────────────────────
const AccentBar = () => (
    <LinearGradient
        colors={[COLORS.cyan, COLORS.pink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.accentBar}
    />
);

// ── Input field ───────────────────────────────────────────────
const InputField = ({
    label, value, onChangeText, placeholder,
    secureTextEntry, keyboardType, autoCapitalize,
    rightIcon, onRightIconPress, error, editable,
}) => {
    const [focused, setFocused] = useState(false);

    return (
        <View style={styles.formGroup}>
            <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
            <View style={[
                styles.inputContainer,
                focused  && styles.inputContainerFocused,
                !!error  && styles.inputContainerError,
            ]}>
                <TextInput
                    style={styles.inputField}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.textMuted}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize || 'none'}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    editable={editable !== false}
                    autoCorrect={false}
                />
                {rightIcon && (
                    <TouchableOpacity
                        onPress={onRightIconPress}
                        style={styles.eyeButton}
                        disabled={editable === false}
                    >
                        <MaterialCommunityIcons
                            name={rightIcon}
                            size={18}
                            color={focused ? COLORS.cyan : COLORS.textMuted}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

// ── Main Screen ───────────────────────────────────────────────
const LoginScreen = () => {
    const navigation = useNavigation();

    const [formData, setFormData]         = useState({ email: '', password: '' });
    const [errors, setErrors]             = useState({});
    const [isLoading, setIsLoading]       = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
        if (errors.general) setErrors(prev => ({ ...prev, general: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email.trim())    newErrors.email    = 'Email is required';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        return newErrors;
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
                email:    formData.email.trim(),
                password: formData.password,
            });

            await AsyncStorage.setItem('token', response.data.token);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

            navigation.replace('HomeTabs');

        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 422) {
                setErrors({ general: 'Invalid email or password.' });
            } else if (error.message === 'Network Error') {
                setErrors({ general: 'Cannot connect to server. Check your connection.' });
            } else {
                setErrors({ general: 'Login failed. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* ── Brand ── */}
                    <View style={styles.brandSection}>
                        <AccentBar />
                        <Text style={styles.brandName}>CogniVia</Text>
                        <Text style={styles.brandTagline}>
                            Your AI learning companion —{'\n'}turning knowledge into a game.
                        </Text>
                    </View>

                    {/* ── Card ── */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Welcome back</Text>
                        <Text style={styles.cardSubtitle}>Sign in to your account to continue</Text>

                        {/* General error */}
                        {!!errors.general && (
                            <View style={styles.errorAlert}>
                                <MaterialCommunityIcons name="alert-circle" size={15} color={COLORS.error} />
                                <Text style={styles.errorAlertText}>{errors.general}</Text>
                            </View>
                        )}

                        {/* Email */}
                        <InputField
                            label="EMAIL ADDRESS"
                            value={formData.email}
                            onChangeText={v => updateField('email', v)}
                            placeholder="you@example.com"
                            keyboardType="email-address"
                            error={errors.email}
                            editable={!isLoading}
                        />

                        {/* Password */}
                        <InputField
                            label="PASSWORD"
                            value={formData.password}
                            onChangeText={v => updateField('password', v)}
                            placeholder="Enter your password"
                            secureTextEntry={!showPassword}
                            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            onRightIconPress={() => setShowPassword(p => !p)}
                            error={errors.password}
                            editable={!isLoading}
                        />

                        {/* Forgot password */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ForgotPassword')}
                            disabled={isLoading}
                            style={styles.forgotRow}
                        >
                            <Text style={styles.forgotLink}>Forgot password?</Text>
                        </TouchableOpacity>

                        {/* Submit */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={isLoading}
                            style={styles.submitWrapper}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={[COLORS.cyan, COLORS.purple]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.submitButton, isLoading && styles.submitDisabled]}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#07080f" />
                                ) : (
                                    <Text style={styles.submitText}>Sign In</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Register link */}
                        <View style={styles.registerRow}>
                            <Text style={styles.registerPrompt}>Don't have an account? </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Register')}
                                disabled={isLoading}
                            >
                                <Text style={styles.registerLink}>Register here</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safeArea:               { flex: 1, backgroundColor: COLORS.bg },
    flex:                   { flex: 1 },
    scrollContent:          { flexGrow: 1, paddingHorizontal: 24, paddingTop: 48, paddingBottom: 32 },

    // Brand
    brandSection:           { marginBottom: 40 },
    accentBar:              { width: 48, height: 3, borderRadius: 2, marginBottom: 24 },
    brandName:              { fontSize: 32, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -1, marginBottom: 12 },
    brandTagline:           { fontSize: 15, lineHeight: 24, color: COLORS.textSecondary, fontWeight: '300' },

    // Card
    card:                   { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.bgCardBorder, borderRadius: 20, padding: 28 },
    cardTitle:              { fontSize: 24, fontWeight: '600', color: COLORS.textPrimary, letterSpacing: -0.5, marginBottom: 6 },
    cardSubtitle:           { fontSize: 14, color: COLORS.textSecondary, marginBottom: 24 },

    // Error alert
    errorAlert:             { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.errorBg, borderLeftWidth: 3, borderLeftColor: COLORS.error, borderRadius: 8, padding: 12, marginBottom: 20 },
    errorAlertText:         { flex: 1, fontSize: 13, color: COLORS.error, fontWeight: '500' },

    // Form
    formGroup:              { marginBottom: 20 },
    label:                  { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
    labelFocused:           { color: COLORS.cyan },
    inputContainer:         { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderWidth: 1, borderColor: COLORS.inputBorder, borderRadius: 10, paddingHorizontal: 14, height: 50 },
    inputContainerFocused:  { borderColor: COLORS.inputFocus, backgroundColor: 'rgba(34,211,238,0.03)' },
    inputContainerError:    { borderColor: 'rgba(248,113,113,0.5)', backgroundColor: COLORS.errorBg },
    inputField:             { flex: 1, fontSize: 15, color: COLORS.textPrimary, paddingVertical: 0 },
    eyeButton:              { paddingLeft: 10 },
    errorText:              { fontSize: 12, color: COLORS.error, fontWeight: '500', marginTop: 6 },

    // Actions
    forgotRow:              { alignItems: 'flex-end', marginTop: -8, marginBottom: 24 },
    forgotLink:             { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
    submitWrapper:          { borderRadius: 10, overflow: 'hidden', marginBottom: 24 },
    submitButton:           { height: 50, alignItems: 'center', justifyContent: 'center' },
    submitDisabled:         { opacity: 0.6 },
    submitText:             { fontSize: 15, fontWeight: '700', color: '#07080f', letterSpacing: 0.3 },

    // Register
    registerRow:            { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
    registerPrompt:         { fontSize: 13, color: COLORS.textMuted },
    registerLink:           { fontSize: 13, color: COLORS.cyan, fontWeight: '600' },
});

export default LoginScreen;