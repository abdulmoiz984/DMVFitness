import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, RADIUS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import { Typography } from '../atomComponents';

/**
 * Ported from DmvSelectCard — radio + title/subtitle, optional badge and
 * trailing slot. Selected state gets a violet gradient wash and glow.
 */
export const DmvSelectCard = ({
  title,
  subtitle,
  icon,
  badge,
  selected = false,
  onPress,
  trailing,
  style,
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.card,
      selected ? styles.selected : styles.idle,
      { transform: [{ scale: pressed ? 0.99 : 1 }] },
      style,
    ]}
  >
    {selected ? (
      <LinearGradient
        colors={['rgba(141,34,255,0.2)', '#141417']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
    ) : null}

    {badge ? (
      <View style={styles.badgeWrap}>
        <LinearGradient
          colors={['#8D22FF', '#A84DF0']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.badge}
        >
          <Typography
            size={10}
            fFamily="bodyExtraBold800"
            color={COLORS.white}
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            {badge}
          </Typography>
        </LinearGradient>
      </View>
    ) : null}

    <View style={styles.row}>
      <View style={styles.left}>
        <View style={[styles.radio, selected ? styles.radioOn : styles.radioOff]}>
          {selected ? <View style={styles.dot} /> : null}
        </View>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <View style={styles.text}>
          <Typography size={15} fFamily="bodyBold700" color={COLORS.white} numberOfLines={1}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography size={12.5} lineHeight={17} color="#A1A1AA" mT={2}>
              {subtitle}
            </Typography>
          ) : null}
        </View>
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: { borderRadius: 18, padding: Sizer.hSize(16), borderWidth: 1, overflow: 'hidden', justifyContent: 'center' },
  idle: { backgroundColor: '#141417', borderColor: COLORS.fgA10 },
  selected: {
    backgroundColor: '#141417',
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  badgeWrap: { marginBottom: Sizer.vSize(8), alignSelf: 'flex-start' },
  badge: { borderRadius: RADIUS.full, paddingHorizontal: Sizer.hSize(10), paddingVertical: Sizer.vSize(2) },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Sizer.hSize(12) },
  left: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(14), flex: 1, minWidth: 0 },
  radio: { width: 20, height: 20, borderRadius: RADIUS.full, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  radioOff: { borderColor: '#71717A', backgroundColor: 'transparent' },
  dot: { width: 8, height: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.white },
  icon: { flexShrink: 0 },
  text: { flex: 1, minWidth: 0 },
  trailing: { flexShrink: 0 },
});

export default DmvSelectCard;
