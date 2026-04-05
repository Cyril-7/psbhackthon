import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Sparkles,
} from 'lucide-react';
import {
  MOCK_PSYCHOMETRIC_TRAITS,
} from '../../data/wealthTwinData';
import type { ProfileData } from '../../types/profile';
import { analyzeFinancialTwin } from '../../services/gemini';
import {
  containerVars, itemVars, fmtShort, SectionHeader, ProgressBar,
} from './TwinUtils';

interface Props {
  profile: ProfileData;
}

const AIIntelligencePanel: React.FC<Props> = ({ profile }) => {
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalysis = useCallback(async () => {
    setIsLoading(true);
    const result = await analyzeFinancialTwin(profile);
    if (result) setAiAnalysis(result);
    setIsLoading(false);
  }, [profile]);

  useEffect(() => { fetchAnalysis(); }, [fetchAnalysis]);

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
              </div>
            </div>

            <div className="pt-2">
              <div className="bg-[#1b3a57]/[0.02] border border-[#1f8c5c]/25 rounded-[32px] p-6 shadow-sm relative overflow-hidden group hover:bg-[#1b3a57]/[0.04] transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Sparkles className="w-12 h-12 text-[#1f8c5c]" />
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-[#1f8c5c]" />
                  <p className="text-[10px] font-black uppercase tracking-[.3em] text-[#1f8c5c]">AI Strategic Recommendation</p>
                </div>
                {isLoading ? (
                  <div className="space-y-3 py-2">
                    <div className="h-3 w-full bg-slate-100 animate-pulse rounded-full" />
                    <div className="h-3 w-[80%] bg-slate-100 animate-pulse rounded-full" />
                  </div>
                ) : (
                  <p className="text-sm font-black text-[#1b3a57] leading-relaxed tracking-tight">
                    {aiAnalysis?.topOpportunity || "Optimize your ₹70K monthly surplus by shifting from standard FDs to indexed debt instruments for tax-efficient 8.2% CAGR."}
                  </p>
                )}
              </div>
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
                      {trait.trend === 'up' ? '↑ Increasing' : trait.trend === 'down' ? '↓ Decreasing' : '— Stable'}
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
    </motion.div>
  );
};

export default AIIntelligencePanel;
