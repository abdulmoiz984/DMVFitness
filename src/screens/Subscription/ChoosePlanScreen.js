import React, { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { DmvScreen, DmvButton, CrownIcon } from '../../components';
import { images } from '../../assets/images';
import { updateUser } from '../../redux/slices/appSlice';

const FEATURES = [
  { title: 'Barcode Scan: ', body: 'Skip the search and log faster' },
  { title: 'Custom Macro Tracking: ', body: 'Find your balance of carbs, protein & fat' },
  { title: 'Zero Ads: ', body: 'Track and reach your goals, distraction-free' },
];

const PlanCard = ({ label, price, unit, strike, footnote, badge, selected, onPress }) => (
  <Pressable onPress={onPress} style={[styles.plan, selected ? styles.planOn : styles.planOff]}>
    {badge ? (
      <View style={styles.badge}>
        <Typography size={9.5} fFamily="bodyBold700" color={COLORS.white} letterSpacing={0.48}>
          {badge}
        </Typography>
      </View>
    ) : null}

    <View>
      <View style={styles.planHead}>
        <Typography size={12} fFamily="bodyBold700" textTransform="uppercase" letterSpacing={0.6}>
          {label}
        </Typography>
        <View style={[styles.radio, selected ? styles.radioOn : styles.radioOff]}>
          {selected ? <Icon name="check" size={Sizer.fS(12)} color={COLORS.black} /> : null}
        </View>
      </View>

      <View style={styles.priceRow}>
        <Typography size={16} fFamily="monoBold700">
          {price}
        </Typography>
        <Typography size={10} color={COLORS.muted}>
          {unit}
        </Typography>
      </View>

      {strike ? (
        <Typography size={10} fFamily="monoRegular400" color={COLORS.faint} style={styles.strike}>
          {strike}
        </Typography>
      ) : null}
    </View>

    <Typography size={9.5} color={COLORS.muted} style={styles.planFoot}>
      {footnote}
    </Typography>
  </Pressable>
);

/** The mock's fake App Store purchase sheet — a light sheet over a dark scrim. */
const AppleSheet = ({ visible, priceLine, onClose, onConfirm }) => {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.scrim}>
        <Pressable style={styles.scrimFill} onPress={onClose} />
        <View style={[styles.sheet, { marginBottom: insets.bottom + 8 }]}>
          <View style={styles.sheetHead}>
            <Typography size={17} fFamily="bodySemiBold600" color={COLORS.black}>
              App Store
            </Typography>
            <Pressable onPress={onClose} hitSlop={8} style={styles.sheetClose}>
              <Icon name="x" size={Sizer.fS(16)} color="#374151" />
            </Pressable>
          </View>

          <View style={styles.sheetProduct}>
            <Image source={images.logo} resizeMode="contain" style={styles.sheetLogo} />
            <View style={styles.sheetProductText}>
              <Typography size={15} fFamily="bodyBold700" color={COLORS.black} lineHeight={18}>
                DMV Fitness Premium
              </Typography>
              <Typography size={12} color="#6B7280">
                DMV Fitness · In-App Subscription
              </Typography>
            </View>
          </View>

          <View style={styles.sheetTerms}>
            <Typography size={16} fFamily="bodyBold700" color={COLORS.black}>
              1-month free trial
            </Typography>
            <Typography size={12} color="#6B7280">
              Starting today
            </Typography>
            <Typography size={14} fFamily="bodySemiBold600" color={COLORS.black} mT={4}>
              {priceLine}
            </Typography>
            <Typography size={12} color="#6B7280">
              Starting after 30 days
            </Typography>
          </View>

          <Typography size={10.5} color="#6B7280" lineHeight={14} mB={20}>
            No commitment. Cancel at any time in Settings {'>'} Apple ID at least one day before each renewal date.
            Plan automatically renews until cancelled.
          </Typography>

          <Pressable onPress={onConfirm} style={({ pressed }) => [styles.subscribe, pressed && styles.pressed]}>
            <Typography size={15} fFamily="bodySemiBold600" color={COLORS.white}>
              Subscribe
            </Typography>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

/** Screen 15 · Choose a Plan / Paywall */
const ChoosePlanScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [sheetOpen, setSheetOpen] = useState(false);

  const confirm = () => {
    dispatch(updateUser({ plan: billingCycle === 'yearly' ? 'Premium Yearly' : 'Premium Monthly' }));
    setSheetOpen(false);
    navigation.navigate('SetupCompleteScreen');
  };

  return (
    <View style={styles.root}>
      {/* Header photo that fades into the page */}
      <Image source={images.welcome} resizeMode="cover" style={styles.hero} />
      <LinearGradient
        colors={['rgba(0,0,0,0.2)', 'rgba(11,11,12,0.7)', '#0B0B0C']}
        style={styles.heroFade}
        pointerEvents="none"
      />

      <DmvScreen
        bgColor="transparent"
        gutter={20}
        topPad={12}
        footer={
          <DmvButton
            title="Start 1-Month Free Trial"
            variant="primary"
            onPress={() => setSheetOpen(true)}
          />
        }
        footerStyle={styles.footer}
        header={
          <View style={styles.closeRow}>
            <Pressable
              onPress={() => navigation.navigate('MainTabs', { screen: 'TodayTab' })}
              hitSlop={8}
              style={styles.close}
            >
              <Icon name="x" size={Sizer.fS(16)} color={COLORS.muted} />
            </Pressable>
          </View>
        }
      >
        {/* <h1> keeps Inter here, but still inherits the uppercase base rule */}
        <Typography size={26} fFamily="bodyBold700" textTransform="uppercase" lineHeight={29} letterSpacing={-0.65}>
          Say hello to
        </Typography>
        <Typography
          size={26}
          fFamily="bodyBold700"
          color={COLORS.primary}
          textTransform="uppercase"
          lineHeight={29}
          letterSpacing={-0.65}
          mB={6}
        >
          your best self.
        </Typography>
        <Typography size={12.5} color={COLORS.muted} lineHeight={18} mB={20}>
          Members are up to 65% more likely to reach their goals with Premium.
        </Typography>

        <View style={styles.features}>
          {FEATURES.map(f => (
            <View key={f.title} style={styles.feature}>
              <View style={styles.crownDot}>
                <CrownIcon size={14} color={COLORS.warning} />
              </View>
              <Typography size={13} fFamily="bodySemiBold600" flex={1} lineHeight={18}>
                {f.title}
                <Typography size={13} color={COLORS.muted}>
                  {f.body}
                </Typography>
              </Typography>
            </View>
          ))}
        </View>

        <Typography size={12} fFamily="bodySemiBold600" color={COLORS.muted} textAlign="center" mB={12}>
          Select a plan for your free trial
        </Typography>

        <View style={styles.plans}>
          <PlanCard
            label="Yearly"
            price="$68.98"
            unit="/YR"
            strike="$179.76/YR"
            badge="62% SAVINGS"
            footnote="Billed yearly after free trial."
            selected={billingCycle === 'yearly'}
            onPress={() => setBillingCycle('yearly')}
          />
          <PlanCard
            label="Monthly"
            price="$14.98"
            unit="/MO"
            footnote="Billed monthly after free trial."
            selected={billingCycle === 'monthly'}
            onPress={() => setBillingCycle('monthly')}
          />
        </View>

        <Typography size={11} color={COLORS.faint} textAlign="center" mT={12}>
          Change plans or cancel anytime.
        </Typography>
      </DmvScreen>

      <AppleSheet
        visible={sheetOpen}
        priceLine={billingCycle === 'yearly' ? '$68.98 per year' : '$14.98 per month'}
        onClose={() => setSheetOpen(false)}
        onConfirm={confirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0B0C' },
  // mock: opacity-40 filter brightness(0.9) contrast(1.1)
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Sizer.vSize(256),
    opacity: 0.4,
    filter: [{ brightness: 0.9 }, { contrast: 1.1 }],
  },
  heroFade: { position: 'absolute', top: 0, left: 0, right: 0, height: Sizer.vSize(256) },
  footer: { paddingTop: Sizer.vSize(8) },

  closeRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: Sizer.vSize(8) },
  close: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(31,31,35,0.8)',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },

  features: { gap: Sizer.vSize(14), marginBottom: Sizer.vSize(24) },
  feature: { flexDirection: 'row', alignItems: 'flex-start', gap: Sizer.hSize(12) },
  crownDot: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,176,32,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  plans: { flexDirection: 'row', gap: Sizer.hSize(12) },
  plan: {
    flex: 1,
    borderRadius: 16,
    padding: Sizer.hSize(14),
    justifyContent: 'space-between',
    minHeight: Sizer.vSize(118),
  },
  planOn: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  planOff: { backgroundColor: 'rgba(24,24,27,0.7)', borderWidth: 1, borderColor: COLORS.hairline },
  badge: {
    position: 'absolute',
    top: -10,
    left: 12,
    paddingHorizontal: Sizer.hSize(8),
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  planHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizer.vSize(8) },
  radio: { width: 16, height: 16, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center' },
  radioOn: { backgroundColor: COLORS.success },
  radioOff: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: Sizer.hSize(6) },
  strike: { textDecorationLine: 'line-through' },
  planFoot: {
    marginTop: Sizer.vSize(8),
    paddingTop: Sizer.vSize(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },

  scrim: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.65)', padding: 8 },
  scrimFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheet: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: Sizer.hSize(20),
  },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizer.vSize(16) },
  sheetClose: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    paddingBottom: Sizer.vSize(16),
    marginBottom: Sizer.vSize(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sheetLogo: { width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.black, padding: 4 },
  sheetProductText: { flex: 1, minWidth: 0 },
  sheetTerms: { gap: 2, marginBottom: Sizer.vSize(16) },
  subscribe: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { transform: [{ scale: 0.97 }] },
});

export default ChoosePlanScreen;
