import React from 'react';
import Svg, { Path } from 'react-native-svg';
import Sizer from '../helpers/Sizer';

/**
 * Lucide's `crown`, drawn filled. The mock uses `fill-[#FFB020]` on the icon,
 * which the icon font cannot do, so the path is rendered through SVG instead.
 */
export const CrownIcon = ({ size = 16, color = '#FFB020' }) => {
  const s = Sizer.fS(size);
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24">
      <Path
        d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"
        fill={color}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Path d="M5 21h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
};

export default CrownIcon;
