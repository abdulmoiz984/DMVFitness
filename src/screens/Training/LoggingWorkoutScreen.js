import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { AvatarCoach, DmvButton, Emoji, RichText } from '../../components';
import { SHELL_MAX_WIDTH, TABBAR_CLEARANCE } from '../../constants';
import { richExerciseLibrary } from '../../lib/training-data';
import {
  finishWorkoutSession,
  selectRestTimer,
  selectWorkoutElapsed,
  showToast,
  startRestTimer,
} from '../../redux/slices/appSlice';
import { formatClock } from '../../utils';

const GUIDE_TABS = [
  { id: 'anatomy', emoji: '🎯', label: 'Anatomy' },
  { id: 'instructions', emoji: '📋', label: 'Steps' },
  { id: 'cues', emoji: '💡', label: 'Cues' },
  { id: 'mistakes', emoji: '⚠️', label: 'Mistakes' },
  { id: 'safety', emoji: '🛡️', label: 'Safety' },
];

/** The mock walks these three exercises in order, then finishes the session. */
const EXERCISE_ORDER = ['lat-pulldown', 'incline-bench', 'split-squat'];
const NEXT_LABEL = {
  'lat-pulldown': 'Next: Incline Barbell Bench Press',
  'incline-bench': 'Next: Bulgarian Split Squat',
};

const Metric = ({ icon, iconColor, value, label, style }) => (
  <View style={[styles.metric, style]}>
    <Icon name={icon} size={Sizer.fS(16)} color={iconColor} style={styles.metricIcon} />
    <Typography size={18} fFamily="monoBold700" color={COLORS.white}>
      {value}
    </Typography>
    <Typography size={9.5} fFamily="bodyBold700" color="#71717A" textTransform="uppercase">
      {label}
    </Typography>
  </View>
);

const InfoBox = ({ label, children }) => (
  <View style={styles.infoBox}>
    <Typography size={11} fFamily="bodyBold700" color="#A1A1AA" textTransform="uppercase" letterSpacing={0.28}>
      {label}
    </Typography>
    {children}
  </View>
);

const MiniTag = ({ label, value, tint = COLORS.white }) => (
  <View style={styles.miniTag}>
    <Typography size={9.5} fFamily="bodyBold700" color="#71717A" textTransform="uppercase">
      {label}
    </Typography>
    <Typography size={12} fFamily="bodyExtraBold800" color={tint} mT={2}>
      {value}
    </Typography>
  </View>
);

