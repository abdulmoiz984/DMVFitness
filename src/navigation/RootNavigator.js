import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { COLORS } from '../globalStyle/Theme';
import StackNavigator from './StackNavigator';
import AppChrome from './AppChrome';
import { navigationRef, navigate } from './navigationRef';

// Dev-only hook so a screen can be opened from the debugger while checking
// layouts against the design. Stripped from release builds by __DEV__.
if (__DEV__) {
  // eslint-disable-next-line no-undef
  globalThis.__navigate = navigate;
}

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0B0B0D',
    card: COLORS.tabbarBg,
    text: COLORS.foreground,
    primary: COLORS.primary,
    border: COLORS.divider,
  },
};

const RootNavigator = () => (
  <View style={styles.root}>
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      <StackNavigator />
    </NavigationContainer>
    <AppChrome />
  </View>
);

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: '#0B0B0D' } });

export default RootNavigator;
