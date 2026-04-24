import React, { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_RISK_ALERTS } from '../data/wealthTwinData';
import type { RiskAlert } from '../data/wealthTwinData';
import { generateRiskNarrative } from '../services/gemini';
import {
  ShieldCheck, HelpCircle, Shield, Activity, Smartphone, Clock,
  CheckCircle2,
} from 'lucide-react';
import type { ProfileData } from '../types/profile';
import { containerVars } from './twin/TwinUtils';

// Sub-components
import ShieldOverview from './protect/ShieldOverview';
import FraudMonitor from './protect/FraudMonitor';
import DeviceNetwork from './protect/DeviceNetwork';
import ActivityLog from './protect/ActivityLog';

const fmtShort = (v: number) =>
  v >= 10000000 ? `${(v / 10000000).toFixed(1)}Cr`
  : v >= 100000 ? `${(v / 100000).toFixed(0)}L`
  : `${(v / 1000).toFixed(0)}K`;

const severityColor: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-500 border-red-500/20',
  warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

type ProtectTab = 'overview' | 'fraud' | 'devices' | 'activity';

const TABS: { id: ProtectTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Shield', icon: <Shield className="w-4 h-4" /> },
  { id: 'fraud', label: 'Fraud', icon: <Activity className="w-4 h-4" /> },
  { id: 'devices', label: 'Devices', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'activity', label: 'Activity', icon: <Clock className="w-4 h-4" /> },
];

/* Risk Detail Sheet */
const RiskDetailSheet: React.FC<{ alert: RiskAlert; onClose: () => void }> = ({ alert, onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center md:justify-center" onClick={onClose}>
    <motion.div initial={{ y: 400 }} animate={{ y: 0 }} exit={{ y: 400 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="w-full md:max-w-lg bg-white rounded-t-[32px] md:rounded-[32px] p-6 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar"
      onClick={e => e.stopPropagation()}>
      <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto md:hidden" />
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border ${severityColor[alert.severity]}`}>{alert.icon}</div>
        <div>
          <h3 className="text-lg font-black text-slate-800">{alert.title}</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{alert.category}</p>
        </div>
      </div>
      <p className="text-sm text-slate-600 font-medium leading-relaxed">{alert.description}</p>
      {alert.affectedAmount && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-red-400">Affected Amount</span>
          <span className="text-lg font-black text-red-500">₹{fmtShort(alert.affectedAmount)}</span>
        </div>
      )}
      <div className="space-y-2">
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Mitigation Steps</p>
        {alert.mitigationSteps.map((step, i) => (
          <div key={i} className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600 font-medium">{step}</p>
          </div>
        ))}
      </div>
      <button onClick={onClose} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm">Close</button>
    </motion.div>
  </motion.div>
);

const ProtectScreen: React.FC<{ profile: ProfileData }> = ({ profile: _profile }) => {
  const [activeTab, setActiveTab] = useState<ProtectTab>('overview');
  const [selectedRisk, setSelectedRisk] = useState<RiskAlert | null>(null);
  const [aiNarrative, setAiNarrative] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const r = await generateRiskNarrative(MOCK_RISK_ALERTS.map(a => ({ title: a.title, severity: a.severity, affectedAmount: a.affectedAmount })));
      if (r) setAiNarrative(r);
    };
    fetch();
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <ShieldOverview aiNarrative={aiNarrative} />;
      case 'fraud': return <FraudMonitor />;
      case 'devices': return <DeviceNetwork />;
      case 'activity': return <ActivityLog onSelectRisk={setSelectedRisk} />;
      default: return <ShieldOverview aiNarrative={aiNarrative} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen text-[#1b3a57] font-sans">
      {/* Header - Mobile Only */}
      <header className="md:hidden sticky top-0 z-50 bg-[#f5f4ef]/90 backdrop-blur-xl border-b border-[#e6e4d9] flex justify-between items-center px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-[46px] h-[46px] rounded-[18px] bg-[#0e212b] border border-[#1b3a5a] flex items-center justify-center text-[#0cd89a] shrink-0 shadow-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[.3em] text-[#1f8c5c] mb-1 leading-none">Risk & Fraud Defense</p>
            <h1 className="text-xl font-black tracking-tight text-[#1b3a57] leading-none">Shield Control</h1>
          </div>
        </div>
        <button className="p-2.5 bg-[#fdfcf9] rounded-xl text-slate-400 border border-[#e6e4d9] hover:text-slate-900 transition-colors shadow-sm">
          <HelpCircle className="w-5 h-5" />
        </button>
      </header>

      <div className="px-5 md:px-0 py-6 md:py-0">
        <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-6">

          {/* ── Tab Navigation ── */}
          <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-2xl p-1.5 flex gap-1 shadow-sm">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 text-[11px] font-black uppercase tracking-widest ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-white/50'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>

        </motion.div>
      </div>

      <AnimatePresence>
        {selectedRisk && <RiskDetailSheet alert={selectedRisk} onClose={() => setSelectedRisk(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default memo(ProtectScreen);
