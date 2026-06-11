import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { spacing } from '../theme/theme';

// Content column is capped so layouts hold up on tablets and landscape
// instead of stretching edge to edge.
const MAX_CONTENT_WIDTH = 560;

/**
 * Screen — shared page container.
 *
 * Owns the concerns every screen was duplicating: themed background,
 * status-bar style, safe-area top inset, horizontal padding, and a
 * centered max-width content column.
 */
const Screen = ({
    children,
    scroll = true,
    refreshControl,
    keyboardShouldPersistTaps = 'handled',
    contentStyle,
}) => {
    const { colors, theme } = useTheme();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    const contentWidth = Math.min(width, MAX_CONTENT_WIDTH);

    const innerStyle = [
        styles.content,
        {
            paddingTop: insets.top + spacing.lg,
            width: contentWidth,
        },
        contentStyle,
    ];

    return (
        <View style={[styles.root, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
            {scroll ? (
                <ScrollView
                    style={styles.fill}
                    contentContainerStyle={styles.scrollOuter}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                    refreshControl={refreshControl}
                >
                    <View style={innerStyle}>{children}</View>
                </ScrollView>
            ) : (
                <View style={[styles.scrollOuter, styles.fill]}>
                    <View style={[innerStyle, styles.fill]}>{children}</View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    root:        { flex: 1 },
    fill:        { flex: 1 },
    scrollOuter: { alignItems: 'center' },
    content:     {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxxl,
    },
});

export default Screen;
