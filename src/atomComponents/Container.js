import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, GLOBALSTYLE } from '../globalStyle/Theme';

const Container = ({
  children,
  isPadding = true,
  conStyle = {},
  backgroundImage = null,
  imageStyle = {},
  resizeMode = 'cover',
  keyboardAvoiding = false,
  keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height',
  keyboardVerticalOffset = 0,
  bgColor = COLORS.background,
}) => {
  const containerStyle = [
    styles.container,
    { backgroundColor: bgColor },
    isPadding && GLOBALSTYLE.paddingHor,
    conStyle,
  ];

  const ContentComponent = backgroundImage ? ImageBackground : View;
  const contentProps = backgroundImage
    ? { source: backgroundImage, imageStyle, resizeMode }
    : {};

  const content = (
    <ContentComponent style={containerStyle} {...contentProps}>
      {children}
    </ContentComponent>
  );

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={keyboardBehavior}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
};

export default Container;

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardContainer: { flex: 1 },
});
