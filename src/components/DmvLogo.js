import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import Sizer from '../helpers/Sizer';
import { images } from '../assets/images';

/** dmv-logo.png is 1218 × 1152, so `w-auto` in the mock means this ratio. */
export const LOGO_RATIO = 1218 / 1152;

/** Resolves the mock's `h-13 w-auto` / `w-[210px] h-auto` to explicit points. */
export const logoBox = ({ height, width }) => {
  if (height != null) return { width: Sizer.hSize(height * LOGO_RATIO), height: Sizer.hSize(height) };
  return { width: Sizer.hSize(width), height: Sizer.hSize(width / LOGO_RATIO) };
};

/**
 * The violet halo the mock paints behind the logo with
 * `-inset-N bg-[#8D22FF]/X blur-lg`. RN has no backdrop blur, so the soft
 * edge is drawn as a radial gradient instead of a flat rounded rect — a flat
 * one reads as a hard violet pill.
 */
export const LogoGlow = ({ width, height, inset = 8, opacity = 0.2 }) => {
  const w = width + inset * 2;
  const h = height + inset * 2;
  return (
    <Svg width={w} height={h} style={[styles.glow, { top: -inset, left: -inset }]} pointerEvents="none">
      <Defs>
        <RadialGradient id="logoGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#8D22FF" stopOpacity={opacity} />
          <Stop offset="0.45" stopColor="#8D22FF" stopOpacity={opacity * 0.85} />
          <Stop offset="1" stopColor="#8D22FF" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Ellipse cx={w / 2} cy={h / 2} rx={w / 2} ry={h / 2} fill="url(#logoGlow)" />
    </Svg>
  );
};

/** The official DMV Fitness logo at its true aspect ratio. */
export const DmvLogo = ({ height, width, style }) => (
  <Image source={images.logo} resizeMode="contain" style={[logoBox({ height, width }), style]} />
);

const styles = StyleSheet.create({
  glow: { position: 'absolute' },
});

export default DmvLogo;
