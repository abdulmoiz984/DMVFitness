import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { gridItemWidthScaled } from '../../helpers/grid';
import { Typography } from '../../atomComponents';
import {
  DmvScreen,
  RoundBackButton,
  DmvButton,
  DmvMeter,
  DmvBadgeIcon,
  FlameIcon,
  StackTabBar,
} from '../../components';
import { TABBAR_CLEARANCE } from '../../constants';
import { badgesList } from '../../lib/dmv-data';
import { selectUser } from '../../redux/slices/appSlice';

const BADGE_WIDTH = gridItemWidthScaled(3, 10, 32);

/** Screen 32 · Achievements */
const AchievementsScreen = ({ navigation }) => {
  const user = useSelector(selectUser);
  const backToToday = () =>
    navigation.navigate('MainTabs', { screen: 'TodayTab' });

  return (
    <View style={styles.root}>
      <DmvScreen bgColor="#0B0B0D" topPad={12} bottomPad={TABBAR_CLEARANCE}>
        <View style={styles.nav}>
          <RoundBackButton onPress={backToToday} style={styles.navBtn} />
          <Typography
            size={12}
            fFamily="displaySemiBold600"
            color={COLORS.faint}
            textTransform="uppercase"
            letterSpacing={1.68}
          >
            ACHIEVEMENTS
          </Typography>
          <View style={styles.navSpacer} />
        </View>

        <View style={styles.streakCard}>
          <FlameIcon size={26} color={COLORS.primarySoft} />
          <Typography size={28} fFamily="monoBold700" lineHeight={28} mT={4}>
            {String(user.streakDays)}
          </Typography>
          <Typography
            size={11}
            fFamily="displayBold700"
            color={COLORS.primarySoft}
            textTransform="uppercase"
            letterSpacing={1.54}
            mT={4}
          >
            DAY LOGGING STREAK
          </Typography>
          <Typography size={11} color={COLORS.muted} textAlign="center" mT={4}>
            Your best yet. Log something today to keep it.
          </Typography>
        </View>

        <Typography
          size={10}
          fFamily="displaySemiBold600"
          color={COLORS.faint}
          textTransform="uppercase"
          letterSpacing={1.4}
          mB={8}
        >
          EARNED BADGES
        </Typography>

        <View style={styles.badgeGrid}>
          {badgesList.map(b => {
            const earned = b.state === 'earned';
            return (
              <View
                key={b.id}
                style={[
                  styles.badge,
                  earned ? styles.badgeEarned : styles.badgeLocked,
                ]}
              >
                <View style={styles.badgeIcon}>
                  <DmvBadgeIcon type={b.icon} size={22} />
                </View>
                <Typography
                  size={9.5}
                  fFamily="displaySemiBold600"
                  textTransform="uppercase"
                  letterSpacing={0.24}
                  textAlign="center"
                  lineHeight={11}
                >
                  {b.label}
                </Typography>
              </View>
            );
          })}
        </View>

        <Typography
          size={10}
          fFamily="displaySemiBold600"
          color={COLORS.faint}
          textTransform="uppercase"
          letterSpacing={1.4}
          mB={6}
        >
          NEXT UP
        </Typography>

        <View style={styles.nextCard}>
          <View style={styles.rowBetween}>
            <View style={styles.flex}>
              <Typography size={13.5} fFamily="bodySemiBold600">
                150 workouts
              </Typography>
              <Typography size={11} color={COLORS.muted}>
                22 to go · 128 completed
              </Typography>
            </View>
            <Typography size={13} fFamily="monoBold700" color={COLORS.primary}>
              85%
            </Typography>
          </View>
          <DmvMeter
            value={85}
            max={100}
            fillColor={COLORS.primary}
            height={5}
          />
        </View>
        {/* The mock keeps this button in the content flow under the cards. */}
        <View style={styles.cta}>
          <DmvButton
            title="Back to Today"
            variant="ghost"
            onPress={backToToday}
          />
        </View>
      </DmvScreen>
      <StackTabBar activeTab="me" />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  cta: { marginTop: Sizer.vSize(16) },
  flex: { flex: 1, minWidth: 0 },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(12),
  },
  navBtn: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.surface2,
    borderWidth: 0,
  },
  navSpacer: { width: 32 },

  streakCard: {
    borderRadius: 16,
    padding: Sizer.hSize(16),
    backgroundColor: 'rgba(141,34,255,0.14)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizer.vSize(16),
  },

  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(10),
    marginBottom: Sizer.vSize(16),
  },
  badge: {
    width: BADGE_WIDTH,
    // The mock's tiles are `aspect-square`. Spelled out as a height because
    // aspectRatio inside a wrapping row leaves the tiles short of the height
    // the row reserves for them.
    height: BADGE_WIDTH,
    borderRadius: 14,
    padding: Sizer.hSize(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEarned: {
    backgroundColor: 'rgba(141,34,255,0.14)',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  badgeLocked: {
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: 'rgba(232,232,236,0.06)',
    opacity: 0.6,
  },
  badgeIcon: { marginBottom: Sizer.vSize(6) },

  nextCard: {
    borderRadius: 14,
    padding: Sizer.hSize(14),
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.divider,
    gap: Sizer.vSize(8),
  },
});

export default AchievementsScreen;
