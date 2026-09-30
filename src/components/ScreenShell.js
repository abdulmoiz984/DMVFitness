import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import Icon from '../helpers/Icon';
import { Typography } from '../atomComponents';
import { SHELL_MAX_WIDTH } from '../constants';

/**
 * The mock's standard screen box: full-bleed dark background, 16pt gutters,
 * content at the top and an action block pinned to the bottom
 * (`flex flex-col justify-between` + `overflow-y-auto`).
 */
export const DmvScreen = ({
  children,
  header,
  footer,
  bgColor = COLORS.background,
  gutter = 16,
  scroll = true,
  topPad = 16,
  bottomPad = 24,
  contentStyle,
  headerStyle,
  footerStyle,
}) => {
  const insets = useSafeAreaInsets();
  const pad = {
    paddingHorizontal: Sizer.hSize(gutter),
    paddingTop: insets.top + Sizer.vSize(topPad),
    paddingBottom: insets.bottom + Sizer.vSize(bottomPad),
  };

  // Three in-flow rows under `justify-between`: a header pinned to the top, a
  // footer pinned to the bottom and the body centred in what is left — the
  // same distribution the mock's paywall gets from its own flex column.
  const body = (
    <>
      {header ? <View style={headerStyle}>{header}</View> : null}
      <View style={styles.grow}>{children}</View>
      {footer ? <View style={[styles.footer, footerStyle]}>{footer}</View> : null}
    </>
  );

  return (
    <View style={[styles.root, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.scroll, pad, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {body}
        </ScrollView>
      ) : (
        <View style={[styles.static, pad, contentStyle]}>{body}</View>
      )}
    </View>
  );
};

/** 36pt round back button used at the top-left of the setup screens. */
export const RoundBackButton = ({ onPress, style }) => (
  <Pressable
    onPress={onPress}
    hitSlop={8}
    style={({ pressed }) => [styles.round, pressed && styles.roundPressed, style]}
  >
    <Icon name="chevron-left" size={Sizer.fS(16)} color={COLORS.foreground} />
  </Pressable>
);

/** "STEP n OF 5" row plus the 5-segment pill progress bar. */
export const SetupStepHeader = ({ step, total = 5, label, onBack, style }) => (
  <View style={[styles.stepWrap, style]}>
    <View style={styles.stepRow}>
      <RoundBackButton onPress={onBack} />
      <Typography
        size={12}
        fFamily="displayBold700"
        color={COLORS.muted}
        textTransform="uppercase"
        letterSpacing={1.92}
      >
        {label ?? `STEP ${step} OF ${total}`}
      </Typography>
      <View style={styles.spacer} />
    </View>

    <View style={styles.segments}>
      {Array.from({ length: total }, (_, i) => i + 1).map(s => (
        <View key={s} style={[styles.segment, s <= step ? styles.segOn : styles.segOff]} />
      ))}
    </View>
  </View>
);

/** Small square −/+ stepper used by the macro cards. */
export const StepperButton = ({ sign, onPress, size = 24, radius = 6 }) => (
  <Pressable
    onPress={onPress}
    hitSlop={8}
    style={({ pressed }) => [
      styles.stepper,
      { width: size, height: size, borderRadius: radius },
      pressed && styles.stepperPressed,
    ]}
  >
    <Typography size={size > 28 ? 16 : 12} fFamily="bodyBold700" color={COLORS.white} lineHeight={size > 28 ? 18 : 14}>
      {sign}
    </Typography>
  </Pressable>
);

/** 44×24 pill toggle — the mock's settings switch. */
export const DmvToggle = ({ value, onPress, style }) => (
  <Pressable
    onPress={onPress}
    hitSlop={6}
    style={[styles.toggle, { backgroundColor: value ? COLORS.primary : COLORS.raised }, style]}
  >
    <View style={[styles.knob, value && styles.knobOn]} />
  </Pressable>
);

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: SHELL_MAX_WIDTH,
    alignSelf: 'center',
  },
  static: { flex: 1, justifyContent: 'space-between', width: '100%', maxWidth: SHELL_MAX_WIDTH, alignSelf: 'center' },
  grow: {},
  footer: { paddingTop: Sizer.vSize(16) },
  round: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundPressed: { backgroundColor: '#27272A', transform: [{ scale: 0.95 }] },
  stepWrap: { gap: Sizer.vSize(12), marginBottom: Sizer.vSize(16) },
  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  spacer: { width: 36 },
  segments: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(6), width: '100%' },
  segment: { flex: 1, height: 3.5, borderRadius: RADIUS.full },
  segOn: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.6,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  segOff: { backgroundColor: '#27272A' },
  stepper: { backgroundColor: COLORS.raised, alignItems: 'center', justifyContent: 'center' },
  stepperPressed: { backgroundColor: COLORS.primary, transform: [{ scale: 0.95 }] },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: RADIUS.full,
    paddingHorizontal: 2,
    justifyContent: 'center',
  },
  knob: { width: 20, height: 20, borderRadius: RADIUS.full, backgroundColor: COLORS.white },
  knobOn: { transform: [{ translateX: 20 }] },
});

export default DmvScreen;
