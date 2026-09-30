import { configureStore } from '@reduxjs/toolkit';
import appReducer, { DEFAULT_STATE } from '../slices/appSlice';

// MMKV persistence disabled — always start from DEFAULT_STATE so the full
// UI flow is shown on every launch.
export const store = configureStore({
  reducer: { app: appReducer },
  preloadedState: { app: DEFAULT_STATE },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
});

export default store;
