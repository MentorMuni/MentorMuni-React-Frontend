// Minimal design tokens — product UI (warm light + orange accent)
const designSystem = {
  colors: {
    primary: '#FF9500',
    primaryDark: '#E88600',
    secondary: '#FFB347',
    accent: '#FF9500',
    bg: '#FFFDF8',
    surface: '#FFFFFF',
    text: '#1A1A1A',
  },
  spacing: {
    container: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
  },
  typography: {
    heading: 'Inter, system-ui, -apple-system',
    body: 'Inter, system-ui, -apple-system',
  },
};

export default designSystem;
/**
 * MentorMuni Design System
 * Centralized configuration for colors, typography, and spacing
 * Ensures visual consistency across the entire platform
 */

// ============================================================
// COLOR PALETTE
// ============================================================

export const colors = {
  /** Brand accent is orange (#FF9500); indigo scale below is legacy / charts only */
  // Primary (indigo) — optional for data viz, not default CTAs
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Primary brand color
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  // Secondary Color - Purple
  // Used for section highlights, feature backgrounds, card accents
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Secondary brand color
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Accent Color - Orange
  // Used for CTAs, upgrade prompts, important conversion actions
  accent: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316', // Accent brand color
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  // Neutral Colors
  neutral: {
    white: '#ffffff',
    black: '#000000',
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },

  // Status Colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Gradients
  gradients: {
    primary: 'from-[#FF9500] to-blue-500',
    secondary: 'from-purple-500 to-pink-500',
    accent: 'from-orange-500 to-red-500',
    cool: 'from-cyan-500 to-blue-500',
    warm: 'from-amber-500 to-orange-500',
  },
};

// ============================================================
// TYPOGRAPHY
// ============================================================

export const typography = {
  fonts: {
    heading: 'Inter, Poppins, sans-serif', // For headings
    body: 'Inter, sans-serif', // For body text
  },

  // Font sizes with semantic names
  sizes: {
    // Hero/Page title
    hero: {
      mobile: '36px', // text-3xl
      tablet: '42px', // text-4xl
      desktop: '56px', // text-5xl or 6xl
      weight: '900', // font-black
      lineHeight: '1.1',
    },

    // Section heading
    section: {
      mobile: '28px', // text-2xl
      tablet: '32px', // text-3xl
      desktop: '36px', // text-4xl
      weight: '800', // font-black
      lineHeight: '1.2',
    },

    // Subsection / large card title
    subsection: {
      size: '24px', // text-2xl
      weight: '700', // font-bold
      lineHeight: '1.3',
    },

    // Card title / medium heading
    cardTitle: {
      size: '20px', // text-xl
      weight: '700', // font-bold
      lineHeight: '1.3',
    },

    // Body text / paragraph
    body: {
      size: '16px', // text-base
      weight: '400', // font-normal
      lineHeight: '1.6',
    },

    // Small text / caption
    small: {
      size: '14px', // text-sm
      weight: '500', // font-medium
      lineHeight: '1.5',
    },

    // Extra small text / micro copy
    xs: {
      size: '12px', // text-xs
      weight: '500',
      lineHeight: '1.4',
    },
  },
};

// ============================================================
// SPACING SCALE
// ============================================================

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '2.5rem', // 40px
  '3xl': '3rem', // 48px
  '4xl': '4rem', // 64px
  '5xl': '5rem', // 80px
};

// ============================================================
// COMPONENT STYLES
// ============================================================

export const componentStyles = {
  // Button styles
  buttons: {
    primary: `px-6 py-3 rounded-lg font-bold text-white 
              bg-gradient-to-r from-[#FF9500] to-blue-600 
              hover:from-[#FF9500] hover:to-blue-500 
              hover:shadow-lg hover:shadow-[0_4px_14px_rgba(255,149,0,0.2)]
              transition-all active:scale-95 
              disabled:opacity-50 disabled:cursor-not-allowed`,

    secondary: `px-6 py-3 rounded-lg font-bold text-slate-300 
               border border-purple-500/30 
               bg-purple-500/10 hover:bg-purple-500/20 
               hover:border-purple-500/50 
               transition-all active:scale-95`,

    accent: `px-6 py-3 rounded-lg font-bold text-white 
            bg-gradient-to-r from-orange-500 to-red-500 
            hover:from-orange-600 hover:to-red-600 
            hover:shadow-lg hover:shadow-orange-500/30
            transition-all active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed`,

    outline: `px-6 py-3 rounded-lg font-bold text-[#FF9500] 
             border border-[#FF9500]/35 
             hover:border-[#FF9500]/60 hover:bg-[#E88600]/10
             transition-all active:scale-95`,
  },

  // Card styles
  cards: {
    base: `bg-gradient-to-br from-slate-800/50 to-slate-800/20 
           border border-slate-700/50 rounded-2xl p-6 
           hover:border-slate-600 transition-all`,

    interactive: `bg-gradient-to-br from-slate-800/50 to-slate-800/20 
                 border border-slate-700/50 rounded-2xl p-6 
                 hover:border-[#FF9500]/50 hover:shadow-lg 
                 hover:shadow-[0_2px_12px_rgba(255,149,0,0.15)] transition-all`,

    elevated: `bg-gradient-to-br from-slate-800/80 to-slate-900/50 
              border border-slate-600/50 rounded-2xl p-8 
              shadow-lg shadow-black/20 backdrop-blur`,
  },

  // Section container
  section: `py-20 px-6 bg-gradient-to-b 
           from-transparent via-slate-900/30 to-transparent 
           border-y border-slate-800/50`,

  // Max width container
  container: `max-w-7xl mx-auto`,
};

// ============================================================
// BREAKPOINTS
// ============================================================

export const breakpoints = {
  mobile: '640px', // sm
  tablet: '768px', // md
  desktop: '1024px', // lg
  wide: '1280px', // xl
  ultraWide: '1536px', // 2xl
};

// ============================================================
// SHADOWS
// ============================================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};

// ============================================================
// TRANSITIONS
// ============================================================

export const transitions = {
  fast: 'transition-all duration-150',
  base: 'transition-all duration-300',
  slow: 'transition-all duration-500',
};

export default {
  colors,
  typography,
  spacing,
  componentStyles,
  breakpoints,
  shadows,
  transitions,
};
