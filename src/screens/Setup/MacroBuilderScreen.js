import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { Typography } from '../../atomComponents';
import { DmvScreen, SetupStepHeader, DmvButton, DmvMeter, StepperButton } from '../../components';
import {
  resetToCalculatedMacros,
  selectDailyTargets,
  selectHasMacroOverride,
  selectTranslate,
  updateMacros,
} from '../../redux/slices/appSlice';
import { formatNumber } from '../../utils';

/** One macro row: name, share of calories, −/+ stepper and its meter. */
const MacroCard = ({ label, grams, pct, note, fillColor, onStep }) => (
  <View style={styles.macro}>
    <View style={styles.macroTop}>
      <View style={styles.macroName}>
        <Typography size={14} fFamily="displaySemiBold600" textTransform="uppercase">
          {label}
        </Typography>
        <Typography size={11} color={COLORS.muted}>
          {`${pct}%`}
        </Typography>
      </View>
      <View style={styles.macroSteps}>
        <StepperButton sign="−" onPress={() => onStep(-5)} />
        <Typography size={15} fFamily="monoSemiBold600" textAlign="center" style={styles.gramValue}>
          {`${grams} g`}
        </Typography>
        <StepperButton sign="+" onPress={() => onStep(5)} />
      </View>
    </View>
    <Typography size={10.5} color={COLORS.muted}>
      {note}
    </Typography>
    <DmvMeter value={pct} max={100} fillColor={fillColor} />
  </View>
);

/** Screen 13 · Macro Builder (Step 5 of 5) */
const MacroBuilderScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const t = useSelector(selectTranslate);
  const dailyTargets = useSelector(selectDailyTargets);
  const hasMacroOverride = useSelector(selectHasMacroOverride);

  const [protein, setProtein] = useState(dailyTargets.protein);
  const [carbs, setCarbs] = useState(dailyTargets.carbs);
  const [fat, setFat] = useState(dailyTargets.fat);

  const commit = next => {
    setProtein(next.protein);
    setCarbs(next.carbs);
    setFat(next.fat);
    dispatch(updateMacros(next));
  };

  const totalCals = protein * 4 + carbs * 4 + fat * 9;
  const pct = grams => Math.round(((grams * 4) / totalCals) * 100);

  return (
    <DmvScreen
      footer={
        <View style={styles.actions}>
          <DmvButton
            title="Use these targets"
            variant="primary"
            onPress={() => navigation.navigate('TargetsByDayScreen')}
          />
          <DmvButton
            title="Set them myself"
            variant="quiet"
            onPress={() => navigation.navigate('TargetsByDayScreen')}
          />
        </View>
      }
      footerStyle={styles.footer}
    >
      <SetupStepHeader step={5} onBack={() => navigation.goBack()} />

      <Typography
        size={21}
        fFamily="displaySemiBold600"
        textTransform="uppercase"
        letterSpacing={0.84}
        lineHeight={22}
      >
        {t('YOUR DAILY TARGETS')}
      </Typography>
      <Typography size={11.5} color={COLORS.muted} lineHeight={18} mT={6} mB={14}>
        Built from your goal, body and activity. Tap any number to change it.
      </Typography>

      <View style={styles.hero}>
        <Typography size={32} fFamily="monoSemiBold600" lineHeight={32}>
          {formatNumber(totalCals)}
        </Typography>
        <Typography
          size={10}
          fFamily="displaySemiBold600"
          color={COLORS.faint}
          textTransform="uppercase"
          letterSpacing={1.4}
          mT={4}
        >
          CALORIES PER DAY
        </Typography>
        <Typography size={10.5} color={COLORS.faint} mT={4}>
          Maintenance 2,500 − 500 deficit
        </Typography>
      </View>

      <View style={styles.macros}>
        <MacroCard
          label="Protein"
          grams={protein}
          pct={pct(protein)}
          note="1.0 g per lb of goal weight"
          fillColor="#8D22FF"
          onStep={d => commit({ protein: Math.max(80, protein + d), carbs, fat })}
        />
        <MacroCard
          label="Carbohydrate"
          grams={carbs}
          pct={pct(carbs)}
          note="fuel for training days"
          fillColor="#B36BFF"
          onStep={d => commit({ protein, carbs: Math.max(50, carbs + d), fat })}
        />
        <MacroCard
          label="Fat"
          grams={fat}
          pct={Math.round(((fat * 9) / totalCals) * 100)}
          note="kept above the hormonal floor"
          fillColor="#3A3A42"
          onStep={d => commit({ protein, carbs, fat: Math.max(30, fat + d) })}
        />
      </View>

      {hasMacroOverride ? (
        <View style={styles.resetRow}>
          <Pressable
            hitSlop={8}
            onPress={() => {
              dispatch(resetToCalculatedMacros());
              setProtein(dailyTargets.protein);
              setCarbs(dailyTargets.carbs);
              setFat(dailyTargets.fat);
            }}
          >
            <Typography size={11.5} color={COLORS.primarySoft}>
              Reset to calculated
            </Typography>
          </Pressable>
        </View>
      ) : null}
    </DmvScreen>
  );
};

const styles = StyleSheet.create({
  footer: { paddingTop: Sizer.vSize(12) },
  actions: { gap: Sizer.vSize(8) },
  hero: {
    borderRadius: 14,
    padding: Sizer.hSize(14),
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.fgA12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizer.vSize(12),
  },
  macros: { gap: Sizer.vSize(8) },
  macro: {
    borderRadius: 12,
    padding: Sizer.hSize(12),
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.divider,
    gap: Sizer.vSize(6),
  },
  macroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  macroName: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8) },
  macroSteps: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(6) },
  gramValue: { width: Sizer.hSize(56) },
  resetRow: { alignItems: 'center', marginTop: Sizer.vSize(8) },
});

export default MacroBuilderScreen;
