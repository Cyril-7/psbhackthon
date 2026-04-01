import React, { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PROTECTION } from '../data/mockData';
import {
  MOCK_RISK_ALERTS, RISK_SCORE_BREAKDOWN,
} from '../data/wealthTwinData';
import type { RiskAlert } from '../data/wealthTwinData';
import {
  SHIELD_METRICS, RECENT_DECISIONS, DECISION_OUTCOMES, CURRENT_RISK_ASSESSMENT, DETECTED_ANOMALIES,
} from '../data/wealthProtectionData';
import { generateRiskNarrative } from '../services/gemini';
import {
  ShieldCheck, Heart, Users, Zap, ChevronRight, HelpCircle, Activity,
  ArrowRight, ShieldAlert, AlertTriangle, Shield, Eye,
  CheckCircle2, Loader2,
} from 'lucide-react';
import type { ProfileData } from '../types/profile';
import { SectionHeader, containerVars, itemVars } from './twin/TwinUtils';

const fmtShort = (v: number) =>
  v >= 10000000 ? `${(v / 10000000).toFixed(1)}Cr`
  : v >= 100000 ? `${(v / 100000).toFixed(0)}L`
  : `${(v / 1000).toFixed(0)}K`;

const severityColor: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-500 border-red-500/20',
  warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};



const riskBarData = [
  { name: 'Concentration', score: RISK_SCORE_BREAKDOWN.concentrationRisk, fill: '#ef4444' },
  { name: 'Liquidity', score: RISK_SCORE_BREAKDOWN.liquidityRisk, fill: '#f59e0b' },
  { name: 'Debt', score: RISK_SCORE_BREAKDOWN.debtRisk, fill: '#f97316' },
  { name: 'Market', score: RISK_SCORE_BREAKDOWN.marketRisk, fill: '#3b82f6' },
  { name: 'Operational', score: RISK_SCORE_BREAKDOWN.operationalRisk, fill: '#10b981' },
];

