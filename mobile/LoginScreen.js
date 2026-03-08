import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './services/api';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email,
                password,
            });

            // Save token and user to AsyncStorage
            await AsyncStorage.setItem('token', response.data.token);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

            navigation.replace('HomeTabs');

        } catch (error) {
            console.error('Login Error:', error);
            console.error('Error Response:', JSON.stringify(error.response?.data));

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const firstError = Object.values(errors)[0][0];
                Alert.alert('Login Failed', firstError);
            } else if (error.response?.data?.message) {
                Alert.alert('Login Failed', error.response.data.message);
            } else if (error.message === 'Network Error') {
                Alert.alert('Login Failed', 'Cannot connect to server. Check your connection.');
            } else {
                Alert.alert('Login Failed', 'Could not log in. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>Cogni<Text style={styles.logoAccent}>via</Text></Text>
                </View>

                <Text style={styles.welcomeText}>Welcome Back!</Text>

                {/* Email */}
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!isLoading}
                    />
                </View>

                {/* Password */}
                <View style={[styles.inputWrapper, styles.passwordWrapper]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        editable={!isLoading}
                    />
                    <TouchableOpacity
                        style={styles.showButton}
                        onPress={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                    >
                        <MaterialCommunityIcons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color="#777"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.loginButtonText}>Login</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Don't have an account?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Register')}
                        disabled={isLoading}
                    >
                        <Text style={styles.registerLink}> Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: '20%',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 50,
    },
    logoText: {
        fontSize: 30,
        fontWeight: '900',
        color: '#000000',
    },
    logoAccent: {
        color: '#2A5DFF',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 60,
        marginBottom: 40,
        textAlign: 'center',
    },
    inputWrapper: {
        backgroundColor: '#F7F7F7',
        borderRadius: 10,
        marginBottom: 20,
        height: 55,
        justifyContent: 'center',
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    input: {
        flex: 1,
        fontSize: 16,
        padding: 0,
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    showButton: {
        paddingLeft: 10,
    },
    loginButton: {
        backgroundColor: '#2A5DFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignSelf: 'center',
    },
    registerText: {
        fontSize: 14,
        color: '#555',
    },
    registerLink: {
        fontSize: 14,
        color: '#2A5DFF',
        fontWeight: 'bold',
    },
});

export default LoginScreen;