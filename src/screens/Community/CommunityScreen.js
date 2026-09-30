import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { BookmarkIcon, Emoji, HeartIcon, RichText, StackTabBar } from '../../components';
import { SHELL_MAX_WIDTH, TABBAR_CLEARANCE } from '../../constants';
import { initialCommunityPosts } from '../../lib/community-data';
import { selectUser, showToast } from '../../redux/slices/appSlice';
import { PROFILE_PHOTO } from '../../lib/profile-photo';
import CommentsSheet from './CommentsSheet';
import CreatePostModal from './CreatePostModal';

const CATEGORIES = [
  { id: 'all', emoji: '🔥', label: 'All Posts' },
  { id: 'running', emoji: '🏃', label: 'Running & 5K' },
  { id: 'workout', emoji: '🏋️', label: 'Strength & PRs' },
  { id: 'mobility', emoji: '🧘', label: 'Recovery & Yoga' },
  { id: 'nutrition', emoji: '🥗', label: 'Meal Prep & Food' },
];

/** The mock prints counts over 1,000 as "116.4k". */
const compact = n => (n > 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

/** Screen 25 · Community */
const CommunityScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const user = useSelector(selectUser);

  const [posts, setPosts] = useState(initialCommunityPosts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  const filteredPosts =
    selectedCategory === 'all' ? posts : posts.filter(p => p.tagCategory === selectedCategory);

  const handleToggleLike = postId =>
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const nextLiked = !p.isLiked;
        if (nextLiked) dispatch(showToast('Liked post! ❤️'));
        return { ...p, isLiked: nextLiked, likesCount: p.likesCount + (nextLiked ? 1 : -1) };
      }),
    );

  const handleToggleBookmark = postId =>
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const next = !p.isBookmarked;
        dispatch(showToast(next ? 'Post saved to your bookmarks 🔖' : 'Removed from bookmarks'));
        return { ...p, isBookmarked: next };
      }),
    );

  const handleAddComment = text => {
    if (!text.trim() || !activeCommentPost) return;
    const newComment = {
      id: `comm-${Date.now()}`,
      author: user.name,
      authorAvatar: PROFILE_PHOTO.uri,
      timeAgo: 'Just now',
      text: text.trim(),
      likesCount: 0,
      isLiked: false,
    };

    setPosts(prev =>
      prev.map(p =>
        p.id === activeCommentPost.id
          ? { ...p, comments: [newComment, ...p.comments], commentsCount: p.commentsCount + 1 }
          : p,
      ),
    );
    setActiveCommentPost(prev =>
      prev ? { ...prev, comments: [newComment, ...prev.comments], commentsCount: prev.commentsCount + 1 } : null,
    );
    dispatch(showToast('Comment posted! 💬'));
  };

  const handleCreatePost = ({ caption, image, category }) => {
    const created = {
      id: `post-${Date.now()}`,
      author: user.name,
      handle: user.name.toLowerCase().replace(/\s+/g, ''),
      authorAvatar: PROFILE_PHOTO.uri,
      badge: 'VIP Member',
      timeAgo: 'Just now',
      image,
      caption,
      hashtags: ['#dmvfitness', '#communitywin', '#athlete'],
      likesCount: 1,
      isLiked: true,
      commentsCount: 0,
      sharesCount: 0,
      isBookmarked: false,
      tagCategory: category,
      comments: [],
    };
    setPosts([created, ...posts]);
    setIsNewPostModalOpen(false);
    dispatch(showToast('Your post is live in the Community! 🎉'));
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1 · Sticky header */}
      <View style={[styles.header, { paddingTop: insets.top + Sizer.vSize(12) }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'MeTab' })} style={styles.backBtn}>
            <Icon name="chevron-left" size={Sizer.fS(20)} color={COLORS.white} />
          </Pressable>

          <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'MeTab' })} style={styles.avatarRing}>
            <LinearGradient
              colors={['#8D22FF', '#C084FC']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={styles.absFill}
            />
            <View style={styles.avatarInner}>
              <Image source={PROFILE_PHOTO} resizeMode="cover" style={styles.fullImg} />
            </View>
          </Pressable>

          <View style={styles.flex}>
            <Typography size={11} fFamily="bodyBold700" color="#A1A1AA">
              Good Morning,
            </Typography>
            <View style={styles.nameRow}>
              <Typography size={15} fFamily="bodyExtraBold800" color={COLORS.white} lineHeight={18} numberOfLines={1}>
                {user.name}
              </Typography>
              <Emoji char="👋" size={14} style={styles.nameEmoji} />
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Pressable onPress={() => setIsNewPostModalOpen(true)} style={styles.postBtn}>
            <LinearGradient
              colors={['#8D22FF', '#A84DF0']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.absFill}
            />
            <Icon name="plus" size={Sizer.fS(16)} color={COLORS.white} />
            <Typography size={12} fFamily="bodyBold700" color={COLORS.white}>
              Post
            </Typography>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('NotificationsScreen')} style={styles.bell}>
            <Icon name="bell" size={Sizer.fS(18)} color={COLORS.white} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: TABBAR_CLEARANCE + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Category chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {CATEGORIES.map(cat => {
            const on = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[styles.chip, on ? styles.chipOn : styles.chipOff]}
              >
                {on ? (
                  <LinearGradient
                    colors={['#8D22FF', '#A84DF0']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.absFill}
                  />
                ) : null}
                <Emoji char={cat.emoji} size={12} />
                <Typography size={12} fFamily="bodyBold700" color={on ? COLORS.white : '#A1A1AA'}>
                  {cat.label}
                </Typography>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Feed */}
        <View style={styles.feed}>
          {filteredPosts.map(post => (
            <View key={post.id} style={styles.post}>
              <View style={styles.postHead}>
                <View style={styles.postAuthor}>
                  <Image source={{ uri: post.authorAvatar }} resizeMode="cover" style={styles.postAvatar} />
                  <View style={styles.flex}>
                    <View style={styles.handleRow}>
                      <Typography size={14.5} fFamily="bodyBold700" color={COLORS.white} lineHeight={17}>
                        {post.handle}
                      </Typography>
                      {post.badge ? (
                        <View style={styles.badge}>
                          <Typography size={9.5} fFamily="bodyExtraBold800" color="#C084FC" textTransform="uppercase">
                            {post.badge}
                          </Typography>
                        </View>
                      ) : null}
                    </View>
                    <Typography size={11} color="#A1A1AA">
                      {post.timeAgo}
                    </Typography>
                  </View>
                </View>

                <Pressable
                  onPress={() => dispatch(showToast(`Post options for ${post.author}`))}
                  hitSlop={8}
                  style={styles.moreBtn}
                >
                  <Icon name="ellipsis" size={Sizer.fS(20)} color="#A1A1AA" />
                </Pressable>
              </View>

              <View style={styles.postMedia}>
                <Image source={post.image} resizeMode="cover" style={styles.fullImg} />
                <LinearGradient
                  colors={['transparent', 'transparent', 'rgba(0,0,0,0.6)']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.absFill}
                  pointerEvents="none"
                />
              </View>

              <View style={styles.actionBar}>
                <View style={styles.actions}>
                  <Pressable onPress={() => handleToggleLike(post.id)} style={styles.action} hitSlop={6}>
                    <HeartIcon size={24} color={post.isLiked ? '#FF4D5E' : COLORS.white} filled={post.isLiked} />
                    <Typography size={13} fFamily="monoBold700" color={COLORS.white}>
                      {compact(post.likesCount)}
                    </Typography>
                  </Pressable>

                  <Pressable onPress={() => setActiveCommentPost(post)} style={styles.action} hitSlop={6}>
                    <Icon name="message-circle" size={Sizer.fS(24)} color={COLORS.white} />
                    <Typography size={13} fFamily="monoBold700" color={COLORS.white}>
                      {compact(post.commentsCount)}
                    </Typography>
                  </Pressable>

                  <Pressable
                    onPress={() => dispatch(showToast('Post reshared to your profile 🔁'))}
                    style={styles.action}
                    hitSlop={6}
                  >
                    <Icon name="repeat" size={Sizer.fS(24)} color={COLORS.white} />
                    <Typography size={13} fFamily="monoBold700" color={COLORS.white}>
                      {compact(post.sharesCount)}
                    </Typography>
                  </Pressable>
                </View>

                <Pressable onPress={() => handleToggleBookmark(post.id)} hitSlop={8}>
                  <BookmarkIcon
                    size={24}
                    color={post.isBookmarked ? COLORS.warning : COLORS.white}
                    filled={post.isBookmarked}
                  />
                </Pressable>
              </View>

              <View style={styles.caption}>
                <RichText size={13.5} color={COLORS.white} lineHeight={20}>
                  <Typography size={13.5} fFamily="bodyExtraBold800" color={COLORS.white}>
                    {`${post.handle} `}
                  </Typography>
                  {post.caption}
                </RichText>

                <View style={styles.hashtags}>
                  {post.hashtags.map(tag => (
                    <Typography key={tag} size={12} fFamily="bodySemiBold600" color={COLORS.primary}>
                      {tag}
                    </Typography>
                  ))}
                </View>

                <Pressable onPress={() => setActiveCommentPost(post)} hitSlop={6}>
                  <Typography size={12} fFamily="bodyMedium500" color="#A1A1AA" mT={4}>
                    {`View all ${post.commentsCount} comments...`}
                  </Typography>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <CommentsSheet
        post={activeCommentPost}
        onClose={() => setActiveCommentPost(null)}
        onSend={handleAddComment}
      />

      <CreatePostModal
        visible={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onSubmit={handleCreatePost}
      />
      <StackTabBar activeTab="diary" />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0B0D' },
  absFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  flex: { flex: 1, minWidth: 0 },
  fullImg: { width: '100%', height: '100%' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizer.hSize(16),
    paddingBottom: Sizer.vSize(12),
    backgroundColor: 'rgba(18,18,21,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.hairline,
    zIndex: 2,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(10), flex: 1, minWidth: 0 },
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
  avatarRing: { width: 36, height: 36, borderRadius: RADIUS.full, padding: 1.5, overflow: 'hidden', flexShrink: 0 },
  avatarInner: {
    flex: 1,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#0B0B0D',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  nameEmoji: { marginLeft: Sizer.hSize(4) },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8), flexShrink: 0 },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(6),
    paddingHorizontal: Sizer.hSize(14),
    paddingVertical: Sizer.vSize(6),
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  bell: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: '#0B0B0D',
  },

  scroll: {
    paddingHorizontal: Sizer.hSize(16),
    paddingTop: Sizer.vSize(12),
    width: '100%',
    maxWidth: SHELL_MAX_WIDTH,
    alignSelf: 'center',
  },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8), paddingBottom: Sizer.vSize(12) },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(5),
    paddingHorizontal: Sizer.hSize(14),
    paddingVertical: Sizer.vSize(6),
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    flexShrink: 0,
  },
  chipOn: {
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  chipOff: { backgroundColor: '#141417', borderWidth: 1, borderColor: COLORS.hairline },

  feed: { gap: Sizer.vSize(20), marginTop: Sizer.vSize(8) },
  post: {
    borderRadius: 26,
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    overflow: 'hidden',
  },
  postHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(14),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(24,24,27,0.6)',
  },
  postAuthor: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12), flex: 1, minWidth: 0 },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: 'rgba(141,34,255,0.5)',
    flexShrink: 0,
  },
  handleRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(6) },
  badge: {
    paddingHorizontal: Sizer.hSize(6),
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(141,34,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.3)',
  },
  moreBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },

  postMedia: { width: '100%', aspectRatio: 16 / 9, backgroundColor: COLORS.black, overflow: 'hidden' },

  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizer.hSize(16),
    paddingTop: Sizer.vSize(12),
    paddingBottom: Sizer.vSize(8),
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(16) },
  action: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(6) },

  caption: { paddingHorizontal: Sizer.hSize(16), paddingBottom: Sizer.vSize(16), gap: Sizer.vSize(6) },
  hashtags: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Sizer.hSize(6) },
});

export default CommunityScreen;
