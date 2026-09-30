import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, RADIUS } from '../globalStyle/Theme';

/** Ported from DmvMeter — 5pt track, rounded, violet fill by default. */
export const DmvMeter = ({ value, max = 100, fillColor = COLORS.primary, height = 5, style }) => {
  const pct = Math.min(100, Math.max(0, (value / (max || 1)) * 100));
  return (
    <View style={[styles.track, { height }, style]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: fillColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: { width: '100%', borderRadius: RADIUS.full, backgroundColor: 'rgba(232,232,236,0.12)', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: RADIUS.full },
});

export default DmvMeter;
