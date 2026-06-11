import React, { useCallback, useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Switch, Alert, Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../contexts/ThemeContext';
import { useDecks } from '../contexts/DeckContext';
import api from '../services/api';
import {
    Screen, ScreenHeader, Card, Button, TextField, Pill,
} from '../components';
import { spacing, radius, typography } from '../theme/theme';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { theme, colors, toggleTheme } = useTheme();
    const { refreshDecks } = useDecks();
    const isDarkMode = theme === 'dark';

    const [profileImage, setProfileImage] = useState(null);
    const [inputLink, setInputLink]       = useState('');
    const [isImporting, setIsImporting]   = useState(false);
    const [userData, setUserData]         = useState({ name: '', email: '' });
    const userInitial = (userData.name || 'U').charAt(0).toUpperCase();

    const loadUser = useCallback(async () => {
        try {
            const userStr = await SecureStore.getItemAsync('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setUserData({
                    name:  user.username || user.name || 'User',
                    email: user.email || '',
                });
                setProfileImage(user.avatar || null);
            }
        } catch (error) {
            console.error('Error loading user:', error);
        }
    }, []);

    useEffect(() => { loadUser(); }, [loadUser]);

    // useFocusEffect must not receive an async callback: it would return a
    // Promise where React Navigation expects a cleanup function.
    useFocusEffect(useCallback(() => { loadUser(); }, [loadUser]));

    const handleEditProfile = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Needed', 'Photo library access is required to change your profile picture.');
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
                Alert.alert('Profile Updated', 'Your profile picture has been updated.');
            } catch (error) {
                console.error('Error updating avatar:', error);
                Alert.alert('Update Failed', 'Could not update your profile picture. Please try again.');
            }
        }
    };

    const handleInputLink = async () => {
        if (!inputLink.trim()) {
            Alert.alert('Code Required', 'Enter a deck code to import.');
            return;
        }
        const shareCodeMatch = inputLink.trim().match(/FC-([A-Z0-9]{8})/i);
        if (shareCodeMatch) {
            await importDeckFromCode(inputLink.trim());
        } else {
            Alert.alert('Invalid Code', 'Enter a valid deck code in the format FC-XXXXXXXX.');
        }
    };

    const importDeckFromCode = async (shareCode) => {
        setIsImporting(true);
        try {
            const response = await api.post('/decks/import', { shareCode });

            // Refresh decks in context so the home screen updates instantly.
            await refreshDecks();

            Alert.alert(
                'Deck Imported',
                `"${response.data.deck.title}" was added with ${response.data.deck.card_count} cards.`,
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

    const handleAboutUs = () => navigation.navigate('About');

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.post('/auth/logout');
                        } catch (e) { /* token may already be invalid */ } finally {
                            await SecureStore.deleteItemAsync('token');
                            await SecureStore.deleteItemAsync('user');
                            navigation.replace('Login');
                        }
                    },
                },
            ]
        );
    };

    return (
        <Screen>
            <ScreenHeader eyebrow="Account" title="Profile" />

            <Card>
                <View style={styles.profileRow}>
                    <View style={styles.avatarWrapper}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: colors.primarySoft }]}>
                                <Text style={[styles.avatarInitial, { color: colors.primary }]}>{userInitial}</Text>
                            </View>
                        )}
                        <TouchableOpacity
                            onPress={handleEditProfile}
                            style={[styles.editBadge, { backgroundColor: colors.primary, borderColor: colors.card }]}
                            activeOpacity={0.85}
                            accessibilityRole="button"
                            accessibilityLabel="Change profile picture"
                        >
                            <MaterialCommunityIcons name="camera-outline" size={14} color={colors.onPrimary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileCopy}>
                        <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
                            {userData.name || 'Loading…'}
                        </Text>
                        <Text style={[styles.userEmail, { color: colors.subtext }]} numberOfLines={1}>
                            {userData.email}
                        </Text>
                        <Pill icon="shield-account-outline" label="Learner account" tone="primary" />
                    </View>
                </View>
            </Card>

            <Card>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Import a Deck</Text>
                <Text style={[styles.cardSubtitle, { color: colors.subtext }]}>
                    Paste a code shared from another device to add the deck to your library.
                </Text>
                <TextField
                    icon="key-variant"
                    placeholder="FC-XXXXXXXX"
                    value={inputLink}
                    onChangeText={(value) => setInputLink(value.toUpperCase())}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    editable={!isImporting}
                />
                <Button
                    label="Import Deck"
                    icon="tray-arrow-down"
                    onPress={handleInputLink}
                    loading={isImporting}
                />
            </Card>

            <Card padded={false}>
                <Text style={[styles.cardTitle, styles.preferencesTitle, { color: colors.text }]}>Preferences</Text>

                <TouchableOpacity
                    onPress={handleAboutUs}
                    style={[styles.settingRow, { borderTopColor: colors.border }]}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel="About CogniVia"
                >
                    <View style={[styles.settingIcon, { backgroundColor: colors.surfaceSubtle }]}>
                        <MaterialCommunityIcons name="information-outline" size={19} color={colors.subtext} />
                    </View>
                    <View style={styles.settingCopy}>
                        <Text style={[styles.settingText, { color: colors.text }]}>About CogniVia</Text>
                        <Text style={[styles.settingSubText, { color: colors.subtext }]}>App information and support</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={22} color={colors.subtext} />
                </TouchableOpacity>

                <View style={[styles.settingRow, { borderTopColor: colors.border }]}>
                    <View style={[styles.settingIcon, { backgroundColor: colors.surfaceSubtle }]}>
                        <MaterialCommunityIcons name="theme-light-dark" size={19} color={colors.subtext} />
                    </View>
                    <View style={styles.settingCopy}>
                        <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
                        <Text style={[styles.settingSubText, { color: colors.subtext }]}>Switch between light and dark themes</Text>
                    </View>
                    <Switch
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={colors.onPrimary}
                        onValueChange={toggleTheme}
                        value={isDarkMode}
                    />
                </View>
            </Card>

            <Button
                label="Log Out"
                icon="logout"
                variant="destructive"
                onPress={handleLogout}
            />
        </Screen>
    );
};

const styles = StyleSheet.create({
    profileRow:        { flexDirection: 'row', alignItems: 'center' },
    avatarWrapper:     { position: 'relative', marginRight: spacing.lg },
    avatar:            { width: 76, height: 76, borderRadius: 38 },
    avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
    avatarInitial:     { fontSize: 28, fontWeight: typography.weight.bold },
    editBadge:         {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileCopy: { flex: 1, alignItems: 'flex-start' },
    userName:    {
        fontSize: typography.size.title,
        fontWeight: typography.weight.bold,
        marginBottom: 2,
    },
    userEmail: {
        fontSize: typography.size.caption,
        marginBottom: spacing.sm,
    },

    cardTitle: {
        fontSize: typography.size.heading,
        fontWeight: typography.weight.bold,
        marginBottom: spacing.xs,
    },
    cardSubtitle: {
        fontSize: typography.size.caption,
        lineHeight: 19,
        marginBottom: spacing.lg,
    },

    preferencesTitle: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
        marginBottom: 0,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderTopWidth: 1,
        gap: spacing.md,
    },
    settingIcon: {
        width: 36,
        height: 36,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingCopy:    { flex: 1, paddingRight: spacing.sm },
    settingText:    {
        fontSize: typography.size.body,
        fontWeight: typography.weight.semibold,
        marginBottom: 1,
    },
    settingSubText: { fontSize: typography.size.micro + 1 },
});

export default ProfileScreen;
