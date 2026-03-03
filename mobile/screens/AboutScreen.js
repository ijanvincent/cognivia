import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    Modal,
    Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';

// Import team photos
const teamPhotos = {
      miguel: require('../assets/team/miguel.png'),
      jezza: require('../assets/team/jezza.jpg'),
      mjay: require('../assets/team/mjay.jpg'),
      irene: require('../assets/team/irene.jpg'),
      darwin: require('../assets/team/darwin.jpg'),
      zayr: require('../assets/team/zayr.jpg'),
      raynalyn: require('../assets/team/raynalyn.jpg'),
      magno: require('../assets/team/magno.jpg'),
      tuyor: require('../assets/team/tuyor.jpg'),
      jaciel: require('../assets/team/jaciel.jpg'),
      pesay: require('../assets/team/pesay.jpg'),
};

const AboutScreen = () => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const [selectedMember, setSelectedMember] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Team member data with personal info
    const teamMembers = [
        {
            id: 1,
            initials: 'ML',
            name: 'Miguel Lourence B. Balansag',
            role: 'Leader',
            color: colors.primary,
            photo: teamPhotos.miguel, 
            age: 21,
            birthday: 'September 29, 2004',
            email: 'miguellourencebalansag.com',
            hobbies: ['Arts', 'Online Gaming', 'Reading', 'Sketching'],
            bio: 'I am both dumber and smarter than you think. Never estimate me',
            isLead: true,
        },
        {
            id: 2,
            initials: 'JD',
            name: 'Jezza Dologuin',
            role: 'Assistant',
            color: '#FF6B6B',
            photo: teamPhotos.jezza ,
            age: 21,
            birthday: 'September 11, 2004',
            email: 'jezzadologuin84@gmail.com',
            hobbies: ['Reading', 'Sleeping'],
            bio: "small steps, big dreams",
            isLead: false,
        },
        {
            id: 3,
            initials: 'MC',
            name: 'Mjay Cabelin',
            role: 'Assistant',
            color: '#4ECDC4',
            photo: teamPhotos.mjay,
            age: 22,
            birthday: 'September 28, 2003',
            email: 'mjaycabelin@gmail.com',
            hobbies: ['Running', 'Podcasts', 'Board Games', 'Gardening'],
            bio: 'ikaw Akong gusto ayiee.',
            isLead: false,
        },
        {
            id: 4,
            initials: 'IG',
            name: 'Irene Guzman',
            role: 'Member',
            color: '#95E1D3',
            photo: teamPhotos.irene,
            age: 21,
            birthday: 'October 08, 2004',
            email: 'guzmanirine@gmail.com',
            hobbies: ['Singing'],
            bio: 'classy',
            isLead: false,
        },
        {
            id: 5,
            initials: 'ZD',
            name: 'Zay R Hope Dael',
            role: 'Member',
            color: '#F38181',
            photo: teamPhotos.zayr,
            age: 21,
            birthday: 'September 23, 2004',
            email: 'zayrhoped@gmail.com',
            hobbies: ['Online Games', , 'Board Games', 'Playing Sepak Takraw'],
            bio: 'Silent but Deadly',
            isLead: false,
        },
        {
            id: 6,
            initials: 'JP',
            name: 'Juliet Pesay',
            role: 'Member',
            color: '#AA96DA',
            photo: teamPhotos.pesay,
            age: 20,
            birthday: 'April 10,2005',
            email: 'pesayjuliet4@gmail.com',
            hobbies: ['Eating'],
            bio: 'sayo lang akooee:)))>.',
            isLead: false,
        },
        {
            id: 7,
            initials: 'DL',
            name: 'Darwin Ludevice',
            role: 'Member',
            color: '#FCBAD3',
            photo: teamPhotos.darwin,
            age: 21,
            birthday: 'may  9, 2004',
            email: 'darwinludevice91@gmail.com',
            hobbies: ['basketball'],
            bio: " if you wanna buy something without able working at the pricetag you gotta work without able look at the clock'mind games'",
            isLead: false,
        },
        {
            id: 8,
            initials: 'JM',
            name: 'Justine Faith Magno',
            role: 'Member',
            color: '#A8D8EA',
            photo: teamPhotos.magno,
            age: 20,
            birthday: 'September 27, 2005',
            email: 'justinefaith@gmail.com',
            hobbies: ['Dancing'],
            bio: 'Sassy, classy, and a little bad-assy',
            isLead: false,
        },
        {
            id: 9,
            initials: 'AT',
            name: 'Anthony Tuyor',
            role: 'Member',
            color: '#FFD93D',
            photo: teamPhotos.tuyor,
            age: 21,
            birthday: 'April 26, 2004',
            email: 'tuyoranthony302@gmail.com',
            hobbies: [' Online Games '],
            bio: ' Living life on airplane mode.',
            isLead: false,
        },
        {
            id: 10,
            initials: 'JG',
            name: 'Jaciel Gandulpos',
            role: 'Member',
            color: '#6BCB77',
            photo: teamPhotos.jaciel,
           age: 20,
            birthday: 'April 12, 2005',
            email: 'gandulposjaciel@gmail.com',
            hobbies: ['Reading', 'Watching KDramas'],
            bio: "Warmhearted",
            isLead: false,
        },
        {
            id: 11,
            initials: 'RO',
            name: 'Raynalyn Odtohan',
            role: 'Member',
            color: '#FF8B94',
            photo: teamPhotos.raynalyn,
            age: 20,
            birthday: 'February 22, 2005',
            email: 'raynalynodtohan1@gmail.com',
            hobbies: ['Eating'],
            bio: 'Living my best life.',
            isLead: false,
        },
    ];
    const handleMemberPress = (member) => {
        setSelectedMember(member);
        setModalVisible(true);
    };

    const renderTeamMember = (member, isLead = false) => {
        if (isLead) {
            return (
                <TouchableOpacity 
                    key={member.id}
                    style={styles.leadMember}
                    onPress={() => handleMemberPress(member)}
                    activeOpacity={0.7}
                >
                    <Image 
                       source={member.photo}
                        style={styles.leadPhotoCircle}
                    />
                    <Text style={[styles.leadMemberName, { color: colors.text }]}>{member.name}</Text>
                    <Text style={[styles.leadMemberRole, { color: colors.subtext }]}>{member.role}</Text>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity 
                key={member.id}
                style={styles.teamMember}
                onPress={() => handleMemberPress(member)}
                activeOpacity={0.7}
            >
                <Image 
                   source={member.photo}
                    style={styles.photoCircle}
                />
                <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                <Text style={[styles.memberRole, { color: colors.subtext }]}>{member.role}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>About Us</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* App Info Card */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
                        <MaterialCommunityIcons name="cards" size={40} color="#000000" />
                    </View>
                    <Text style={[styles.appName, { color: colors.text }]}>FlashGenius</Text>
                    <Text style={[styles.version, { color: colors.subtext }]}>Version 1.0.0</Text>
                    <Text style={[styles.description, { color: colors.text }]}>
                        A powerful and intuitive flashcard study app designed to help students master their subjects through active recall and spaced repetition.
                    </Text>
                </View>

                {/* Mission Section */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="target" size={24} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Mission</Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.text }]}>
                        We believe that effective learning should be accessible to everyone. Our mission is to provide students with the best tools to study smarter, not harder, using proven learning techniques backed by cognitive science.
                    </Text>
                </View>

                {/* Features Section */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="star" size={24} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Features</Text>
                    </View>
                    
                    <View style={styles.featureItem}>
                        <MaterialCommunityIcons name="brain" size={20} color={colors.primary} />
                        <Text style={[styles.featureText, { color: colors.text }]}>AI-Powered Answer Checking</Text>
                    </View>
                    
                    <View style={styles.featureItem}>
                        <MaterialCommunityIcons name="chart-line" size={20} color={colors.primary} />
                        <Text style={[styles.featureText, { color: colors.text }]}>Progress Tracking & Analytics</Text>
                    </View>
                    
                    <View style={styles.featureItem}>
                        <MaterialCommunityIcons name="share-variant" size={20} color={colors.primary} />
                        <Text style={[styles.featureText, { color: colors.text }]}>Share & Import Decks</Text>
                    </View>
                    
                    <View style={styles.featureItem}>
                        <MaterialCommunityIcons name="theme-light-dark" size={20} color={colors.primary} />
                        <Text style={[styles.featureText, { color: colors.text }]}>Dark Mode Support</Text>
                    </View>
                </View>

                {/* Team Section */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="account-group" size={24} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Submitted by: </Text>
                    </View>
                    <Text style={[styles.teamSubtitle, { color: colors.subtext }]}>
                        Tap on any member to learn more about them
                    </Text>
                    
                    {/* Lead Member */}
                    {renderTeamMember(teamMembers[0], true)}

                    {/* Other Team Members */}
                    <View style={styles.teamGrid}>
                        {teamMembers.slice(1).map(member => renderTeamMember(member))}
                    </View>

                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="account-group" size={24} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Submitted to: </Text>
                    </View>
                    <Text style={[styles.lteamSubtitle, { color: colors.subtext }]}>
                        Jay Ian F. Camelotes
                    </Text>
                    <Text style={[styles.ateamSubtitle, { color: colors.subtext }]}>
                        IT Elect1
                    </Text>
                    
                </View>

                {/* Footer */}
                <Text style={[styles.footer, { color: colors.subtext }]}>
                    © 2025 FlashCard App. All rights reserved.
                </Text>

                <View style={{ height: 30 }} />
            </ScrollView>

            {/* Member Detail Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <MaterialCommunityIcons name="close" size={28} color={colors.text} />
                        </TouchableOpacity>

                        {selectedMember && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Image 
                                    source={selectedMember.photo}
                                    style={styles.modalPhotoCircle}
                                />

                                <Text style={[styles.modalName, { color: colors.text }]}>{selectedMember.name}</Text>
                                <Text style={[styles.modalRole, { color: selectedMember.color }]}>{selectedMember.role}</Text>

                                <View style={[styles.modalDivider, { backgroundColor: colors.border }]} />

                                {/* Bio */}
                                <View style={styles.modalSection}>
                                    <View style={styles.modalSectionHeader}>
                                        <MaterialCommunityIcons name="account" size={20} color={colors.primary} />
                                        <Text style={[styles.modalSectionTitle, { color: colors.text }]}>About</Text>
                                    </View>
                                    <Text style={[styles.modalBio, { color: colors.text }]}>{selectedMember.bio}</Text>
                                </View>

                                {/* Personal Info */}
                                <View style={styles.modalSection}>
                                    <View style={styles.modalSectionHeader}>
                                        <MaterialCommunityIcons name="information" size={20} color={colors.primary} />
                                        <Text style={[styles.modalSectionTitle, { color: colors.text }]}>Personal Info</Text>
                                    </View>
                                    
                                    <View style={styles.infoRow}>
                                        <MaterialCommunityIcons name="cake-variant" size={18} color={colors.subtext} />
                                        <Text style={[styles.infoLabel, { color: colors.subtext }]}>Birthday:</Text>
                                        <Text style={[styles.infoValue, { color: colors.text }]}>{selectedMember.birthday}</Text>
                                    </View>

                                    <View style={styles.infoRow}>
                                        <MaterialCommunityIcons name="numeric" size={18} color={colors.subtext} />
                                        <Text style={[styles.infoLabel, { color: colors.subtext }]}>Age:</Text>
                                        <Text style={[styles.infoValue, { color: colors.text }]}>{selectedMember.age} years old</Text>
                                    </View>

                                    <View style={styles.infoRow}>
                                        <MaterialCommunityIcons name="email" size={18} color={colors.subtext} />
                                        <Text style={[styles.infoLabel, { color: colors.subtext }]}>Email:</Text>
                                        <Text style={[styles.infoValue, { color: colors.text }]}>{selectedMember.email}</Text>
                                    </View>
                                </View>

                                {/* Hobbies */}
                                <View style={styles.modalSection}>
                                    <View style={styles.modalSectionHeader}>
                                        <MaterialCommunityIcons name="heart" size={20} color={colors.primary} />
                                        <Text style={[styles.modalSectionTitle, { color: colors.text }]}>Hobbies & Interests</Text>
                                    </View>
                                    <View style={styles.hobbiesContainer}>
                                        {selectedMember.hobbies.map((hobby, index) => (
                                            <View key={index} style={[styles.hobbyTag, { backgroundColor: selectedMember.color + '20', borderColor: selectedMember.color }]}>
                                                <Text style={[styles.hobbyText, { color: selectedMember.color }]}>{hobby}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 15,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    card: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 15,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    version: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    sectionText: {
        fontSize: 16,
        lineHeight: 24,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    featureText: {
        fontSize: 16,
        flex: 1,
    },
    teamSubtitle: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
    lteamSubtitle: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    ateamSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 20,
        marginTop: -15,
        textAlign: 'center',
    },
    leadMember: {
        alignItems: 'center',
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    leadPhotoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
    },
    photoCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 8,
    },
    modalPhotoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 15,
    },
    leadMemberName: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 4,
    },
    leadMemberRole: {
        fontSize: 16,
        textAlign: 'center',
    },
    teamGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    teamMember: {
        width: '48%',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    memberName: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 2,
    },
    memberRole: {
        fontSize: 12,
        textAlign: 'center',
    },
    footer: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxHeight: '85%',
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
        padding: 5,
    },
    modalName: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    modalRole: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalDivider: {
        height: 1,
        marginVertical: 20,
    },
    modalSection: {
        marginBottom: 25,
    },
    modalSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    modalSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    modalBio: {
        fontSize: 16,
        lineHeight: 24,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
    },
    infoLabel: {
        fontSize: 15,
        fontWeight: '500',
        width: 80,
    },
    infoValue: {
        fontSize: 15,
        flex: 1,
    },
    hobbiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    hobbyTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    },
    hobbyText: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default AboutScreen;