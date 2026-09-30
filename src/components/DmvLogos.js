import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { COLORS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import { Typography } from '../atomComponents';

/** Ported from DmvMark — the faceted lion mark. */
export const DmvMark = ({ size = 32, glow = false, style }) => {
  const px = Sizer.hSize(size);
  return (
    <Svg width={px} height={px} viewBox="0 0 100 100" style={style}>
      {glow ? <Circle cx="50" cy="50" r="44" fill={COLORS.primary} fillOpacity={0.25} /> : null}
      <Rect x="6" y="6" width="88" height="88" rx="22" fill="#18181B" stroke="#272727" strokeWidth="2" />
      <Path d="M50 16L60 28H40L50 16Z" fill="#8D22FF" />
      <Path d="M24 34L36 28L40 40L28 46L24 34Z" fill="#B36BFF" />
      <Path d="M76 34L64 28L60 40L72 46L76 34Z" fill="#B36BFF" />
      <Path d="M32 46L44 44L50 52L42 54L32 46Z" fill="#E8E8EC" />
      <Path d="M68 46L56 44L50 52L58 54L68 46Z" fill="#E8E8EC" />
      <Path d="M45 56H55L50 64L45 56Z" fill="#8D22FF" />
      <Path d="M50 64L42 70L50 78L58 70L50 64Z" fill="#E8E8EC" />
      <Path d="M24 52L34 56L28 68L20 62L24 52Z" fill="#8D22FF" fillOpacity={0.8} />
      <Path d="M76 52L66 56L72 68L80 62L76 52Z" fill="#8D22FF" fillOpacity={0.8} />
      <Path d="M30 72L42 72L50 84L38 84L30 72Z" fill="#B36BFF" />
      <Path d="M70 72L58 72L50 84L62 84L70 72Z" fill="#B36BFF" />
    </Svg>
  );
};

/** FAMILY · FAITH · FITNESS lockup with violet separators. */
export const DmvTagline = ({ size = 10, letterSpacing = 2.4, color = COLORS.faint, style }) => (
  <View style={[styles.tagline, style]}>
    {['FAMILY', 'FAITH', 'FITNESS'].map((word, i) => (
      <React.Fragment key={word}>
        {i > 0 ? (
          <Typography size={size + 2} fFamily="displaySemiBold600" color={COLORS.primary}>
            ·
          </Typography>
        ) : null}
        <Typography
          size={size}
          fFamily="displaySemiBold600"
          color={color}
          textTransform="uppercase"
          letterSpacing={letterSpacing}
        >
          {word}
        </Typography>
      </React.Fragment>
    ))}
  </View>
);

/** Ported from DmvLogoFull — mark + DMV FITNESS wordmark + tagline. */
export const DmvLogoFull = ({ subtitle = true, style }) => (
  <View style={[styles.full, style]}>
    <View style={styles.row}>
      <DmvMark size={44} glow />
      <View>
        <View style={styles.word}>
          <Typography size={24} fFamily="displayBold700" letterSpacing={1.2} color={COLORS.foreground}>
            DMV
          </Typography>
          <Typography size={24} fFamily="displayBold700" letterSpacing={1.2} color={COLORS.primary}>
            FITNESS
          </Typography>
        </View>
        <Typography
          size={8}
          fFamily="bodySemiBold600"
          color={COLORS.muted}
          textTransform="uppercase"
          letterSpacing={1.6}
          mT={2}
        >
          Est. Washington D.C.
        </Typography>
      </View>
    </View>
    {subtitle ? <DmvTagline style={styles.sub} /> : null}
  </View>
);

const styles = StyleSheet.create({
  full: { alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12) },
  word: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(6) },
  sub: { marginTop: Sizer.vSize(14) },
  tagline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Sizer.hSize(8) },
});
