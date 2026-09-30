import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Defs, Line, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { Emoji, RichText, StackTabBar } from '../../components';
import { SHELL_MAX_WIDTH, TABBAR_CLEARANCE } from '../../constants';
import { images } from '../../assets/images';
import { bodyMeasurements, photoTimeline, strengthLifts, workoutFrequency } from '../../lib/progress-data';
import { selectUser, showToast } from '../../redux/slices/appSlice';
import { formatNumber } from '../../utils';

const TABS = ['Weight', 'Photos', 'Strength', 'Measures'];
const ANGLES = ['Front', 'Side', 'Back'];
const CURVE = 'M 10 15 C 60 22, 110 38, 160 52 C 210 65, 250 78, 290 85';
const AREA = `${CURVE} L 290 100 L 10 100 Z`;

const PhotoTile = ({ source, label, caption, highlight }) => (
  <View style={[styles.photoTile, highlight ? styles.photoTileOn : styles.photoTileOff]}>
    <Image source={source} resizeMode="cover" style={styles.photoImg} />
    <View style={styles.photoTag}>
      <Typography size={9} fFamily="bodyExtraBold800" color={COLORS.white} textTransform="uppercase" letterSpacing={0.25}>
        {label}
      </Typography>
    </View>
    <View style={styles.photoCaption}>
      <Typography size={9.5} fFamily="monoBold700" color={COLORS.white}>
        {caption}
      </Typography>
    </View>
  </View>
);

