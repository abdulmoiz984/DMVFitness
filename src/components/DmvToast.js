import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { COLORS, RADIUS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import Icon from '../helpers/Icon';
import { RichText } from './RichText';

/** Ported from DmvToast — raised pill with a green check, slides up. */
export const DmvToast = ({ message, onClose }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 220,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: true,
    }).start();
  }, [message, anim]);

  if (!message) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        {
          opacity: anim,
          transform: [
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
            { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
          ],
        },
      ]}
    >
      <View style={styles.toast}>
        <View style={styles.check}>
          <Icon name="check" size={Sizer.fS(14)} color={COLORS.black} />
        </View>
        <RichText size={12} fFamily="bodyMedium500" flex={1}>
          {message}
        </RichText>
        <Pressable onPress={onClose} hitSlop={8}>
          <Icon name="x" size={Sizer.fS(16)} color={COLORS.muted} />
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: Sizer.vSize(80), alignItems: 'center', zIndex: 50 },
  toast: {
    width: '90%',
    maxWidth: 360,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    backgroundColor: COLORS.raised,
    borderWidth: 1,
    borderColor: 'rgba(46,212,122,0.3)',
    borderRadius: 14,
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 12,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DmvToast;
