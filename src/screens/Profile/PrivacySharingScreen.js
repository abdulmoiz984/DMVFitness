import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { DmvScreen, RoundBackButton, DmvButton, DmvToggle } from '../../components';
import { TABBAR_CLEARANCE } from '../../constants';
import { selectPrivacy, showToast, updatePrivacy } from '../../redux/slices/appSlice';

/** Screen 37 · Privacy and Sharing */
const PrivacySharingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const privacySettings = useSelector(selectPrivacy);
  const back = () => navigation.navigate('MainTabs', { screen: 'MeTab' });

  const toggle = key => dispatch(updatePrivacy({ [key]: !privacySettings[key] }));

  return (
    <DmvScreen
      bgColor="#0B0B0D"
      topPad={12}
      bottomPad={TABBAR_CLEARANCE}
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
          Privacy & Sharing
        </Typography>
        <View style={styles.navSpacer} />
      </View>

      <View style={styles.intro}>
        <Icon name="shield" size={Sizer.fS(20)} color={COLORS.primary} style={styles.introIcon} />
        <Typography size={11.5} lineHeight={18} flex={1}>
          Your progress photos are private the moment you take them. Nothing is shared unless you choose it here.
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
        SHARING
      </Typography>

      <View style={styles.list}>
        <View style={styles.row}>
          <Typography size={13} fFamily="bodyMedium500" flex={1}>
            Progress photos
          </Typography>
          <Typography size={12} color={COLORS.muted}>
            Only me
          </Typography>
        </View>

        <View style={styles.row}>
          <Typography size={13} fFamily="bodyMedium500" flex={1}>
            Let my coach see my photos
          </Typography>
          <DmvToggle value={privacySettings.coachAccess} onPress={() => toggle('coachAccess')} />
        </View>

        <View style={styles.row}>
          <Typography size={13} fFamily="bodyMedium500" flex={1}>
            Recipes I share
          </Typography>
          <Typography size={12} color={COLORS.muted}>
            Visible to everyone
          </Typography>
        </View>

        <View style={styles.row}>
          <Typography size={13} fFamily="bodyMedium500" flex={1}>
            Show me on leaderboards
          </Typography>
          <DmvToggle value={privacySettings.leaderboards} onPress={() => toggle('leaderboards')} />
        </View>
      </View>

      <Typography
        size={10}
        fFamily="displaySemiBold600"
        color={COLORS.faint}
        textTransform="uppercase"
        letterSpacing={1.4}
        mB={8}
      >
        YOUR DATA
      </Typography>

      <View style={styles.list}>
        <Pressable onPress={() => dispatch(showToast('Exporting your complete archive...'))} style={styles.row}>
          <View style={styles.rowLeft}>
            <Icon name="download" size={Sizer.fS(16)} color={COLORS.muted} />
            <View style={styles.flex}>
              <Typography size={13} fFamily="bodySemiBold600">
                Download my data
              </Typography>
              <Typography size={11} color={COLORS.muted}>
                Everything, as a file
              </Typography>
            </View>
          </View>
          <Icon name="chevron-right" size={Sizer.fS(16)} color={COLORS.faint} />
        </Pressable>

        <Pressable
          onPress={() => dispatch(showToast('Account deletion request initiated.'))}
          style={[styles.row, styles.dangerRow]}
        >
          <View style={styles.rowLeft}>
            <Icon name="trash-2" size={Sizer.fS(16)} color={COLORS.danger} />
            <View style={styles.flex}>
              <Typography size={13} fFamily="bodySemiBold600" color={COLORS.danger}>
                Delete my account
              </Typography>
              <Typography size={11} color={COLORS.muted}>
                Photos deleted within 30 days
              </Typography>
            </View>
          </View>
          <Icon name="chevron-right" size={Sizer.fS(16)} color={COLORS.danger} />
        </Pressable>
      </View>

      {/* The mock keeps this button in the content flow under the cards. */}
      <View style={styles.cta}>
        <DmvButton title="Back to Profile" variant="ghost" onPress={back} />
      </View>
    </DmvScreen>
  );
};

const styles = StyleSheet.create({
  cta: { marginTop: Sizer.vSize(16) },
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

  intro: {
    borderRadius: 14,
    padding: Sizer.hSize(14),
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: 'rgba(232,232,236,0.08)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(12),
    marginBottom: Sizer.vSize(16),
  },
  introIcon: { marginTop: 2 },

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
  dangerRow: { borderColor: 'rgba(255,77,94,0.3)' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12), flex: 1, minWidth: 0 },
});

export default PrivacySharingScreen;
