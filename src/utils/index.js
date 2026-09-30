export { showMessage } from './showMessage';

/** Flattens a Laravel-style { field: [msg] } error bag for Formik.setErrors. */
export function formatBackendErrors(errors) {
  if (!errors || typeof errors !== 'object') return {};
  return Object.keys(errors).reduce((acc, field) => {
    const v = errors[field];
    acc[field] = Array.isArray(v) ? v[0] : String(v);
    return acc;
  }, {});
}

/** 1122 -> "18:42" — the workout elapsed clock. */
export function formatDuration(totalSeconds = 0) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** 150 -> "2:30" — rest timer. */
export const formatClock = formatDuration;

/** 1650 -> "1,650" */
export function formatNumber(n) {
  // Grouped by hand: Hermes' toLocaleString falls back to no separators when
  // the build ships without full ICU, which differs between iOS and Android.
  const num = Number(n || 0);
  const [whole, frac] = String(Math.abs(num)).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${num < 0 ? '-' : ''}${grouped}${frac ? `.${frac}` : ''}`;
}

/** Rounds to one decimal place, dropping a trailing .0 */
export function trimDecimal(n) {
  const v = Math.round(Number(n || 0) * 10) / 10;
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

/** "7:12 am" for a newly logged item. */
export function timeNow(date = new Date()) {
  // Formatted by hand rather than through Intl, which Hermes ships without
  // full ICU data on some Android builds.
  const hours = date.getHours();
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(date.getMinutes()).padStart(2, '0')} ${suffix}`;
}
