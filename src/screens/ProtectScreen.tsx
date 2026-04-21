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
  CheckCircle2,
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

  useEffect(() => {
    const fetch = async () => {
      const r = await generateRiskNarrative(MOCK_RISK_ALERTS.map(a => ({ title: a.title, severity: a.severity, affectedAmount: a.affectedAmount })));
      if (r) setAiNarrative(r);
    };
    fetch();
  }, []);



  const overallRisk = RISK_SCORE_BREAKDOWN.overall;
  const scoreColor = overallRisk > 70 ? '#10b981' : overallRisk > 40 ? '#f59e0b' : '#ef4444';


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
        <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">

          {/* ── Main Layout Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column - Score & Policies */}
            <div className="lg:col-span-12 xl:col-span-8 space-y-8">
              
              {/* ── Risk Score Hero ── */}
              <motion.div variants={itemVars}>
                <div className="bg-slate-900 rounded-[32px] p-8 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none opacity-20" style={{ background: scoreColor }} />
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="relative w-48 h-48 shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
                        <motion.circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round"
                          strokeDasharray="264" initial={{ strokeDashoffset: 264 }}
                          animate={{ strokeDashoffset: 264 - (264 * overallRisk) / 100 }}
                          transition={{ duration: 2 }} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl font-black text-white">{overallRisk}</span>
                        <span className="text-[10px] font-black uppercase tracking-[.3em]" style={{ color: scoreColor }}>SHIELD INDEX</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 w-full space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
                        {riskBarData.map(r => (
                          <div key={r.name} className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <span>{r.name} Score</span>
                              <span style={{ color: r.fill }}>{r.score}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${r.score}%` }}
                                transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: r.fill }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {aiNarrative && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                          className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4 items-start backdrop-blur-md">
                          <Zap className="w-5 h-5 mt-0.5 shrink-0" style={{ color: scoreColor }} />
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#0cd89a]">Neural Risk Briefing</p>
                            <p className="text-sm text-slate-300 font-medium leading-relaxed">{aiNarrative}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── Insurance Policies ── */}
              <motion.div variants={itemVars}>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Protection Enclaves</h3>
                  </div>
                  <button className="px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase hover:bg-slate-900 hover:text-white transition-all tracking-widest shadow-sm">Audit Coverage Gap</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_PROTECTION.map(policy => (
                    <motion.div key={policy.id} variants={itemVars} whileHover={{ y: -4 }}
                      className={`bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all ${policy.gap ? 'ring-2 ring-red-500/10' : ''}`}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${policy.gap ? 'bg-red-50 text-red-500' : 'bg-slate-900 text-white'}`}>
                            {policy.type.includes('Health') ? <Heart className="w-7 h-7" /> : policy.type.includes('Life') ? <Users className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{policy.insurer}</p>
                            <h4 className="font-black text-base text-slate-800 tracking-tight">{policy.type}</h4>
                          </div>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${policy.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                          {policy.status === 'Active' ? 'SECURED' : 'GAP DETECTED'}
                        </span>
                      </div>
                      <div className="flex justify-between items-end pt-6 border-t border-slate-50">
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Sum Insured</p>
                          <p className="font-black text-2xl text-slate-800 leading-none">{policy.coverage === 0 ? 'NOT COVERED' : `₹${fmtShort(policy.coverage)}`}</p>
                        </div>
                        {policy.gap ? (
                          <button className="bg-red-600 text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                            Fortify <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="text-right">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Annual Premium</p>
                            <p className="font-black text-base text-slate-800 leading-none">₹{policy.premium.toLocaleString('en-IN')}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Intelligence & Alerts */}
            <div className="lg:col-span-12 xl:col-span-4 space-y-8">
              
              {/* ── Wealth Protection Intelligence ── */}
              <motion.div variants={itemVars}>
                <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <SectionHeader icon={Eye} title="Cyber Defense" subtitle="Institutional Protection Active" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {[
                      { label: 'Fraud Risk', val: CURRENT_RISK_ASSESSMENT.fraudRiskScore.toString() + '%', color: '#ef4444' },
                      { label: 'Blocked', val: SHIELD_METRICS.threatsBlocked.toString(), color: '#f59e0b' },
                      { label: 'Anomalies', val: DETECTED_ANOMALIES.length.toString(), color: '#8b5cf6' },
                      { label: 'Devices', val: SHIELD_METRICS.trustedDevices.toString(), color: '#3b82f6' },
                    ].map(m => (
                      <div key={m.label} className="bg-white border border-[#e6e4d9]/50 rounded-2xl p-4 text-center transition-all hover:shadow-md">
                        <p className="text-2xl font-black mb-1" style={{ color: m.color }}>{m.val}</p>
                        <p className="text-[9px] font-black uppercase text-[#8a9bb0] tracking-widest">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-[#8a9bb0] uppercase tracking-widest mb-4">Adaptive Countermeasures</p>
                    {RECENT_DECISIONS.slice(0, 5).map(dec => {
                      const outcome = DECISION_OUTCOMES[dec.outcome];
                      const riskColor = dec.riskScore > 70 ? 'bg-red-50 text-red-600 border-red-100'
                        : dec.riskScore > 40 ? 'bg-amber-50 text-amber-600 border-amber-100'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100';
                      return (
                        <div key={dec.id} className="p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all flex items-center gap-4 group">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border-2 ${riskColor} shrink-0`}>
                            {outcome.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-[#1b3a57] uppercase tracking-tight truncate">{dec.transactionType}</p>
                            <p className="text-[9px] text-[#8a9bb0] font-bold mt-1 uppercase tracking-tighter shrink-0">{outcome.label} • {dec.riskScore}% RISK</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* ── Active Risk Alerts ── */}
              <motion.div variants={itemVars}>
                <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Threat Intel</h3>
                    </div>
                    <span className="text-[10px] font-black text-red-500 bg-red-50 border border-red-100 px-3 py-1 rounded-full">{MOCK_RISK_ALERTS.length} DETECTED</span>
                  </div>
                  <div className="space-y-4">
                    {MOCK_RISK_ALERTS.map(alert => (
                      <motion.div key={alert.id} whileHover={{ y: -2 }} onClick={() => setSelectedRisk(alert)}
                        className="bg-white border border-slate-100 rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 shrink-0 ${severityColor[alert.severity]}`}>{alert.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1.5">
                              <h4 className="text-sm font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{alert.title}</h4>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-2">{alert.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ── CTA AI Defense ── */}
              <motion.div variants={itemVars}
                className="bg-emerald-600 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.1] text-white pointer-events-none group-hover:scale-110 transition-transform">
                  <Zap className="w-32 h-32" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full w-fit">
                    <Activity className="w-3.5 h-3.5 text-emerald-200" />
                    <span className="text-[9px] font-black tracking-[.2em] uppercase">Coverage Optimization</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight leading-tight">Critical Illness Gap</h3>
                    <p className="text-emerald-100 text-xs font-medium leading-relaxed">
                      Your current floater has a <span className="text-white font-bold underline underline-offset-4 decoration-emerald-300">84% coverage mismatch</span> for critical nodes.
                    </p>
                  </div>
                  <button className="w-full bg-white text-emerald-600 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg hover:shadow-emerald-700/20 active:scale-[0.98]">
                    Optimize Policy Enclave
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedRisk && <RiskDetailSheet alert={selectedRisk} onClose={() => setSelectedRisk(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default memo(ProtectScreen);
