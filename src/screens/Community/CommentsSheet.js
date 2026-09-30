import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { Emoji, HeartIcon, RichText } from '../../components';
import { SHELL_MAX_WIDTH } from '../../constants';
import { showToast } from '../../redux/slices/appSlice';
import { PROFILE_PHOTO } from '../../lib/profile-photo';

const QUICK_REACTIONS = ['❤️', '🙌', '👏', '🥲', '😍', '😮', '😂'];

const handleOf = name => name.toLowerCase().replace(/\s+/g, '');

/** The comments bottom sheet, opened from a post's comment or "view all" link. */
const CommentsSheet = ({ post, onClose, onSend }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [commentText, setCommentText] = useState('');

  if (!post) return null;

  const submit = () => {
    if (!commentText.trim()) return;
    onSend(commentText);
    setCommentText('');
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.scrim}>
        <Pressable style={styles.scrimFill} onPress={onClose} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View
            style={[
              styles.sheet,
              { maxHeight: Dimensions.get('window').height * 0.82, paddingBottom: insets.bottom + Sizer.vSize(24) },
            ]}
          >
            <View style={styles.grabber} />

            <View style={styles.head}>
              <Typography
                size={16}
                fFamily="displayBold700"
                color={COLORS.white}
                textTransform="uppercase"
                letterSpacing={1.92}
              >
                {`COMMENTS (${post.commentsCount})`}
              </Typography>
              <Pressable onPress={onClose} hitSlop={8} style={styles.close}>
                <Icon name="x" size={Sizer.fS(16)} color="#A1A1AA" />
              </Pressable>
            </View>

            <ScrollView
              style={styles.thread}
              contentContainerStyle={styles.threadBody}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {post.comments.map(comm => (
                <View key={comm.id} style={styles.commentGroup}>
                  <View style={styles.commentRow}>
                    <View style={styles.commentLeft}>
                      <Image source={{ uri: comm.authorAvatar }} resizeMode="cover" style={styles.commentAvatar} />
                      <View style={styles.flex}>
                        <View style={styles.commentMeta}>
                          <Typography size={13} fFamily="bodyBold700" color={COLORS.white}>
                            {handleOf(comm.author)}
                          </Typography>
                          <Typography size={11} color="#71717A">
                            {comm.timeAgo}
                          </Typography>
                        </View>
                        <RichText size={13} lineHeight={19} mT={2}>
                          {comm.text}
                        </RichText>
                        <Pressable
                          onPress={() => dispatch(showToast(`Replying to ${comm.author}`))}
                          hitSlop={6}
                          style={styles.replyBtn}
                        >
                          <Typography size={11.5} fFamily="bodyBold700" color="#A1A1AA">
                            Reply
                          </Typography>
                        </Pressable>
                      </View>
                    </View>

                    <Pressable
                      onPress={() => dispatch(showToast('Liked comment ❤️'))}
                      hitSlop={6}
                      style={styles.likeCol}
                    >
                      <HeartIcon size={16} color="#A1A1AA" />
                      <Typography size={10} fFamily="monoRegular400" color="#A1A1AA">
                        {String(comm.likesCount)}
                      </Typography>
                    </Pressable>
                  </View>

                  {comm.replies && comm.replies.length > 0 ? (
                    <View style={styles.replies}>
                      {comm.replies.map(rep => (
                        <View key={rep.id} style={styles.replyRow}>
                          <View style={styles.replyLeft}>
                            <Image source={{ uri: rep.authorAvatar }} resizeMode="cover" style={styles.replyAvatar} />
                            <View style={styles.flex}>
                              <View style={styles.commentMeta}>
                                <Typography size={12} fFamily="bodyBold700" color={COLORS.white}>
                                  {rep.author}
                                </Typography>
                                <Typography size={10} color="#71717A">
                                  {rep.timeAgo}
                                </Typography>
                              </View>
                              <RichText size={12} color="#D4D4D8">
                                {rep.text}
                              </RichText>
                            </View>
                          </View>
                          <HeartIcon size={14} color="#71717A" />
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))}
            </ScrollView>

            <View style={styles.reactions}>
              {QUICK_REACTIONS.map(emoji => (
                <Pressable key={emoji} onPress={() => onSend(emoji)} hitSlop={6}>
                  <Emoji char={emoji} size={22} />
                </Pressable>
              ))}
            </View>

            <View style={styles.composer}>
              <Image source={PROFILE_PHOTO} resizeMode="cover" style={styles.composerAvatar} />
              <View style={styles.composerField}>
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder={`Add a comment for ${post.handle}...`}
                  placeholderTextColor="#71717A"
                  selectionColor={COLORS.primary}
                  onSubmitEditing={submit}
                  returnKeyType="send"
                  allowFontScaling={false}
                  style={styles.composerInput}
                />
              </View>
              <Pressable
                onPress={submit}
                disabled={!commentText.trim()}
                style={[styles.sendBtn, !commentText.trim() && styles.sendDisabled]}
              >
                <LinearGradient
                  colors={['#8D22FF', '#A84DF0']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.absFill}
                />
                <Icon name="send" size={Sizer.fS(16)} color={COLORS.white} />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrim: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.8)' },
  scrimFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  absFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  flex: { flex: 1, minWidth: 0 },

  sheet: {
    width: '100%',
    maxWidth: SHELL_MAX_WIDTH,
    alignSelf: 'center',
    backgroundColor: '#141417',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: Sizer.hSize(16),
  },
  grabber: {
    width: 48,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginBottom: Sizer.vSize(12),
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Sizer.vSize(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.hairline,
    marginBottom: Sizer.vSize(8),
  },
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

  thread: { flexGrow: 0 },
  threadBody: { gap: Sizer.vSize(16), paddingVertical: Sizer.vSize(8), paddingRight: 4 },
  commentGroup: { gap: Sizer.vSize(8) },
  commentRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Sizer.hSize(12) },
  commentLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: Sizer.hSize(12), flex: 1, minWidth: 0 },
  commentAvatar: { width: 32, height: 32, borderRadius: RADIUS.full, flexShrink: 0, marginTop: 2 },
  commentMeta: { flexDirection: 'row', alignItems: 'baseline', gap: Sizer.hSize(8) },
  replyBtn: { alignSelf: 'flex-start', marginTop: 4 },
  likeCol: { alignItems: 'center', flexShrink: 0, paddingTop: 4 },

  replies: {
    paddingLeft: Sizer.hSize(44),
    marginLeft: Sizer.hSize(16),
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255,255,255,0.05)',
    gap: Sizer.vSize(8),
    paddingTop: 4,
  },
  replyRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Sizer.hSize(8) },
  replyLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: Sizer.hSize(8), flex: 1, minWidth: 0 },
  replyAvatar: { width: 24, height: 24, borderRadius: RADIUS.full, flexShrink: 0 },

  reactions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Sizer.vSize(8),
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
  },

  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(10),
    paddingTop: Sizer.vSize(8),
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
  },
  composerAvatar: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexShrink: 0,
  },
  composerField: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.full,
    paddingHorizontal: Sizer.hSize(14),
    paddingVertical: Sizer.vSize(6),
  },
  composerInput: { color: COLORS.white, fontFamily: 'Inter-Regular', fontSize: Sizer.fS(13.5), padding: 0 },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  sendDisabled: { opacity: 0.4 },
});

export default CommentsSheet;
