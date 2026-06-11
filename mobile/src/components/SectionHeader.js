import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, typography } from '../theme/theme';

/**
 * SectionHeader — list/section title with optional subtitle and right slot.
 */
const SectionHeader = ({ title, subtitle, right }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.row}>
            <View style={styles.copy}>
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                {!!subtitle && (
                    <Text style={[styles.subtitle, { color: colors.subtext }]}>{subtitle}</Text>
                )}
            </View>
            {right}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    copy: { flex: 1, paddingRight: spacing.md },
    title: {
        fontSize: typography.size.heading,
        fontWeight: typography.weight.bold,
    },
    subtitle: {
        fontSize: typography.size.micro + 1,
        fontWeight: typography.weight.medium,
        marginTop: 2,
    },
});

export default SectionHeader;
