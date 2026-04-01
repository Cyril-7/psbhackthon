import { useState } from 'react'
import DashboardScreen from './screens/DashboardScreen'
import GoalsScreen from './screens/GoalsScreen'
import InvestScreen from './screens/InvestScreen'
import ProtectScreen from './screens/ProtectScreen'
import DigitalTwinScreen from './screens/DigitalTwinScreen'
import ProfileScreen from './screens/ProfileScreen'
import { Home, Target, TrendingUp, Brain, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { defaultProfile, type ProfileData } from './types/profile'

type Tab = 'home' | 'goals' | 'invest' | 'protect' | 'twin' | 'profile'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [profile, setProfile] = useState<ProfileData>(defaultProfile)

  const updateProfile = (field: keyof ProfileData, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardScreen profile={profile} />
      case 'goals':
        return <GoalsScreen profile={profile} />
      case 'invest':
        return <InvestScreen profile={profile} />
      case 'protect':
        return <ProtectScreen profile={profile} />
      case 'twin':
        return <DigitalTwinScreen profile={profile} />
      case 'profile':
        return <ProfileScreen profile={profile} onUpdate={updateProfile} />
      default:
        return <DashboardScreen profile={profile} />
    }
  }

  return (
    <div className="h-[100dvh] bg-slate-900 flex flex-col font-sans selection:bg-brand-accent/30 overflow-hidden items-center justify-center p-0 md:p-4">
      <main className="w-full max-w-[430px] h-full md:h-[90vh] md:max-h-[900px] md:rounded-[40px] flex flex-col relative overflow-hidden bg-white shadow-2xl relative">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex-1 flex flex-col overflow-y-auto no-scrollbar scroll-smooth"
            style={{ paddingBottom: '74px' }} /* Match navbar height + extra buffer */
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Bar inside the frame */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 px-2 pb-safe z-[100] shadow-[0_-4px_12px_rgba(0,0,0,0.03)] focus-within:ring-0">
        <nav className="max-w-xl mx-auto flex justify-between h-[68px]">
          
          <NavItem 
            icon={<Home className="w-[22px] h-[22px]" />} 
            label="Wealth" 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
          />
          
          <NavItem 
            icon={<Target className="w-[22px] h-[22px]" />} 
            label="Goals" 
            active={activeTab === 'goals'} 
            onClick={() => setActiveTab('goals')} 
          />

          {/* Core Strategic Intelligence Button (Twin) */}
          <div className="flex-1 flex flex-col items-center justify-center relative min-w-0">
            {activeTab === 'twin' && (
              <motion.div 
                layoutId="navTabIndicator"
                className="absolute top-0 w-12 h-1 bg-blue-500 rounded-b-full shadow-[0_2px_4px_rgba(59,130,246,0.3)]"
              />
            )}
            <button
              onClick={() => setActiveTab('twin')}
              className="flex flex-col items-center justify-center gap-1 group relative h-full w-full"
            >
              <div className={`transition-all duration-300 p-1.5 rounded-full border-2 ${
                activeTab === 'twin' 
                  ? 'border-blue-500 bg-blue-50/50 text-blue-600 scale-105' 
                  : 'border-slate-300 text-slate-400 group-hover:border-slate-400'
              }`}>
                <Brain className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className={`text-[10px] font-bold tracking-tight transition-all duration-300 ${
                activeTab === 'twin' ? 'text-blue-600' : 'text-slate-400'
              }`}>
                My Twin
              </span>
            </button>
          </div>

          <NavItem 
            icon={<TrendingUp className="w-[22px] h-[22px]" />} 
            label="Invest" 
            active={activeTab === 'invest'} 
            onClick={() => setActiveTab('invest')} 
          />
          
          <NavItem 
            icon={<ShieldCheck className="w-[22px] h-[22px]" />} 
            label="Protect" 
            active={activeTab === 'protect'} 
            onClick={() => setActiveTab('protect')} 
          />
          
        </nav>
        </div>
      </main>
    </div>
  )
}

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) => {
  return (
    <button 
      onClick={onClick} 
      className="flex-1 flex flex-col items-center justify-center gap-1 relative min-w-0 h-full group outline-none"
    >
      {/* Top Active Indicator */}
      {active && (
        <motion.div
          layoutId="navTabIndicator"
          className="absolute top-0 w-12 h-1 bg-blue-500 rounded-b-full shadow-[0_2px_4px_rgba(59,130,246,0.3)]"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}

      <div className={`transition-all duration-300 ${active ? 'text-blue-600 scale-110' : 'text-slate-400 group-hover:text-slate-500'}`}>
        {icon}
      </div>
      
      <span className={`text-[10px] font-bold tracking-tight transition-all duration-300 ${active ? 'text-blue-600 font-extrabold' : 'text-slate-400'}`}>
        {label}
      </span>
    </button>
  );
};

export default App
