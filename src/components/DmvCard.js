import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { COLORS, RADIUS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import { Typography } from '../atomComponents';

/** Surface card used across the screens (#18181B, hairline border). */
export const DmvCard = ({ children, style, onPress, padded = true }) => {
  const content = <View style={[styles.card, padded && styles.padded, style]}>{children}</View>;
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.99 : 1 }] }]}>
      {content}
    </Pressable>
  );
};

/** Barlow micro heading used above card groups. */
export const DmvSectionLabel = ({ children, style }) => (
  <Typography variant="micro" style={style}>
    {children}
  </Typography>
);

/** Divider hairline. */
export const DmvDivider = ({ style }) => <View style={[styles.divider, style]} />;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.lg,
  },
  padded: { padding: Sizer.hSize(16) },
  divider: { height: 1, backgroundColor: COLORS.divider },
});

export default DmvCard;
