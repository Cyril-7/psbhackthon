import { useState } from 'react'
import DashboardScreen from './screens/DashboardScreen'
import GoalsScreen from './screens/GoalsScreen'
import InvestScreen from './screens/InvestScreen'
import ProtectScreen from './screens/ProtectScreen'
import DigitalTwinScreen from './screens/DigitalTwinScreen'
import ProfileScreen from './screens/ProfileScreen'
import { Home, Target, TrendingUp, Brain, ShieldCheck, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { defaultProfile, type ProfileData } from './types/profile'

type Tab = 'home' | 'goals' | 'invest' | 'protect' | 'twin' | 'profile'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem('securewealth_profile')
    return saved ? JSON.parse(saved) : defaultProfile
  })

  const updateProfile = (field: keyof ProfileData, value: any) => {
    const newProfile = { ...profile, [field]: value }
    setProfile(newProfile)
    localStorage.setItem('securewealth_profile', JSON.stringify(newProfile))
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardScreen profile={profile} onSectionChange={setActiveTab} />
      case 'goals':
        return <GoalsScreen profile={profile} onSectionChange={setActiveTab} />
      case 'invest':
        return <InvestScreen profile={profile} />
      case 'protect':
        return <ProtectScreen profile={profile} />
      case 'twin':
        return <DigitalTwinScreen profile={profile} />
      case 'profile':
        return <ProfileScreen profile={profile} onUpdate={updateProfile} onComplete={() => setActiveTab('home')} />
      default:
        return <DashboardScreen profile={profile} onSectionChange={setActiveTab} />
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

          <NavItem 
            icon={<Brain className="w-[22px] h-[22px]" />} 
            label="My Twin" 
            active={activeTab === 'twin'} 
            onClick={() => setActiveTab('twin')} 
          />

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

          <NavItem 
            icon={<User className="w-[22px] h-[22px]" />} 
            label="Profile" 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
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
