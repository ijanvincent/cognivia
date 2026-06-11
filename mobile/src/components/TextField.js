import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { radius, spacing, typography } from '../theme/theme';

/**
 * TextField — labeled input with optional leading icon, hint, and error.
 * Spreads the remaining props onto the underlying TextInput.
 */
const TextField = ({ label, hint, error, icon, style, ...inputProps }) => {
    const { colors } = useTheme();
    const [focused, setFocused] = useState(false);

    const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

    return (
        <View style={[styles.wrap, style]}>
            {!!label && (
                <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
            )}
            <View
                style={[
                    styles.field,
                    { backgroundColor: colors.surfaceSubtle, borderColor },
                ]}
            >
                {!!icon && (
                    <MaterialCommunityIcons name={icon} size={18} color={colors.subtext} />
                )}
                <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholderTextColor={colors.subtext}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    {...inputProps}
                />
            </View>
            {!!(error || hint) && (
                <Text style={[styles.helper, { color: error ? colors.danger : colors.subtext }]}>
                    {error || hint}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: { marginBottom: spacing.lg },
    label: {
        fontSize: typography.size.caption,
        fontWeight: typography.weight.semibold,
        marginBottom: spacing.sm,
    },
    field: {
        height: 48,
        borderWidth: 1,
        borderRadius: radius.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    input: {
        flex: 1,
        fontSize: typography.size.body,
        paddingVertical: 0,
    },
    helper: {
        fontSize: typography.size.micro,
        marginTop: spacing.xs,
        lineHeight: 16,
    },
});

export default TextField;
