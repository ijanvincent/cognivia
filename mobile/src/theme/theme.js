/**
 * theme.js — single source of truth for app colors.
 *
 * COLORS:                  fixed palette for the auth/onboarding flow.
 * lightTheme / darkTheme:  mode-aware palettes consumed via ThemeContext.
 */

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
    errorBg:       'rgba(248,113,113,0.08)',
    successBg:     'rgba(52,211,153,0.08)',
    successBorder: '#34d399',
};
export const lightTheme = {
    primary:    '#007AFF',
    secondary:  '#FF9500',
    background: '#F5F5F5',
    card:       '#FFFFFF',
    text:       '#333333',
    subtext:    '#666666',
    border:     '#E0E0E0',
    status:     '#4CAF50',
    logout:     '#FF3B30',
};

export const darkTheme = {
    primary:    '#FFFFFF',
    secondary:  '#BBBBBB',
    background: '#000000',
    card:       '#1E1E1E',
    text:       '#FFFFFF',
    subtext:    '#AAAAAA',
    border:     '#333333',
    status:     '#FFFFFF',
    logout:     '#FF3B30',
};
