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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 

    const navigation = useNavigation();

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        if (name.length <= 2) {
            Alert.alert('Error', 'Name must be more than 2 characters.');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters.');
            return;
        }

        setLoading(true);

        try {
            // Create user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update user profile with display name
            await updateProfile(user, {
                displayName: name
            });

            // Create user document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                email: email,
                createdAt: new Date().toISOString(),
                theme: 'light',
                notifications: true
            });

            Alert.alert('Success', 'Registration complete! You can now log in.');
            navigation.replace('Login');

        } catch (error) {
            console.error('Registration Error:', error);
            
            let errorMessage = 'Could not register. Please try again.';
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection.';
            }
            
            Alert.alert('Registration Failed', errorMessage);
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

                <Text style={styles.welcomeText}>Create Account</Text>

                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={name}
                        onChangeText={setName}
                        keyboardType="default"
                        editable={!isLoading}
                    />
                </View>
                
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
                        <MaterialCommunityIcons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#777" />
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
                        <Text style={styles.registerButtonText}>Register</Text>
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