import { useState } from 'react';
import { 
  Bell, 
  Flame, 
  TrendingUp, 
  Footprints, 
  Plus, 
  ChevronRight, 
  Zap, 
  Award
} from 'lucide-react';
import { Workout, DayActivity, ProfileData } from '../types';
import { INITIAL_INTENSITY } from '../utils';

interface HealthDashboardProps {
  profile: ProfileData;
  workouts: Workout[];
  onAddNewWorkout: (workout: Omit<Workout, 'id'>) => void;
  onNavigateToTab: (tab: 'home' | 'activity' | 'sleep' | 'profile') => void;
  onOpenQuickLog: () => void;
}

export default function HealthDashboard({
  profile,
  workouts,
  onNavigateToTab,
  onOpenQuickLog
}: HealthDashboardProps) {
  const [intensityFilter, setIntensityFilter] = useState<'WEEK' | 'DAY'>('DAY');
  const [showNotifications, setShowNotifications] = useState(false);

  // Dynamic calculations based on user's today and historical workouts
  // Today's steps: let's assume standard steps value base (e.g., 8,542, but can scale based on logged daily runs)
  const stepsBase = 8542;
  const runningWorkoutsToday = workouts.filter(
    (w) => w.type === 'running' && w.date === new Date().toISOString().split('T')[0]
  );
  
  // Extra steps added by daily running workouts (1km is roughly 1300 steps)
  const extraSteps = Math.round(
    runningWorkoutsToday.reduce((acc, w) => acc + (w.distance || 0) * 1300, 0)
  );
  const totalSteps = stepsBase + extraSteps;
  const stepsPercentage = Math.min(100, Math.round((totalSteps / profile.targetSteps) * 100));

  // Today's active calories: calories from all workouts created today + resting exercise base (e.g. 150)
  const workoutsToday = workouts.filter(
    (w) => w.date === new Date().toISOString().split('T')[0]
  );
  const caloriesBurnedTodayCode = workoutsToday.reduce((acc, w) => acc + w.calories, 0);
  const totalCaloriesBurned = 150 + caloriesBurnedTodayCode;
  const caloriesPercentage = Math.min(100, Math.round((totalCaloriesBurned / profile.targetCalories) * 100));

  // Circular progress ring definitions
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76
  const strokeDashoffset = circumference - (stepsPercentage / 100) * circumference;

  // Render horizontal workouts (the carousel)
  const recentWorkouts = workouts.slice(0, 3);

  // Filter intensity heights representing randomized exercise load for day vs week
  const intensityData: DayActivity[] = INITIAL_INTENSITY.map((item, idx) => {
    if (intensityFilter === 'WEEK') {
      const heights = [30, 45, 20, 50, 40, 60, 30, 45, 60, 50, 30, 15];
      return { ...item, intensity: heights[idx] };
    }
    return item;
  });

  return (
    <div className="pt-20 pb-32 px-5 max-w-lg mx-auto space-y-6" id="health-dashboard-screen">
      {/* Top App Bar Header */}
      <header className="flex justify-between items-center h-16 w-full" id="dashboard-header">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onNavigateToTab('profile')}
            className="w-10 h-10 rounded-full border-2 border-secondary-fixed-dim overflow-hidden active:scale-95 transition-transform duration-200 cursor-pointer"
          >
            <img 
              alt="User profile avatar" 
              className="w-full h-full object-cover" 
              src={profile.avatarUrl} 
            />
          </div>
          <div>
            <span className="text-[11px] font-mono font-medium text-on-surface-variant/50 block">STATUS: PEAK FORM</span>
            <h1 className="font-sans text-xl font-bold text-on-background tracking-tight">
              Good morning, {profile.name.split(' ')[0]}
            </h1>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary hover:opacity-80 transition-all active:scale-95 duration-150 cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-fixed-dim animate-ping"></span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-fixed-dim"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 bg-surface-container-high border border-white/5 rounded-xl p-4 shadow-2xl z-50">
              <h3 className="font-mono text-xs text-primary mb-3 font-semibold uppercase tracking-wider">🔔 SYSTEM ALERTS</h3>
              <div className="space-y-3">
                <div className="text-xs text-on-surface-variant">
                  <p className="font-semibold text-on-surface">Weekly Goal Met!</p>
                  <p className="text-[10px] opacity-70">Awesome job, you reached your active minutes milestone.</p>
                </div>
                <hr className="border-white/5" />
                <div className="text-xs text-on-surface-variant">
                  <p className="font-semibold text-on-surface">Streak Warning</p>
                  <p className="text-[10px] opacity-70">Log an active workout today to maintain your {profile.streakDays} days streak.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Steps Card */}
      <section className="bg-surface-container-low border border-white/5 rounded-2xl p-6 flex flex-col justify-between min-h-[200px] glow-green group" id="steps-card">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-mono text-[10px] font-bold text-on-surface-variant/40 tracking-widest uppercase">DAILY STEPS</p>
            <h2 className="font-sans text-4xl font-extrabold mt-1 text-secondary-fixed-dim tracking-tight">
              {totalSteps.toLocaleString()}
            </h2>
            <p className="text-xs text-on-surface-variant/60 font-mono mt-1">
              +{extraSteps} steps from logged workouts
            </p>
          </div>
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                className="text-surface-container stroke-current" 
                cx="50" 
                cy="50" 
                fill="transparent" 
                r={radius} 
                strokeWidth="7" 
              />
              <circle 
                className="text-secondary-fixed-dim stroke-current transition-all duration-800" 
                cx="50" 
                cy="50" 
                fill="transparent" 
                r={radius} 
                strokeWidth="7" 
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Footprints className="w-5 h-5 text-secondary-fixed-dim" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <div className="h-1.5 flex-1 bg-surface-container rounded-full overflow-hidden">
            <div 
              className="h-full bg-secondary-fixed-dim rounded-full transition-all duration-1000"
              style={{ width: `${stepsPercentage}%` }}
            ></div>
          </div>
          <span className="font-mono text-[10px] font-semibold text-on-surface-variant tracking-wider">
            {stepsPercentage}% OF {(profile.targetSteps / 1000)}K
          </span>
        </div>
      </section>

      {/* Calories Bento Card */}
      <section className="bg-surface-container-low border border-white/5 rounded-2xl p-6 flex flex-col justify-between min-h-[160px] glow-blue group" id="calories-card">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-mono text-[10px] font-bold text-on-surface-variant/40 tracking-widest uppercase">ACTIVE CALORIES</p>
            <div className="flex items-baseline gap-1 mt-1">
              <h2 className="font-sans text-4xl font-extrabold text-primary tracking-tight">
                {totalCaloriesBurned}
              </h2>
              <span className="font-sans text-[15px] font-medium text-on-surface-variant/40">kcal</span>
            </div>
            <p className="text-xs text-on-surface-variant/60 font-mono mt-0.5">
              Target: {profile.targetCalories} kcal
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
            <Flame className="w-6 h-6 fill-primary/30" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-xs text-on-surface-variant">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span>{caloriesPercentage}% of daily goal burnt</span>
        </div>
      </section>

      {/* Daily Intensity Chart Section */}
      <section className="bg-surface-container-low border border-white/5 rounded-2xl p-5" id="intensity-chart">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-sans text-[15px] font-semibold text-on-background">Daily Intensity</h3>
            <p className="text-[10px] text-on-surface-variant/40 font-mono uppercase tracking-wider">Metabolic strain index</p>
          </div>
          <div className="flex gap-1.5 bg-surface-container-low p-1 rounded-lg border border-white/5">
            <button 
              onClick={() => setIntensityFilter('WEEK')}
              className={`px-3 py-1.5 rounded-md font-mono text-[10px] font-semibold transition-all cursor-pointer ${
                intensityFilter === 'WEEK' 
                  ? 'bg-surface-bright text-on-surface' 
                  : 'text-on-surface-variant/40 hover:text-on-surface-variant/60'
              }`}
            >
              WEEK
            </button>
            <button 
              onClick={() => setIntensityFilter('DAY')}
              className={`px-3 py-1.5 rounded-md font-mono text-[10px] font-semibold transition-all cursor-pointer ${
                intensityFilter === 'DAY' 
                  ? 'bg-primary text-on-primary font-bold' 
                  : 'text-on-surface-variant/50 hover:text-on-surface-variant'
              }`}
            >
              DAY
            </button>
          </div>
        </div>

        {/* Dynamic Intensity Bars */}
        <div className="h-32 flex items-end justify-between gap-1 px-1">
          {intensityData.map((bar, index) => {
            const isHighIndex = bar.intensity > 70;
            const isMidIndex = bar.intensity > 40 && bar.intensity <= 70;
            const colorClass = isHighIndex 
              ? 'bg-secondary-fixed-dim hover:brightness-110 shadow-[0_0_8px_rgba(42,229,0,0.3)]' 
              : isMidIndex 
                ? 'bg-primary hover:brightness-110 shadow-[0_0_8px_rgba(173,198,255,0.3)]' 
                : 'bg-surface-container-highest/60 hover:bg-surface-container-highest';

            return (
              <div 
                key={index} 
                className="flex-1 flex flex-col justify-end h-full group/bar relative"
              >
                {/* Micro Tooltip */}
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 p-1 rounded bg-surface-container-high text-[9px] text-on-surface font-mono opacity-0 group-hover/bar:opacity-100 transition-opacity duration-150 z-10 pointers-none">
                  {bar.intensity}%
                </span>
                
                <div 
                  className={`w-full rounded-t-sm transition-all duration-700 ${colorClass}`}
                  style={{ height: `${bar.intensity}%` }}
                ></div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between mt-3 px-1 font-mono text-[10px] font-bold text-on-surface-variant/30">
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>00:00</span>
        </div>
      </section>

      {/* Recent Workouts Carousel */}
      <section className="space-y-3" id="recent-workouts-carousel">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-sans text-[15px] font-bold text-on-background">Recent Workouts</h3>
            <p className="text-[10px] text-on-surface-variant/50 font-mono tracking-wider">LOGGED BIO-METRICS</p>
          </div>
          <button 
            onClick={() => onNavigateToTab('activity')}
            className="text-primary font-mono text-[11px] font-bold hover:underline hover:opacity-80 flex items-center gap-0.5 cursor-pointer"
          >
            SEE ALL <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Horizontal workout slider */}
        <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2 -mx-5 px-5">
          {recentWorkouts.map((workout) => {
            const isRun = workout.type === 'running';
            const isCycle = workout.type === 'cycling';
            // Custom asset background based on workout type context
            let placeholderUrl = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80'; // general gym
            if (isRun) {
              placeholderUrl = 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&q=80'; // runner trail
            } else if (isCycle) {
              placeholderUrl = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80'; // carbon cycling
            }

            return (
              <div 
                key={workout.id}
                onClick={() => onNavigateToTab('activity')}
                className="flex-shrink-0 w-64 bg-surface-container-low border border-white/5 rounded-2xl p-4 group cursor-pointer hover:bg-surface-container transition-all active:scale-95 duration-150"
              >
                <div className="relative h-28 mb-3 rounded-xl overflow-hidden">
                  <img 
                    alt={workout.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={placeholderUrl} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/10 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10">
                    <span className="font-mono text-[9px] font-bold text-secondary-fixed-dim uppercase tracking-wider">
                      {workout.type}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="font-sans text-[13px] font-bold text-on-surface line-clamp-1">{workout.name}</h4>
                    <p className="font-mono text-[9px] text-on-surface-variant/50 uppercase mt-0.5">
                      {workout.date === new Date().toISOString().split('T')[0] ? 'TODAY' : workout.date}, {workout.timeOfDay}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono text-[10px] font-bold text-on-surface-variant">
                      {workout.distance ? `${workout.distance} KM` : workout.weight ? `${workout.weight} KG` : `${workout.duration} MIN`}
                    </p>
                    <p className="font-mono text-[10px] font-bold text-primary mt-0.5">
                      {workout.duration} MIN
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Achievement Alert banner */}
      <section className="bg-gradient-to-r from-secondary-container/5 to-primary-container/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
        <div className="bg-secondary-fixed-dim/10 p-2.5 rounded-lg text-secondary-fixed-dim shrink-0">
          <Award className="w-5 h-5 active-glow" />
        </div>
        <div>
          <h4 className="font-sans text-xs font-bold text-on-surface">Daily Achievement Multiplier</h4>
          <p className="text-[10px] text-on-surface-variant/60 font-mono mt-0.5">
            Streaks active: <span className="text-secondary-fixed-dim font-bold">{profile.streakDays} days</span>. Keep going!
          </p>
        </div>
      </section>

      {/* FAB representing quick log */}
      <button 
        onClick={onOpenQuickLog}
        className="fixed right-6 bottom-24 w-12 h-12 bg-secondary-fixed-dim hover:brightness-110 text-on-secondary rounded-xl shadow-[0_0_20px_rgba(42,229,0,0.45)] flex items-center justify-center active:scale-90 transition-all duration-150 z-40 cursor-pointer"
        id="quick-add-fab"
        title="Quick Log Workout"
      >
        <Plus className="w-6 h-6 stroke-[2.5px]" />
      </button>
    </div>
  );
}
