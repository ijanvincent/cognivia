import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, ActivityIndicator,
    StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
    TextInput, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../components/AuthInput';
import api from '../services/api';

const { height: H } = Dimensions.get('window');

// ── Wave background ───────────────────────────────────────────
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

// ── Input ─────────────────────────────────────────────────────
const Input = ({ value, onChangeText, placeholder, keyboardType, icon, editable }) => {
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
                keyboardType={keyboardType || 'default'}
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                editable={editable !== false}
            />
        </View>
    );
};

// ── Main ──────────────────────────────────────────────────────
const ForgotPasswordScreen = () => {
    const navigation            = useNavigation();
    const [email, setEmail]     = useState('');
    const [error, setError]     = useState('');
    const [success, setSuccess] = useState(false);
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
                    {/* Back */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backBtn}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={22} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>

                    {/* Brand */}
                    <View style={styles.brandSection}>
                        <Text style={styles.brandSub}>
                            Provide email and we'll send you a reset link.
                        </Text>
                    </View>

                    {/* Form */}
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
                                        <MaterialCommunityIcons name="alert-circle-outline" size={16} color={COLORS.error} />
                                        <Text style={styles.errorAlertText}>{error}</Text>
                                    </View>
                                )}

                                <Input
                                    value={email}
                                    onChangeText={(v) => { setEmail(v); setError(''); }}
                                    placeholder="Email"
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

const styles = StyleSheet.create({
    safeArea:       { flex: 1, backgroundColor: COLORS.bg },
    flex:           { flex: 1 },
    overlay:        { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(7,8,15,0.55)' },
    scrollContent:  {
        flexGrow:          1,
        paddingHorizontal: 28,
        paddingTop:        16,
        paddingBottom:     40,
        justifyContent:    'center',
        minHeight:         H,
    },

    // Back
    backBtn:        { position: 'absolute', top: 16, left: 28, zIndex: 10, padding: 4 },

    // Brand
    brandSection:   { alignItems: 'flex-start', marginBottom: 32 },
    brandName:      {
        fontFamily:    'Syne_700Bold',
        fontSize:      20,
        fontWeight:    '700',
        color:         '#f1f5f9',
        letterSpacing: -0.3,
        marginBottom:  20,
    },
    brandWelcome:   {
        fontFamily:    'Syne_700Bold',
        fontSize:      26,
        fontWeight:    '700',
        color:         '#ffffff',
        letterSpacing: -0.3,
        marginBottom:  6,
    },
    brandSub:       {
        fontSize:      14,
        color:         'rgba(255,255,255,0.45)',
        fontWeight:    '300',
    },

    // Form
    formSection:    { width: '100%' },
    inputWrap:      {
        flexDirection:     'row',
        alignItems:        'center',
        borderWidth:       1,
        borderColor:       'rgba(255,255,255,0.15)',
        borderRadius:      12,
        paddingHorizontal: 16,
        height:            56,
        marginBottom:      14,
        backgroundColor:   'rgba(255,255,255,0.04)',
    },
    inputWrapFocused: {
        borderColor:       COLORS.cyan,
        backgroundColor:   'rgba(34,211,238,0.04)',
    },
    inputIcon:      { marginRight: 12 },
    input:          { flex: 1, fontSize: 16, color: '#ffffff', paddingVertical: 0 },

    // Alerts
    successAlert:   { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: COLORS.successBg, borderLeftWidth: 3, borderLeftColor: COLORS.successBorder, borderRadius: 10, padding: 16, marginBottom: 24 },
    successText:    { flex: 1, fontSize: 14, color: COLORS.successBorder, fontWeight: '500', lineHeight: 22 },
    errorAlert:     { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.errorBg, borderLeftWidth: 3, borderLeftColor: COLORS.error, borderRadius: 10, padding: 14, marginBottom: 16 },
    errorAlertText: { flex: 1, fontSize: 13, color: COLORS.error, fontWeight: '500' },

    // Button
    btnSubmit:      { height: 56, backgroundColor: '#ffffff', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    btnDisabled:    { opacity: 0.6 },
    btnSubmitText:  { fontFamily: 'Syne_700Bold', fontSize: 15, fontWeight: '700', color: '#07080f', letterSpacing: 0.3 },

    // Login row
    loginRow:       { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    loginPrompt:    { fontSize: 14, color: 'rgba(255,255,255,0.4)' },
    loginLink:      { fontFamily: 'Syne_700Bold', fontSize: 14, color: '#ffffff', fontWeight: '700' },
});

export default ForgotPasswordScreen;