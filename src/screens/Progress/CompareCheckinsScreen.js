import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { COLORS, RADIUS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { DmvScreen, RoundBackButton } from '../../components';
import { TABBAR_CLEARANCE } from '../../constants';
import { images } from '../../assets/images';
import { showToast } from '../../redux/slices/appSlice';

const ANGLES = ['Front', 'Side', 'Back'];

const DeltaCell = ({ value, label, tint = COLORS.success }) => (
  <View style={styles.deltaCell}>
    <Typography size={16} fFamily="monoBold700" color={tint} textAlign="center">
      {value}
    </Typography>
    <Typography
      size={10}
      fFamily="bodyBold700"
      color={COLORS.muted}
      textTransform="uppercase"
      textAlign="center"
      mT={2}
    >
      {label}
    </Typography>
  </View>
);

/** Screen 31 · Compare Check-ins */
const CompareCheckinsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedPair, setSelectedPair] = useState('Mar-Aug');
  const [activeAngle, setActiveAngle] = useState('Front');

  const handleShare = () =>
    dispatch(showToast('Comparison graphic generated & copied to clipboard'));

  const isBaseline = selectedPair === 'Mar-Aug';
  const beforeImg = isBaseline ? images.splash02 : images.splash03_1;
  const beforeWeight = isBaseline ? '196.0 lb' : '189.5 lb';
  const beforeDate = isBaseline ? 'Mar 01, 2026' : 'Jun 15, 2026';
  const deltaWeight = isBaseline ? '−11.8 lb' : '−5.3 lb';
  const deltaWaist = isBaseline ? '−3.5 in' : '−1.5 in';

  return (
    <DmvScreen bgColor="#0B0B0D" topPad={12} bottomPad={TABBAR_CLEARANCE}>
      <View style={styles.nav}>
        <RoundBackButton
          onPress={() => navigation.goBack()}
          style={styles.navBtn}
        />
        <Typography
          size={14}
          fFamily="displayBold700"
          color={COLORS.white}
          textTransform="uppercase"
          letterSpacing={1.96}
        >
          COMPARE CHECK-INS
        </Typography>
        <Pressable onPress={handleShare} style={styles.navBtnPlain}>
          <Icon name="share-2" size={Sizer.fS(16)} color={COLORS.foreground} />
        </Pressable>
      </View>

      <View style={styles.switchers}>
        <View style={styles.group}>
          {[
            { id: 'Mar-Aug', label: '5 Months (Baseline)' },
            { id: 'Jun-Aug', label: '2 Months' },
          ].map(opt => {
            const on = selectedPair === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setSelectedPair(opt.id)}
                style={[styles.pairChip, on && styles.pairChipOn]}
              >
                <Typography
                  size={11}
                  fFamily="bodyBold700"
                  color={on ? COLORS.white : COLORS.muted}
                >
                  {opt.label}
                </Typography>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.group}>
          {ANGLES.map(ang => {
            const on = activeAngle === ang;
            return (
              <Pressable
                key={ang}
                onPress={() => setActiveAngle(ang)}
                style={[styles.angleChip, on && styles.angleChipOn]}
              >
                <Typography
                  size={10}
                  fFamily="bodyBold700"
                  color={on ? COLORS.black : COLORS.muted}
                >
                  {ang}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.frames}>
        <View style={styles.frameCol}>
          <View style={styles.frame}>
            <Image
              source={beforeImg}
              resizeMode="cover"
              style={styles.frameImg}
            />
            <View style={styles.frameCaption}>
              <Typography
                size={10.5}
                fFamily="monoBold700"
                color={COLORS.white}
                textAlign="center"
              >
                {`${beforeDate} · ${beforeWeight}`}
              </Typography>
            </View>
          </View>
          <Typography
            size={11}
            fFamily="bodyBold700"
            color={COLORS.muted}
            textAlign="center"
          >
            BEFORE
          </Typography>
        </View>

        <View style={styles.frameCol}>
          <View style={[styles.frame, styles.frameCurrent]}>
            <Image
              source={images.splash03_2}
              resizeMode="cover"
              style={styles.frameImg}
            />
            <View style={[styles.frameCaption, styles.frameCaptionCurrent]}>
              <Typography
                size={10.5}
                fFamily="monoBold700"
                color={COLORS.white}
                textAlign="center"
              >
                Aug 01, 2026 · 184.2 lb
              </Typography>
            </View>
          </View>
          <Typography
            size={11}
            fFamily="bodyBold700"
            color={COLORS.success}
            textAlign="center"
          >
            CURRENT (AFTER)
          </Typography>
        </View>
      </View>

      <View style={styles.deltaCard}>
        <View style={styles.rowBetween}>
          <Typography size={14} fFamily="bodyBold700" color={COLORS.white}>
            Transformation Delta
          </Typography>
          <View style={styles.deltaPill}>
            <Typography size={12} fFamily="monoBold700" color={COLORS.success}>
              {deltaWeight}
            </Typography>
          </View>
        </View>

        <View style={styles.deltaGrid}>
          <DeltaCell value={deltaWaist} label="Waist" />
          <DeltaCell value="+25 lb" label="Bench PR" />
          <DeltaCell value="128" label="Workouts" tint={COLORS.white} />
        </View>
      </View>

      {/* The mock keeps this button in the content flow under the delta card. */}
      <View style={styles.ctaWrap}>
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
        >
          <LinearGradient
            colors={['#8D22FF', '#A84DF0']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.absFill}
          />
          <Icon name="share-2" size={Sizer.fS(20)} color={COLORS.white} />
          <Typography size={15} fFamily="bodyBold700" color={COLORS.white}>
            Share Comparison Graphic
          </Typography>
        </Pressable>
      </View>
    </DmvScreen>
  );
};

const styles = StyleSheet.create({
  ctaWrap: { marginTop: Sizer.vSize(16) },
  absFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressed: { transform: [{ scale: 0.98 }] },

  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(12),
  },
  navBtn: { width: 40, height: 40 },
  navBtnPlain: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },

  switchers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Sizer.hSize(8),
    marginBottom: Sizer.vSize(12),
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141417',
    padding: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  pairChip: {
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(4),
    borderRadius: RADIUS.full,
  },
  pairChipOn: { backgroundColor: COLORS.primary },
  angleChip: {
    paddingHorizontal: Sizer.hSize(8),
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  angleChipOn: { backgroundColor: COLORS.white },

  frames: {
    flexDirection: 'row',
    gap: Sizer.hSize(12),
    marginBottom: Sizer.vSize(12),
  },
  frameCol: { flex: 1, gap: Sizer.vSize(6) },
  frame: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  frameCurrent: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  frameImg: { width: '100%', height: '100%' },
  frameCaption: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  frameCaptionCurrent: { backgroundColor: COLORS.primary },

  deltaCard: {
    borderRadius: 20,
    padding: Sizer.hSize(16),
    backgroundColor: '#141417',
    borderWidth: 1,
    borderColor: COLORS.hairline,
    gap: Sizer.vSize(10),
    marginBottom: Sizer.vSize(16),
  },
  deltaPill: {
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(4),
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(46,212,122,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(46,212,122,0.3)',
  },
  deltaGrid: {
    flexDirection: 'row',
    gap: Sizer.hSize(8),
    paddingTop: Sizer.vSize(10),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  deltaCell: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: Sizer.hSize(8),
    borderRadius: 12,
  },

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

export default CompareCheckinsScreen;
