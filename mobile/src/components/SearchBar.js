import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { radius, spacing, typography } from '../theme/theme';

/**
 * SearchBar — standard text input for filtering content.
 */
const SearchBar = ({
    value,
    onChangeText,
    placeholder = 'Search...',
    style,
    ...props
}) => {
    const { colors } = useTheme();

    return (
        <View style={[
            styles.container,
            { backgroundColor: colors.card, borderColor: colors.border },
            style
        ]}>
            <MaterialCommunityIcons name="magnify" size={20} color={colors.subtext} />
            
            <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor={colors.subtext}
                clearButtonMode="never" // We implement our own clear button for Android/iOS consistency
                {...props}
            />

            {!!value && value.length > 0 && (
                <TouchableOpacity
                    onPress={() => onChangeText('')}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityLabel="Clear search"
                    accessibilityRole="button"
                >
                    <MaterialCommunityIcons name="close-circle" size={18} color={colors.subtext} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        borderRadius: radius.md,
        borderWidth: 1,
        paddingHorizontal: spacing.md,
        height: 48,
    },
    input: {
        flex: 1,
        fontSize: typography.size.body,
        paddingVertical: 0, // Important for Android vertical centering
    },
});

export default SearchBar;
