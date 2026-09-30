import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { DmvTabBar } from './DmvTabBar';
import { DmvActionSheet } from './DmvActionSheet';
import { ACTION_ROUTES } from '../lib/dmv-data';
import { showToast } from '../redux/slices/appSlice';

const ROUTE_BY_TAB = { today: 'TodayTab', train: 'TrainTab', diary: 'DiaryTab', me: 'MeTab' };

/**
 * The mock keeps its tab bar on four screens that are not tabs themselves —
 * meals & recipes, the community library, progress and achievements — and
 * leaves the tab they were opened from lit. Those screens live in the stack
 * here, so they pin the same bar and pass that tab in as `activeTab`.
 */
export const StackTabBar = ({ activeTab }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleAction = actionId => {
    const route = ACTION_ROUTES[actionId];
    if (!route) return;
    navigation.navigate(route);
    dispatch(showToast('Opening quick action'));
  };

  return (
    <View style={styles.dock} pointerEvents="box-none">
      <DmvTabBar
        activeTab={activeTab}
        onTabChange={tab => navigation.navigate('MainTabs', { screen: ROUTE_BY_TAB[tab] })}
        onFabPress={() => setSheetOpen(true)}
      />
      <DmvActionSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} onAction={handleAction} />
    </View>
  );
};

const styles = StyleSheet.create({
  dock: { position: 'absolute', left: 0, right: 0, bottom: 0 },
});

export default StackTabBar;
