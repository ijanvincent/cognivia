import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Switch, Alert, Platform, Image,
    TextInput, ActivityIndicator, ScrollView, StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
    const userInitial = (userData.name || 'U').charAt(0).toUpperCase();

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
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.headerEyebrow, { color: colors.subtext }]}>Account</Text>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
                    </View>
                </View>

                <LinearGradient
                    colors={isDarkMode ? ['#171923', '#0f172a'] : ['#ffffff', '#eef6ff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.profileCard, { borderColor: colors.border }]}
                >
                    <View style={styles.profileTopRow}>
                        <View style={styles.avatarWrapper}>
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} style={styles.profileImage} />
                            ) : (
                                <View style={[styles.avatarPlaceholder, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#e0f2fe' }]}>
                                    <Text style={[styles.avatarInitial, { color: colors.text }]}>{userInitial}</Text>
                                </View>
                            )}
                            <TouchableOpacity
                                onPress={handleEditProfile}
                                style={styles.editBadge}
                                activeOpacity={0.85}
                            >
                                <MaterialCommunityIcons name="camera-outline" size={15} color="#07111f" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.profileCopy}>
                            <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>{userData.name}</Text>
                            <Text style={[styles.userEmail, { color: isDarkMode ? '#cbd5e1' : '#64748b' }]} numberOfLines={1}>{userData.email}</Text>
                            <View style={styles.memberPill}>
                                <MaterialCommunityIcons name="shield-account-outline" size={13} color="#38bdf8" />
                                <Text style={styles.memberPillText}>Learner account</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.cardIcon, { backgroundColor: 'rgba(56,189,248,0.14)' }]}>
                            <MaterialCommunityIcons name="download-outline" size={19} color="#38bdf8" />
                        </View>
                        <View style={styles.cardHeaderCopy}>
                            <Text style={[styles.cardLabel, { color: colors.text }]}>Import Deck</Text>
                            <Text style={[styles.cardSubLabel, { color: colors.subtext }]}>Paste a shared deck code</Text>
                        </View>
                    </View>

                    <View style={[styles.importRow, { borderColor: colors.border, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc' }]}>
                        <MaterialCommunityIcons name="key-variant" size={18} color={colors.subtext} />
                        <TextInput
                            style={[styles.linkInput, { color: colors.text }]}
                            placeholder="FC-XXXXXXXX"
                            placeholderTextColor={colors.subtext}
                            value={inputLink}
                            onChangeText={(value) => setInputLink(value.toUpperCase())}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            editable={!isImporting}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleInputLink}
                        style={[styles.importBtn, isImporting && styles.disabled]}
                        disabled={isImporting}
                        activeOpacity={0.86}
                    >
                        {isImporting ? (
                            <ActivityIndicator size="small" color="#07111f" />
                        ) : (
                            <>
                                <MaterialCommunityIcons name="tray-arrow-down" size={18} color="#07111f" />
                                <Text style={styles.importBtnText}>Import Deck</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>

                    <TouchableOpacity
                        onPress={handleAboutUs}
                        style={[styles.settingRow, { borderBottomColor: colors.border }]}
                        activeOpacity={0.82}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : '#f8fafc' }]}>
                            <MaterialCommunityIcons name="information-outline" size={20} color={colors.subtext} />
                        </View>
                        <View style={styles.settingCopy}>
                            <Text style={[styles.settingText, { color: colors.text }]}>About CogniVia</Text>
                            <Text style={[styles.settingSubText, { color: colors.subtext }]}>App information and support</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={22} color={colors.subtext} />
                    </TouchableOpacity>

                    <View style={styles.settingRow}>
                        <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : '#f8fafc' }]}>
                            <MaterialCommunityIcons name="theme-light-dark" size={20} color={colors.subtext} />
                        </View>
                        <View style={styles.settingCopy}>
                            <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
                            <Text style={[styles.settingSubText, { color: colors.subtext }]}>Use system-friendly contrast</Text>
                        </View>
                        <Switch
                            trackColor={{ false: colors.border, true: '#38bdf8' }}
                            thumbColor={isDarkMode ? '#ffffff' : '#f8fafc'}
                            onValueChange={handleToggleAppTheme}
                            value={isDarkMode}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleLogout}
                    style={styles.logoutButton}
                    activeOpacity={0.86}
                >
                    <MaterialCommunityIcons name="logout" size={20} color="#ffffff" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container:          { flex: 1 },
    scroll:             { flex: 1 },
    scrollContent:      { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 58 : 42, paddingBottom: 78 },

    header:             { marginBottom: 18 },
    headerEyebrow:      { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 4 },
    headerTitle:        { fontSize: 30, fontWeight: '900' },

    profileCard:        { borderWidth: 1, borderRadius: 20, padding: 18, marginBottom: 14, overflow: 'hidden' },
    profileTopRow:      { flexDirection: 'row', alignItems: 'center' },
    avatarWrapper:      { position: 'relative', marginRight: 16 },
    profileImage:       { width: 86, height: 86, borderRadius: 43 },
    avatarPlaceholder:  { width: 86, height: 86, borderRadius: 43, alignItems: 'center', justifyContent: 'center' },
    avatarInitial:      { fontSize: 32, fontWeight: '900' },
    editBadge:          { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: '#38bdf8', alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 4 },
    profileCopy:        { flex: 1 },
    userName:           { fontSize: 22, fontWeight: '900', marginBottom: 4 },
    userEmail:          { fontSize: 13, fontWeight: '600', marginBottom: 10 },
    memberPill:         { alignSelf: 'flex-start', height: 28, borderRadius: 14, paddingHorizontal: 10, backgroundColor: 'rgba(56,189,248,0.14)', flexDirection: 'row', alignItems: 'center', gap: 5 },
    memberPillText:     { color: '#38bdf8', fontSize: 11, fontWeight: '800' },

    card:               { borderWidth: 1, borderRadius: 18, marginBottom: 14, padding: 16 },
    cardHeader:         { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    cardIcon:           { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    cardHeaderCopy:     { flex: 1 },
    cardLabel:          { fontSize: 17, fontWeight: '900' },
    cardSubLabel:       { fontSize: 12, fontWeight: '600', marginTop: 2 },

    importRow:          { height: 50, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 15, paddingHorizontal: 13, marginBottom: 12, gap: 8 },
    linkInput:          { flex: 1, fontSize: 15, fontWeight: '800', paddingVertical: 8, letterSpacing: 1.2 },
    importBtn:          { height: 46, borderRadius: 23, backgroundColor: '#38bdf8', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7 },
    importBtnText:      { fontSize: 15, fontWeight: '900', color: '#07111f' },

    sectionTitle:       { fontSize: 17, fontWeight: '900', marginBottom: 8 },
    settingRow:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1 },
    iconCircle:         { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    settingCopy:        { flex: 1, paddingRight: 12 },
    settingText:        { fontSize: 15, fontWeight: '800', marginBottom: 2 },
    settingSubText:     { fontSize: 12, fontWeight: '600' },

    logoutButton:       { height: 50, borderRadius: 25, backgroundColor: '#ef4444', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 2 },
    logoutText:         { fontSize: 16, fontWeight: '900', color: '#ffffff' },
    disabled:           { opacity: 0.58 },
});

export default ProfileScreen;
