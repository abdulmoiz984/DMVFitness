import React from 'react';
import Svg, { Path } from 'react-native-svg';
import Sizer from '../helpers/Sizer';

/** Lucide `trophy`, drawn filled (the mock applies `fill-[#FFB020]`). */
export const TrophyIcon = ({ size = 24, color = '#FFB020' }) => {
  const s = Sizer.fS(size);
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24">
      <Path
        d="M6 4h12v5a6 6 0 0 1-12 0V4Z"
        fill={color}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Path d="M8 21h8M12 15v6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M6 6H3v3a3 3 0 0 0 3 3" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <Path d="M18 6h3v3a3 3 0 0 1-3 3" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </Svg>
  );
};

/** Lucide `star`, drawn filled. */
export const StarIcon = ({ size = 24, color = '#FFB020' }) => {
  const s = Sizer.fS(size);
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24">
      <Path
        d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 20.99a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.774a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
        fill={color}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default TrophyIcon;
