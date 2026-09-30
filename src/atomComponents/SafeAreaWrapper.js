import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, GLOBALSTYLE } from '../globalStyle/Theme';
import { SHELL_MAX_WIDTH } from '../constants';

const SafeAreaWrapper = ({
  children,
  edges,
  contentStyle = {},
  bgColor = COLORS.backgroundDeep,
  keyboardAvoid = false,
  isPadding = true,
}) => {
  const Wrapper = keyboardAvoid ? KeyboardAvoidingView : React.Fragment;
  const wrapperProps = keyboardAvoid
    ? { behavior: Platform.OS === 'ios' ? 'padding' : 'height', style: { flex: 1 } }
    : {};

  return (
    <SafeAreaView
      style={[
        { flex: 1, backgroundColor: bgColor, maxWidth: SHELL_MAX_WIDTH, width: '100%', alignSelf: 'center' },
        isPadding && GLOBALSTYLE.paddingHor,
        contentStyle,
      ]}
      edges={edges}
    >
      <Wrapper {...wrapperProps}>{children}</Wrapper>
    </SafeAreaView>
  );
};

export default SafeAreaWrapper;
