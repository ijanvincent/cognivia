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
import AuthInput from '../components/AuthInput';
import { COLORS } from '../theme';
import api from '../services/api';

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
            // Always show success — prevents email enumeration
        } finally {
            setLoading(false);
            setSuccess(true);
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
                    {/* Back */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={20} color={COLORS.textSecondary} />
                        <Text style={styles.backText}>Back to Sign In</Text>
                    </TouchableOpacity>

                    {/* Brand */}
                    <View style={styles.brandSection}>
                        <LinearGradient
                            colors={[COLORS.cyan, COLORS.pink]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.accentBar}
                        />
                        <Text style={styles.brandName}>CogniVia</Text>
                        <Text style={styles.brandTagline}>Reset your password securely.</Text>
                    </View>

                    {/* Card */}
                    <View style={styles.card}>

                        <View style={styles.cardHeader}>
                            <View style={styles.cardIconWrap}>
                                <MaterialCommunityIcons name="lock-reset" size={22} color={COLORS.cyan} />
                            </View>
                            <View>
                                <Text style={styles.cardTitle}>Forgot password?</Text>
                                <Text style={styles.cardSubtitle}>We'll send you a reset link</Text>
                            </View>
                        </View>

                        {success ? (
                            <View style={styles.successAlert}>
                                <MaterialCommunityIcons name="check-circle-outline" size={20} color={COLORS.successBorder} />
                                <Text style={styles.successText}>
                                    If that email is registered, a reset link has been sent. Check your inbox.
                                </Text>
                            </View>
                        ) : (
                            <>
                                {!!error && (
                                    <View style={styles.errorAlert}>
                                        <MaterialCommunityIcons name="alert-circle-outline" size={16} color={COLORS.error} />
                                        <Text style={styles.errorAlertText}>{error}</Text>
                                    </View>
                                )}

                                <AuthInput
                                    label="Email Address"
                                    value={email}
                                    onChangeText={(v) => { setEmail(v); setError(''); }}
                                    placeholder="you@example.com"
                                    keyboardType="email-address"
                                    icon="email-outline"
                                    error={error}
                                    editable={!isLoading}
                                />

                                <TouchableOpacity
                                    onPress={handleSubmit}
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
                                            : <Text style={styles.submitText}>Send Reset Link</Text>
                                        }
                                    </LinearGradient>
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

const styles = StyleSheet.create({
    safeArea:       { flex: 1, backgroundColor: COLORS.bg },
    flex:           { flex: 1 },
    scrollContent:  { flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 },
    backButton:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 40 },
    backText:       { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
    brandSection:   { marginBottom: 36 },
    accentBar:      { width: 48, height: 3, borderRadius: 2, marginBottom: 28 },
    brandName:      { fontSize: 36, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -1.5, marginBottom: 10 },
    brandTagline:   { fontSize: 16, lineHeight: 26, color: COLORS.textSecondary, fontWeight: '300' },
    card:           { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.bgCardBorder, borderRadius: 24, padding: 28 },
    cardHeader:     { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28 },
    cardIconWrap:   { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(34,211,238,0.08)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(34,211,238,0.15)' },
    cardTitle:      { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: -0.5 },
    cardSubtitle:   { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
    successAlert:   { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: COLORS.successBg, borderLeftWidth: 3, borderLeftColor: COLORS.successBorder, borderRadius: 10, padding: 16, marginBottom: 24 },
    successText:    { flex: 1, fontSize: 14, color: COLORS.successBorder, fontWeight: '500', lineHeight: 22 },
    errorAlert:     { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.errorBg, borderLeftWidth: 3, borderLeftColor: COLORS.error, borderRadius: 10, padding: 14, marginBottom: 20 },
    errorAlertText: { flex: 1, fontSize: 13, color: COLORS.error, fontWeight: '500' },
    submitWrapper:  { borderRadius: 12, overflow: 'hidden', marginBottom: 24 },
    submitButton:   { height: 52, alignItems: 'center', justifyContent: 'center' },
    submitDisabled: { opacity: 0.6 },
    submitText:     { fontSize: 16, fontWeight: '700', color: '#07080f', letterSpacing: 0.3 },
    loginRow:       { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
    loginPrompt:    { fontSize: 13, color: COLORS.textMuted },
    loginLink:      { fontSize: 13, color: COLORS.cyan, fontWeight: '700' },
});

export default ForgotPasswordScreen;