import { useState } from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  Search, 
  ArrowUpDown, 
  Filter, 
  Sparkles,
  Dumbbell,
  Check,
  RotateCcw,
  Plus
} from 'lucide-react';
import { Workout, WorkoutType } from '../types';

interface ActivityHistoryProps {
  workouts: Workout[];
  onDeleteWorkout: (id: string) => void;
  onResetToDefault: () => void;
  onBackToDashboard: () => void;
  onOpenQuickLog: () => void;
}

type SortField = 'date' | 'calories' | 'duration';
type SortOrder = 'asc' | 'desc';

export default function ActivityHistory({
  workouts,
  onDeleteWorkout,
  onResetToDefault,
  onBackToDashboard,
  onOpenQuickLog
}: ActivityHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | WorkoutType>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Search & Filter workouts
  const filteredWorkouts = workouts.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedType === 'all' || w.type === selectedType;
    return matchesSearch && matchesFilter;
  });

  // Sort workouts
  const sortedWorkouts = [...filteredWorkouts].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortField === 'calories') {
      comparison = a.calories - b.calories;
    } else if (sortField === 'duration') {
      comparison = a.duration - b.duration;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const handleSortToggle = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="pt-20 pb-32 px-5 max-w-lg mx-auto space-y-6" id="activity-history-screen">
      
      {/* Back to main controls header */}
      <header className="flex justify-between items-center h-12">
        <button 
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-xs font-mono font-bold text-on-surface-variant/70 hover:text-primary transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-primary" />
          <span>BACK</span>
        </button>
        <span className="font-mono text-[10px] font-bold text-on-surface-variant/40 tracking-widest uppercase">
          LOG BOOK RECORDS
        </span>
      </header>

      {/* Screen Title */}
      <div>
        <h1 className="font-sans text-2xl font-extrabold text-on-surface tracking-tight">
          Workout History
        </h1>
        <p className="text-[10px] text-on-surface-variant/50 font-mono tracking-wider mt-0.5 uppercase">
          Inspect, sort &amp; verify daily parameters
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="w-4 h-4 text-on-surface-variant/40" />
        </span>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search workouts by keyword..."
          className="w-full pl-9 pr-4 py-3 bg-surface-container border border-white/5 rounded-xl text-xs text-on-surface font-mono placeholder:text-on-surface-variant/30 focus:border-primary focus:outline-none transition-all focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Quick Filters Options */}
      <section className="space-y-3">
        <p className="font-mono text-[9px] font-bold uppercase text-on-surface-variant/40 tracking-widest">
          FILTER BY TYPE
        </p>
        <div className="flex gap-1.5 overflow-x-auto custom-scrollbar">
          {[
            { key: 'all', label: 'All Logs' },
            { key: 'running', label: 'Running' },
            { key: 'strength', label: 'Strength' },
            { key: 'cycling', label: 'Cycling' },
            { key: 'swimming', label: 'Swimming' },
            { key: 'other', label: 'Other' },
          ].map((type) => (
            <button
              key={type.key}
              onClick={() => setSelectedType(type.key as any)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[9px] font-bold tracking-wider capitalize whitespace-nowrap active:scale-95 transition-all cursor-pointer ${
                selectedType === type.key
                  ? 'bg-secondary-fixed-dim text-on-secondary shadow-[0_0_8px_rgba(42,229,0,0.3)]'
                  : 'bg-surface-container text-on-surface-variant/50 hover:bg-surface-container-high'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </section>

      {/* Sorting Control Bar */}
      <section className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant/60 bg-surface-container-low/50 py-2.5 px-3 border border-white/5 rounded-xl">
        <span className="font-bold flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-primary" />
          <span>SORT BY:</span>
        </span>
        <div className="flex gap-4">
          <button 
            onClick={() => handleSortToggle('date')}
            className={`flex items-center gap-1 font-bold ${sortField === 'date' ? 'text-primary' : 'hover:text-on-surface-variant'}`}
          >
            <span>Date</span>
            <ArrowUpDown className="w-3 h-3" />
          </button>
          <button 
            onClick={() => handleSortToggle('calories')}
            className={`flex items-center gap-1 font-bold ${sortField === 'calories' ? 'text-primary' : 'hover:text-on-surface-variant'}`}
          >
            <span>kcal</span>
            <ArrowUpDown className="w-3 h-3" />
          </button>
          <button 
            onClick={() => handleSortToggle('duration')}
            className={`flex items-center gap-1 font-bold ${sortField === 'duration' ? 'text-primary' : 'hover:text-on-surface-variant'}`}
          >
            <span>Min</span>
            <ArrowUpDown className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* Workout Logs List */}
      <section className="space-y-3">
        {sortedWorkouts.length === 0 ? (
          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-8 text-center space-y-3">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/20 block" data-icon="search_off">search_off</span>
            <p className="text-xs text-on-surface-variant/50 font-mono">
              No matching workout logs tracked.
            </p>
          </div>
        ) : (
          sortedWorkouts.map((workout) => (
            <div 
              key={workout.id}
              className="bg-surface-container-low border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4 group hover:bg-surface-container transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  workout.type === 'running' 
                    ? 'bg-secondary-container/10 text-secondary-fixed-dim' 
                    : workout.type === 'cycling'
                      ? 'bg-secondary-container/10 text-secondary-fixed-dim'
                      : 'bg-primary-container/10 text-primary'
                }`}>
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-sans text-xs font-bold text-on-surface truncate">{workout.name}</h4>
                  <div className="flex gap-2 items-center mt-1 text-[10px] text-on-surface-variant/40 font-mono uppercase">
                    <span>{workout.date}</span>
                    <span>•</span>
                    <span>{workout.timeOfDay}</span>
                    <span>•</span>
                    <span className="text-primary font-bold">{workout.calories} kcal</span>
                  </div>
                </div>
              </div>

              {/* Action Controls & Info */}
              <div className="flex items-center gap-3 shrink-0 text-right">
                <div>
                  <p className="font-mono text-xs font-bold text-on-surface">{workout.duration}m</p>
                  <p className="text-[9px] text-on-surface-variant/40 font-mono uppercase mt-0.5">
                    {workout.distance ? `${workout.distance} KM` : workout.weight ? `${workout.weight} KG` : 'ACTIVE'}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteWorkout(workout.id)}
                  className="p-1.5 rounded bg-surface-container hover:bg-error/15 text-on-surface-variant/40 hover:text-error transition-all active:scale-95 cursor-pointer"
                  title="Delete log"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Clear Logs / Diagnostic Section */}
      <section className="bg-surface-container-low border border-white/5 rounded-2xl p-5 space-y-4">
        <div>
          <h4 className="font-sans text-xs font-bold text-on-surface flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Diagnostic Controls</span>
          </h4>
          <p className="text-[10px] text-on-surface-variant/60 font-mono mt-1">
            Re-synchronize variables to clean default presets or erase temporary data streams.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex-1 py-2.5 border border-error/20 bg-error/5 hover:bg-error/10 text-error rounded-xl font-mono text-[10px] uppercase font-bold transition-all active:scale-95 cursor-pointer"
          >
            Clear Log
          </button>
          
          <button
            onClick={onResetToDefault}
            className="flex-1 py-2.5 border border-white/5 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-xl font-mono text-[10px] uppercase font-bold transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Default</span>
          </button>
        </div>

        {showClearConfirm && (
          <div className="p-4 bg-surface-container-high rounded-xl border border-error/20 space-y-3">
            <p className="text-xs text-on-surface font-semibold font-mono">
              ⚠️ Are you absolutely sure you want to clear your fitness logs? This will reset all current session data.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onDeleteWorkout('dummy_clear_all'); // clears all workouts
                  setShowClearConfirm(false);
                }}
                className="px-3 py-1.5 bg-error text-on-error rounded-lg font-mono text-[10px] font-bold uppercase transition-all cursor-pointer"
              >
                Yes, Clear All
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 bg-surface-container-highest rounded-lg font-mono text-[10px] font-bold uppercase transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Manual Quick Add FAB helper */}
      <button 
        onClick={onOpenQuickLog}
        className="fixed right-6 bottom-24 w-12 h-12 bg-secondary-fixed-dim hover:brightness-110 text-on-secondary rounded-xl shadow-[0_0_20px_rgba(42,229,0,0.45)] flex items-center justify-center active:scale-90 transition-all duration-150 z-40 cursor-pointer"
        title="Quick Log Workout"
      >
        <Plus className="w-6 h-6 stroke-[2.5px]" />
      </button>

    </div>
  );
}
