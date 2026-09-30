import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { AvatarCoach, AvatarUser, DmvScreen, Emoji, SoftBlob } from '../../components';
import { TABBAR_CLEARANCE } from '../../constants';
import { selectIsSpanish, selectUser, showToast, toggleSpanish } from '../../redux/slices/appSlice';

const StatPill = ({ value, emoji, label }) => (
  <View style={styles.statPill}>
    <View style={styles.statValue}>
      <Typography size={17} fFamily="monoBold700" color={COLORS.white}>
        {String(value)}
      </Typography>
      <Emoji char={emoji} size={13} style={styles.statEmoji} />
    </View>
    <Typography
      size={10}
      fFamily="bodyBold700"
      color={COLORS.muted}
      textTransform="uppercase"
      letterSpacing={0.25}
      mT={2}
    >
      {label}
    </Typography>
  </View>
);

/** Screen 34 · Profile & Settings */
const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isSpanish = useSelector(selectIsSpanish);

  const settingsGroups = [
    {
      group: 'COMMUNITY & COACHING',
      items: [
        {
          label: 'DMV Community Hub',
          sub: 'Social feed, daily PR wins & athlete posts',
          icon: 'users',
          action: () => navigation.navigate('CommunityScreen'),
        },
        {
          label: '1:1 VIP Coach Marcus',
          sub: 'Direct messaging & program adjustments',
          icon: 'message-circle',
          action: () => navigation.navigate('CoachChatScreen'),
        },
      ],
    },
    {
      group: 'TRAINING & NUTRITION',
      items: [
        {
          label: 'Goals & Macro Targets',
          sub: 'Custom calorie & macro splits',
          icon: 'target',
          action: () => navigation.navigate('MacroBuilderScreen'),
        },
        {
          label: 'My Saved Meals',
          sub: 'Saved foods & custom recipes',
          icon: 'utensils',
          action: () => navigation.navigate('MealsRecipesScreen'),
        },
      ],
    },
    {
      group: 'CONNECTED APPS & DEVICES',
      items: [
        {
          label: 'Health & Devices',
          sub: 'Apple Health, Watch, Garmin',
          icon: 'heart',
          action: () => navigation.navigate('HealthDevicesScreen'),
        },
        {
          label: 'Notifications & Reminders',
          sub: 'Workout alarms, meal logging prompts',
          icon: 'bell',
          action: () => navigation.navigate('NotificationsScreen'),
        },
      ],
    },
    {
      group: 'MEMBERSHIP & ACCOUNT',
      items: [
        {
          label: 'Subscription & Billing',
          sub: 'Elite Annual · Renews Feb 14, 2027',
          icon: 'credit-card',
          action: () => navigation.navigate('SubscriptionScreen'),
        },
        {
          label: 'Privacy & Sharing',
          sub: 'Photo sharing, public leaderboards',
          icon: 'shield',
          action: () => navigation.navigate('PrivacySharingScreen'),
        },
        {
          label: 'Help & Support Concierge',
          sub: '24/7 dedicated personal support',
          icon: 'circle-help',
          action: () => dispatch(showToast('Dedicated 24/7 Coach Support chat opened')),
        },
      ],
    },
  ];

  return (
    <DmvScreen bgColor="#0B0B0D" topPad={12} bottomPad={TABBAR_CLEARANCE}>
      <View style={styles.nav}>
        <View style={styles.flex}>
          <Typography
            size={26}
            fFamily="displayBold700"
            color={COLORS.white}
            textTransform="uppercase"
            lineHeight={30}
            letterSpacing={-0.26}
          >
            ACCOUNT & PROFILE
          </Typography>
          <Typography size={11.5} color={COLORS.muted}>
            Manage your membership & coaching settings
          </Typography>
        </View>
        <Pressable onPress={() => navigation.navigate('AboutYouScreen')} style={styles.editBtn}>
          <Icon name="pencil" size={Sizer.fS(16)} color={COLORS.foreground} />
        </Pressable>
      </View>

      {/* 1 · Identity hero */}
      <View style={styles.hero}>
        <LinearGradient colors={['#18181B', '#121215']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.absFill} />
        <SoftBlob size={160} opacity={0.2} style={styles.heroGlow} />

        <View style={styles.avatarWrap}>
          {/* The ring is a sibling layer, not a parent: a LinearGradient with a
              border radius masks its children, which rounded the mock's
              squircle avatar into a circle. */}
          <View style={styles.avatarRing}>
            <LinearGradient
              colors={['#8D22FF', '#C084FC']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={styles.avatarRingFill}
            />
            <AvatarUser name={user.name} size={68} fontSize={24} />
          </View>
          <View style={styles.onlineDot} />
        </View>

        <View style={styles.nameRow}>
          <Typography
            size={22}
            fFamily="displayBold700"
            color={COLORS.white}
            textTransform="uppercase"
            letterSpacing={-0.55}
          >
            {user.name}
          </Typography>
          <View style={styles.eliteBadge}>
            <LinearGradient
              colors={['#FFB020', '#FFA000']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.absFill}
            />
            <Icon name="sparkles" size={Sizer.fS(12)} color={COLORS.black} />
            <Typography size={10} fFamily="bodyExtraBold800" color={COLORS.black} textTransform="uppercase">
              ELITE
            </Typography>
          </View>
        </View>

        <Typography size={12} fFamily="bodyMedium500" color={COLORS.muted} mB={16} textAlign="center">
          {`${user.email} · Member since Feb 2026`}
        </Typography>

        <View style={styles.statRow}>
          <StatPill value={user.streakDays} emoji="🔥" label="Day Streak" />
          <StatPill value={user.workoutsCompleted} emoji="🏋️" label="Workouts" />
          <StatPill value={user.badgesEarned} emoji="🏆" label="Badges" />
        </View>
      </View>

      {/* 2 · Community feed card */}
      <Pressable onPress={() => navigation.navigate('CommunityScreen')} style={styles.featureCard}>
        <LinearGradient
          colors={['#1E1630', '#18181B', '#141417']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.absFill}
        />
        <View style={styles.featureLeft}>
          <View style={styles.featureDisc}>
            <LinearGradient
              colors={['#8D22FF', '#A84DF0']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={styles.absFill}
            />
            <Icon name="users" size={Sizer.fS(24)} color={COLORS.white} />
          </View>
          <View style={styles.flex}>
            <View style={styles.featureTitleRow}>
              <Typography size={15} fFamily="bodyExtraBold800" color={COLORS.white} numberOfLines={1} flex={1}>
                DMV Community Feed
              </Typography>
              <View style={styles.activeTag}>
                <Typography size={9.5} fFamily="bodyExtraBold800" color={COLORS.success} textTransform="uppercase">
                  {'Active '}
                </Typography>
                <Emoji char="🔥" size={9} />
              </View>
            </View>
            <Typography size={11.5} color="#A1A1AA" numberOfLines={1} mT={2}>
              Daily athlete wins, 5K PRs & healthy meal recipes
            </Typography>
          </View>
        </View>
        <View style={styles.featureChevron}>
          <Icon name="chevron-right" size={Sizer.fS(18)} color={COLORS.white} />
        </View>
      </Pressable>

      {/* 3 · Coach card */}
      <Pressable onPress={() => navigation.navigate('CoachChatScreen')} style={[styles.featureCard, styles.coachCard]}>
        <LinearGradient
          colors={['#18181B', '#1A1824', '#18181B']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.absFill}
        />
        <View style={styles.featureLeft}>
          <View>
            <AvatarCoach size={48} fontSize={18} style={styles.coachAvatar} />
            <View style={styles.coachDot} />
          </View>
          <View style={styles.flex}>
            <View style={styles.featureTitleRow}>
              <Typography size={14.5} fFamily="bodyBold700" color={COLORS.white} numberOfLines={1}>
                {`Coach ${user.coachName}`}
              </Typography>
              <View style={styles.assignedTag}>
                <Typography size={10} fFamily="bodyBold700" color="#C084FC">
                  ASSIGNED COACH
                </Typography>
              </View>
            </View>
            <View style={styles.coachStatus}>
              <Typography size={11.5} color={COLORS.muted}>
                {'Online · 1:1 VIP Chat Active '}
              </Typography>
              <Emoji char="💬" size={11} />
            </View>
          </View>
        </View>

        <Pressable onPress={() => navigation.navigate('CoachChatScreen')} style={styles.coachChatBtn}>
          <LinearGradient
            colors={['#8D22FF', '#A84DF0']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.absFill}
          />
          <Icon name="message-circle" size={Sizer.fS(20)} color={COLORS.white} />
        </Pressable>
      </Pressable>

      {/* 4 · Settings groups */}
      <View style={styles.groups}>
        {settingsGroups.map(grp => (
          <View key={grp.group} style={styles.group}>
            <Typography
              size={11}
              fFamily="bodyBold700"
              color={COLORS.faint}
              textTransform="uppercase"
              letterSpacing={0.28}
              style={styles.groupLabel}
            >
              {grp.group}
            </Typography>

            <View style={styles.groupItems}>
              {grp.items.map(item => (
                <Pressable key={item.label} onPress={item.action} style={styles.settingRow}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <Icon name={item.icon} size={Sizer.fS(20)} color="#C084FC" />
                    </View>
                    <View style={styles.flex}>
                      <Typography size={14} fFamily="bodyBold700" color={COLORS.white}>
                        {item.label}
                      </Typography>
                      <Typography size={11.5} color={COLORS.muted} mT={2}>
                        {item.sub}
                      </Typography>
                    </View>
                  </View>
                  <Icon name="chevron-right" size={Sizer.fS(20)} color={COLORS.faint} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* 5 · Footer */}
      <View style={styles.footer}>
        <Pressable onPress={() => dispatch(toggleSpanish())} style={styles.langBtn}>
          <Icon name="globe" size={Sizer.fS(14)} color={COLORS.primary} />
          <Typography size={11.5} fFamily="bodySemiBold600" color={COLORS.muted}>
            {`Language: ${isSpanish ? 'Español' : 'English (US)'}`}
          </Typography>
        </Pressable>

        <Typography size={11} color={COLORS.faint} textAlign="center">
          DMV Fitness App v3.4.0 (Build 420) · Washington D.C.
        </Typography>
      </View>
    </DmvScreen>
  );
};

const styles = StyleSheet.create({
  absFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  flex: { flex: 1, minWidth: 0 },

  nav: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: Sizer.vSize(16) },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },

  hero: {
    borderRadius: 22,
    padding: Sizer.hSize(20),
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    marginBottom: Sizer.vSize(16),
    overflow: 'hidden',
  },
  heroGlow: { position: 'absolute', top: -40, right: -40 },
  avatarWrap: { marginBottom: Sizer.vSize(12) },
  avatarRing: {
    padding: 4,
    borderRadius: RADIUS.full,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  avatarRingFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: RADIUS.full,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8), marginBottom: 4 },
  eliteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Sizer.hSize(8),
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  statRow: {
    flexDirection: 'row',
    gap: Sizer.hSize(10),
    width: '100%',
    paddingTop: Sizer.vSize(14),
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
  },
  statPill: {
    flex: 1,
    backgroundColor: '#141417',
    padding: Sizer.hSize(10),
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  statValue: { flexDirection: 'row', alignItems: 'center' },
  statEmoji: { marginLeft: 4 },

  featureCard: {
    borderRadius: 20,
    padding: Sizer.hSize(16),
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(12),
    overflow: 'hidden',
    gap: Sizer.hSize(8),
  },
  coachCard: { borderColor: 'rgba(141,34,255,0.35)', marginBottom: Sizer.vSize(20) },
  featureLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(14), flex: 1, minWidth: 0 },
  featureDisc: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  featureTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8) },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(8),
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(46,212,122,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(46,212,122,0.3)',
  },
  featureChevron: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  coachAvatar: { borderRadius: RADIUS.full, borderColor: 'rgba(141,34,255,0.5)' },
  coachDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  assignedTag: {
    paddingHorizontal: Sizer.hSize(6),
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: 'rgba(141,34,255,0.2)',
  },
  coachStatus: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  coachChatBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  groups: { gap: Sizer.vSize(20), marginBottom: Sizer.vSize(24) },
  group: { gap: Sizer.vSize(8) },
  groupLabel: { paddingHorizontal: 4 },
  groupItems: { gap: Sizer.vSize(8) },
  settingRow: {
    borderRadius: 18,
    padding: Sizer.hSize(14),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(14), flex: 1, minWidth: 0 },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(141,34,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  footer: {
    gap: Sizer.vSize(12),
    paddingTop: Sizer.vSize(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(6),
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(6),
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
});

export default ProfileScreen;
