import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { radius, spacing, typography } from '../theme/theme';

/**
 * Button — the single pressable primitive.
 *
 * variant: 'primary' | 'secondary' | 'destructive' | 'ghost'
 */
const Button = ({
    label,
    onPress,
    variant = 'primary',
    icon,
    disabled = false,
    loading = false,
    style,
}) => {
    const { colors } = useTheme();

    const palette = {
        primary: {
            container: { backgroundColor: colors.primary },
            content: colors.onPrimary,
        },
        secondary: {
            container: {
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
            },
            content: colors.text,
        },
        destructive: {
            container: {
                backgroundColor: colors.dangerSoft,
                borderWidth: 1,
                borderColor: colors.danger,
            },
            content: colors.danger,
        },
        ghost: {
            container: { backgroundColor: 'transparent' },
            content: colors.subtext,
        },
    }[variant];

    const isInactive = disabled || loading;

    return (
        <TouchableOpacity
            style={[styles.base, palette.container, isInactive && styles.inactive, style]}
            onPress={onPress}
            disabled={isInactive}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={label}
        >
            {loading ? (
                <ActivityIndicator size="small" color={palette.content} />
            ) : (
                <>
                    {!!icon && (
                        <MaterialCommunityIcons name={icon} size={18} color={palette.content} />
                    )}
                    <Text style={[styles.label, { color: palette.content }]}>{label}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        height: 48,
        borderRadius: radius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.xl,
    },
    label: {
        fontSize: typography.size.body,
        fontWeight: typography.weight.semibold,
    },
    inactive: { opacity: 0.5 },
});

export default Button;
