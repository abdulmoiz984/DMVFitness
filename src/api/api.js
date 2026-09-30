import axios from 'axios';
import { MMKV } from 'react-native-mmkv';
import { QueryClient } from '@tanstack/react-query';
import { showMessage } from '../utils';
import { KEYS } from '../constants';
import { API_DOMAIN } from './endpoints';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 },
  },
});

export const storage = new MMKV();

const api = axios.create({
  baseURL: API_DOMAIN,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    const token = storage.getString(KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  res => res,
  err => {
    const error = err.response;

    if (!error) return Promise.reject(err);

    const status = error.status;
    const message =
      error?.data?.message ||
      error?.data?.error ||
      'Something went wrong. Please try again.';

    // 422 validation errors are handled on the screen via Formik setErrors
    if (status === 422) {
      return Promise.reject(err);
    }

    if (status === 500) {
      showMessage({
        type: 'danger',
        message: error?.data?.error || 'Something went wrong please try again',
      });
    }

    if (status === 400 || status === 401) {
      showMessage({
        type: 'danger',
        message: message || 'Something went wrong! Bad Request',
      });
    }

    if (status === 404) {
      showMessage({ type: 'danger', message: 'Request not found!' });
    }

    if (status === 403) {
      showMessage({ type: 'danger', message: message || 'Forbidden!' });
    }

    return Promise.reject(err);
  },
);

export default api;
