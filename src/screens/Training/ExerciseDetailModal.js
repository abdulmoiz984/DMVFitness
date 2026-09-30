import React, { useState } from 'react';
import { Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { DmvButton, Emoji } from '../../components';
import { SHELL_MAX_WIDTH } from '../../constants';

const TABS = [
  { id: 'anatomy', emoji: '🎯', label: 'Anatomy' },
  { id: 'instructions', emoji: '📋', label: 'Steps' },
  { id: 'cues', emoji: '💡', label: 'Cues' },
  { id: 'mistakes', emoji: '⚠️', label: 'Mistakes' },
  { id: 'safety', emoji: '🛡️', label: 'Safety' },
];

const Bullet = ({ icon, iconColor, borderColor, children }) => (
  <View style={[styles.bullet, borderColor ? { borderColor } : null]}>
    <Icon name={icon} size={Sizer.fS(16)} color={iconColor} style={styles.bulletIcon} />
    <Typography size={12} lineHeight={18} flex={1}>
      {children}
    </Typography>
  </View>
);

/** The 5-tab exercise technique sheet shown over the workout hub. */
const ExerciseDetailModal = ({ exercise, onClose, onStartWorkout }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('anatomy');
  const [isPlaying, setIsPlaying] = useState(false);

  if (!exercise) return null;

  const maxHeight = Dimensions.get('window').height * 0.88;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.scrim}>
        <Pressable style={styles.scrimFill} onPress={onClose} />
        <View style={[styles.sheet, { maxHeight, marginBottom: insets.bottom + 8 }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetBody}>
            <View style={styles.head}>
              <Typography
                size={12}
                fFamily="displayBold700"
                color="#C084FC"
                textTransform="uppercase"
                letterSpacing={1.92}
                flex={1}
              >
                EXERCISE TECHNIQUE & ANATOMY
              </Typography>
              <Pressable onPress={onClose} hitSlop={8} style={styles.close}>
                <Icon name="x" size={Sizer.fS(16)} color="#A1A1AA" />
              </Pressable>
            </View>

            <Typography
              size={22}
              fFamily="displayBold700"
              color={COLORS.white}
              textTransform="uppercase"
              letterSpacing={0.88}
              mB={4}
            >
              {exercise.name}
            </Typography>
            <Typography size={12} fFamily="bodySemiBold600" color="#C084FC" mB={12}>
              {exercise.prescription}
            </Typography>

            <View style={styles.player}>
              <Image
                source={exercise.videoThumbnail}
                resizeMode="cover"
                style={[styles.playerImg, { opacity: isPlaying ? 0.95 : 0.7 }]}
              />
              <LinearGradient
                colors={['transparent', 'transparent', 'rgba(0,0,0,0.8)']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.absFill}
                pointerEvents="none"
              />
              <Pressable
                onPress={() => setIsPlaying(p => !p)}
                style={({ pressed }) => [styles.playBtn, pressed && styles.pressed]}
              >
                <LinearGradient
                  colors={['#8D22FF', '#A84DF0']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.absFill}
                />
                <Icon name={isPlaying ? 'pause' : 'play'} size={Sizer.fS(24)} color={COLORS.white} />
              </Pressable>
            </View>

            <View style={styles.tabBar}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow}>
                {TABS.map(tab => {
                  const on = activeTab === tab.id;
                  return (
                    <Pressable
                      key={tab.id}
                      onPress={() => setActiveTab(tab.id)}
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

            {activeTab === 'anatomy' ? (
              <View style={styles.tabPanel}>
                <View style={styles.infoBox}>
                  <Typography size={10} fFamily="bodyBold700" color="#A1A1AA" textTransform="uppercase">
                    PRIMARY TARGET
                  </Typography>
                  <Typography size={13.5} fFamily="bodyBold700" color="#C084FC">
                    {exercise.primaryMuscle}
                  </Typography>
                </View>
                <View style={styles.infoBox}>
                  <Typography size={10} fFamily="bodyBold700" color="#A1A1AA" textTransform="uppercase">
                    SECONDARY MUSCLES
                  </Typography>
                  <Typography size={12}>{exercise.secondaryMuscles}</Typography>
                </View>
                <Typography size={12} color="#A1A1AA" lineHeight={18} style={styles.overview}>
                  {exercise.overview}
                </Typography>
              </View>
            ) : null}

            {activeTab === 'instructions' ? (
              <View style={styles.tabPanel}>
                {exercise.instructions.map((step, idx) => (
                  <View key={step} style={styles.bullet}>
                    <View style={styles.stepNum}>
                      <Typography size={11} fFamily="bodyBold700" color={COLORS.white}>
                        {String(idx + 1)}
                      </Typography>
                    </View>
                    <Typography size={12} lineHeight={18} flex={1}>
                      {step}
                    </Typography>
                  </View>
                ))}
              </View>
            ) : null}

            {activeTab === 'cues' ? (
              <View style={styles.tabPanel}>
                {exercise.coachCues.map(cue => (
                  <Bullet key={cue} icon="quote" iconColor={COLORS.primary}>
                    {cue}
                  </Bullet>
                ))}
              </View>
            ) : null}

            {activeTab === 'mistakes' ? (
              <View style={styles.tabPanel}>
                {exercise.commonMistakes.map(mistake => (
                  <Bullet key={mistake} icon="triangle-alert" iconColor={COLORS.danger} borderColor="rgba(255,77,94,0.3)">
                    {mistake}
                  </Bullet>
                ))}
              </View>
            ) : null}

            {activeTab === 'safety' ? (
              <View style={styles.tabPanel}>
                {exercise.safetyTips.map(tip => (
                  <Bullet key={tip} icon="shield-check" iconColor={COLORS.success} borderColor="rgba(46,212,122,0.3)">
                    {tip}
                  </Bullet>
                ))}
              </View>
            ) : null}

            <View style={styles.cta}>
              <DmvButton title="Start This Exercise" variant="primary" onPress={onStartWorkout} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrim: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.8)', padding: 8 },
  scrimFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  absFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  pressed: { transform: [{ scale: 0.95 }] },

  sheet: {
    width: '100%',
    maxWidth: SHELL_MAX_WIDTH,
    alignSelf: 'center',
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    borderRadius: 30,
  },
  sheetBody: { padding: Sizer.hSize(20) },

  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizer.vSize(12) },
  close: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },

  player: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 20,
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    overflow: 'hidden',
    marginBottom: Sizer.vSize(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  playBtn: {
    width: Sizer.hSize(56),
    height: Sizer.hSize(56),
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
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

  tabPanel: { gap: Sizer.vSize(10), marginBottom: Sizer.vSize(16) },
  infoBox: {
    padding: Sizer.hSize(12),
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 4,
  },
  overview: { padding: 4 },
  bullet: {
    padding: Sizer.hSize(10),
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(10),
  },
  bulletIcon: { marginTop: 2 },
  stepNum: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  cta: { paddingTop: Sizer.vSize(8) },
});

export default ExerciseDetailModal;
