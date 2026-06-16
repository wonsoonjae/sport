export type WorkoutType = 'running' | 'strength' | 'cycling' | 'swimming' | 'other';

export interface Workout {
  id: string;
  name: string;
  type: WorkoutType;
  date: string; // e.g. "2026-06-15"
  timeOfDay: string; // e.g. "07:30 AM"
  duration: number; // in minutes
  distance?: number; // in km
  weight?: number; // in kg (for strength training)
  intensity: 'Low' | 'Medium' | 'High';
  calories: number; // in kcal
}

export interface DayActivity {
  intensity: number; // 0 to 100 percentage height mapping
  label: string; // e.g. "06:00"
}

export interface SleepStage {
  name: string;
  durationString: string;
  percentage: number;
}

export interface ProfileData {
  name: string;
  avatarUrl: string;
  memberSince: string;
  targetSteps: number;
  targetCalories: number;
  streakDays: number;
  totalDistance: number;
  totalWorkouts: number;
  totalCalories: number;
}

export interface SleepData {
  score: number;
  duration: string; // e.g., "8h 15m"
  bedtime: string; // e.g., "10:30 PM"
  wakeup: string; // e.g., "06:45 AM"
  stages: {
    deep: number; // %
    rem: number; // %
    light: number; // %
    awake: number; // %
  };
  environment: {
    temperature: number; // e.g., 18.5
    airQuality: number; // e.g., 42 (AQI)
  };
  trends: {
    day: string; // M, T, W...
    score: number; // score percentage height
  }[];
}
