import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { radius, spacing, typography } from '../theme/theme';

/**
 * Pill — small status badge.
 *
 * tone: 'neutral' | 'primary' | 'success' | 'warning' | 'danger'
 */
const Pill = ({ label, icon, tone = 'neutral' }) => {
    const { colors } = useTheme();

    const palette = {
        neutral: { bg: colors.surfaceSubtle, fg: colors.subtext },
        primary: { bg: colors.primarySoft,   fg: colors.primary },
        success: { bg: colors.successSoft,   fg: colors.success },
        warning: { bg: colors.warningSoft,   fg: colors.warning },
        danger:  { bg: colors.dangerSoft,    fg: colors.danger },
    }[tone];

    return (
        <View style={[styles.pill, { backgroundColor: palette.bg }]}>
            {!!icon && <MaterialCommunityIcons name={icon} size={13} color={palette.fg} />}
            <Text style={[styles.label, { color: palette.fg }]} numberOfLines={1}>
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        borderRadius: radius.pill,
        paddingHorizontal: spacing.sm + 2,
        height: 26,
    },
    label: {
        fontSize: typography.size.micro,
        fontWeight: typography.weight.semibold,
    },
});

export default Pill;
