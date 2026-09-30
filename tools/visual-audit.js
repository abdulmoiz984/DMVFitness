/**
 * Compares the design values the web mock declares against the ones the RN
 * screens declare, screen by screen. Tailwind utilities and arbitrary values
 * are resolved to points so the two sides can be diffed directly.
 *
 * Reports values the mock uses that the port never mentions. It is a lint,
 * not a proof: a value can legitimately move between a screen and a shared
 * component, so every hit needs a look before it is called a bug.
 */
const fs = require('fs');
const path = require('path');

const MOCK = '/Users/shappteam/Downloads/dmv-fitness-appv3/src';
const APP = path.join(__dirname, '..', 'src');

/** mock file -> the RN files that together implement it */
const PAIRS = [
  ['components/screens/SplashScreen.tsx', ['screens/OnBoard/SplashScreen.js']],
  ['components/screens/OnboardingScreens.tsx', ['screens/OnBoard/OnboardingScreen.js']],
  ['components/screens/AccountScreens.tsx', [
    'components/AuthLayout.js', 'screens/Auth/SignInScreen.js', 'screens/Auth/ForgotPasswordScreen.js',
    'screens/Auth/ResetPasswordScreen.js', 'screens/Auth/CreateAccountScreen.js', 'screens/Auth/VerifyEmailScreen.js',
  ]],
  ['components/screens/SetupScreens.tsx', [
    'components/ScreenShell.js', 'screens/Setup/GoalScreen.js', 'screens/Setup/AboutYouScreen.js',
    'screens/Setup/ActivityScreen.js', 'screens/Setup/TargetPaceScreen.js',
    'screens/Setup/MacroBuilderScreen.js', 'screens/Setup/TargetsByDayScreen.js',
  ]],
  ['components/screens/SubscriptionScreens.tsx', [
    'screens/Subscription/ChoosePlanScreen.js', 'screens/Subscription/SetupCompleteScreen.js',
  ]],
  ['components/screens/DailyScreens.tsx', ['screens/Daily/TodayScreen.js', 'screens/Daily/FoodDiaryScreen.js']],
  ['components/screens/FoodScreens.tsx', [
    'screens/Food/SearchFoodScreen.js', 'screens/Food/BarcodeScanScreen.js', 'screens/Food/FoodDetailScreen.js',
    'screens/Food/AddFoodManualScreen.js', 'screens/Food/MealsRecipesScreen.js',
  ]],
  ['components/screens/CommunityScreens.tsx', [
    'screens/Community/CommunityScreen.js', 'screens/Community/CommentsSheet.js', 'screens/Community/CreatePostModal.js',
  ]],
  ['components/screens/TrainingScreens.tsx', [
    'screens/Training/TodaysWorkoutScreen.js', 'screens/Training/LoggingWorkoutScreen.js',
    'screens/Training/WorkoutCompleteScreen.js', 'screens/Training/ExerciseDetailModal.js',
  ]],
  ['components/screens/ProgressScreens.tsx', [
    'screens/Progress/ProgressScreen.js', 'screens/Progress/NewCheckinScreen.js', 'screens/Progress/CompareCheckinsScreen.js',
  ]],
  ['components/screens/MotivationScreens.tsx', [
    'screens/Motivation/AchievementsScreen.js', 'screens/Motivation/NotificationsScreen.js',
  ]],
  ['components/screens/ProfileScreens.tsx', [
    'screens/Profile/ProfileScreen.js', 'screens/Profile/HealthDevicesScreen.js', 'screens/Profile/SubscriptionScreen.js',
    'screens/Profile/PrivacySharingScreen.js', 'screens/Profile/CoachChatScreen.js',
  ]],
  ['components/dmv-ui/index.tsx', [
    'components/DmvButton.js', 'components/DmvInput.js', 'components/DmvChip.js', 'components/DmvMeter.js',
    'components/DmvSelectCard.js', 'components/DmvProgressRing.js', 'components/DmvSegmentedControl.js',
    'components/DmvTabBar.js', 'components/DmvActionSheet.js', 'components/DmvToast.js',
    'components/DmvOfflineBar.js', 'components/DmvScreenHeader.js', 'components/DmvCard.js',
  ]],
];

