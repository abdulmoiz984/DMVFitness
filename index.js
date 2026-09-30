/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Dev-only handle on LogBox. RN 0.87 no longer renders the warning list in the
// app, so the toast can only be read or cleared from the debugger. Stripped
// from release builds by __DEV__.
if (__DEV__) {
  // eslint-disable-next-line no-undef
  globalThis.__logbox = LogBox;
}

AppRegistry.registerComponent(appName, () => App);
