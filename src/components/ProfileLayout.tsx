import { useState } from 'react';
import { 
  Trophy, 
  TrendingUp, 
  ChevronRight, 
  User, 
  Watch, 
  Shield, 
  HelpCircle, 
  LogOut, 
  Activity, 
  Settings, 
  Check 
} from 'lucide-react';
import { ProfileData } from '../types';

interface ProfileLayoutProps {
  profile: ProfileData;
  onUpdateProfile: (updated: ProfileData) => void;
}

export default function ProfileLayout({ profile, onUpdateProfile }: ProfileLayoutProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editSteps, setEditSteps] = useState(profile.targetSteps);
  const [editCal, setEditCal] = useState(profile.targetCalories);

  const handleSave = () => {
    onUpdateProfile({
      ...profile,
      name: editName,
      targetSteps: editSteps,
      targetCalories: editCal
    });
    setIsEditing(false);
  };

  return (
    <div className="pt-20 pb-32 px-5 max-w-lg mx-auto space-y-6" id="profile-layout-screen">
      
      {/* Top Banner and Settings gear */}
      <header className="flex justify-between items-center h-12">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary active-glow-blue" />
          <h1 className="font-sans text-xl font-bold text-on-surface tracking-tight">Profile</h1>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-on-surface-variant/40 hover:text-primary transition-colors cursor-pointer"
          title="Edit Profile Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Hero Profile Header Info */}
      <section className="flex flex-col items-center text-center space-y-4" id="profile-hero">
        <div className="relative">
          <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary active-glow relative">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-background-dark">
              <img 
                alt={profile.name} 
                className="w-full h-full object-cover" 
                src={profile.avatarUrl} 
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-secondary-container w-6 h-6 rounded-full border-4 border-background-dark animate-pulse"></div>
          </div>
        </div>

        {isEditing ? (
          <div className="w-full max-w-xs bg-surface-container-high p-4 rounded-2xl border border-white/5 space-y-3">
            <h3 className="font-mono text-[10px] text-primary uppercase font-bold tracking-wider">EDIT BIOMETRICS</h3>
            <div className="space-y-2 text-left">
              <label className="block text-[10px] font-mono text-on-surface-variant/50">NAME</label>
              <input 
                type="text" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-1.5 bg-surface-container border border-white/5 rounded-lg text-xs font-mono text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
            <div className="space-y-2 text-left">
              <label className="block text-[10px] font-mono text-on-surface-variant/50">DAILY STEPS GOAL</label>
              <input 
                type="number" 
                value={editSteps} 
                onChange={(e) => setEditSteps(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-surface-container border border-white/5 rounded-lg text-xs font-mono text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
            <div className="space-y-2 text-left">
              <label className="block text-[10px] font-mono text-on-surface-variant/50">DAILY CALORIES GOAL</label>
              <input 
                type="number" 
                value={editCal} 
                onChange={(e) => setEditCal(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-surface-container border border-white/5 rounded-lg text-xs font-mono text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
            <button 
              onClick={handleSave}
              className="w-full py-2 bg-secondary text-on-secondary text-xs font-mono font-bold uppercase rounded-lg flex items-center justify-center gap-1 hover:brightness-110 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <h2 className="font-sans text-3xl font-extrabold text-on-surface tracking-tight">
              {profile.name}
            </h2>
            <p className="font-mono text-[10px] text-on-surface-variant/60 uppercase tracking-wider">
              Member since {profile.memberSince}
            </p>
          </div>
        )}
      </section>

      {/* Personal Records Bento Grid */}
      <section className="space-y-3" id="personal-records-section">
        <h3 className="font-sans text-[15px] font-bold text-on-surface flex items-center gap-1.5 uppercase tracking-wider">
          <Trophy className="w-4.5 h-4.5 text-primary active-glow-blue" />
          <span>Personal Records</span>
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Total Distance hero card */}
          <div className="col-span-2 bg-[#1C1C1E] border border-white/5 rounded-2xl p-5 flex flex-col justify-between card-glow relative overflow-hidden h-28">
            <p className="font-mono text-[10px] text-on-surface-variant/60 uppercase tracking-widest">
              Total Distance
            </p>
            <div>
              <span className="font-sans text-3xl font-extrabold text-primary">
                {profile.totalDistance.toLocaleString()}
              </span>
              <span className="font-mono text-[10px] font-bold text-on-surface-variant ml-2">KM</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-secondary font-mono mt-1 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% this month</span>
            </div>
            <div className="absolute top-2 right-4 text-white/[0.03] scale-150 transform rotate-12 select-none pointer-events-none">
              <Trophy className="w-24 h-24 stroke-[1px]" />
            </div>
          </div>

          {/* Workouts card count */}
          <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5 space-y-4 card-glow">
            <p className="font-mono text-[10px] text-on-surface-variant/60 uppercase tracking-widest">
              Workouts
            </p>
            <div>
              <span className="font-sans text-3xl font-extrabold text-on-surface font-semibold">
                {profile.totalWorkouts}
              </span>
            </div>
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-3/4 rounded-full"></div>
            </div>
          </div>

          {/* Calories count card */}
          <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5 space-y-4 card-glow">
            <p className="font-mono text-[10px] text-on-surface-variant/60 uppercase tracking-widest">
              Calories
            </p>
            <div>
              <span className="font-sans text-3xl font-extrabold text-on-surface font-semibold">
                {(profile.totalCalories / 1000).toFixed(0)}k
              </span>
              <span className="font-mono text-[10px] font-bold text-on-surface-variant/60 ml-1.5">KCAL</span>
            </div>
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-tertiary-container w-1/2 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Settings Links list */}
      <section className="space-y-1.5" id="settings-menu-list">
        <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
          
          {/* Personal Info */}
          <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all group cursor-pointer">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <span className="font-sans text-sm font-semibold text-on-surface">Personal Info</span>
            </div>
            <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
          </button>

          {/* Connected Devices */}
          <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all group cursor-pointer">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <Watch className="w-5 h-5" />
              </div>
              <span className="font-sans text-sm font-semibold text-on-surface">Connected Devices</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim animate-pulse"></span>
              <span className="font-mono text-[10px] font-bold text-on-surface-variant/60 mr-1.5">2 ACTIVE</span>
              <ChevronRight className="w-4 h-4 text-on-surface-variant/40" />
            </div>
          </button>

          {/* Privacy */}
          <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all group cursor-pointer">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-sans text-sm font-semibold text-on-surface">Privacy</span>
            </div>
            <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
          </button>

          {/* Help & Support */}
          <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all group cursor-pointer">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-surface-variant flex items-center justify-center text-on-surface-variant group-hover:scale-110 transition-transform">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="font-sans text-sm font-semibold text-on-surface">Help &amp; Support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
          </button>
        </div>

        {/* Logout Control Button */}
        <button 
          onClick={() => {
            alert("This is a mockup action. Your session will remain active.");
          }}
          className="w-full flex items-center justify-center gap-2 py-4 text-error/80 hover:text-error transition-all font-mono font-bold text-xs uppercase cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </section>

    </div>
  );
}
