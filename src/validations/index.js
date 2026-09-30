import * as Yup from 'yup';
import { USE_MOCK_API } from '../api/endpoints';

/**
 * While USE_MOCK_API is true, forms submit without validation so every screen
 * can be tapped straight through against mock data. Flipping that flag in
 * src/api/endpoints.js re-arms every rule below with no screen changes.
 */
export const shouldValidate = !USE_MOCK_API;
const whenLive = schema => (shouldValidate ? schema : undefined);

const PASSWORD_MIN = 8;

export const signInRules = Yup.object().shape({
  email: Yup.string().trim().email('Enter a valid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const createAccountRules = Yup.object().shape({
  name: Yup.string().trim().required('Name is required'),
  email: Yup.string().trim().email('Enter a valid email').required('Email is required'),
  password: Yup.string()
    .min(PASSWORD_MIN, `At least ${PASSWORD_MIN} characters`)
    .required('Password is required'),
});

export const forgotPasswordRules = Yup.object().shape({
  email: Yup.string().trim().email('Enter a valid email').required('Please enter your email address'),
});

export const resetPasswordRules = Yup.object().shape({
  code: Yup.string().trim().length(6, 'Enter the 6-digit code'),
  password: Yup.string().min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`),
  confirm: Yup.string().oneOf([Yup.ref('password')], 'Passwords do not match'),
});

export const aboutYouRules = Yup.object().shape({
  height: Yup.string().trim().required('Height is required'),
  weight: Yup.number().typeError('Enter a number').positive('Enter a valid weight'),
});

export const manualFoodRules = Yup.object().shape({
  name: Yup.string().trim().required('Name is required'),
  calories: Yup.number().typeError('Enter a number').min(0, 'Must be 0 or more'),
});

export const signInSchema = whenLive(signInRules);
export const createAccountSchema = whenLive(createAccountRules);
export const forgotPasswordSchema = whenLive(forgotPasswordRules);
export const resetPasswordSchema = whenLive(resetPasswordRules);
export const aboutYouSchema = whenLive(aboutYouRules);
export const manualFoodSchema = whenLive(manualFoodRules);

/** First error message for the mock's popup-style validation, or null. */
export function firstError(rules, values) {
  if (!shouldValidate) return null;
  try {
    rules.validateSync(values, { abortEarly: true });
    return null;
  } catch (e) {
    return e?.message ?? 'Please check your details.';
  }
}
