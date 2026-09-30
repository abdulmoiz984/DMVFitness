import { storage } from './api';

/** Simulated latency so loading states are exercised in development. */
const MOCK_DELAY = 220;

export function mockResolve(data, delay = MOCK_DELAY) {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
}

export function mockReject(message, status = 400, delay = MOCK_DELAY) {
  return new Promise((_, reject) =>
    setTimeout(
      () => reject({ response: { status, data: { message } }, message }),
      delay,
    ),
  );
}

/** Small JSON-backed table on MMKV, used for records the mock API mutates. */
export function readTable(key, fallback) {
  const raw = storage.getString(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeTable(key, value) {
  storage.set(key, JSON.stringify(value));
  return value;
}
