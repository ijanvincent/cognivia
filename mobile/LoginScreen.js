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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

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
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert('Success', 'Logged in successfully!');
            navigation.replace('HomeTabs');
        } catch (error) {
            console.error('Login Error:', error);
            
            let errorMessage = 'Could not log in. Please try again.';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = 'This account has been disabled.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection.';
            }
            
            Alert.alert('Login Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>Flash<Text style={styles.logoGenius}>Genius</Text></Text>
                </View>

                <Text style={styles.welcomeText}>Welcome Back!</Text>

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
                        <Text style={styles.showText}>Show</Text>
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
    logoGenius: {
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
    },
    showText: {
        fontSize: 14,
        color: '#777',
        marginRight: 5,
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