import React, { useState } from 'react';
import {
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { DmvButton, Emoji, RichText } from '../../components';
import { SHELL_MAX_WIDTH } from '../../constants';
import { images } from '../../assets/images';

const AVAILABLE_PHOTOS = [
  { label: '5K Running Track', img: images.communityRun, cat: 'running' },
  { label: 'Outdoor Yoga', img: images.communityYoga, cat: 'mobility' },
  { label: 'Macro Meal Prep', img: images.communityMeal, cat: 'nutrition' },
  { label: 'Full Body Gym', img: images.workoutFullbody, cat: 'workout' },
  { label: 'Lat Pulldown', img: images.workoutLatPulldown, cat: 'workout' },
];

const POST_CATEGORIES = [
  { id: 'running', emoji: '🏃', label: '5K & Running Win' },
  { id: 'workout', emoji: '🏋️', label: 'Workout PR' },
  { id: 'nutrition', emoji: '🥗', label: 'Meal Prep' },
  { id: 'mobility', emoji: '🧘', label: 'Recovery Flow' },
];

const DEFAULT_CAPTION =
  'Just hit a personal best — 5K in 23:45! 🏅 Small wins every day add up 💪 #running #morningrun';

const SectionLabel = ({ children }) => (
  <Typography size={11} fFamily="bodyBold700" color="#A1A1AA" textTransform="uppercase" letterSpacing={0.28}>
    {children}
  </Typography>
);

/** Full-screen "New Post" composer. */
const CreatePostModal = ({ visible, onClose, onSubmit }) => {
  const insets = useSafeAreaInsets();
  const [caption, setCaption] = useState(DEFAULT_CAPTION);
  const [selectedCategory, setSelectedCategory] = useState('running');
  const [selectedPhoto, setSelectedPhoto] = useState(images.communityRun);
  // A TextInput cannot draw the emoji the caption contains, so the caption is
  // shown as RichText (which swaps them for their PNGs) until it is tapped.
  const [editingCaption, setEditingCaption] = useState(false);

  const share = () => onSubmit({ caption, image: selectedPhoto, category: selectedCategory });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View
            style={[
              styles.shell,
              { paddingTop: insets.top + Sizer.vSize(16), paddingBottom: insets.bottom + Sizer.vSize(16) },
            ]}
          >
            <View style={styles.head}>
              <Pressable onPress={onClose} style={styles.headBtn}>
                <Icon name="x" size={Sizer.fS(20)} color={COLORS.white} />
              </Pressable>
              <Typography
                size={17}
                fFamily="displayBold700"
                color={COLORS.white}
                textTransform="uppercase"
                letterSpacing={2.38}
              >
                NEW POST
              </Typography>
              <Pressable onPress={share} hitSlop={8} style={styles.shareLink}>
                <Typography size={14} fFamily="bodyBold700" color="#C084FC">
                  Share
                </Typography>
              </Pressable>
            </View>

            <ScrollView
              style={styles.flex}
              contentContainerStyle={styles.body}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.preview}>
                <Image source={selectedPhoto} resizeMode="cover" style={styles.fullImg} />
                <View style={styles.hdTag}>
                  <Icon name="camera" size={Sizer.fS(14)} color="#C084FC" />
                  <Typography size={11} fFamily="bodyBold700" color={COLORS.white}>
                    HD Photo
                  </Typography>
                </View>
              </View>

              <View style={styles.group}>
                <SectionLabel>SELECT WORKOUT PHOTO</SectionLabel>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoRow}>
                  {AVAILABLE_PHOTOS.map(p => {
                    const on = selectedPhoto === p.img;
                    return (
                      <Pressable
                        key={p.label}
                        onPress={() => {
                          setSelectedPhoto(p.img);
                          setSelectedCategory(p.cat);
                        }}
                        style={[styles.thumb, on ? styles.thumbOn : styles.thumbOff]}
                      >
                        <Image source={p.img} resizeMode="cover" style={styles.fullImg} />
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={styles.group}>
                <SectionLabel>POST CATEGORY</SectionLabel>
                <View style={styles.catRow}>
                  {POST_CATEGORIES.map(cat => {
                    const on = selectedCategory === cat.id;
                    return (
                      <Pressable
                        key={cat.id}
                        onPress={() => setSelectedCategory(cat.id)}
                        style={[styles.cat, on ? styles.catOn : styles.catOff]}
                      >
                        <Emoji char={cat.emoji} size={12} />
                        <Typography size={12} fFamily="bodyBold700" color={on ? COLORS.white : '#A1A1AA'}>
                          {cat.label}
                        </Typography>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.group}>
                <SectionLabel>CAPTION</SectionLabel>
                <Pressable style={styles.captionBox} onPress={() => setEditingCaption(true)}>
                  {editingCaption ? (
                    <TextInput
                      value={caption}
                      onChangeText={setCaption}
                      onBlur={() => setEditingCaption(false)}
                      placeholder="Add a caption..."
                      placeholderTextColor="#71717A"
                      selectionColor={COLORS.primary}
                      multiline
                      autoFocus
                      textAlignVertical="top"
                      allowFontScaling={false}
                      style={styles.captionInput}
                    />
                  ) : (
                    <RichText
                      size={14}
                      lineHeight={21}
                      color={caption ? COLORS.white : '#71717A'}
                      style={styles.captionText}
                    >
                      {caption || 'Add a caption...'}
                    </RichText>
                  )}
                </Pressable>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <DmvButton title="Share Post" variant="primary" onPress={share} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' },
  flex: { flex: 1 },
  fullImg: { width: '100%', height: '100%' },
  shell: {
    flex: 1,
    width: '100%',
    maxWidth: SHELL_MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: Sizer.hSize(16),
  },

  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Sizer.vSize(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.hairline,
  },
  headBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareLink: { minWidth: 40, alignItems: 'flex-end', justifyContent: 'center' },

  body: { paddingVertical: Sizer.vSize(16), gap: Sizer.vSize(16) },
  preview: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  hdTag: {
    position: 'absolute',
    bottom: 12,
    right: 12,
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

  group: { gap: Sizer.vSize(6) },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8), paddingBottom: 4 },
  thumb: {
    width: Sizer.hSize(80),
    height: Sizer.vSize(56),
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.black,
    borderWidth: 2,
    flexShrink: 0,
  },
  thumbOn: {
    borderColor: COLORS.primary,
    transform: [{ scale: 1.05 }],
    shadowColor: COLORS.primary,
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  thumbOff: { borderColor: COLORS.hairline, opacity: 0.6 },

  catRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Sizer.hSize(6) },
  cat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(5),
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(6),
    borderRadius: RADIUS.full,
  },
  catOn: { backgroundColor: COLORS.primary },
  catOff: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.hairline },

  captionBox: {
    borderRadius: 18,
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: Sizer.hSize(14),
    minHeight: Sizer.vSize(88) + Sizer.hSize(28),
  },
  captionText: { minHeight: Sizer.vSize(88) },
  captionInput: {
    color: COLORS.white,
    fontSize: Sizer.fS(14),
    lineHeight: Sizer.fS(21),
    minHeight: Sizer.vSize(88),
    padding: 0,
  },

  footer: { paddingTop: Sizer.vSize(8) },
});

export default CreatePostModal;