/** Screen 29 · Progress */
const ProgressScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const user = useSelector(selectUser);

  const [activeTab, setActiveTab] = useState('Weight');
  const [photoAngle, setPhotoAngle] = useState('Front');

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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.flex}>
            <Typography
              size={26}
              fFamily="displayBold700"
              color={COLORS.white}
              textTransform="uppercase"
              lineHeight={30}
              letterSpacing={-0.26}
            >
              PROGRESS
            </Typography>
            <Typography size={11.5} color={COLORS.muted}>
              Track weight, photos & workout consistency
            </Typography>
          </View>

          <View style={styles.headActions}>
            <Pressable onPress={() => navigation.navigate('NewCheckinScreen')} style={styles.addBtn}>
              <LinearGradient
                colors={['#8D22FF', '#B36BFF']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.absFill}
              />
              <Icon name="plus" size={Sizer.fS(20)} color={COLORS.white} />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('CompareCheckinsScreen')} style={styles.plainBtn}>
              <Icon name="share-2" size={Sizer.fS(16)} color={COLORS.foreground} />
            </Pressable>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {TABS.map(tab => {
            const on = activeTab === tab;
            return (
              <Pressable key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, on && styles.tabOn]}>
                {on ? (
                  <LinearGradient
                    colors={['#8D22FF', '#A84DF0']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.absFill}
                  />
                ) : null}
                <Typography size={12.5} fFamily="bodyBold700" color={on ? COLORS.white : COLORS.muted}>
                  {tab}
                </Typography>
              </Pressable>
            );
          })}
        </View>

        {/* TAB 1 · WEIGHT */}
        {activeTab === 'Weight' ? (
          <View style={styles.panel}>
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <View style={styles.baselineRow}>
                  <Typography size={32} fFamily="monoBold700" color={COLORS.white} lineHeight={32}>
                    {String(user.weight)}
                  </Typography>
                  <Typography size={13} fFamily="bodyBold700" color={COLORS.muted}>
                    LBS
                  </Typography>
                </View>
                <View style={styles.deltaPill}>
                  <Icon name="trending-down" size={Sizer.fS(14)} color={COLORS.success} />
                  <Typography size={11} fFamily="monoBold700" color={COLORS.success}>
                    −11.8 lbs
                  </Typography>
                </View>
              </View>
              <Typography size={11.5} color={COLORS.muted} mB={16}>
                Down from 196.0 lbs since March (6 months)
              </Typography>

              <View style={styles.sparkWrap}>
                <Svg width="100%" height={Sizer.vSize(112)} viewBox="0 0 300 100">
                  <Defs>
                    <SvgGradient id="weightArea" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0" stopColor="#8D22FF" stopOpacity="0.45" />
                      <Stop offset="1" stopColor="#8D22FF" stopOpacity="0" />
                    </SvgGradient>
                  </Defs>
                  {[20, 55, 90].map(y => (
                    <Line key={y} x1="0" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  ))}
                  <Path d={AREA} fill="url(#weightArea)" />
                  <Path d={CURVE} fill="none" stroke="#8D22FF" strokeWidth="3.5" strokeLinecap="round" />
                  <Circle cx="10" cy="15" r="4" fill="#18181B" stroke="#8D22FF" strokeWidth="2.5" />
                  <Circle cx="100" cy="36" r="4" fill="#18181B" stroke="#8D22FF" strokeWidth="2.5" />
                  <Circle cx="190" cy="60" r="4" fill="#18181B" stroke="#8D22FF" strokeWidth="2.5" />
                  <Circle cx="290" cy="85" r="6" fill="#2ED47A" stroke="#FFFFFF" strokeWidth="2.5" />
                </Svg>
              </View>

              <View style={styles.axis}>
                {['Mar 196', 'May 191', 'Jul 188'].map(t => (
                  <Typography key={t} size={11} fFamily="monoBold700" color={COLORS.faint}>
                    {t}
                  </Typography>
                ))}
                <Typography size={11} fFamily="monoBold700" color={COLORS.success}>
                  Aug 184.2
                </Typography>
              </View>
            </View>

            {/* Goal card */}
            <View style={styles.cardTight}>
              <View style={styles.rowBetween}>
                <Typography size={13} fFamily="bodyBold700" color={COLORS.white}>
                  {'Goal: '}
                  <Typography size={13} fFamily="monoBold700" color={COLORS.primarySoft}>
                    165.0 lbs
                  </Typography>
                </Typography>
                <Typography size={13} fFamily="monoBold700" color={COLORS.primary}>
                  62% Completed
                </Typography>
              </View>
              <View style={styles.goalTrack}>
                <LinearGradient
                  colors={['#8D22FF', '#C084FC']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[styles.goalFill, { width: '62%' }]}
                />
              </View>
              <Typography size={11} color={COLORS.muted} textAlign="right">
                19.2 lbs remaining to goal
              </Typography>
            </View>

            {/* Latest check-in */}
            <View style={styles.sectionRow}>
              <Typography
                size={12}
                fFamily="bodyBold700"
                color={COLORS.muted}
                textTransform="uppercase"
                letterSpacing={0.3}
              >
                LATEST CHECK-IN
              </Typography>
              <Pressable onPress={() => navigation.navigate('CompareCheckinsScreen')} hitSlop={8} style={styles.linkRow}>
                <Typography size={12} fFamily="bodyBold700" color={COLORS.primarySoft}>
                  Compare All
                </Typography>
                <Icon name="chevron-right" size={Sizer.fS(14)} color={COLORS.primarySoft} />
              </Pressable>
            </View>

            <Pressable onPress={() => navigation.navigate('CompareCheckinsScreen')} style={styles.checkinCard}>
              <View style={styles.rowBetween}>
                <View style={styles.checkinDate}>
                  <Icon name="calendar" size={Sizer.fS(16)} color={COLORS.primary} />
                  <Typography size={15} fFamily="bodyBold700" color={COLORS.white}>
                    August 1, 2026
                  </Typography>
                </View>
                <View style={styles.privatePill}>
                  <Icon name="lock" size={Sizer.fS(12)} color={COLORS.primarySoft} />
                  <Typography size={11} fFamily="bodySemiBold600" color={COLORS.muted}>
                    Private
                  </Typography>
                </View>
              </View>

              <View style={styles.photoGrid}>
                <PhotoTile source={images.splash03_2} label="Front" caption="184.2 lb" highlight />
                <PhotoTile source={images.splash03_1} label="Side" caption="31.5 in" />
                <PhotoTile source={images.splash03} label="Back" caption="Saved" />
              </View>

              <View style={styles.checkinFoot}>
                <View style={styles.checkinStat}>
                  <Typography size={12} color={COLORS.muted}>
                    Weight:{' '}
                  </Typography>
                  <Typography size={12} fFamily="monoBold700" color={COLORS.white}>
                    184.2 lbs
                  </Typography>
                </View>
                <View style={styles.checkinStat}>
                  <Icon name="trending-down" size={Sizer.fS(14)} color={COLORS.success} />
                  <Typography size={12} fFamily="bodySemiBold600" color={COLORS.success}>
                    {' '}
                    −2.4 lbs vs July
                  </Typography>
                </View>
              </View>
            </Pressable>

            {/* Workout frequency */}
            <View style={styles.card}>
              <View style={[styles.rowBetween, styles.freqHead]}>
                <View style={styles.flex}>
                  <Typography size={15} fFamily="bodyBold700" color={COLORS.white}>
                    Workout Frequency
                  </Typography>
                  <Typography size={11.5} color={COLORS.muted}>
                    August 2026 Volume (21 Total)
                  </Typography>
                </View>
                <View style={styles.weeksPill}>
                  <Typography size={16} fFamily="monoBold700" color={COLORS.primarySoft}>
                    4/4 WEEKS
                  </Typography>
                </View>
              </View>

              <View style={styles.freqChart}>
                {workoutFrequency.map(bar => (
                  <View key={bar.week} style={styles.freqCol}>
                    <View style={[styles.freqCount, bar.active ? styles.freqCountOn : styles.freqCountOff]}>
                      <Typography size={10.5} fFamily="monoBold700" color={bar.active ? COLORS.white : COLORS.muted}>
                        {String(bar.count)}
                      </Typography>
                    </View>

                    <View style={styles.freqSlot}>
                      <View style={[styles.freqBar, { height: `${bar.heightPct}%` }]}>
                        {bar.active ? (
                          <LinearGradient
                            colors={['#C084FC', '#8D22FF']}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            style={styles.absFill}
                          />
                        ) : (
                          <View style={styles.freqBarIdle} />
                        )}
                      </View>
                    </View>

                    <Typography size={11} fFamily="bodyBold700" color={bar.active ? COLORS.white : COLORS.faint}>
                      {bar.week}
                    </Typography>
                  </View>
                ))}
              </View>

              <View style={styles.freqFoot}>
                <View style={styles.freqFootLeft}>
                  <Emoji char="🔥" size={12} />
                  <Typography size={11.5} color={COLORS.muted}>
                    {' 21 workouts logged this month'}
                  </Typography>
                </View>
                <Typography size={11.5} fFamily="bodySemiBold600" color={COLORS.success}>
                  +3 vs July
                </Typography>
              </View>
            </View>
          </View>
        ) : null}

        {/* TAB 2 · PHOTOS */}
        {activeTab === 'Photos' ? (
          <View style={styles.panel}>
            <View style={styles.transformCard}>
              <LinearGradient
                colors={['#1A1528', '#141417']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.absFill}
              />
              <View style={styles.rowBetween}>
                <View style={styles.flex}>
                  <Typography
                    size={17}
                    fFamily="displayBold700"
                    color={COLORS.white}
                    textTransform="uppercase"
                    letterSpacing={0.68}
                  >
                    Body Transformation
                  </Typography>
                  <Typography size={12} fFamily="bodySemiBold600" color={COLORS.primarySoft}>
                    March 1 vs August 1
                  </Typography>
                </View>
                <Pressable onPress={() => navigation.navigate('CompareCheckinsScreen')} style={styles.sliderBtn}>
                  <LinearGradient
                    colors={['#8D22FF', '#A84DF0']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.absFill}
                  />
                  <RichText size={11.5} fFamily="bodyBold700" color={COLORS.white}>
                    Slider Compare ➔
                  </RichText>
                </Pressable>
              </View>

              <View style={styles.beforeAfter}>
                <View style={styles.flex}>
                  <View style={styles.baPhoto}>
                    <Image source={images.splash02} resizeMode="cover" style={styles.photoImg} />
                    <View style={styles.baCaption}>
                      <Typography size={10.5} fFamily="monoBold700" color={COLORS.white}>
                        Mar 01 · 196 lb
                      </Typography>
                    </View>
                  </View>
                  <Typography size={11} fFamily="bodySemiBold600" color={COLORS.muted} textAlign="center" mT={4}>
                    Baseline
                  </Typography>
                </View>

                <View style={styles.flex}>
                  <View style={[styles.baPhoto, styles.baPhotoCurrent]}>
                    <Image source={images.splash03_2} resizeMode="cover" style={styles.photoImg} />
                    <View style={[styles.baCaption, styles.baCaptionCurrent]}>
                      <Typography size={10.5} fFamily="monoBold700" color={COLORS.white}>
                        Aug 01 · 184.2 lb
                      </Typography>
                    </View>
                  </View>
                  <Typography size={11} fFamily="bodyBold700" color={COLORS.success} textAlign="center" mT={4}>
                    −11.8 lbs (Current)
                  </Typography>
                </View>
              </View>
            </View>

            <View style={styles.sectionRow}>
              <Typography
                size={12}
                fFamily="bodyBold700"
                color={COLORS.muted}
                textTransform="uppercase"
                letterSpacing={0.3}
              >
                ALL CHECK-IN PHOTOS
              </Typography>
              <View style={styles.angleGroup}>
                {ANGLES.map(angle => {
                  const on = photoAngle === angle;
                  return (
                    <Pressable
                      key={angle}
                      onPress={() => setPhotoAngle(angle)}
                      style={[styles.angleChip, on && styles.angleChipOn]}
                    >
                      <Typography size={11} fFamily="bodyBold700" color={on ? COLORS.white : COLORS.muted}>
                        {angle}
                      </Typography>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.timeline}>
              {photoTimeline.map(item => {
                const activeImg = photoAngle === 'Front' ? item.front : photoAngle === 'Side' ? item.side : item.back;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => navigation.navigate('CompareCheckinsScreen')}
                    style={[styles.timelineCard, item.isLatest ? styles.timelineLatest : styles.timelineIdle]}
                  >
                    <View style={styles.timelineLeft}>
                      <View style={styles.timelineThumb}>
                        <Image source={activeImg} resizeMode="cover" style={styles.photoImg} />
                      </View>
                      <View style={styles.flex}>
                        <View style={styles.timelineTitleRow}>
                          <Typography size={14.5} fFamily="bodyBold700" color={COLORS.white} numberOfLines={1} flex={1}>
                            {item.date}
                          </Typography>
                          {item.isLatest ? (
                            <View style={styles.latestTag}>
                              <Typography size={9.5} fFamily="bodyExtraBold800" color={COLORS.white}>
                                LATEST
                              </Typography>
                            </View>
                          ) : null}
                        </View>
                        <Typography size={13} fFamily="monoBold700" color={COLORS.white} mT={4}>
                          {item.weight}
                        </Typography>
                        <Typography size={11.5} color={COLORS.muted} mT={2}>
                          {`Waist: ${item.waist} · 3 photos logged`}
                        </Typography>
                      </View>
                    </View>
                    <Icon name="chevron-right" size={Sizer.fS(20)} color={COLORS.faint} />
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {/* TAB 3 · STRENGTH */}
        {activeTab === 'Strength' ? (
          <View style={styles.panel}>
            <View style={styles.strengthHero}>
              <LinearGradient
                colors={['#18181B', '#121215']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.absFill}
              />
              <View style={styles.rowBetween}>
                <View style={styles.flex}>
                  <Typography
                    size={11.5}
                    fFamily="bodyBold700"
                    color={COLORS.muted}
                    textTransform="uppercase"
                    letterSpacing={0.29}
                  >
                    TOTAL 1RM STRENGTH
                  </Typography>
                  <View style={styles.baselineRow}>
                    <Typography size={32} fFamily="monoBold700" color={COLORS.white}>
                      {formatNumber(1280)}
                    </Typography>
                    <Typography size={13} fFamily="bodyBold700" color={COLORS.muted}>
                      LBS TOTAL
                    </Typography>
                  </View>
                </View>
                <View style={styles.deltaPill}>
                  <Icon name="trending-up" size={Sizer.fS(16)} color={COLORS.success} />
                  <Typography size={12} fFamily="monoBold700" color={COLORS.success}>
                    +185 lbs
                  </Typography>
                </View>
              </View>
              <Typography size={11.5} color={COLORS.muted} mT={4}>
                Combined strength across 4 main compound movements
              </Typography>
            </View>

            <View style={styles.sectionRow}>
              <Typography
                size={12}
                fFamily="bodyBold700"
                color={COLORS.muted}
                textTransform="uppercase"
                letterSpacing={0.3}
              >
                KEY COMPOUND LIFTS
              </Typography>
              <View style={styles.freqFootLeft}>
                <Typography size={11.5} fFamily="bodyBold700" color={COLORS.primarySoft}>
                  {'5 Active PRs '}
                </Typography>
                <Emoji char="🔥" size={11} />
              </View>
            </View>

            <View style={styles.list}>
              {strengthLifts.map(lift => (
                <Pressable
                  key={lift.name}
                  onPress={() => dispatch(showToast(`Viewed full strength chart for ${lift.name}`))}
                  style={styles.liftCard}
                >
                  <View style={styles.rowBetween}>
                    <View style={styles.liftLeft}>
                      <View style={styles.liftIcon}>
                        <Icon name="dumbbell" size={Sizer.fS(20)} color="#C084FC" />
                      </View>
                      <View style={styles.flex}>
                        <Typography size={14.5} fFamily="bodyBold700" color={COLORS.white} numberOfLines={1}>
                          {lift.name}
                        </Typography>
                        <Typography size={11} color={COLORS.muted} numberOfLines={1}>
                          {lift.category}
                        </Typography>
                      </View>
                    </View>
                    <View style={styles.deltaPill}>
                      <Typography size={11} fFamily="monoBold700" color={COLORS.success}>
                        {lift.delta}
                      </Typography>
                    </View>
                  </View>

                  <View style={styles.liftFoot}>
                    <View>
                      <Typography size={10} fFamily="bodyBold700" color={COLORS.faint} textTransform="uppercase">
                        CURRENT WORK SET
                      </Typography>
                      <Typography size={13} fFamily="monoBold700" color={COLORS.white}>
                        {lift.current}
                      </Typography>
                    </View>
                    <View style={styles.alignEnd}>
                      <Typography size={10} fFamily="bodyBold700" color={COLORS.faint} textTransform="uppercase">
                        ESTIMATED 1RM
                      </Typography>
                      <Typography size={13} fFamily="monoBold700" color={COLORS.primarySoft}>
                        {lift.est1RM}
                      </Typography>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {/* TAB 4 · MEASURES */}
        {activeTab === 'Measures' ? (
          <View style={styles.panel}>
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <View style={styles.flex}>
                  <Typography
                    size={11.5}
                    fFamily="bodyBold700"
                    color={COLORS.muted}
                    textTransform="uppercase"
                    letterSpacing={0.29}
                  >
                    TOTAL INCHES LOST
                  </Typography>
                  <View style={styles.baselineRow}>
                    <Typography size={32} fFamily="monoBold700" color={COLORS.white}>
                      −8.7
                    </Typography>
                    <Typography size={13} fFamily="bodyBold700" color={COLORS.muted}>
                      INCHES
                    </Typography>
                  </View>
                </View>
                <View style={styles.rulerDisc}>
                  <Icon name="ruler" size={Sizer.fS(24)} color={COLORS.success} />
                </View>
              </View>
              <Typography size={11.5} color={COLORS.muted} mT={4}>
                Measured across 5 key body circumference points
              </Typography>
            </View>

            <View style={styles.sectionRow}>
              <Typography
                size={12}
                fFamily="bodyBold700"
                color={COLORS.muted}
                textTransform="uppercase"
                letterSpacing={0.3}
              >
                CIRCUMFERENCE LOG
              </Typography>
              <Pressable onPress={() => dispatch(showToast('Tape measurement logged successfully'))} hitSlop={8}>
                <Typography size={11.5} fFamily="bodyBold700" color={COLORS.primarySoft}>
                  + Log Measurement
                </Typography>
              </Pressable>
            </View>

            <View style={styles.list}>
              {bodyMeasurements.map(m => (
                <View key={m.part} style={styles.measureCard}>
                  <View style={styles.flex}>
                    <Typography size={14} fFamily="bodyBold700" color={COLORS.white}>
                      {m.part}
                    </Typography>
                    <Typography size={11.5} color={COLORS.muted} mT={2}>
                      {`Started: ${m.baseline} ${m.unit}`}
                    </Typography>
                  </View>
                  <View style={styles.alignEnd}>
                    <Typography size={16} fFamily="monoBold700" color={COLORS.white}>
                      {`${m.current} ${m.unit}`}
                    </Typography>
                    <Typography size={11} fFamily="monoBold700" color={COLORS.success}>
                      {m.delta}
                    </Typography>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* CTA */}
        <View style={styles.ctaWrap}>
          <Pressable
            onPress={() => navigation.navigate('NewCheckinScreen')}
            style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
          >
            <LinearGradient
              colors={['#8D22FF', '#A84DF0']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.absFill}
            />
            <Icon name="camera" size={Sizer.fS(20)} color={COLORS.white} />
            <Typography size={15} fFamily="bodyBold700" color={COLORS.white}>
              Record New Check-in
            </Typography>
          </Pressable>
        </View>
      </ScrollView>
      <StackTabBar activeTab="me" />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0B0D' },
  scroll: { paddingHorizontal: Sizer.hSize(16), width: '100%', maxWidth: SHELL_MAX_WIDTH, alignSelf: 'center' },
  absFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  flex: { flex: 1, minWidth: 0 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  alignEnd: { alignItems: 'flex-end' },
  pressed: { transform: [{ scale: 0.98 }] },

  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: Sizer.vSize(12) },
  headActions: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8) },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  plainBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141417',
    padding: Sizer.hSize(6),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    marginBottom: Sizer.vSize(16),
  },
  tab: {
    flex: 1,
    paddingVertical: Sizer.vSize(8),
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tabOn: {
    borderWidth: 1,
    borderColor: 'rgba(192,132,252,0.3)',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },

  panel: { gap: Sizer.vSize(16) },
  card: {
    borderRadius: 22,
    padding: Sizer.hSize(20),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  cardTight: {
    borderRadius: 22,
    padding: Sizer.hSize(16),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  baselineRow: { flexDirection: 'row', alignItems: 'baseline', gap: Sizer.hSize(8), marginTop: 2 },
  deltaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(46,212,122,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(46,212,122,0.3)',
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(4),
    borderRadius: RADIUS.full,
  },
  sparkWrap: { width: '100%', marginVertical: Sizer.vSize(4) },
  axis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Sizer.vSize(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },

  goalTrack: {
    width: '100%',
    height: 12,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.raised,
    overflow: 'hidden',
    marginTop: Sizer.vSize(8),
    marginBottom: Sizer.vSize(6),
  },
  goalFill: { height: '100%', borderRadius: RADIUS.full },

  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  checkinCard: {
    borderRadius: 22,
    padding: Sizer.hSize(16),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    gap: Sizer.vSize(14),
  },
  checkinDate: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8) },
  privatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  photoGrid: { flexDirection: 'row', gap: Sizer.hSize(10) },
  photoTile: { flex: 1, aspectRatio: 3 / 4, borderRadius: 14, overflow: 'hidden', borderWidth: 1 },
  photoTileOn: { borderColor: 'rgba(141,34,255,0.5)' },
  photoTileOff: { borderColor: 'rgba(255,255,255,0.15)' },
  photoImg: { width: '100%', height: '100%' },
  photoTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: Sizer.hSize(6),
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  photoCaption: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    paddingHorizontal: Sizer.hSize(6),
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  checkinFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Sizer.vSize(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  checkinStat: { flexDirection: 'row', alignItems: 'center' },

  freqHead: { marginBottom: Sizer.vSize(16), alignItems: 'flex-start' },
  weeksPill: {
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(4),
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(141,34,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.3)',
  },
  freqChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: Sizer.vSize(160),
    paddingTop: Sizer.vSize(32),
    paddingHorizontal: Sizer.hSize(12),
    paddingBottom: Sizer.vSize(8),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  freqCol: { alignItems: 'center', gap: Sizer.vSize(8), height: '100%', justifyContent: 'flex-end' },
  freqCount: { paddingHorizontal: Sizer.hSize(8), paddingVertical: 2, borderRadius: RADIUS.full, borderWidth: 1 },
  freqCountOn: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primarySoft,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  freqCountOff: { backgroundColor: COLORS.surface, borderColor: COLORS.hairline },
  freqSlot: { flex: 1, width: Sizer.hSize(48), justifyContent: 'flex-end' },
  freqBar: { width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, overflow: 'hidden' },
  freqBarIdle: { flex: 1, backgroundColor: COLORS.raised },
  freqFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Sizer.vSize(12),
  },
  freqFootLeft: { flexDirection: 'row', alignItems: 'center' },

  transformCard: {
    borderRadius: 22,
    padding: Sizer.hSize(16),
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.4)',
    gap: Sizer.vSize(12),
    overflow: 'hidden',
  },
  sliderBtn: {
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(6),
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    flexShrink: 0,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  beforeAfter: { flexDirection: 'row', gap: Sizer.hSize(12) },
  baPhoto: {
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  baPhotoCurrent: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  baCaption: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: Sizer.hSize(8),
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  baCaptionCurrent: { backgroundColor: COLORS.primary },

  angleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surface,
    padding: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  angleChip: { paddingHorizontal: Sizer.hSize(10), paddingVertical: 2, borderRadius: RADIUS.full },
  angleChipOn: { backgroundColor: COLORS.primary },

  timeline: { gap: Sizer.vSize(14) },
  timelineCard: {
    borderRadius: 20,
    padding: Sizer.hSize(14),
    backgroundColor: '#141417',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineLatest: { borderColor: 'rgba(141,34,255,0.4)' },
  timelineIdle: { borderColor: COLORS.hairline },
  timelineLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(14), flex: 1, minWidth: 0 },
  timelineThumb: {
    width: Sizer.hSize(64),
    height: Sizer.vSize(80),
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    flexShrink: 0,
  },
  timelineTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8) },
  latestTag: { paddingHorizontal: Sizer.hSize(6), paddingVertical: 1, borderRadius: 4, backgroundColor: COLORS.primary },

  strengthHero: {
    borderRadius: 22,
    padding: Sizer.hSize(20),
    borderWidth: 1,
    borderColor: COLORS.hairline,
    overflow: 'hidden',
  },
  list: { gap: Sizer.vSize(12) },
  liftCard: {
    borderRadius: 20,
    padding: Sizer.hSize(16),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    gap: Sizer.vSize(12),
  },
  liftLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12), flex: 1, minWidth: 0 },
  liftIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(141,34,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  liftFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Sizer.vSize(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },

  rulerDisc: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(46,212,122,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(46,212,122,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  measureCard: {
    borderRadius: 20,
    padding: Sizer.hSize(16),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Sizer.hSize(12),
  },

  ctaWrap: { paddingTop: Sizer.vSize(16) },
  cta: {
    width: '100%',
    height: Sizer.vSize(52),
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(8),
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 11,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
});

export default ProgressScreen;
