import { useState } from 'react';
import { 
  Bell, 
  Wind, 
  Thermometer, 
  Moon, 
  Sparkles, 
  Activity,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { SleepData } from '../types';

interface SleepAnalysisProps {
  sleepData: SleepData;
  onUpdateSleepGoal: (newScore: number) => void;
}

export default function SleepAnalysis({ sleepData, onUpdateSleepGoal }: SleepAnalysisProps) {
  const [targetScore, setTargetScore] = useState(sleepData.score);
  const [showGoalEditor, setShowGoalEditor] = useState(false);

  // Dynamic circular progress calculation
  const radius = 100;
  const circumference = 2 * Math.PI * radius; // ~628.3
  const strokeDashoffset = circumference - (targetScore / 100) * circumference;

  const handleUpdate = () => {
    onUpdateSleepGoal(targetScore);
    setShowGoalEditor(false);
  };

  return (
    <div className="pt-20 pb-32 px-5 max-w-lg mx-auto space-y-6" id="sleep-analysis-screen">
      
      {/* Top App Bar Sleep Header */}
      <header className="flex justify-between items-center h-12">
        <div className="flex items-center gap-3">
          <Moon className="w-6 h-6 text-tertiary active-glow-purple" />
          <div>
            <span className="text-[10px] font-mono font-bold text-tertiary tracking-widest uppercase block">RECOVERY DIAGNOSTICS</span>
            <h1 className="font-sans text-xl font-bold text-on-surface tracking-tight">Sleep Analysis</h1>
          </div>
        </div>
        <button className="text-on-surface-variant/40 hover:text-tertiary transition-colors">
          <Bell className="w-5 h-5" />
        </button>
      </header>

      {/* Hero Sleep Analysis Gauge */}
      <section className="flex flex-col items-center justify-center p-4 bg-surface-container-low/50 border border-white/5 rounded-2xl" id="sleep-gauge-section">
        <div className="relative w-60 h-60 flex items-center justify-center">
          {/* SVG Circular Gauge */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
            <circle 
              className="text-surface-container-highest stroke-current" 
              cx="120" 
              cy="120" 
              fill="transparent" 
              r={radius} 
              strokeWidth="9" 
            />
            <circle 
              className="text-tertiary stroke-current transition-all duration-1000 sleep-gradient-glow font-bold" 
              cx="120" 
              cy="120" 
              fill="transparent" 
              r={radius} 
              strokeWidth="9" 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-[9px] font-bold text-on-surface-variant/40 tracking-widest">SLEEP SCORE</span>
            <span className="font-sans text-5xl font-extrabold text-tertiary mt-1 active-glow-purple">
              {targetScore}%
            </span>
            <span className="font-mono text-xs text-on-surface/80 mt-1.5 font-bold">
              {sleepData.duration} total
            </span>
          </div>
        </div>

        {/* Target Editor toggle */}
        <div className="mt-2">
          <button 
            onClick={() => setShowGoalEditor(!showGoalEditor)}
            className="font-mono text-[10px] text-tertiary/70 hover:text-tertiary uppercase hover:underline cursor-pointer"
          >
            {showGoalEditor ? '[ CLOSE EDITOR ]' : '[ EDIT SLEEP GOALS ]'}
          </button>
        </div>

        {showGoalEditor && (
          <div className="mt-4 w-full p-4 bg-surface-container-high rounded-xl border border-white/10 space-y-3">
            <label className="block text-[11px] font-mono text-on-surface-variant/80 uppercase">Target Re-Calibration Score (%):</label>
            <div className="flex gap-2">
              <input 
                type="range" 
                min="40" 
                max="100" 
                value={targetScore} 
                onChange={(e) => setTargetScore(Number(e.target.value))}
                className="flex-1 accent-tertiary"
              />
              <span className="font-mono text-xs font-bold text-tertiary w-8 text-center">{targetScore}%</span>
            </div>
            <button 
              onClick={handleUpdate}
              className="w-full py-1.5 bg-tertiary text-on-tertiary text-xs font-mono font-bold uppercase rounded-lg hover:brightness-110 cursor-pointer"
            >
              Calibrate Gauge
            </button>
          </div>
        )}

        {/* Bedtime / Wake up details */}
        <div className="flex gap-16 mt-6 border-t border-white/5 pt-4 w-full justify-around px-2">
          <div className="flex flex-col items-center">
            <span className="font-mono text-[10px] font-bold text-on-surface-variant/40 tracking-wider">BEDTIME</span>
            <span className="font-sans text-sm font-bold text-on-surface mt-1">{sleepData.bedtime}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-mono text-[10px] font-bold text-on-surface-variant/40 tracking-wider">WAKE UP</span>
            <span className="font-sans text-sm font-bold text-on-surface mt-1">{sleepData.wakeup}</span>
          </div>
        </div>
      </section>

      {/* Sleep Stages Breakdown */}
      <section className="space-y-3" id="sleep-stages-section">
        <h2 className="font-sans text-[15px] font-bold text-on-surface">Sleep Stages</h2>
        <div className="bg-surface-container-low border border-white/5 rounded-2xl p-4">
          
          {/* Stacked indicator bar */}
          <div className="flex h-10 w-full rounded-xl overflow-hidden mb-6 border border-white/5">
            <div className="bg-tertiary-container w-[20%] h-full transition-all duration-300" title="Deep Sleep"></div>
            <div className="bg-primary-container w-[25%] h-full transition-all duration-300" title="REM Sleep"></div>
            <div className="bg-primary w-[45%] h-full transition-all duration-300" title="Light Sleep"></div>
            <div className="bg-surface-variant w-[10%] h-full transition-all duration-300" title="Awake Time"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-tertiary-container shrink-0"></div>
              <div className="min-w-0">
                <span className="font-mono text-[9px] font-bold text-on-surface-variant/50 tracking-wider block uppercase">DEEP SLEEP</span>
                <span className="text-xs text-on-surface font-semibold font-mono">1h 42m (20%)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary-container shrink-0"></div>
              <div className="min-w-0">
                <span className="font-mono text-[9px] font-bold text-on-surface-variant/50 tracking-wider block uppercase">REM</span>
                <span className="text-xs text-on-surface font-semibold font-mono">2h 05m (25%)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary shrink-0"></div>
              <div className="min-w-0">
                <span className="font-mono text-[9px] font-bold text-on-surface-variant/50 tracking-wider block uppercase">LIGHT SLEEP</span>
                <span className="text-xs text-on-surface font-semibold font-mono">3h 50m (45%)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-surface-variant shrink-0"></div>
              <div className="min-w-0">
                <span className="font-mono text-[9px] font-bold text-on-surface-variant/50 tracking-wider block uppercase">AWAKE</span>
                <span className="text-xs text-on-surface font-semibold font-mono">0h 38m (10%)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sleep Trends representation (Sunday highlighted) */}
      <section className="space-y-3" id="sleep-trends-section">
        <div className="flex justify-between items-center">
          <h2 className="font-sans text-[15px] font-bold text-on-surface">Sleep Trends</h2>
          <span className="font-mono text-[9px] font-bold text-primary tracking-widest uppercase">LAST 7 DAYS</span>
        </div>

        <div className="bg-surface-container-low border border-white/5 rounded-2xl p-5 h-44 flex items-end justify-between gap-2">
          {sleepData.trends.map((item, index) => {
            const isSunday = item.day === 'S' && index === 6; // last day is Sunday
            return (
              <div key={index} className="flex flex-col items-center flex-1 gap-2 h-full justify-end">
                <div className="w-full bg-tertiary/10 rounded-t-md relative group h-24 overflow-hidden">
                  <div 
                    className={`absolute bottom-0 w-full rounded-t-md transition-all duration-700 ${
                      isSunday 
                        ? 'bg-tertiary glow-purple hover:brightness-110' 
                        : 'bg-tertiary/40 hover:bg-tertiary/60'
                    }`}
                    style={{ height: `${item.score}%` }}
                  ></div>
                </div>
                <span className={`font-mono text-[10px] font-semibold ${
                  isSunday ? 'text-tertiary font-bold' : 'text-on-surface-variant/40'
                }`}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sleep Environment Quality metrics */}
      <section className="space-y-3 font-mono" id="sleep-environment-section">
        <h2 className="font-sans text-[15px] font-bold text-on-surface">Sleep Environment</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-1 text-primary">
              <Thermometer className="w-4 h-4 text-primary" />
              <span className="text-[9px] font-bold uppercase tracking-wider">ROOM TEMP</span>
            </div>
            <span className="font-sans text-base font-extrabold text-on-surface">{sleepData.environment.temperature}°C</span>
            <span className="text-[10px] text-secondary font-bold uppercase">Optimal</span>
          </div>

          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-1 text-primary">
              <Wind className="w-4 h-4 text-primary" />
              <span className="text-[9px] font-bold uppercase tracking-wider">AIR QUALITY</span>
            </div>
            <span className="font-sans text-base font-extrabold text-on-surface">{sleepData.environment.airQuality} AQI</span>
            <span className="text-[10px] text-secondary font-bold uppercase font-sans">Excellent</span>
          </div>
        </div>
      </section>

      {/* Sleep Tips AI banner */}
      <section className="bg-surface-container-low/80 border border-tertiary/10 rounded-2xl p-4 flex gap-3">
        <div className="bg-tertiary/10 text-tertiary p-2.5 rounded-lg shrink-0">
          <Sparkles className="w-5 h-5 active-glow-purple" />
        </div>
        <div>
          <h4 className="font-sans text-xs font-bold text-on-surface">Recommended: Sleep Window</h4>
          <p className="text-[10px] text-on-surface-variant/60 font-mono mt-0.5">
            Sustained 88% scores are linked with consistent bedtimes. Maintain a 10:30 PM bedtime tonight to extend cycle recovery triggers.
          </p>
        </div>
      </section>

    </div>
  );
}
