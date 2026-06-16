import { useState, useEffect, FormEvent } from 'react';
import { X, Save, Zap, Heart, Flame } from 'lucide-react';
import { Workout, WorkoutType } from '../types';

interface WorkoutQuickLogProps {
  onClose: () => void;
  onSave: (workout: Omit<Workout, 'id'>) => void;
}

export default function WorkoutQuickLog({ onClose, onSave }: WorkoutQuickLogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<WorkoutType>('running');
  const [duration, setDuration] = useState(30);
  const [distance, setDistance] = useState(5);
  const [weight, setWeight] = useState(1500);
  const [intensity, setIntensity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [calories, setCalories] = useState(240);

  // Auto-fill defaults and auto-calculate nice metabolic calorie burns based on standard MET formulas
  useEffect(() => {
    let metValue = 6;
    if (type === 'running') {
      metValue = intensity === 'High' ? 11 : intensity === 'Medium' ? 8.5 : 6;
      setName(`Morning Dash ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
    } else if (type === 'strength') {
      metValue = intensity === 'High' ? 6 : intensity === 'Medium' ? 4.5 : 3;
      setName(`Upper Body Blast`);
    } else if (type === 'cycling') {
      metValue = intensity === 'High' ? 10 : intensity === 'Medium' ? 7.5 : 5;
      setName(`Evening Ride`);
    } else if (type === 'swimming') {
      metValue = intensity === 'High' ? 9.8 : intensity === 'Medium' ? 7 : 4.5;
      setName(`Lap Swim`);
    } else {
      metValue = intensity === 'High' ? 8 : intensity === 'Medium' ? 5 : 3;
      setName(`Cardio Drill`);
    }

    // Standard formula: METs * resting calorie metric (approx 1.2 per min at avg weights)
    const calValue = Math.round(metValue * duration * 1.15);
    setCalories(calValue);
  }, [type, intensity, duration]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name,
      type,
      date: new Date().toISOString().split('T')[0], // Logged for today
      timeOfDay: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      duration,
      distance: type === 'strength' || type === 'other' ? undefined : Number(distance),
      weight: type === 'strength' ? Number(weight) : undefined,
      intensity,
      calories
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background-dark/80 backdrop-blur-md z-50 flex items-end justify-center sm:items-center p-4">
      <div 
        className="w-full max-w-md bg-surface-container border border-white/10 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl space-y-6 transform animate-in slide-in-from-bottom duration-300"
        id="workout-quick-log-modal"
      >
        {/* Header Title & Close button */}
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h3 className="font-sans text-lg font-extrabold text-on-surface">Log Active Achievement</h3>
            <p className="text-[9px] text-on-surface-variant/40 font-mono uppercase tracking-wider mt-0.5">Metabolic data stream logging</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg bg-surface-container-high text-on-surface-variant/60 hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* Workout name */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-on-surface-variant/60 uppercase tracking-wider">Workout Label Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning Dash, Core Core Cracking..."
              className="w-full px-4 py-2.5 bg-surface-container-high border border-white/5 rounded-xl text-xs font-mono text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Type Select buttons */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-on-surface-variant/60 uppercase tracking-wider">Category Category</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'running', label: '👟 Run' },
                { type: 'strength', label: '💪 Strength' },
                { type: 'cycling', label: '🚴 Cycle' },
                { type: 'swimming', label: '🏊 Swim' },
                { type: 'other', label: '⚡ Other' }
              ].map((item) => {
                const isSelected = type === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setType(item.type as any)}
                    className={`py-2 px-1 rounded-xl text-[10px] font-mono font-bold tracking-wider transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-primary text-on-primary shadow-[0_0_8px_rgba(173,198,255,0.25)]' 
                        : 'bg-surface-container-high text-on-surface-variant/50 hover:bg-surface-container-highest'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration controller in minutes */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant/60 uppercase tracking-wider">
              <span>Duration Time</span>
              <span className="text-secondary-fixed-dim font-bold">{duration} min</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="180" 
              step="5"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-primary bg-surface-container-high rounded-full"
            />
          </div>

          {/* Context specific variables: Distance vs Weight */}
          {type !== 'strength' && type !== 'other' ? (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant/60 uppercase tracking-wider">
                <span>Distance Run (km)</span>
                <span className="text-primary font-bold">{distance} km</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="42.2" 
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value))}
                className="w-full accent-secondary-fixed-dim bg-surface-container-high rounded-full"
              />
            </div>
          ) : type === 'strength' ? (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant/60 uppercase tracking-wider">
                <span>Total Load Vol (kg)</span>
                <span className="text-secondary-fixed-dim font-bold">{(weight).toLocaleString()} kg</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="12000" 
                step="250"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-secondary-fixed-dim bg-surface-container-high rounded-full"
              />
            </div>
          ) : null}

          {/* Intensity segments selectors */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-on-surface-variant/60 uppercase tracking-wider">Workout Intensity</label>
            <div className="grid grid-cols-3 gap-2">
              {['Low', 'Medium', 'High'].map((lvl) => {
                const isSelected = intensity === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setIntensity(lvl as any)}
                    className={`py-2 px-1 rounded-xl text-[10px] font-mono font-bold tracking-wider transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-secondary-fixed-dim text-on-secondary shadow-[0_0_8px_rgba(42,229,0,0.25)]' 
                        : 'bg-surface-container-high text-on-surface-variant/50 hover:bg-surface-container-highest'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auto estimated calorie count */}
          <div className="p-3.5 bg-surface-container-high rounded-xl border border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary animate-pulse" />
              <div>
                <span className="block text-[8px] font-mono text-on-surface-variant/40 uppercase tracking-widest">METABOLIC MET BURN</span>
                <span className="text-[10px] font-mono text-on-surface-variant/80 font-semibold uppercase">Calorie Burnt Estimate</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-sans text-xl font-extrabold text-primary">{calories}</span>
              <span className="font-mono text-[9px] text-on-surface-variant/50 ml-1">kcal</span>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-secondary-fixed-dim to-primary-container text-on-secondary hover:brightness-110 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(42,229,0,0.2)]"
          >
            <Save className="w-4 h-4" />
            <span>Sync achievement to log book</span>
          </button>
        </form>
      </div>
    </div>
  );
}
