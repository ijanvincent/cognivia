import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { radius, spacing, typography } from '../theme/theme';
import Button from './Button';
import Card from './Card';

/**
 * EmptyState — icon, title, body copy, and an optional action button.
 */
const EmptyState = ({ icon, title, body, actionLabel, onAction }) => {
    const { colors } = useTheme();

    return (
        <Card style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: colors.surfaceSubtle }]}>
                <MaterialCommunityIcons name={icon} size={32} color={colors.subtext} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {!!body && (
                <Text style={[styles.body, { color: colors.subtext }]}>{body}</Text>
            )}
            {!!actionLabel && (
                <Button
                    label={actionLabel}
                    onPress={onAction}
                    icon="plus"
                    style={styles.action}
                />
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        alignItems: 'center',
        paddingVertical: spacing.xxxl,
    },
    iconWrap: {
        width: 64,
        height: 64,
        borderRadius: radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.size.heading,
        fontWeight: typography.weight.bold,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    body: {
        fontSize: typography.size.caption,
        lineHeight: 20,
        textAlign: 'center',
        maxWidth: 280,
    },
    action: { marginTop: spacing.xl, alignSelf: 'center' },
});

export default EmptyState;
