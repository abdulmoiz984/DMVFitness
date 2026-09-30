import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { Typography } from '../../atomComponents';
import { DmvScreen, DmvButton, TrophyIcon, StarIcon } from '../../components';
import { TABBAR_CLEARANCE } from '../../constants';
import { formatNumber } from '../../utils';

const SummaryStat = ({ value, label }) => (
  <View style={styles.stat}>
    <Typography size={18} fFamily="monoBold700" color={COLORS.white} textAlign="center">
      {value}
    </Typography>
    <Typography
      size={10}
      fFamily="bodySemiBold600"
      color={COLORS.muted}
      textTransform="uppercase"
      textAlign="center"
      mT={2}
    >
      {label}
    </Typography>
  </View>
);

/** Screen 28 · Workout Complete */
const WorkoutCompleteScreen = ({ navigation }) => {
  // The mock's trophy disc uses `animate-bounce`.
  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: 1, duration: 450, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 450, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bounce]);

  return (
    <DmvScreen
      bgColor="#0B0B0D"
      gutter={20}
      topPad={40}
      bottomPad={TABBAR_CLEARANCE}
    >
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.trophyDisc,
            { transform: [{ translateY: bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) }] },
          ]}
        >
          <TrophyIcon size={40} color={COLORS.warning} />
        </Animated.View>

        <Typography
          size={28}
          fFamily="displayBold700"
          color={COLORS.white}
          textTransform="uppercase"
          textAlign="center"
          letterSpacing={-0.28}
        >
          WORKOUT COMPLETED!
        </Typography>
        <Typography size={13} color={COLORS.muted} textAlign="center" mT={4} mB={24}>
          129 total workouts finished · You're crushing it, Alicia!
        </Typography>

        <View style={styles.prCard}>
          <LinearGradient
            colors={['rgba(141,34,255,0.2)', '#18181B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.absFill}
          />
          <View style={styles.prLeft}>
            <StarIcon size={24} color={COLORS.warning} />
            <View style={styles.prText}>
              <Typography size={13} fFamily="bodyBold700" color={COLORS.white}>
                NEW PERSONAL RECORD!
              </Typography>
              <Typography size={11.5} color={COLORS.muted}>
                Wide-Grip Lat Pulldown · 165 lbs × 8 reps
              </Typography>
            </View>
          </View>
          <View style={styles.prBadge}>
            <Typography size={10.5} fFamily="bodyBold700" color={COLORS.black}>
              +15 LBS
            </Typography>
          </View>
        </View>

        <View style={styles.stats}>
          <SummaryStat value="45m" label="DURATION" />
          <SummaryStat value={formatNumber(14280)} label="VOLUME (LBS)" />
          <SummaryStat value="18" label="SETS" />
        </View>

        {/* The mock keeps this button in the content flow under the stats. */}
        <View style={styles.cta}>
          <DmvButton
            title="Back to Today"
            variant="primary"
            onPress={() => navigation.navigate('MainTabs', { screen: 'TodayTab' })}
          />
        </View>
      </View>
    </DmvScreen>
  );
};

const styles = StyleSheet.create({
  absFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  cta: { width: '100%', paddingTop: Sizer.vSize(8) },
  center: { alignItems: 'center' },
  trophyDisc: {
    width: Sizer.hSize(80),
    height: Sizer.hSize(80),
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(141,34,255,0.2)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizer.vSize(16),
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  prCard: {
    width: '100%',
    borderRadius: 20,
    padding: Sizer.hSize(16),
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(20),
    overflow: 'hidden',
    gap: Sizer.hSize(8),
  },
  prLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12), flex: 1, minWidth: 0 },
  prText: { flex: 1, minWidth: 0 },
  prBadge: {
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(4),
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.warning,
    flexShrink: 0,
  },
  stats: { flexDirection: 'row', gap: Sizer.hSize(10), width: '100%', marginBottom: Sizer.vSize(24) },
  stat: {
    flex: 1,
    padding: Sizer.hSize(12),
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
});

export default WorkoutCompleteScreen;
