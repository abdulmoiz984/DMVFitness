/**
 * Checks that every user-visible string the web mock renders also exists in
 * the React Native port. Catches dropped rows, retyped labels and typos that
 * a design-token diff cannot see.
 */
const fs = require('fs');
const path = require('path');

const MOCK_ROOT = '/Users/shappteam/Downloads/dmv-fitness-appv3/src';
const APP_ROOT = path.join(__dirname, '..', 'src');

const MOCK_FILES = [
  'components/screens/SplashScreen.tsx',
  'components/screens/OnboardingScreens.tsx',
  'components/screens/AccountScreens.tsx',
  'components/screens/SetupScreens.tsx',
  'components/screens/SubscriptionScreens.tsx',
  'components/screens/DailyScreens.tsx',
  'components/screens/FoodScreens.tsx',
  'components/screens/CommunityScreens.tsx',
  'components/screens/TrainingScreens.tsx',
  'components/screens/ProgressScreens.tsx',
  'components/screens/MotivationScreens.tsx',
  'components/screens/ProfileScreens.tsx',
  'components/dmv-ui/index.tsx',
  'lib/dmv-data.ts',
];

/** Screens the mock defines but never routes — not part of the port. */
const UNROUTED = ['CommunityLibraryScreen'];

/**
 * Strings the mock contains that are deliberately absent from the port, with
 * the reason. Anything not listed here and not found is a real gap.
 */
const EXPECTED_ABSENT = new Map([
  ['Locked for future dates', 'hover tooltip; no equivalent on touch'],
  ['Search & Log Food', 'hover tooltip; no equivalent on touch'],
  ['Trial activated successfully', "dead code — the mock's PaymentScreen renders ChoosePlanScreen"],
  ['Advanced', 'a value in a TypeScript union; no routine uses it'],
]);

const appCorpus = (() => {
  const out = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.js')) out.push(fs.readFileSync(p, 'utf8'));
    }
  })(APP_ROOT);
  let corpus = out.join('\n');
  // Resolve simple numeric constants so template-literal copy such as
  // `Password must be at least ${PASSWORD_MIN} characters` matches the mock.
  for (const m of corpus.matchAll(/const\s+([A-Z][A-Z0-9_]*)\s*=\s*(\d+(?:\.\d+)?)\s*;/g)) {
    corpus = corpus.split('${' + m[1] + '}').join(m[2]);
  }
  return corpus;
})();

/** Normalises whitespace and JSX escapes so both sides compare equal. */
const norm = s =>
  s
    .replace(/\{"\s*"\}|\{' '\}/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&apos;|\\'/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Removes everything that is not copy the user reads: tooltips and a11y
 * labels (no equivalent on a touch screen), class names, and font stacks.
 */
const stripNonCopy = src =>
  src
    .replace(/\b(?:title|alt|aria-label|placeholder-\w+|className|htmlFor|key|id|src|href)=\{?["'`][^"'`]*["'`]\}?/g, ' ')
    .replace(/font-\['[^']*'\]/g, ' ')
    .replace(/\bd="[^"]*"/g, ' ');

const stripUnrouted = src => {
  let out = src;
  for (const name of UNROUTED) {
    const i = out.indexOf(`export function ${name}`);
    if (i !== -1) out = out.slice(0, i);
  }
  return out;
};

let checked = 0;
let missing = 0;
const misses = [];

for (const rel of MOCK_FILES) {
  const full = path.join(MOCK_ROOT, rel);
  if (!fs.existsSync(full)) continue;
  const src = stripNonCopy(stripUnrouted(fs.readFileSync(full, 'utf8')));

  const phrases = new Set();

  // JSX text nodes: >Some copy<
  for (const m of src.matchAll(/>([^<>{}\n][^<>{}]{3,120})</g)) phrases.add(norm(m[1]));
  // string literals used as labels / data values
  for (const m of src.matchAll(/["'`]([A-Z][^"'`\n]{4,110})["'`]/g)) phrases.add(norm(m[1]));

  for (let phrase of phrases) {
    if (!phrase || phrase.length < 5) continue;
    // skip code-ish strings: classnames, ids, imports, colours
    if (/^[a-z-]+$/.test(phrase)) continue;
    if (/[<>{}]|^#|^\.\/|^@|^https?:|^[a-z-]+:[a-z]/.test(phrase)) continue;
    if (/(px|rem|vh|vw)\]|^(flex|grid|absolute|relative|rounded|text-|bg-|border)/.test(phrase)) continue;
    // leftover source fragments rather than copy
    if (/=>|\);|useState|\(\s*["']|^\(|_[A-Za-z]|\|\||&&/.test(phrase)) continue;
    // emoji-prefixed strings are rendered as an <Emoji> plus its own text node
    if (/^\p{Extended_Pictographic}/u.test(phrase)) continue;
    // numbers the port formats at runtime
    if (/^[\d,.]+$/.test(phrase)) continue;
    if (!/[a-z]/.test(phrase)) {
      // ALL CAPS labels are real copy, keep them
    }
    if (EXPECTED_ABSENT.has(phrase)) continue;
    checked++;
    if (!norm(appCorpus).includes(phrase)) {
      missing++;
      misses.push(`${path.basename(rel)}: ${phrase}`);
    }
  }
}

misses.sort();
for (const m of misses) console.log('MISSING COPY  ', m);
console.log(`\nchecked ${checked} phrases · ${missing} missing`);
