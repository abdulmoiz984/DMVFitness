import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { Typography } from '../../atomComponents';
import {
  DmvScreen,
  RoundBackButton,
  DmvButton,
  DmvInput,
  DmvChip,
  FoodThumbnail,
} from '../../components';
import { TABBAR_CLEARANCE } from '../../constants';
import { addFoodToMeal } from '../../redux/slices/appSlice';

const MacroCell = ({ label, value }) => (
  <View style={styles.macroCell}>
    <Typography size={9.5} fFamily="bodyBold700" color={COLORS.muted} textAlign="center">
      {label}
    </Typography>
    <Typography size={14} fFamily="monoBold700" color={COLORS.white} textAlign="center">
      {`${value}g`}
    </Typography>
  </View>
);

/** Screen 22 · Food Detail */
const FoodDetailScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('200');
  const [unit, setUnit] = useState('grams');
  const [selectedMeal] = useState('lunch');

  // The mock recalculates against a 100g base of grilled chicken breast.
  const factor = (parseFloat(amount) || 100) / 100;
  const cals = Math.round(165 * factor);
  const protein = (31 * factor).toFixed(1);
  const carbs = (0 * factor).toFixed(1);
  const fat = (3.6 * factor).toFixed(1);

  const handleAdd = () => {
    dispatch(
      addFoodToMeal({
        name: 'Chicken Breast, grilled',
        serving: `${amount} ${unit}`,
        source: 'Generic · 100g base',
        verified: true,
        calories: cals,
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fat: parseFloat(fat),
        mealType: selectedMeal,
      }),
    );
    navigation.navigate('MainTabs', { screen: 'DiaryTab' });
  };

  return (
    <DmvScreen
      bgColor="#0B0B0D"
      topPad={12}
      bottomPad={TABBAR_CLEARANCE}
    >
      <View style={styles.nav}>
        <RoundBackButton onPress={() => navigation.goBack()} />
        <Typography
          size={13}
          fFamily="displayBold700"
          color={COLORS.muted}
          textTransform="uppercase"
          letterSpacing={1.82}
        >
          FOOD DETAIL
        </Typography>
        <View style={styles.spacer} />
      </View>

      <View style={styles.hero}>
        <LinearGradient
          colors={['#27272A', '#18181B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.absFill}
        />
        <FoodThumbnail name="chicken" size={72} />
      </View>

      <View style={styles.chips}>
        <DmvChip variant="success" label="✓ Verified" />
        <DmvChip variant="neutral" label="Generic" />
      </View>

      <Typography
        size={24}
        fFamily="displayBold700"
        color={COLORS.white}
        textTransform="uppercase"
        letterSpacing={0.6}
        lineHeight={28}
        mB={12}
      >
        Chicken Breast, grilled
      </Typography>

      <View style={styles.twoUp}>
        <DmvInput label="AMOUNT" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" style={styles.half} />
        <DmvInput label="UNIT" value={unit} onChangeText={setUnit} style={styles.half} />
      </View>

      <View style={styles.readout}>
        <View style={styles.readoutHead}>
          <Typography size={11} fFamily="bodyBold700" color={COLORS.muted} textTransform="uppercase" letterSpacing={0.28}>
            CALORIES
          </Typography>
          <Typography size={24} fFamily="monoBold700" color={COLORS.white}>
            {String(cals)}
            <Typography size={12} fFamily="bodyBold700" color={COLORS.muted}>
              {' kcal'}
            </Typography>
          </Typography>
        </View>

        <View style={styles.macroRow}>
          <MacroCell label="PROTEIN" value={protein} />
          <MacroCell label="CARBS" value={carbs} />
          <MacroCell label="FAT" value={fat} />
        </View>
      </View>

      {/* The mock keeps this button in the content flow, right under the macro
          card, rather than pinned to the bottom of the screen. */}
      <View style={styles.cta}>
        <DmvButton title={`Add to ${selectedMeal} · ${cals} kcal`} variant="primary" onPress={handleAdd} />
      </View>
    </DmvScreen>
  );
};

const styles = StyleSheet.create({
  cta: { marginTop: Sizer.vSize(16) },
  absFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizer.vSize(12) },
  spacer: { width: 36 },
  hero: {
    width: '100%',
    height: Sizer.vSize(110),
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: Sizer.vSize(12),
  },
  chips: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8), marginBottom: Sizer.vSize(8) },
  twoUp: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(10), marginBottom: Sizer.vSize(12) },
  half: { flex: 1, width: 'auto' },
  readout: {
    borderRadius: 18,
    padding: Sizer.hSize(16),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  readoutHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(8),
  },
  macroRow: {
    flexDirection: 'row',
    gap: Sizer.hSize(8),
    paddingTop: Sizer.vSize(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  macroCell: { flex: 1, backgroundColor: COLORS.surface, padding: Sizer.hSize(8), borderRadius: 12 },
});

export default FoodDetailScreen;
