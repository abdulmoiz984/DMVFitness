import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { gridItemWidthScaled } from '../../helpers/grid';
import { Typography } from '../../atomComponents';
import { DmvButton, Emoji } from '../../components';
import { SHELL_MAX_WIDTH, TABBAR_CLEARANCE } from '../../constants';
import { images } from '../../assets/images';
import { workoutRoutinesData } from '../../lib/training-data';
import { selectUser, startWorkoutSession } from '../../redux/slices/appSlice';
import { formatNumber } from '../../utils';
import ExerciseDetailModal from './ExerciseDetailModal';

const PROFILE_PHOTO = {
  uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

const WEEK_BARS = [
  { day: 'S', min: 25 },
  { day: 'M', min: 48 },
  { day: 'T', min: 45 },
  { day: 'W', min: 54, active: true, tag: '54 MIN' },
  { day: 'T', min: 45 },
  { day: 'F', min: 30 },
  { day: 'S', min: 30 },
];

const RECOMMENDATIONS = [
  { id: 'no-equipment', title: 'No Equipment Workout', time: '15 MIN', cals: '120 kcal · Beginner', img: images.workoutNoEquipment },
  { id: 'push-up-routine', title: 'Push-up Routine', time: '15 MIN', cals: '120 kcal · Intermediate', img: images.workoutPushups },
  { id: 'upper-beginner', title: 'Upper Body Beginner', time: '15 MIN', cals: '120 kcal · Beginner', img: images.workoutLatPulldown },
  { id: 'lower-body', title: 'Lower Body Workout', time: '15 MIN', cals: '130 kcal · Intermediate', img: images.workoutLowerbody },
];

const CAL_DAY_WIDTH = gridItemWidthScaled(7, 6, (16 + 20) * 2);
const PREV_DAYS = [27, 28, 29, 30, 31];
const AUG_DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

const GlassPill = ({ icon, iconColor, text, textColor = COLORS.white, small = false }) => (
  <View style={[styles.glassPill, small && styles.glassPillSm]}>
    <Icon name={icon} size={Sizer.fS(small ? 12 : 14)} color={iconColor} />
    <Typography size={small ? 10 : 11} fFamily="bodyBold700" color={textColor}>
      {text}
    </Typography>
  </View>
);

const Metric = ({ icon, iconColor, value, label, style }) => (
  <View style={[styles.metric, style]}>
    <Icon name={icon} size={Sizer.fS(16)} color={iconColor} style={styles.metricIcon} />
    <Typography size={20} fFamily="monoBold700" color={COLORS.white}>
      {String(value)}
    </Typography>
    <Typography size={9.5} fFamily="bodyBold700" color="#71717A" textTransform="uppercase">
      {label}
    </Typography>
  </View>
);

/** Screen 26 · Workout Hub & Routine Detail */
const TodaysWorkoutScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const user = useSelector(selectUser);

  const [viewMode, setViewMode] = useState('hub');
  const [selectedRoutineId, setSelectedRoutineId] = useState('no-equipment');
  const [inspectingExercise, setInspectingExercise] = useState(null);

  const currentRoutine = workoutRoutinesData[selectedRoutineId] || workoutRoutinesData['push-day-a'];

  const beginWorkout = () => {
    dispatch(startWorkoutSession());
    navigation.navigate('LoggingWorkoutScreen');
  };

  const openRoutine = id => {
    setSelectedRoutineId(id);
    setViewMode('routine');
  };

  const bottomPad = TABBAR_CLEARANCE + insets.bottom;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {viewMode === 'hub' ? (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Sizer.vSize(12), paddingBottom: bottomPad }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Greeting */}
          <View style={styles.header}>
            <View style={styles.greetRow}>
              <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'MeTab' })} style={styles.avatarRing}>
                <LinearGradient
                  colors={['#8D22FF', '#C084FC']}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.absFill}
                />
                <View style={styles.avatarInner}>
                  <Image source={PROFILE_PHOTO} style={styles.avatarPhoto} resizeMode="cover" />
                </View>
              </Pressable>

              <View style={styles.flex}>
                <Typography size={12} fFamily="bodyBold700" color="#A1A1AA">
                  Good Morning,
                </Typography>
                <View style={styles.nameRow}>
                  <Typography size={18} fFamily="bodyExtraBold800" color={COLORS.white} lineHeight={22}>
                    {user.name}
                  </Typography>
                  <Emoji char="👋" size={17} style={styles.nameEmoji} />
                </View>
              </View>
            </View>

            <Pressable onPress={() => navigation.navigate('NotificationsScreen')} style={styles.bell}>
              <Icon name="bell" size={Sizer.fS(20)} color={COLORS.white} />
              <View style={styles.bellDot} />
            </Pressable>
          </View>

          <Typography
            size={11.5}
            fFamily="bodyBold700"
            color="#A1A1AA"
            textTransform="uppercase"
            letterSpacing={0.29}
            mB={8}
            style={styles.sectionLabel}
          >
            WORKOUT
          </Typography>

          {/* 1 · Hero scheduled workout */}
          <View style={styles.heroCard}>
            <Image source={images.workoutFullbody} resizeMode="cover" style={[styles.absFill, styles.heroImg]} />
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(11,11,13,0.4)', '#0B0B0D']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.absFill}
              pointerEvents="none"
            />

            <View style={styles.heroTop}>
              <GlassPill icon="clock" iconColor="#C084FC" text="45 MIN" />
              <GlassPill icon="flame" iconColor={COLORS.warning} text="380 kcal · Intermediate" textColor={COLORS.warning} />
            </View>

            <View style={styles.heroBottom}>
              <View style={styles.flex}>
                <Typography
                  size={24}
                  fFamily="displayBold700"
                  color={COLORS.white}
                  textTransform="uppercase"
                  lineHeight={28}
                  letterSpacing={-0.6}
                >
                  Full Body Workout
                </Typography>
                <Typography size={12} fFamily="bodyMedium500" color="#D4D4D8" mT={2}>
                  Push / Pull / Legs Compound Hybrid
                </Typography>
              </View>

              <View style={styles.heroActions}>
                <Pressable onPress={beginWorkout} style={({ pressed }) => [styles.playBtn, pressed && styles.pressed]}>
                  <LinearGradient
                    colors={['#8D22FF', '#A84DF0']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.absFill}
                  />
                  <Icon name="play" size={Sizer.fS(20)} color={COLORS.white} />
                </Pressable>
                <Pressable onPress={() => openRoutine('push-day-a')} style={styles.heroChevron}>
                  <Icon name="chevron-right" size={Sizer.fS(20)} color={COLORS.white} />
                </Pressable>
              </View>
            </View>
          </View>

          {/* 2 · Weekly progress */}
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Typography size={15} fFamily="bodyExtraBold800" color={COLORS.white}>
                Weekly Progress
              </Typography>
              <View style={styles.activeDay}>
                <Emoji char="🔥" size={11} />
                <Typography size={11.5} fFamily="bodyBold700" color="#C084FC">
                  {' Most Active Day: '}
                </Typography>
                <Typography size={11.5} fFamily="bodyExtraBold800" color={COLORS.white}>
                  Wednesday
                </Typography>
              </View>
            </View>

            <View style={styles.weekTotals}>
              <View>
                <Typography size={10} fFamily="bodyBold700" color="#A1A1AA" textTransform="uppercase" letterSpacing={0.25}>
                  CALORIES BURNED
                </Typography>
                <View style={styles.totalRow}>
                  <Typography size={26} fFamily="monoBold700" color={COLORS.white}>
                    {formatNumber(1820)}
                  </Typography>
                  <Typography size={11} fFamily="bodyBold700" color="#A1A1AA">
                    KCAL
                  </Typography>
                </View>
              </View>

              <View>
                <Typography size={10} fFamily="bodyBold700" color="#A1A1AA" textTransform="uppercase" letterSpacing={0.25}>
                  TOTAL TIME
                </Typography>
                <View style={styles.totalRow}>
                  <Typography size={26} fFamily="monoBold700" color={COLORS.white}>
                    182
                  </Typography>
                  <Typography size={11} fFamily="bodyBold700" color="#A1A1AA">
                    MIN
                  </Typography>
                </View>
              </View>
            </View>

            <View style={styles.barChart}>
              {WEEK_BARS.map((b, idx) => (
                <View key={`${b.day}-${idx}`} style={styles.barCol}>
                  {b.active ? (
                    // the tag is wider than its column, so it sits in a
                    // roomier wrapper and centres, as `whitespace-nowrap` does
                    <View style={styles.barTagWrap} pointerEvents="none">
                      <View style={styles.barTag}>
                        <LinearGradient
                          colors={['#8D22FF', '#A84DF0']}
                          start={{ x: 0, y: 0.5 }}
                          end={{ x: 1, y: 0.5 }}
                          style={styles.absFill}
                        />
                        <Typography size={9.5} fFamily="bodyExtraBold800" color={COLORS.white} numberOfLines={1}>
                          {b.tag}
                        </Typography>
                      </View>
                    </View>
                  ) : null}

                  <View style={styles.barSlot}>
                    <View style={[styles.bar, { height: `${(b.min / 60) * 100}%` }]}>
                      {b.active ? (
                        <LinearGradient
                          colors={['#C084FC', '#8D22FF']}
                          start={{ x: 0.5, y: 0 }}
                          end={{ x: 0.5, y: 1 }}
                          style={styles.absFill}
                        />
                      ) : (
                        <View style={styles.barIdle} />
                      )}
                    </View>
                  </View>

                  <Typography size={11} fFamily="bodyBold700" color="#A1A1AA">
                    {b.day}
                  </Typography>
                </View>
              ))}
            </View>
          </View>

          {/* 3 · Monthly streak matrix */}
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Typography size={15} fFamily="bodyExtraBold800" color={COLORS.white}>
                August 2026
              </Typography>
              <View style={styles.streakStats}>
                <View style={styles.streakStat}>
                  <Typography size={15} fFamily="monoBold700" color={COLORS.white}>
                    4
                  </Typography>
                  <Typography size={10} fFamily="bodyBold700" color="#A1A1AA" textTransform="uppercase">
                    WEEKS
                  </Typography>
                </View>
                <View style={styles.streakStat}>
                  <Typography size={15} fFamily="monoBold700" color="#C084FC">
                    7
                  </Typography>
                  <Typography size={10} fFamily="bodyBold700" color="#A1A1AA" textTransform="uppercase">
                    STREAK
                  </Typography>
                </View>
              </View>
            </View>

            <View style={styles.calGrid}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <View key={`h-${i}`} style={styles.calCell}>
                  <Typography size={10.5} fFamily="bodyBold700" color="#71717A" textAlign="center">
                    {d}
                  </Typography>
                </View>
              ))}

              {PREV_DAYS.map(d => (
                <View key={`prev-${d}`} style={styles.calCell}>
                  <Typography size={11.5} fFamily="bodySemiBold600" color="#3F3F46" textAlign="center">
                    {String(d)}
                  </Typography>
                </View>
              ))}

              {AUG_DAYS.map(d => {
                const done = [25, 26, 27].includes(d);
                const today = d === 28;
                return (
                  <View
                    key={`cur-${d}`}
                    style={[styles.calCell, styles.calDay, today ? styles.calToday : done ? styles.calDone : null]}
                  >
                    {today ? (
                      <LinearGradient
                        colors={['#8D22FF', '#A84DF0']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.absFill}
                      />
                    ) : null}
                    <Typography
                      size={12}
                      fFamily="monoBold700"
                      textAlign="center"
                      color={today ? COLORS.white : done ? COLORS.success : '#A1A1AA'}
                    >
                      {String(d)}
                    </Typography>
                  </View>
                );
              })}
            </View>
          </View>

          {/* 4 · Recommendations */}
          <View style={styles.recList}>
            <Typography size={15} fFamily="bodyExtraBold800" color={COLORS.white} style={styles.sectionLabel}>
              Recommendation For You
            </Typography>

            {RECOMMENDATIONS.map(rec => (
              <Pressable
                key={rec.id}
                onPress={() => openRoutine(rec.id)}
                style={({ pressed }) => [styles.recCard, pressed && styles.pressed]}
              >
                <Image source={rec.img} resizeMode="cover" style={[styles.absFill, styles.recImg]} />
                <LinearGradient
                  colors={['transparent', 'rgba(11,11,13,0.5)', '#0B0B0D']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.absFill}
                  pointerEvents="none"
                />

                <View style={styles.recBody}>
                  <View style={styles.recPills}>
                    <GlassPill icon="clock" iconColor="#C084FC" text={rec.time} small />
                    <GlassPill icon="flame" iconColor={COLORS.warning} text={rec.cals} textColor={COLORS.warning} small />
                  </View>

                  <View style={styles.rowBetween}>
                    <Typography size={17} fFamily="bodyExtraBold800" color={COLORS.white} lineHeight={21} flex={1}>
                      {rec.title}
                    </Typography>
                    <View style={styles.recChevron}>
                      <Icon name="chevron-right" size={Sizer.fS(16)} color={COLORS.white} />
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: bottomPad }} showsVerticalScrollIndicator={false}>
          {/* Immersive header */}
          <View style={styles.routineHero}>
            <Image source={currentRoutine.heroImage} resizeMode="cover" style={[styles.absFill, styles.routineImg]} />
            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'transparent', '#0B0B0D']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.absFill}
              pointerEvents="none"
            />
            <Pressable
              onPress={() => setViewMode('hub')}
              style={[styles.routineBack, { top: insets.top + Sizer.vSize(16) }]}
            >
              <Icon name="chevron-left" size={Sizer.fS(20)} color={COLORS.white} />
            </Pressable>
          </View>

          <View style={styles.routineBody}>
            <Typography
              size={28}
              fFamily="displayBold700"
              color={COLORS.white}
              textTransform="uppercase"
              lineHeight={33}
              letterSpacing={-0.7}
              mB={6}
            >
              {currentRoutine.title}
            </Typography>
            <Typography size={12.5} color="#A1A1AA" lineHeight={19} mB={16}>
              {currentRoutine.description}
            </Typography>

            <View style={styles.metrics}>
              <Metric icon="flame" iconColor={COLORS.primary} value={currentRoutine.calories} label="KCAL" />
              <Metric icon="clock" iconColor="#C084FC" value={currentRoutine.durationMin} label="MIN" style={styles.metricMid} />
              <Metric icon="dumbbell" iconColor={COLORS.success} value={currentRoutine.setsCount} label="SETS" />
            </View>

            <View style={styles.exerciseList}>
              <Typography
                size={13}
                fFamily="bodyBold700"
                color="#A1A1AA"
                textTransform="uppercase"
                letterSpacing={0.33}
                style={styles.sectionLabel}
              >
                {`EXERCISES (${currentRoutine.exercises.length})`}
              </Typography>

              {currentRoutine.exercises.map(ex => (
                <Pressable key={ex.id} onPress={() => setInspectingExercise(ex)} style={styles.exercise}>
                  <View style={styles.exerciseLeft}>
                    <View style={styles.exerciseThumb}>
                      <Image source={ex.videoThumbnail} resizeMode="cover" style={styles.exerciseThumbImg} />
                    </View>
                    <View style={styles.flex}>
                      <Typography size={14.5} fFamily="bodyBold700" color={COLORS.white} numberOfLines={1}>
                        {ex.name}
                      </Typography>
                      <Typography size={11.5} color="#A1A1AA" numberOfLines={1} mT={2}>
                        {ex.primaryMuscle}
                      </Typography>
                    </View>
                  </View>

                  <View style={styles.exerciseRight}>
                    <View style={styles.exerciseStats}>
                      <Typography size={12.5} fFamily="monoBold700" color={COLORS.white}>
                        {`${ex.durationMin} MIN`}
                      </Typography>
                      <Typography size={11} fFamily="monoBold700" color="#C084FC">
                        {`${ex.setsCount} SETS`}
                      </Typography>
                    </View>
                    <View style={styles.exerciseInfo}>
                      <Icon name="info" size={Sizer.fS(16)} color="#A1A1AA" />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>

            <DmvButton
              title={`Start Workout · ${currentRoutine.title}`}
              variant="primary"
              onPress={beginWorkout}
            />
          </View>
        </ScrollView>
      )}

      <ExerciseDetailModal
        exercise={inspectingExercise}
        onClose={() => setInspectingExercise(null)}
        onStartWorkout={() => {
          setInspectingExercise(null);
          beginWorkout();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0B0D' },
  scroll: { paddingHorizontal: Sizer.hSize(16), width: '100%', maxWidth: SHELL_MAX_WIDTH, alignSelf: 'center' },
  absFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  flex: { flex: 1, minWidth: 0 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pressed: { transform: [{ scale: 0.98 }] },
  sectionLabel: { paddingHorizontal: 4 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizer.vSize(16) },
  greetRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12), flex: 1, minWidth: 0 },
  avatarRing: { width: 48, height: 48, borderRadius: RADIUS.full, padding: 2, overflow: 'hidden' },
  avatarInner: {
    flex: 1,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#0B0B0D',
  },
  avatarPhoto: { width: '100%', height: '100%' },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  nameEmoji: { marginLeft: Sizer.hSize(6) },
  bell: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: '#0B0B0D',
  },

  heroCard: {
    borderRadius: 26,
    overflow: 'hidden',
    padding: Sizer.hSize(20),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.4)',
    minHeight: Sizer.vSize(185),
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(20),
    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  heroImg: { opacity: 0.7, width: '100%', height: '100%' },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8), flexWrap: 'wrap' },
  heroBottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: Sizer.vSize(24) },
  heroActions: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(10), flexShrink: 0 },
  playBtn: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  heroChevron: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(24,24,27,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(4),
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  glassPillSm: { paddingHorizontal: Sizer.hSize(8), paddingVertical: 2, borderColor: COLORS.hairline },

  card: {
    borderRadius: 24,
    padding: Sizer.hSize(20),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    marginBottom: Sizer.vSize(20),
  },
  activeDay: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  weekTotals: { flexDirection: 'row', alignItems: 'baseline', gap: Sizer.hSize(32), marginTop: Sizer.vSize(12), marginBottom: Sizer.vSize(24) },
  totalRow: { flexDirection: 'row', alignItems: 'baseline', gap: Sizer.hSize(6), marginTop: 2 },

  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: Sizer.vSize(112),
    paddingTop: Sizer.vSize(16),
    paddingHorizontal: Sizer.hSize(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  barCol: { flex: 1, alignItems: 'center', gap: Sizer.vSize(6) },
  barTagWrap: {
    position: 'absolute',
    top: -Sizer.vSize(10),
    left: -Sizer.hSize(24),
    right: -Sizer.hSize(24),
    alignItems: 'center',
  },
  barTag: {
    paddingHorizontal: Sizer.hSize(8),
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.6,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  barSlot: {
    width: Sizer.hSize(28),
    height: Sizer.vSize(64),
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: { width: '100%', borderRadius: 10, overflow: 'hidden' },
  barIdle: { flex: 1, backgroundColor: COLORS.raised },

  streakStats: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(16) },
  streakStat: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Sizer.hSize(6), paddingTop: Sizer.vSize(4), marginTop: Sizer.vSize(12) },
  calCell: { width: CAL_DAY_WIDTH, paddingVertical: Sizer.vSize(6), alignItems: 'center', justifyContent: 'center' },
  calDay: { borderRadius: 10, overflow: 'hidden' },
  calToday: {
    shadowColor: COLORS.primary,
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  calDone: { backgroundColor: 'rgba(46,212,122,0.2)', borderWidth: 1, borderColor: 'rgba(46,212,122,0.4)' },

  recList: { gap: Sizer.vSize(12) },
  recCard: {
    borderRadius: 22,
    overflow: 'hidden',
    padding: Sizer.hSize(16),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    minHeight: Sizer.vSize(135),
    justifyContent: 'flex-end',
  },
  recImg: { opacity: 0.65, width: '100%', height: '100%' },
  recBody: { gap: Sizer.vSize(4) },
  recPills: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8), flexWrap: 'wrap' },
  recChevron: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },

  routineHero: { width: '100%', height: Sizer.vSize(270), overflow: 'hidden', backgroundColor: COLORS.black },
  routineImg: { opacity: 0.9, width: '100%', height: '100%' },
  routineBack: {
    position: 'absolute',
    left: Sizer.hSize(16),
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routineBody: {
    paddingHorizontal: Sizer.hSize(16),
    paddingTop: Sizer.vSize(16),
    width: '100%',
    maxWidth: SHELL_MAX_WIDTH,
    alignSelf: 'center',
  },

  metrics: {
    borderRadius: 20,
    padding: Sizer.hSize(16),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    flexDirection: 'row',
    marginBottom: Sizer.vSize(20),
  },
  metric: { flex: 1, alignItems: 'center' },
  metricMid: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  metricIcon: { marginBottom: 4 },

  exerciseList: { gap: Sizer.vSize(10), marginBottom: Sizer.vSize(24) },
  exercise: {
    borderRadius: 18,
    padding: Sizer.hSize(12),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(14), flex: 1, minWidth: 0 },
  exerciseThumb: {
    width: Sizer.hSize(56),
    height: Sizer.hSize(56),
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    flexShrink: 0,
  },
  exerciseThumbImg: { width: '100%', height: '100%' },
  exerciseRight: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12), flexShrink: 0 },
  exerciseStats: { alignItems: 'flex-end' },
  exerciseInfo: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TodaysWorkoutScreen;
