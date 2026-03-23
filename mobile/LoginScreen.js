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
import * as SecureStore from 'expo-secure-store';
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
    keyboardType, icon, rightIcon, onRightIconPress, editable }) => {
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
                autoCapitalize="none"
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

    // ── Extract the most specific error message from the API response ─────────
    const extractErrorMessage = (error) => {
        // Use the exact server message first — covers platform conflicts,
        // "active on web/mobile" notices, and any custom Laravel responses
        if (error.response?.data?.message) {
            return error.response.data.message;
        }
        // Laravel validation errors bag
        if (error.response?.data?.errors) {
            const firstKey = Object.keys(error.response.data.errors)[0];
            return error.response.data.errors[firstKey][0];
        }
        // 401 without a message body
        if (error.response?.status === 401) {
            return 'Invalid email or password.';
        }
        // No network / server unreachable
        if (error.message === 'Network Error') {
            return 'Cannot connect to server. Please check your connection.';
        }
        // Fallback
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
                    {/* Brand */}
                    <View style={styles.brandSection}>
                        <Text style={styles.brandSub}>
                            Sign in to your account to continue
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formSection}>

                        {!!errors.general && (
                            <View style={styles.errorAlert}>
                                <MaterialCommunityIcons
                                    name="alert-circle-outline"
                                    size={16}
                                    color={COLORS.error}
                                />
                                <Text style={styles.errorAlertText}>{errors.general}</Text>
                            </View>
                        )}

                        <Input
                            value={formData.email}
                            onChangeText={v => updateField('email', v)}
                            placeholder="Email"
                            keyboardType="email-address"
                            icon="email-outline"
                            editable={!isLoading}
                        />
                        {!!errors.email && (
                            <Text style={styles.fieldError}>{errors.email}</Text>
                        )}

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
                        {!!errors.password && (
                            <Text style={styles.fieldError}>{errors.password}</Text>
                        )}

                        {/* Forgot */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ForgotPassword')}
                            disabled={isLoading}
                            style={styles.forgotRow}
                        >
                            <Text style={styles.forgotLink}>Forgot your password?</Text>
                        </TouchableOpacity>

                        {/* Sign In */}
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

                        {/* Register */}
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

const styles = StyleSheet.create({
    safeArea:         { flex: 1, backgroundColor: COLORS.bg },
    flex:             { flex: 1 },
    overlay:          { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(7,8,15,0.55)' },
    scrollContent:    { flexGrow: 1, paddingHorizontal: 28, paddingVertical: 40, justifyContent: 'center', minHeight: H },
    brandSection:     { alignItems: 'flex-start', marginBottom: 40 },
    brandName:        { fontFamily: 'Syne_700Bold', fontSize: 20, fontWeight: '700', color: '#f1f5f9', letterSpacing: -0.3, marginBottom: 28 },
    brandWelcome:     { fontFamily: 'Syne_700Bold', fontSize: 26, fontWeight: '700', color: '#ffffff', letterSpacing: -0.3, marginBottom: 6 },
    brandSub:         { fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: '300' },
    formSection:      { width: '100%' },
    inputWrap:        { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 16, height: 56, marginBottom: 14, backgroundColor: 'rgba(255,255,255,0.04)' },
    inputWrapFocused: { borderColor: COLORS.cyan, backgroundColor: 'rgba(34,211,238,0.04)' },
    inputIcon:        { marginRight: 12 },
    input:            { flex: 1, fontSize: 16, color: '#ffffff', paddingVertical: 0 },
    eyeBtn:           { paddingLeft: 10 },
    errorAlert:       { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.errorBg, borderLeftWidth: 3, borderLeftColor: COLORS.error, borderRadius: 10, padding: 14, marginBottom: 16 },
    errorAlertText:   { flex: 1, fontSize: 13, color: COLORS.error, fontWeight: '500' },
    fieldError:       { fontSize: 12, color: COLORS.error, marginTop: -8, marginBottom: 10, marginLeft: 4 },
    forgotRow:        { alignItems: 'flex-end', marginBottom: 24 },
    forgotLink:       { fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecorationLine: 'underline' },
    btnSignIn:        { height: 56, backgroundColor: '#ffffff', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    btnDisabled:      { opacity: 0.6 },
    btnSignInText:    { fontFamily: 'Syne_700Bold', fontSize: 15, fontWeight: '700', color: '#07080f', letterSpacing: 0.3 },
    registerRow:      { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    registerPrompt:   { fontSize: 14, color: 'rgba(255,255,255,0.4)' },
    registerLink:     { fontFamily: 'Syne_700Bold', fontSize: 14, color: '#ffffff', fontWeight: '700' },
});

export default LoginScreen;