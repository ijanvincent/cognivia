import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme';

const AuthInput = ({
    label, value, onChangeText, placeholder,
    secureTextEntry, keyboardType, autoCapitalize,
    rightIcon, onRightIconPress, error, editable, icon,
}) => {
    const [focused, setFocused] = useState(false);

    return (
        <View style={styles.formGroup}>
            <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
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
            {!!error && <Text style={styles.errorText}>{error}</Text>}
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