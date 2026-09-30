import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import Icon from '../helpers/Icon';
import { images } from '../assets/images';
import { DmvLogo, LogoGlow, logoBox } from './DmvLogo';
import { RadialOverlay } from './RadialOverlay';
import { SHELL_MAX_WIDTH } from '../constants';

/** The 02-Splash photo + dark gradient + violet radial used by every auth screen. */
export const AuthBackdrop = () => (
  <>
    <Image source={images.splash02} resizeMode="cover" style={styles.bg} />
    <LinearGradient
      colors={['rgba(0,0,0,0.55)', 'rgba(18,18,18,0.8)', 'rgba(18,18,18,0.95)']}
      style={styles.fill}
      pointerEvents="none"
    />
    {/* radial-gradient(circle at 50% 25%, rgba(141,34,255,0.4) 0%, transparent 70%) */}
    <RadialOverlay
      style={[styles.fill, styles.accent]}
      cx={0.5}
      cy={0.25}
      stops={[
        { offset: 0, color: '#8D22FF', opacity: 0.4 },
        { offset: 0.7, color: '#8D22FF', opacity: 0 },
      ]}
    />
  </>
);

/** The mock's `h-20 w-auto max-w-[260px]` auth logo, resolved to points. */
const AUTH_LOGO_BOX = logoBox({ height: 80 });

/** Large centred DMV logo with the pulsing violet halo. */
export const AuthBrandLogo = ({ style }) => {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={[styles.logoWrap, style]}>
      <View style={AUTH_LOGO_BOX}>
        <Animated.View
          style={[styles.fill, { opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] }) }]}
          pointerEvents="none"
        >
          <LogoGlow width={AUTH_LOGO_BOX.width} height={AUTH_LOGO_BOX.height} inset={16} opacity={0.25} />
        </Animated.View>
        <DmvLogo height={80} />
      </View>
    </View>
  );
};

/** Small round floating back button used at the top-left of auth screens. */
export const AuthBackButton = ({ onPress, style }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={onPress ?? (() => navigation.canGoBack() && navigation.goBack())}
      hitSlop={8}
      style={({ pressed }) => [styles.backBtn, pressed && styles.backPressed, style]}
    >
      <Icon name="chevron-left" size={Sizer.fS(16)} color={COLORS.foreground} />
    </Pressable>
  );
};

/** Frosted glass card that holds each auth form. */
export const AuthCard = ({ children, centered = false, style }) => (
  <View style={[styles.card, centered && styles.cardCentered, style]}>{children}</View>
);

/** Violet rounded tile holding an icon, above the headline on some screens. */
export const AuthIconTile = ({ icon, size = 60, style }) => (
  <View style={[styles.tile, { width: Sizer.hSize(size), height: Sizer.hSize(size) }, style]}>
    <Icon name={icon} size={Sizer.fS(size * 0.43)} color={COLORS.primarySoft} />
  </View>
);

/** Screen scaffold: backdrop + scrollable content + footer pinned to the bottom. */
export const AuthScreen = ({ children, footer, contentStyle }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <AuthBackdrop />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + Sizer.vSize(12), paddingBottom: insets.bottom + Sizer.vSize(24) },
            contentStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

/** Six-box OTP / recovery code entry. Filled boxes take a violet border. */
export const CodeBoxes = ({ value, onChange, boxWidth = 42, boxHeight = 50, fontSize = 20, gap = 7, radius = 12 }) => {
  const refs = useRef([]);

  const setDigit = (i, raw) => {
    const clean = raw.replace(/\D/g, '');
    if (clean.length > 1) {
      // paste / SMS autofill arrives in one box — spread it across the row
      const next = Array(value.length).fill('');
      clean.slice(0, value.length).split('').forEach((c, k) => (next[k] = c));
      onChange(next, value.length - 1);
      refs.current[Math.min(clean.length, value.length) - 1]?.focus();
      return;
    }
    const next = [...value];
    next[i] = clean;
    onChange(next, i);
    if (clean && i < value.length - 1) refs.current[i + 1]?.focus();
  };

  return (
    <View style={[styles.codeRow, { gap: Sizer.hSize(gap) }]}>
      {value.map((digit, i) => (
        <TextInput
          key={i}
          ref={el => (refs.current[i] = el)}
          value={digit}
          onChangeText={v => setDigit(i, v)}
          onKeyPress={e => {
            if (e.nativeEvent.key === 'Backspace' && !digit && i > 0) refs.current[i - 1]?.focus();
          }}
          keyboardType="number-pad"
          maxLength={i === 0 ? value.length : 1}
          textContentType={i === 0 ? 'oneTimeCode' : 'none'}
          selectionColor={COLORS.primary}
          allowFontScaling={false}
          style={[
            styles.codeBox,
            {
              width: Sizer.hSize(boxWidth),
              height: Sizer.vSize(boxHeight),
              fontSize: Sizer.fS(fontSize),
              borderRadius: radius,
            },
            digit ? styles.codeFilled : styles.codeEmpty,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.backgroundDeep },
  flex: { flex: 1 },
  // mock: scale-105 filter brightness(0.95) contrast(1.1)
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.05 }],
    filter: [{ brightness: 0.95 }, { contrast: 1.1 }],
  },
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  accent: { opacity: 0.4 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: SHELL_MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: Sizer.hSize(16),
  },
  logoWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 4, marginBottom: Sizer.vSize(16) },
  backBtn: {
    position: 'absolute',
    left: 0,
    top: 4,
    zIndex: 5,
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(31,31,35,0.8)',
    borderWidth: 1,
    borderColor: COLORS.fgA10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPressed: { backgroundColor: COLORS.raised },
  card: {
    borderRadius: 22,
    // the mock's `p-4 md:p-5` — phone widths are below md, so 16
    padding: Sizer.hSize(16),
    backgroundColor: 'rgba(24,24,27,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(232,232,236,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 14,
  },
  cardCentered: { alignItems: 'center' },
  tile: {
    borderRadius: 18,
    backgroundColor: 'rgba(141,34,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizer.vSize(12),
  },
  footer: { alignItems: 'center', paddingTop: Sizer.vSize(16) },
  codeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  codeBox: {
    borderWidth: 1,
    textAlign: 'center',
    color: COLORS.foreground,
    fontFamily: 'JetBrainsMono-SemiBold',
    padding: 0,
  },
  codeEmpty: { backgroundColor: 'rgba(31,31,35,0.9)', borderColor: COLORS.fgA10 },
  codeFilled: {
    backgroundColor: 'rgba(141,34,255,0.12)',
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
});

export default AuthScreen;
