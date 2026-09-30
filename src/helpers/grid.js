import { Dimensions, PixelRatio } from 'react-native';
import { SHELL_MAX_WIDTH } from '../constants';
import Sizer from './Sizer';

const screenWidth = () => Math.min(Dimensions.get('window').width, SHELL_MAX_WIDTH);

/**
 * Exact point width for one cell of an n-column grid.
 *
 * Percentage widths plus a fixed gap overflow the row by a fraction of a point
 * and silently wrap to fewer columns, so grids compute their widths here.
 * `insets` is the total horizontal padding between the screen edge and the row.
 *
 * The result is snapped down to the device pixel grid and then pulled in by one
 * more pixel. Every padding and gap around the row is rounded to a physical
 * pixel independently before layout, so a width that is mathematically exact
 * can still land a fraction of a point too wide and drop a column — which is
 * what wrapped the six-glass hydration row to five.
 */
export function gridItemWidth(columns, gap, insets = 32) {
  const available = screenWidth() - insets - gap * (columns - 1);
  const pixel = 1 / PixelRatio.get();
  return Math.floor(available / columns / pixel) * pixel - pixel;
}

/** Same, but the gap and insets are given in design points and scaled first. */
export function gridItemWidthScaled(columns, gap, insets = 32) {
  return gridItemWidth(columns, Sizer.hSize(gap), Sizer.hSize(insets));
}

export default gridItemWidth;
