import React from 'react';
import { Image } from 'react-native';
import Sizer from '../helpers/Sizer';
import { EMOJI_IMAGES } from '../assets/images';

/**
 * Emoji are drawn as PNGs rendered from Apple Color Emoji rather than as text:
 * the simulator refuses to draw emoji glyphs at all, and this also keeps them
 * identical between iOS and Android.
 */
export const Emoji = ({ char, size = 16, style }) => {
  const source = EMOJI_IMAGES[char];
  if (!source) return null;
  const s = Sizer.fS(size);
  return <Image source={source} resizeMode="contain" style={[{ width: s, height: s }, style]} />;
};

export default Emoji;
