import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltipJS,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltipJS,
  Filler,
  Legend
);
import { Target, ChevronRight, BarChart3 } from 'lucide-react';
import { MOCK_WEALTH_GOALS, MOCK_SIMULATION_PATHS } from '../../data/wealthTwinData';
import type { WealthGoal } from '../../data/wealthTwinData';
import { 
  containerVars, itemVars, fmtShort, SectionHeader, ProgressBar 
} from './TwinUtils';



const GoalDetailSheet: React.FC<{ goal: WealthGoal; onClose: () => void }> = ({ goal, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
    onClick={onClose}
  >
    <motion.div
      initial={{ y: 400 }} animate={{ y: 0 }} exit={{ y: 400 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="w-full bg-white rounded-t-[32px] p-6 space-y-5 max-h-[85vh] overflow-y-auto no-scrollbar"
      onClick={e => e.stopPropagation()}
    >
      <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-3xl grayscale opacity-80">{goal.icon}</div>
        <div>
          <h3 className="text-xl font-black text-slate-900 leading-tight">{goal.title}</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{goal.category} • TARGET {goal.targetYear}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none" stroke="#0f172a" strokeWidth="8" strokeDasharray="264"
              initial={{ strokeDashoffset: 264 }}
              animate={{ strokeDashoffset: 264 - (264 * goal.confidencePct) / 100 }}
              transition={{ duration: 1.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-900">{goal.confidencePct}%</span>
            <span className="text-[8px] font-black uppercase text-slate-400">Match</span>
          </div>
        </div>
        <div className="space-y-2 flex-1">
          {[
            { label: 'Target Corpus', val: `₹${fmtShort(goal.targetAmount)}` },
            { label: 'Asset Funding', val: `₹${fmtShort(goal.currentProgress)}` },
            { label: 'Registry Links', val: goal.linkedAssets.length },
          ].map(r => (
            <div key={r.label} className="flex justify-between text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wide text-[9px]">{r.label}</span>
              <span className="font-black text-slate-900">{r.val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Linked Collateral</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {goal.linkedAssets.map(a => (
            <span key={a} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{a}</span>
          ))}
        </div>
        <p className="text-xs text-slate-600 font-medium leading-relaxed">{goal.assetCoverageMsg}</p>
      </div>

      <button onClick={onClose} className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">
        Close Planning Sheet
      </button>
    </motion.div>
  </motion.div>
);

const GoalLatticePanel: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<WealthGoal | null>(null);

  const totalGoalTarget = MOCK_WEALTH_GOALS.reduce((s, g) => s + g.targetAmount, 0);
  const totalGoalProgress = MOCK_WEALTH_GOALS.reduce((s, g) => s + g.currentProgress, 0);
  const avgConfidence = Math.round(MOCK_WEALTH_GOALS.reduce((s, g) => s + g.confidencePct, 0) / MOCK_WEALTH_GOALS.length);

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">

      {/* ── Goal Hero Overview ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fcfbf9] rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 relative overflow-hidden border border-[#e6e4d9] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1b3a57] shadow-[0_0_8px_rgba(27,58,87,0.3)]" />
              <p className="text-[9px] font-black uppercase tracking-widest text-[#5c6065]">Lattice Logic Engine • 2030-2050 Forecast</p>
            </div>
            
            <p className="text-[#5c6065] text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Consolidated Fund Progress</p>
            <p className="text-5xl font-black text-[#1b3a57] tracking-tighter leading-none mb-6">
              {Math.round((totalGoalProgress / totalGoalTarget) * 100)}% <span className="text-[#8a9bb0] text-3xl font-medium">Funded</span>
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Active Goals', val: MOCK_WEALTH_GOALS.length, color: 'text-[#5c6065]' },
                { label: 'Total Corpus', val: `₹${fmtShort(totalGoalTarget)}`, color: 'text-[#1b3a57]' },
                { label: 'Confidence', val: `${avgConfidence}%`, color: 'text-[#1f8c5c]' },
              ].map(item => (
                <div key={item.label} className="bg-white/70 border border-[#e6e4d9] rounded-2xl p-3 text-center shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all hover:bg-white/90">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-[#5c6065] mb-1">{item.label}</p>
                  <p className={`text-base font-black ${item.color}`}>{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Path Simulation ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[24px] p-6 shadow-sm">
          <SectionHeader icon={BarChart3} title="Forward Path Simulation" subtitle="Prospective wealth projections" />
          <div className="h-56 mt-4">
            <Line
              data={{
                labels: MOCK_SIMULATION_PATHS.map(d => d.year),
                datasets: [
                  {
                    label: 'Optimized',
                    data: MOCK_SIMULATION_PATHS.map(d => d.Optimized),
                    borderColor: '#1f8c5c',
                    borderWidth: 3,
                    fill: true,
                    backgroundColor: (context: any) => {
                      const ctx = context.chart.ctx;
                      const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                      gradient.addColorStop(0, 'rgba(31, 140, 92, 0.1)');
                      gradient.addColorStop(1, 'rgba(31, 140, 92, 0)');
                      return gradient;
                    },
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#1f8c5c',
                    pointBorderColor: '#fff',
                  },
                  {
                    label: 'Baseline',
                    data: MOCK_SIMULATION_PATHS.map(d => d.Baseline),
                    borderColor: '#8a9bb0',
                    borderWidth: 1.5,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    enabled: true,
                    backgroundColor: '#1b3a57',
                    padding: 12,
                    cornerRadius: 12,
                    callbacks: {
                      label: (context: any) => `₹${fmtShort(context.parsed.y)}`,
                    },
                  },
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { color: '#8a9bb0', font: { size: 9, weight: '700' } },
                  },
                  y: {
                    display: false,
                    suggestedMin: Math.min(...MOCK_SIMULATION_PATHS.map(d => d.Baseline)) * 0.9,
                  },
                },
              } as any}
            />
          </div>
          <div className="flex justify-center gap-6 mt-6 border-t border-[#f1efe6] pt-4">
            <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-[#1f8c5c]" /><span className="text-[9px] font-black uppercase text-[#5c6065]">Institutional Path</span></div>
            <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-[#8a9bb0]" /><span className="text-[9px] font-black uppercase text-[#5c6065]">Baseline Curve</span></div>
          </div>
        </div>
      </motion.div>

      {/* ── Active Planning Cards ── */}
      <motion.div variants={itemVars}>
        <SectionHeader icon={Target} title="Planning Matrix" subtitle="Asset-to-Goal allocation mapping" badge={`${MOCK_WEALTH_GOALS.length} Tracked`} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_WEALTH_GOALS.map((goal, i) => (
            <motion.div
              key={goal.id}
              variants={itemVars}
              whileHover={{ y: -1 }}
              onClick={() => setSelectedGoal(goal)}
              className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[24px] p-4 cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#f5f4f0] border border-[#e6e4d9] rounded-xl flex items-center justify-center text-xl grayscale group-hover:grayscale-0 group-hover:bg-[#d2efe2] transition-all opacity-80 decoration-none">
                    {goal.icon}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-black text-[#1b3a57] leading-tight group-hover:text-[#1f8c5c] transition-colors">{goal.title}</h4>
                    <p className="text-[9px] font-bold text-[#8a9bb0] mt-0.5 uppercase tracking-tighter">{goal.category} • BY {goal.targetYear}</p>
                  </div>
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest ${goal.status === 'at-risk' ? 'text-red-500' : goal.status === 'on-track' ? 'text-emerald-500' : 'text-blue-500'}`}>
                  {goal.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-[9px] font-black uppercase text-[#8a9bb0] tracking-widest">
                  <span>Funding Velocity</span>
                  <span className="text-[#1b3a57]">{goal.progressPct}%</span>
                </div>
                <ProgressBar pct={goal.progressPct} color="#1b3a57" delay={i * 0.05} />
              </div>

              <div className="flex justify-between items-center text-[10px] font-bold text-[#5c6065] pt-3 border-t border-[#f1efe6]">
                <div className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#1f8c5c]" />
                  <span className="font-black text-[#1b3a57]">₹{fmtShort(goal.targetAmount)}</span>
                </div>
                <div className="flex items-center gap-1 group-hover:text-[#1f8c5c] transition-colors">
                  Analyze <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedGoal && <GoalDetailSheet goal={selectedGoal} onClose={() => setSelectedGoal(null)} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default GoalLatticePanel;
