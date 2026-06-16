import { Workout, DayActivity, SleepData, ProfileData } from './types';

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'w1',
    name: 'Morning Run',
    type: 'running',
    date: new Date().toISOString().split('T')[0], // Today
    timeOfDay: '06:30 AM',
    duration: 45,
    distance: 6.42,
    intensity: 'High',
    calories: 450,
  },
  {
    id: 'w2',
    name: 'Strength Training',
    type: 'strength',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
    timeOfDay: '06:00 PM',
    duration: 58,
    weight: 4200,
    intensity: 'Medium',
    calories: 310,
  },
  {
    id: 'w3',
    name: 'Evening Cycle',
    type: 'cycling',
    date: '2026-06-12',
    timeOfDay: '08:15 PM',
    duration: 84,
    distance: 24.8,
    intensity: 'Low',
    calories: 520,
  },
  {
    id: 'w4',
    name: 'Morning Dash',
    type: 'running',
    date: '2026-06-11',
    timeOfDay: '07:30 AM',
    duration: 24,
    distance: 5.2,
    intensity: 'High',
    calories: 350,
  },
  {
    id: 'w5',
    name: 'Upper Body Blast',
    type: 'strength',
    date: '2026-06-10',
    timeOfDay: '06:00 PM',
    duration: 45,
    weight: 3500,
    intensity: 'High',
    calories: 310,
  }
];

export const INITIAL_INTENSITY: DayActivity[] = [
  { label: '06:00', intensity: 20 },
  { label: '', intensity: 35 },
  { label: '', intensity: 60 },
  { label: '', intensity: 45 },
  { label: '12:00', intensity: 85 },
  { label: '', intensity: 30 },
  { label: '', intensity: 25 },
  { label: '', intensity: 55 },
  { label: '18:00', intensity: 40 },
  { label: '', intensity: 75 },
  { label: '', intensity: 20 },
  { label: '00:00', intensity: 10 },
];

export const INITIAL_SLEEP: SleepData = {
  score: 88,
  duration: '8h 15m',
  bedtime: '10:30 PM',
  wakeup: '06:45 AM',
  stages: {
    deep: 20,
    rem: 25,
    light: 45,
    awake: 10,
  },
  environment: {
    temperature: 18.5,
    airQuality: 42,
  },
  trends: [
    { day: 'M', score: 60 },
    { day: 'T', score: 75 },
    { day: 'W', score: 65 },
    { day: 'T', score: 85 },
    { day: 'F', score: 90 },
    { day: 'S', score: 70 },
    { day: 'S', score: 88 },
  ],
};

export const INITIAL_PROFILE: ProfileData = {
  name: '원순제',
  avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  memberSince: 'Oct 2023',
  targetSteps: 10000,
  targetCalories: 600,
  streakDays: 12,
  totalDistance: 1248.5,
  totalWorkouts: 184,
  totalCalories: 92000,
};

// LocalStorage helpers with fallback safety
export function loadWorkouts(): Workout[] {
  try {
    const saved = localStorage.getItem('kinetic_noir_workouts');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse workouts', e);
  }
  return INITIAL_WORKOUTS;
}

export function saveWorkouts(workouts: Workout[]): void {
  try {
    localStorage.setItem('kinetic_noir_workouts', JSON.stringify(workouts));
  } catch (e) {
    console.error('Failed to save workouts', e);
  }
}

export function loadProfile(): ProfileData {
  try {
    const saved = localStorage.getItem('kinetic_noir_profile');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse profile', e);
  }
  return INITIAL_PROFILE;
}

export function saveProfile(profile: ProfileData): void {
  try {
    localStorage.setItem('kinetic_noir_profile', JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function loadSleep(): SleepData {
  try {
    const saved = localStorage.getItem('kinetic_noir_sleep');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse sleep data', e);
  }
  return INITIAL_SLEEP;
}

export function saveSleep(sleep: SleepData): void {
  try {
    localStorage.setItem('kinetic_noir_sleep', JSON.stringify(sleep));
  } catch (e) {
    console.error('Failed to save sleep data', e);
  }
}
