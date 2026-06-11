import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { radius } from '../theme/theme';

/**
 * ProgressBar — thin determinate bar. `value` is clamped to 0–100.
 */
const ProgressBar = ({ value, color, style }) => {
    const { colors } = useTheme();
    const clamped = Math.min(100, Math.max(0, Number(value) || 0));

    return (
        <View style={[styles.track, { backgroundColor: colors.surfaceSubtle }, style]}>
            <View
                style={[
                    styles.fill,
                    { width: `${clamped}%`, backgroundColor: color || colors.primary },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    track: {
        height: 6,
        borderRadius: radius.pill,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: radius.pill,
    },
});

export default ProgressBar;
