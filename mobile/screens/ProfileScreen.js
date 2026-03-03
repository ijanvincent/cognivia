import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Switch, 
    TextInput,
    Alert,
    Platform,
    Image,
    ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useTheme } from '../ThemeContext';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { theme, colors, toggleTheme } = useTheme();
    const isDarkMode = theme === 'dark';

    const [inputLink, setInputLink] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const [userData, setUserData] = useState({
        name: 'Loading...',
        email: 'Loading...',
    });

    // Fetch user data from Firestore
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (auth.currentUser) {
                    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUserData({
                            name: data.name || auth.currentUser.displayName || 'User',
                            email: data.email || auth.currentUser.email,
                        });
                        if (data.profileImage) {
                            setProfileImage(data.profileImage);
                        }
                    } else {
                        setUserData({
                            name: auth.currentUser.displayName || 'User',
                            email: auth.currentUser.email,
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleEditProfile = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                "Permission Denied",
                "Sorry, we need camera roll permissions to change the profile picture."
            );
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            
            try {
                await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                    profileImage: result.assets[0].uri
                });
            } catch (error) {
                console.error('Error updating profile image:', error);
            }
        }
    };

    const handleInputLink = async () => {
        if (!inputLink.trim()) {
            Alert.alert("Empty Code", "Please enter a deck code to import.");
            return;
        }

        const shareCodeMatch = inputLink.trim().match(/FC-([A-Z0-9]{8})/i);
        
        if (shareCodeMatch) {
            await importDeckFromCode(inputLink.trim());
        } else {
            Alert.alert("Invalid Code", "Please enter a valid deck code (format: FC-XXXXXXXX)");
        }
    };

    const importDeckFromCode = async (shareCode) => {
        setIsImporting(true);

        try {
            const deckIdPrefix = shareCode.replace('FC-', '').toLowerCase();
            
            console.log("Searching for deck with prefix:", deckIdPrefix);

            const decksRef = collection(db, 'decks');
            const querySnapshot = await getDocs(decksRef);
            
            let foundDeck = null;
            querySnapshot.forEach((doc) => {
                if (doc.id.toLowerCase().startsWith(deckIdPrefix)) {
                    foundDeck = { id: doc.id, ...doc.data() };
                }
            });

            if (!foundDeck) {
                Alert.alert("Not Found", "Could not find a deck with this code. Please check the code and try again.");
                setIsImporting(false);
                return;
            }

            console.log("Found deck:", foundDeck.title);

            // Check if already imported
            const userDecksQuery = query(
                collection(db, 'decks'),
                where('userId', '==', auth.currentUser.uid)
            );
            const userDeckSnapshot = await getDocs(userDecksQuery);
            
            let alreadyImported = false;
            userDeckSnapshot.forEach(doc => {
                if (doc.data().originalDeckId === foundDeck.id) {
                    alreadyImported = true;
                }
            });
            
            if (alreadyImported) {
                Alert.alert("Already Imported", `You already have "${foundDeck.title}" in your library.`);
                setIsImporting(false);
                return;
            }

            // Import the deck
            const newDeckData = {
                userId: auth.currentUser.uid,
                title: foundDeck.title,
                source: foundDeck.source,
                cardCount: foundDeck.cardCount,
                mastery: 0,
                progress: 0,
                status: 'Imported',
                originalDeckId: foundDeck.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const newDeckRef = await addDoc(collection(db, 'decks'), newDeckData);

            // Copy flashcards
            const flashcardsQuery = query(
                collection(db, 'flashcards'),
                where('deckId', '==', foundDeck.id)
            );
            const flashcardsSnapshot = await getDocs(flashcardsQuery);
            
            console.log(`Copying ${flashcardsSnapshot.docs.length} flashcards...`);

            const flashcardPromises = flashcardsSnapshot.docs.map(doc => {
                const cardData = doc.data();
                return addDoc(collection(db, 'flashcards'), {
                    deckId: newDeckRef.id,
                    userId: auth.currentUser.uid,
                    question: cardData.question,
                    answer: cardData.answer,
                    mastered: false,
                    reviewCount: 0,
                    createdAt: new Date().toISOString(),
                });
            });

            await Promise.all(flashcardPromises);

            Alert.alert(
                "Success! 🎉",
                `"${foundDeck.title}" has been imported with ${foundDeck.cardCount} cards!`,
                [
                    { text: "OK", onPress: () => {
                        setInputLink('');
                        navigation.navigate('HomeTabs', { screen: 'Home' });
                    }}
                ]
            );

        } catch (error) {
            console.error("Import error:", error);
            Alert.alert("Import Failed", error.message || "Could not import the deck. Please try again.");
        } finally {
            setIsImporting(false);
        }
    };

    const handleToggleAppTheme = async () => {
        toggleTheme();
        
        try {
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                theme: !isDarkMode ? 'dark' : 'light'
            });
        } catch (error) {
            console.error('Error updating theme preference:', error);
        }
        
        Alert.alert("Theme Change", `App Theme changed to ${!isDarkMode ? 'Dark' : 'Light'} Mode.`);
    };

    const handleAboutUs = () => {
        navigation.navigate('About');
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Logout", 
                    onPress: async () => {
                        try {
                            await signOut(auth);
                            navigation.replace('Login');
                        } catch (error) {
                            console.error('Logout error:', error);
                            Alert.alert('Error', 'Could not log out. Please try again.');
                        }
                    }
                }
            ]
        );
    };

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
                <View style={[styles.settingItemContainer, { borderBottomColor: colors.border }]}>
                    <MaterialCommunityIcons name="download" size={24} color={colors.subtext} style={styles.settingIcon} />
                    <TextInput
                        style={[styles.linkInput, { color: colors.text }]}
                        placeholder="Enter deck code (e.g., FC-XXXXXXXX)"
                        placeholderTextColor={colors.subtext}
                        value={inputLink}
                        onChangeText={setInputLink}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        editable={!isImporting}
                    />
                    <TouchableOpacity 
                        onPress={handleInputLink} 
                        style={[
                            styles.linkSubmitButton, 
                            { backgroundColor: colors.primary },
                            isImporting && styles.linkSubmitButtonDisabled
                        ]}
                        disabled={isImporting}
                    >
                        {isImporting ? (
                            <ActivityIndicator size="small" color="black" />
                        ) : (
                            <Text style={[styles.linkSubmitButtonText, { color: 'black' }]}>Import</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    onPress={handleAboutUs} 
                    style={[styles.settingItem, { borderBottomColor: colors.border }]}
                >
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
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: Platform.OS === 'ios' ? 60 : 40,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileInfo: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E0E0E0',
    },
    editButton: {
        position: 'absolute',
        bottom: 50,
        right: '35%',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    editButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
    },
    userEmail: {
        fontSize: 16,
    },
    settingsSection: {
        borderRadius: 12,
        marginBottom: 25,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        paddingVertical: 10,
    },
    settingItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
    },
    linkInput: {
        flex: 1,
        fontSize: 12,
        marginLeft: 10,
    },
    linkSubmitButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 10,
        minWidth: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    linkSubmitButtonDisabled: {
        opacity: 0.6,
    },
    linkSubmitButtonText: {
        fontWeight: '600',
        fontSize: 15,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIcon: {
        marginRight: 15,
    },
    settingText: {
        fontSize: 16,
        fontWeight: '500',
    },
    settingSwitch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
    logoutButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    logoutButtonText: {
        fontSize: 18,
        fontWeight: '600',
    },
});

export default ProfileScreen;