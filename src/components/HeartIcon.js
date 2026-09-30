import React from 'react';
import Svg, { Path } from 'react-native-svg';
import Sizer from '../helpers/Sizer';

const HEART =
  'M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 0L5 15c-1.5-1.5-3-3.2-3-5.5';
const BOOKMARK = 'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z';

/** Lucide `heart` — `filled` matches the mock's `fill-[#FF4D5E]` liked state. */
export const HeartIcon = ({ size = 24, color = '#FFFFFF', filled = false }) => {
  const s = Sizer.fS(size);
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24">
      <Path
        d={HEART}
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

/** Lucide `bookmark` — `filled` matches `fill-[#FFB020]`. */
export const BookmarkIcon = ({ size = 24, color = '#FFFFFF', filled = false }) => {
  const s = Sizer.fS(size);
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24">
      <Path
        d={BOOKMARK}
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default HeartIcon;
