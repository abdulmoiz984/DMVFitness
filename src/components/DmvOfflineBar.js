import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import Icon from '../helpers/Icon';
import { Typography } from '../atomComponents';

/** Ported from DmvOfflineBar — slim amber bar pinned under the status bar. */
export const DmvOfflineBar = () => (
  <View style={styles.bar}>
    <Icon name="circle-alert" size={Sizer.fS(14)} color={COLORS.black} />
    <Typography size={11} fFamily="bodySemiBold600" color={COLORS.black}>
      Offline mode · Changes will sync automatically when reconnected
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(8),
    backgroundColor: COLORS.warning,
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(4),
    zIndex: 40,
  },
});

export default DmvOfflineBar;
