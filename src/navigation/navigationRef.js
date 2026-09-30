import { createNavigationContainerRef } from '@react-navigation/native';

/**
 * Container ref, so navigation can be driven from outside a screen — the same
 * pattern the sibling apps use for their root stack.
 */
export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) navigationRef.navigate(name, params);
}

export default navigationRef;
