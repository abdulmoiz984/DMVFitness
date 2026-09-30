export const KEYS = {
  ACCESS_TOKEN: '@access_token',
  APP_STATE: '@dmv_app_state_v1',
  FCM_TOKEN: '@fcm_token',
};

export const APP_NAME = 'DMV Fitness';
export const TAGLINE = 'Family · Faith · Fitness';

export const UI_SCALE = 1;
export const ui = size => Math.round(size * UI_SCALE);

/** The mock renders in a 393pt device frame. */
export const SHELL_MAX_WIDTH = 440;

/** Tabs from AppShell's DmvTabBar. */
export const TAB_IDS = { TODAY: 'today', TRAIN: 'train', DIARY: 'diary', ME: 'me' };

/**
 * Bottom padding every tab screen leaves for the floating tab bar
 * (72pt bar + the raised FAB's overhang), before the safe-area inset.
 */
export const TABBAR_CLEARANCE = 112;
