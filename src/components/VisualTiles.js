import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Ellipse, Line, Path, Polyline, Rect } from 'react-native-svg';
import { COLORS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import { Typography } from '../atomComponents';

/** Ported from dmv-assets/VisualTiles.tsx — all artwork is inline SVG. */

const Tile = ({ size, radius = 12, children, style }) => (
  <View style={[styles.tile, { width: Sizer.hSize(size), height: Sizer.hSize(size), borderRadius: radius }, style]}>
    {children}
  </View>
);

export const FoodThumbnail = ({ name = '', size = 48, style }) => {
  const n = name.toLowerCase();
  const art = Sizer.hSize(size * 0.58);

  let glyph;
  if (n.includes('chicken')) {
    glyph = (
      <Svg width={art} height={art} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="20" fill="rgba(141,34,255,0.18)" />
        <Path
          d="M16 28C16 22 22 16 28 16C34 16 36 20 34 26C32 32 24 34 18 32C16.5 31.5 16 29.5 16 28Z"
          fill="#B36BFF"
        />
        <Circle cx="30" cy="20" r="2" fill="#E8E8EC" />
      </Svg>
    );
  } else if (n.includes('oat')) {
    glyph = (
      <Svg width={art} height={art} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="20" fill="rgba(255,176,32,0.18)" />
        <Path d="M14 26C14 32 18 36 24 36C30 36 34 32 34 26H14Z" fill="#FFB020" />
        <Path d="M18 22C18 20 20 18 24 18C28 18 30 20 30 22H18Z" fill="#E8E8EC" />
      </Svg>
    );
  } else if (n.includes('yogurt')) {
    glyph = (
      <Svg width={art} height={art} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="20" fill="rgba(61,169,252,0.18)" />
        <Path d="M18 18L20 34H28L30 18H18Z" fill="#3DA9FC" />
        <Rect x="16" y="15" width="16" height="3" rx="1.5" fill="#E8E8EC" />
      </Svg>
    );
  } else if (n.includes('biryani') || n.includes('rice')) {
    glyph = (
      <Svg width={art} height={art} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="20" fill="rgba(255,176,32,0.18)" />
        <Ellipse cx="24" cy="28" rx="12" ry="6" fill="#FFB020" />
        <Path d="M16 26C16 20 20 16 24 16C28 16 32 20 32 26" stroke="#E8E8EC" strokeWidth="2" strokeLinecap="round" fill="none" />
      </Svg>
    );
  } else if (n.includes('shake') || n.includes('smoothie')) {
    glyph = (
      <Svg width={art} height={art} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="20" fill="rgba(141,34,255,0.18)" />
        <Path d="M18 16L20 36H28L30 16H18Z" fill="#8D22FF" />
        <Line x1="24" y1="10" x2="24" y2="16" stroke="#E8E8EC" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    );
  } else if (n.includes('beef') || n.includes('wrap') || n.includes('chili')) {
    glyph = (
      <Svg width={art} height={art} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="20" fill="rgba(255,77,94,0.18)" />
        <Rect x="14" y="20" width="20" height="12" rx="6" fill="#FF4D5E" />
        <Circle cx="20" cy="26" r="2" fill="#E8E8EC" />
        <Circle cx="28" cy="26" r="2" fill="#E8E8EC" />
      </Svg>
    );
  } else {
    glyph = (
      <Svg width={art} height={art} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="20" fill="rgba(141,34,255,0.14)" />
        <Circle cx="24" cy="24" r="8" fill="#B36BFF" />
      </Svg>
    );
  }

  return (
    <Tile size={size} style={style}>
      {glyph}
    </Tile>
  );
};

export const ExerciseThumbnail = ({ name = '', size = 48, style }) => {
  const n = name.toLowerCase();
  const art = Sizer.hSize(size * 0.58);

  let glyph;
  if (n.includes('bench') || n.includes('chest')) {
    glyph = (
      <Svg width={art} height={art} viewBox="0 0 48 48">
        <Rect x="8" y="22" width="32" height="4" rx="2" fill="#E8E8EC" />
        <Rect x="12" y="16" width="4" height="16" rx="1" fill="#8D22FF" />
        <Rect x="32" y="16" width="4" height="16" rx="1" fill="#8D22FF" />
        <Line x1="16" y1="32" x2="32" y2="32" stroke="#6E6E78" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    );
  } else if (n.includes('shoulder') || n.includes('press')) {
    glyph = (
      <Svg width={art} height={art} viewBox="0 0 48 48">
        <Rect x="10" y="14" width="28" height="4" rx="2" fill="#E8E8EC" />
        <Rect x="12" y="10" width="3" height="12" rx="1" fill="#8D22FF" />
        <Rect x="33" y="10" width="3" height="12" rx="1" fill="#8D22FF" />
        <Circle cx="24" cy="26" r="4" fill="#B36BFF" />
        <Path d="M18 36L24 30L30 36" stroke="#6E6E78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Svg>
    );
  } else if (n.includes('fly') || n.includes('cable')) {
    glyph = (
      <Svg width={art} height={art} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="18" fill="rgba(141,34,255,0.12)" />
        <Path d="M14 20C14 20 20 28 24 28C28 28 34 20 34 20" stroke="#B36BFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <Circle cx="24" cy="16" r="3" fill="#E8E8EC" />
      </Svg>
    );
  } else if (n.includes('triceps') || n.includes('pushdown')) {
    glyph = (
      <Svg width={art} height={art} viewBox="0 0 48 48">
        <Line x1="24" y1="10" x2="24" y2="28" stroke="#8D22FF" strokeWidth="3" strokeLinecap="round" />
        <Path d="M18 28L24 34L30 28" stroke="#E8E8EC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Svg>
    );
  } else {
    glyph = (
      <Svg width={art} height={art} viewBox="0 0 48 48">
        <Rect x="10" y="22" width="28" height="4" rx="2" fill="#E8E8EC" />
        <Circle cx="24" cy="24" r="8" fill="none" stroke="#8D22FF" strokeWidth="2" />
      </Svg>
    );
  }

  return (
    <Tile size={size} style={style}>
      {glyph}
    </Tile>
  );
};

export const DmvBadgeIcon = ({ type, size = 28 }) => {
  const s = Sizer.fS(size);
  switch (type) {
    case 'streak':
    case 'flame':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Path
            d="M12 2C12 2 16 8 16 13C16 16.3137 13.3137 19 10 19C6.68629 19 4 16.3137 4 13C4 10 7 7 7 7C7 7 5.5 13 10 13C11.5 13 13 11.5 13 10C13 7 12 2 12 2Z"
            fill="#B36BFF"
          />
        </Svg>
      );
    case 'trophy':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Path
            d="M8 21H16M12 17V21M6 4H18V9C18 12.3137 15.3137 15 12 15C8.68629 15 6 12.3137 6 9V4Z"
            stroke="#B36BFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Path d="M6 6H3V9C3 10.6569 4.34315 12 6 12" stroke="#B36BFF" strokeWidth="2" strokeLinecap="round" fill="none" />
          <Path d="M18 6H21V9C21 10.6569 19.6569 12 18 12" stroke="#B36BFF" strokeWidth="2" strokeLinecap="round" fill="none" />
        </Svg>
      );
    case 'graph-down':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Path d="M3 3V21H21" stroke="#B36BFF" strokeWidth="2" strokeLinecap="round" fill="none" />
          <Path d="M7 9L12 14L16 10L21 15" stroke="#2ED47A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Polyline points="17 15 21 15 21 11" stroke="#2ED47A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      );
    case 'egg-fried':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Path
            d="M12 2C7 2 3 6 3 11C3 15 6 18 9 20C12 22 17 22 20 18C23 14 21 8 18 5C16 3 14 2 12 2Z"
            stroke="#B36BFF"
            strokeWidth="2"
            fill="none"
          />
          <Circle cx="12" cy="12" r="4" fill="#FFB020" />
        </Svg>
      );
    case 'calendar-check':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Rect x="3" y="4" width="18" height="18" rx="3" stroke="#B36BFF" strokeWidth="2" fill="none" />
          <Line x1="16" y1="2" x2="16" y2="6" stroke="#B36BFF" strokeWidth="2" strokeLinecap="round" />
          <Line x1="8" y1="2" x2="8" y2="6" stroke="#B36BFF" strokeWidth="2" strokeLinecap="round" />
          <Line x1="3" y1="10" x2="21" y2="10" stroke="#B36BFF" strokeWidth="2" />
          <Path d="M9 15L11 17L15 13" stroke="#2ED47A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      );
    case 'lock':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Rect x="5" y="11" width="14" height="10" rx="2" stroke="#6E6E78" strokeWidth="2" fill="none" />
          <Path
            d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11"
            stroke="#6E6E78"
            strokeWidth="2"
            fill="none"
          />
        </Svg>
      );
    default:
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="9" stroke="#B36BFF" strokeWidth="2" fill="none" />
        </Svg>
      );
  }
};

export const AvatarUser = ({ name = 'Alicia Nguyen', size = 56, fontSize = 20, style }) => (
  <View style={[styles.avatar, { width: Sizer.hSize(size), height: Sizer.hSize(size) }, style]}>
    <LinearGradient
      colors={['#8D22FF', '#3A106E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.avatarFill}
    />
    <Typography size={fontSize} fFamily="displayBold700" color={COLORS.white}>
      {name
        .split(' ')
        .map(part => part[0])
        .join('')}
    </Typography>
  </View>
);

export const AvatarCoach = ({ size = 48, fontSize = 18, style }) => (
  <View style={[styles.avatar, styles.coach, { width: Sizer.hSize(size), height: Sizer.hSize(size) }, style]}>
    <LinearGradient
      colors={['#272727', '#18181B']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.avatarFill}
    />
    <Typography size={fontSize} fFamily="displayBold700" color={COLORS.primarySoft}>
      MB
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  tile: {
    flexShrink: 0,
    overflow: 'hidden',
    backgroundColor: COLORS.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  avatar: {
    flexShrink: 0,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.dividerStrong,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  coach: { borderColor: 'rgba(141,34,255,0.4)' },
  avatarFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});
