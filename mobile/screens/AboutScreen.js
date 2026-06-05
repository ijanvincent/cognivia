import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';

const AboutScreen = () => {
    const navigation = useNavigation();
    const { colors } = useTheme();

    const features = [
        { icon: 'brain',          text: 'AI-Powered Flashcard Generation' },
        { icon: 'chart-line',     text: 'Progress Tracking & Analytics' },
        { icon: 'cards-outline',  text: 'Smart Spaced Repetition Study' },
        { icon: 'share-variant',  text: 'Share & Import Decks' },
        { icon: 'theme-light-dark', text: 'Dark Mode Support' },
        { icon: 'lock-outline',   text: 'Secure Cloud Sync' },
    ];

    const stats = [
        { value: '500+', label: 'Topics Covered' },
        { value: '3x',   label: 'Faster Retention' },
        { value: '98%',  label: 'Satisfaction Rate' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>About</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>

          
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={[styles.iconWrap, { backgroundColor: colors.primary }]}>
                        <MaterialCommunityIcons name="head-lightbulb-outline" size={44} color="#000" />
                    </View>
                    <Text style={[styles.appName, { color: colors.text }]}>
                        Cogni<Text style={{ color: colors.primary }}>Via</Text>
                    </Text>
                    <Text style={[styles.version, { color: colors.subtext }]}>Version 1.0.0</Text>
                    <Text style={[styles.tagline, { color: colors.subtext }]}>
                        Where Learning Meets Play.
                    </Text>
                    <Text style={[styles.description, { color: colors.text }]}>
                        CogniVia is an AI-powered learning companion that transforms documents and notes into interactive flashcard decks — helping you study smarter through spaced repetition and active recall.
                    </Text>
                </View>

              
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.statsRow}>
                        {stats.map((s, i) => (
                            <View key={i} style={styles.statItem}>
                                <Text style={[styles.statValue, { color: colors.primary }]}>{s.value}</Text>
                                <Text style={[styles.statLabel, { color: colors.subtext }]}>{s.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

               
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="target" size={22} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Mission</Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.text }]}>
                        We believe effective learning should be accessible to everyone. CogniVia combines cutting-edge AI with proven cognitive science to deliver a personalized learning experience that adapts to you — challenging you at the right level, at the right time.
                    </Text>
                </View>

             
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="star-outline" size={22} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Features</Text>
                    </View>
                    {features.map((f, i) => (
                        <View key={i} style={styles.featureItem}>
                            <MaterialCommunityIcons name={f.icon} size={20} color={colors.primary} />
                            <Text style={[styles.featureText, { color: colors.text }]}>{f.text}</Text>
                        </View>
                    ))}
                </View>

         
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="code-tags" size={22} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Built With</Text>
                    </View>
                    <View style={styles.techGrid}>
                        {['React Native', 'Expo', 'Laravel', 'MySQL', 'Gemini AI', 'Docker'].map((tech, i) => (
                            <View key={i} style={[styles.techTag, { borderColor: colors.primary + '60', backgroundColor: colors.primary + '15' }]}>
                                <Text style={[styles.techText, { color: colors.primary }]}>{tech}</Text>
                            </View>
                        ))}
                    </View>
                </View>

         
                <Text style={[styles.footer, { color: colors.subtext }]}>
                    © {new Date().getFullYear()} CogniVia. All rights reserved.
                </Text>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 15,
    },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    scroll: { flex: 1, paddingHorizontal: 20 },
    card: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    iconWrap: {
        width: 88,
        height: 88,
        borderRadius: 44,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 15,
    },
    appName: {
        fontSize: 32,
        fontWeight: '900',
        textAlign: 'center',
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    version: { fontSize: 13, textAlign: 'center', marginBottom: 6 },
    tagline: { fontSize: 15, textAlign: 'center', fontStyle: 'italic', marginBottom: 14 },
    description: { fontSize: 15, lineHeight: 24, textAlign: 'center' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 28, fontWeight: '800' },
    statLabel: { fontSize: 12, marginTop: 4, textAlign: 'center' },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
    sectionTitle: { fontSize: 18, fontWeight: '700' },
    sectionText: { fontSize: 15, lineHeight: 24 },
    featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    featureText: { fontSize: 15, flex: 1 },
    techGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    techTag: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    techText: { fontSize: 13, fontWeight: '600' },
    footer: { fontSize: 13, textAlign: 'center', marginTop: 10 },
});

export default AboutScreen;