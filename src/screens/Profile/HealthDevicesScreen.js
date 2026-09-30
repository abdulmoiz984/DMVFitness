import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { DmvScreen, RoundBackButton, DmvButton, DmvChip, DmvToggle } from '../../components';
import { TABBAR_CLEARANCE } from '../../constants';
import { selectDeviceSync, showToast, updateDeviceSync } from '../../redux/slices/appSlice';

const CONNECTED = [
  { name: 'Apple Health', sub: 'Connected · syncing', icon: 'heart', tint: '#FF4D5E' },
  { name: 'Apple Watch Series 9', sub: 'Workouts and heart rate', icon: 'watch', tint: '#B36BFF' },
];

const AVAILABLE = [
  { name: 'Google Fit', toast: 'Google Fit linked' },
  { name: 'Garmin Connect', toast: 'Garmin Connect linked' },
];

const IMPORTS = [
  { key: 'importWorkouts', label: 'Workouts', sub: 'Added to your history, marked as imported' },
  { key: 'importSteps', label: 'Steps and activity', sub: 'Shown on your progress screen' },
  {
    key: 'addCaloriesBack',
    label: 'Add exercise calories to my target',
    sub: 'Off. Watch estimates run high.',
  },
];

/** Screen 35 · Health and Devices */
const HealthDevicesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const deviceSync = useSelector(selectDeviceSync);
  const back = () => navigation.navigate('MainTabs', { screen: 'MeTab' });

  return (
    <DmvScreen
      bgColor="#0B0B0D"
      topPad={12}
      bottomPad={TABBAR_CLEARANCE}
      footer={<DmvButton title="Done" variant="ghost" onPress={back} />}
    >
      <View style={styles.nav}>
        <RoundBackButton onPress={back} style={styles.navBtn} />
        <Typography
          size={15.5}
          fFamily="displayBold700"
          color={COLORS.white}
          textTransform="uppercase"
          letterSpacing={2.17}
        >
          Health & Devices
        </Typography>
        <View style={styles.navSpacer} />
      </View>

      <Typography size={11.5} color={COLORS.muted} lineHeight={18} mB={16}>
        Let your watch record the workout so you don't have to type it in.
      </Typography>

      <View style={styles.list}>
        {CONNECTED.map(d => (
          <View key={d.name} style={styles.row}>
            <View style={styles.rowLeft}>
              <Icon name={d.icon} size={Sizer.fS(20)} color={d.tint} />
              <View style={styles.flex}>
                <Typography size={13.5} fFamily="bodySemiBold600">
                  {d.name}
                </Typography>
                <Typography size={11} color={COLORS.muted}>
                  {d.sub}
                </Typography>
              </View>
            </View>
            <DmvChip variant="success" label="On" />
          </View>
        ))}

        {AVAILABLE.map(d => (
          <View key={d.name} style={styles.row}>
            <View style={styles.rowLeft}>
              <Icon name="activity" size={Sizer.fS(20)} color={COLORS.info} />
              <View style={styles.flex}>
                <Typography size={13.5} fFamily="bodySemiBold600">
                  {d.name}
                </Typography>
                <Typography size={11} color={COLORS.faint}>
                  Not connected
                </Typography>
              </View>
            </View>
            <Pressable onPress={() => dispatch(showToast(d.toast))} style={styles.connectBtn}>
              <Typography size={11.5} fFamily="bodySemiBold600">
                Connect
              </Typography>
            </Pressable>
          </View>
        ))}
      </View>

      <Typography
        size={10}
        fFamily="displaySemiBold600"
        color={COLORS.faint}
        textTransform="uppercase"
        letterSpacing={1.4}
        mB={8}
      >
        WHAT WE IMPORT
      </Typography>

      <View style={styles.list}>
        {IMPORTS.map(item => (
          <View key={item.key} style={styles.row}>
            <View style={styles.flex}>
              <Typography size={13} fFamily="bodySemiBold600">
                {item.label}
              </Typography>
              <Typography size={11} color={COLORS.muted}>
                {item.sub}
              </Typography>
            </View>
            <DmvToggle
              value={deviceSync[item.key]}
              onPress={() => dispatch(updateDeviceSync({ [item.key]: !deviceSync[item.key] }))}
            />
          </View>
        ))}
      </View>
    </DmvScreen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    marginBottom: Sizer.vSize(14),
  },
  navBtn: { width: 40, height: 40 },
  navSpacer: { width: 40 },

  list: { gap: Sizer.vSize(8), marginBottom: Sizer.vSize(16) },
  row: {
    borderRadius: 12,
    padding: Sizer.hSize(12),
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(232,232,236,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Sizer.hSize(12),
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12), flex: 1, minWidth: 0 },
  connectBtn: {
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(4),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.dividerStrong,
  },
});

export default HealthDevicesScreen;
