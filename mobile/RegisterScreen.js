import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, ActivityIndicator,
    StyleSheet, KeyboardAvoidingView, Platform,
    ScrollView, TextInput, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from './components/AuthInput';
import api from './services/api';

const { height: H } = Dimensions.get('window');

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

const Input = ({ value, onChangeText, placeholder, secureTextEntry,
    keyboardType, icon, rightIcon, onRightIconPress, editable, autoCapitalize }) => {
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
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
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
        } else if (formData.password.length < 8) {
            e.password = 'Password must be at least 8 characters.';
        }
        if (!formData.password_confirmation) {
            e.password_confirmation = 'Please confirm your password.';
        } else if (formData.password !== formData.password_confirmation) {
            e.password_confirmation = 'Passwords do not match.';
        }
        return e;
    };

    const handleRegister = async () => {
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
                    {/* Back button — CHANGED: goBack() → navigate('Login') */}
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

                        <Input
                            value={formData.username}
                            onChangeText={v => updateField('username', v)}
                            placeholder="Username"
                            icon="account-outline"
                            editable={!isLoading}
                        />
                        {!!errors.username && <Text style={styles.fieldError}>{errors.username}</Text>}

                        <Input
                            value={formData.email}
                            onChangeText={v => updateField('email', v)}
                            placeholder="Email"
                            keyboardType="email-address"
                            icon="email-outline"
                            editable={!isLoading}
                        />
                        {!!errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}

                        <Input
                            value={formData.password}
                            onChangeText={v => updateField('password', v)}
                            placeholder="Password"
                            secureTextEntry={!showPassword}
                            icon="lock-outline"
                            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            onRightIconPress={() => setShowPassword(p => !p)}
                            editable={!isLoading}
                        />
                        {!!errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}

                        <Input
                            value={formData.password_confirmation}
                            onChangeText={v => updateField('password_confirmation', v)}
                            placeholder="Confirm Password"
                            secureTextEntry={!showConfirmPassword}
                            icon="lock-check-outline"
                            rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                            onRightIconPress={() => setShowConfirmPassword(p => !p)}
                            editable={!isLoading}
                        />
                        {!!errors.password_confirmation && (
                            <Text style={styles.fieldError}>{errors.password_confirmation}</Text>
                        )}

                        <Text style={styles.termsText}>
                            By signing up you agree to our{' '}
                            <Text style={styles.termsLink}>Terms</Text>
                            {' '}and{' '}
                            <Text style={styles.termsLink}>Privacy Policy</Text>.
                        </Text>

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

const styles = StyleSheet.create({
    safeArea:         { flex: 1, backgroundColor: COLORS.bg },
    flex:             { flex: 1 },
    overlay:          { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(7,8,15,0.55)' },
    scrollContent:    { flexGrow: 1, paddingHorizontal: 28, paddingTop: 16, paddingBottom: 40, minHeight: H, justifyContent: 'center' },
    backBtn:          { position: 'absolute', top: 16, left: 28, zIndex: 10, padding: 4 },
    brandSection:     { alignItems: 'flex-start', marginBottom: 32 },
    brandName:        { fontFamily: 'Syne_700Bold', fontSize: 20, fontWeight: '700', color: '#f1f5f9', letterSpacing: -0.3, marginBottom: 20 },
    brandWelcome:     { fontFamily: 'Syne_700Bold', fontSize: 22, fontWeight: '800', color: '#ffffff', letterSpacing: 1.5, textTransform: 'uppercase', textAlign: 'center', marginBottom: 6 },
    brandSub:         { fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: '300', textAlign: 'left' },
    formSection:      { width: '100%' },
    inputWrap:        { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 16, height: 56, marginBottom: 14, backgroundColor: 'rgba(255,255,255,0.04)' },
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
});

export default RegisterScreen;