import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

let uid = 0;

/**
 * CSS `radial-gradient(circle at X% Y%, …)` for React Native.
 *
 * react-native-svg's default objectBoundingBox units stretch a gradient into
 * an ellipse on a non-square view, which spreads the colour far wider than a
 * browser does. CSS instead draws a true circle whose radius reaches the
 * farthest corner, so the circle is sized in user space from the measured
 * box — that is what makes the violet washes match the mock.
 *
 * `stops` mirrors the CSS stop list: { offset, color, opacity }.
 */
export const RadialOverlay = ({ stops, cx = 0.5, cy = 0.5, extent = 'farthest-corner', style, pointerEvents = 'none' }) => {
  const [box, setBox] = useState(null);
  const [id] = useState(() => `radial${uid++}`);

  const onLayout = e => {
    const { width, height } = e.nativeEvent.layout;
    if (!box || box.width !== width || box.height !== height) setBox({ width, height });
  };

  return (
    <View style={style} onLayout={onLayout} pointerEvents={pointerEvents}>
      {box && box.width > 0 && box.height > 0 ? (
        <Svg width={box.width} height={box.height}>
          <Defs>
            <RadialGradient
              id={id}
              gradientUnits="userSpaceOnUse"
              cx={box.width * cx}
              cy={box.height * cy}
              r={radiusFor(box, cx, cy, extent)}
            >
              {stops.map(s => (
                <Stop
                  key={`${s.offset}-${s.color}`}
                  offset={s.offset}
                  stopColor={s.color}
                  stopOpacity={s.opacity}
                />
              ))}
            </RadialGradient>
          </Defs>
          <Rect width={box.width} height={box.height} fill={`url(#${id})`} />
        </Svg>
      ) : null}
    </View>
  );
};

/**
 * CSS's radial-gradient extents. `farthest-corner` is the CSS default and is
 * what the mock's overlays use; `closest-side` makes the gradient reach its
 * last stop exactly at the box edge, which a soft blob needs so it fades out
 * instead of ending on a visible rectangular seam.
 */
function radiusFor({ width, height }, cx, cy, extent) {
  const x = width * cx;
  const y = height * cy;
  if (extent === 'closest-side') {
    return Math.min(x, width - x, y, height - y);
  }
  return Math.max(
    Math.hypot(x, y),
    Math.hypot(width - x, y),
    Math.hypot(x, height - y),
    Math.hypot(width - x, height - y),
  );
}

/**
 * Tailwind's `bg-[#8D22FF]/20 rounded-full blur-3xl` blob. A flat circle reads
 * as a hard disc in RN, so the blur is drawn as a radial falloff instead.
 */
export const SoftBlob = ({ size, color = '#8D22FF', opacity = 0.2, style }) => (
  <RadialOverlay
    // closest-side so the blob is fully transparent by the edge of its box
    extent="closest-side"
    style={[{ width: size, height: size }, style]}
    stops={[
      { offset: 0, color, opacity },
      { offset: 0.5, color, opacity: opacity * 0.75 },
      { offset: 1, color, opacity: 0 },
    ]}
  />
);

export const overlayStyles = StyleSheet.create({
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});

export default RadialOverlay;
