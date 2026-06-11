import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { radius, spacing, typography } from '../theme/theme';

/**
 * MetricCard — compact stat tile (icon, value, label).
 *
 * tone: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
 */
const MetricCard = ({ icon, value, label, tone = 'primary', style }) => {
    const { colors } = useTheme();

    const accent = {
        primary: { bg: colors.primarySoft, fg: colors.primary },
        success: { bg: colors.successSoft, fg: colors.success },
        warning: { bg: colors.warningSoft, fg: colors.warning },
        danger:  { bg: colors.dangerSoft,  fg: colors.danger },
        neutral: { bg: colors.surfaceSubtle, fg: colors.subtext },
    }[tone];

    return (
        <View
            style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
                style,
            ]}
        >
            <View style={[styles.iconWrap, { backgroundColor: accent.bg }]}>
                <MaterialCommunityIcons name={icon} size={16} color={accent.fg} />
            </View>
            <Text style={[styles.value, { color: colors.text }]} numberOfLines={1}>
                {value}
            </Text>
            <Text style={[styles.label, { color: colors.subtext }]} numberOfLines={1}>
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderWidth: 1,
        borderRadius: radius.md,
        padding: spacing.md,
    },
    iconWrap: {
        width: 28,
        height: 28,
        borderRadius: radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    value: {
        fontSize: typography.size.heading + 2,
        fontWeight: typography.weight.bold,
    },
    label: {
        fontSize: typography.size.micro,
        fontWeight: typography.weight.medium,
        marginTop: 1,
    },
});

export default MetricCard;
