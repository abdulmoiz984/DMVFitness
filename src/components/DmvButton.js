import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import { RichText } from './RichText';

/** primary gradient: linear-gradient(to right, #8D22FF, #A84DF0) */
export const PRIMARY_GRADIENT = ['#8D22FF', '#A84DF0'];

/**
 * Ported from DmvButton in components/dmv-ui/index.tsx —
 * 52pt tall, radius 16, Inter Bold 15.
 */
export const DmvButton = ({
  children,
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  icon = null,
  style,
  textStyle,
}) => {
  const off = disabled || loading;
  const label = title ?? (typeof children === 'string' ? children : null);

  const content = (
    <View style={styles.row}>
      {icon}
      {label ? (
        <RichText
          size={15}
          // `quiet` is the one variant the mock drops to font-medium.
          fFamily={variant === 'quiet' ? 'bodyMedium500' : 'bodyBold700'}
          color={variant === 'quiet' ? '#A1A1AA' : COLORS.white}
          numberOfLines={1}
          style={textStyle}
        >
          {label}
        </RichText>
      ) : (
        children
      )}
    </View>
  );

  const body = loading ? <ActivityIndicator color={COLORS.white} /> : content;

  return (
    <Pressable
      onPress={off ? undefined : onPress}
      disabled={off}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.full,
        VARIANT_STYLE[variant],
        { opacity: off ? 0.5 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
        style,
      ]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={PRIMARY_GRADIENT}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {body}
    </Pressable>
  );
};

const VARIANT_STYLE = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  ghost: { backgroundColor: '#141417', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  quiet: { backgroundColor: 'transparent' },
  danger: {
    backgroundColor: COLORS.danger,
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  secondary: { backgroundColor: '#1C1C20', borderWidth: 1, borderColor: COLORS.fgA10 },
});

const styles = StyleSheet.create({
  base: {
    height: Sizer.vSize(52),
    borderRadius: 16,
    paddingHorizontal: Sizer.hSize(20),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  full: { width: '100%' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Sizer.hSize(8) },
});

export default DmvButton;
