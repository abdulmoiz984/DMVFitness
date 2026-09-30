import { images } from '../assets/images';

/** Progress datasets, ported from the mock's ProgressScreens.tsx. */

export const strengthLifts = [
  {
    name: 'Barbell Bench Press',
    category: 'Chest & Triceps',
    current: '145 lbs × 8 reps',
    baseline: '120 lbs × 8 reps',
    delta: '+25 lbs',
    est1RM: '180 lbs',
    history: [120, 125, 130, 135, 140, 145],
  },
  {
    name: 'Barbell Back Squat',
    category: 'Quads & Glutes',
    current: '195 lbs × 6 reps',
    baseline: '155 lbs × 6 reps',
    delta: '+40 lbs',
    est1RM: '230 lbs',
    history: [155, 165, 175, 185, 190, 195],
  },
  {
    name: 'Romanian Deadlift',
    category: 'Hamstrings & Lower Back',
    current: '175 lbs × 8 reps',
    baseline: '140 lbs × 8 reps',
    delta: '+35 lbs',
    est1RM: '215 lbs',
    history: [140, 145, 155, 165, 170, 175],
  },
  {
    name: 'Hip Thrust',
    category: 'Glutes & Hamstrings',
    current: '245 lbs × 10 reps',
    baseline: '185 lbs × 10 reps',
    delta: '+60 lbs',
    est1RM: '310 lbs',
    history: [185, 205, 215, 225, 235, 245],
  },
  {
    name: 'Overhead Dumbbell Press',
    category: 'Shoulders',
    current: '45 lbs × 10 reps',
    baseline: '35 lbs × 10 reps',
    delta: '+10 lbs',
    est1RM: '58 lbs',
    history: [35, 35, 40, 40, 45, 45],
  },
];

export const bodyMeasurements = [
  { part: 'Waist (Narrowest)', current: 31.5, baseline: 35.0, unit: 'in', delta: '-3.5 in' },
  { part: 'Hips (Widest Point)', current: 38.0, baseline: 40.5, unit: 'in', delta: '-2.5 in' },
  { part: 'Thigh (Right Quad)', current: 22.5, baseline: 24.2, unit: 'in', delta: '-1.7 in' },
  { part: 'Chest / Bust', current: 34.0, baseline: 35.0, unit: 'in', delta: '-1.0 in' },
  { part: 'Arms / Biceps', current: 12.8, baseline: 12.8, unit: 'in', delta: 'Toned' },
];

export const photoTimeline = [
  {
    id: 'aug-2026',
    date: 'August 1, 2026',
    weight: '184.2 lbs',
    waist: '31.5 in',
    isLatest: true,
    front: images.splash03_2,
    side: images.splash03_1,
    back: images.splash03,
  },
  {
    id: 'jun-2026',
    date: 'June 15, 2026',
    weight: '189.5 lbs',
    waist: '33.0 in',
    isLatest: false,
    front: images.splash03_1,
    side: images.splash03,
    back: images.splash02,
  },
  {
    id: 'mar-2026',
    date: 'March 1, 2026 (Baseline)',
    weight: '196.0 lbs',
    waist: '35.0 in',
    isLatest: false,
    front: images.splash02,
    side: images.welcome,
    back: images.splash03,
  },
];

export const workoutFrequency = [
  { week: 'Week 1', count: 5, heightPct: 75, active: false },
  { week: 'Week 2', count: 6, heightPct: 95, active: true },
  { week: 'Week 3', count: 4, heightPct: 60, active: false },
  { week: 'Week 4', count: 6, heightPct: 95, active: true },
];
