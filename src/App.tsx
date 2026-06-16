import { useState, useEffect } from 'react';
import { 
  loadWorkouts, 
  saveWorkouts, 
  loadProfile, 
  saveProfile, 
  loadSleep, 
  saveSleep, 
  INITIAL_WORKOUTS,
  INITIAL_PROFILE
} from './utils';
import { Workout, ProfileData, SleepData } from './types';
import HealthDashboard from './components/HealthDashboard';
import ActivityTracking from './components/ActivityTracking';
import ActivityHistory from './components/ActivityHistory';
import SleepAnalysis from './components/SleepAnalysis';
import ProfileLayout from './components/ProfileLayout';
import BottomNavBar from './components/BottomNavBar';
import WorkoutQuickLog from './components/WorkoutQuickLog';

export default function App() {
  // Navigation tabs controllers
  const [activeTab, setActiveTab] = useState<'home' | 'activity' | 'sleep' | 'profile'>('home');
  const [historyScreenActive, setHistoryScreenActive] = useState(false);

  // Core state managers
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [sleep, setSleep] = useState<SleepData | null>(null);

  // UI state toggles
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);

  // Initialize and load historical persistence profiles
  useEffect(() => {
    setWorkouts(loadWorkouts());
    setProfile(loadProfile());
    setSleep(loadSleep());
  }, []);

  // Save changes on state upgrades
  const handleAddNewWorkout = (newWorkoutData: Omit<Workout, 'id'>) => {
    const fresh: Workout = {
      ...newWorkoutData,
      id: `w_live_${Date.now()}`
    };
    const updatedLogs = [fresh, ...workouts];
    setWorkouts(updatedLogs);
    saveWorkouts(updatedLogs);

    // Dynamically upgrade profile record statistics when a workout is added
    if (profile) {
      const isRun = fresh.type === 'running';
      const distanceDone = isRun ? (fresh.distance || 5) : 0;
      
      const newProfile: ProfileData = {
        ...profile,
        totalWorkouts: profile.totalWorkouts + 1,
        totalCalories: profile.totalCalories + fresh.calories,
        totalDistance: Number((profile.totalDistance + distanceDone).toFixed(2)),
        streakDays: profile.streakDays + 1
      };
      setProfile(newProfile);
      saveProfile(newProfile);
    }
  };

  const handleDeleteWorkout = (id: string) => {
    if (id === 'dummy_clear_all') {
      // Clear all option
      setWorkouts([]);
      saveWorkouts([]);
      if (profile) {
        const resetProfile: ProfileData = {
          ...profile,
          totalWorkouts: 0,
          totalDistance: 0,
          totalCalories: 0,
          streakDays: 0
        };
        setProfile(resetProfile);
        saveProfile(resetProfile);
      }
      return;
    }

    // Delete single item
    const targetWorkout = workouts.find(w => w.id === id);
    const remaining = workouts.filter(w => w.id !== id);
    setWorkouts(remaining);
    saveWorkouts(remaining);

    // Re-adjust stats slightly
    if (profile && targetWorkout) {
      const isRun = targetWorkout.type === 'running';
      const distanceDone = isRun ? (targetWorkout.distance || 0) : 0;
      
      const newProfile: ProfileData = {
        ...profile,
        totalWorkouts: Math.max(0, profile.totalWorkouts - 1),
        totalCalories: Math.max(0, profile.totalCalories - targetWorkout.calories),
        totalDistance: Number(Math.max(0, profile.totalDistance - distanceDone).toFixed(2))
      };
      setProfile(newProfile);
      saveProfile(newProfile);
    }
  };

  const handleResetToDefault = () => {
    setWorkouts(INITIAL_WORKOUTS);
    saveWorkouts(INITIAL_WORKOUTS);
    setProfile(INITIAL_PROFILE);
    saveProfile(INITIAL_PROFILE);
    alert('Logs & parameters successfully re-synchronized to pristine default settings!');
  };

  const handleUpdateProfile = (updatedProfile: ProfileData) => {
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
  };

  const handleUpdateSleepGoal = (newScore: number) => {
    if (sleep) {
      const updatedSleep = {
        ...sleep,
        score: newScore
      };
      setSleep(updatedSleep);
      saveSleep(updatedSleep);
    }
  };

  const handleSaveTodayData = () => {
    // Save aggregate totals logic (mock save toast inside tracker)
    if (profile) {
      const updated = {
        ...profile,
        streakDays: profile.streakDays + 1
      };
      setProfile(updated);
      saveProfile(updated);
    }
  };

  const handleNavigateTab = (tab: 'home' | 'activity' | 'sleep' | 'profile') => {
    setHistoryScreenActive(false);
    setActiveTab(tab);
  };

  if (!profile || !sleep) {
    return (
      <div className="flex items-center justify-center min-h-[90vh]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-mono text-on-surface-variant/60 uppercase tracking-widest animate-pulse">
            CALIBRATING ENERGY MATRICES...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark text-on-background selection:bg-primary-container selection:text-on-primary-container relative overflow-x-hidden">
      
      {/* Dynamic Content Views */}
      <main className="animate-fade-in duration-300">
        {activeTab === 'home' && (
          <HealthDashboard 
            profile={profile}
            workouts={workouts}
            onAddNewWorkout={handleAddNewWorkout}
            onNavigateToTab={handleNavigateTab}
            onOpenQuickLog={() => setIsQuickLogOpen(true)}
          />
        )}

        {activeTab === 'activity' && (
          historyScreenActive ? (
            <ActivityHistory 
              workouts={workouts}
              onDeleteWorkout={handleDeleteWorkout}
              onResetToDefault={handleResetToDefault}
              onBackToDashboard={() => setHistoryScreenActive(false)}
              onOpenQuickLog={() => setIsQuickLogOpen(true)}
            />
          ) : (
            <ActivityTracking 
              profile={profile}
              workouts={workouts}
              onOpenQuickLog={() => setIsQuickLogOpen(true)}
              onNavigateToHistory={() => setHistoryScreenActive(true)}
              onSaveTodayData={handleSaveTodayData}
            />
          )
        )}

        {activeTab === 'sleep' && (
          <SleepAnalysis 
            sleepData={sleep}
            onUpdateSleepGoal={handleUpdateSleepGoal}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileLayout 
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {/* Floating Modal for Logging Sport Workout */}
      {isQuickLogOpen && (
        <WorkoutQuickLog 
          onClose={() => setIsQuickLogOpen(false)}
          onSave={handleAddNewWorkout}
        />
      )}

      {/* Bottom Nav Bar */}
      <BottomNavBar 
        activeTab={activeTab} 
        setActiveTab={handleNavigateTab} 
      />
    </div>
  );
}
