import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { Typography } from '../../atomComponents';
import { DmvScreen, SetupStepHeader, DmvSelectCard, DmvButton } from '../../components';
import { selectTranslate, selectUser, updateUser } from '../../redux/slices/appSlice';

const ACTIVITIES = [
  { title: 'Sedentary', example: 'Desk job, little walking' },
  { title: 'Lightly active', example: 'On your feet some of the day' },
  { title: 'Moderately active', example: 'Training 3–4 days a week' },
  { title: 'Very active', example: 'Training 5–6 days a week' },
  { title: 'Athlete', example: 'Twice a day, most days' },
];

/** Screen 11 · Activity Level (Step 3 of 5) */
const ActivityScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const t = useSelector(selectTranslate);
  const user = useSelector(selectUser);
  const [selected, setSelected] = useState(user.activityLevel || 'Moderately active');

  const handleNext = () => {
    dispatch(updateUser({ activityLevel: selected }));
    navigation.navigate('TargetPaceScreen');
  };

  return (
    <DmvScreen footer={<DmvButton title="Next" variant="primary" onPress={handleNext} />}>
      <SetupStepHeader step={3} onBack={() => navigation.goBack()} />

      <Typography
        size={21}
        fFamily="displaySemiBold600"
        textTransform="uppercase"
        letterSpacing={0.84}
        lineHeight={22}
      >
        {t('HOW ACTIVE ARE YOU?')}
      </Typography>
      <Typography size={11.5} color={COLORS.muted} lineHeight={18} mT={6} mB={16}>
        Count everything outside the gym too — work, walking, chasing kids.
      </Typography>

      <View style={styles.list}>
        {ACTIVITIES.map(a => (
          <DmvSelectCard
            key={a.title}
            title={a.title}
            subtitle={a.example}
            selected={selected === a.title}
            onPress={() => setSelected(a.title)}
          />
        ))}
      </View>
    </DmvScreen>
  );
};

const styles = StyleSheet.create({ list: { gap: Sizer.vSize(10) } });

export default ActivityScreen;
