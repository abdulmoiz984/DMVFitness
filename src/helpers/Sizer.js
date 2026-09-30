import { Dimensions, PixelRatio } from 'react-native';

/**
 * The web mock is designed in a 393pt device frame (iPhone 15 Pro), where its
 * CSS px map 1:1 to points. Scale from that base so type and spacing match the
 * mock exactly, capped so tablets don't blow the UI up.
 */
const BASE_WIDTH = 393;
const MAX_WIDTH = 440;

const { width, height } = Dimensions.get('window');
const shortSide = Math.min(width, height, MAX_WIDTH);
const ratio = shortSide / BASE_WIDTH;

const round = n => PixelRatio.roundToNearestPixel(n);

const hSize = (size, factor = 1) => round(size + (size * ratio - size) * factor);
const vSize = size => round(size * ratio);
const fS = size => round(size * ratio);

export default { fS, vSize, hSize, ratio };