/* Risk Detail Sheet */
const RiskDetailSheet: React.FC<{ alert: RiskAlert; onClose: () => void }> = ({ alert, onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end" onClick={onClose}>
    <motion.div initial={{ y: 400 }} animate={{ y: 0 }} exit={{ y: 400 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="w-full bg-white rounded-t-[32px] p-6 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar"
      onClick={e => e.stopPropagation()}>
      <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />
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
  const [selectedRisk, setSelectedRisk] = useState<RiskAlert | null>(null);
  const [aiNarrative, setAiNarrative] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoadingAi(true);
      const r = await generateRiskNarrative(MOCK_RISK_ALERTS.map(a => ({ title: a.title, severity: a.severity, affectedAmount: a.affectedAmount })));
      if (r) setAiNarrative(r);
      setLoadingAi(false);
    };
    fetch();
  }, []);



  const overallRisk = RISK_SCORE_BREAKDOWN.overall;
  const scoreColor = overallRisk > 70 ? '#10b981' : overallRisk > 40 ? '#f59e0b' : '#ef4444';


  return (
    <div className="flex-1 flex flex-col bg-[#f5f4ef] min-h-screen text-[#1b3a57] overflow-y-auto pb-32 font-sans no-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#f5f4ef]/90 backdrop-blur-xl border-b border-[#e6e4d9] flex justify-between items-center px-6 py-5">
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

      <div className="px-5 py-6">
        <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-6">

          {/* ── Risk Score Hero ── */}
          <motion.div variants={itemVars}>
            <div className="bg-slate-900 rounded-[24px] p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" style={{ background: `${scoreColor}10` }} />
              <div className="relative z-10 flex items-center gap-6">
                <div className="relative w-24 h-24 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#334155" strokeWidth="8" />
                    <motion.circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round"
                      strokeDasharray="264" initial={{ strokeDashoffset: 264 }}
                      animate={{ strokeDashoffset: 264 - (264 * overallRisk) / 100 }}
                      transition={{ duration: 2 }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{overallRisk}</span>
                    <span className="text-[7px] font-black uppercase" style={{ color: scoreColor }}>RISK INDEX</span>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  {riskBarData.slice(0, 3).map(r => (
                    <div key={r.name} className="space-y-1">
                      <div className="flex justify-between text-[8px] font-bold uppercase text-slate-400">
                        <span>{r.name}</span>
                        <span style={{ color: r.fill }}>{r.score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${r.score}%` }}
                          transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: r.fill }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {aiNarrative && (
                <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-3 flex gap-2 items-start">
                  <Zap className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: scoreColor }} />
                  <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{aiNarrative}</p>
                </div>
              )}
              {loadingAi && (
                <div className="mt-4 flex items-center gap-2 text-amber-400 text-xs animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating AI risk narrative...
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Insurance Policies ── */}
          <motion.div variants={itemVars}>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Insurance Enclaves</h3>
              </div>
              <button className="text-[9px] font-black text-slate-400 uppercase hover:text-emerald-500 transition-colors">Full Audit</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {MOCK_PROTECTION.map(policy => (
                <motion.div key={policy.id} variants={itemVars} whileHover={{ y: -2 }}
                  className={`bg-white rounded-[20px] p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all ${policy.gap ? 'ring-2 ring-red-500/20' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${policy.gap ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-slate-900 text-white'}`}>
                        {policy.type.includes('Health') ? <Heart className="w-6 h-6" /> : policy.type.includes('Life') ? <Users className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{policy.insurer}</p>
                        <h4 className="font-black text-sm text-slate-800 leading-tight">{policy.type}</h4>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${policy.status === 'Active' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                      {policy.status === 'Active' ? 'SECURED' : 'VULNERABLE'}
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-t border-slate-50 pt-4">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Coverage</p>
                      <p className="font-black text-xl text-slate-800">{policy.coverage === 0 ? 'VOID' : `₹${fmtShort(policy.coverage)}`}</p>
                    </div>
                    {policy.gap ? (
                      <button className="bg-red-500 text-white px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                        Add Cover <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="text-right">
                        <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Premium</p>
                        <p className="font-black text-sm text-slate-800">₹{policy.premium.toLocaleString('en-IN')}/yr</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Risk Alerts ── */}
          <motion.div variants={itemVars}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Active Risk Alerts</h3>
              </div>
              <span className="text-[9px] font-black text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">{MOCK_RISK_ALERTS.length} Detected</span>
            </div>
            <div className="space-y-3">
              {MOCK_RISK_ALERTS.slice(0, 4).map(alert => (
                <motion.div key={alert.id} whileHover={{ x: 2 }} onClick={() => setSelectedRisk(alert)}
                  className="bg-white border border-slate-100 rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all group">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border shrink-0 ${severityColor[alert.severity]}`}>{alert.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{alert.title}</h4>
                        <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full border shrink-0 ${severityColor[alert.severity]}`}>{alert.severity}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium line-clamp-2">{alert.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Wealth Protection Intelligence ── */}
          <motion.div variants={itemVars}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SectionHeader icon={Eye} title="Wealth Protection" subtitle="AI Cyber-Financial Intelligence" />
              </div>
              <div className="flex items-center gap-2 bg-[#d2efe2] border border-[#bce3d1] px-2.5 py-1 rounded-full mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1f8c5c] animate-pulse" />
                <span className="text-[8px] font-black text-[#1f8c5c] uppercase">Security: {SHIELD_METRICS.securityScore}/100</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { label: 'Risk Score', val: CURRENT_RISK_ASSESSMENT.fraudRiskScore.toString(), color: CURRENT_RISK_ASSESSMENT.fraudRiskScore > 60 ? '#ef4444' : '#10b981' },
                { label: 'Blocked', val: SHIELD_METRICS.threatsBlocked.toString(), color: '#f59e0b' },
                { label: 'Anomalies', val: DETECTED_ANOMALIES.length.toString(), color: '#8b5cf6' },
                { label: 'Devices', val: SHIELD_METRICS.trustedDevices.toString(), color: '#3b82f6' },
              ].map(m => (
                <div key={m.label} className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-xl p-2.5 text-center shadow-[0_1px_8px_rgba(0,0,0,0.01)]">
                  <p className="text-lg font-black" style={{ color: m.color }}>{m.val}</p>
                  <p className="text-[7px] font-black uppercase text-[#8a9bb0] tracking-widest">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Adaptive Decisions */}
            <div className="space-y-2">
              {RECENT_DECISIONS.slice(0, 4).map(dec => {
                const outcome = DECISION_OUTCOMES[dec.outcome];
                const riskColor = dec.riskScore > 70 ? 'bg-[#fef2f2] border-[#fecaca] text-red-600'
                  : dec.riskScore > 40 ? 'bg-[#fff8e6] border-[#fde68a] text-amber-600'
                  : 'bg-[#d2efe2] border-[#bce3d1] text-emerald-600';
                return (
                  <div key={dec.id} className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-all shadow-[0_1px_8px_rgba(0,0,0,0.01)]">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base border shrink-0 ${riskColor}`}>
                      {outcome.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-[#1b3a57] truncate uppercase tracking-tight">{dec.transactionType}</p>
                      <p className="text-[9px] text-[#8a9bb0] font-medium mt-0.5 line-clamp-1">{dec.reasoning}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full border ${riskColor}`}>
                        {outcome.label}
                      </span>
                      <span className="text-[8px] font-black text-[#8a9bb0]">Risk: {dec.riskScore}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── CTA ── */}
          <motion.div variants={itemVars}
            className="bg-slate-900 rounded-[24px] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-emerald-400 pointer-events-none">
              <Activity className="w-40 h-40 animate-pulse" />
            </div>
            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-2 text-emerald-400">
                <Zap className="w-5 h-5" />
                <span className="text-[10px] font-black tracking-[.3em] uppercase">AI Defense Recommendation</span>
              </div>
              <h3 className="text-xl font-black tracking-tight">Critical Illness Cover Missing</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                Your health coverage has an <span className="text-red-400 font-bold">84% critical illness gap</span>. 
                Adding a ₹25L Critical Illness cover at ~₹12K/year protects against catastrophic medical expenses that your current Family Floater won't cover.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">
                  Authorize Cover
                </button>
                <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all">
                  Technical Audit <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedRisk && <RiskDetailSheet alert={selectedRisk} onClose={() => setSelectedRisk(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default memo(ProtectScreen);