const read = (root, rel) => {
  const p = path.join(root, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
};

/**
 * Strips Tailwind state variants. `hover:`/`focus:`/`group-hover:` styles have
 * no equivalent on a touch screen, so they are not gaps in the port.
 */
const dropStateVariants = src =>
  src.replace(/(?:group-)?(?:hover|focus|focus-within|active|disabled|peer-\w+):[^\s"'`]+/g, ' ');

/** Tailwind spacing step -> px */
const SPACE = n => parseFloat(n) * 4;

const mockValues = src => {
  const fonts = new Set();
  const radii = new Set();
  const colors = new Set();

  for (const m of src.matchAll(/text-\[([0-9.]+)px\]/g)) fonts.add(parseFloat(m[1]));
  for (const m of src.matchAll(/rounded-\[([0-9.]+)px\]/g)) radii.add(parseFloat(m[1]));
  // named radii that map to fixed px
  const NAMED = { 'rounded-xl': 12, 'rounded-2xl': 16, 'rounded-lg': 8, 'rounded-md': 6 };
  for (const [cls, px] of Object.entries(NAMED)) if (src.includes(cls)) radii.add(px);
  for (const m of src.matchAll(/#([0-9A-Fa-f]{6})\b/g)) colors.add('#' + m[1].toUpperCase());

  return { fonts, radii, colors };
};

const appValues = srcs => {
  const all = srcs.join('\n');
  const fonts = new Set();
  const radii = new Set();
  const colors = new Set();

  // plain `size={14}` and the ternaries the port uses for active/idle states
  for (const m of all.matchAll(/\bsize=\{([^}]*)\}/g)) {
    for (const n of m[1].matchAll(/(?:^|[^\w.])([0-9]+(?:\.[0-9]+)?)/g)) fonts.add(parseFloat(n[1]));
  }
  for (const m of all.matchAll(/fontSize:\s*Sizer\.fS\(([0-9.]+)\)/g)) fonts.add(parseFloat(m[1]));
  for (const m of all.matchAll(/\bfontSize=\{([0-9.]+)\}/g)) fonts.add(parseFloat(m[1]));
  for (const m of all.matchAll(/borderRadius:\s*([0-9.]+)/g)) radii.add(parseFloat(m[1]));
  for (const m of all.matchAll(/borderRadius:\s*Sizer\.\w+\(([0-9.]+)\)/g)) radii.add(parseFloat(m[1]));
  for (const m of all.matchAll(/\bradius=\{([0-9.]+)\}/g)) radii.add(parseFloat(m[1]));
  for (const m of all.matchAll(/#([0-9A-Fa-f]{6})\b/g)) colors.add('#' + m[1].toUpperCase());
  // rgba(18,18,21,0.95) is the same colour as #121215 — normalise so the diff
  // does not flag a value merely for being written with an alpha channel.
  for (const m of all.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g)) {
    const hex = [m[1], m[2], m[3]].map(n => Number(n).toString(16).padStart(2, '0')).join('');
    colors.add('#' + hex.toUpperCase());
  }
  return { fonts, radii, colors };
};

// Colours that live in the theme rather than in a screen file.
const themeColors = new Set(
  [...read(APP, 'globalStyle/Theme.js').matchAll(/#([0-9A-Fa-f]{6})\b/g)].map(m => '#' + m[1].toUpperCase()),
);
// Colours the mock uses that are never a literal in the port because a shared
// component owns them.
const sharedApp = PAIRS.slice(-1)[0][1].map(f => read(APP, f)).join('\n');
const sharedColors = new Set([...sharedApp.matchAll(/#([0-9A-Fa-f]{6})\b/g)].map(m => '#' + m[1].toUpperCase()));

let totalMissing = 0;
for (const [mockFile, appFiles] of PAIRS) {
  const mv = mockValues(dropStateVariants(read(MOCK, mockFile)));
  const av = appValues(appFiles.map(f => read(APP, f)));

  const missFont = [...mv.fonts].filter(v => !av.fonts.has(v)).sort((a, b) => a - b);
  const missRadius = [...mv.radii].filter(v => !av.radii.has(v)).sort((a, b) => a - b);
  const missColor = [...mv.colors].filter(
    c => !av.colors.has(c) && !themeColors.has(c) && !sharedColors.has(c),
  );

  if (missFont.length || missRadius.length || missColor.length) {
    console.log(`\n${path.basename(mockFile)}  →  ${appFiles.length} file(s)`);
    if (missFont.length) console.log('  font sizes not found in port :', missFont.join(', '));
    if (missRadius.length) console.log('  radii not found in port     :', missRadius.join(', '));
    if (missColor.length) console.log('  colors not found in port    :', missColor.join(', '));
    totalMissing += missFont.length + missRadius.length + missColor.length;
  }
}
console.log(`\ntotal unmatched design values: ${totalMissing}`);
