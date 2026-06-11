import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { radius, shadows, spacing } from '../theme/theme';

/**
 * Card — the single surface primitive. Flat, bordered, subtle shadow.
 */
const Card = ({ children, style, padded = true }) => {
    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.card,
                shadows.card,
                { backgroundColor: colors.card, borderColor: colors.border },
                padded && styles.padded,
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: radius.lg,
        marginBottom: spacing.lg,
    },
    padded: { padding: spacing.lg },
});

export default Card;
