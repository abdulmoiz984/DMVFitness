import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import MainTabs from './MainTabs';
import { selectHasCompletedSetup, selectIsAuthed } from '../redux/slices/appSlice';

import { SplashScreen, OnboardingScreen } from '../screens/OnBoard';
import {
  SignInScreen,
  ForgotPasswordScreen,
  ResetPasswordScreen,
  CreateAccountScreen,
  VerifyEmailScreen,
} from '../screens/Auth';
import {
  GoalScreen,
  AboutYouScreen,
  ActivityScreen,
  TargetPaceScreen,
  MacroBuilderScreen,
  TargetsByDayScreen,
} from '../screens/Setup';
import { ChoosePlanScreen, PaymentScreen, SetupCompleteScreen } from '../screens/Subscription';
import {
  SearchFoodScreen,
  BarcodeScanScreen,
  FoodDetailScreen,
  AddFoodManualScreen,
  MealsRecipesScreen,
} from '../screens/Food';
import { CommunityScreen } from '../screens/Community';
import { LoggingWorkoutScreen, WorkoutCompleteScreen } from '../screens/Training';
import { ProgressScreen, NewCheckinScreen, CompareCheckinsScreen } from '../screens/Progress';
import { AchievementsScreen, NotificationsScreen } from '../screens/Motivation';
import {
  HealthDevicesScreen,
  SubscriptionScreen,
  PrivacySharingScreen,
  CoachChatScreen,
} from '../screens/Profile';

const Stack = createNativeStackNavigator();

/**
 * Every screen in the mock's 38-screen switcher. The four tab screens live in
 * MainTabs; everything else is pushed on top of it.
 */
const StackNavigator = () => {
  const isAuthed = useSelector(selectIsAuthed);
  const hasCompletedSetup = useSelector(selectHasCompletedSetup);

  // Relaunching a signed-in, set-up account lands on the tab bar.
  const initialRouteName = isAuthed && hasCompletedSetup ? 'MainTabs' : 'SplashScreen';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: '#0B0B0D' } }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ animation: 'fade' }} />

      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
      <Stack.Screen name="CreateAccountScreen" component={CreateAccountScreen} />
      <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} />

      <Stack.Screen name="GoalScreen" component={GoalScreen} />
      <Stack.Screen name="AboutYouScreen" component={AboutYouScreen} />
      <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
      <Stack.Screen name="TargetPaceScreen" component={TargetPaceScreen} />
      <Stack.Screen name="MacroBuilderScreen" component={MacroBuilderScreen} />
      <Stack.Screen name="TargetsByDayScreen" component={TargetsByDayScreen} />

      <Stack.Screen name="ChoosePlanScreen" component={ChoosePlanScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="SetupCompleteScreen" component={SetupCompleteScreen} options={{ animation: 'fade' }} />

      <Stack.Screen name="MainTabs" component={MainTabs} options={{ animation: 'fade' }} />

      <Stack.Screen name="SearchFoodScreen" component={SearchFoodScreen} />
      <Stack.Screen name="BarcodeScanScreen" component={BarcodeScanScreen} />
      <Stack.Screen name="FoodDetailScreen" component={FoodDetailScreen} />
      <Stack.Screen name="AddFoodManualScreen" component={AddFoodManualScreen} />
      <Stack.Screen name="MealsRecipesScreen" component={MealsRecipesScreen} />
      <Stack.Screen name="CommunityScreen" component={CommunityScreen} />

      <Stack.Screen name="LoggingWorkoutScreen" component={LoggingWorkoutScreen} />
      <Stack.Screen name="WorkoutCompleteScreen" component={WorkoutCompleteScreen} options={{ animation: 'fade' }} />

      <Stack.Screen name="ProgressScreen" component={ProgressScreen} />
      <Stack.Screen name="NewCheckinScreen" component={NewCheckinScreen} />
      <Stack.Screen name="CompareCheckinsScreen" component={CompareCheckinsScreen} />

      <Stack.Screen name="AchievementsScreen" component={AchievementsScreen} />
      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />

      <Stack.Screen name="HealthDevicesScreen" component={HealthDevicesScreen} />
      <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
      <Stack.Screen name="PrivacySharingScreen" component={PrivacySharingScreen} />
      <Stack.Screen name="CoachChatScreen" component={CoachChatScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
