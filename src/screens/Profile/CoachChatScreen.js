import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { AvatarCoach, Emoji, RichText } from '../../components';
import { SHELL_MAX_WIDTH } from '../../constants';
import { selectUser, showToast } from '../../redux/slices/appSlice';
import { timeNow } from '../../utils';

const WAVE = [40, 75, 100, 60, 85, 30, 90, 100, 70, 45, 95, 60, 40];

const QUICK_PROMPTS = [
  { emoji: '📹', label: 'Form check on Bench' },
  { emoji: '🥗', label: 'Adjust my Friday calories' },
  { emoji: '💪', label: 'Soreness recovery tips' },
  { emoji: '📊', label: 'Share my food diary' },
];

const INITIAL_MESSAGES = [
  {
    id: '1',
    sender: 'coach',
    text: "Hey Alicia! Fantastic job hitting your 41-day workout streak! 🏆 How did your chest & shoulders feel during today's Push Day workout?",
    time: '9:32 AM',
    type: 'text',
  },
  {
    id: '2',
    sender: 'user',
    text: 'Felt great Coach! Bench press was super strong today — moved 145 lbs for 8 clean reps on the final set with no shoulder pinching.',
    time: '9:45 AM',
    type: 'text',
  },
  {
    id: '3',
    sender: 'coach',
    text: 'Marcus sent a form analysis voice note',
    time: '10:14 AM',
    type: 'voice',
    audioDuration: '0:38',
  },
  {
    id: '4',
    sender: 'coach',
    text: 'I also reviewed your August 1st check-in photos. Your waist is down to 31.5 inches while maintaining upper delts width! I made a small macro tweak for your rest day tomorrow:',
    time: '10:15 AM',
    type: 'text',
  },
  {
    id: '5',
    sender: 'coach',
    time: '10:15 AM',
    type: 'adjustment',
    adjustmentData: {
      title: 'Friday Rest Day Macro Split',
      subtitle: 'Active recovery & reduced carb allotment',
      cals: '1,950 kcal',
      macros: 'P: 185g · C: 170g · F: 58g',
    },
  },
];

