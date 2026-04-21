import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  MOCK_LINKED_ACCOUNTS, NET_WORTH_METRICS, MOCK_NET_WORTH_TIMELINE,
  UNIFIED_FINANCIAL_IDENTITY, TWIN_OVERVIEW, MOCK_AI_INTERVENTIONS,
  MOCK_PHYSICAL_ASSETS,
} from '../data/wealthTwinData';
import { MOCK_TRANSACTIONS } from '../data/mockData';
import type { ProfileData } from '../types/profile';
import {
  ShieldCheck, Sparkles, ArrowUpRight, ArrowDownLeft, TrendingUp,
  Layers, Clock, Shield,
} from 'lucide-react';

const fmt = (v: number) =>
  v >= 10000000 ? `${(v / 10000000).toFixed(2)} Cr`
  : v >= 100000 ? `${(v / 100000).toFixed(1)} L`
  : v.toLocaleString('en-IN');

const fmtShort = (v: number) =>
  v >= 10000000 ? `${(v / 10000000).toFixed(1)}Cr`
  : v >= 100000 ? `${(v / 100000).toFixed(0)}L`
  : `${(v / 1000).toFixed(0)}K`;

const allocationData = [
  { name: 'Liquid', value: UNIFIED_FINANCIAL_IDENTITY.totalLiquid, color: '#3b82f6' },
  { name: 'Investments', value: UNIFIED_FINANCIAL_IDENTITY.totalInvestments, color: '#10b981' },
  { name: 'Retirement', value: UNIFIED_FINANCIAL_IDENTITY.totalRetirement, color: '#c5a059' },
  { name: 'Physical', value: MOCK_PHYSICAL_ASSETS.reduce((s, a) => s + a.currentValue, 0), color: '#8b5cf6' },
  { name: 'Business', value: UNIFIED_FINANCIAL_IDENTITY.totalBusiness, color: '#0891b2' },
];

interface DashboardProps {
  profile: ProfileData;
  onSectionChange: (tab: any) => void;
}

