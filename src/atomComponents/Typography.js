import React from 'react';
import { Platform, Text } from 'react-native';
import { COLORS, FONTS, TYPE } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';

/**
 * Single text primitive. `variant` pulls a preset from Theme.TYPE (the mock's
 * .hig-* / micro-typography classes); individual props override it.
 *
 * Every weight is its own bundled font file, so never set fontWeight here.
 */
const Typography = ({
  variant,
  color,
  size,
  mT = 0,
  mB = 0,
  mL = 0,
  mR = 0,
  fFamily,
  textAlign = 'left',
  textTransform,
  numberOfLines,
  lineHeight,
  letterSpacing,
  fontStyle,
  flex,
  children,
  style,
  onPress,
  ...props
}) => {
  const preset = variant ? TYPE[variant] : null;
  const resolvedSize = size ?? preset?.size ?? 15.5;
  const resolvedFamily = fFamily ?? preset?.fFamily ?? 'bodyRegular400';
  const resolvedLineHeight = lineHeight ?? preset?.lineHeight;
  const resolvedSpacing = letterSpacing ?? preset?.letterSpacing;
  const resolvedTransform = textTransform ?? preset?.textTransform;

  return (
    <Text
      style={[
        {
          color: color ?? preset?.color ?? COLORS.foreground,
          fontSize: Sizer.fS(resolvedSize),
          fontFamily: FONTS[resolvedFamily],
          marginTop: Sizer.vSize(mT),
          marginBottom: Sizer.vSize(mB),
          marginLeft: Sizer.hSize(mL),
          marginRight: Sizer.hSize(mR),
          textAlign,
          ...(resolvedLineHeight != null && { lineHeight: Sizer.fS(resolvedLineHeight) }),
          ...(resolvedSpacing != null && { letterSpacing: resolvedSpacing }),
          ...(resolvedTransform && { textTransform: resolvedTransform }),
          ...(fontStyle && { fontStyle }),
          ...(flex != null && { flex }),
          ...(Platform.OS === 'android' && { includeFontPadding: false }),
        },
        style,
      ]}
      allowFontScaling={false}
      numberOfLines={numberOfLines}
      onPress={onPress}
      {...props}
    >
      {children}
    </Text>
  );
};

export default React.memo(Typography);
