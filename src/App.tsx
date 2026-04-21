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
    <div className="h-[100dvh] bg-[#f5f4ef] flex overflow-hidden font-sans selection:bg-blue-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[280px] bg-white border-r border-[#e6e4d9] z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#0e212b] border border-[#1b3a5a] flex items-center justify-center text-[#0cd89a] shadow-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-[#1f8c5c] uppercase tracking-[.3em] leading-none mb-1">SecureWealth</p>
              <h1 className="text-sm font-black tracking-tight leading-none text-[#1b3a57]">Premier Banking</h1>
            </div>
          </div>

          <nav className="space-y-2">
            <SidebarItem 
              icon={<Home className="w-5 h-5" />} 
              label="Wealth Overview" 
              active={activeTab === 'home'} 
              onClick={() => setActiveTab('home')} 
            />
            <SidebarItem 
              icon={<Target className="w-5 h-5" />} 
              label="Financial Goals" 
              active={activeTab === 'goals'} 
              onClick={() => setActiveTab('goals')} 
            />
            <SidebarItem 
              icon={<Brain className="w-5 h-5" />} 
              label="Digital Twin" 
              active={activeTab === 'twin'} 
              onClick={() => setActiveTab('twin')} 
            />
            <SidebarItem 
              icon={<TrendingUp className="w-5 h-5" />} 
              label="Investments" 
              active={activeTab === 'invest'} 
              onClick={() => setActiveTab('invest')} 
            />
            <SidebarItem 
              icon={<ShieldCheck className="w-5 h-5" />} 
              label="Security & Protect" 
              active={activeTab === 'protect'} 
              onClick={() => setActiveTab('protect')} 
            />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-[#e6e4d9]">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            <div className="w-10 h-10 rounded-full bg-[#f5f4f0] text-[#1f8c5c] flex items-center justify-center font-black border-2 border-white shadow-sm">
              {profile.fullName.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold truncate">{profile.fullName}</p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Premium Member</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#f5f4ef]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col overflow-y-auto no-scrollbar scroll-smooth"
          >
            <div className="max-w-[1400px] mx-auto w-full md:px-8 py-0 md:py-8">
              {renderScreen()}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#e6e4d9] px-2 pb-safe z-[100] shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <nav className="flex justify-between h-[68px]">
            <NavItem icon={<Home className="w-[22px] h-[22px]" />} label="Wealth" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavItem icon={<Target className="w-[22px] h-[22px]" />} label="Goals" active={activeTab === 'goals'} onClick={() => setActiveTab('goals')} />
            <NavItem icon={<Brain className="w-[22px] h-[22px]" />} label="Twin" active={activeTab === 'twin'} onClick={() => setActiveTab('twin')} />
            <NavItem icon={<TrendingUp className="w-[22px] h-[22px]" />} label="Invest" active={activeTab === 'invest'} onClick={() => setActiveTab('invest')} />
            <NavItem icon={<ShieldCheck className="w-[22px] h-[22px]" />} label="Protect" active={activeTab === 'protect'} onClick={() => setActiveTab('protect')} />
            <NavItem icon={<User className="w-[22px] h-[22px]" />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          </nav>
        </div>
      </main>
    </div>
  )
}

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
  >
    <div className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className={`text-sm font-bold tracking-tight ${active ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
  </button>
)

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) => {
  return (
    <button onClick={onClick} className="flex-1 flex flex-col items-center justify-center gap-1 relative min-w-0 h-full group outline-none">
      {active && (
        <motion.div
          layoutId="navTabIndicator"
          className="absolute top-0 w-12 h-1 bg-blue-500 rounded-b-full shadow-[0_2px_4px_rgba(59,130,246,0.3)]"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
      <div className={`transition-all duration-300 ${active ? 'text-blue-600 scale-110' : 'text-slate-400'}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold tracking-tight transition-all duration-300 ${active ? 'text-blue-600' : 'text-slate-400'}`}>
        {label}
      </span>
    </button>
  );
};

export default App
