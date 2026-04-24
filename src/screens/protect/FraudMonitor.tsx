import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DETECTED_ANOMALIES, EXPLAINABLE_INSIGHTS } from '../../data/wealthProtectionData';
import { MOCK_FRAUD_EVENTS } from '../../data/wealthTwinData';
import type { FraudEvent } from '../../data/wealthTwinData';
import { containerVars, itemVars } from '../twin/TwinUtils';
import {
  Activity, ChevronRight, X, CheckCircle2, AlertTriangle,
  Clock, ShieldOff, ShieldAlert, Info,
} from 'lucide-react';

const fmtShort = (v: number) =>
  v >= 10000000 ? `${(v / 10000000).toFixed(1)}Cr`
  : v >= 100000 ? `${(v / 100000).toFixed(0)}L`
  : v >= 1000 ? `${(v / 1000).toFixed(0)}K`
  : `₹${v}`;

const statusStyles: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
  allowed:     { bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-600', label: 'APPROVED', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  warned:      { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-600', label: 'WARNED', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  blocked:     { bg: 'bg-red-50 border-red-100', text: 'text-red-600', label: 'BLOCKED', icon: <ShieldOff className="w-3.5 h-3.5" /> },
  cooling_off: { bg: 'bg-blue-50 border-blue-100', text: 'text-blue-600', label: 'COOLING OFF', icon: <Clock className="w-3.5 h-3.5" /> },
  escalated:   { bg: 'bg-slate-900 border-slate-900', text: 'text-white', label: 'ESCALATED', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
};

const severityDot: Record<string, string> = {
  safe: 'bg-emerald-400', low: 'bg-blue-400', medium: 'bg-amber-400', high: 'bg-orange-500', critical: 'bg-red-500',
};

const anomalySeverityStyle: Record<string, string> = {
  critical: 'bg-red-50 border-red-200 text-red-600',
  high: 'bg-orange-50 border-orange-200 text-orange-600',
  medium: 'bg-amber-50 border-amber-200 text-amber-600',
  low: 'bg-blue-50 border-blue-200 text-blue-500',
};

/* Fraud Event Detail Sheet */
const FraudDetailSheet: React.FC<{ event: FraudEvent; onClose: () => void }> = ({ event, onClose }) => {
  const st = statusStyles[event.status] || statusStyles.allowed;
  const relatedInsights = EXPLAINABLE_INSIGHTS.filter(i => {
    const matchId = event.id === 'f1' ? 'ad01' : event.id === 'f4' ? 'ad02' : event.id === 'f7' ? 'ad04' : '';
    return i.transactionId === matchId;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center md:justify-center" onClick={onClose}>
      <motion.div initial={{ y: 400 }} animate={{ y: 0 }} exit={{ y: 400 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="w-full md:max-w-lg bg-white rounded-t-[32px] md:rounded-[32px] p-6 space-y-5 max-h-[85vh] overflow-y-auto no-scrollbar"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="w-10 h-1 bg-slate-200 rounded-full md:hidden" />
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors ml-auto"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">{event.icon}</div>
          <div>
            <h3 className="text-lg font-black text-slate-800">{event.type}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{new Date(event.timestamp).toLocaleString('en-IN')}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 font-medium leading-relaxed">{event.description}</p>

        {event.amount && event.amount > 0 && (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-slate-400">Amount</span>
            <span className="text-lg font-black text-slate-800">₹{fmtShort(event.amount)}</span>
          </div>
        )}

        <div className={`${st.bg} border rounded-2xl p-4 flex items-center gap-3`}>
          <div className={st.text}>{st.icon}</div>
          <div>
            <p className={`text-xs font-black uppercase tracking-wider ${st.text}`}>{st.label}</p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">{event.action}</p>
          </div>
        </div>

        {event.riskFactors.length > 0 && (
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Risk Factors</p>
            {event.riskFactors.map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-3">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-slate-600 font-medium">{f}</p>
              </div>
            ))}
          </div>
        )}

        {event.deviceInfo && (
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div>
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Device</p>
              <p className="text-[11px] text-slate-600 font-medium">{event.deviceInfo}</p>
            </div>
          </div>
        )}

        {relatedInsights.length > 0 && (
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">AI Explainability</p>
            {relatedInsights.map(ins => (
              <div key={ins.id} className="flex items-start gap-3 bg-violet-50 border border-violet-100 rounded-xl p-3">
                <span className="text-base">{ins.icon}</span>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{ins.insight}</p>
              </div>
            ))}
          </div>
        )}

        <button onClick={onClose} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm">Close</button>
      </motion.div>
    </motion.div>
  );
};

const FraudMonitor: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<FraudEvent | null>(null);

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">
      {/* ── Live Transaction Feed ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Live Transaction Feed</h3>
            </div>
            <span className="text-[10px] font-black text-blue-500 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              {MOCK_FRAUD_EVENTS.length} EVENTS
            </span>
          </div>
          <div className="space-y-3">
            {MOCK_FRAUD_EVENTS.map(ev => {
              const st = statusStyles[ev.status] || statusStyles.allowed;
              return (
                <motion.div key={ev.id} whileHover={{ y: -2 }} onClick={() => setSelectedEvent(ev)}
                  className="bg-white border border-slate-100 rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl">{ev.icon}</div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${severityDot[ev.severity]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors truncate">{ev.type}</h4>
                        <span className={`shrink-0 px-2.5 py-1 rounded-full text-[9px] font-black uppercase border flex items-center gap-1.5 ${st.bg} ${st.text}`}>
                          {st.icon}{st.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-1">{ev.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        {ev.amount && ev.amount > 0 && <span className="text-[10px] font-black text-slate-700">₹{fmtShort(ev.amount)}</span>}
                        <span className="text-[9px] text-slate-400 font-bold">{new Date(ev.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        {ev.location && <span className="text-[9px] text-slate-400 font-bold">📍 {ev.location}</span>}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-slate-900 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Behavioral Anomaly Detection ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Behavioral Anomalies</h3>
            </div>
            <span className="text-[10px] font-black text-rose-500 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">{DETECTED_ANOMALIES.length} DETECTED</span>
          </div>
          <div className="space-y-4">
            {DETECTED_ANOMALIES.map(a => (
              <div key={a.id} className={`rounded-2xl p-5 border transition-all hover:shadow-md ${anomalySeverityStyle[a.severity] || 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-black text-slate-800">{a.label}</h4>
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-70">{a.severity}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed mb-3">{a.detail}</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/70 rounded-xl p-2.5 border border-white">
                        <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Baseline</p>
                        <p className="text-xs font-black text-slate-700">{a.baselineValue}</p>
                      </div>
                      <div className="bg-white/70 rounded-xl p-2.5 border border-white">
                        <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Current</p>
                        <p className="text-xs font-black text-rose-600">{a.currentValue}</p>
                      </div>
                      <div className="bg-white/70 rounded-xl p-2.5 border border-white">
                        <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Deviation</p>
                        <p className="text-xs font-black text-slate-700">{a.deviation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedEvent && <FraudDetailSheet event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(FraudMonitor);
