import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, ActivityIndicator,
    StyleSheet, StatusBar, KeyboardAvoidingView,
    Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthInput from './components/AuthInput';
import { COLORS } from './theme';
import api from './services/api';

const LoginScreen = () => {
    const navigation = useNavigation();

    const [formData, setFormData]         = useState({ email: '', password: '' });
    const [errors, setErrors]             = useState({});
    const [isLoading, setIsLoading]       = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field])   setErrors(prev => ({ ...prev, [field]: null }));
        if (errors.general)  setErrors(prev => ({ ...prev, general: null }));
    };

    const validate = () => {
        const e = {};
        if (!formData.email.trim())    e.email    = 'Email is required.';
        if (!formData.password.trim()) e.password = 'Password is required.';
        return e;
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
                        <LinearGradient
                            colors={[COLORS.cyan, COLORS.pink]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.accentBar}
                        />
                        <Text style={styles.brandName}>CogniVia</Text>
                        <Text style={styles.brandTagline}>
                            Intelligent <Text style={styles.brandAccent}>Clarity.</Text>
                            {'\n'}Your AI learning companion.
                        </Text>
                    </View>

                    {/* ── Card ── */}
                    <View style={styles.card}>

                        <View style={styles.cardHeader}>
                            <View style={styles.cardIconWrap}>
                                <MaterialCommunityIcons name="brain" size={22} color={COLORS.cyan} />
                            </View>
                            <View>
                                <Text style={styles.cardTitle}>Welcome back</Text>
                                <Text style={styles.cardSubtitle}>Sign in to continue learning</Text>
                            </View>
                        </View>

                        {/* General error */}
                        {!!errors.general && (
                            <View style={styles.errorAlert}>
                                <MaterialCommunityIcons name="alert-circle-outline" size={16} color={COLORS.error} />
                                <Text style={styles.errorAlertText}>{errors.general}</Text>
                            </View>
                        )}

                        <AuthInput
                            label="Email Address"
                            value={formData.email}
                            onChangeText={v => updateField('email', v)}
                            placeholder="you@example.com"
                            keyboardType="email-address"
                            icon="email-outline"
                            error={errors.email}
                            editable={!isLoading}
                        />

                        <AuthInput
                            label="Password"
                            value={formData.password}
                            onChangeText={v => updateField('password', v)}
                            placeholder="Enter your password"
                            secureTextEntry={!showPassword}
                            icon="lock-outline"
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
                            activeOpacity={0.85}
                            style={styles.submitWrapper}
                        >
                            <LinearGradient
                                colors={[COLORS.cyan, COLORS.purple]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.submitButton, isLoading && styles.submitDisabled]}
                            >
                                {isLoading
                                    ? <ActivityIndicator color="#07080f" />
                                    : <Text style={styles.submitText}>Sign In</Text>
                                }
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Register */}
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

const styles = StyleSheet.create({
    safeArea:              { flex: 1, backgroundColor: COLORS.bg },
    flex:                  { flex: 1 },
    scrollContent:         { flexGrow: 1, paddingHorizontal: 24, paddingTop: 52, paddingBottom: 32 },

    // Brand
    brandSection:          { marginBottom: 36 },
    accentBar:             { width: 48, height: 3, borderRadius: 2, marginBottom: 28 },
    brandName:             { fontSize: 36, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -1.5, marginBottom: 10 },
    brandTagline:          { fontSize: 16, lineHeight: 26, color: COLORS.textSecondary, fontWeight: '300' },
    brandAccent:           { color: COLORS.cyan, fontWeight: '700' },

    // Card
    card:                  { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.bgCardBorder, borderRadius: 24, padding: 28 },
    cardHeader:            { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28 },
    cardIconWrap:          { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(34,211,238,0.08)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(34,211,238,0.15)' },
    cardTitle:             { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: -0.5 },
    cardSubtitle:          { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },

    // Error
    errorAlert:            { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.errorBg, borderLeftWidth: 3, borderLeftColor: COLORS.error, borderRadius: 10, padding: 14, marginBottom: 20 },
    errorAlertText:        { flex: 1, fontSize: 13, color: COLORS.error, fontWeight: '500' },

    // Actions
    forgotRow:             { alignItems: 'flex-end', marginTop: -8, marginBottom: 28 },
    forgotLink:            { fontSize: 13, color: COLORS.cyan, fontWeight: '500' },
    submitWrapper:         { borderRadius: 12, overflow: 'hidden', marginBottom: 24 },
    submitButton:          { height: 52, alignItems: 'center', justifyContent: 'center' },
    submitDisabled:        { opacity: 0.6 },
    submitText:            { fontSize: 16, fontWeight: '700', color: '#07080f', letterSpacing: 0.3 },

    // Divider
    divider:               { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
    dividerLine:           { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
    dividerText:           { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },

    // Register
    registerRow:           { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    registerPrompt:        { fontSize: 13, color: COLORS.textMuted },
    registerLink:          { fontSize: 13, color: COLORS.cyan, fontWeight: '700' },
});

export default LoginScreen;