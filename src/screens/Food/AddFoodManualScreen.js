import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { DmvScreen, RoundBackButton, DmvButton, DmvInput } from '../../components';
import { TABBAR_CLEARANCE } from '../../constants';
import { addFoodToMeal, showToast } from '../../redux/slices/appSlice';
import { firstError, manualFoodRules } from '../../validations';

/** Screen 23 · Add Food Manual */
const AddFoodManualScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [serving, setServing] = useState('100');
  const [unit, setUnit] = useState('grams');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [shareCommunity] = useState(true);

  const num = v => parseFloat(v) || 0;
  const calNum = num(calories);
  const calcSum = Math.round(num(protein) * 4 + num(carbs) * 4 + num(fat) * 9);
  const hasWarning = calNum > 0 && Math.abs(calNum - calcSum) > 40;

  const handleSave = () => {
    const invalid = firstError(manualFoodRules, { name, calories: calNum });
    if (invalid) {
      dispatch(showToast(invalid));
      return;
    }
    dispatch(
      addFoodToMeal({
        name: name || 'Custom food',
        serving: `${serving} ${unit}`,
        source: shareCommunity ? 'Community (Pending)' : 'My Foods',
        verified: false,
        calories: calNum || calcSum,
        protein: num(protein),
        carbs: num(carbs),
        fat: num(fat),
        mealType: 'lunch',
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
          ADD YOUR OWN FOOD
        </Typography>
        <View style={styles.spacer} />
      </View>

      <Typography size={12} color={COLORS.muted} lineHeight={18} mB={16}>
        For homemade food and anything without a barcode.
      </Typography>

      <View style={styles.form}>
        <DmvInput label="FOOD NAME" value={name} onChangeText={setName} placeholder="e.g. Chicken Biryani, homemade" />

        <View style={styles.row}>
          <DmvInput label="SERVING" value={serving} onChangeText={setServing} placeholder="400" style={styles.half} />
          <DmvInput label="UNIT" value={unit} onChangeText={setUnit} placeholder="grams" style={styles.half} />
        </View>

        <Typography
          size={11}
          fFamily="displayBold700"
          color={COLORS.muted}
          textTransform="uppercase"
          letterSpacing={1.54}
          mT={4}
        >
          MACROS FOR ONE SERVING
        </Typography>

        <View style={styles.row}>
          <DmvInput
            label="CALORIES"
            value={calories}
            onChangeText={setCalories}
            placeholder="620"
            keyboardType="decimal-pad"
            style={styles.half}
          />
          <DmvInput
            label="PROTEIN (G)"
            value={protein}
            onChangeText={setProtein}
            placeholder="34"
            keyboardType="decimal-pad"
            style={styles.half}
          />
        </View>

        <View style={styles.row}>
          <DmvInput
            label="CARBS (G)"
            value={carbs}
            onChangeText={setCarbs}
            placeholder="74"
            keyboardType="decimal-pad"
            style={styles.half}
          />
          <DmvInput
            label="FAT (G)"
            value={fat}
            onChangeText={setFat}
            placeholder="20"
            keyboardType="decimal-pad"
            style={styles.half}
          />
        </View>

        {hasWarning ? (
          <View style={styles.warning}>
            <Icon name="triangle-alert" size={Sizer.fS(16)} color={COLORS.warning} style={styles.warnIcon} />
            <Typography size={11.5} color={COLORS.warning} flex={1}>
              {`Macros calculate to ${calcSum} kcal, which differs from ${calNum} kcal.`}
            </Typography>
          </View>
        ) : null}
      </View>

      {/* The mock keeps Save Food in the content flow under the macro grid. */}
      <View style={styles.cta}>
        <DmvButton title="Save Food" variant="primary" onPress={handleSave} />
      </View>
    </DmvScreen>
  );
};

const styles = StyleSheet.create({
  cta: { marginTop: Sizer.vSize(16) },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizer.vSize(12) },
  spacer: { width: 36 },
  form: { gap: Sizer.vSize(12) },
  row: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(10) },
  half: { flex: 1, width: 'auto' },
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(8),
    borderRadius: 14,
    padding: Sizer.hSize(12),
    backgroundColor: 'rgba(255,176,32,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,176,32,0.4)',
  },
  warnIcon: { marginTop: 2 },
});

export default AddFoodManualScreen;
