import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  MOCK_WEALTH_GOALS,
} from '../data/wealthTwinData';
import type { WealthGoal } from '../data/wealthTwinData';
import {
  Plus, ChevronRight, Zap, Target,
  CheckCircle2, TrendingUp, AlertCircle, Sparkles,
} from 'lucide-react';
import type { ProfileData } from '../types/profile';
import { containerVars, itemVars, SectionHeader, fmtShort as twinFmtShort } from './twin/TwinUtils';

const fmt = (v: number) =>
  v >= 10000000 ? `${(v / 10000000).toFixed(2)} Cr`
  : v >= 100000 ? `${(v / 100000).toFixed(1)} L`
  : v.toLocaleString('en-IN');

const fmtShort = (v: number) =>
  v >= 10000000 ? `${(v / 10000000).toFixed(1)}Cr`
  : v >= 100000 ? `${(v / 100000).toFixed(0)}L`
  : `${(v / 1000).toFixed(0)}K`;

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  'on-track': { label: 'On Track', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: <TrendingUp className="w-3 h-3" /> },
  'at-risk': { label: 'At Risk', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <AlertCircle className="w-3 h-3" /> },
  achieved: { label: 'Achieved', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
  ahead: { label: 'Ahead', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: <Zap className="w-3 h-3" /> },
};

