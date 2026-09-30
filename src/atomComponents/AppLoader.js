import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { COLORS } from '../globalStyle/Theme';
import Typography from './Typography';

const AppLoader = ({ label, fullScreen = false }) => (
  <View style={fullScreen ? styles.full : styles.inline}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    {label ? (
      <Typography variant="secondary" mT={12} textAlign="center">
        {label}
      </Typography>
    ) : null}
  </View>
);

export default React.memo(AppLoader);

const styles = StyleSheet.create({
  full: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.backgroundDeep },
  inline: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
});
