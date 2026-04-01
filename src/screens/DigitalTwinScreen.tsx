import React, { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, RefreshCw, Target,
  Shield, ShieldAlert, MessageSquare,
} from 'lucide-react';
import type { ProfileData } from '../types/profile';
import { NET_WORTH_METRICS, TWIN_OVERVIEW } from '../data/wealthTwinData';
import { generateNetWorthInsight } from '../services/gemini';
import { SectionHeader } from './twin/TwinUtils';

// ── Twin Sub-Panels ──
import WealthOverviewPanel from './twin/WealthOverviewPanel';
import AssetVaultPanel from './twin/AssetVaultPanel';
import AIIntelligencePanel from './twin/AIIntelligencePanel';
import GoalLatticePanel from './twin/GoalLatticePanel';
import RiskSentinelPanel from './twin/RiskSentinelPanel';
import FraudShieldPanel from './twin/FraudShieldPanel';
import NeuralChatPanel from './twin/NeuralChatPanel';

// ─── Main Component ──────────────────────────────────────────────────────────
const DigitalTwinScreen: React.FC<{ profile: ProfileData }> = ({ profile }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    const insight = await generateNetWorthInsight(
      NET_WORTH_METRICS.total,
      NET_WORTH_METRICS.monthlyGrowth,
      NET_WORTH_METRICS.annualCAGR,
      'Real Estate Concentration at 62%'
    );
    if (insight) setAiInsight(insight);
    setIsRefreshing(false);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#f5f4ef] min-h-screen text-slate-900 overflow-hidden relative font-sans">

      {/* ══════════ Fixed Header ══════════ */}
      <header className="sticky top-0 z-50 bg-[#f5f4ef]/90 backdrop-blur-xl border-b border-[#e6e4d9] px-4 sm:px-5 py-3 sm:py-4 shrink-0">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="w-[46px] h-[46px] rounded-[18px] bg-[#1b3a57] border border-[#2b4c6a] flex items-center justify-center text-[#0cd89a] shadow-lg relative overflow-hidden shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              {isRefreshing && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute inset-0 border-2 border-[#0cd89a]/40 border-t-transparent rounded-full"
                />
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] font-black uppercase tracking-[.3em] text-[#1f8c5c] mb-1 leading-none w-full">Unified Twin</p>
              <h1 className="text-base font-black tracking-tight text-[#1b3a57] leading-none truncate w-full">{profile.fullName.split(' ')[0]}'s Twin</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1f8c5c] animate-pulse" />
              <span className="text-[9px] font-black text-[#1f8c5c] uppercase">{TWIN_OVERVIEW.institutionsLinked} Linked</span>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 sm:p-2.5 bg-transparent border border-[#d3d0c2] rounded-xl text-slate-500 hover:text-slate-800 transition-all shrink-0"
            >
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[2] ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ══════════ Content Area ══════════ */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 sm:py-6 pb-28 sm:pb-32 no-scrollbar flex flex-col gap-6">
        <WealthOverviewPanel aiInsight={aiInsight} />
        
        <div className="pt-2">
          <AssetVaultPanel />
        </div>

        <div className="pt-2">
          <SectionHeader icon={Brain} title="AI Intelligence" subtitle="Simulated persona & behaviors" />
          <AIIntelligencePanel profile={profile} />
        </div>

        <div className="pt-2 border-t border-slate-200">
          <SectionHeader icon={Target} title="Goal Architect" subtitle="Lattice Logic Engine Analytics" badge="PRO" />
          <GoalLatticePanel />
        </div>

        <div className="pt-2 border-t border-slate-200">
          <SectionHeader icon={Shield} title="Risk Sentinel" subtitle="Multi-vector exposure analysis" />
          <RiskSentinelPanel />
        </div>

        <div className="pt-2 border-t border-slate-200">
          <SectionHeader 
            icon={ShieldAlert} 
            title="Wealth Protection" 
            subtitle="Real-time Institutional Defense" 
            badge="ACTIVE" 
          />
          <FraudShieldPanel />
        </div>

        <div className="pt-2 border-t border-slate-200 h-[650px] flex flex-col">
          <SectionHeader icon={MessageSquare} title="Neural Chat" subtitle="Direct link to Twin Consciousness" />
          <NeuralChatPanel profile={profile} />
        </div>
      </main>

      {/* ══════════ Floating Context Bar ══════════ */}
      {/* Intentionally removed context bar for unified layout */}
    </div>
  );
};

export default memo(DigitalTwinScreen);