/* Detail Sheet */
const GoalDetail: React.FC<{ goal: WealthGoal; onClose: () => void }> = ({ goal, onClose }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end" onClick={onClose}>
      <motion.div initial={{ y: 400 }} animate={{ y: 0 }} exit={{ y: 400 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="w-full bg-white rounded-t-[32px] p-6 space-y-5 max-h-[85vh] overflow-y-auto no-scrollbar"
        onClick={e => e.stopPropagation()}>

        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-3xl">{goal.icon}</div>
          <div>
            <h3 className="text-xl font-black text-slate-800">{goal.title}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{goal.category} • Target {goal.targetYear}</p>
          </div>
        </div>

        {/* Confidence */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
              <motion.circle cx="50" cy="50" r="42" fill="none"
                stroke={goal.confidencePct > 70 ? '#10b981' : '#f59e0b'}
                strokeWidth="8" strokeLinecap="round" strokeDasharray="264"
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 - (264 * goal.confidencePct) / 100 }}
                transition={{ duration: 1.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-800">{goal.confidencePct}%</span>
              <span className="text-[8px] font-black uppercase text-slate-400">Confidence</span>
            </div>
          </div>
          <div className="space-y-2 flex-1 text-xs">
            {[
              { l: 'Target', v: `₹${fmt(goal.targetAmount)}` },
              { l: 'Progress', v: `₹${fmt(goal.currentProgress)}` },
              { l: 'Months Accelerated', v: goal.monthsAccelerated > 0 ? `+${goal.monthsAccelerated}` : '—' },
              { l: 'Additional SIP', v: goal.additionalSIPRequired > 0 ? `₹${goal.additionalSIPRequired.toLocaleString('en-IN')}/mo` : 'None needed' },
            ].map(r => (
              <div key={r.l} className="flex justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400">{r.l}</span>
                <span className="font-black text-slate-800">{r.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Linked Assets */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Linked Assets</p>
          <div className="flex flex-wrap gap-2">
            {goal.linkedAssets.map(a => (
              <span key={a} className="text-[10px] font-bold bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600">{a}</span>
            ))}
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-2">{goal.assetCoverageMsg}</p>
        </div>

        <button onClick={onClose} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm">Close</button>
      </motion.div>
    </motion.div>
  );
};

interface GoalsProps {
  profile: ProfileData;
  onSectionChange: (tab: any) => void;
}

const GoalsScreen = ({ profile: _profile, onSectionChange: _onSectionChange }: GoalsProps) => {
  const [selectedGoal, setSelectedGoal] = useState<WealthGoal | null>(null);



  const totalTarget = MOCK_WEALTH_GOALS.reduce((s, g) => s + g.targetAmount, 0);
  const totalProgress = MOCK_WEALTH_GOALS.reduce((s, g) => s + g.currentProgress, 0);
  const avgConfidence = Math.round(MOCK_WEALTH_GOALS.reduce((s, g) => s + g.confidencePct, 0) / MOCK_WEALTH_GOALS.length);

  return (
    <div className="flex-1 flex flex-col min-h-screen text-slate-900 font-sans">
      {/* Header - Mobile Only */}
      <header className="md:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 py-5 flex justify-between items-center">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[.3em] text-emerald-500 mb-1 leading-none">Goal Lattice Engine</p>
          <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">Goal Architect</h1>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} className="bg-slate-900 p-3 rounded-xl text-white shadow-lg">
          <Plus className="w-5 h-5" strokeWidth={3} />
        </motion.button>
      </header>

      <div className="px-5 md:px-0 py-6 md:py-0">
        <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">

          {/* ── Summary & AI Insights Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Summary Column */}
            <div className="lg:col-span-4 space-y-6">
              <motion.div variants={itemVars}>
                <div className="bg-[#fdfcf9] rounded-[32px] p-8 border border-[#e6e4d9] relative shadow-sm">
                  <h3 className="text-sm font-black text-[#1b3a57] uppercase tracking-wider mb-6">Aggregated Progress</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#f5f4f0] border border-[#ebeaeb] rounded-2xl p-4">
                        <p className="text-[8px] font-black uppercase text-[#8a9bb0] mb-2">Total Target</p>
                        <p className="text-xl font-black text-[#1b3a57]">₹{fmtShort(totalTarget)}</p>
                      </div>
                      <div className="bg-[#f5f4f0] border border-[#ebeaeb] rounded-2xl p-4">
                        <p className="text-[8px] font-black uppercase text-[#8a9bb0] mb-2">Confidence</p>
                        <p className={`text-xl font-black ${avgConfidence > 70 ? 'text-[#1f8c5c]' : 'text-[#b45309]'}`}>{avgConfidence}%</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black text-[#8a9bb0] uppercase tracking-widest">Global Funding</p>
                        <p className="text-xs font-black text-[#1b3a57]">{Math.round((totalProgress / totalTarget) * 100)}%</p>
                      </div>
                      <div className="w-full h-3 bg-[#e3e6ea] rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round((totalProgress / totalTarget) * 100)}%` }}
                          transition={{ duration: 1.5 }} className="h-full rounded-full bg-[#1b3a57]" />
                      </div>
                      <p className="text-[9px] text-[#8a9bb0] font-bold text-right uppercase">₹{fmtShort(totalProgress)} Allocated</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVars} className="bg-[#0e212b] rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden hidden lg:block">
                <div className="absolute bottom-0 right-0 p-6 opacity-[0.05] text-[#0cd89a]">
                  <Sparkles className="w-32 h-32" />
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 text-[#0cd89a]">
                    <Zap className="w-4 h-4" />
                    <span className="text-[9px] font-black tracking-[.3em] uppercase">Intelligence</span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight leading-tight">Acceleration Ready</h3>
                  <p className="text-[11px] text-[#8a9bb0] font-medium leading-relaxed">
                    By repurposing dormant cash flows, you can achieve your <span className="text-white font-bold underline decoration-[#0cd89a] leading-none">Home Downpayment</span> 14 months early.
                  </p>
                  <button className="w-full bg-[#0cd89a] text-[#0e212b] py-3 rounded-xl font-black uppercase tracking-widest text-[9px] mt-2">
                    Start Simulation
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Goals Cards Grid */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-8">
                <SectionHeader icon={Target} title="Priority Goals" subtitle="Lattice Sync Active" />
                <button className="hidden md:flex items-center gap-2 bg-[#1b3a57] text-white px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#0e212b] transition-all">
                  <Plus className="w-4 h-4" /> New Objective
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_WEALTH_GOALS.map((goal, i) => {
                  const sc = statusConfig[goal.status] || statusConfig['on-track'];
                  return (
                    <motion.div
                      key={goal.id} variants={itemVars}
                      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                      onClick={() => setSelectedGoal(goal)}
                      className="bg-[#fdfcf9] rounded-[32px] p-8 border border-[#e6e4d9] shadow-sm cursor-pointer group transition-all relative overflow-hidden"
                    >
                      <div className="flex flex-col h-full space-y-6 relative z-10">
                        <div className="flex justify-between items-start">
                          <div className="w-14 h-14 rounded-2xl bg-[#f5f4f0] border border-[#ebeaeb] flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                            {goal.icon}
                          </div>
                          <div className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${sc.bg} ${sc.color} ${sc.border}`}>
                            {sc.icon} {sc.label}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-[#1b3a57] group-hover:text-blue-600 transition-colors">{goal.title}</h3>
                          <p className="text-[10px] font-bold text-[#8a9bb0] uppercase tracking-widest">Active Since {goal.targetYear - 5}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[8px] font-black text-[#8a9bb0] uppercase mb-1">Target</p>
                            <p className="text-base font-black text-[#1b3a57]">₹{twinFmtShort(goal.targetAmount)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] font-black text-[#8a9bb0] uppercase mb-1">Year</p>
                            <p className="text-base font-black text-[#1b3a57]">{goal.targetYear}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-end">
                            <p className="text-[9px] font-black text-[#8a9bb0] uppercase tracking-widest">Progress</p>
                            <p className="text-[10px] font-black text-[#1b3a57]">{goal.progressPct}%</p>
                          </div>
                          <div className="w-full h-2 bg-[#e3e6ea] rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${goal.progressPct}%` }}
                              transition={{ duration: 1.5, delay: i * 0.1 }}
                              className="h-full rounded-full bg-blue-600" />
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#e6e4d9] flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-black text-[#1b3a57] uppercase tracking-widest">{goal.confidencePct}% Confidence</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#d3d0c2] group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Insight Block Mobile Only */}
          <motion.div variants={itemVars}
            className="lg:hidden bg-[#0e212b] rounded-[28px] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 p-6 opacity-[0.03] text-[#0cd89a] pointer-events-none">
              <Sparkles className="w-40 h-40 animate-pulse" />
            </div>
            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-2 text-[#0cd89a]">
                <Zap className="w-5 h-5" />
                <span className="text-[10px] font-black tracking-[.3em] uppercase">Intelligence</span>
              </div>
              <h3 className="text-xl font-black tracking-tight">Acceleration Ready</h3>
              <p className="text-[#8a9bb0] font-medium leading-relaxed">
                By repurposing dormant cash flows, you can achieve your goal 14 months early.
              </p>
              <button className="bg-[#0cd89a] text-[#0e212b] px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px]">
                Authorize Acceleration
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedGoal && <GoalDetail goal={selectedGoal} onClose={() => setSelectedGoal(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default memo(GoalsScreen);
