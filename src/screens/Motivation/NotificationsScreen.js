import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { DmvScreen, RoundBackButton, DmvButton } from '../../components';
import { TABBAR_CLEARANCE } from '../../constants';
import { markAllNotificationsRead, selectNotifications } from '../../redux/slices/appSlice';

/** Screen 33 · Notifications */
const NotificationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const backToToday = () => navigation.navigate('MainTabs', { screen: 'TodayTab' });

  return (
    <DmvScreen
      bgColor="#0B0B0D"
      topPad={12}
      bottomPad={TABBAR_CLEARANCE}
    >
      <View style={styles.nav}>
        <View style={styles.navLeft}>
          <RoundBackButton onPress={backToToday} style={styles.navBtn} />
          <Typography
            size={12}
            fFamily="displaySemiBold600"
            color={COLORS.faint}
            textTransform="uppercase"
            letterSpacing={1.68}
          >
            NOTIFICATIONS
          </Typography>
        </View>

        <Pressable onPress={() => dispatch(markAllNotificationsRead())} hitSlop={8}>
          <Typography size={11} color={COLORS.muted}>
            Mark all read
          </Typography>
        </Pressable>
      </View>

      <View style={styles.list}>
        {notifications.map(n => (
          <View key={n.id} style={[styles.row, n.unread ? styles.unread : styles.read]}>
            <View style={styles.rowHead}>
              <Typography size={13} fFamily="bodySemiBold600" flex={1} numberOfLines={1}>
                {n.title}
              </Typography>
              <Typography size={10.5} color={COLORS.faint}>
                {n.when}
              </Typography>
            </View>
            <Typography size={11.5} color={COLORS.muted} lineHeight={16}>
              {n.body}
            </Typography>
          </View>
        ))}
      </View>

      <Pressable onPress={() => navigation.navigate('HealthDevicesScreen')} style={styles.settingsRow}>
        <View style={styles.settingsLeft}>
          <Icon name="sliders-horizontal" size={Sizer.fS(16)} color={COLORS.primarySoft} />
          <View style={styles.flex}>
            <Typography size={13} fFamily="bodySemiBold600">
              Choose what reaches you
            </Typography>
            <Typography size={11} color={COLORS.muted}>
              Turn any reminder off in Settings
            </Typography>
          </View>
        </View>
        <Icon name="chevron-right" size={Sizer.fS(16)} color={COLORS.faint} />
      </Pressable>

      {/* The mock keeps this button in the content flow under the list. */}
      <View style={styles.cta}>
        <DmvButton title="Back to Today" variant="ghost" onPress={backToToday} />
      </View>
    </DmvScreen>
  );
};

const styles = StyleSheet.create({
  cta: { marginTop: Sizer.vSize(16) },
  flex: { flex: 1, minWidth: 0 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizer.vSize(12) },
  navLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8) },
  navBtn: { width: 32, height: 32, backgroundColor: COLORS.surface2, borderWidth: 0 },

  list: { gap: Sizer.vSize(8), marginBottom: Sizer.vSize(16) },
  row: { borderRadius: 12, padding: Sizer.hSize(12), borderWidth: 1 },
  unread: { backgroundColor: 'rgba(141,34,255,0.14)', borderColor: COLORS.primary },
  read: { backgroundColor: COLORS.surface, borderColor: 'rgba(232,232,236,0.08)' },
  rowHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Sizer.hSize(8), marginBottom: 4 },

  settingsRow: {
    borderRadius: 12,
    padding: Sizer.hSize(12),
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(232,232,236,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12), flex: 1, minWidth: 0 },
});

export default NotificationsScreen;
