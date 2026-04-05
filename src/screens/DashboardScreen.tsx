import React, { memo } from 'react';
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
  Bell, ShieldCheck, Sparkles, ArrowUpRight, ArrowDownLeft, TrendingUp,
  Layers, Zap, Clock, Shield,
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
  const monthlyIncome = Number(profile.monthlySalary) + Number(profile.sideIncome);
  const monthlyExpenses = Object.values(profile.expenses).reduce((a, b) => Number(a) + Number(b), 0);
  const monthlySavings = monthlyIncome - monthlyExpenses;

  return (
    <div className="flex-1 flex flex-col bg-[#f5f4ef] min-h-screen text-slate-900 overflow-y-auto pb-32 font-sans no-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#f5f4ef]/90 backdrop-blur-xl border-b border-[#e6e4d9] flex justify-between items-center px-6 py-4">
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
          <div className="flex items-center gap-1.5 bg-[#d2efe2] border border-[#bce3d1] px-2.5 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1f8c5c] animate-pulse" />
            <span className="text-[8px] font-black text-[#1f8c5c] uppercase">Live Sync</span>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} className="p-2 bg-[#fdfcf9] rounded-xl text-slate-400 hover:text-slate-900 border border-[#e6e4d9] transition-all shadow-sm">
            <Bell className="w-4 h-4" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => onSectionChange('profile')}
            className="w-9 h-9 rounded-full bg-[#fdfcf9] border-2 border-white shadow-sm overflow-hidden flex items-center justify-center bg-[#f5f4f0] text-[#1f8c5c] font-black text-sm"
          >
            {profile.fullName.charAt(0)}
          </motion.button>
        </div>
      </header>

      <div className="px-5 py-6">
        <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-6">

          {/* ── Net Worth Hero ── */}
          <motion.div variants={itemVars}>
            <div className="relative overflow-hidden bg-[#fdfcf9] rounded-[28px] p-6 text-slate-900 border border-[#e6e4d9] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1f8c5c] animate-pulse" />
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#1f8c5c]">
                        {TWIN_OVERVIEW.institutionsLinked} Institutions Linked
                      </p>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#8a9bb0] mb-1">Unified Net Worth</p>
                    <h2 className="text-[38px] font-black tracking-tight leading-none text-[#1b3a57]">
                      <span className="text-[32px] pr-1">₹</span>{fmt(NET_WORTH_METRICS.total)}
                    </h2>
                  </div>
                  <div className="bg-[#d2efe2] border border-[#bce3d1] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[#1f8c5c] font-black text-[10px] uppercase tracking-widest">
                    <ArrowUpRight className="w-3.5 h-3.5" />+{NET_WORTH_METRICS.annualCAGR}% CAGR
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2.5 pt-5 border-t border-[#e6e4d9]">
                  {[
                    { label: 'Financial', val: `₹${fmtShort(NET_WORTH_METRICS.financialAssets)}`, color: 'text-[#1b3a57]' },
                    { label: 'Physical', val: `₹${fmtShort(totalPhysical)}`, color: 'text-[#1b3a57]' },
                    { label: 'Debt', val: `-₹${fmtShort(NET_WORTH_METRICS.liabilities)}`, color: 'text-[#536375]' },
                    { label: 'Runway', val: `${NET_WORTH_METRICS.emergencyRunwayMonths}mo`, color: 'text-[#1b3a57]' },
                  ].map(m => (
                    <div key={m.label} className="bg-[#f5f4f0] border border-[#ebeaeb] rounded-xl p-2.5 text-center">
                      <p className="text-[7px] font-black uppercase text-[#8a9bb0] mb-1">{m.label}</p>
                      <p className={`text-sm font-black ${m.color}`}>{m.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Quick Stats ── */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div variants={itemVars} className="bg-[#fdfcf9] p-5 rounded-2xl border border-[#e6e4d9] shadow-sm">
              <p className="text-[8px] font-black text-[#8a9bb0] uppercase tracking-widest mb-2">Monthly Surplus</p>
              <div className="flex items-end justify-between">
                <h3 className="text-xl font-black text-[#1b3a57]">₹{monthlySavings.toLocaleString('en-IN')}</h3>
                <div className="w-7 h-7 rounded-lg bg-[#d2efe2] flex items-center justify-center text-[#1f8c5c]"><TrendingUp className="w-3.5 h-3.5" /></div>
              </div>
            </motion.div>
            <motion.div variants={itemVars} className="bg-[#fdfcf9] p-5 rounded-2xl border border-[#e6e4d9] shadow-sm">
              <p className="text-[8px] font-black text-[#8a9bb0] uppercase tracking-widest mb-2">Wealth Velocity</p>
              <div className="flex items-end justify-between">
                <h3 className="text-xl font-black text-[#1b3a57]">{TWIN_OVERVIEW.wealthVelocity}</h3>
                <div className="w-7 h-7 rounded-lg bg-[#eff6ff] flex items-center justify-center text-[#1d4ed8]"><Zap className="w-3.5 h-3.5" /></div>
              </div>
            </motion.div>
          </div>

          {/* ── Net Worth Timeline ── */}
          <motion.div variants={itemVars}>
            <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[24px] p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-black text-[#1b3a57] text-sm uppercase tracking-tight">Wealth Timeline</h3>
                  <p className="text-[9px] font-bold text-[#8a9bb0] uppercase tracking-widest mt-0.5">6-Month Rolling</p>
                </div>
                <span className="text-[9px] font-black text-[#1f8c5c] bg-[#d2efe2] border border-[#bce3d1] px-2 py-1 rounded-full flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />+{NET_WORTH_METRICS.monthlyGrowth}%
                </span>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_NET_WORTH_TIMELINE} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1f8c5c" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#1f8c5c" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6e4d9" />
                    <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#8a9bb0', fontWeight: 700 }} axisLine={false} tickLine={false} dy={6} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ background: '#0e212b', border: 'none', borderRadius: 12, color: '#fff', fontSize: 10, padding: '8px 12px' }}
                      labelStyle={{ color: '#8a9bb0', fontWeight: 700, fontSize: 9, textTransform: 'uppercase' }}
                      formatter={(val: any) => [`₹${fmtShort(val)}`, '']}
                    />
                    <Area type="monotone" dataKey="total" stroke="#1f8c5c" strokeWidth={3} fill="url(#dashGrad)" dot={{ r: 3, fill: '#1f8c5c', strokeWidth: 2, stroke: '#fff' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* ── Asset Allocation Donut ── */}
          <motion.div variants={itemVars}>
            <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[24px] p-5 shadow-sm flex items-center gap-6">
              <div className="w-36 h-36 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={allocationData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={58} paddingAngle={5} stroke="none">
                      {allocationData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#0e212b', border: 'none', borderRadius: 12, color: '#fff', fontSize: 10, padding: '8px 12px' }}
                      formatter={(val: any) => [`₹${fmtShort(val)}`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 flex-1">
                <p className="text-[9px] font-black text-[#8a9bb0] uppercase tracking-widest mb-3 leading-none">Asset Allocation</p>
                {allocationData.map(a => (
                  <div key={a.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                      <span className="text-[10px] font-bold text-[#536375]">{a.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-[#1b3a57]">₹{fmtShort(a.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Top AI Interventions ── */}
          <motion.div variants={itemVars}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#b45309]" />
                <h3 className="text-xs font-black text-[#1b3a57] uppercase tracking-wide">AI Interventions</h3>
              </div>
              <span className="text-[9px] font-black text-[#b45309] uppercase">Gemini Intelligence</span>
            </div>
            <div className="space-y-3">
              {MOCK_AI_INTERVENTIONS.slice(0, 3).map(int => (
                <div key={int.id} className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-2xl p-4 flex items-start gap-4 hover:shadow-sm transition-all shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 border grayscale opacity-80 ${int.priority === 'critical' ? 'bg-[#fef2f2] border-[#fecaca]' : 'bg-[#fff8e6] border-[#fde68a]'}`}>
                    {int.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-[#1b3a57] leading-tight mb-1">{int.title}</h4>
                    <p className="text-[10px] text-[#8a9bb0] font-medium line-clamp-2">{int.description}</p>
                  </div>
                  <span className={`text-[9px] font-black shrink-0 uppercase tracking-widest ${int.impactPositive ? 'text-[#1f8c5c]' : 'text-[#991b1b]'}`}>{int.impact}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Recent Linked Accounts ── */}
          <motion.div variants={itemVars}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1d4ed8]" />
                <h3 className="text-xs font-black text-[#1b3a57] uppercase tracking-wide">Linked Nodes</h3>
              </div>
              <span className="text-[9px] font-bold text-[#8a9bb0] uppercase tracking-widest">{MOCK_LINKED_ACCOUNTS.length} ACTIVE NODE</span>
            </div>
            <div className="space-y-2">
              {MOCK_LINKED_ACCOUNTS.slice(0, 5).map(acc => (
                <div key={acc.id} className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-all shadow-[0_1px_8px_rgba(0,0,0,0.01)]">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0 grayscale opacity-80"
                    style={{ background: '#f5f4f0', border: `1px solid #ebeaeb` }}>
                    {acc.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1b3a57] truncate">{acc.institution}</p>
                    <p className="text-[9px] text-[#8a9bb0] font-medium uppercase tracking-tighter leading-none mt-1">{acc.accountType} • {acc.accountNumber}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xs font-black ${acc.balance < 0 ? 'text-[#991b1b]' : 'text-[#1b3a57]'}`}>
                      {acc.balance < 0 ? '-' : ''}₹{fmtShort(Math.abs(acc.balance))}
                    </p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <Clock className="w-2.5 h-2.5 text-[#d3d0c2]" />
                      <span className="text-[8px] text-[#8a9bb0] font-black uppercase">{acc.lastSync}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Transaction Ledger ── */}
          <motion.div variants={itemVars}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-[#1b3a57] uppercase tracking-wide">Institutional Ledger</h3>
              <button className="text-[9px] font-black text-[#1f8c5c] uppercase hover:text-[#166534] transition-colors tracking-widest">View Archives</button>
            </div>
            <div className="space-y-2">
              {MOCK_TRANSACTIONS.map(tx => (
                <div key={tx.id} className="bg-[#fdfcf9] p-4 rounded-xl border border-[#e6e4d9] flex items-center justify-between hover:shadow-sm transition-all shadow-[0_1px_8px_rgba(0,0,0,0.01)] cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-[38px] h-[38px] rounded-[10px] flex items-center justify-center grayscale opacity-80 ${tx.amount > 0 ? 'bg-[#d2efe2] text-[#1f8c5c]' : 'bg-[#f5f4f0] text-[#536375]'}`}>
                      {tx.amount > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#1b3a57] leading-none mb-1.5">{tx.title}</p>
                      <p className="text-[9px] font-bold text-[#8a9bb0] uppercase tracking-widest leading-none">{tx.category} • {tx.date}</p>
                    </div>
                  </div>
                  <p className={`font-black text-[15px] tracking-tight ${tx.amount > 0 ? 'text-[#1f8c5c]' : 'text-[#1b3a57]'}`}>
                    {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Trust Badge ── */}
          <motion.div variants={itemVars} className="pt-6 flex flex-col items-center gap-2 opacity-30">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <p className="text-[9px] font-black tracking-[.3em] uppercase text-slate-500">Vault Encrypted • RBI AA Compliant</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default memo(DashboardScreen);
