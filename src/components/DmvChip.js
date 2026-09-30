import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, RADIUS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import { RichText } from './RichText';

const VARIANTS = {
  neutral: { bg: COLORS.raised, fg: COLORS.foreground, border: 'rgba(232,232,236,0.08)' },
  violet: { bg: 'rgba(141,34,255,0.22)', fg: COLORS.primarySoft, border: 'rgba(141,34,255,0.4)' },
  success: { bg: 'rgba(46,212,122,0.16)', fg: COLORS.success, border: 'rgba(46,212,122,0.3)' },
  warning: { bg: 'rgba(255,176,32,0.16)', fg: COLORS.warning, border: 'rgba(255,176,32,0.3)' },
  danger: { bg: 'rgba(255,77,94,0.16)', fg: COLORS.danger, border: 'rgba(255,77,94,0.3)' },
};

/** Ported from DmvChip — pill, 10pt Inter 600. */
export const DmvChip = ({ children, label, variant = 'neutral', icon, style }) => {
  const v = VARIANTS[variant] ?? VARIANTS.neutral;
  const text = label ?? (typeof children === 'string' ? children : null);
  return (
    <View style={[styles.chip, { backgroundColor: v.bg, borderColor: v.border }, style]}>
      {icon}
      {text != null ? (
        <RichText size={10} fFamily="bodySemiBold600" color={v.fg}>
          {text}
        </RichText>
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(4),
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: Sizer.hSize(8),
    paddingVertical: Sizer.vSize(2),
  },
});

export default DmvChip;
