import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { DmvScreen, SetupStepHeader, DmvSelectCard, DmvButton, DmvInput } from '../../components';
import { selectTranslate, selectUser, updateUser } from '../../redux/slices/appSlice';

const PACES = [
  { id: 'Steady', title: 'Steady', rate: '0.5 lb / week', sub: 'Easiest to stick to' },
  { id: 'Recommended', title: 'Recommended', rate: '1.0 lb / week', sub: '31 weeks to your goal' },
  { id: 'Aggressive', title: 'Aggressive', rate: '1.5 lb / week', sub: 'Hard to hold past a month' },
];

/** Screen 12 · Target and Pace (Step 4 of 5) */
const TargetPaceScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const t = useSelector(selectTranslate);
  const user = useSelector(selectUser);
  const [currentWeight, setCurrentWeight] = useState(String(user.weight));
  const [goalWeight, setGoalWeight] = useState(String(user.goalWeight));
  const [selectedPace, setSelectedPace] = useState('Recommended');

  const handleNext = () => {
    dispatch(
      updateUser({
        weight: parseFloat(currentWeight) || 196.0,
        goalWeight: parseFloat(goalWeight) || 165.0,
        pace: PACES.find(p => p.id === selectedPace)?.rate ?? '1.0 lb / week',
      }),
    );
    navigation.navigate('MacroBuilderScreen');
  };

  return (
    <DmvScreen footer={<DmvButton title="Build my targets" variant="primary" onPress={handleNext} />}>
      <SetupStepHeader step={4} onBack={() => navigation.goBack()} />

      <Typography
        size={21}
        fFamily="displaySemiBold600"
        textTransform="uppercase"
        letterSpacing={0.84}
        lineHeight={22}
      >
        {t('WHERE ARE YOU HEADED?')}
      </Typography>

      <View style={styles.twoUp}>
        <DmvInput
          label="NOW"
          value={currentWeight}
          onChangeText={setCurrentWeight}
          placeholder="196.0 lb"
          keyboardType="decimal-pad"
          style={styles.half}
        />
        <DmvInput
          label="GOAL"
          value={goalWeight}
          onChangeText={setGoalWeight}
          placeholder="165.0 lb"
          keyboardType="decimal-pad"
          style={styles.half}
        />
      </View>

      <Typography
        size={10}
        fFamily="displaySemiBold600"
        color={COLORS.faint}
        textTransform="uppercase"
        letterSpacing={1.4}
        mB={8}
      >
        HOW FAST
      </Typography>

      <View style={styles.list}>
        {PACES.map(p => (
          <DmvSelectCard
            key={p.id}
            title={`${p.title} · ${p.rate}`}
            subtitle={p.sub}
            selected={selectedPace === p.id}
            onPress={() => setSelectedPace(p.id)}
          />
        ))}
      </View>

      <View style={styles.projection}>
        <Icon name="calendar" size={Sizer.fS(20)} color={COLORS.primary} style={styles.projIcon} />
        <Typography size={11.5} color={COLORS.muted} lineHeight={18} flex={1}>
          At 1.0 lb a week you would reach 165 lb around{' '}
          <Typography size={11.5} fFamily="bodySemiBold600">
            April 3, 2027
          </Typography>
          .
        </Typography>
      </View>
    </DmvScreen>
  );
};

const styles = StyleSheet.create({
  twoUp: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(10), marginVertical: Sizer.vSize(16) },
  half: { flex: 1, width: 'auto' },
  list: { gap: Sizer.vSize(10), marginBottom: Sizer.vSize(16) },
  projection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(12),
    borderRadius: 12,
    padding: Sizer.hSize(12),
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  projIcon: { marginTop: 2 },
});

export default TargetPaceScreen;
