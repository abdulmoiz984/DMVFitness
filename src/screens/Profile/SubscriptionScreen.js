import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { DmvScreen, RoundBackButton, DmvButton, DmvMeter } from '../../components';
import { TABBAR_CLEARANCE } from '../../constants';
import { showToast } from '../../redux/slices/appSlice';

const PERKS = [
  'Everything in Pro',
  'Monthly 1:1 coach check-in',
  'Custom macros set by your coach',
  'Priority support',
];

/** Screen 36 · Subscription */
const SubscriptionScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const back = () => navigation.navigate('MainTabs', { screen: 'MeTab' });

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
          Subscription Plan
        </Typography>
        <View style={styles.navSpacer} />
      </View>

      <View style={styles.planCard}>
        <View style={styles.rowBetween}>
          <View style={styles.flex}>
            <Typography
              size={20}
              fFamily="displayBold700"
              textTransform="uppercase"
              letterSpacing={0.5}
            >
              Elite Annual
            </Typography>
            <Typography size={11} color={COLORS.muted}>
              Renews Feb 14, 2027
            </Typography>
          </View>
          <Typography size={22} fFamily="monoBold700">
            $349
          </Typography>
        </View>

        <DmvMeter value={53} max={100} fillColor={COLORS.primary} height={5} />
        <Typography size={11} fFamily="bodyMedium500" color={COLORS.primarySoft} textAlign="right">
          170 days left in this term
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
        WHAT YOU GET
      </Typography>

      <View style={styles.perks}>
        {PERKS.map(item => (
          <View key={item} style={styles.perkRow}>
            <View style={styles.perkTick}>
              <Icon name="check" size={Sizer.fS(10)} color={COLORS.success} />
            </View>
            <Typography size={12.5} flex={1}>
              {item}
            </Typography>
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
        PAYMENT
      </Typography>

      <View style={styles.list}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Icon name="credit-card" size={Sizer.fS(20)} color={COLORS.primarySoft} />
            <View style={styles.flex}>
              <Typography size={13} fFamily="bodySemiBold600">
                Visa •••• 4242
              </Typography>
              <Typography size={11} color={COLORS.muted}>
                Expires 04/29
              </Typography>
            </View>
          </View>
          <Pressable onPress={() => navigation.navigate('PaymentScreen')} hitSlop={8}>
            <Typography size={12} fFamily="bodyMedium500" color={COLORS.primarySoft}>
              Update
            </Typography>
          </Pressable>
        </View>

        <Pressable onPress={() => dispatch(showToast('Invoices sent to email'))} style={styles.row}>
          <View style={styles.rowLeft}>
            <Icon name="receipt" size={Sizer.fS(20)} color={COLORS.muted} />
            <View style={styles.flex}>
              <Typography size={13} fFamily="bodySemiBold600">
                Billing history
              </Typography>
              <Typography size={11} color={COLORS.muted}>
                2 invoices
              </Typography>
            </View>
          </View>
          <Icon name="chevron-right" size={Sizer.fS(16)} color={COLORS.faint} />
        </Pressable>
      </View>

      {/* The mock keeps these two buttons in the content flow (`gap-2 pt-4`). */}
      <View style={styles.actions}>
        <DmvButton title="Change plan" variant="ghost" onPress={() => navigation.navigate('ChoosePlanScreen')} />
        <DmvButton
          title="Cancel subscription"
          variant="quiet"
          onPress={() => dispatch(showToast('Subscription cancellation is available anytime in store'))}
        />
      </View>
    </DmvScreen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actions: { gap: Sizer.vSize(8), paddingTop: Sizer.vSize(16) },

  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    marginBottom: Sizer.vSize(14),
  },
  navBtn: { width: 40, height: 40 },
  navSpacer: { width: 40 },

  planCard: {
    borderRadius: 16,
    padding: Sizer.hSize(16),
    backgroundColor: 'rgba(141,34,255,0.14)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: Sizer.vSize(12),
    marginBottom: Sizer.vSize(16),
  },

  perks: { gap: Sizer.vSize(6), marginBottom: Sizer.vSize(16) },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(10), paddingVertical: Sizer.vSize(4) },
  perkTick: {
    width: 16,
    height: 16,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(46,212,122,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  list: { gap: Sizer.vSize(8) },
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
});

export default SubscriptionScreen;
