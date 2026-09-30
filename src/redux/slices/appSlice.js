import { createSelector, createSlice } from '@reduxjs/toolkit';
import { timeNow } from '../../utils';
import {
  checkinRecords,
  initialDailyTargets,
  initialDayTargets,
  initialLoggedMeals,
  initialTodayConsumed,
  initialUserProfile,
  notificationsList,
  savedRecipes,
  spanishHeadlines,
  todayWorkoutExercises,
} from '../../lib/dmv-data';

/**
 * Client state — the RN equivalent of dmv-fitness-appv3/src/lib/dmv-store.tsx.
 * Navigation lives in React Navigation; everything else is mirrored here.
 */
export const DEFAULT_STATE = {
  // Session — the web mock jumps straight between screens, so this only
  // decides whether the app relaunches into onboarding or the tab bar.
  isAuthed: false,
  hasCompletedSetup: false,

  // Testing flags from the mock's toolbar
  isSpanish: false,
  isOffline: false,

  // Profile & targets
  user: initialUserProfile,
  dailyTargets: initialDailyTargets,
  hasMacroOverride: false,
  dayTargets: initialDayTargets,
  hasCustomDayTargets: true,

  // Nutrition
  consumed: initialTodayConsumed,
  meals: initialLoggedMeals,
  myRecipes: savedRecipes,

  // Training
  exercises: todayWorkoutExercises,
  currentExerciseIndex: 0,
  workoutElapsedTime: 1122, // 18:42, as in the mock
  isWorkoutRunning: false,
  restTimerSeconds: null,
  isWorkoutDoneToday: true,

  // Progress
  checkins: checkinRecords,
  selectedComparePair: ['chk-mar', 'chk-aug'],

  // Notifications & toast
  notifications: notificationsList,
  toastMessage: null,

  // Settings
  deviceSync: {
    appleHealth: true,
    appleWatch: true,
    googleFit: false,
    garmin: false,
    importWorkouts: true,
    importSteps: true,
    addCaloriesBack: false, // Rule 10: off by default
  },
  privacySettings: {
    photosVisibility: 'Only me',
    coachAccess: true,
    shareRecipes: true,
    leaderboards: true,
  },
};

const appSlice = createSlice({
  name: 'app',
  initialState: DEFAULT_STATE,
  reducers: {
    hydrate: (state, action) => ({ ...state, ...action.payload }),
    toggleSpanish: state => {
      state.isSpanish = !state.isSpanish;
    },
    toggleOffline: state => {
      state.isOffline = !state.isOffline;
    },

    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },

    /** Macro builder override — recomputes calories when not given. */
    updateMacros: (state, action) => {
      const { protein, carbs, fat, calories } = action.payload;
      const totalCals = calories || protein * 4 + carbs * 4 + fat * 9;
      state.dailyTargets = {
        maintenance: 2500,
        deficit: 2500 - totalCals,
        calories: totalCals,
        protein,
        carbs,
        fat,
      };
      state.hasMacroOverride = true;
    },
    resetToCalculatedMacros: state => {
      state.dailyTargets = initialDailyTargets;
      state.hasMacroOverride = false;
      state.toastMessage = 'Targets reset to calculated formula';
    },

    updateDayTarget: (state, action) => {
      const { dayIndex, calories, type } = action.payload;
      state.dayTargets[dayIndex] = { ...state.dayTargets[dayIndex], calories, type };
    },
    setHasCustomDayTargets: (state, action) => {
      state.hasCustomDayTargets = action.payload;
    },

    /** Payload is a MealItem already given an id/time by the service. */
    addFoodToMeal: (state, action) => {
      // The mock stamps an id and a log time here; without the id every logged
      // row shares an undefined React key and delete removes the wrong one.
      const item = {
        ...action.payload,
        id: action.payload.id ?? `m_${Date.now()}`,
        time: action.payload.time ?? timeNow(),
      };
      state.meals = [item, ...state.meals];
      state.consumed = {
        calories: state.consumed.calories + item.calories,
        protein: state.consumed.protein + item.protein,
        carbs: state.consumed.carbs + item.carbs,
        fat: state.consumed.fat + item.fat,
      };
      state.toastMessage = `Added ${item.name} (${item.calories} kcal)`;
    },
    deleteMeal: (state, action) => {
      const found = state.meals.find(m => m.id === action.payload);
      if (!found) return;
      state.meals = state.meals.filter(m => m.id !== action.payload);
      state.consumed = {
        calories: Math.max(0, state.consumed.calories - found.calories),
        protein: Math.max(0, state.consumed.protein - found.protein),
        carbs: Math.max(0, state.consumed.carbs - found.carbs),
        fat: Math.max(0, state.consumed.fat - found.fat),
      };
      state.toastMessage = 'Meal removed';
    },
    addRecipeToMine: (state, action) => {
      const recipe = action.payload;
      state.myRecipes = [
        {
          id: `r_${Date.now()}`,
          name: recipe.name,
          calories: recipe.calories,
          protein: recipe.protein,
          version: 'v1',
          state: 'Private',
          items: 'Saved copy from community',
        },
        ...state.myRecipes,
      ];
      state.toastMessage = `Saved "${recipe.name}" to your meals`;
    },

    setCurrentExerciseIndex: (state, action) => {
      state.currentExerciseIndex = action.payload;
    },
    toggleSetComplete: (state, action) => {
      const { exerciseId, setNumber } = action.payload;
      const ex = state.exercises.find(e => e.id === exerciseId);
      if (!ex) return;
      const set = ex.sets.find(s => s.setNumber === setNumber);
      if (set) set.completed = !set.completed;
    },
    updateSetValues: (state, action) => {
      const { exerciseId, setNumber, weight, reps } = action.payload;
      const ex = state.exercises.find(e => e.id === exerciseId);
      if (!ex) return;
      const set = ex.sets.find(s => s.setNumber === setNumber);
      if (set) {
        set.weightLbs = weight;
        set.reps = reps;
      }
    },
    tickWorkoutTimer: state => {
      state.workoutElapsedTime += 1;
    },
    startWorkoutSession: state => {
      state.isWorkoutRunning = true;
      state.isWorkoutDoneToday = false;
      state.workoutElapsedTime = 0;
    },
    finishWorkoutSession: state => {
      state.isWorkoutRunning = false;
      state.isWorkoutDoneToday = true;
      state.user.workoutsCompleted += 1;
    },
    startRestTimer: (state, action) => {
      const seconds = action.payload ?? 150;
      state.restTimerSeconds = seconds;
      const mm = Math.floor(seconds / 60);
      const ss = String(seconds % 60).padStart(2, '0');
      state.toastMessage = `Rest timer set for ${mm}:${ss}`;
    },
    tickRestTimer: state => {
      if (state.restTimerSeconds == null) return;
      state.restTimerSeconds = state.restTimerSeconds > 1 ? state.restTimerSeconds - 1 : null;
    },
    clearRestTimer: state => {
      state.restTimerSeconds = null;
    },

    addCheckin: (state, action) => {
      const record = action.payload;
      state.checkins = [record, ...state.checkins];
      state.user.weight = record.weightLbs;
      state.toastMessage = 'Check-in saved privately';
    },
    setSelectedComparePair: (state, action) => {
      state.selectedComparePair = action.payload;
    },

    markAllNotificationsRead: state => {
      state.notifications = state.notifications.map(n => ({ ...n, unread: false }));
      state.toastMessage = 'All notifications marked as read';
    },

    signIn: state => {
      state.isAuthed = true;
    },
    completeSetup: state => {
      state.hasCompletedSetup = true;
    },
    signOut: state => {
      state.isAuthed = false;
    },

    showToast: (state, action) => {
      state.toastMessage = action.payload;
    },
    dismissToast: state => {
      state.toastMessage = null;
    },

    updateDeviceSync: (state, action) => {
      state.deviceSync = { ...state.deviceSync, ...action.payload };
    },
    updatePrivacy: (state, action) => {
      state.privacySettings = { ...state.privacySettings, ...action.payload };
    },
  },
});

