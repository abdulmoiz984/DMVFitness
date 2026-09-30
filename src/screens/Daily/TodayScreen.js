import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { Emoji, RichText } from '../../components';
import { SHELL_MAX_WIDTH, TABBAR_CLEARANCE } from '../../constants';
import { weeklyHistoricalData } from '../../lib/daily-data';
import { selectUser, showToast, startWorkoutSession } from '../../redux/slices/appSlice';
import { formatNumber } from '../../utils';

const WEEK_DATES = [25, 26, 27, 28, 29, 30, 31];

const MOODS = [
  { id: 'energetic', emoji: '⚡', label: 'Energetic' },
  { id: 'focused', emoji: '🎯', label: 'Focused' },
  { id: 'good', emoji: '😊', label: 'Good' },
  { id: 'sore', emoji: '🔥', label: 'Sore' },
  { id: 'tired', emoji: '😴', label: 'Tired' },
  { id: 'stressed', emoji: '🤯', label: 'Stressed' },
];

const PROFILE_PHOTO = {
  uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

const Metric = ({ label, value, unit, note, valueColor = COLORS.white, noteColor = '#71717A' }) => (
  <View style={styles.metric}>
    <Typography size={10} fFamily="bodyBold700" color="#A1A1AA" textTransform="uppercase" letterSpacing={0.25}>
      {label}
    </Typography>
    <Typography size={20} fFamily="monoBold700" color={valueColor} mT={2}>
      {value}
      {unit ? (
        <Typography size={12} fFamily="monoBold700" color={valueColor}>
          {` ${unit}`}
        </Typography>
      ) : null}
    </Typography>
    <RichText size={10} color={noteColor}>
      {note}
    </RichText>
  </View>
);

const MacroChip = ({ label, value, target }) => (
  <View style={styles.macroChip}>
    <Typography
      size={10}
      fFamily="bodyBold700"
      color="#A1A1AA"
      textTransform="uppercase"
      letterSpacing={0.25}
      textAlign="center"
    >
      {label}
    </Typography>
    <Typography size={14} fFamily="monoBold700" textAlign="center">
      {`${value}g `}
      <Typography size={10} fFamily="monoBold700" color="#71717A">
        {`/ ${target}g`}
      </Typography>
    </Typography>
  </View>
);

/** Screen 18 · Today */
const TodayScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const user = useSelector(selectUser);

  const [selectedDayDate, setSelectedDayDate] = useState(28);
  const [selectedMood, setSelectedMood] = useState('energetic');

  const day = weeklyHistoricalData[selectedDayDate] || weeklyHistoricalData[28];
  const { isFuture, isToday, workout, consumed, targets, heartRate } = day;
  const caloriePct = Math.min(100, (consumed.calories / targets.calories) * 100);

  const pickDay = dateNum => {
    const d = weeklyHistoricalData[dateNum];
    setSelectedDayDate(dateNum);
    if (d.isFuture) {
      dispatch(showToast(`Selected upcoming date (${d.name} ${d.date}). Future logging is locked.`));
    } else if (d.isToday) {
      dispatch(showToast(`Selected Today (${d.fullDate})`));
    } else {
      dispatch(showToast(`Viewing logged history for ${d.fullDate}`));
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + Sizer.vSize(12), paddingBottom: TABBAR_CLEARANCE + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1 · Greeting */}
        <View style={styles.header}>
          <View style={styles.greetRow}>
            <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'MeTab' })} style={styles.avatarRing}>
              <LinearGradient
                colors={['#8D22FF', '#C084FC']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.avatarGradient}
              />
              <View style={styles.avatarInner}>
                <Image source={PROFILE_PHOTO} style={styles.avatarPhoto} resizeMode="cover" />
              </View>
            </Pressable>

            <View style={styles.greetText}>
              <Typography size={12} fFamily="bodyBold700" color="#A1A1AA">
                GOOD MORNING
              </Typography>
              <View style={styles.nameRow}>
                <Typography size={19} fFamily="bodyExtraBold800" color={COLORS.white} lineHeight={23}>
                  {user.name}
                </Typography>
                <Emoji char="👋" size={18} style={styles.nameEmoji} />
              </View>
            </View>
          </View>

          <Pressable onPress={() => navigation.navigate('NotificationsScreen')} style={styles.bell}>
            <Icon name="bell" size={Sizer.fS(20)} color={COLORS.white} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        {/* 2 · Streak + week strip */}
        <View style={styles.card}>
          <View style={styles.streakRow}>
            <View style={styles.streakLeft}>
              <View style={styles.flameDisc}>
                <Icon name="flame" size={Sizer.fS(16)} color={COLORS.primary} />
              </View>
              <Typography size={15} fFamily="bodyExtraBold800" color={COLORS.white}>
                {`${user.streakDays}-Day Logging Streak`}
              </Typography>
            </View>
            <View style={styles.activePill}>
              <Typography size={11.5} fFamily="bodyBold700" color={COLORS.success}>
                Active{' '}
              </Typography>
              <Emoji char="🔥" size={11} />
            </View>
          </View>

          <View style={styles.weekRow}>
            {WEEK_DATES.map(dateNum => {
              const d = weeklyHistoricalData[dateNum];
              const on = selectedDayDate === dateNum;
              return (
                <Pressable
                  key={dateNum}
                  onPress={() => pickDay(dateNum)}
                  style={[
                    styles.dayCell,
                    on ? styles.daySelected : d.isToday ? styles.dayToday : !d.isFuture ? styles.dayPast : styles.dayFuture,
                  ]}
                >
                  {on ? (
                    <LinearGradient
                      colors={['#8D22FF', '#A84DF0']}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={styles.dayFill}
                    />
                  ) : null}
                  <Typography
                    size={10}
                    fFamily="bodyBold700"
                    textTransform="uppercase"
                    color={on ? COLORS.white : d.isToday ? '#C084FC' : d.isFuture ? '#52525B' : COLORS.white}
                  >
                    {d.name}
                  </Typography>
                  <Typography
                    size={13}
                    fFamily="monoBold700"
                    mT={2}
                    color={on ? COLORS.white : d.isToday ? '#C084FC' : d.isFuture ? '#52525B' : COLORS.white}
                  >
                    {String(d.date)}
                  </Typography>
                  {d.isFuture ? (
                    <Emoji char="🔒" size={8} style={styles.dayLock} />
                  ) : (
                    <View
                      style={[
                        styles.dayDot,
                        { backgroundColor: on ? COLORS.white : d.pct > 0 ? COLORS.success : 'transparent' },
                      ]}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Future notice */}
        {isFuture ? (
          <View style={styles.futureBanner}>
            <LinearGradient
              colors={['#2A1D3A', '#141417']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.bannerFill}
            />
            <Icon name="calendar-clock" size={Sizer.fS(20)} color="#C084FC" style={styles.bannerIcon} />
            <View style={styles.bannerText}>
              <Typography size={13} fFamily="bodyExtraBold800" color={COLORS.white}>
                {`Upcoming Date (${day.fullDate})`}
              </Typography>
              <Typography size={11.5} color="#A1A1AA" lineHeight={17} mT={2}>
                {`No historical data recorded. You cannot log food or complete workouts in the future, but your planned routine and calorie target (${targets.calories} kcal) are shown below.`}
              </Typography>
            </View>
          </View>
        ) : null}

        <View style={styles.stack}>
          {/* 3 · Training */}
          <View style={styles.bigCard}>
            <View style={styles.cardHead}>
              <View style={styles.cardHeadLeft}>
                <Icon name="dumbbell" size={Sizer.fS(20)} color={COLORS.primary} />
                {/* flex so the title wraps inside the shrunken box instead of
                    running under the pill, as it does in the mock */}
                <Typography size={16} fFamily="bodyBold700" color={COLORS.white} flex={1}>
                  {isToday ? "Today's Training" : isFuture ? 'Scheduled Training' : 'Completed Training'}
                </Typography>
              </View>
              <View
                style={[
                  styles.statusPill,
                  workout.status === 'completed'
                    ? styles.pillDone
                    : isFuture
                    ? styles.pillFuture
                    : styles.pillActive,
                ]}
              >
                {/* The mock lets this wrap to a second line rather than truncate. */}
                <Typography
                  size={11}
                  fFamily="bodyBold700"
                  color={workout.status === 'completed' ? COLORS.success : isFuture ? '#A1A1AA' : '#C084FC'}
                >
                  {`${workout.name} · ${workout.category}`}
                </Typography>
              </View>
            </View>

            <View style={styles.metrics}>
              <Metric
                label="BURNED"
                value={isFuture ? '--' : formatNumber(workout.calsBurned)}
                note={isFuture ? 'Planned 2,000' : '/ 2,000 kcal'}
              />
              <Metric
                label="STEPS"
                value={isFuture ? '--' : formatNumber(workout.steps)}
                note={isFuture ? 'Goal 10,000' : '/ 10,000'}
              />
              <Metric
                label="ACTIVE"
                value={isFuture ? '--' : String(workout.activeMin)}
                unit={isFuture ? '' : 'MIN'}
                valueColor={COLORS.primary}
                note={workout.status === 'completed' ? 'Completed ✓' : isFuture ? 'Scheduled' : 'On Track'}
                noteColor={COLORS.success}
              />
            </View>

            {isFuture ? (
              <View style={[styles.action, styles.actionLocked]}>
                <Icon name="lock" size={Sizer.fS(16)} color="#71717A" />
                <Typography size={14} fFamily="bodyBold700" color="#71717A" numberOfLines={1} flex={1}>
                  {workout.statusNote}
                </Typography>
              </View>
            ) : workout.status === 'completed' ? (
              <Pressable
                onPress={() => {
                  navigation.navigate('MainTabs', { screen: 'TrainTab' });
                  dispatch(showToast(`Viewing completed workout log for ${day.fullDate}`));
                }}
                style={({ pressed }) => [
                  styles.action,
                  styles.actionDone,
                  pressed && styles.actionPressed,
                ]}
              >
                <Icon name="circle-check-big" size={Sizer.fS(20)} color={COLORS.success} />
                <RichText size={15} fFamily="bodyBold700" color={COLORS.success} numberOfLines={1} flex={1}>
                  {`View Log · ${workout.name} (Done ✓)`}
                </RichText>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  dispatch(startWorkoutSession());
                  navigation.navigate('MainTabs', { screen: 'TrainTab' });
                }}
                style={({ pressed }) => [styles.action, styles.actionStart, pressed && styles.actionPressed]}
              >
                <LinearGradient
                  colors={['#8D22FF', '#A84DF0']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.actionFill}
                />
                <Icon name="dumbbell" size={Sizer.fS(20)} color={COLORS.white} />
                <Typography size={15} fFamily="bodyBold700" color={COLORS.white} numberOfLines={1} flex={1}>
                  {`Start Workout · ${workout.name}`}
                </Typography>
              </Pressable>
            )}
          </View>

          {/* 4 · Nutrition */}
          <View style={styles.bigCard}>
            <View style={styles.cardHead}>
              <View style={styles.cardHeadLeft}>
                <Icon name="utensils" size={Sizer.fS(20)} color={COLORS.primary} />
                <Typography size={16} fFamily="bodyBold700" color={COLORS.white}>
                  {`Nutrition (${day.name})`}
                </Typography>
              </View>
              <Pressable
                onPress={() => navigation.navigate('MainTabs', { screen: 'DiaryTab' })}
                hitSlop={8}
                style={styles.openDiary}
              >
                <Typography size={12} fFamily="bodyBold700" color={COLORS.primarySoft}>
                  Open Diary
                </Typography>
                <Icon name="chevron-right" size={Sizer.fS(14)} color={COLORS.primarySoft} />
              </Pressable>
            </View>

            <View style={styles.calRow}>
              <View style={styles.calLeft}>
                <Typography size={24} fFamily="monoBold700" color={COLORS.white}>
                  {String(consumed.calories)}
                </Typography>
                <Typography size={12} fFamily="bodyBold700" color="#A1A1AA">
                  {`/ ${targets.calories} KCAL`}
                </Typography>
              </View>
              <Typography size={12} fFamily="bodyBold700" color={isFuture ? '#A1A1AA' : COLORS.success}>
                {isFuture ? 'Planned Target' : `${targets.calories - consumed.calories} kcal left`}
              </Typography>
            </View>

            <View style={styles.calTrack}>
              <LinearGradient
                colors={['#8D22FF', '#C084FC']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[styles.calFill, { width: `${caloriePct}%` }]}
              />
            </View>

            <View style={styles.macroRow}>
              <MacroChip label="Protein" value={consumed.protein} target={targets.protein} />
              <MacroChip label="Carbs" value={consumed.carbs} target={targets.carbs} />
              <MacroChip label="Fat" value={consumed.fat} target={targets.fat} />
            </View>

            {isFuture ? (
              <View style={[styles.logFood, styles.logLocked]}>
                <Icon name="lock" size={Sizer.fS(14)} color="#71717A" />
                <Typography size={12} fFamily="bodySemiBold600" color="#71717A">
                  {`Logging Unlocks on ${day.name}`}
                </Typography>
              </View>
            ) : (
              <Pressable
                onPress={() => navigation.navigate('SearchFoodScreen')}
                style={({ pressed }) => [styles.logFood, styles.logOpen, pressed && styles.actionPressed]}
              >
                <Icon name="plus" size={Sizer.fS(16)} color="#C084FC" />
                <Typography size={13} fFamily="bodyBold700" color="#C084FC">
                  Log Food & Meals
                </Typography>
              </Pressable>
            )}
          </View>

          {/* 5 · Heart rate */}
          <View style={styles.bigCard}>
            <View style={styles.hrHead}>
              <Emoji char="❤️" size={16} />
              <Typography size={15} fFamily="bodyBold700" color={COLORS.white}>
                Heart Rate Monitor
              </Typography>
            </View>

            {isFuture ? (
              <View style={styles.hrEmpty}>
                <Icon name="clock" size={Sizer.fS(32)} color="#52525B" style={styles.hrEmptyIcon} />
                <Typography size={13} fFamily="bodySemiBold600" color={COLORS.white} textAlign="center">
                  No Telemetry Recorded
                </Typography>
                <Typography size={11} color="#71717A" textAlign="center" mT={2}>
                  {`Heart rate data will stream live when you wear your sensor on ${day.name}.`}
                </Typography>
              </View>
            ) : (
              <>
                <View style={styles.hrStats}>
                  <View>
                    <Typography size={10} fFamily="bodyBold700" color="#A1A1AA" textTransform="uppercase" letterSpacing={0.25}>
                      AVG
                    </Typography>
                    <View style={styles.hrValueRow}>
                      <Typography size={24} fFamily="monoBold700" color={COLORS.white}>
                        {String(heartRate.avg)}
                      </Typography>
                      <Typography size={11} color="#A1A1AA">
                        BPM
                      </Typography>
                    </View>
                  </View>

                  <View style={styles.hrRight}>
                    <Typography
                      size={10}
                      fFamily="bodyBold700"
                      color="#A1A1AA"
                      textTransform="uppercase"
                      letterSpacing={0.25}
                      textAlign="right"
                    >
                      RANGE
                    </Typography>
                    <View style={styles.hrValueRow}>
                      <Typography size={24} fFamily="monoBold700" color={COLORS.white}>
                        {heartRate.range}
                      </Typography>
                      <Typography size={11} color="#A1A1AA">
                        BPM
                      </Typography>
                    </View>
                  </View>
                </View>

                <View style={styles.hrChart}>
                  {heartRate.bars.map(bar => (
                    <View key={bar.time} style={styles.hrCol}>
                      {bar.active ? (
                        <View style={styles.hrBadge}>
                          <Typography size={9.5} fFamily="monoBold700" color={COLORS.white}>
                            {String(bar.bpm)}
                          </Typography>
                        </View>
                      ) : null}
                      <View style={styles.hrBarSlot}>
                        <View style={[styles.hrBar, { height: `${bar.heightPct}%` }]}>
                          {bar.active ? (
                            <LinearGradient
                              colors={['#B36BFF', '#8D22FF']}
                              start={{ x: 0.5, y: 0 }}
                              end={{ x: 0.5, y: 1 }}
                              style={styles.hrBarFill}
                            />
                          ) : (
                            <View style={styles.hrBarIdle} />
                          )}
                        </View>
                      </View>
                      <Typography size={9.5} fFamily="bodySemiBold600" color="#A1A1AA">
                        {bar.time}
                      </Typography>
                    </View>
                  ))}
                </View>

                <View style={styles.zoneWrap}>
                  <Typography size={11} fFamily="bodyBold700" color="#A1A1AA" textTransform="uppercase" letterSpacing={0.28}>
                    HEART RATE ZONE
                  </Typography>
                  <View style={styles.zoneBar}>
                    {[COLORS.success, COLORS.primary, COLORS.warning, COLORS.danger].map(c => (
                      <View key={c} style={[styles.zoneSeg, { backgroundColor: c }]} />
                    ))}
                  </View>
                  <View style={styles.zoneLegend}>
                    {[
                      ['60', 'Average'],
                      ['102', 'Healthy'],
                      ['142', 'Maximum'],
                      ['220', 'Danger'],
                    ].map(([n, l]) => (
                      <View key={l} style={styles.zoneCell}>
                        <Typography size={10} fFamily="monoBold700" color={COLORS.white}>
                          {n}
                        </Typography>
                        <Typography size={10} color="#A1A1AA">
                          {l}
                        </Typography>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}
          </View>

          {/* 6 · Mood */}
          <View style={styles.bigCard}>
            <Typography size={15} fFamily="bodyBold700" color={COLORS.white} mB={2}>
              Daily Readiness & Mood
            </Typography>
            <Typography size={11.5} color="#A1A1AA" mB={16}>
              Check in with yourself and track energy levels.
            </Typography>

            <View style={styles.moodRow}>
              {MOODS.map(m => {
                const on = selectedMood === m.id;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => {
                      if (isFuture) {
                        dispatch(showToast('Cannot log readiness for future dates!'));
                        return;
                      }
                      setSelectedMood(m.id);
                      dispatch(showToast(`Logged mood: ${m.label} ${m.emoji}`));
                    }}
                    style={[styles.mood, on ? styles.moodOn : styles.moodOff]}
                  >
                    <Emoji char={m.emoji} size={22} />
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0B0D' },
  scroll: {
    paddingHorizontal: Sizer.hSize(16),
    width: '100%',
    maxWidth: SHELL_MAX_WIDTH,
    alignSelf: 'center',
  },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizer.vSize(16) },
  greetRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12), flex: 1, minWidth: 0 },
  avatarRing: { width: 48, height: 48, borderRadius: RADIUS.full, padding: 2, overflow: 'hidden' },
  avatarGradient: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  avatarInner: {
    flex: 1,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#0B0B0D',
  },
  avatarPhoto: { width: '100%', height: '100%' },
  greetText: { flex: 1, minWidth: 0 },
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

  card: {
    borderRadius: 20,
    padding: Sizer.hSize(16),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    gap: Sizer.vSize(12),
    marginBottom: Sizer.vSize(16),
  },
  streakRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8), flex: 1, minWidth: 0 },
  flameDisc: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(141,34,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(46,212,122,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(46,212,122,0.3)',
  },

  weekRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 },
  dayCell: {
    width: Sizer.hSize(40),
    height: Sizer.vSize(56),
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dayFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  daySelected: {
    shadowColor: COLORS.primary,
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    transform: [{ scale: 1.05 }],
  },
  dayToday: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: 'rgba(141,34,255,0.4)' },
  dayPast: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  dayFuture: { backgroundColor: 'transparent' },
  dayDot: { width: 6, height: 6, borderRadius: RADIUS.full, marginTop: 2 },
  dayLock: { marginTop: 2 },

  futureBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(12),
    borderRadius: 18,
    padding: Sizer.hSize(14),
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.4)',
    marginBottom: Sizer.vSize(16),
    overflow: 'hidden',
  },
  bannerFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  bannerIcon: { marginTop: 2 },
  bannerText: { flex: 1, minWidth: 0 },

  stack: { gap: Sizer.vSize(16) },
  bigCard: {
    borderRadius: 22,
    padding: Sizer.hSize(20),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Sizer.hSize(8),
    marginBottom: Sizer.vSize(16),
  },
  cardHeadLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8), flexShrink: 1, minWidth: 0 },
  statusPill: {
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    flexShrink: 1,
  },
  pillDone: { backgroundColor: 'rgba(46,212,122,0.2)', borderColor: 'rgba(46,212,122,0.4)' },
  pillFuture: { backgroundColor: COLORS.raised, borderColor: COLORS.hairline },
  pillActive: { backgroundColor: 'rgba(141,34,255,0.2)', borderColor: 'rgba(141,34,255,0.4)' },

  metrics: { flexDirection: 'row', gap: Sizer.hSize(10), marginBottom: Sizer.vSize(16) },
  metric: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: Sizer.hSize(12),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  action: {
    width: '100%',
    height: Sizer.vSize(52),
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(10),
    paddingHorizontal: Sizer.hSize(16),
    overflow: 'hidden',
  },
  actionFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  actionLocked: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.hairline },
  actionDone: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: 'rgba(46,212,122,0.4)' },
  actionStart: {
    shadowColor: COLORS.primary,
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  actionPressed: { transform: [{ scale: 0.98 }] },

  openDiary: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(4) },
  calRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: Sizer.vSize(6) },
  calLeft: { flexDirection: 'row', alignItems: 'baseline', gap: Sizer.hSize(6) },
  calTrack: {
    width: '100%',
    height: 12,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.raised,
    overflow: 'hidden',
    marginBottom: Sizer.vSize(16),
  },
  calFill: { height: '100%', borderRadius: RADIUS.full },
  macroRow: { flexDirection: 'row', gap: Sizer.hSize(8), marginBottom: Sizer.vSize(12) },
  macroChip: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: Sizer.hSize(10),
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  logFood: {
    width: '100%',
    paddingVertical: Sizer.vSize(10),
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(6),
    borderWidth: 1,
  },
  logLocked: { backgroundColor: COLORS.surface, borderColor: 'rgba(255,255,255,0.05)' },
  logOpen: { backgroundColor: 'rgba(141,34,255,0.15)', borderColor: 'rgba(141,34,255,0.3)' },

  hrHead: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8), marginBottom: Sizer.vSize(12) },
  hrEmpty: { paddingVertical: Sizer.vSize(24), alignItems: 'center', justifyContent: 'center' },
  hrEmptyIcon: { marginBottom: Sizer.vSize(8) },
  hrStats: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: Sizer.vSize(16) },
  hrRight: { alignItems: 'flex-end' },
  hrValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: Sizer.hSize(4), marginTop: 2 },
  hrChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: Sizer.vSize(112),
    paddingTop: Sizer.vSize(16),
    paddingHorizontal: Sizer.hSize(8),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    marginBottom: Sizer.vSize(16),
  },
  hrCol: { alignItems: 'center', gap: Sizer.vSize(6), height: '100%', justifyContent: 'flex-end' },
  hrBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: Sizer.hSize(6),
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  hrBarSlot: { flex: 1, width: Sizer.hSize(24), justifyContent: 'flex-end' },
  hrBar: { width: '100%', borderTopLeftRadius: 6, borderTopRightRadius: 6, overflow: 'hidden' },
  hrBarFill: { flex: 1 },
  hrBarIdle: { flex: 1, backgroundColor: COLORS.raised },

  zoneWrap: { gap: Sizer.vSize(6) },
  zoneBar: { flexDirection: 'row', gap: Sizer.hSize(6), height: 8, borderRadius: RADIUS.full, overflow: 'hidden' },
  zoneSeg: { flex: 1, height: '100%' },
  zoneLegend: { flexDirection: 'row', gap: Sizer.hSize(4), paddingTop: 4 },
  zoneCell: { flex: 1 },

  moodRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mood: { width: 44, height: 44, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center' },
  moodOn: {
    backgroundColor: 'rgba(141,34,255,0.3)',
    borderWidth: 2,
    borderColor: COLORS.primary,
    transform: [{ scale: 1.15 }],
    shadowColor: COLORS.primary,
    shadowOpacity: 0.6,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 0 },
  },
  moodOff: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', opacity: 0.75 },
});

export default TodayScreen;
