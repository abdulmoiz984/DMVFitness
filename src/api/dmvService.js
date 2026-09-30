import api from './api';
import { ENDPOINTS, USE_MOCK_API } from './endpoints';
import { mockResolve } from './mockAdapter';
import {
  badgesList,
  communityRecipes,
  foodDatabase,
  notificationsList,
  savedRecipes,
  todayWorkoutExercises,
} from '../lib/dmv-data';

/* ------------------------------------------------------------------- auth */
export const login = async body => {
  if (USE_MOCK_API) return mockResolve({ token: 'mock-token', email: body?.email ?? '' });
  const res = await api.post(ENDPOINTS.AUTH_LOGIN, body);
  return res.data;
};

export const register = async body => {
  if (USE_MOCK_API) return mockResolve({ token: 'mock-token', ...body });
  const { confirm, ...payload } = body ?? {};
  const res = await api.post(ENDPOINTS.AUTH_REGISTER, payload);
  return res.data;
};

export const verifyEmail = async body => {
  if (USE_MOCK_API) return mockResolve({ verified: true });
  const res = await api.post(ENDPOINTS.AUTH_VERIFY_EMAIL, body);
  return res.data;
};

export const forgotPassword = async body => {
  if (USE_MOCK_API) return mockResolve({ sent: true, email: body?.email });
  const res = await api.post(ENDPOINTS.AUTH_FORGOT_PASSWORD, body);
  return res.data;
};

export const resetPassword = async body => {
  if (USE_MOCK_API) return mockResolve({ reset: true });
  const res = await api.post(ENDPOINTS.AUTH_RESET_PASSWORD, body);
  return res.data;
};

/* ---------------------------------------------------------------- profile */
export const saveProfile = async patch => {
  if (USE_MOCK_API) return mockResolve(patch);
  const res = await api.put(ENDPOINTS.PROFILE, patch);
  return res.data;
};

export const saveTargets = async targets => {
  if (USE_MOCK_API) return mockResolve(targets);
  const res = await api.put(ENDPOINTS.TARGETS, targets);
  return res.data;
};

export const saveDayTargets = async dayTargets => {
  if (USE_MOCK_API) return mockResolve(dayTargets);
  const res = await api.put(ENDPOINTS.TARGETS_BY_DAY, { dayTargets });
  return res.data;
};

export const saveDeviceSync = async patch => {
  if (USE_MOCK_API) return mockResolve(patch);
  const res = await api.put(ENDPOINTS.DEVICE_SYNC, patch);
  return res.data;
};

export const savePrivacy = async patch => {
  if (USE_MOCK_API) return mockResolve(patch);
  const res = await api.put(ENDPOINTS.PRIVACY, patch);
  return res.data;
};

/* ------------------------------------------------------------------- food */
export const searchFoods = async ({ query = '', category = 'all' } = {}) => {
  if (USE_MOCK_API) {
    const q = query.trim().toLowerCase();
    const list = foodDatabase
      .filter(f => (category === 'all' ? true : f.category === category))
      .filter(f => !q || f.name.toLowerCase().includes(q));
    return mockResolve(list, 0);
  }
  const res = await api.get(ENDPOINTS.FOOD_SEARCH, { params: { q: query, category } });
  return res.data;
};

export const lookupBarcode = async code => {
  if (USE_MOCK_API) return mockResolve(foodDatabase.find(f => f.verified) ?? null);
  const res = await api.get(ENDPOINTS.FOOD_BARCODE(code));
  return res.data;
};

export const logFood = async entry => {
  if (USE_MOCK_API) {
    return mockResolve({
      ...entry,
      id: `m_${Date.now()}`,
      time: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date()),
    });
  }
  const res = await api.post(ENDPOINTS.DIARY, entry);
  return res.data;
};

export const removeDiaryEntry = async id => {
  if (USE_MOCK_API) return mockResolve({ id });
  const res = await api.delete(ENDPOINTS.DIARY_ENTRY(id));
  return res.data;
};

export const listRecipes = async () => {
  if (USE_MOCK_API) return mockResolve(savedRecipes, 0);
  const res = await api.get(ENDPOINTS.RECIPES);
  return res.data;
};

export const listCommunityRecipes = async () => {
  if (USE_MOCK_API) return mockResolve(communityRecipes, 0);
  const res = await api.get(ENDPOINTS.COMMUNITY_RECIPES);
  return res.data;
};

/* --------------------------------------------------------------- training */
export const getTodayWorkout = async () => {
  if (USE_MOCK_API) return mockResolve(todayWorkoutExercises, 0);
  const res = await api.get(ENDPOINTS.WORKOUT_TODAY);
  return res.data;
};

export const saveWorkoutSession = async session => {
  if (USE_MOCK_API) return mockResolve({ ...session, saved: true });
  const res = await api.post(ENDPOINTS.WORKOUT_SESSION, session);
  return res.data;
};

/* --------------------------------------------------------------- progress */
export const saveCheckin = async checkin => {
  if (USE_MOCK_API) return mockResolve({ ...checkin, id: `chk_${Date.now()}` });
  const form = new FormData();
  Object.entries(checkin).forEach(([k, v]) => {
    if (v == null) return;
    if (['frontPhoto', 'sidePhoto', 'backPhoto'].includes(k) && typeof v === 'string' && v.startsWith('file:')) {
      form.append(k, { uri: v, name: `${k}.jpg`, type: 'image/jpeg' });
    } else {
      form.append(k, String(v));
    }
  });
  const res = await api.post(ENDPOINTS.CHECKINS, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const logWeight = async weightLbs => {
  if (USE_MOCK_API) return mockResolve({ weightLbs });
  const res = await api.post(ENDPOINTS.WEIGHT_LOG, { weightLbs });
  return res.data;
};

/* ------------------------------------------------------------- motivation */
export const listBadges = async () => {
  if (USE_MOCK_API) return mockResolve(badgesList, 0);
  const res = await api.get(ENDPOINTS.BADGES);
  return res.data;
};

export const listNotifications = async () => {
  if (USE_MOCK_API) return mockResolve(notificationsList, 0);
  const res = await api.get(ENDPOINTS.NOTIFICATIONS);
  return res.data;
};

export const markNotificationsRead = async () => {
  if (USE_MOCK_API) return mockResolve({ ok: true }, 0);
  const res = await api.post(ENDPOINTS.NOTIFICATIONS_READ_ALL);
  return res.data;
};

/* ------------------------------------------------------------------ coach */
export const sendCoachMessage = async text => {
  if (USE_MOCK_API) return mockResolve({ id: `msg_${Date.now()}`, text, from: 'me' });
  const res = await api.post(ENDPOINTS.COACH_CHAT, { text });
  return res.data;
};