export const {
  hydrate,
  toggleSpanish,
  toggleOffline,
  updateUser,
  updateMacros,
  resetToCalculatedMacros,
  updateDayTarget,
  setHasCustomDayTargets,
  addFoodToMeal,
  deleteMeal,
  addRecipeToMine,
  setCurrentExerciseIndex,
  toggleSetComplete,
  updateSetValues,
  tickWorkoutTimer,
  startWorkoutSession,
  finishWorkoutSession,
  startRestTimer,
  tickRestTimer,
  clearRestTimer,
  addCheckin,
  setSelectedComparePair,
  markAllNotificationsRead,
  signIn,
  signOut,
  completeSetup,
  showToast,
  dismissToast,
  updateDeviceSync,
  updatePrivacy,
} = appSlice.actions;

export default appSlice.reducer;

/* ---------------------------------------------------------------- selectors */
export const selectIsAuthed = s => s.app.isAuthed;
export const selectHasCompletedSetup = s => s.app.hasCompletedSetup;
export const selectUser = s => s.app.user;
export const selectIsSpanish = s => s.app.isSpanish;
export const selectIsOffline = s => s.app.isOffline;
export const selectDailyTargets = s => s.app.dailyTargets;
export const selectHasMacroOverride = s => s.app.hasMacroOverride;
export const selectDayTargets = s => s.app.dayTargets;
export const selectHasCustomDayTargets = s => s.app.hasCustomDayTargets;
export const selectConsumed = s => s.app.consumed;
export const selectMeals = s => s.app.meals;
export const selectMyRecipes = s => s.app.myRecipes;
export const selectExercises = s => s.app.exercises;
export const selectCurrentExerciseIndex = s => s.app.currentExerciseIndex;
export const selectWorkoutElapsed = s => s.app.workoutElapsedTime;
export const selectIsWorkoutRunning = s => s.app.isWorkoutRunning;
export const selectRestTimer = s => s.app.restTimerSeconds;
export const selectIsWorkoutDoneToday = s => s.app.isWorkoutDoneToday;
export const selectCheckins = s => s.app.checkins;
export const selectComparePair = s => s.app.selectedComparePair;
export const selectNotifications = s => s.app.notifications;
export const selectUnreadCount = s => s.app.notifications.filter(n => n.unread).length;
export const selectToast = s => s.app.toastMessage;
export const selectDeviceSync = s => s.app.deviceSync;
export const selectPrivacy = s => s.app.privacySettings;

/**
 * The mock's `t()` — swaps headline copy when Spanish mode is on.
 * Memoized so the returned function keeps its identity while the language is
 * unchanged; a fresh closure per call re-rendered every screen that uses it.
 */
export const selectTranslate = createSelector(
  [selectIsSpanish],
  isSpanish => text => (isSpanish ? spanishHeadlines[text] || text : text),
);
