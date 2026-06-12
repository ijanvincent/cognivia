/**
 * theme.js — single source of truth for design tokens.
 *
 * COLORS:                  fixed palette for the auth/onboarding flow (dark).
 * lightTheme / darkTheme:  mode-aware palettes consumed via ThemeContext.
 * spacing / radius / typography / shadows: layout and type scales shared by
 * every screen — use these instead of magic numbers.
 *
 * Palette rationale: slate neutrals with a single blue accent and three
 * semantic colors (success / warning / danger). Screens must consume these
 * tokens rather than hardcoding hex values, so light/dark stay consistent
 * and rebrands are a one-file change.
 */

// ---------------------------------------------------------------------------
// Layout & type scales
// ---------------------------------------------------------------------------

export const spacing = {
    xs:  4,
    sm:  8,
    md:  12,
    lg:  16,
    xl:  20,
    xxl: 24,
    xxxl: 32,
};

export const radius = {
    sm:   8,
    md:   12,
    lg:   16,
    xl:   20,
    pill: 999,
};

export const typography = {
    size: {
        display: 28,
        title:   22,
        heading: 17,
        body:    15,
        caption: 13,
        micro:   11,
    },
    weight: {
        regular:  '400',
        medium:   '500',
        semibold: '600',
        bold:     '700',
    },
};

// Single subtle elevation used app-wide; heavier shadows read as dated.
export const shadows = {
    card: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
    },
    soft: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
};

// ---------------------------------------------------------------------------
// Auth flow palette (fixed dark)
// Keys are kept stable for the auth screens; values follow the brand accent.
// ---------------------------------------------------------------------------

export const COLORS = {
    bg: '#0B1120',
    bgCard: 'rgba(255,255,255,0.04)',
    bgCardBorder: 'rgba(255,255,255,0.08)',
    inputBg: 'rgba(255,255,255,0.05)',
    inputBorder: 'rgba(255,255,255,0.10)',
    inputFocus: 'rgba(59,130,246,0.55)',
    cyan: '#3B82F6',
    pink: '#60A5FA',
    purple: '#2563EB',
    textPrimary: '#F1F5F9',
    textSecondary: 'rgba(241,245,249,0.60)',
    textMuted: 'rgba(241,245,249,0.38)',
    error: '#F87171',
    errorBg: 'rgba(248,113,113,0.08)',
    successBg: 'rgba(52,211,153,0.08)',
    successBorder: '#34D399',
};

// ---------------------------------------------------------------------------
// App palettes
// ---------------------------------------------------------------------------

export const lightTheme = {
    // brand
    primary: '#2563EB',
    primarySoft: 'rgba(37,99,235,0.08)',
    onPrimary: '#FFFFFF',

    // surfaces
    background: '#F8FAFC',
    card: '#FFFFFF',
    surfaceSubtle: '#F1F5F9',
    surfaceDeeper: '#E2E8F0',

    // content
    text: '#0F172A',
    subtext: '#64748B',
    border: '#E2E8F0',

    // semantic
    success: '#10B981',
    successSoft: 'rgba(16,185,129,0.10)',
    warning: '#F59E0B',
    warningSoft: 'rgba(245,158,11,0.10)',
    danger: '#EF4444',
    dangerSoft: 'rgba(239,68,68,0.08)',

    // legacy aliases (older screens) — prefer the semantic names above
    secondary: '#64748B',
    status: '#10B981',
    logout: '#EF4444',
};

export const darkTheme = {
    // brand
    primary: '#3B82F6',
    primarySoft: 'rgba(59,130,246,0.12)',
    onPrimary: '#FFFFFF',

    // surfaces
    background: '#0B1120',
    card: '#151C2C',
    surfaceSubtle: 'rgba(255,255,255,0.03)',
    surfaceDeeper: 'rgba(255,255,255,0.08)',

    // content
    text: '#F1F5F9',
    subtext: '#94A3B8',
    border: '#1E293B',

    // semantic
    success: '#34D399',
    successSoft: 'rgba(52,211,153,0.12)',
    warning: '#FBBF24',
    warningSoft: 'rgba(251,191,36,0.12)',
    danger: '#F87171',
    dangerSoft: 'rgba(248,113,113,0.10)',

    // legacy aliases (older screens) — prefer the semantic names above
    secondary: '#94A3B8',
    status: '#34D399',
    logout: '#F87171',
};
