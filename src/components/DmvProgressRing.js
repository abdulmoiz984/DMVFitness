import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { COLORS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import { Typography } from '../atomComponents';

/**
 * Ported from DmvProgressRing — 132pt ring, 11pt stroke, round cap, sweeping
 * clockwise from 12 o'clock, with the value and caption centred.
 */
export const DmvProgressRing = ({
  current,
  target,
  caption = 'OF 2,000 KCAL',
  size = 132,
  strokeWidth = 11,
  style,
}) => {
  const px = Sizer.hSize(size);
  const stroke = Sizer.hSize(strokeWidth);
  const radius = (px - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(1, Math.max(0, current / (target || 1)));
  const offset = circumference - ratio * circumference;

  return (
    <View style={[styles.wrap, { width: px, height: px }, style]}>
      <Svg width={px} height={px}>
        <G rotation={-90} originX={px / 2} originY={px / 2}>
          <Circle
            cx={px / 2}
            cy={px / 2}
            r={radius}
            stroke="rgba(232,232,236,0.12)"
            strokeWidth={stroke}
            fill="none"
          />
          <Circle
            cx={px / 2}
            cy={px / 2}
            r={radius}
            stroke={COLORS.primary}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
          />
        </G>
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Typography size={27} lineHeight={32} fFamily="monoSemiBold600" color={COLORS.foreground}>
          {Number(current).toLocaleString()}
        </Typography>
        <Typography
          size={8.5}
          fFamily="displaySemiBold600"
          color={COLORS.faint}
          textTransform="uppercase"
          letterSpacing={1.19}
          textAlign="center"
          mT={2}
        >
          {caption}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  // Explicit insets: spreading StyleSheet.absoluteFillObject does not apply on RN 0.87.
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DmvProgressRing;
