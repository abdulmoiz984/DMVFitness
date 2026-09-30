import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Svg, { Circle, Path } from 'react-native-svg';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import {
  DmvScreen,
  SetupStepHeader,
  DmvButton,
  DmvSegmentedControl,
  StepperButton,
} from '../../components';
import { selectUser, updateUser } from '../../redux/slices/appSlice';

const AGE_LIST = [28, 29, 30, 31, 32, 33, 34, 35, 36];
const WEIGHT_LBS_LIST = [181, 182, 183, 184, 185, 186, 187];
const WEIGHT_KG_LIST = [81, 82, 83, 84, 85, 86, 87];
const CM_LIST = [162, 164, 166, 168, 170, 172, 174];
const FEET_LIST = [
  { ft: 5, inch: 2, label: "5'2\"" },
  { ft: 5, inch: 3, label: "5'3\"" },
  { ft: 5, inch: 4, label: "5'4\"" },
  { ft: 5, inch: 5, label: "5'5\"" },
  { ft: 5, inch: 6, label: "5'6\"" },
  { ft: 5, inch: 7, label: "5'7\"" },
  { ft: 5, inch: 8, label: "5'8\"" },
  { ft: 5, inch: 9, label: "5'9\"" },
  { ft: 5, inch: 10, label: "5'10\"" },
];

const PrivacyNote = () => (
  <View style={styles.privacy}>
    <Icon name="shield-check" size={Sizer.fS(16)} color={COLORS.primarySoft} style={styles.privacyIcon} />
    <Typography size={11.5} lineHeight={18} flex={1}>
      Private to you. Coaches see it only if you are on a coached plan.
    </Typography>
  </View>
);

/**
 * The mock prints the ♂ / ♀ characters at 36px bold, but neither Inter nor
 * Barlow ships those code points, so they are drawn as SVG instead.
 */
