import { Dimensions } from 'react-native';
import Sizer from '../helpers/Sizer';


export const COLORS = {
  // Surfaces
  background: '#121212',
  backgroundDeep: '#0C0C0E',
  surface: '#18181B',
  surface2: '#1F1F23',
  raised: '#272727',
  card: '#18181B',

  // Brand
  primary: '#8D22FF',
  primarySoft: '#B36BFF',
  primaryDim: 'rgba(141, 34, 255, 0.14)',

  // Text
  foreground: '#E8E8EC',
  cardForeground: '#E8E8EC',
  muted: '#9A9AA5',
  faint: '#6E6E78',
  white: '#FFFFFF',
  black: '#000000',

  // Status
  success: '#2ED47A',
  warning: '#FFB020',
  danger: '#FF4D5E',
  info: '#3DA9FC',

  // Lines
  divider: 'rgba(232, 232, 236, 0.09)',
  dividerStrong: 'rgba(232, 232, 236, 0.16)',
  border: 'rgba(232, 232, 236, 0.09)',
  hairline: 'rgba(255, 255, 255, 0.1)',

  // Tab bar
  tabbarBg: '#0F0F11',
  tabbarInactive: '#6E6E78',

  // Common alphas used across screens
  fgA30: 'rgba(232, 232, 236, 0.3)',
  fgA12: 'rgba(232, 232, 236, 0.12)',
  fgA10: 'rgba(232, 232, 236, 0.1)',
  fgA06: 'rgba(232, 232, 236, 0.06)',
  primaryA10: 'rgba(141, 34, 255, 0.1)',
  primaryA20: 'rgba(141, 34, 255, 0.2)',
  primaryA30: 'rgba(141, 34, 255, 0.3)',
  successDim: 'rgba(46, 212, 122, 0.14)',
  warningDim: 'rgba(255, 176, 32, 0.14)',
  dangerDim: 'rgba(255, 77, 94, 0.14)',
  infoDim: 'rgba(61, 169, 252, 0.14)',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

/** --radius-* from styles.css (this app does use real corner radii). */
export const RADIUS = {
  sm: 8,
  md: 11,
  lg: 14,
  xl: 18,
  '2xl': 20,
  full: 9999,
};

/**
 * Barlow Condensed (display, uppercase), Inter (body), JetBrains Mono
 * (tabular numbers). Named by PostScript name so one string works on both
 * platforms.
 */
export const FONTS = {
  displayMedium500: 'BarlowCondensed-Medium',
  displaySemiBold600: 'BarlowCondensed-SemiBold',
  displayBold700: 'BarlowCondensed-Bold',

  bodyRegular400: 'Inter-Regular',
  bodyMedium500: 'Inter-Medium',
  bodySemiBold600: 'Inter-SemiBold',
  bodyBold700: 'Inter-Bold',
  bodyExtraBold800: 'Inter-ExtraBold',
  bodyBlack900: 'Inter-Black',

  monoRegular400: 'JetBrainsMono-Regular',
  monoMedium500: 'JetBrainsMono-Medium',
  monoSemiBold600: 'JetBrainsMono-SemiBold',
  monoBold700: 'JetBrainsMono-Bold',
};

export const WINDOW = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  screenPx: 20,
};

/**
 * The Apple HIG scale defined in styles.css (.hig-*), plus the custom
 * micro-typography classes. Display styles are uppercase with 0.04em tracking.
 */
export const TYPE = {
  largeTitle: {
    size: 32, lineHeight: 38, fFamily: 'displayBold700',
    color: COLORS.foreground, textTransform: 'uppercase', letterSpacing: 1.28,
  },
  h1: {
    size: 24, lineHeight: 30, fFamily: 'displayBold700',
    color: COLORS.foreground, textTransform: 'uppercase', letterSpacing: 0.96,
  },
  h2: {
    size: 20, lineHeight: 26, fFamily: 'bodyBold700',
    color: COLORS.foreground, letterSpacing: -0.2,
  },
  h3: { size: 17, lineHeight: 23, fFamily: 'bodySemiBold600', color: COLORS.foreground },
  body: { size: 15.5, lineHeight: 23, fFamily: 'bodyRegular400', color: COLORS.foreground },
  secondary: { size: 13.5, lineHeight: 19, fFamily: 'bodyRegular400', color: COLORS.muted },
  caption: { size: 12, lineHeight: 16, fFamily: 'bodyMedium500', color: COLORS.faint },

  /** .micro-label — 10px Barlow, 0.14em tracking */
  micro: {
    size: 10, lineHeight: 13, fFamily: 'displaySemiBold600',
    color: COLORS.faint, textTransform: 'uppercase', letterSpacing: 1.4,
  },
  /** .heading-display — 21px Barlow */
  headingDisplay: {
    size: 21, lineHeight: 22, fFamily: 'displaySemiBold600',
    color: COLORS.foreground, textTransform: 'uppercase', letterSpacing: 0.84,
  },
  /** .tagline-text — 10px Barlow, 0.24em tracking */
  tagline: {
    size: 10, lineHeight: 13, fFamily: 'displaySemiBold600',
    color: COLORS.faint, textTransform: 'uppercase', letterSpacing: 2.4,
  },
  /** Tabular figures for metrics */
  mono: { size: 13, lineHeight: 18, fFamily: 'monoMedium500', color: COLORS.foreground },
};

export const SHADOWS = {
  none: {},
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  glow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
};

export const GLOBALSTYLE = {
  wrap: { flex: 1, backgroundColor: COLORS.backgroundDeep },
  paddingHor: { paddingHorizontal: Sizer.hSize(SPACING.screenPx) },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.lg,
  },
};
