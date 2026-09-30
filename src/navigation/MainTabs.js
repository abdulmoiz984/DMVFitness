import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch } from 'react-redux';
import { DmvActionSheet, DmvTabBar } from '../components';
import { ACTION_ROUTES } from '../lib/dmv-data';
import { showToast } from '../redux/slices/appSlice';
import { TodayScreen, FoodDiaryScreen } from '../screens/Daily';
import { TodaysWorkoutScreen } from '../screens/Training';
import { ProfileScreen } from '../screens/Profile';

const Tab = createBottomTabNavigator();

/** Tab route name ↔ the mock's tab id. */
const TAB_BY_ROUTE = { TodayTab: 'today', TrainTab: 'train', DiaryTab: 'diary', MeTab: 'me' };
const ROUTE_BY_TAB = { today: 'TodayTab', train: 'TrainTab', diary: 'DiaryTab', me: 'MeTab' };

/**
 * The mock's DmvTabBar: four tabs with the raised FAB in the middle slot,
 * which opens the quick-actions sheet rather than switching tabs.
 */
const AppTabBar = ({ state, navigation }) => {
  const dispatch = useDispatch();
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeTab = TAB_BY_ROUTE[state.routes[state.index].name];

  const handleAction = actionId => {
    const route = ACTION_ROUTES[actionId];
    if (!route) return;
    if (ROUTE_BY_TAB[TAB_BY_ROUTE[route]]) navigation.navigate(route);
    else navigation.navigate(route);
    dispatch(showToast('Opening quick action'));
  };

  return (
    <>
      <DmvTabBar
        activeTab={activeTab}
        onTabChange={tab => navigation.navigate(ROUTE_BY_TAB[tab])}
        onFabPress={() => setSheetOpen(true)}
      />
      <DmvActionSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} onAction={handleAction} />
    </>
  );
};

// Defined once, outside the navigator, so React keeps the same component type.
const renderTabBar = props => <AppTabBar {...props} />;

const MainTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false, lazy: true }} tabBar={renderTabBar}>
    <Tab.Screen name="TodayTab" component={TodayScreen} />
    <Tab.Screen name="TrainTab" component={TodaysWorkoutScreen} />
    <Tab.Screen name="DiaryTab" component={FoodDiaryScreen} />
    <Tab.Screen name="MeTab" component={ProfileScreen} />
  </Tab.Navigator>
);

export default MainTabs;
