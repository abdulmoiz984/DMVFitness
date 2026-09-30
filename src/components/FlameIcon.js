import React from 'react';
import Svg, { Path } from 'react-native-svg';
import Sizer from '../helpers/Sizer';

/** Lucide `flame`, drawn filled (the mock applies `fill-[#B36BFF]`). */
export const FlameIcon = ({ size = 24, color = '#B36BFF' }) => {
  const s = Sizer.fS(size);
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24">
      <Path
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
        fill={color}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default FlameIcon;
