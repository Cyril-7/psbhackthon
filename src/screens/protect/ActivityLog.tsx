import React from 'react';
import { motion } from 'framer-motion';
import { SUSPICIOUS_ACTIVITY_HISTORY, DECISION_OUTCOMES } from '../../data/wealthProtectionData';
import { MOCK_PROTECTION } from '../../data/mockData';
import { MOCK_RISK_ALERTS } from '../../data/wealthTwinData';
import type { RiskAlert } from '../../data/wealthTwinData';
import { containerVars, itemVars } from '../twin/TwinUtils';
import {
  Clock, Heart, Users, ShieldAlert, ArrowRight,
  Shield, CheckCircle2, AlertTriangle,
} from 'lucide-react';

const fmtShort = (v: number) =>
  v >= 10000000 ? `${(v / 10000000).toFixed(1)}Cr`
  : v >= 100000 ? `${(v / 100000).toFixed(0)}L`
  : v >= 1000 ? `${(v / 1000).toFixed(0)}K`
  : `₹${v}`;

const severityColor: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-500 border-red-500/20',
  warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

interface Props {
  onSelectRisk: (alert: RiskAlert) => void;
}

const ActivityLog: React.FC<Props> = ({ onSelectRisk }) => {
  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">
      {/* ── Suspicious Activity Timeline ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-500" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Security Activity Timeline</h3>
            </div>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200" />
            <div className="space-y-4">
              {SUSPICIOUS_ACTIVITY_HISTORY.map((entry, idx) => {
                const outcome = DECISION_OUTCOMES[entry.outcome];
                const riskColor = entry.riskScore > 70 ? 'text-red-500' : entry.riskScore > 40 ? 'text-amber-500' : 'text-emerald-500';
                return (
                  <div key={entry.id} className="relative pl-14">
                    <div className={`absolute left-4 top-5 w-4 h-4 rounded-full border-2 border-white z-10 shadow-sm ${entry.resolved ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'}`} />
                    <motion.div
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{entry.icon}</span>
                          <div>
                            <h4 className="text-sm font-black text-slate-800">{entry.type}</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{entry.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-black ${riskColor}`}>{entry.riskScore}%</span>
                          <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase border ${entry.resolved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                            {entry.resolved ? 'Resolved' : 'Active'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-2">{entry.description}</p>
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                        <span>{outcome.icon}</span>
                        <span>{outcome.label}</span>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Risk Alerts ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Wealth Risk Alerts</h3>
            </div>
            <span className="text-[10px] font-black text-red-500 bg-red-50 border border-red-100 px-3 py-1 rounded-full">{MOCK_RISK_ALERTS.length} DETECTED</span>
          </div>
          <div className="space-y-4">
            {MOCK_RISK_ALERTS.map(alert => (
              <motion.div key={alert.id} whileHover={{ y: -2 }} onClick={() => onSelectRisk(alert)}
                className="bg-white border border-slate-100 rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 shrink-0 ${severityColor[alert.severity]}`}>{alert.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors mb-1">{alert.title}</h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-2">{alert.description}</p>
                    {alert.affectedAmount && (
                      <p className="text-[10px] font-black text-red-500 mt-2">Affected: ₹{fmtShort(alert.affectedAmount)}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Insurance Policies ── */}
      <motion.div variants={itemVars}>
        <div className="flex justify-between items-center mb-6">
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
    </motion.div>
  );
};

export default React.memo(ActivityLog);
