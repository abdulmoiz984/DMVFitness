import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { DmvOfflineBar, DmvToast } from '../components';
import {
  dismissToast,
  selectIsOffline,
  selectIsWorkoutRunning,
  selectRestTimer,
  selectToast,
  tickRestTimer,
  tickWorkoutTimer,
} from '../redux/slices/appSlice';

/** The mock clears a toast 2.6s after showing it. */
const TOAST_MS = 2600;

/**
 * The workout and rest timers the mock runs inside its store, plus the global
 * toast and offline bar. Mounted once, outside the navigator, so all three
 * keep running across route changes.
 */
const AppChrome = () => {
  const dispatch = useDispatch();
  const toast = useSelector(selectToast);
  const isOffline = useSelector(selectIsOffline);
  const isWorkoutRunning = useSelector(selectIsWorkoutRunning);
  const restTimerSeconds = useSelector(selectRestTimer);

  useEffect(() => {
    if (!isWorkoutRunning) return undefined;
    const id = setInterval(() => dispatch(tickWorkoutTimer()), 1000);
    return () => clearInterval(id);
  }, [isWorkoutRunning, dispatch]);

  useEffect(() => {
    if (!restTimerSeconds || restTimerSeconds <= 0) return undefined;
    const id = setInterval(() => dispatch(tickRestTimer()), 1000);
    return () => clearInterval(id);
  }, [restTimerSeconds, dispatch]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => dispatch(dismissToast()), TOAST_MS);
    return () => clearTimeout(id);
  }, [toast, dispatch]);

  return (
    <View style={styles.layer} pointerEvents="box-none">
      {isOffline ? <DmvOfflineBar /> : null}
      <DmvToast message={toast} onClose={() => dispatch(dismissToast())} />
    </View>
  );
};

const styles = StyleSheet.create({
  layer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});

export default AppChrome;
