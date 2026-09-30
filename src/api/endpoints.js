/**
 * PLACEHOLDER — no DMV Fitness backend exists yet.
 *
 * Swap these URLs for the real ones and set USE_MOCK_API to false; each
 * service below already has its real `api.*` call written next to the mock
 * branch it currently returns.
 */
const DEV_API_URL = 'https://dmv.demoappprojects.com/public/api';
const LIVE_API_URL = 'https://api.dmvfitness.com/public/api';

export const API_DOMAIN = __DEV__ ? DEV_API_URL : LIVE_API_URL;

/** While true, services resolve from src/lib/dmv-data.js and forms don't validate. */
export const USE_MOCK_API = true;

export const ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/v1/auth/login',
  AUTH_REGISTER: '/v1/auth/register',
  AUTH_LOGOUT: '/v1/auth/logout',
  AUTH_VERIFY_EMAIL: '/v1/auth/verify-email',
  AUTH_FORGOT_PASSWORD: '/v1/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/v1/auth/reset-password',

  // Profile & setup
  AUTH_ME: '/v1/auth/me',
  PROFILE: '/v1/profile',
  TARGETS: '/v1/profile/targets',
  TARGETS_BY_DAY: '/v1/profile/targets-by-day',
  DEVICE_SYNC: '/v1/profile/devices',
  PRIVACY: '/v1/profile/privacy',

  // Subscription
  PLANS: '/v1/plans',
  SUBSCRIPTION: '/v1/subscription',

  // Food
  FOOD_SEARCH: '/v1/foods/search',
  FOOD_BARCODE: code => `/v1/foods/barcode/${code}`,
  FOOD: id => `/v1/foods/${id}`,
  DIARY: '/v1/diary',
  DIARY_ENTRY: id => `/v1/diary/${id}`,
  RECIPES: '/v1/recipes',
  COMMUNITY_RECIPES: '/v1/recipes/community',

  // Training
  WORKOUT_TODAY: '/v1/workouts/today',
  WORKOUT_SESSION: '/v1/workouts/session',

  // Progress
  CHECKINS: '/v1/checkins',
  WEIGHT_LOG: '/v1/weight',

  // Motivation
  BADGES: '/v1/badges',
  NOTIFICATIONS: '/v1/notifications',
  NOTIFICATIONS_READ_ALL: '/v1/notifications/read-all',

  // Coach
  COACH_CHAT: '/v1/coach/messages',
};
