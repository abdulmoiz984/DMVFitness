import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { COLORS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import { Typography } from '../atomComponents';

/**
 * Ported from DmvInput — label sits inside the field above the value,
 * radius 16, violet focus ring, optional right element / error / helper.
 */
export const DmvInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  rightElement,
  readOnly = false,
  error,
  helper,
  style,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? COLORS.danger : focused ? COLORS.primary : COLORS.fgA10;

  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.field, { borderColor }, focused && !error && styles.ring]}>
        <Typography
          size={11.5}
          fFamily="bodyBold700"
          color="#A1A1AA"
          textTransform="uppercase"
          letterSpacing={0.5}
          mB={6}
        >
          {label}
        </Typography>
        <View style={styles.row}>
          <TextInput
            value={value == null ? '' : String(value)}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#71717A"
            editable={!readOnly}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            selectionColor={COLORS.primary}
            allowFontScaling={false}
            style={styles.input}
            {...props}
          />
          {rightElement ? <View style={styles.right}>{rightElement}</View> : null}
        </View>
      </View>
      {error ? (
        <Typography size={12} fFamily="bodyMedium500" color={COLORS.danger} style={styles.msg}>
          {error}
        </Typography>
      ) : null}
      {helper && !error ? (
        <Typography size={11.5} fFamily="bodyMedium500" color="#A1A1AA" style={styles.msg}>
          {helper}
        </Typography>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { width: '100%', gap: Sizer.vSize(6) },
  field: {
    backgroundColor: '#141417',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: Sizer.hSize(16),
    paddingTop: Sizer.vSize(10),
    paddingBottom: Sizer.vSize(12),
  },
  ring: { shadowColor: COLORS.primary, shadowOpacity: 0.5, shadowRadius: 3, shadowOffset: { width: 0, height: 0 } },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Sizer.hSize(8) },
  input: {
    flex: 1,
    color: COLORS.white,
    fontFamily: 'Inter-SemiBold',
    fontSize: Sizer.fS(15),
    padding: 0,
  },
  right: { flexShrink: 0 },
  msg: { paddingHorizontal: 4 },
});

export default DmvInput;
