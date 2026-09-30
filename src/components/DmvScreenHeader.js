import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, RADIUS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import Icon from '../helpers/Icon';
import { Typography } from '../atomComponents';

/**
 * Ported from DmvScreenHeader — 40pt round back button, centred Barlow title
 * with 0.14em tracking, optional right element, bottom hairline.
 */
export const DmvScreenHeader = ({ title, subtitle, onBack, rightElement, style }) => {
  const navigation = useNavigation();
  const goBack = () => {
    if (onBack) return onBack();
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View style={[styles.wrap, style]}>
      <Pressable onPress={goBack} hitSlop={6} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
        <Icon name="chevron-left" size={Sizer.fS(20)} color={COLORS.white} />
      </Pressable>

      <View style={styles.center}>
        <Typography
          size={16}
          fFamily="displayBold700"
          color={COLORS.white}
          textTransform="uppercase"
          letterSpacing={2.24}
          textAlign="center"
          numberOfLines={1}
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography size={11} color="#A1A1AA" textAlign="center" numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Typography>
        ) : null}
      </View>

      <View style={styles.right}>{rightElement}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Sizer.vSize(4),
    paddingBottom: Sizer.vSize(12),
    marginBottom: Sizer.vSize(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.hairline,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.fgA10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { transform: [{ scale: 0.95 }], backgroundColor: '#27272A' },
  center: { flex: 1, alignItems: 'center', paddingHorizontal: Sizer.hSize(8), minWidth: 0 },
  subtitle: { marginTop: -2 },
  right: { width: 40, alignItems: 'flex-end' },
});

export default DmvScreenHeader;