/** Screen 38 · 1:1 Coach Chat */
const CoachChatScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const user = useSelector(selectUser);
  const scrollRef = useRef(null);

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setMessages(prev => [
      ...prev,
      { id: String(Date.now()), sender: 'user', text: inputMessage.trim(), time: timeNow(), type: 'text' },
    ]);
    setInputMessage('');

    // The mock fakes a coach reply a beat later.
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'coach',
          text: "Got it! Keep pushing on that protein intake today and hydrate well before tomorrow's session. You're on track for your goal! 🔥",
          time: timeNow(),
          type: 'text',
        },
      ]);
      dispatch(showToast('Coach Marcus Bell replied!'));
    }, 1200);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1 · Header */}
      <View style={[styles.header, { paddingTop: insets.top + Sizer.vSize(12) }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={Sizer.fS(20)} color={COLORS.white} />
          </Pressable>

          <View>
            <AvatarCoach size={40} fontSize={15} style={styles.coachAvatar} />
            <View style={styles.coachDot} />
          </View>

          <View style={styles.flex}>
            <View style={styles.coachNameRow}>
              <Typography size={15} fFamily="bodyExtraBold800" color={COLORS.white} numberOfLines={1}>
                {`Coach ${user.coachName}`}
              </Typography>
              <View style={styles.liveDot} />
            </View>
            <Typography size={11} fFamily="bodySemiBold600" color="#C084FC">
              Head Coach · CSCS, CISSN
            </Typography>
          </View>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* 2 · Pinned context banner */}
      <View style={styles.banner}>
        <LinearGradient
          colors={['#1E1630', '#141417']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.absFill}
        />
        <View style={styles.bannerLeft}>
          <View style={styles.bannerDisc}>
            <Icon name="sparkles" size={Sizer.fS(16)} color="#C084FC" />
          </View>
          <View style={styles.flex}>
            <Typography size={12} fFamily="bodyBold700" color={COLORS.white} numberOfLines={1}>
              Week 4 Focus: Progressive Overload & 185g Protein
            </Typography>
            <Typography size={10.5} color="#A1A1AA">
              Next 1:1 Check-in Review: Sunday, Sep 4
            </Typography>
          </View>
        </View>
        <View style={styles.vipTag}>
          <Typography size={10} fFamily="bodyExtraBold800" color={COLORS.success} textTransform="uppercase">
            VIP 1:1
          </Typography>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        {/* 3 · Thread */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.thread}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.dayDivider}>
            <Typography
              size={10.5}
              fFamily="bodyBold700"
              color="#71717A"
              textTransform="uppercase"
              letterSpacing={0.26}
            >
              TODAY · AUG 28, 2026
            </Typography>
          </View>

          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <View key={msg.id} style={[styles.msgWrap, isUser ? styles.msgRight : styles.msgLeft]}>
                {msg.type === 'voice' ? (
                  <View style={styles.voiceBubble}>
                    <Pressable
                      onPress={() => dispatch(showToast('Playing Coach Marcus voice note (0:38s)... 🔊'))}
                      style={styles.voicePlay}
                    >
                      <LinearGradient
                        colors={['#8D22FF', '#A84DF0']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.absFill}
                      />
                      <Icon name="play" size={Sizer.fS(16)} color={COLORS.white} />
                    </Pressable>

                    <View style={styles.flex}>
                      <View style={styles.voiceHead}>
                        <Typography size={12} fFamily="bodyBold700" color={COLORS.white}>
                          Voice Note
                        </Typography>
                        <Typography size={11} fFamily="monoBold700" color="#C084FC">
                          {msg.audioDuration}
                        </Typography>
                      </View>
                      <View style={styles.wave}>
                        {WAVE.map((h, i) => (
                          <View key={`${h}-${i}`} style={[styles.waveBar, { height: `${h}%` }]} />
                        ))}
                      </View>
                    </View>
                  </View>
                ) : msg.type === 'adjustment' && msg.adjustmentData ? (
                  <View style={styles.adjustBubble}>
                    <LinearGradient
                      colors={['#1E1730', '#141417']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.absFill}
                    />
                    <View style={styles.rowBetween}>
                      <Typography size={13} fFamily="bodyExtraBold800" color={COLORS.white} flex={1}>
                        {msg.adjustmentData.title}
                      </Typography>
                      <View style={styles.appliedTag}>
                        <Typography size={10} fFamily="bodyExtraBold800" color={COLORS.white}>
                          APPLIED
                        </Typography>
                      </View>
                    </View>

                    <Typography size={11} color="#A1A1AA">
                      {msg.adjustmentData.subtitle}
                    </Typography>

                    <View style={styles.adjustStats}>
                      <Typography size={14} fFamily="monoBold700" color={COLORS.white} style={styles.shrink}>
                        {msg.adjustmentData.cals}
                      </Typography>
                      <Typography size={11} fFamily="monoBold700" color="#C084FC" style={styles.shrink}>
                        {msg.adjustmentData.macros}
                      </Typography>
                    </View>
                  </View>
                ) : (
                  <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleCoach]}>
                    {isUser ? (
                      <LinearGradient
                        colors={['#8D22FF', '#A84DF0']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.absFill}
                      />
                    ) : null}
                    <RichText size={14} color={COLORS.white} lineHeight={21}>
                      {msg.text}
                    </RichText>
                  </View>
                )}

                <View style={styles.msgMeta}>
                  <Typography size={10} color="#71717A">
                    {msg.time}
                  </Typography>
                  {isUser ? <Icon name="check-check" size={Sizer.fS(14)} color="#C084FC" /> : null}
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* 4 · Composer */}
        <View style={[styles.composerDock, { paddingBottom: insets.bottom + Sizer.vSize(10) }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptRow}>
            {QUICK_PROMPTS.map(prompt => (
              <Pressable key={prompt.label} onPress={() => setInputMessage(prompt.label)} style={styles.prompt}>
                <Emoji char={prompt.emoji} size={12} />
                <Typography size={11.5} fFamily="bodySemiBold600" color="#A1A1AA">
                  {prompt.label}
                </Typography>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.composer}>
            <Pressable
              onPress={() => dispatch(showToast('Attaching workout video / check-in photo...'))}
              style={styles.composerBtn}
            >
              <Icon name="paperclip" size={Sizer.fS(18)} color="#A1A1AA" />
            </Pressable>

            <TextInput
              value={inputMessage}
              onChangeText={setInputMessage}
              onSubmitEditing={handleSendMessage}
              placeholder={`Message Coach ${user.coachName}...`}
              placeholderTextColor="#71717A"
              selectionColor={COLORS.primary}
              returnKeyType="send"
              allowFontScaling={false}
              style={styles.composerInput}
            />

            <Pressable
              onPress={() => dispatch(showToast('Voice message recording started... 🎙️'))}
              style={styles.composerBtn}
            >
              <Icon name="mic" size={Sizer.fS(18)} color="#A1A1AA" />
            </Pressable>

            <Pressable
              onPress={handleSendMessage}
              style={[styles.sendBtn, inputMessage.trim() ? styles.sendOn : styles.sendOff]}
            >
              {inputMessage.trim() ? (
                <LinearGradient
                  colors={['#8D22FF', '#A84DF0']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.absFill}
                />
              ) : null}
              <Icon name="send" size={Sizer.fS(16)} color={inputMessage.trim() ? COLORS.white : '#71717A'} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0B0D' },
  absFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  flex: { flex: 1, minWidth: 0 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizer.hSize(16),
    paddingBottom: Sizer.vSize(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.hairline,
    backgroundColor: 'rgba(18,18,21,0.95)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12), flex: 1, minWidth: 0 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  coachAvatar: { borderRadius: RADIUS.full, borderColor: COLORS.primary },
  coachDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: '#0B0B0D',
  },
  coachNameRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(6) },
  liveDot: { width: 6, height: 6, borderRadius: RADIUS.full, backgroundColor: COLORS.success },
  headerSpacer: { width: 40 },

  banner: {
    marginHorizontal: Sizer.hSize(16),
    marginTop: Sizer.vSize(12),
    padding: Sizer.hSize(12),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Sizer.hSize(8),
    overflow: 'hidden',
  },
  bannerLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(10), flex: 1, minWidth: 0 },
  bannerDisc: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(141,34,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  vipTag: {
    paddingHorizontal: Sizer.hSize(8),
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(46,212,122,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(46,212,122,0.3)',
    flexShrink: 0,
  },

  thread: {
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(16),
    gap: Sizer.vSize(14),
    width: '100%',
    maxWidth: SHELL_MAX_WIDTH,
    alignSelf: 'center',
  },
  dayDivider: { alignItems: 'center', marginVertical: 4 },
  msgWrap: { maxWidth: '85%' },
  msgLeft: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  msgRight: { alignSelf: 'flex-end', alignItems: 'flex-end' },

  bubble: { borderRadius: 20, paddingHorizontal: Sizer.hSize(16), paddingVertical: Sizer.vSize(12), overflow: 'hidden' },
  bubbleUser: { borderTopRightRadius: 4 },
  bubbleCoach: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.hairline, borderTopLeftRadius: 4 },

  voiceBubble: {
    borderRadius: 20,
    borderTopLeftRadius: 4,
    padding: Sizer.hSize(14),
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    width: Sizer.hSize(256),
  },
  voicePlay: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  voiceHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  wave: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 12 },
  waveBar: { width: 4, borderRadius: RADIUS.full, backgroundColor: COLORS.primary },

  adjustBubble: {
    borderRadius: 20,
    borderTopLeftRadius: 4,
    padding: Sizer.hSize(16),
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.5)',
    gap: Sizer.vSize(10),
    width: Sizer.hSize(288),
    overflow: 'hidden',
  },
  appliedTag: {
    paddingHorizontal: Sizer.hSize(8),
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  // Both labels wrap inside the row, the way the mock's spans do; RN text does
  // not shrink on its own, so the row would otherwise run past the card.
  shrink: { flexShrink: 1 },
  adjustStats: {
    backgroundColor: COLORS.surface,
    padding: Sizer.hSize(10),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  msgMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, paddingHorizontal: 4 },

  composerDock: {
    backgroundColor: '#121215',
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
    paddingTop: Sizer.vSize(8),
    paddingHorizontal: Sizer.hSize(16),
    gap: Sizer.vSize(8),
  },
  promptRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(6), paddingBottom: 2 },
  prompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(5),
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(6),
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    flexShrink: 0,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(8),
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 22,
    paddingHorizontal: Sizer.hSize(14),
    paddingVertical: Sizer.vSize(8),
  },
  composerBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  composerInput: {
    flex: 1,
    color: COLORS.white,
    fontFamily: 'Inter-Regular',
    fontSize: Sizer.fS(14.5),
    padding: 0,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  sendOn: {
    transform: [{ scale: 1.05 }],
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  sendOff: { backgroundColor: COLORS.raised },
});

export default CoachChatScreen;
