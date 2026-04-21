import React, { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, RefreshCw, Target,
  MessageSquare,
} from 'lucide-react';
import type { ProfileData } from '../types/profile';
import { NET_WORTH_METRICS } from '../data/wealthTwinData';
import { generateNetWorthInsight } from '../services/gemini';
import { SectionHeader } from './twin/TwinUtils';

// ── Twin Sub-Panels ──
import WealthOverviewPanel from './twin/WealthOverviewPanel';
import AssetVaultPanel from './twin/AssetVaultPanel';
import AIIntelligencePanel from './twin/AIIntelligencePanel';
import GoalLatticePanel from './twin/GoalLatticePanel';

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
    <div className="flex-1 flex flex-col min-h-screen text-[#1b3a57] font-sans">
      {/* Header - Mobile Only */}
      <header className="md:hidden sticky top-0 z-50 bg-[#f5f4ef]/90 backdrop-blur-xl border-b border-[#e6e4d9] px-4 sm:px-5 py-3 sm:py-4 shrink-0">
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
            <button
              onClick={handleRefresh}
              className="p-2 sm:p-2.5 bg-transparent border border-[#d3d0c2] rounded-xl text-slate-500 hover:text-slate-800 transition-all shrink-0"
            >
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Layout Grid ── */}
      <div className="flex-1 px-5 md:px-0 py-6 md:py-0 overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Intelligence & Assets (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Wealth Intelligence Panel */}
            <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black text-[#1b3a57] tracking-tight">Wealth Signal Intelligence</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cross-Institution Data Analysis</p>
                </div>
                <button 
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 bg-[#f5f4ef] border border-[#e6e4d9] rounded-xl text-[10px] font-black text-[#1b3a57] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Re-Sync Twin
                </button>
              </div>
              <WealthOverviewPanel aiInsight={aiInsight} />
            </div>

            {/* Asset Vault Section */}
            <div className="space-y-6">
              <SectionHeader icon={Target} title="Real-World Assets" subtitle="Physical & Digital Registry" badge="REGISTRY" />
              <AssetVaultPanel />
            </div>

            {/* Persona & Behaviors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <SectionHeader icon={Brain} title="AI Persona" subtitle="Behavior Baselines" />
                <AIIntelligencePanel profile={profile} />
              </div>
              <div className="space-y-6">
                <SectionHeader icon={Target} title="Goal Physics" subtitle="Lattice Engine Logic" badge="PRO" />
                <GoalLatticePanel />
              </div>
            </div>
          </div>

          {/* Right Column: Neural Consciousness (4 cols) */}
          <div className="lg:col-span-4 sticky top-6">
            <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] overflow-hidden flex flex-col h-[calc(100vh-48px)] shadow-lg shadow-slate-200/50">
              <div className="p-8 border-b border-slate-100 bg-white/50 backdrop-blur-md">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-900 flex items-center justify-center text-indigo-100 shadow-lg">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#1b3a57] tracking-tight">Neural Consciousness</h3>
                    <p className="text-[10px] font-black text-[#1f8c5c] uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1f8c5c] animate-pulse" />
                      Live Consciousness
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <NeuralChatPanel profile={profile} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ Floating Context Bar ══════════ */}
      {/* Intentionally removed context bar for unified layout */}
    </div>
  );
};

export default memo(DigitalTwinScreen);

