/** Single source of truth for react-query cache keys. */
export const QK = {
  foods: (q, cat) => ['foods', q ?? '', cat ?? 'all'],
  recipes: ['recipes'],
  communityRecipes: ['recipes', 'community'],
  workoutToday: ['workouts', 'today'],
  badges: ['badges'],
  notifications: ['notifications'],
};
