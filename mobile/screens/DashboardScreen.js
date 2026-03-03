import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TextInput, 
    TouchableOpacity, 
    Dimensions,
    Alert, 
    Share,
    ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDecks } from '../DeckContext';
import { useTheme } from '../ThemeContext';
import { auth } from '../firebaseConfig';

const ProgressBar = ({ progress, color, themeColors }) => {
    return (
        <View style={[styles.progressBarContainer, { backgroundColor: themeColors.border }]}>
            <View 
                style={[
                    styles.progressBarFill, 
                    { width: `${progress}%`, backgroundColor: color }
                ]} 
            />
        </View>
    );
};

const DashboardScreen = ({ navigation }) => {
    const { decks, removeDeck, loading } = useDecks();
    const { colors } = useTheme();
    const [searchText, setSearchText] = React.useState('');
    const [userName, setUserName] = useState('User');

    useEffect(() => {
        // Get user name from Firebase Auth
        if (auth.currentUser) {
            setUserName(auth.currentUser.displayName || 'User');
        }
    }, []);

    const DeckCard = ({ deck }) => {
        const masteryColor = deck.mastery >= 75 ? '#4CAF50' : deck.mastery >= 50 ? '#FFC107' : '#F44336';

        const handleOptions = (deck, event) => {
    if (event) {
        event.stopPropagation();
    }
    
    // Generate a unique share code based on deck ID
    const shareCode = `FC-${deck.id.substring(0, 8).toUpperCase()}`;

    Alert.alert(
        deck.title,
        "Choose an action:",
        [
            {
                text: "Share Deck",
                onPress: async () => {
                    try {
                        await Share.share({
                            message: `🎓 Check out my flashcard deck: "${deck.title}"\n\n` +
                                    `📚 ${deck.cardCount} cards to help you study!\n\n` +
                                    `Use this code to import: ${shareCode}\n\n` +
                                    `Open FlashGenius app → Profile → Enter code`,
                        });
                    } catch (error) {
                        console.error('Error sharing:', error);
                    }
                }
            },
            {
                text: "Remove Deck",
                style: 'destructive',
                onPress: () => {
                    Alert.alert(
                        "Confirm Removal",
                        `Are you sure you want to remove ${deck.title}? This cannot be undone.`,
                        [
                            { text: "Cancel", style: 'cancel' },
                            { 
                                text: "Remove", 
                                style: 'destructive', 
                                onPress: () => removeDeck(deck.id)
                            }
                        ]
                    );
                }
            },
            { text: "Cancel", style: 'cancel' }
        ]
    );
};
        return (
            <TouchableOpacity 
                style={[styles.card, { 
                    backgroundColor: colors.card,
                    borderLeftColor: masteryColor,
                    shadowColor: colors.shadow,
                }]}
                onPress={() => navigation.navigate('FlashcardStudy', { deck })}
            >
                <View style={styles.cardHeaderRow}>
                    <View style={styles.cardTitleContainer}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>{deck.title}</Text>
                        <Text style={[styles.cardSource, { color: colors.subtext }]}>
                            {deck.status === 'Imported' ? 'Imported from' : 'Generated from'} "{deck.source}"
                        </Text>
                    </View>

                    <TouchableOpacity 
                        onPress={(e) => {
                            e.stopPropagation();
                            handleOptions(deck, e);
                        }} 
                        style={styles.optionsButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.subtext} />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.cardDetailsRow}>
                    <Text style={[styles.cardDetailText, { color: colors.subtext }]}>{deck.cardCount} Cards</Text>
                    
                    <View style={styles.masteryContainer}>
                        <Text style={[styles.masteryText, { color: masteryColor }]}>
                            {deck.mastery}% Mastered
                        </Text>
                        
                        <ProgressBar progress={deck.mastery} color={masteryColor} themeColors={colors} />
                    </View>
                </View>

                <View style={[styles.progressRow, { borderTopColor: colors.border }]}>
                    <View style={styles.progressLeft}>
                        <MaterialCommunityIcons 
                            name={deck.status === 'Needs Review' ? 'alert-circle' : 'progress-check'} 
                            size={18} 
                            color={colors.primary} 
                            style={styles.progressIcon}
                        />
                        <Text style={[styles.progressText, { color: colors.primary }]}>
                            {deck.status === 'Needs Review' ? 'Needs Review' : 'Ready to Study'}
                        </Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={colors.subtext} />
                </View>
            </TouchableOpacity>
        );
    };

    const filteredDecks = decks.filter(deck => 
        deck.title.toLowerCase().includes(searchText.toLowerCase())
    );

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.text }]}>Loading your decks...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome, {userName}!</Text>
                <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Profile')}>
                    <MaterialCommunityIcons name="account-circle-outline" size={30} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={[styles.searchBarContainer, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
                <MaterialCommunityIcons name="magnify" size={24} color={colors.subtext} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search decks..."
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholderTextColor={colors.subtext}
                />
            </View>

            {filteredDecks.length === 0 ? (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="cards-outline" size={80} color={colors.subtext} />
                    <Text style={[styles.emptyText, { color: colors.text }]}>No flashcard decks yet</Text>
                    <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
                        Tap the Generate tab to create your first deck!
                    </Text>
                </View>
            ) : (
                <ScrollView style={styles.deckList} showsVerticalScrollIndicator={false}>
                    {filteredDecks.map(deck => (
                        <DeckCard key={deck.id} deck={deck} />
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: Dimensions.get('window').height > 800 ? 60 : 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    profileIcon: {
        padding: 5,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 25,
        paddingHorizontal: 10,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 45,
        fontSize: 16,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 20,
    },
    emptySubtext: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    deckList: {
        flex: 1,
        marginBottom: 20,
    },
    card: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        borderLeftWidth: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    cardTitleContainer: {
        flex: 1,
        paddingRight: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    cardSource: {
        fontSize: 13,
        marginBottom: 10,
    },
    optionsButton: {
        padding: 5,
    },
    cardDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    cardDetailText: {
        fontSize: 14,
    },
    masteryContainer: {
        alignItems: 'flex-end',
        width: '50%',
    },
    masteryText: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
    },
    progressBarContainer: {
        height: 6,
        width: '100%',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        marginTop: 5,
    },
    progressLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressIcon: {
        marginRight: 8,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
    },
    progressValue: {
        fontSize: 14,
    }
});

export default DashboardScreen;