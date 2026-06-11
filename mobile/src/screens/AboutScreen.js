import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { Screen, Card, Pill } from '../components';
import { spacing, radius, typography } from '../theme/theme';

const FEATURES = [
    { icon: 'brain',            text: 'AI-powered flashcard generation' },
    { icon: 'chart-line',       text: 'Progress tracking and analytics' },
    { icon: 'cards-outline',    text: 'Spaced repetition study sessions' },
    { icon: 'share-variant',    text: 'Share and import decks' },
    { icon: 'theme-light-dark', text: 'Light and dark themes' },
    { icon: 'lock-outline',     text: 'Secure cloud sync' },
];

const TECH_STACK = ['React Native', 'Expo', 'Laravel', 'MySQL', 'Gemini AI', 'Docker'];

const AboutScreen = () => {
    const navigation = useNavigation();
    const { colors } = useTheme();

    return (
        <Screen>
            <View style={styles.navRow}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.navTitle, { color: colors.text }]}>About</Text>
                <View style={styles.navSpacer} />
            </View>

            <Card>
                <View style={[styles.logoWrap, { backgroundColor: colors.primarySoft }]}>
                    <MaterialCommunityIcons name="head-lightbulb-outline" size={40} color={colors.primary} />
                </View>
                <Text style={[styles.appName, { color: colors.text }]}>
                    Cogni<Text style={{ color: colors.primary }}>Via</Text>
                </Text>
                <Text style={[styles.version, { color: colors.subtext }]}>Version 1.0.0</Text>
                <Text style={[styles.description, { color: colors.text }]}>
                    CogniVia is an AI-powered learning companion that turns documents and
                    notes into interactive flashcard decks, helping you study through
                    spaced repetition and active recall.
                </Text>
            </Card>

            <Card>
                <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons name="target" size={20} color={colors.primary} />
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Mission</Text>
                </View>
                <Text style={[styles.sectionText, { color: colors.text }]}>
                    We believe effective learning should be accessible to everyone.
                    CogniVia combines AI with proven cognitive science to deliver a
                    personalized study experience that adapts to you.
                </Text>
            </Card>

            <Card>
                <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons name="star-outline" size={20} color={colors.primary} />
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Features</Text>
                </View>
                {FEATURES.map((feature) => (
                    <View key={feature.text} style={styles.featureItem}>
                        <View style={[styles.featureIcon, { backgroundColor: colors.surfaceSubtle }]}>
                            <MaterialCommunityIcons name={feature.icon} size={18} color={colors.primary} />
                        </View>
                        <Text style={[styles.featureText, { color: colors.text }]}>{feature.text}</Text>
                    </View>
                ))}
            </Card>

            <Card>
                <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons name="code-tags" size={20} color={colors.primary} />
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Built With</Text>
                </View>
                <View style={styles.techGrid}>
                    {TECH_STACK.map((tech) => (
                        <Pill key={tech} label={tech} tone="primary" />
                    ))}
                </View>
            </Card>

            <Text style={[styles.footer, { color: colors.subtext }]}>
                © {new Date().getFullYear()} CogniVia. All rights reserved.
            </Text>
        </Screen>
    );
};

const styles = StyleSheet.create({
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
    },
    backButton: { padding: spacing.xs },
    navTitle: {
        fontSize: typography.size.title,
        fontWeight: typography.weight.bold,
    },
    navSpacer: { width: 32 },

    logoWrap: {
        width: 80,
        height: 80,
        borderRadius: radius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: spacing.lg,
    },
    appName: {
        fontSize: typography.size.display,
        fontWeight: typography.weight.bold,
        textAlign: 'center',
        letterSpacing: -0.5,
        marginBottom: spacing.xs,
    },
    version: {
        fontSize: typography.size.caption,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    description: {
        fontSize: typography.size.body,
        lineHeight: 23,
        textAlign: 'center',
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.size.heading,
        fontWeight: typography.weight.bold,
    },
    sectionText: {
        fontSize: typography.size.body,
        lineHeight: 23,
    },

    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    featureIcon: {
        width: 34,
        height: 34,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureText: {
        flex: 1,
        fontSize: typography.size.body,
    },

    techGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },

    footer: {
        fontSize: typography.size.caption,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
});

export default AboutScreen;
