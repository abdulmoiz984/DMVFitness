import { StatusBar } from 'react-native';
import { showMessage as flashMessage } from 'react-native-flash-message';
import { COLORS } from '../globalStyle/Theme';

export function showMessage({ message = '', description = '', type = 'default', bgColor = '' }) {
  const backgroundColor =
    bgColor ||
    (type === 'success' ? COLORS.success : type === 'danger' ? COLORS.urgent : COLORS.brand);

  flashMessage({
    message,
    description,
    type,
    backgroundColor,
    color: COLORS.white,
    statusBarHeight: StatusBar.currentHeight,
    duration: 3000,
    floating: true,
  });
}

export default showMessage;
