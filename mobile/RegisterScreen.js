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
import api from './services/api';

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigation = useNavigation();

    const handleRegister = async () => {
        // Frontend validation
        if (!username || !email || !password || !passwordConfirmation) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        if (username.length < 3) {
            Alert.alert('Error', 'Username must be at least 3 characters.');
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            Alert.alert('Error', 'Username can only contain letters, numbers and underscores.');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters.');
            return;
        }

        if (password !== passwordConfirmation) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/register', {
                username,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            Alert.alert('Success', 'Registration complete! You can now log in.');
            navigation.replace('Login');

        } catch (error) {
            console.error('Registration Error:', error);

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const firstError = Object.values(errors)[0][0];
                Alert.alert('Registration Failed', firstError);
            } else if (error.response?.data?.message) {
                Alert.alert('Registration Failed', error.response.data.message);
            } else {
                Alert.alert('Registration Failed', 'Could not register. Please try again.');
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

                <Text style={styles.welcomeText}>Create Account</Text>

                {/* Username */}
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        editable={!isLoading}
                    />
                </View>

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
                        placeholder="Password (min 8 characters)"
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

                {/* Confirm Password */}
                <View style={[styles.inputWrapper, styles.passwordWrapper]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        value={passwordConfirmation}
                        onChangeText={setPasswordConfirmation}
                        secureTextEntry={!showConfirmPassword}
                        editable={!isLoading}
                    />
                    <TouchableOpacity
                        style={styles.showButton}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                    >
                        <MaterialCommunityIcons
                            name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color="#777"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.registerButtonText}>Create Account</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        disabled={isLoading}
                    >
                        <Text style={styles.loginLink}> Login</Text>
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
        paddingTop: '10%',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
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
        marginTop: 20,
        marginBottom: 30,
        textAlign: 'center',
    },
    inputWrapper: {
        backgroundColor: '#F7F7F7',
        borderRadius: 10,
        marginBottom: 15,
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
    registerButton: {
        backgroundColor: '#2A5DFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    registerButtonDisabled: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignSelf: 'center',
    },
    loginText: {
        fontSize: 14,
        color: '#555',
    },
    loginLink: {
        fontSize: 14,
        color: '#2A5DFF',
        fontWeight: 'bold',
    },
});

export default RegisterScreen;