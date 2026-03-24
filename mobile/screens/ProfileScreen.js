import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Switch, Alert, Platform,
    Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';          // CHANGED
import { useTheme } from '../ThemeContext';
import api from '../services/api';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { theme, colors, toggleTheme } = useTheme();
    const isDarkMode = theme === 'dark';

    const [profileImage, setProfileImage] = useState(null);
    const [userData, setUserData]         = useState({
        name: 'Loading...',
        email: 'Loading...',
    });

    // Load user from SecureStore
    useEffect(() => {
        const loadUser = async () => {
            try {
                const userStr = await SecureStore.getItemAsync('user'); // CHANGED
                if (userStr) {
                    const user = JSON.parse(userStr);
                    setUserData({
                        name:  user.username || user.name || 'User',
                        email: user.email || '',
                    });
                    if (user.avatar) setProfileImage(user.avatar);
                }
            } catch (error) {
                console.error('Error loading user:', error);
            }
        };
        loadUser();
    }, []);

    const handleEditProfile = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need camera roll permissions to change your profile picture.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setProfileImage(uri);

            try {
                const formData = new FormData();
                formData.append('avatar', {
                    uri,
                    name: 'avatar.jpg',
                    type: 'image/jpeg',
                });

                const response = await api.post('/auth/profile/update', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                // CHANGED — was AsyncStorage.getItem/setItem
                const userStr = await SecureStore.getItemAsync('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    user.avatar = response.data.user.avatar;
                    await SecureStore.setItemAsync('user', JSON.stringify(user));
                }

                Alert.alert('Success', 'Profile picture updated!');
            } catch (error) {
                console.error('Error updating avatar:', error);
                Alert.alert('Error', 'Could not update profile picture.');
            }
        }
    };

    const handleToggleAppTheme = () => {
        toggleTheme();
        Alert.alert('Theme Change', `App Theme changed to ${!isDarkMode ? 'Dark' : 'Light'} Mode.`);
    };

    const handleAboutUs = () => navigation.navigate('About');

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    onPress: async () => {
                        try {
                            await api.post('/auth/logout');
                        } catch (e) {
                            // ignore logout API errors
                        } finally {
                            await SecureStore.deleteItemAsync('token'); // CHANGED
                            await SecureStore.deleteItemAsync('user');  // CHANGED
                            navigation.replace('Login');
                        }
                    }
                }
            ]
        );
    };

    // ── all JSX and styles unchanged ─────────────────────────
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Your Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.profileInfo}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                    <MaterialCommunityIcons name="account-circle" size={100} color={isDarkMode ? colors.subtext : '#ccc'} />
                )}
                <TouchableOpacity onPress={handleEditProfile} style={[styles.editButton, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.editButtonText, { color: 'black' }]}>Edit</Text>
                </TouchableOpacity>
                <Text style={[styles.userName, { color: colors.text }]}>{userData.name}</Text>
                <Text style={[styles.userEmail, { color: colors.subtext }]}>{userData.email}</Text>
            </View>

            <View style={[styles.settingsSection, { backgroundColor: colors.card, shadowColor: isDarkMode ? '#FFF' : '#000' }]}>
                <TouchableOpacity onPress={handleAboutUs} style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                    <View style={styles.settingItemLeft}>
                        <MaterialCommunityIcons name="information-outline" size={24} color={colors.subtext} style={styles.settingIcon} />
                        <Text style={[styles.settingText, { color: colors.text }]}>About Us</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color={colors.subtext} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleToggleAppTheme} style={[styles.settingItem, { borderBottomWidth: 0 }]}>
                    <View style={styles.settingItemLeft}>
                        <MaterialCommunityIcons name="theme-light-dark" size={24} color={colors.subtext} style={styles.settingIcon} />
                        <Text style={[styles.settingText, { color: colors.text }]}>App Theme</Text>
                    </View>
                    <Switch
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={isDarkMode ? '#FFFFFF' : '#f4f3f4'}
                        onValueChange={handleToggleAppTheme}
                        value={isDarkMode}
                        style={styles.settingSwitch}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton, { backgroundColor: colors.logout }]}>
                <Text style={[styles.logoutButtonText, { color: '#FFFFFF' }]}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container:                  { flex: 1, paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 50 : 30 },
    header:                     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: Platform.OS === 'ios' ? 60 : 40 },
    backButton:                 { padding: 5 },
    headerTitle:                { fontSize: 24, fontWeight: 'bold' },
    profileInfo:                { alignItems: 'center', marginBottom: 30 },
    profileImage:               { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E0E0E0' },
    editButton:                 { position: 'absolute', bottom: 50, right: '35%', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
    editButtonText:             { fontSize: 12, fontWeight: '600' },
    userName:                   { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
    userEmail:                  { fontSize: 16 },
    settingsSection:            { borderRadius: 12, marginBottom: 25, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, paddingVertical: 10 },
    settingItem:                { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1 },
    settingItemLeft:            { flexDirection: 'row', alignItems: 'center', flex: 1 },
    settingIcon:                { marginRight: 15 },
    settingText:                { fontSize: 16, fontWeight: '500' },
    settingSwitch:              { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] },
    logoutButton:               { padding: 15, borderRadius: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
    logoutButtonText:           { fontSize: 18, fontWeight: '600' },
});

export default ProfileScreen;