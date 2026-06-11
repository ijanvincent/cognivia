import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, typography } from '../theme/theme';

/**
 * ScreenHeader — uppercase eyebrow + page title, with an optional
 * right-aligned slot (avatar button, action, etc.).
 */
const ScreenHeader = ({ eyebrow, title, right }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.row}>
            <View style={styles.copy}>
                {!!eyebrow && (
                    <Text style={[styles.eyebrow, { color: colors.subtext }]}>{eyebrow}</Text>
                )}
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                    {title}
                </Text>
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
        marginBottom: spacing.xl,
    },
    copy: { flex: 1, paddingRight: spacing.lg },
    eyebrow: {
        fontSize: typography.size.micro,
        fontWeight: typography.weight.semibold,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: spacing.xs,
    },
    title: {
        fontSize: typography.size.display,
        fontWeight: typography.weight.bold,
        letterSpacing: -0.4,
    },
});

export default ScreenHeader;
