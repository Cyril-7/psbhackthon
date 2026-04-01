import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { MOCK_PORTFOLIO } from '../data/mockData';
import {
  MOCK_LINKED_ACCOUNTS, MOCK_AI_INTERVENTIONS, NET_WORTH_METRICS,
  MOCK_SIMULATION_PATHS, UNIFIED_FINANCIAL_IDENTITY,
} from '../data/wealthTwinData';
import {
  TrendingUp, Search, ChevronRight, ShieldCheck, History, Zap,
  BarChart3, Layers, ArrowUpRight, ArrowRight, Sparkles, Clock, Target,
} from 'lucide-react';
import type { ProfileData } from '../types/profile';
import { SectionHeader, containerVars, itemVars, fmtShort as twinFmtShort } from './twin/TwinUtils';

const fmt = (v: number) =>
  v >= 10000000 ? `${(v / 10000000).toFixed(2)} Cr` :
  v >= 100000 ? `${(v / 100000).toFixed(1)} L` :
  v.toLocaleString('en-IN');

const fmtShort = (v: number) =>
  v >= 10000000 ? `${(v / 10000000).toFixed(1)}Cr` :
  v >= 100000 ? `${(v / 100000).toFixed(0)}L` :
  `${(v / 1000).toFixed(0)}K`;

const investmentAccounts = MOCK_LINKED_ACCOUNTS.filter(a => a.category === 'investment');
const retirementAccounts = MOCK_LINKED_ACCOUNTS.filter(a => a.category === 'retirement');
const allInvestAccounts = [...investmentAccounts, ...retirementAccounts];

const investAllocation = [
  { name: 'Equity MFs', value: 1250000, color: '#1f8c5c', pct: 44 },
  { name: 'Stocks', value: 650000, color: '#1b3a57', pct: 23 },
  { name: 'Digital Gold', value: 350000, color: '#b45309', pct: 12 },
  { name: 'NPS', value: 380000, color: '#1d4ed8', pct: 13 },
  { name: 'EPF + PPF', value: 215000 + 520000, color: '#536375', pct: 26 },
];

