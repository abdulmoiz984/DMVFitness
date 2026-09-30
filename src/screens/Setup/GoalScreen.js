import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { DmvScreen, SetupStepHeader, DmvSelectCard, DmvButton } from '../../components';
import { selectTranslate, selectUser, updateUser } from '../../redux/slices/appSlice';

const GOALS = [
  { id: 'Lose fat', label: 'Lose fat', icon: 'trending-down' },
  { id: 'Build muscle', label: 'Build muscle', icon: 'zap' },
  { id: 'Recomposition', label: 'Recomposition', icon: 'arrow-left-right' },
  { id: 'Get stronger', label: 'Get stronger', icon: 'trophy' },
  { id: 'General health', label: 'General health', icon: 'heart-pulse' },
];

/** Screen 09 · Goal (Step 1 of 5) */
const GoalScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const t = useSelector(selectTranslate);
  const user = useSelector(selectUser);
  const [selectedGoal, setSelectedGoal] = useState(user.goalType || 'Lose fat');

  const handleNext = () => {
    dispatch(updateUser({ goalType: selectedGoal }));
    navigation.navigate('AboutYouScreen');
  };

  return (
    <DmvScreen footer={<DmvButton title="Next" variant="primary" onPress={handleNext} />}>
      <SetupStepHeader step={1} onBack={() => navigation.goBack()} />

      <Typography
        size={21}
        fFamily="displaySemiBold600"
        textTransform="uppercase"
        letterSpacing={0.84}
        lineHeight={22}
      >
        {t('WHAT ARE YOU HERE FOR?')}
      </Typography>
      <Typography size={11.5} color={COLORS.muted} lineHeight={18} mT={6} mB={20}>
        This sets your calorie direction. You can change it any time.
      </Typography>

      <View style={styles.list}>
        {GOALS.map(g => (
          <DmvSelectCard
            key={g.id}
            title={g.label}
            icon={
              <Icon
                name={g.icon}
                size={Sizer.fS(20)}
                color={selectedGoal === g.id ? COLORS.primarySoft : COLORS.muted}
              />
            }
            selected={selectedGoal === g.id}
            onPress={() => setSelectedGoal(g.id)}
          />
        ))}
      </View>
    </DmvScreen>
  );
};

const styles = StyleSheet.create({ list: { gap: Sizer.vSize(10) } });

export default GoalScreen;
