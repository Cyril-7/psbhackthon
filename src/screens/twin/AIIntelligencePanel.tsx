import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip,
  AreaChart, Area,
} from 'recharts';
import {
  Activity, Lightbulb, ArrowRight, Sparkles, AlertCircle, Loader2,
  Info,
} from 'lucide-react';
import {
  MOCK_PSYCHOMETRIC_TRAITS, MOCK_SIMULATION_PATHS, MOCK_AI_INTERVENTIONS,
} from '../../data/wealthTwinData';
import type { ProfileData } from '../../types/profile';
import { analyzeFinancialTwin } from '../../services/gemini';
import {
  containerVars, itemVars, fmtShort, SectionHeader, ProgressBar, ChartTooltip,
} from './TwinUtils';





interface Props {
  profile: ProfileData;
}

const AIIntelligencePanel: React.FC<Props> = ({ profile }) => {
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullSimulation, setShowFullSimulation] = useState(false);

  const fetchAnalysis = useCallback(async () => {
    setIsLoading(true);
    const result = await analyzeFinancialTwin(profile);
    if (result) setAiAnalysis(result);
    setIsLoading(false);
  }, [profile]);

  useEffect(() => { fetchAnalysis(); }, [fetchAnalysis]);

  const interventions = useMemo(
    () => aiAnalysis?.interventions || MOCK_AI_INTERVENTIONS,
    [aiAnalysis]
  );

  const simData = useMemo(
    () => MOCK_SIMULATION_PATHS.slice(0, showFullSimulation ? 8 : 5),
    [showFullSimulation]
  );

  const monthlyIncome = Number(profile.monthlySalary) + Number(profile.sideIncome);
  const monthlyExpenses = Object.values(profile.expenses).reduce((a, b) => Number(a) + Number(b), 0);
  const monthlySavings = monthlyIncome - monthlyExpenses;

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">

      {/* ── AI Persona Card ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fcfbf9] rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 relative overflow-hidden border border-[#e6e4d9] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 bg-[#f5f4f0] border border-[#e6e4d9] rounded-2xl flex items-center justify-center shadow-sm">
                <span className="text-3xl font-black text-[#1b3a57]">{profile.fullName.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-[#1b3a57] tracking-tight">{profile.fullName}</h3>
                <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#1f8c5c] mb-1">
                  {isLoading ? 'Analyzing...' : aiAnalysis?.wealthPersona || 'The Strategic Builder'}
                </p>
                <div className="flex gap-2.5 mt-2">
                  <span className="text-[8px] font-black uppercase bg-[#f5f4f0] border border-[#e6e4d9] px-2.5 py-1 rounded-full text-[#5c6065]">{profile.jobType}</span>
                  <span className="text-[8px] font-black uppercase bg-[#f5f4f0] border border-[#e6e4d9] px-2.5 py-1 rounded-full text-[#5c6065]">{profile.city}</span>
                  <span className={`text-[8px] font-black uppercase ${profile.riskPreference === 'high' ? 'text-red-600' : 'text-[#1f8c5c]'} ml-2`}>
                    {profile.riskPreference === 'high' ? 'Growth' : 'Conservative'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/60 border border-[#e6e4d9] backdrop-blur-sm rounded-2xl p-4 mb-5 shadow-sm transition-all hover:bg-white/90">
              {isLoading ? (
                <div className="flex items-center gap-2 text-[#1f8c5c] animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" /> Performing behavioral psychometric analysis...
                </div>
              ) : (
                <p className="text-xs text-[#5c6065] font-medium leading-relaxed italic">
                  {aiAnalysis?.behavioralSummary || `"A systematic ${profile.jobType.toLowerCase()} profile with a monthly surplus of ₹${monthlySavings.toLocaleString('en-IN')} showing consistent wealth building patterns."`}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Monthly Income', val: `₹${fmtShort(monthlyIncome)}`, color: 'text-[#1b3a57]' },
                { label: 'Monthly Savings', val: `₹${fmtShort(monthlySavings)}`, color: 'text-[#1f8c5c]' },
                { label: 'Savings Rate', val: `${Math.round((monthlySavings / monthlyIncome) * 100)}%`, color: 'text-[#1b3a57]' }
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

      {/* ── Psychometric Traits ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[24px] p-6 shadow-sm">
          <SectionHeader icon={Activity} title="Behavioral Psychometric Profile" subtitle="AI-analyzed financial personality" badge="Live" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {MOCK_PSYCHOMETRIC_TRAITS.map((trait, i) => (
              <div key={trait.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg opacity-80">{trait.icon}</span>
                    <span className="text-[10px] font-black text-[#5c6065] uppercase tracking-wide">{trait.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#1b3a57]">{trait.score}%</span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${trait.trend === 'up' ? 'bg-[#d2efe2] text-[#1f8c5c] border-[#bce3d1]' : trait.trend === 'down' ? 'bg-[#fef2f2] text-red-600 border-[#fecaca]' : 'bg-[#f5f4f0] text-[#5c6065] border-[#e6e4d9]'}`}>
                      {trait.trend === 'up' ? '↑ Increasing' : trait.trend === 'down' ? '↓ Decreasing' : '→ Stable'}
                    </span>
                  </div>
                </div>
                <ProgressBar pct={trait.score} color={trait.score > 70 ? '#1f8c5c' : trait.score > 40 ? '#c5a059' : '#e11d48'} delay={i * 0.06} />
                <p className="text-[10px] text-[#8a9bb0] font-medium leading-relaxed">{trait.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>



      {/* ── Predictive Simulations ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[24px] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <SectionHeader icon={Sparkles} title="Future Wealth Simulations" subtitle="Baseline vs Optimized vs Conservative" />
            <button onClick={() => setShowFullSimulation(!showFullSimulation)} className="text-[10px] font-black uppercase text-[#1b3a57] hover:text-[#1f8c5c] transition-colors bg-[#f5f4f0] px-4 py-2 rounded-xl border border-[#e6e4d9]">
              {showFullSimulation ? '5-Year View' : '10-Year View'}
            </button>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="aiOptGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1f8c5c" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1f8c5c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6e4d9" />
                <XAxis dataKey="year" tick={{ fontSize: 9, fill: '#8a9bb0', fontWeight: 700 }} axisLine={false} tickLine={false} dy={8} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#1b3a57', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="Conservative" name="Conservative" stroke="#e11d48" strokeWidth={2} fill="transparent" strokeDasharray="5 5" dot={false} />
                <Area type="monotone" dataKey="Baseline" name="Baseline" stroke="#8a9bb0" strokeWidth={2} fill="transparent" dot={false} />
                <Area type="monotone" dataKey="Optimized" name="Optimized" stroke="#1f8c5c" strokeWidth={3} fill="url(#aiOptGrad)" dot={{ r: 3, fill: '#1f8c5c', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* ── Proactive AI Interventions ── */}
      <motion.div variants={itemVars}>
        <SectionHeader
          icon={Lightbulb}
          title="Proactive Interventions"
          subtitle={isLoading ? 'AI generating...' : 'Gemini 2.0 Flash Intelligence'}
          badge="Priority"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interventions.map((int: any) => (
            <motion.div
              key={int.id}
              whileHover={{ y: -2 }}
              className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[24px] p-5 hover:shadow-md transition-all group shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#f5f4f0] border border-[#e6e4d9] rounded-2xl flex items-center justify-center text-2xl shadow-sm grayscale opacity-80 group-hover:grayscale-0 transition-all">
                  {int.icon}
                </div>
                <span className={`text-[8px] font-black uppercase ${int.priority === 'critical' ? 'text-red-500' : int.priority === 'high' ? 'text-amber-600' : 'text-blue-500'} ml-2`}>
                  {int.priority || 'medium'}
                </span>
              </div>
              <h4 className="text-sm font-black text-[#1b3a57] leading-tight mb-2 group-hover:text-[#1f8c5c] transition-colors">
                {int.title || int.action}
              </h4>
              <div className="flex items-start gap-2 mb-4">
                <Info className="w-3.5 h-3.5 text-[#8a9bb0] mt-0.5 shrink-0" />
                <p className="text-[11px] text-[#5c6065] font-medium leading-relaxed">{int.description || int.reason}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#f1efe6]">
                <span className={`text-[10px] font-black ${int.impactPositive !== false ? 'text-[#1f8c5c]' : 'text-red-500'}`}>
                  {int.impact}
                </span>
                <button className="text-[9px] font-black uppercase text-[#8a9bb0] hover:text-[#1b3a57] flex items-center gap-1.5 transition-colors bg-[#f5f4f0] px-3 py-1.5 rounded-lg border border-[#e6e4d9]">
                  {int.actionLabel || 'Execute'} <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Anomalous Behavior Alert ── */}
      <motion.div variants={itemVars}>
        <div className="bg-red-50 border border-red-100 rounded-[24px] p-5 flex flex-col md:flex-row items-center gap-5">
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 shrink-0">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-black text-slate-800 mb-1">Anomalous Spending Detected</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Dining expenditure is <span className="text-red-500 font-bold">24% above</span> your income bracket average. 
              Normalizing this would unlock <span className="text-emerald-500 font-bold">₹4,200/month</span> for compounding.
            </p>
          </div>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shrink-0">
            Enforce Limits
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIIntelligencePanel;
