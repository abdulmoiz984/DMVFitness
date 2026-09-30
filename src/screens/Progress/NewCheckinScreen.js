import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { DmvScreen, RoundBackButton, DmvInput } from '../../components';
import { TABBAR_CLEARANCE } from '../../constants';
import { images } from '../../assets/images';
import { addCheckin, showToast } from '../../redux/slices/appSlice';

const CaptureTile = ({ source, label }) => (
  <View style={styles.captureCol}>
    <View style={styles.capture}>
      <Image source={source} resizeMode="cover" style={styles.captureImg} />
      <View style={styles.retake}>
        <Typography size={9.5} fFamily="bodyBold700" color={COLORS.white} textAlign="center">
          Retake
        </Typography>
      </View>
    </View>
    <Typography size={11} fFamily="bodyBold700" color={COLORS.white} textTransform="uppercase">
      {label}
    </Typography>
  </View>
);

/** Screen 30 · New Check-in */
const NewCheckinScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [weight, setWeight] = useState('184.2');
  const [waist, setWaist] = useState('31.5');
  const [note, setNote] = useState('Shoulders finally look wider and leaner.');
  const [isPrivate, setIsPrivate] = useState(true);

  const handleSave = () => {
    dispatch(
      addCheckin({
        date: 'August 31, 2026',
        weightLbs: parseFloat(weight) || 184.2,
        waistInches: parseFloat(waist) || 31.5,
        note,
        isPrivate,
        frontPhoto: 'aug31-front',
        sidePhoto: 'aug31-side',
        backPhoto: 'aug31-back',
      }),
    );
    dispatch(showToast('Check-in saved successfully!'));
    navigation.navigate('CompareCheckinsScreen');
  };

  return (
    <DmvScreen
      bgColor="#0B0B0D"
      topPad={12}
      bottomPad={TABBAR_CLEARANCE}
      footer={
        <Pressable onPress={handleSave} style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
          <LinearGradient
            colors={['#8D22FF', '#A84DF0']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.absFill}
          />
          <Icon name="circle-check-big" size={Sizer.fS(20)} color={COLORS.white} />
          <Typography size={15} fFamily="bodyBold700" color={COLORS.white}>
            Save Check-in
          </Typography>
        </Pressable>
      }
      footerStyle={styles.footer}
    >
      <View style={styles.nav}>
        <RoundBackButton onPress={() => navigation.goBack()} style={styles.navBtn} />
        <Typography
          size={14}
          fFamily="displayBold700"
          color={COLORS.white}
          textTransform="uppercase"
          letterSpacing={1.96}
        >
          NEW CHECK-IN
        </Typography>
        <View style={styles.navSpacer} />
      </View>

      <Typography size={12} color={COLORS.muted} mB={16} lineHeight={18}>
        Take your photos in the same spot, lighting, and time of day for an honest comparison.
      </Typography>

      <View style={styles.captures}>
        <CaptureTile source={images.splash03_2} label="Front" />
        <CaptureTile source={images.splash03_1} label="Side" />

        <View style={styles.captureCol}>
          <Pressable style={styles.captureEmpty}>
            <Icon name="camera" size={Sizer.fS(24)} color={COLORS.primarySoft} />
            <Typography size={10} fFamily="bodyBold700" color={COLORS.muted} mT={4}>
              Tap to snap
            </Typography>
          </Pressable>
          <Typography size={11} fFamily="bodyBold700" color={COLORS.muted} textTransform="uppercase">
            Back
          </Typography>
        </View>
      </View>

      <View style={styles.form}>
        <DmvInput
          label="BODY WEIGHT (LBS)"
          value={weight}
          onChangeText={setWeight}
          placeholder="184.2 lbs"
          keyboardType="decimal-pad"
        />
        <DmvInput
          label="WAIST CIRCUMFERENCE (IN, OPTIONAL)"
          value={waist}
          onChangeText={setWaist}
          placeholder="31.5 in"
          keyboardType="decimal-pad"
        />
        <DmvInput
          label="PROGRESS NOTE (OPTIONAL)"
          value={note}
          onChangeText={setNote}
          placeholder="e.g. Delts are popping, feeling energetic."
        />

        <View style={styles.privacyCard}>
          <View style={styles.privacyLeft}>
            <Icon name="lock" size={Sizer.fS(20)} color={COLORS.primarySoft} style={styles.privacyIcon} />
            <View style={styles.flex}>
              <Typography size={13.5} fFamily="bodyBold700" color={COLORS.white}>
                Private to you
              </Typography>
              <Typography size={11} color={COLORS.muted}>
                Nobody sees these photos unless you choose to share
              </Typography>
            </View>
          </View>

          <Pressable
            onPress={() => setIsPrivate(p => !p)}
            hitSlop={6}
            style={[styles.toggle, { backgroundColor: isPrivate ? COLORS.primary : COLORS.raised }]}
          >
            <View style={[styles.knob, isPrivate && styles.knobOn]} />
          </Pressable>
        </View>
      </View>
    </DmvScreen>
  );
};

const styles = StyleSheet.create({
  absFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  flex: { flex: 1, minWidth: 0 },
  pressed: { transform: [{ scale: 0.98 }] },
  footer: { paddingTop: Sizer.vSize(24) },

  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizer.vSize(12) },
  navBtn: { width: 40, height: 40 },
  navSpacer: { width: 40 },

  captures: { flexDirection: 'row', gap: Sizer.hSize(10), marginBottom: Sizer.vSize(20) },
  captureCol: { flex: 1, alignItems: 'center', gap: Sizer.vSize(6) },
  capture: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  captureImg: { width: '100%', height: '100%' },
  retake: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  captureEmpty: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(141,34,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizer.hSize(8),
  },

  form: { gap: Sizer.vSize(14) },
  privacyCard: {
    borderRadius: 16,
    padding: Sizer.hSize(14),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Sizer.vSize(4),
    gap: Sizer.hSize(12),
  },
  privacyLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: Sizer.hSize(12), flex: 1, minWidth: 0 },
  privacyIcon: { marginTop: 2 },
  toggle: { width: 48, height: 28, borderRadius: RADIUS.full, paddingHorizontal: 4, justifyContent: 'center' },
  knob: { width: 20, height: 20, borderRadius: RADIUS.full, backgroundColor: COLORS.white },
  knobOn: { transform: [{ translateX: 20 }] },

  cta: {
    width: '100%',
    height: Sizer.vSize(52),
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(8),
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 11,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
});

export default NewCheckinScreen;
