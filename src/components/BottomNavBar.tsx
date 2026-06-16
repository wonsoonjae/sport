import { Home, Dumbbell, Moon, User } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: 'home' | 'activity' | 'sleep' | 'profile';
  setActiveTab: (tab: 'home' | 'activity' | 'sleep' | 'profile') => void;
}

export default function BottomNavBar({ activeTab, setActiveTab }: BottomNavBarProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, activeColor: 'text-secondary-fixed-dim active-glow' },
    { id: 'activity', label: 'Activity', icon: Dumbbell, activeColor: 'text-primary active-glow-blue' },
    { id: 'sleep', label: 'Sleep', icon: Moon, activeColor: 'text-tertiary active-glow-purple' },
    { id: 'profile', label: 'Profile', icon: User, activeColor: 'text-primary active-glow-blue' }
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface-container/90 backdrop-blur-2xl flex justify-around items-center px-4 py-3 pb-safe-margin border-t border-white/5 rounded-t-xl" id="bottom-navbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer ${
              isActive 
                ? `${tab.activeColor} scale-110` 
                : 'text-on-surface-variant/40 hover:text-on-surface-variant/60'
            }`}
            id={`nav-tab-${tab.id}`}
          >
            <Icon className="w-6 h-6 stroke-[2px]" />
            <span className="font-mono text-[10px] uppercase font-medium mt-1 tracking-wider">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
