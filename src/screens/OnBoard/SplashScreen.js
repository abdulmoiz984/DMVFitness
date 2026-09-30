import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { Typography } from '../../atomComponents';
import { DmvLogo, DmvTagline, LogoGlow, RadialOverlay, logoBox } from '../../components';
import { images } from '../../assets/images';

/** The mock ticks 10% every 85ms, then waits 300ms before moving on. */
const STEP_MS = 85;
/** The mock's `w-[210px] h-auto` logo, resolved to points. */
const LOGO_BOX = logoBox({ width: 210 });
const HOLD_MS = 300;

/** Ported from components/screens/SplashScreen.tsx */
export default function SplashScreen({ navigation }) {
  const [progress, setProgress] = useState(0);
  const pulse = useRef(new Animated.Value(0)).current;
  const done = useRef(false);

  const go = () => {
    if (done.current) return;
    done.current = true;
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'OnboardingScreen' }] }));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(go, HOLD_MS);
          return 100;
        }
        return p + 10;
      });
    }, STEP_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // animate-pulse on the violet glow behind the logo
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
    <Pressable style={styles.root} onPress={go}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background photo at 65%, scaled 1.05 like the mock */}
      <Image source={images.splash02} resizeMode="cover" style={styles.bg} />

      {/* radial-gradient(circle at 50% 45%, rgba(141,34,255,0.32) 0%, rgba(12,12,14,0.75) 60%, #0C0C0E 95%) */}
      <RadialOverlay
        style={styles.fill}
        cx={0.5}
        cy={0.45}
        stops={[
          { offset: 0, color: '#8D22FF', opacity: 0.32 },
          { offset: 0.6, color: '#0C0C0E', opacity: 0.75 },
          { offset: 0.95, color: '#0C0C0E', opacity: 1 },
        ]}
      />

      <View style={styles.spacerTop} />

      <View style={styles.center}>
        <View style={LOGO_BOX}>
          <Animated.View
            style={[
              styles.fill,
              { opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 0.55] }) },
            ]}
            pointerEvents="none"
          >
            <LogoGlow width={LOGO_BOX.width} height={LOGO_BOX.height} inset={16} opacity={0.2} />
          </Animated.View>
          <DmvLogo width={210} />
        </View>

        <View style={styles.gap24} />

        <View style={styles.track}>
          <LinearGradient
            colors={['#8D22FF', '#B36BFF']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.trackFill, { width: `${progress}%` }]}
          />
        </View>

        <View style={styles.gap14} />

        <DmvTagline size={11} letterSpacing={2.86} color={COLORS.muted} />
      </View>

      <View style={styles.spacerBottom}>
        <Typography size={10.5} color={COLORS.faint} letterSpacing={0.3}>
          Tap anywhere to skip
        </Typography>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.backgroundDeep, paddingHorizontal: Sizer.hSize(24), overflow: 'hidden' },
  // mock: opacity-65 scale-105 filter brightness(0.85) contrast(1.1)
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.65,
    transform: [{ scale: 1.05 }],
    filter: [{ brightness: 0.85 }, { contrast: 1.1 }],
  },
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  spacerTop: { flex: 0.38 },
  center: { alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  gap24: { height: Sizer.vSize(24) },
  gap14: { height: Sizer.vSize(14) },
  track: {
    width: Sizer.hSize(84),
    height: 3.5,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(232,232,236,0.15)',
    overflow: 'hidden',
  },
  // The track clips its child, so the mock's shadow-[0_0_10px] never shows.
  trackFill: { height: '100%', borderRadius: RADIUS.full },
  spacerBottom: { flex: 0.42, justifyContent: 'flex-end', paddingBottom: Sizer.vSize(32), zIndex: 10 },
});
