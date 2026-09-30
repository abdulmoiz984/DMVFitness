import React from 'react';
import { View } from 'react-native';
import Sizer from '../helpers/Sizer';

const Flex = ({
  children = null,
  direction,
  flex,
  jusContent,
  algItems,
  flexWrap,
  mT,
  mB,
  mL,
  mR,
  pT,
  pB,
  gap,
  flexStyle = {},
  extraStyle = {},
}) => (
  <View
    style={[
      {
        flex: flex || undefined,
        flexDirection: direction || 'row',
        justifyContent: jusContent || 'flex-start',
        alignItems: algItems || 'flex-start',
        flexWrap: flexWrap || 'nowrap',
        gap: gap ? Sizer.hSize(gap) : 0,
        marginTop: mT ? Sizer.vSize(mT) : 0,
        marginBottom: mB ? Sizer.vSize(mB) : 0,
        marginLeft: mL ? Sizer.hSize(mL) : 0,
        marginRight: mR ? Sizer.hSize(mR) : 0,
        paddingTop: pT ? Sizer.vSize(pT) : 0,
        paddingBottom: pB ? Sizer.vSize(pB) : 0,
        ...flexStyle,
      },
      extraStyle,
    ]}
  >
    {children}
  </View>
);

export default React.memo(Flex);
