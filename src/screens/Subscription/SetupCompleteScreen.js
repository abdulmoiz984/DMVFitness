import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { useDispatch } from 'react-redux';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { DmvScreen, CrownIcon, RadialOverlay } from '../../components';
import { completeSetup, signIn } from '../../redux/slices/appSlice';

const RAYS = [
  [50, 10, 50, 20],
  [50, 80, 50, 90],
  [10, 50, 20, 50],
  [80, 50, 90, 50],
  [22, 22, 30, 30],
  [70, 70, 78, 78],
  [22, 78, 30, 70],
  [70, 30, 78, 22],
];

/** Screen 17 · Setup Complete / Welcome to Premium */
const SetupCompleteScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const pulse = useRef(new Animated.Value(0)).current;

  const enterApp = () => {
    // Setup is finished, so the next launch opens straight on the tab bar.
    dispatch(signIn());
    dispatch(completeSetup());
    navigation.replace('MainTabs', { screen: 'TodayTab' });
  };

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

  const raySize = Sizer.hSize(224);

  return (
    <View style={styles.root}>
      {/* radial-gradient(circle at 50% 40%, rgba(141,34,255,0.45) 0%, transparent 70%) */}
      <RadialOverlay
        style={styles.glow}
        cx={0.5}
        cy={0.4}
        stops={[
          { offset: 0, color: '#8D22FF', opacity: 0.45 },
          { offset: 0.7, color: '#8D22FF', opacity: 0 },
        ]}
      />

      <DmvScreen
        bgColor="transparent"
        gutter={24}
        topPad={48}
        bottomPad={32}
        scroll={false}
        footer={
          <View style={styles.ctaRow}>
            <Pressable
              onPress={enterApp}
              style={({ pressed }) => [styles.cta, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
            >
              <Icon name="arrow-right" size={Sizer.fS(24)} color={COLORS.white} />
            </Pressable>
          </View>
        }
        footerStyle={styles.footer}
      >
        <View style={styles.body}>
          <Typography size={14} fFamily="bodyMedium500" color={COLORS.muted} textAlign="center" mB={4}>
            Welcome to
          </Typography>
          <Typography
            size={26}
            fFamily="displayBold700"
            color={COLORS.white}
            textAlign="center"
            textTransform="uppercase"
            lineHeight={26}
            letterSpacing={-0.65}
            mB={4}
          >
            DMV Fitness
          </Typography>
          <Typography
            size={20}
            fFamily="bodyBold700"
            color={COLORS.warning}
            textAlign="center"
            letterSpacing={0.5}
            mB={48}
          >
            Premium
          </Typography>

          <View style={styles.crownWrap}>
            <Animated.View
              style={[
                styles.rays,
                { width: raySize, height: raySize, opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.2] }) },
              ]}
              pointerEvents="none"
            >
              <Svg width={raySize} height={raySize} viewBox="0 0 100 100">
                {RAYS.map(([x1, y1, x2, y2]) => (
                  <Line
                    key={`${x1}-${y1}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={COLORS.warning}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ))}
              </Svg>
            </Animated.View>

            <View style={styles.crownDisc}>
              <CrownIcon size={56} color={COLORS.warning} />
            </View>
          </View>

          <Typography size={13} color={COLORS.muted} textAlign="center" lineHeight={20} mT={32} mB={8} style={styles.blurb}>
            You just scored some amazing tools to help you reach your health & fitness goals
          </Typography>
          <Typography size={14} fFamily="bodySemiBold600" color={COLORS.white} textAlign="center">
            Let's show you around
          </Typography>
        </View>
      </DmvScreen>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0B0C' },
  glow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.4 },
  body: { alignItems: 'center', paddingTop: Sizer.vSize(32) },
  crownWrap: { alignItems: 'center', justifyContent: 'center', marginVertical: Sizer.vSize(24) },
  rays: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  crownDisc: {
    width: Sizer.hSize(96),
    height: Sizer.hSize(96),
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,176,32,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.warning,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  blurb: { maxWidth: Sizer.hSize(260) },
  footer: { paddingTop: 0 },
  ctaRow: { alignItems: 'center', paddingBottom: Sizer.vSize(16) },
  cta: {
    width: Sizer.hSize(56),
    height: Sizer.hSize(56),
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
});

export default SetupCompleteScreen;
