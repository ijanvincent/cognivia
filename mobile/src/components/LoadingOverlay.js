import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { radius, spacing, typography } from '../theme/theme';

/**
 * LoadingOverlay — blocking progress modal for long-running operations.
 */
const LoadingOverlay = ({ visible, title, message }) => {
    const { colors } = useTheme();

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
            <View style={styles.scrim}>
                <View
                    style={[
                        styles.box,
                        { backgroundColor: colors.card, borderColor: colors.border },
                    ]}
                >
                    <ActivityIndicator size="large" color={colors.primary} />
                    {!!title && (
                        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    )}
                    {!!message && (
                        <Text style={[styles.message, { color: colors.subtext }]}>{message}</Text>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    scrim: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xxl,
        backgroundColor: 'rgba(11,17,32,0.72)',
    },
    box: {
        width: '100%',
        maxWidth: 320,
        borderWidth: 1,
        borderRadius: radius.lg,
        padding: spacing.xxl,
        alignItems: 'center',
    },
    title: {
        marginTop: spacing.lg,
        fontSize: typography.size.heading,
        fontWeight: typography.weight.bold,
        textAlign: 'center',
    },
    message: {
        marginTop: spacing.xs,
        fontSize: typography.size.caption,
        lineHeight: 20,
        textAlign: 'center',
    },
});

export default LoadingOverlay;
