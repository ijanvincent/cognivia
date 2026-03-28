import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const COLORS = {
    bg:            '#07080f',
    bgCard:        'rgba(255,255,255,0.04)',
    bgCardBorder:  'rgba(255,255,255,0.09)',
    inputBg:       'rgba(255,255,255,0.05)',
    inputBorder:   'rgba(255,255,255,0.10)',
    inputFocus:    'rgba(34,211,238,0.45)',
    cyan:          '#22d3ee',
    pink:          '#e879f9',
    purple:        '#a855f7',
    textPrimary:   '#f1f5f9',
    textSecondary: 'rgba(241,245,249,0.55)',
    textMuted:     'rgba(241,245,249,0.35)',
    error:         '#f87171',
    errorBg:       'rgba(248,113,113,0.08)',o
    successBg:     'rgba(52,211,153,0.08)',
    successBorder: '#34d399',
};

const AuthInput = ({
    label, value, onChangeText, placeholder,
    secureTextEntry, keyboardType, autoCapitalize,
    rightIcon, onRightIconPress, error, editable, icon,
}) => {
    const [focused, setFocused] = useState(false);

    return (
        <View style={styles.formGroup}>
            <Text style={[styles.label, focused && styles.labelFocused]}>
                {label}
            </Text>
            <View style={[
                styles.inputContainer,
                focused && styles.inputContainerFocused,
                !!error && styles.inputContainerError,
            ]}>
                {icon && (
                    <MaterialCommunityIcons
                        name={icon}
                        size={18}
                        color={focused ? COLORS.cyan : COLORS.textMuted}
                        style={styles.inputIcon}
                    />
                )}
                <TextInput
                    style={styles.inputField}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.textMuted}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType || 'default'}
                    autoCapitalize={autoCapitalize || 'none'}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    editable={editable !== false}
                    autoCorrect={false}
                />
                {rightIcon && (
                    <TouchableOpacity
                        onPress={onRightIconPress}
                        style={styles.eyeButton}
                        disabled={editable === false}
                    >
                        <MaterialCommunityIcons
                            name={rightIcon}
                            size={18}
                            color={focused ? COLORS.cyan : COLORS.textMuted}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {!!error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    formGroup:             { marginBottom: 20 },
    label:                 { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
    labelFocused:          { color: COLORS.cyan },
    inputContainer:        { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderWidth: 1, borderColor: COLORS.inputBorder, borderRadius: 10, paddingHorizontal: 14, height: 52 },
    inputContainerFocused: { borderColor: COLORS.inputFocus, backgroundColor: 'rgba(34,211,238,0.03)' },
    inputContainerError:   { borderColor: 'rgba(248,113,113,0.5)', backgroundColor: COLORS.errorBg },
    inputIcon:             { marginRight: 10 },
    inputField:            { flex: 1, fontSize: 15, color: COLORS.textPrimary, paddingVertical: 0 },
    eyeButton:             { paddingLeft: 10 },
    errorText:             { fontSize: 12, color: COLORS.error, fontWeight: '500', marginTop: 6 },
});

export default AuthInput;