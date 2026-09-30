import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { DmvScreen, RoundBackButton, DmvButton, DmvToggle } from '../../components';
import {
  selectDayTargets,
  selectHasCustomDayTargets,
  selectTranslate,
  setHasCustomDayTargets,
} from '../../redux/slices/appSlice';
import { formatNumber } from '../../utils';

/** Screen 14 · Targets by Day */
const TargetsByDayScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const t = useSelector(selectTranslate);
  const dayTargets = useSelector(selectDayTargets);
  const hasCustom = useSelector(selectHasCustomDayTargets);

  const weeklyTotal = dayTargets.reduce((acc, d) => acc + d.calories, 0);

  return (
    <DmvScreen
      footer={
        <DmvButton
          title="Continue to billing"
          variant="primary"
          onPress={() => navigation.navigate('ChoosePlanScreen')}
        />
      }
    >
      <View style={styles.nav}>
        <RoundBackButton onPress={() => navigation.goBack()} />
        <Typography
          size={12}
          fFamily="displayBold700"
          color={COLORS.muted}
          textTransform="uppercase"
          letterSpacing={1.92}
        >
          TARGETS BY DAY
        </Typography>
        <View style={styles.spacer} />
      </View>

      <Typography
        size={21}
        fFamily="displaySemiBold600"
        textTransform="uppercase"
        letterSpacing={0.84}
        lineHeight={22}
      >
        {t('NOT EVERY DAY IS THE SAME')}
      </Typography>
      <Typography size={11.5} color={COLORS.muted} lineHeight={18} mT={6} mB={16}>
        Eat more on training days, less on rest days. Same weekly total.
      </Typography>

      <View style={styles.masterCard}>
        <View style={styles.masterText}>
          <Typography size={13.5} fFamily="bodySemiBold600">
            Different targets per day
          </Typography>
          <Typography size={11} color={COLORS.muted} mT={2}>
            Off means 2,000 kcal every day
          </Typography>
        </View>
        <DmvToggle value={hasCustom} onPress={() => dispatch(setHasCustomDayTargets(!hasCustom))} />
      </View>

      <View style={styles.rows}>
        {dayTargets.map(d => (
          <View key={d.day} style={styles.row}>
            <View style={styles.rowLeft}>
              <Typography size={14} fFamily="displaySemiBold600" style={styles.dayShort}>
                {d.dayShort}
              </Typography>
              <View style={[styles.typeChip, d.type === 'Training' ? styles.chipTraining : styles.chipRest]}>
                <Typography
                  size={10}
                  fFamily="bodySemiBold600"
                  color={d.type === 'Training' ? COLORS.primarySoft : COLORS.muted}
                >
                  {d.type}
                </Typography>
              </View>
            </View>

            <View style={styles.rowRight}>
              <Typography size={14} fFamily="monoSemiBold600">
                {`${hasCustom ? formatNumber(d.calories) : '2,000'} kcal`}
              </Typography>
              <Icon name="chevron-right" size={Sizer.fS(16)} color={COLORS.faint} />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.totalRow}>
        <Typography size={11} color={COLORS.muted}>
          Weekly Total:{' '}
        </Typography>
        <Typography size={11} fFamily="monoSemiBold600">
          {`${hasCustom ? formatNumber(weeklyTotal) : '14,000'} kcal`}
        </Typography>
      </View>
    </DmvScreen>
  );
};

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(16),
  },
  spacer: { width: 36 },
  masterCard: {
    borderRadius: 12,
    padding: Sizer.hSize(14),
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(16),
  },
  masterText: { flex: 1, minWidth: 0 },
  rows: { gap: Sizer.vSize(6) },
  row: {
    borderRadius: 11,
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(10),
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(232,232,236,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(10) },
  dayShort: { width: Sizer.hSize(36) },
  typeChip: { paddingHorizontal: Sizer.hSize(8), paddingVertical: 2, borderRadius: 9999, borderWidth: 1 },
  chipTraining: { backgroundColor: 'rgba(141,34,255,0.2)', borderColor: 'rgba(141,34,255,0.3)' },
  chipRest: { backgroundColor: COLORS.raised, borderColor: 'transparent' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8) },
  totalRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Sizer.vSize(12) },
});

export default TargetsByDayScreen;