const DashboardScreen = ({ profile, onSectionChange }: DashboardProps) => {
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 22 } },
  };

  const totalPhysical = MOCK_PHYSICAL_ASSETS.reduce((s, a) => s + a.currentValue, 0);

  return (
    <div className="flex-1 flex flex-col min-h-screen text-slate-900 font-sans">
      {/* Header - Mobile Only or sticky top for both */}
      <header className="md:hidden sticky top-0 z-50 bg-[#f5f4ef]/90 backdrop-blur-xl border-b border-[#e6e4d9] flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-[46px] h-[46px] rounded-[18px] bg-[#0e212b] border border-[#1b3a5a] flex items-center justify-center text-[#0cd89a] shrink-0 shadow-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] font-black text-[#1f8c5c] uppercase tracking-[.3em] leading-none mb-1">SecureWealth</p>
            <h1 className="text-base font-black tracking-tight leading-none text-[#1b3a57]">Premier Banking</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => onSectionChange('profile')}
            className="w-9 h-9 rounded-full bg-[#fdfcf9] border-2 border-white shadow-sm overflow-hidden flex items-center justify-center bg-[#f5f4f0] text-[#1f8c5c] font-black text-sm"
          >
            {profile.fullName.charAt(0)}
          </motion.button>
        </div>
      </header>

      <div className="px-5 md:px-0 py-6 md:py-0">
        <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-6">
          
          {/* Main Grid Layout for Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column - Hero & Main Insights */}
            <div className="lg:col-span-8 space-y-6">
              {/* ── Net Worth Hero ── */}
              <motion.div variants={itemVars}>
                <div className="relative overflow-hidden bg-[#fdfcf9] rounded-[32px] p-8 text-slate-900 border border-[#e6e4d9] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1f8c5c] animate-pulse" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#1f8c5c]">
                            {TWIN_OVERVIEW.institutionsLinked} Institutions Linked
                          </p>
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-[.2em] text-[#8a9bb0] mb-2">Unified Net Worth</p>
                        <h2 className="text-[44px] md:text-[56px] font-black tracking-tighter leading-none text-[#1b3a57]">
                          <span className="text-[32px] md:text-[40px] pr-2 font-normal text-slate-300">₹</span>{fmt(NET_WORTH_METRICS.total)}
                        </h2>
                      </div>
                      <div className="bg-[#d2efe2] border border-[#bce3d1] px-4 py-2 rounded-full flex items-center gap-2 text-[#1f8c5c] font-black text-xs uppercase tracking-widest self-start md:self-center">
                        <ArrowUpRight className="w-4 h-4" />+{NET_WORTH_METRICS.annualCAGR}% CAGR
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-[#e6e4d9]">
                      {[
                        { label: 'Financial', val: `₹${fmtShort(NET_WORTH_METRICS.financialAssets)}`, color: 'text-[#1b3a57]', icon: <Layers className="w-3.5 h-3.5" /> },
                        { label: 'Physical', val: `₹${fmtShort(totalPhysical)}`, color: 'text-[#1b3a57]', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                        { label: 'Debt', val: `-₹${fmtShort(NET_WORTH_METRICS.liabilities)}`, color: 'text-[#991b1b]', icon: <TrendingUp className="w-3.5 h-3.5 rotate-180" /> },
                        { label: 'Runway', val: `${NET_WORTH_METRICS.emergencyRunwayMonths}mo`, color: 'text-[#1b3a57]', icon: <Clock className="w-3.5 h-3.5" /> },
                      ].map(m => (
                        <div key={m.label} className="bg-[#f5f4f0]/50 border border-[#ebeaeb] rounded-2xl p-4 transition-all hover:bg-white hover:shadow-md group">
                          <div className="flex items-center gap-2 mb-2 text-[#8a9bb0]">
                            {m.icon}
                            <p className="text-[8px] font-black uppercase tracking-widest">{m.label}</p>
                          </div>
                          <p className={`text-lg font-black ${m.color}`}>{m.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── Net Worth Timeline ── */}
              <motion.div variants={itemVars}>
                <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="font-black text-[#1b3a57] text-lg uppercase tracking-tight">Wealth Timeline</h3>
                      <p className="text-[10px] font-bold text-[#8a9bb0] uppercase tracking-widest mt-1">Institutional 6-Month Rolling Analysis</p>
                    </div>
                    <span className="text-[10px] font-black text-[#1f8c5c] bg-[#d2efe2] border border-[#bce3d1] px-3 py-1.5 rounded-full flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4" />+{NET_WORTH_METRICS.monthlyGrowth}% MoM
                    </span>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_NET_WORTH_TIMELINE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1f8c5c" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#1f8c5c" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6e4d9" />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8a9bb0', fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{ background: '#0e212b', border: 'none', borderRadius: 16, color: '#fff', fontSize: 12, padding: '12px 16px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                          labelStyle={{ color: '#8a9bb0', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', marginBottom: 4 }}
                          formatter={(val: any) => [`₹${fmt(val)}`, 'Net Worth']}
                        />
                        <Area type="monotone" dataKey="total" stroke="#1f8c5c" strokeWidth={4} fill="url(#dashGrad)" dot={{ r: 5, fill: '#1f8c5c', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>

              {/* ── Transaction Ledger ── */}
              <motion.div variants={itemVars}>
                <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-black text-[#1b3a57] uppercase tracking-tight">Institutional Ledger</h3>
                      <p className="text-[10px] font-bold text-[#8a9bb0] uppercase tracking-widest mt-1">Real-time settlement tracking</p>
                    </div>
                    <button className="px-4 py-2 bg-[#f5f4f0] rounded-xl text-[10px] font-black text-[#1f8c5c] uppercase hover:bg-[#1f8c5c] hover:text-white transition-all tracking-widest border border-[#e6e4d9]">View Archive</button>
                  </div>
                  <div className="space-y-3">
                    {MOCK_TRANSACTIONS.map(tx => (
                      <div key={tx.id} className="group p-5 rounded-2xl border border-[#e6e4d9] flex items-center justify-between hover:bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${tx.amount > 0 ? 'bg-[#d2efe2] text-[#1f8c5c]' : 'bg-[#f5f4f0] text-[#536375] group-hover:bg-slate-100'}`}>
                            {tx.amount > 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="text-base font-black text-[#1b3a57] leading-none mb-2">{tx.title}</p>
                            <p className="text-[10px] font-bold text-[#8a9bb0] uppercase tracking-widest leading-none">{tx.category} • {tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-black text-xl tracking-tight ${tx.amount > 0 ? 'text-[#1f8c5c]' : 'text-[#1b3a57]'}`}>
                            {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                          </p>
                          <p className="text-[8px] font-black text-[#8a9bb0] uppercase tracking-widest mt-1">Confirmed</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Secondary Actions & Stats */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* ── Asset Allocation Donut ── */}
              <motion.div variants={itemVars}>
                <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
                  <p className="text-[10px] font-black text-[#8a9bb0] uppercase tracking-widest mb-6">Asset Allocation</p>
                  <div className="h-48 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={allocationData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={8} stroke="none">
                          {allocationData.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: '#0e212b', border: 'none', borderRadius: 12, color: '#fff', fontSize: 10, padding: '8px 12px' }}
                          formatter={(val: any) => [`₹${fmtShort(val)}`, '']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {allocationData.map(a => (
                      <div key={a.name} className="flex items-center justify-between p-3 rounded-xl bg-[#f5f4f0]/50 border border-transparent hover:border-[#e6e4d9] hover:bg-white transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: a.color }} />
                          <span className="text-[11px] font-bold text-[#536375] uppercase tracking-wide">{a.name}</span>
                        </div>
                        <span className="text-xs font-black text-[#1b3a57]">₹{fmtShort(a.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ── AI Interventions ── */}
              <motion.div variants={itemVars}>
                <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#b45309]" />
                      <h3 className="text-sm font-black text-[#1b3a57] uppercase tracking-wide">AI Engine</h3>
                    </div>
                    <span className="text-[8px] font-black text-[#b45309] uppercase bg-[#fff8e6] px-2 py-1 rounded-md">Live Intelligence</span>
                  </div>
                  <div className="space-y-4">
                    {MOCK_AI_INTERVENTIONS.slice(0, 3).map(int => (
                      <div key={int.id} className="relative group overflow-hidden">
                        <div className={`p-5 rounded-2xl border transition-all ${int.priority === 'critical' ? 'bg-[#fff1f2] border-[#fecaca]' : 'bg-[#fffbeb] border-[#fde68a] hover:bg-white hover:shadow-lg'}`}>
                          <div className="flex items-start gap-4">
                            <div className="text-2xl">{int.icon}</div>
                            <div>
                              <h4 className="text-sm font-black text-[#1b3a57] mb-1">{int.title}</h4>
                              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{int.description}</p>
                              <p className={`text-[9px] font-black mt-2 uppercase tracking-widest ${int.impactPositive ? 'text-[#1f8c5c]' : 'text-[#991b1b]'}`}>{int.impact}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ── Linked Nodes ── */}
              <motion.div variants={itemVars}>
                <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#1d4ed8]" />
                      <h3 className="text-sm font-black text-[#1b3a57] uppercase tracking-wide">Network Nodes</h3>
                    </div>
                    <span className="text-[9px] font-bold text-[#8a9bb0] uppercase tracking-widest">{MOCK_LINKED_ACCOUNTS.length} ACTIVE</span>
                  </div>
                  <div className="space-y-3">
                    {MOCK_LINKED_ACCOUNTS.slice(0, 4).map(acc => (
                      <div key={acc.id} className="flex items-center gap-4 p-4 rounded-2xl bg-[#f5f4f0]/30 border border-[#e6e4d9]/50 hover:bg-white hover:shadow-md transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-white border border-[#e6e4d9] flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-105">
                          {acc.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-[#1b3a57] truncate uppercase tracking-tight">{acc.institution}</p>
                          <p className="text-[9px] text-[#8a9bb0] font-bold uppercase tracking-tighter leading-none mt-1">{acc.accountType}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-black ${acc.balance < 0 ? 'text-[#991b1b]' : 'text-[#1b3a57]'}`}>
                            ₹{fmtShort(Math.abs(acc.balance))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

          {/* ── Trust Badge ── */}
          <motion.div variants={itemVars} className="py-12 flex flex-col items-center gap-3 opacity-20">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-slate-500" />
              <p className="text-[10px] font-black tracking-[.4em] uppercase text-slate-500">Institutional Encryption • RBI AA Standard</p>
            </div>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">© 2026 SecureWealth Premier • All Rights Reserved</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default memo(DashboardScreen);
