import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Switch, Alert, Platform, Image,
    TextInput, ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../ThemeContext';
import { useDecks } from '../DeckContext';
import api from '../services/api';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { theme, colors, toggleTheme } = useTheme();
    const { refreshDecks } = useDecks();
    const isDarkMode = theme === 'dark';

    const [profileImage, setProfileImage] = useState(null);
    const [inputLink, setInputLink]       = useState('');
    const [isImporting, setIsImporting]   = useState(false);
    const [userData, setUserData]         = useState({
        name: 'Loading...',
        email: 'Loading...',
    });

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userStr = await SecureStore.getItemAsync('user');
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
                formData.append('avatar', { uri, name: 'avatar.jpg', type: 'image/jpeg' });
                const response = await api.post('/auth/profile/update', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
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

    const handleInputLink = async () => {
        if (!inputLink.trim()) {
            Alert.alert('Empty Code', 'Please enter a deck code to import.');
            return;
        }
        const shareCodeMatch = inputLink.trim().match(/FC-([A-Z0-9]{8})/i);
        if (shareCodeMatch) {
            await importDeckFromCode(inputLink.trim());
        } else {
            Alert.alert('Invalid Code', 'Please enter a valid deck code (format: FC-XXXXXXXX)');
        }
    };

    const importDeckFromCode = async (shareCode) => {
        setIsImporting(true);
        try {
            const response = await api.post('/decks/import', { shareCode });

            // ✅ Refresh decks in context so home screen updates instantly
            await refreshDecks();

            Alert.alert(
                'Success! 🎉',
                `"${response.data.deck.title}" has been imported with ${response.data.deck.card_count} cards!`,
                [{ text: 'OK', onPress: () => {
                    setInputLink('');
                    navigation.navigate('HomeTabs', { screen: 'Home' });
                }}]
            );
        } catch (error) {
            console.error('Import error:', error);
            const msg = error?.response?.data?.message
                || error?.response?.data?.errors?.share_code?.[0]
                || error.message
                || 'Could not import the deck. Please try again.';
            Alert.alert('Import Failed', msg);
        } finally {
            setIsImporting(false);
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
                        } catch (e) { /* ignore */ } finally {
                            await SecureStore.deleteItemAsync('token');
                            await SecureStore.deleteItemAsync('user');
                            navigation.replace('Login');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
                <View style={{ width: 34 }} />
            </View>

            {/* Avatar + Name */}
            <View style={styles.profileInfo}>
                <View style={styles.avatarWrapper}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                        <View style={[styles.avatarPlaceholder, { backgroundColor: isDarkMode ? '#333' : '#E0E0E0' }]}>
                            <MaterialCommunityIcons name="account" size={52} color={isDarkMode ? '#888' : '#aaa'} />
                        </View>
                    )}
                    <TouchableOpacity
                        onPress={handleEditProfile}
                        style={[styles.editBadge, { backgroundColor: colors.primary }]}
                    >
                        <MaterialCommunityIcons name="pencil" size={14} color="#000" />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.userName, { color: colors.text }]}>{userData.name}</Text>
                <Text style={[styles.userEmail, { color: colors.subtext }]}>{userData.email}</Text>
            </View>

            {/* Import Deck Card */}
            <View style={[styles.card, { backgroundColor: colors.card, shadowColor: isDarkMode ? '#fff' : '#000' }]}>
                <View style={styles.cardHeader}>
                    <MaterialCommunityIcons name="download-outline" size={20} color={colors.subtext} />
                    <Text style={[styles.cardLabel, { color: colors.text }]}>Import Deck</Text>
                </View>
                <View style={[styles.importRow, { borderColor: colors.border, backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5' }]}>
                    <TextInput
                        style={[styles.linkInput, { color: colors.text }]}
                        placeholder="FC-XXXXXXXX"
                        placeholderTextColor={colors.subtext}
                        value={inputLink}
                        onChangeText={setInputLink}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        editable={!isImporting}
                    />
                    <TouchableOpacity
                        onPress={handleInputLink}
                        style={[styles.importBtn, { backgroundColor: colors.primary }, isImporting && { opacity: 0.6 }]}
                        disabled={isImporting}
                    >
                        {isImporting
                            ? <ActivityIndicator size="small" color="#000" />
                            : <Text style={styles.importBtnText}>Import</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>

            {/* Settings Card */}
            <View style={[styles.card, { backgroundColor: colors.card, shadowColor: isDarkMode ? '#fff' : '#000' }]}>

                <TouchableOpacity
                    onPress={handleAboutUs}
                    style={[styles.settingRow, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
                >
                    <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#2a2a2a' : '#f0f0f0' }]}>
                        <MaterialCommunityIcons name="information-outline" size={20} color={colors.subtext} />
                    </View>
                    <Text style={[styles.settingText, { color: colors.text }]}>About Us</Text>
                    <MaterialCommunityIcons name="chevron-right" size={22} color={colors.subtext} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleToggleAppTheme} style={styles.settingRow}>
                    <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#2a2a2a' : '#f0f0f0' }]}>
                        <MaterialCommunityIcons name="theme-light-dark" size={20} color={colors.subtext} />
                    </View>
                    <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
                    <Switch
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
                        onValueChange={handleToggleAppTheme}
                        value={isDarkMode}
                    />
                </TouchableOpacity>
            </View>

            {/* Logout */}
            <TouchableOpacity
                onPress={handleLogout}
                style={[styles.logoutButton, { backgroundColor: colors.logout }]}
            >
                <MaterialCommunityIcons name="logout" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container:          { flex: 1, paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 50 : 30 },

    // Header
    header:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Platform.OS === 'ios' ? 50 : 30, marginBottom: 28 },
    backButton:         { padding: 6 },
    headerTitle:        { fontSize: 20, fontWeight: '700', letterSpacing: 0.3 },

    // Profile
    profileInfo:        { alignItems: 'center', marginBottom: 24 },
    avatarWrapper:      { position: 'relative', marginBottom: 12 },
    profileImage:       { width: 96, height: 96, borderRadius: 48 },
    avatarPlaceholder:  { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
    editBadge:          { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2 },
    userName:           { fontSize: 20, fontWeight: '700', marginBottom: 4 },
    userEmail:          { fontSize: 14, fontWeight: '400' },

    // Cards
    card:               { borderRadius: 14, marginBottom: 16, paddingVertical: 6, paddingHorizontal: 16, elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },

    // Import
    cardHeader:         { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
    cardLabel:          { fontSize: 14, fontWeight: '600' },
    importRow:          { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 12 },
    linkInput:          { flex: 1, fontSize: 14, paddingVertical: 8, letterSpacing: 1 },
    importBtn:          { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, minWidth: 76, alignItems: 'center', justifyContent: 'center' },
    importBtnText:      { fontSize: 14, fontWeight: '700', color: '#000' },

    // Settings rows
    settingRow:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
    iconCircle:         { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    settingText:        { flex: 1, fontSize: 15, fontWeight: '500' },

    // Logout
    logoutButton:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 12, marginTop: 4, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 },
    logoutText:         { fontSize: 16, fontWeight: '600', color: '#fff' },
});

export default ProfileScreen;