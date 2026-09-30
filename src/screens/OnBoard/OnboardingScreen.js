import React, { useRef, useState } from 'react';
import { Animated, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { DmvButton, DmvLogo, LogoGlow, RadialOverlay, logoBox } from '../../components';
import { images } from '../../assets/images';
import { selectTranslate } from '../../redux/slices/appSlice';

/** The mock's `h-13 w-auto` logo, resolved to points. */
const LOGO_BOX = logoBox({ height: 52 });

const SLIDES = [
  {
    id: '02-onboarding-1',
    headline: 'EVERYTHING IN ONE PLACE',
    body: 'Workouts, meals, photos and weight — all tied to what you need to hit today.',
    buttonText: 'Next',
    image: images.splash03,
  },
  {
    id: '03-onboarding-2',
    headline: 'YOUR COACH WRITES THE PLAN',
    body: 'Sessions come from your coach. You just show up and log the sets.',
    buttonText: 'Next',
    image: images.splash03_1,
  },
  {
    id: '04-onboarding-3',
    headline: 'SCAN IT, LOG IT, DONE',
    body: 'Search the database, scan a barcode, or type in whatever you cooked.',
    buttonText: 'Next',
    image: images.splash03_2,
  },
  {
    id: '05-onboarding-4',
    headline: 'WATCH IT ADD UP',
    body: 'Photos and weight side by side, so slow progress still looks like progress.',
    buttonText: 'Get started',
    image: images.welcome,
  },
];

/** Ported from components/screens/OnboardingScreens.tsx */
export default function OnboardingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const t = useSelector(selectTranslate);
  const [index, setIndex] = useState(0);
  const fades = useRef(SLIDES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  // 700ms cross-fade between background photos
  const goTo = next => {
    if (next === index) return;
    Animated.parallel(
      fades.map((v, i) =>
        Animated.timing(v, { toValue: i === next ? 1 : 0, duration: 700, useNativeDriver: true }),
      ),
    ).start();
    setIndex(next);
  };

  const reset = route => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: route }] }));
  const handleNext = () => (isLast ? reset('CreateAccountScreen') : goTo(index + 1));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {SLIDES.map((s, i) => (
        <Animated.Image
          key={s.id}
          source={s.image}
          resizeMode="cover"
          style={[
            styles.bg,
            {
              opacity: fades[i],
              transform: [{ scale: fades[i].interpolate({ inputRange: [0, 1], outputRange: [1.05, 1] }) }],
            },
          ]}
        />
      ))}

      {/* Top vignette behind the logo and Skip */}
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)', 'transparent']}
        style={styles.topFade}
        pointerEvents="none"
      />
      {/* Bottom fade for copy legibility */}
      <LinearGradient
        colors={['transparent', 'rgba(18,18,18,0.92)', '#121212']}
        locations={[0, 0.45, 1]}
        style={styles.bottomFade}
        pointerEvents="none"
      />
      {/* radial-gradient(circle at 50% 90%, rgba(141,34,255,0.45) 0%, transparent 65%) */}
      <RadialOverlay
        style={styles.accent}
        cx={0.5}
        cy={0.9}
        stops={[
          { offset: 0, color: '#8D22FF', opacity: 0.45 },
          { offset: 0.65, color: '#8D22FF', opacity: 0 },
        ]}
      />

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + Sizer.vSize(12) }]}>
        <View style={LOGO_BOX}>
          <LogoGlow width={LOGO_BOX.width} height={LOGO_BOX.height} inset={8} opacity={0.2} />
          <DmvLogo height={52} />
        </View>

        {isLast ? (
          <Pressable onPress={() => reset('SignInScreen')} style={({ pressed }) => [styles.pill, styles.pillSignIn, pressed && styles.pressed]}>
            <Typography size={12.5} fFamily="bodySemiBold600" color={COLORS.primarySoft}>
              Sign in
            </Typography>
          </Pressable>
        ) : (
          <Pressable onPress={() => reset('SignInScreen')} style={({ pressed }) => [styles.pill, pressed && styles.pressed]}>
            <Typography size={12.5} fFamily="bodySemiBold600" color={COLORS.foreground}>
              Skip
            </Typography>
          </Pressable>
        )}
      </View>

      {/* Bottom content */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + Sizer.vSize(24) }]}>
        <View style={styles.dots}>
          {SLIDES.map((s, i) => (
            <Pressable
              key={s.id}
              onPress={() => goTo(i)}
              hitSlop={10}
              style={[styles.dot, i === index ? styles.dotActive : styles.dotIdle]}
            />
          ))}
        </View>

        <Typography
          size={30}
          lineHeight={31}
          fFamily="displayBold700"
          color={COLORS.foreground}
          textTransform="uppercase"
          letterSpacing={0.9}
          mB={8}
        >
          {t(slide.headline)}
        </Typography>

        <Typography size={12.5} lineHeight={19} color={COLORS.muted} mB={20} style={styles.body}>
          {t(slide.body)}
        </Typography>

        <DmvButton
          title={slide.buttonText}
          onPress={handleNext}
          icon={<Icon name="chevron-right" size={Sizer.fS(16)} color={COLORS.white} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'space-between', backgroundColor: COLORS.backgroundDeep, overflow: 'hidden' },
  // mock: filter brightness(1.15) contrast(1.05)
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    filter: [{ brightness: 1.15 }, { contrast: 1.05 }],
  },
  topFade: { position: 'absolute', top: 0, left: 0, right: 0, height: Sizer.vSize(112), zIndex: 10 },
  bottomFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '58%', zIndex: 10 },
  accent: { position: 'absolute', left: 0, right: 0, bottom: Sizer.vSize(64), height: Sizer.vSize(192), opacity: 0.25, zIndex: 10 },
  topBar: {
    position: 'relative',
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizer.hSize(20),
  },
  pill: {
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(6),
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(24,24,27,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pillSignIn: { borderColor: 'rgba(141,34,255,0.4)' },
  pressed: { transform: [{ scale: 0.95 }] },
  bottom: { position: 'relative', zIndex: 20, paddingHorizontal: Sizer.hSize(20), justifyContent: 'flex-end' },
  dots: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(6), marginBottom: Sizer.vSize(14) },
  dot: { height: 4, borderRadius: RADIUS.full },
  dotActive: {
    width: Sizer.hSize(24),
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  dotIdle: { width: Sizer.hSize(6), backgroundColor: '#37373A' },
  body: { maxWidth: Sizer.hSize(320) },
});
