import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import { Typography } from '../atomComponents';

/** Ported from DmvSegmentedControl — inset card with a gradient active tab. */
export const DmvSegmentedControl = ({ options, value, onChange, style }) => (
  <View style={[styles.wrap, style]}>
    {options.map(opt => {
      const active = opt.value === value;
      return (
        <Pressable
          key={opt.value}
          onPress={() => onChange(opt.value)}
          style={[styles.tab, active && styles.tabActive]}
        >
          {active ? (
            <LinearGradient
              colors={['#8D22FF', '#A84DF0']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.fill}
            />
          ) : null}
          {opt.icon}
          <Typography
            size={13.5}
            fFamily="bodyBold700"
            color={active ? COLORS.white : '#A1A1AA'}
            textAlign="center"
          >
            {opt.label}
          </Typography>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: Sizer.hSize(6),
    padding: Sizer.hSize(6),
    backgroundColor: '#141417',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.fgA10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(6),
    paddingVertical: Sizer.vSize(10),
    paddingHorizontal: Sizer.hSize(12),
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabActive: {
    // mock: scale-[1.02] on the active tab
    transform: [{ scale: 1.02 }],
    borderWidth: 1,
    borderColor: 'rgba(192,132,252,0.4)',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});

export default DmvSegmentedControl;