const InvestScreen: React.FC<{ profile: ProfileData }> = () => {


  const totalInvestments = UNIFIED_FINANCIAL_IDENTITY.totalInvestments + UNIFIED_FINANCIAL_IDENTITY.totalRetirement;

  return (
    <div className="flex-1 flex flex-col bg-[#f5f4ef] min-h-screen text-[#1b3a57] overflow-y-auto pb-32 font-sans no-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#f5f4ef]/90 backdrop-blur-xl border-b border-[#e6e4d9] px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-[46px] h-[46px] rounded-[18px] bg-[#0e212b] border border-[#1b3a5a] flex items-center justify-center text-[#0cd89a] shrink-0 shadow-lg">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[.3em] text-[#1f8c5c] mb-1 leading-none">Investment Intelligence</p>
            <h1 className="text-xl font-black tracking-tight text-[#1b3a57] leading-none">Alpha Vault</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-[#fdfcf9] rounded-xl text-slate-400 border border-[#e6e4d9] hover:text-slate-900 transition-all shadow-sm">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="px-5 py-6">
        <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-6">

          {/* ── Portfolio Hero ── */}
          <motion.div variants={itemVars}>
            <div className="bg-[#fdfcf9] rounded-[24px] p-6 border border-[#e6e4d9] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
              <div className="w-full md:w-2/5 h-52 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={investAllocation} cx="50%" cy="50%" innerRadius={65} outerRadius={88} paddingAngle={5} dataKey="value" stroke="none">
                      {investAllocation.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#0e212b', border: 'none', borderRadius: 12, color: '#fff', fontSize: 10, padding: '8px 12px' }}
                      formatter={(val: any) => [`₹${twinFmtShort(val)}`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#8a9bb0]">Total AUM</p>
                  <h3 className="text-2xl font-black text-[#1b3a57]">₹{twinFmtShort(totalInvestments)}</h3>
                  <span className="text-[9px] font-black text-[#1f8c5c] flex items-center gap-1 uppercase tracking-widest">
                    <ArrowUpRight className="w-3 h-3" />+{NET_WORTH_METRICS.annualCAGR}% CAGR
                  </span>
                </div>
              </div>

              <div className="w-full md:w-3/5 space-y-3 relative z-10">
                <div className="flex items-center gap-2 mb-3 bg-[#d2efe2] border border-[#bce3d1] w-fit px-3 py-1.5 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5 text-[#1f8c5c]" />
                  <span className="text-[9px] font-black text-[#1f8c5c] uppercase tracking-widest">Portfolio Health: Optimal</span>
                </div>
                {investAllocation.map(asset => (
                  <div key={asset.name} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-[#8a9bb0] flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: asset.color }} /> {asset.name}
                      </span>
                      <span className="text-[#1b3a57] font-black">₹{twinFmtShort(asset.value)}</span>
                    </div>
                    <div className="h-[6px] bg-[#e3e6ea] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${asset.pct}%` }}
                        transition={{ duration: 1.5, ease: 'circOut' }}
                        className="h-full rounded-full" style={{ background: asset.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Investment Accounts ── */}
          <motion.div variants={itemVars}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-500" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Investment Holdings</h3>
              </div>
              <span className="text-[9px] font-bold text-slate-400">{allInvestAccounts.length} Accounts</span>
            </div>
            <div className="space-y-2">
              {allInvestAccounts.map(acc => (
                <motion.div key={acc.id} whileHover={{ x: 2 }}
                  className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:shadow-sm transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={{ background: acc.color + '15', border: `1px solid ${acc.color}25` }}>
                      {acc.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{acc.institution}</p>
                      <p className="text-[9px] font-medium text-slate-400">{acc.accountType} • {acc.accountNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-800">₹{fmtShort(acc.balance)}</p>
                      {acc.growth !== undefined && (
                        <p className={`text-[9px] font-bold ${acc.growth >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                          {acc.growth >= 0 ? '+' : ''}{acc.growth}% p.a.
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Growth Projection ── */}
          <motion.div variants={itemVars}>
            <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">Growth Projection</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">5-Year Forecast</p>
                </div>
                <Sparkles className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_SIMULATION_PATHS.slice(0, 5)} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} dy={6} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 12, color: '#fff', fontSize: 10, padding: '8px 12px' }}
                      formatter={(val: number) => [`₹${fmtShort(val)}`, '']}
                    />
                    <Area type="monotone" dataKey="Conservative" stroke="#ef4444" strokeWidth={2} fill="transparent" strokeDasharray="5 5" dot={false} />
                    <Area type="monotone" dataKey="Optimized" stroke="#10b981" strokeWidth={3} fill="url(#investGrad)"
                      dot={{ r: 3, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* ── AI Strategy Card ── */}
          <motion.div variants={itemVars}>
            <div className="bg-slate-900 rounded-[24px] p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                <BarChart3 className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit mb-4">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Rebalance Intelligence</span>
                </div>
                <h4 className="text-lg font-black tracking-tight mb-2">Gold Overexposure — Rebalance ₹2.8L</h4>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-5">
                  Combined gold (physical + digital) is at <span className="text-amber-400 font-bold">7.4%</span> of net worth vs recommended 5%. 
                  Shifting ₹2.8L to equity mutual funds would improve your diversification score by <span className="text-emerald-400 font-bold">+12 points</span>.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all">
                    Execute Rebalance
                  </button>
                  <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all">
                    View Analysis
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Top Interventions ── */}
          <motion.div variants={itemVars}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Investment Opportunities</h3>
              </div>
            </div>
            <div className="space-y-3">
              {MOCK_AI_INTERVENTIONS.filter(i => ['cash', 'gold', 'investment', 'tax'].includes(i.category)).slice(0, 3).map(int => (
                <div key={int.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-start gap-3 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-slate-50 border border-slate-100 shrink-0">{int.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-slate-800 leading-tight mb-1">{int.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-2">{int.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[10px] font-black ${int.impactPositive ? 'text-emerald-500' : 'text-red-400'}`}>{int.impact}</span>
                    <button className="text-[8px] font-black uppercase text-indigo-500 flex items-center gap-1">
                      {int.actionLabel} <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default memo(InvestScreen);
