import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import Icon from '../helpers/Icon';
import { Typography } from '../atomComponents';
import { SHELL_MAX_WIDTH } from '../constants';

const ACTIVE = '#B36BFF';
const INACTIVE = '#A1A1AA';

/** The tab glyphs are drawn from the mock's inline SVG paths, so the
 *  filled-when-active look on Today/Profile is preserved exactly. */
const TabGlyph = ({ id, active, size }) => {
  const color = active ? ACTIVE : INACTIVE;
  const common = { stroke: color, strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {id === 'today' ? (
        <>
          <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={active ? color : 'none'} {...common} />
          <Polyline points="9 22 9 12 15 12 15 22" fill="none" {...common} />
        </>
      ) : null}
      {id === 'train' ? (
        <Path d="m6.5 6.5 11 11M21 21l-1-1M3 3l1 1M18 22l4-4M2 6l4-4M3 10l7-7M14 21l7-7" fill="none" {...common} />
      ) : null}
      {id === 'diary' ? (
        <>
          <Path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" fill="none" {...common} />
          <Path d="M6 6h10M6 10h10" fill="none" {...common} />
        </>
      ) : null}
      {id === 'me' ? (
        <>
          <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" fill={active ? color : 'none'} {...common} />
          <Circle cx="12" cy="7" r="4" fill={active ? color : 'none'} {...common} />
        </>
      ) : null}
    </Svg>
  );
};

const TABS = [
  { id: 'today', label: 'TODAY' },
  { id: 'train', label: 'WORKOUTS' },
  { id: 'fab', label: '' },
  { id: 'diary', label: 'DIARY' },
  { id: 'me', label: 'PROFILE' },
];

/**
 * Ported from DmvTabBar — 5 slots with the raised gradient FAB in the middle.
 */
export const DmvTabBar = ({ activeTab, onTabChange, onFabPress }) => {
  const insets = useSafeAreaInsets();
  const glyph = Sizer.fS(24);

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, Sizer.vSize(12)) }]}>
      <View style={styles.row}>
        {TABS.map(t => {
          if (t.id === 'fab') {
            return (
              <View key="fab" style={styles.fabSlot}>
                <Pressable
                  onPress={onFabPress}
                  style={({ pressed }) => [styles.fab, { transform: [{ scale: pressed ? 0.9 : 1 }] }]}
                >
                  <LinearGradient
                    colors={['#8D22FF', '#C084FC']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.fabFill}
                  />
                  <Icon name="plus" size={Sizer.fS(28)} color={COLORS.white} />
                </Pressable>
              </View>
            );
          }
          const active = activeTab === t.id;
          return (
            <Pressable key={t.id} onPress={() => onTabChange(t.id)} style={styles.tab} hitSlop={4}>
              <View style={[styles.glyph, active && styles.glyphActive]}>
                <TabGlyph id={t.id} active={active} size={glyph} />
              </View>
              <Typography
                size={12}
                fFamily={active ? 'displayBold700' : 'displaySemiBold600'}
                color={active ? COLORS.white : INACTIVE}
                textTransform="uppercase"
                letterSpacing={1.68}
              >
                {t.label}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const FAB = 52;

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    backgroundColor: '#111114',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: Sizer.vSize(10),
    paddingHorizontal: Sizer.hSize(8),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.85,
    shadowRadius: 18,
    elevation: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: SHELL_MAX_WIDTH,
  },
  tab: { alignItems: 'center', justifyContent: 'center', paddingVertical: 4, paddingHorizontal: 12, minWidth: 64 },
  glyph: { marginBottom: 4 },
  glyphActive: { transform: [{ scale: 1.1 }] },
  fabSlot: { alignItems: 'center', justifyContent: 'center', top: -20 },
  fab: {
    width: Sizer.hSize(FAB),
    height: Sizer.hSize(FAB),
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#111114',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 12,
  },
  fabFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});

export default DmvTabBar;