/** Screen 27 · Live Workout Logger */
const LoggingWorkoutScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const workoutElapsedTime = useSelector(selectWorkoutElapsed);
  const restTimerSeconds = useSelector(selectRestTimer);

  const [activeExerciseKey, setActiveExerciseKey] = useState('lat-pulldown');
  const [activeGuideTab, setActiveGuideTab] = useState('anatomy');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(35);

  const currentExercise = richExerciseLibrary[activeExerciseKey] || richExerciseLibrary['lat-pulldown'];
  const [exerciseSets, setExerciseSets] = useState(currentExercise.sets);

  const updateSet = (setNum, patch) =>
    setExerciseSets(prev => prev.map(item => (item.setNum === setNum ? { ...item, ...patch } : item)));

  const handleToggleSet = setNum =>
    setExerciseSets(prev =>
      prev.map(s => {
        if (s.setNum !== setNum) return s;
        const next = !s.completed;
        if (next) {
          dispatch(startRestTimer(90));
          dispatch(showToast(`Set ${setNum} completed! 90s rest timer started ⏱️`));
        }
        return { ...s, completed: next };
      }),
    );

  const handleNextExercise = () => {
    const idx = EXERCISE_ORDER.indexOf(activeExerciseKey);
    const nextKey = EXERCISE_ORDER[idx + 1];
    if (nextKey) {
      setActiveExerciseKey(nextKey);
      setExerciseSets(richExerciseLibrary[nextKey].sets);
      dispatch(showToast(NEXT_LABEL[activeExerciseKey]));
      return;
    }
    dispatch(finishWorkoutSession());
    navigation.navigate('WorkoutCompleteScreen');
  };

  const completedCount = exerciseSets.filter(s => s.completed).length;
  const isLast = activeExerciseKey === 'split-squat';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: TABBAR_CLEARANCE + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1 · Video player */}
        {/* The mock's player starts below the status bar, not behind it. */}
        <View style={[styles.player, { marginTop: insets.top }]}>
          <Image
            source={currentExercise.videoThumbnail}
            resizeMode="cover"
            style={[styles.playerImg, { opacity: isPlaying ? 0.95 : 0.6 }]}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)', '#000000']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.absFill}
            pointerEvents="none"
          />

          <View style={[styles.playerTop, { top: Sizer.vSize(12) }]}>
            <Pressable onPress={() => navigation.goBack()} style={styles.glassBtn}>
              <Icon name="chevron-left" size={Sizer.fS(20)} color={COLORS.white} />
            </Pressable>

            <View style={styles.timerPill}>
              <Icon name="clock" size={Sizer.fS(14)} color="#C084FC" />
              <Typography size={13} fFamily="monoBold700" color={COLORS.white}>
                {formatClock(workoutElapsedTime)}
              </Typography>
            </View>

            <Pressable onPress={() => setIsMuted(m => !m)} style={styles.glassBtn}>
              <Icon
                name={isMuted ? 'volume-x' : 'volume-2'}
                size={Sizer.fS(16)}
                color={isMuted ? '#A1A1AA' : '#C084FC'}
              />
            </Pressable>
          </View>

          <View style={styles.playerControls} pointerEvents="box-none">
            <Pressable
              onPress={() => {
                setVideoProgress(Math.max(0, videoProgress - 15));
                dispatch(showToast('Rewind 10s'));
              }}
              style={styles.skipBtn}
            >
              <Icon name="rotate-ccw" size={Sizer.fS(20)} color="rgba(255,255,255,0.8)" />
            </Pressable>

            <Pressable onPress={() => setIsPlaying(p => !p)} style={({ pressed }) => [styles.bigPlay, pressed && styles.pressed]}>
              <LinearGradient
                colors={['#8D22FF', '#A84DF0']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.absFill}
              />
              <Icon name={isPlaying ? 'pause' : 'play'} size={Sizer.fS(28)} color={COLORS.white} />
            </Pressable>

            <Pressable
              onPress={() => {
                setVideoProgress(Math.min(100, videoProgress + 15));
                dispatch(showToast('Forward 10s'));
              }}
              style={styles.skipBtn}
            >
              <Icon name="rotate-cw" size={Sizer.fS(20)} color="rgba(255,255,255,0.8)" />
            </Pressable>
          </View>

          <View style={styles.scrubber}>
            <View style={styles.scrubTrack}>
              <LinearGradient
                colors={['#8D22FF', '#C084FC']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[styles.scrubFill, { width: `${videoProgress}%` }]}
              />
            </View>
            <View style={styles.scrubLabels}>
              <Typography size={10} fFamily="monoRegular400" color="rgba(255,255,255,0.7)">
                0:18
              </Typography>
              <Typography size={10} fFamily="monoBold700" color="#C084FC">
                HD Form Demo · Coach Marcus
              </Typography>
              <Typography size={10} fFamily="monoRegular400" color="rgba(255,255,255,0.7)">
                0:45
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.exerciseHead}>
            <Typography
              size={26}
              fFamily="displayBold700"
              color={COLORS.white}
              textTransform="uppercase"
              lineHeight={31}
              letterSpacing={-0.65}
            >
              {currentExercise.name}
            </Typography>
            <Typography size={12} color="#A1A1AA" lineHeight={18} mT={4}>
              {currentExercise.overview}
            </Typography>
          </View>

          <View style={styles.metrics}>
            <Metric icon="flame" iconColor={COLORS.primary} value="150" label="KCAL" />
            <Metric icon="clock" iconColor="#C084FC" value={String(currentExercise.durationMin)} label="MIN" style={styles.metricMid} />
            <Metric
              icon="dumbbell"
              iconColor={COLORS.success}
              value={`${completedCount} / ${exerciseSets.length}`}
              label="COMPLETED"
            />
          </View>

          {restTimerSeconds > 0 ? (
            <View style={styles.restBanner}>
              <LinearGradient
                colors={['#2A1D3A', '#141417']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.absFill}
              />
              <View style={styles.restLeft}>
                <Icon name="timer" size={Sizer.fS(20)} color="#C084FC" />
                <View>
                  <Typography size={13} fFamily="bodyExtraBold800" color={COLORS.white}>
                    Rest Interval
                  </Typography>
                  <Typography size={10.5} color="#A1A1AA">
                    Catch your breath & hydrate
                  </Typography>
                </View>
              </View>
              <Typography size={24} fFamily="monoBold700" color="#C084FC">
                {formatClock(restTimerSeconds)}
              </Typography>
            </View>
          ) : null}

          {/* Set logger */}
          <View style={styles.logger}>
            <View style={styles.rowBetween}>
              <Typography size={14} fFamily="bodyExtraBold800" color={COLORS.white}>
                Exercise Sets
              </Typography>
              <Typography size={11} fFamily="bodyBold700" color="#C084FC">
                {`Rest Goal: ${currentExercise.defaultRest}`}
              </Typography>
            </View>

            <View style={styles.tableHead}>
              <Typography size={10.5} fFamily="bodyBold700" color="#71717A" textTransform="uppercase" style={styles.colSet}>
                SET
              </Typography>
              <Typography size={10.5} fFamily="bodyBold700" color="#71717A" textTransform="uppercase" style={styles.colPrev}>
                PREVIOUS
              </Typography>
              <Typography size={10.5} fFamily="bodyBold700" color="#71717A" textTransform="uppercase" style={styles.colWeight}>
                LBS
              </Typography>
              <Typography
                size={10.5}
                fFamily="bodyBold700"
                color="#71717A"
                textTransform="uppercase"
                textAlign="center"
                style={styles.colReps}
              >
                REPS
              </Typography>
              <RichText
                size={10.5}
                fFamily="bodyBold700"
                color="#71717A"
                textAlign="right"
                style={styles.colCheck}
              >
                ✓
              </RichText>
            </View>

            <View style={styles.setRows}>
              {exerciseSets.map(s => (
                <View key={s.setNum} style={[styles.setRow, s.completed ? styles.setDone : styles.setIdle]}>
                  <Typography size={14} fFamily="monoBold700" color={COLORS.white} style={styles.colSet}>
                    {String(s.setNum)}
                  </Typography>
                  <Typography size={11.5} fFamily="monoRegular400" color="#A1A1AA" style={styles.colPrev} numberOfLines={1}>
                    {s.previous}
                  </Typography>

                  <View style={styles.colWeight}>
                    <TextInput
                      value={s.weight}
                      onChangeText={v => updateSet(s.setNum, { weight: v })}
                      keyboardType="number-pad"
                      selectionColor={COLORS.primary}
                      allowFontScaling={false}
                      style={styles.setInput}
                    />
                  </View>

                  <View style={styles.colReps}>
                    <TextInput
                      value={s.reps}
                      onChangeText={v => updateSet(s.setNum, { reps: v })}
                      keyboardType="number-pad"
                      selectionColor={COLORS.primary}
                      allowFontScaling={false}
                      style={[styles.setInput, styles.setInputNarrow]}
                    />
                  </View>

                  <View style={[styles.colCheck, styles.checkWrap]}>
                    <Pressable
                      onPress={() => handleToggleSet(s.setNum)}
                      style={[styles.checkBox, s.completed ? styles.checkOn : styles.checkOff]}
                    >
                      {s.completed ? <Icon name="check" size={Sizer.fS(16)} color={COLORS.black} /> : null}
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Guide */}
          <View style={styles.guide}>
            <View style={styles.guideHead}>
              <View style={styles.guideTitle}>
                <Icon name="book-open" size={Sizer.fS(16)} color={COLORS.primary} />
                <Typography size={15} fFamily="bodyExtraBold800" color={COLORS.white}>
                  Exercise Guide & Technique
                </Typography>
              </View>
              <View style={styles.cscs}>
                <Typography size={10} fFamily="bodyExtraBold800" color={COLORS.success} textTransform="uppercase">
                  Verified CSCS
                </Typography>
              </View>
            </View>

            <View style={styles.tabBar}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow}>
                {GUIDE_TABS.map(tab => {
                  const on = activeGuideTab === tab.id;
                  return (
                    <Pressable
                      key={tab.id}
                      onPress={() => setActiveGuideTab(tab.id)}
                      style={[styles.tab, on ? styles.tabOn : styles.tabOff]}
                    >
                      {on ? (
                        <LinearGradient
                          colors={['#8D22FF', '#A84DF0']}
                          start={{ x: 0, y: 0.5 }}
                          end={{ x: 1, y: 0.5 }}
                          style={styles.absFill}
                        />
                      ) : null}
                      <Emoji char={tab.emoji} size={13} />
                      <Typography size={13.5} fFamily="bodyBold700" color={on ? COLORS.white : '#A1A1AA'}>
                        {tab.label}
                      </Typography>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {activeGuideTab === 'anatomy' ? (
              <View style={styles.panel}>
                <InfoBox label="PRIMARY MUSCLE">
                  <Typography size={14} fFamily="bodyBold700" color="#C084FC">
                    {currentExercise.primaryMuscle}
                  </Typography>
                </InfoBox>
                <InfoBox label="SECONDARY MUSCLES">
                  <Typography size={12.5} lineHeight={19}>
                    {currentExercise.secondaryMuscles}
                  </Typography>
                </InfoBox>

                <View style={styles.miniTags}>
                  <MiniTag label="DIFFICULTY" value={currentExercise.difficulty} />
                  <MiniTag label="DEFAULT REST" value={currentExercise.defaultRest} tint="#C084FC" />
                  <MiniTag label="LOG FORMAT" value={currentExercise.logFormat} />
                </View>

                <InfoBox label="TARGET VOLUME">
                  <Typography size={13} fFamily="bodyBold700" color={COLORS.white}>
                    {currentExercise.targetVolume}
                  </Typography>
                </InfoBox>
              </View>
            ) : null}

            {activeGuideTab === 'instructions' ? (
              <View style={styles.panel}>
                {currentExercise.instructions.map((step, idx) => (
                  <View key={step} style={styles.stepCard}>
                    <View style={styles.stepNum}>
                      <LinearGradient
                        colors={['#8D22FF', '#A84DF0']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.absFill}
                      />
                      <Typography size={12} fFamily="monoBold700" color={COLORS.white}>
                        {String(idx + 1)}
                      </Typography>
                    </View>
                    <Typography size={12.5} lineHeight={19} flex={1}>
                      {step}
                    </Typography>
                  </View>
                ))}
              </View>
            ) : null}

            {activeGuideTab === 'cues' ? (
              <View style={styles.panel}>
                <View style={styles.coachCard}>
                  <AvatarCoach size={40} fontSize={15} style={styles.coachAvatar} />
                  <View>
                    <Typography size={13} fFamily="bodyExtraBold800" color={COLORS.white}>
                      Coach Marcus Bell
                    </Typography>
                    <Typography size={11} color="#C084FC">
                      Head Performance Coach
                    </Typography>
                  </View>
                </View>

                {currentExercise.coachCues.map(cue => (
                  <View key={cue} style={styles.stepCard}>
                    <Icon name="quote" size={Sizer.fS(16)} color={COLORS.primary} style={styles.cardIcon} />
                    <Typography size={12.5} lineHeight={19} flex={1}>
                      {cue}
                    </Typography>
                  </View>
                ))}
              </View>
            ) : null}

            {activeGuideTab === 'mistakes' ? (
              <View style={styles.panel}>
                {currentExercise.commonMistakes.map((mistake, idx) => (
                  <View key={mistake} style={[styles.errorCard]}>
                    <View style={styles.errorHead}>
                      <Icon name="triangle-alert" size={Sizer.fS(16)} color={COLORS.danger} />
                      <Typography size={11.5} fFamily="bodyExtraBold800" color={COLORS.danger} textTransform="uppercase">
                        {`Form Error #${idx + 1}`}
                      </Typography>
                    </View>
                    <Typography size={12.5} lineHeight={19} mT={2} style={styles.errorBody}>
                      {mistake}
                    </Typography>
                  </View>
                ))}
              </View>
            ) : null}

            {activeGuideTab === 'safety' ? (
              <View style={styles.panel}>
                <View style={styles.subGroup}>
                  <View style={styles.subLabel}>
                    <Emoji char="🛡️" size={12} />
                    <Typography
                      size={11.5}
                      fFamily="bodyBold700"
                      color={COLORS.success}
                      textTransform="uppercase"
                      letterSpacing={0.29}
                    >
                      JOINT PROTECTION TIPS
                    </Typography>
                  </View>
                  {currentExercise.safetyTips.map(tip => (
                    <View key={tip} style={[styles.stepCard, styles.safeCard]}>
                      <Icon name="shield-check" size={Sizer.fS(16)} color={COLORS.success} style={styles.cardIcon} />
                      <Typography size={12.5} lineHeight={19} flex={1}>
                        {tip}
                      </Typography>
                    </View>
                  ))}
                </View>

                <View style={styles.subGroup}>
                  <View style={styles.subLabel}>
                    <Emoji char="📈" size={12} />
                    <Typography
                      size={11.5}
                      fFamily="bodyBold700"
                      color="#38BDF8"
                      textTransform="uppercase"
                      letterSpacing={0.29}
                    >
                      TRAINING BENEFITS
                    </Typography>
                  </View>
                  {currentExercise.benefits.map(benefit => (
                    <View key={benefit} style={[styles.stepCard, styles.benefitCard]}>
                      <Icon name="trending-up" size={Sizer.fS(16)} color="#38BDF8" style={styles.cardIcon} />
                      <Typography size={12.5} lineHeight={19} flex={1}>
                        {benefit}
                      </Typography>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </View>

          <DmvButton
            title={isLast ? 'Finish Workout Session 🎉' : 'Next Exercise →'}
            variant="primary"
            onPress={handleNextExercise}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0B0D' },
  absFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pressed: { transform: [{ scale: 0.95 }] },

  player: { width: '100%', aspectRatio: 16 / 9, backgroundColor: COLORS.black, overflow: 'hidden' },
  playerImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  playerTop: {
    position: 'absolute',
    left: Sizer.hSize(12),
    right: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  glassBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(6),
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(4),
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  playerControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(32),
    zIndex: 1,
  },
  skipBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigPlay: {
    width: Sizer.hSize(64),
    height: Sizer.hSize(64),
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.7,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
  },
  scrubber: { position: 'absolute', bottom: Sizer.vSize(8), left: Sizer.hSize(16), right: Sizer.hSize(16), gap: 4, zIndex: 2 },
  scrubTrack: { width: '100%', height: 6, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' },
  scrubFill: { height: '100%', borderRadius: RADIUS.full },
  scrubLabels: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  body: {
    paddingHorizontal: Sizer.hSize(16),
    paddingTop: Sizer.vSize(16),
    width: '100%',
    maxWidth: SHELL_MAX_WIDTH,
    alignSelf: 'center',
  },
  exerciseHead: { marginBottom: Sizer.vSize(16) },

  metrics: {
    borderRadius: 20,
    padding: Sizer.hSize(14),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    flexDirection: 'row',
    marginBottom: Sizer.vSize(16),
  },
  metric: { flex: 1, alignItems: 'center' },
  metricMid: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  metricIcon: { marginBottom: 2 },

  restBanner: {
    borderRadius: 18,
    padding: Sizer.hSize(14),
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(16),
    overflow: 'hidden',
  },
  restLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(10) },

  logger: {
    borderRadius: 22,
    padding: Sizer.hSize(16),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    marginBottom: Sizer.vSize(20),
  },
  tableHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Sizer.vSize(8),
    paddingHorizontal: Sizer.hSize(8),
    marginTop: Sizer.vSize(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  colSet: { width: '16%' },
  colPrev: { width: '33%' },
  colWeight: { width: '25%' },
  colReps: { width: '17%' },
  colCheck: { width: '9%' },
  checkWrap: { alignItems: 'flex-end' },
  setRows: { gap: Sizer.vSize(8), paddingTop: Sizer.vSize(8) },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizer.hSize(10),
    borderRadius: 14,
    borderWidth: 1,
  },
  setDone: { backgroundColor: 'rgba(46,212,122,0.1)', borderColor: 'rgba(46,212,122,0.4)' },
  setIdle: { backgroundColor: COLORS.surface, borderColor: 'rgba(255,255,255,0.05)' },
  setInput: {
    width: Sizer.hSize(56),
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    textAlign: 'center',
    color: COLORS.white,
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: Sizer.fS(13),
    padding: 0,
  },
  setInputNarrow: { width: Sizer.hSize(40), alignSelf: 'center' },
  checkBox: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  checkOn: {
    backgroundColor: COLORS.success,
    shadowColor: COLORS.success,
    shadowOpacity: 0.8,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  checkOff: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: COLORS.surface },

  guide: {
    borderRadius: 24,
    padding: Sizer.hSize(20),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    marginBottom: Sizer.vSize(20),
  },
  guideHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizer.vSize(14) },
  guideTitle: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8), flexShrink: 1 },
  cscs: {
    paddingHorizontal: Sizer.hSize(8),
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(46,212,122,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(46,212,122,0.3)',
  },
  tabBar: {
    padding: Sizer.hSize(6),
    backgroundColor: '#101013',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    marginBottom: Sizer.vSize(16),
  },
  tabRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8) },
  tab: {
    height: 46,
    paddingHorizontal: Sizer.hSize(16),
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(6),
    overflow: 'hidden',
    flexShrink: 0,
  },
  tabOn: {
    borderWidth: 1,
    borderColor: 'rgba(192,132,252,0.4)',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  tabOff: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },

  panel: { gap: Sizer.vSize(12) },
  infoBox: {
    padding: Sizer.hSize(12),
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: Sizer.vSize(6),
  },
  miniTags: { flexDirection: 'row', gap: Sizer.hSize(8) },
  miniTag: {
    flex: 1,
    padding: Sizer.hSize(10),
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  stepCard: {
    padding: Sizer.hSize(12),
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(12),
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
    marginTop: 2,
  },
  cardIcon: { marginTop: 2 },
  coachCard: {
    padding: Sizer.hSize(12),
    borderRadius: 16,
    backgroundColor: 'rgba(141,34,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
  },
  coachAvatar: { borderWidth: 2, borderColor: COLORS.primary },
  errorCard: {
    padding: Sizer.hSize(12),
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,77,94,0.3)',
    gap: 4,
  },
  errorHead: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8) },
  errorBody: { paddingLeft: Sizer.hSize(24) },
  safeCard: { borderColor: 'rgba(46,212,122,0.3)' },
  benefitCard: { borderColor: 'rgba(56,189,248,0.3)' },
  subGroup: { gap: Sizer.vSize(8) },
  subLabel: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(6) },
});

export default LoggingWorkoutScreen;
