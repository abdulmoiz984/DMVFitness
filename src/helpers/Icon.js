import React, { memo } from 'react';
// Static import — bundles Lucide.ttf (bare RN; dynamic import needs Expo)
import { Lucide } from '@react-native-vector-icons/lucide/static';

const Icon = ({ name, size, color, style }) => (
  <Lucide name={name} size={size} color={color} style={style} />
);

export default memo(Icon);
