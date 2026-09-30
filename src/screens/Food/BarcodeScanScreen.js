import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { SHELL_MAX_WIDTH, TABBAR_CLEARANCE } from '../../constants';
import { RichText } from '../../components';
import { addFoodToMeal } from '../../redux/slices/appSlice';

const Bracket = ({ style }) => <View style={[styles.bracket, style]} />;

/** Screen 21 · Barcode Scanner */
const BarcodeScanScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [torchOn, setTorchOn] = useState(false);
  const [scannedResult] = useState(true);

  // The mock's laser line and the pulsing QR glyph both use `animate-pulse`.
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
  const fade = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] });

  const handleLogHit = () => {
    dispatch(
      addFoodToMeal({
        name: 'Chobani Greek Yogurt',
        serving: '1 cup (170g)',
        source: 'Barcode Verified',
        verified: true,
        calories: 120,
        protein: 20,
        carbs: 6,
        fat: 0,
        mealType: 'lunch',
      }),
    );
    navigation.navigate('MainTabs', { screen: 'DiaryTab' });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={[styles.shell, { paddingBottom: TABBAR_CLEARANCE + insets.bottom }]}>
        {/* Top overlay */}
        <View style={[styles.topBar, { paddingTop: insets.top + Sizer.vSize(16) }]}>
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.absFill}
            pointerEvents="none"
          />
          <Pressable onPress={() => navigation.goBack()} style={styles.topBtn}>
            <Icon name="chevron-left" size={Sizer.fS(20)} color={COLORS.white} />
          </Pressable>
          <Typography
            size={14}
            fFamily="displayBold700"
            color={COLORS.white}
            textTransform="uppercase"
            letterSpacing={1.96}
          >
            BARCODE SCANNER
          </Typography>
          <Pressable
            onPress={() => setTorchOn(t => !t)}
            style={[styles.topBtn, torchOn ? styles.torchOn : styles.torchOff]}
          >
            <Icon name="flashlight" size={Sizer.fS(16)} color={torchOn ? COLORS.white : COLORS.muted} />
          </Pressable>
        </View>

        {/* Viewfinder */}
        <View style={styles.viewfinderWrap}>
          <View style={styles.viewfinder}>
            <Bracket style={styles.brTopLeft} />
            <Bracket style={styles.brTopRight} />
            <Bracket style={styles.brBottomLeft} />
            <Bracket style={styles.brBottomRight} />

            <Animated.View style={[styles.laser, { opacity: fade }]}>
              <LinearGradient
                colors={['transparent', '#C084FC', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.absFill}
              />
            </Animated.View>

            <View style={styles.viewfinderBody}>
              <Animated.View style={{ opacity: fade }}>
                <Icon name="qr-code" size={Sizer.fS(64)} color="rgba(141,34,255,0.4)" />
              </Animated.View>
              <Typography size={12} fFamily="bodyMedium500" color="#A1A1AA" textAlign="center" mT={8}>
                Align barcode within frame
              </Typography>
            </View>
          </View>
        </View>

        {/* Detected card */}
        {scannedResult ? (
          <View style={styles.detected}>
            <View style={styles.detectedHead}>
              <View style={styles.detectedLeft}>
                <Animated.View style={[styles.liveDot, { opacity: fade }]} />
                <RichText
                  size={12}
                  fFamily="bodyBold700"
                  color={COLORS.success}
                  textTransform="uppercase"
                  letterSpacing={0.3}
                >
                  Barcode Detected ✓
                </RichText>
              </View>
              <Typography size={14} fFamily="monoBold700" color={COLORS.white}>
                120 kcal
              </Typography>
            </View>

            <View>
              <Typography size={16} fFamily="bodyBold700" color={COLORS.white}>
                Chobani 0% Plain Greek Yogurt
              </Typography>
              <Typography size={11.5} color="#A1A1AA" mT={2}>
                1 cup (170g) · P: 20g · C: 6g · F: 0g
              </Typography>
            </View>

            <Pressable onPress={handleLogHit} style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
              <LinearGradient
                colors={['#8D22FF', '#A84DF0']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.absFill}
              />
              <Icon name="plus" size={Sizer.fS(16)} color={COLORS.white} />
              <Typography size={14} fFamily="bodyBold700" color={COLORS.white}>
                Log to Lunch (120 kcal)
              </Typography>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.backgroundDeep },
  shell: { flex: 1, width: '100%', maxWidth: SHELL_MAX_WIDTH, alignSelf: 'center' },
  absFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizer.hSize(16),
    paddingBottom: Sizer.vSize(16),
  },
  topBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  torchOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  torchOff: {},

  // The mock's viewfinder is `flex-1 min-h-[320px]` inside a column that is
  // sized by its content, so flex-1 never grows and the band stays 320 tall
  // with the 256pt box centred in it.
  viewfinderWrap: {
    height: Sizer.vSize(320),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Sizer.hSize(24),
  },
  viewfinder: {
    width: Sizer.hSize(256),
    height: Sizer.hSize(256),
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(141,34,255,0.5)',
    backgroundColor: 'rgba(0,0,0,0.4)',
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  bracket: { position: 'absolute', width: 20, height: 20, borderColor: COLORS.primary },
  brTopLeft: { top: 8, left: 8, borderTopWidth: 2, borderLeftWidth: 2 },
  brTopRight: { top: 8, right: 8, borderTopWidth: 2, borderRightWidth: 2 },
  brBottomLeft: { bottom: 8, left: 8, borderBottomWidth: 2, borderLeftWidth: 2 },
  brBottomRight: { bottom: 8, right: 8, borderBottomWidth: 2, borderRightWidth: 2 },
  laser: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  viewfinderBody: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Sizer.hSize(16) },

  detected: {
    marginHorizontal: Sizer.hSize(16),
    marginBottom: Sizer.vSize(16),
    borderRadius: 22,
    padding: Sizer.hSize(16),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.4)',
    gap: Sizer.vSize(12),
  },
  detectedHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detectedLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8) },
  liveDot: { width: 8, height: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.success },
  cta: {
    width: '100%',
    height: Sizer.vSize(48),
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(8),
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  pressed: { transform: [{ scale: 0.98 }] },
});

export default BarcodeScanScreen;