const GenderGlyph = ({ sex, color }) => {
  const size = Sizer.fS(38);
  return (
    <Svg width={size} height={size} viewBox="0 0 38 38">
      {sex === 'Male' ? (
        <>
          <Circle cx="15" cy="23" r="9" stroke={color} strokeWidth="3.2" fill="none" />
          <Path d="M22 16 L31 7" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
          <Path d="M24 7 H31 V14" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      ) : (
        <>
          <Circle cx="19" cy="14" r="9" stroke={color} strokeWidth="3.2" fill="none" />
          <Path d="M19 23 V34" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
          <Path d="M13 29 H25" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
};

/** The violet triangle that points at the selected ruler value. */
const Pointer = () => <View style={styles.pointer} />;

/**
 * Screen 10 · About You (Step 2 of 5).
 * Four sub-steps in one screen: gender, age wheel, weight ruler, height ruler.
 */
const AboutYouScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [subStep, setSubStep] = useState(0);
  const [gender, setGender] = useState(user.sex || 'Female');
  const [age, setAge] = useState(32);

  const [weightLbs, setWeightLbs] = useState(184);
  const [weightKg, setWeightKg] = useState(83.5);
  const [weightUnit, setWeightUnit] = useState('Imperial');

  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(6);
  const [heightCm, setHeightCm] = useState(168);
  const [heightUnit, setHeightUnit] = useState('Feet');

  const handleContinue = () => {
    if (subStep < 3) {
      setSubStep(subStep + 1);
      return;
    }
    dispatch(
      updateUser({
        sex: gender,
        dob: `${age} years old`,
        weight: weightUnit === 'Imperial' ? weightLbs : Math.round(weightKg * 2.20462),
        height: heightUnit === 'Feet' ? `${heightFeet} ft ${heightInches} in` : `${heightCm} cm`,
      }),
    );
    navigation.navigate('ActivityScreen');
  };

  const handleBack = () => (subStep > 0 ? setSubStep(subStep - 1) : navigation.goBack());

  const nudgeWeight = delta => {
    if (weightUnit === 'Imperial') setWeightLbs(Math.max(80, weightLbs + delta));
    else setWeightKg(Math.max(35, Number((weightKg + delta * 0.5).toFixed(1))));
  };

  const nudgeHeight = delta => {
    if (heightUnit !== 'Feet') {
      setHeightCm(Math.max(120, heightCm + delta));
      return;
    }
    if (delta < 0) {
      if (heightInches > 0) setHeightInches(heightInches - 1);
      else if (heightFeet > 4) {
        setHeightFeet(heightFeet - 1);
        setHeightInches(11);
      }
    } else if (heightInches < 11) setHeightInches(heightInches + 1);
    else if (heightFeet < 7) {
      setHeightFeet(heightFeet + 1);
      setHeightInches(0);
    }
  };

  return (
    <DmvScreen
      bgColor={COLORS.tabbarBg}
      gutter={20}
      footer={
        <View style={styles.actions}>
          {subStep > 0 ? (
            <Pressable
              onPress={handleBack}
              style={({ pressed }) => [styles.backBtn, pressed && styles.backPressed]}
            >
              <Typography size={14} fFamily="bodySemiBold600" color={COLORS.white}>
                Back
              </Typography>
            </Pressable>
          ) : null}
          <View style={styles.grow}>
            <DmvButton title="Continue" variant="primary" onPress={handleContinue} />
          </View>
        </View>
      }
    >
      <SetupStepHeader step={2} onBack={handleBack} />

      {subStep === 0 ? (
        <View>
          <Typography size={26} fFamily="displayBold700" color={COLORS.white} textTransform="uppercase" letterSpacing={-0.65} lineHeight={29} mB={8}>
            Tell Us About Yourself
          </Typography>
          <Typography size={12.5} color={COLORS.muted} lineHeight={20} mB={32}>
            To give you a better experience and results we need to know your gender.
          </Typography>

          <View style={styles.genderWrap}>
            {['Male', 'Female'].map(id => {
              const on = gender === id;
              return (
                <Pressable
                  key={id}
                  onPress={() => setGender(id)}
                  style={[styles.genderCircle, on ? styles.genderOn : styles.genderOff]}
                >
                  <GenderGlyph sex={id} color={on ? COLORS.white : COLORS.muted} />
                  <Typography size={15} fFamily="bodyBold700" color={on ? COLORS.white : COLORS.muted} letterSpacing={0.38}>
                    {id}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      {subStep === 1 ? (
        <View>
          <Typography size={26} fFamily="displayBold700" color={COLORS.white} textTransform="uppercase" letterSpacing={-0.65} lineHeight={29} mB={8}>
            How Old Are You?
          </Typography>
          <Typography size={12.5} color={COLORS.muted} lineHeight={20} mB={24}>
            Age in years. This will help us to personalize an exercise program plan that suits you.
          </Typography>

          <View style={styles.wheel}>
            {AGE_LIST.map(val => {
              const distance = Math.abs(val - age);
              const selected = val === age;
              const size = selected ? 36 : distance === 1 ? 26 : distance === 2 ? 20 : 16;
              const color = selected
                ? COLORS.primary
                : distance === 1
                ? 'rgba(255,255,255,0.7)'
                : distance === 2
                ? 'rgba(255,255,255,0.35)'
                : 'rgba(255,255,255,0.15)';
              const family = selected ? 'monoBold700' : distance === 1 ? 'monoSemiBold600' : 'monoMedium500';
              return (
                <Pressable key={val} onPress={() => setAge(val)} style={[styles.wheelItem, selected && styles.picked]}>
                  {selected ? <View style={[styles.wheelRule, styles.wheelRuleTop]} /> : null}
                  <Typography size={size} fFamily={family} color={color} lineHeight={size * 1.15}>
                    {String(val)}
                  </Typography>
                  {selected ? <View style={[styles.wheelRule, styles.wheelRuleBottom]} /> : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      {subStep === 2 ? (
        <View>
          <Typography size={26} fFamily="displayBold700" color={COLORS.white} textTransform="uppercase" letterSpacing={-0.65} lineHeight={29} mB={6}>
            What is Your Weight?
          </Typography>
          <Typography size={12.5} color={COLORS.muted} lineHeight={20} mB={16}>
            {`Weight in ${weightUnit === 'Imperial' ? 'lbs' : 'kg'}. Don't worry, you can always change it later.`}
          </Typography>

          <View style={styles.segWrap}>
            <DmvSegmentedControl
              options={[
                { label: 'Imperial (lbs)', value: 'Imperial' },
                { label: 'Metric (kg)', value: 'Metric' },
              ]}
              value={weightUnit}
              onChange={setWeightUnit}
              style={styles.seg}
            />
          </View>

          <View style={styles.ruler}>
            <View style={styles.rulerRow}>
              {(weightUnit === 'Imperial' ? WEIGHT_LBS_LIST : WEIGHT_KG_LIST).map(val => {
                const current = weightUnit === 'Imperial' ? weightLbs : weightKg;
                const on = Math.round(current) === val;
                return (
                  <Pressable
                    key={val}
                    onPress={() => (weightUnit === 'Imperial' ? setWeightLbs(val) : setWeightKg(val))}
                    style={on && styles.picked}
                  >
                    <Typography
                      size={on ? 36 : 22}
                      fFamily={on ? 'monoBold700' : 'monoSemiBold600'}
                      color={on ? COLORS.primary : COLORS.faint}
                      lineHeight={on ? 42 : 26}
                    >
                      {String(val)}
                    </Typography>
                  </Pressable>
                );
              })}
            </View>

            <Pointer />

            <View style={styles.nudgeRow}>
              <StepperButton sign="−" size={32} radius={RADIUS.full} onPress={() => nudgeWeight(-1)} />
              <Typography size={14} fFamily="monoBold700" color={COLORS.white}>
                {weightUnit === 'Imperial' ? `${weightLbs} lbs` : `${weightKg} kg`}
              </Typography>
              <StepperButton sign="+" size={32} radius={RADIUS.full} onPress={() => nudgeWeight(1)} />
            </View>
          </View>

          <PrivacyNote />
        </View>
      ) : null}

      {subStep === 3 ? (
        <View>
          <Typography size={26} fFamily="displayBold700" color={COLORS.white} textTransform="uppercase" letterSpacing={-0.65} lineHeight={29} mB={6}>
            What is Your Height?
          </Typography>
          <Typography size={12.5} color={COLORS.muted} lineHeight={20} mB={16}>
            {`Height in ${heightUnit === 'Feet' ? 'feet & inches' : 'centimeters'}. Don't worry, you can change it later.`}
          </Typography>

          <View style={styles.segWrap}>
            <DmvSegmentedControl
              options={[
                { label: 'Feet & Inches', value: 'Feet' },
                { label: 'Centimeters (cm)', value: 'Metric' },
              ]}
              value={heightUnit}
              onChange={setHeightUnit}
              style={styles.seg}
            />
          </View>

          <View style={styles.ruler}>
            <View style={[styles.rulerRow, styles.rulerRowTight]}>
              {heightUnit === 'Feet'
                ? FEET_LIST.map(item => {
                    const on = heightFeet === item.ft && heightInches === item.inch;
                    return (
                      <Pressable
                        key={item.label}
                        onPress={() => {
                          setHeightFeet(item.ft);
                          setHeightInches(item.inch);
                        }}
                        style={on && styles.picked}
                      >
                        <Typography
                          size={on ? 34 : 20}
                          fFamily={on ? 'monoBold700' : 'monoSemiBold600'}
                          color={on ? COLORS.primary : COLORS.faint}
                          lineHeight={on ? 40 : 24}
                          numberOfLines={1}
                        >
                          {item.label}
                        </Typography>
                      </Pressable>
                    );
                  })
                : CM_LIST.map(val => {
                    const on = heightCm === val;
                    return (
                      <Pressable key={val} onPress={() => setHeightCm(val)} style={on && styles.picked}>
                        <Typography
                          size={on ? 34 : 20}
                          fFamily={on ? 'monoBold700' : 'monoSemiBold600'}
                          color={on ? COLORS.primary : COLORS.faint}
                          lineHeight={on ? 40 : 24}
                        >
                          {String(val)}
                        </Typography>
                      </Pressable>
                    );
                  })}
            </View>

            <Pointer />

            <View style={styles.nudgeRow}>
              <StepperButton sign="−" size={32} radius={RADIUS.full} onPress={() => nudgeHeight(-1)} />
              <Typography size={14} fFamily="monoBold700" color={COLORS.white}>
                {heightUnit === 'Feet' ? `${heightFeet} ft ${heightInches} in` : `${heightCm} cm`}
              </Typography>
              <StepperButton sign="+" size={32} radius={RADIUS.full} onPress={() => nudgeHeight(1)} />
            </View>
          </View>

          <PrivacyNote />
        </View>
      ) : null}
    </DmvScreen>
  );
};

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12) },
  // The mock's two buttons are both `flex-1`, but CSS resolves their 0
  // flex-basis against the content box, so each also keeps its own padding and
  // border on top of the equal share. Continue (px-5) therefore ends up wider
  // than Back (1px border): 183.5 to 145.5. The grow factors carry that ratio.
  grow: { flexGrow: 183.5, flexBasis: 0 },
  backBtn: {
    flexGrow: 145.5,
    flexBasis: 0,
    height: Sizer.vSize(50),
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPressed: { backgroundColor: '#27272A', transform: [{ scale: 0.95 }] },

  genderWrap: { alignItems: 'center', justifyContent: 'center', gap: Sizer.vSize(24), marginVertical: Sizer.vSize(16) },
  genderCircle: {
    width: Sizer.hSize(144),
    height: Sizer.hSize(144),
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.vSize(8),
  },
  genderOn: {
    backgroundColor: COLORS.primary,
    borderWidth: 4,
    borderColor: 'rgba(141,34,255,0.3)',
    transform: [{ scale: 1.05 }],
    shadowColor: COLORS.primary,
    shadowOpacity: 0.6,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  genderOff: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.hairline },

  wheel: { alignItems: 'center', justifyContent: 'center', paddingVertical: Sizer.vSize(16), marginVertical: Sizer.vSize(8) },
  wheelItem: { paddingVertical: Sizer.vSize(8), alignItems: 'center', justifyContent: 'center' },
  wheelRule: {
    position: 'absolute',
    left: -Sizer.hSize(24),
    right: -Sizer.hSize(24),
    height: 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  wheelRuleTop: { top: 0 },
  wheelRuleBottom: { bottom: 0 },

  segWrap: { alignItems: 'center', marginBottom: Sizer.vSize(24) },
  seg: { width: '100%', maxWidth: Sizer.hSize(280) },

  ruler: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Sizer.vSize(16),
    paddingVertical: Sizer.vSize(20),
    paddingHorizontal: Sizer.hSize(16),
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  rulerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(24),
    width: '100%',
    overflow: 'hidden',
  },
  rulerRowTight: { gap: Sizer.hSize(20) },
  // `scale-110` on whichever value is selected, in the wheel and both rulers.
  picked: { transform: [{ scale: 1.1 }] },
  pointer: {
    width: 0,
    height: 0,
    marginTop: Sizer.vSize(8),
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.primary,
  },
  nudgeRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(16), marginTop: Sizer.vSize(16) },

  privacy: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(10),
    borderRadius: 14,
    padding: Sizer.hSize(12),
    marginTop: Sizer.vSize(8),
    backgroundColor: 'rgba(141,34,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(141,34,255,0.3)',
  },
  privacyIcon: { marginTop: 2 },
});

export default AboutYouScreen;
