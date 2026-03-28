import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, ActivityIndicator,
    StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
    TextInput, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../components/AuthInput';
import api from '../services/api';

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


const PasswordInput = ({ value, onChangeText, placeholder, icon, editable }) => {
    const [focused, setFocused] = useState(false);
    const [visible, setVisible] = useState(false);
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
                secureTextEntry={!visible}
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                editable={editable !== false}
            />
            <TouchableOpacity onPress={() => setVisible(v => !v)} style={styles.eyeBtn}>
                <MaterialCommunityIcons
                    name={visible ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="rgba(255,255,255,0.3)"
                />
            </TouchableOpacity>
        </View>
    );
};

const ResetPasswordScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

  
    const token = route.params?.token ?? '';
    const email = route.params?.email ?? '';

    const [password, setPassword]           = useState('');
    const [confirmPassword, setConfirm]     = useState('');
    const [error, setError]                 = useState('');
    const [success, setSuccess]             = useState(false);
    const [isLoading, setLoading]           = useState(false);

    const validate = () => {
        if (!password) return 'Password is required.';
        if (password.length < 8) return 'Password must be at least 8 characters.';
        if (password !== confirmPassword) return 'Passwords do not match.';
        if (!token) return 'Invalid or missing reset token.';
        if (!email) return 'Invalid or missing email.';
        return null;
    };

    const handleSubmit = async () => {
        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        setLoading(true);
        setError('');
        try {
            await api.post('/auth/reset-password', {
                token,
                email,
                password,
                password_confirmation: confirmPassword,
            });
            setSuccess(true);
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                'Something went wrong. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
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
                 
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        style={styles.backBtn}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={22} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>

                 
                    <View style={styles.brandSection}>
                        <Text style={styles.brandSub}>
                            Enter your new password below.
                        </Text>
                    </View>

                  
                    <View style={styles.formSection}>

                        {success ? (
                            <>
                                <View style={styles.successAlert}>
                                    <MaterialCommunityIcons
                                        name="check-circle-outline"
                                        size={20}
                                        color={COLORS.successBorder}
                                    />
                                    <Text style={styles.successText}>
                                        Your password has been reset successfully.
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Login')}
                                    activeOpacity={0.88}
                                    style={styles.btnSubmit}
                                >
                                    <Text style={styles.btnSubmitText}>Back to Sign In</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                {!!error && (
                                    <View style={styles.errorAlert}>
                                        <MaterialCommunityIcons name="alert-circle-outline" size={16} color={COLORS.error} />
                                        <Text style={styles.errorAlertText}>{error}</Text>
                                    </View>
                                )}

                                <PasswordInput
                                    value={password}
                                    onChangeText={(v) => { setPassword(v); setError(''); }}
                                    placeholder="New password"
                                    icon="lock-outline"
                                    editable={!isLoading}
                                />

                                <PasswordInput
                                    value={confirmPassword}
                                    onChangeText={(v) => { setConfirm(v); setError(''); }}
                                    placeholder="Confirm new password"
                                    icon="lock-check-outline"
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
                                        : <Text style={styles.btnSubmitText}>Reset Password</Text>
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

  
    backBtn:        { position: 'absolute', top: 16, left: 28, zIndex: 10, padding: 4 },

    brandSection:   { alignItems: 'flex-start', marginBottom: 32 },
    brandSub:       {
        fontSize:   14,
        color:      'rgba(255,255,255,0.45)',
        fontWeight: '300',
    },


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
        borderColor:     COLORS.cyan,
        backgroundColor: 'rgba(34,211,238,0.04)',
    },
    inputIcon:      { marginRight: 12 },
    input:          { flex: 1, fontSize: 16, color: '#ffffff', paddingVertical: 0 },
    eyeBtn:         { padding: 4 },

 
    successAlert:   { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: COLORS.successBg, borderLeftWidth: 3, borderLeftColor: COLORS.successBorder, borderRadius: 10, padding: 16, marginBottom: 24 },
    successText:    { flex: 1, fontSize: 14, color: COLORS.successBorder, fontWeight: '500', lineHeight: 22 },
    errorAlert:     { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.errorBg, borderLeftWidth: 3, borderLeftColor: COLORS.error, borderRadius: 10, padding: 14, marginBottom: 16 },
    errorAlertText: { flex: 1, fontSize: 13, color: COLORS.error, fontWeight: '500' },
   
    btnSubmit:      { height: 56, backgroundColor: '#ffffff', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    btnDisabled:    { opacity: 0.6 },
    btnSubmitText:  { fontFamily: 'Syne_700Bold', fontSize: 15, fontWeight: '700', color: '#07080f', letterSpacing: 0.3 },

  
    loginRow:       { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    loginPrompt:    { fontSize: 14, color: 'rgba(255,255,255,0.4)' },
    loginLink:      { fontFamily: 'Syne_700Bold', fontSize: 14, color: '#ffffff', fontWeight: '700' },
});

export default ResetPasswordScreen;