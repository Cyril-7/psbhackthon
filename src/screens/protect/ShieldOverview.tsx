import React from 'react';
import { motion } from 'framer-motion';
import {
  SHIELD_METRICS, CURRENT_RISK_ASSESSMENT, DETECTED_ANOMALIES,
  RISK_SIGNAL_CATALOG,
} from '../../data/wealthProtectionData';
import { RISK_SCORE_BREAKDOWN } from '../../data/wealthTwinData';
import {
  Zap, Shield, Wifi, Smartphone, MapPin, Activity,
  Clock, CheckCircle2, AlertTriangle, Eye,
} from 'lucide-react';
import { containerVars, itemVars } from '../twin/TwinUtils';

const riskBarData = [
  { name: 'Concentration', score: RISK_SCORE_BREAKDOWN.concentrationRisk, fill: '#ef4444' },
  { name: 'Liquidity', score: RISK_SCORE_BREAKDOWN.liquidityRisk, fill: '#f59e0b' },
  { name: 'Debt', score: RISK_SCORE_BREAKDOWN.debtRisk, fill: '#f97316' },
  { name: 'Market', score: RISK_SCORE_BREAKDOWN.marketRisk, fill: '#3b82f6' },
  { name: 'Operational', score: RISK_SCORE_BREAKDOWN.operationalRisk, fill: '#10b981' },
];

interface Props {
  aiNarrative: string | null;
}

const ShieldOverview: React.FC<Props> = ({ aiNarrative }) => {
  const overallRisk = RISK_SCORE_BREAKDOWN.overall;
  const scoreColor = overallRisk > 70 ? '#10b981' : overallRisk > 40 ? '#f59e0b' : '#ef4444';
  const detectedSignals = RISK_SIGNAL_CATALOG.filter(s => s.detected);

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">
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

      {/* ── Shield Metrics Grid ── */}
      <motion.div variants={itemVars}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Fraud Risk', val: CURRENT_RISK_ASSESSMENT.fraudRiskScore + '%', color: '#ef4444', icon: <AlertTriangle className="w-4 h-4" /> },
            { label: 'Threats Blocked', val: SHIELD_METRICS.threatsBlocked.toString(), color: '#f59e0b', icon: <Shield className="w-4 h-4" /> },
            { label: 'Anomalies', val: DETECTED_ANOMALIES.length.toString(), color: '#8b5cf6', icon: <Eye className="w-4 h-4" /> },
            { label: 'Trusted Devices', val: SHIELD_METRICS.trustedDevices.toString(), color: '#3b82f6', icon: <Smartphone className="w-4 h-4" /> },
            { label: 'Trusted Zones', val: SHIELD_METRICS.trustedZones.toString(), color: '#10b981', icon: <MapPin className="w-4 h-4" /> },
            { label: 'Risk Signals', val: detectedSignals.length + '/' + RISK_SIGNAL_CATALOG.length, color: '#ec4899', icon: <Wifi className="w-4 h-4" /> },
            { label: 'Response Time', val: SHIELD_METRICS.averageResponseTime, color: '#0891b2', icon: <Clock className="w-4 h-4" /> },
            { label: 'Uptime', val: SHIELD_METRICS.uptime, color: '#10b981', icon: <Activity className="w-4 h-4" /> },
          ].map(m => (
            <div key={m.label} className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-2xl p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 group">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-white transition-colors" style={{ color: m.color }}>{m.icon}</div>
                <p className="text-[9px] font-black uppercase text-[#8a9bb0] tracking-widest">{m.label}</p>
              </div>
              <p className="text-2xl font-black" style={{ color: m.color }}>{m.val}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Active Risk Signals ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-rose-500" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Risk Signal Matrix</h3>
            </div>
            <span className="text-[10px] font-black text-rose-500 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
              {detectedSignals.length} ACTIVE
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {RISK_SIGNAL_CATALOG.map(sig => (
              <div key={sig.id} className={`p-4 rounded-2xl border transition-all ${sig.detected
                ? 'bg-rose-50/50 border-rose-100 hover:shadow-md'
                : 'bg-slate-50/30 border-slate-100 opacity-50'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{sig.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-black uppercase tracking-tight truncate ${sig.detected ? 'text-slate-800' : 'text-slate-400'}`}>{sig.label}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{sig.category} • W:{sig.weight}</p>
                  </div>
                  {sig.detected ? (
                    <span className="text-[9px] font-black text-rose-500 bg-rose-100 px-2 py-1 rounded-full shrink-0">{sig.confidence}%</span>
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>
                {sig.detected && sig.detail && (
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed pl-9">{sig.detail}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(ShieldOverview);
