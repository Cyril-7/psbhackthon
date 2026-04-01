import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, ShieldCheck, Clock, AlertTriangle, CheckCircle2, Hourglass,
  Smartphone, MapPin, Zap, Fingerprint, Wifi, Timer,
  Shield, Activity, TrendingUp, Phone, UserCheck, FileWarning,
  Snowflake, Siren, ChevronDown, ChevronUp, ArrowRight, Radio, Layers,
  BarChart3, Globe, History, Cpu, HeartPulse,
} from 'lucide-react';
import {
  CURRENT_RISK_ASSESSMENT, USER_BEHAVIORAL_BASELINE, DETECTED_ANOMALIES,
  ASSET_PROTECTION_RULES, RECENT_DECISIONS, DECISION_OUTCOMES,
  COOLING_OFF_ENTRIES, TRUSTED_DEVICES, TRUSTED_ZONES,
  EXPLAINABLE_INSIGHTS, SUSPICIOUS_ACTIVITY_HISTORY, SHIELD_METRICS,
  type RiskBand, type DecisionOutcome, type AdaptiveDecision,
  type CoolingOffEntry,
} from '../../data/wealthProtectionData';
import {
  containerVars, itemVars, fmtShort, SectionHeader, ProgressBar,
} from './TwinUtils';

/* ═══════════════════════════════════════════════════════════════════════════
   STYLES & HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

const riskBandColor: Record<RiskBand, { bg: string; text: string; border: string; dot: string; glow: string }> = {
  low:      { bg: 'bg-emerald-50',  text: 'text-emerald-600',  border: 'border-emerald-200', dot: 'bg-emerald-500', glow: 'shadow-emerald-500/20' },
  medium:   { bg: 'bg-amber-50',    text: 'text-amber-600',    border: 'border-amber-200',   dot: 'bg-amber-500',   glow: 'shadow-amber-500/20' },
  high:     { bg: 'bg-orange-50',   text: 'text-orange-600',   border: 'border-orange-200',  dot: 'bg-orange-500',  glow: 'shadow-orange-500/20' },
  critical: { bg: 'bg-red-50',      text: 'text-red-600',      border: 'border-red-200',     dot: 'bg-red-500',     glow: 'shadow-red-500/20' },
};

const riskBandLabel: Record<RiskBand, string> = {
  low: 'LOW', medium: 'MEDIUM', high: 'HIGH', critical: 'CRITICAL',
};

const outcomeIcon: Record<DecisionOutcome, React.ReactNode> = {
  allow_instant:      <CheckCircle2 className="w-4 h-4" />,
  allow_warning:      <AlertTriangle className="w-4 h-4" />,
  delayed_cooling:    <Hourglass className="w-4 h-4" />,
  biometric_required: <Fingerprint className="w-4 h-4" />,
  voice_callback:     <Phone className="w-4 h-4" />,
  co_owner_approval:  <UserCheck className="w-4 h-4" />,
  rm_review:          <FileWarning className="w-4 h-4" />,
  temp_freeze:        <Snowflake className="w-4 h-4" />,
  fraud_escalation:   <Siren className="w-4 h-4" />,
};

const outcomeColor: Record<DecisionOutcome, string> = {
  allow_instant:      'bg-emerald-50 text-emerald-700 border-emerald-200',
  allow_warning:      'bg-amber-50 text-amber-700 border-amber-200',
  delayed_cooling:    'bg-blue-50 text-blue-700 border-blue-200',
  biometric_required: 'bg-violet-50 text-violet-700 border-violet-200',
  voice_callback:     'bg-indigo-50 text-indigo-700 border-indigo-200',
  co_owner_approval:  'bg-pink-50 text-pink-700 border-pink-200',
  rm_review:          'bg-cyan-50 text-cyan-700 border-cyan-200',
  temp_freeze:        'bg-slate-100 text-slate-600 border-slate-200',
  fraud_escalation:   'bg-red-50 text-red-700 border-red-200',
};

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return `${Math.floor(diff / 60000)}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function countdownLabel(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return 'Expired';
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  if (hrs > 0) return `${hrs}h ${mins}m remaining`;
  if (mins > 0) return `${mins}m ${secs}s remaining`;
  return `${secs}s remaining`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB NAVIGATION
   ═══════════════════════════════════════════════════════════════════════════ */

type ShieldTab = 'overview' | 'signals' | 'decisions' | 'cooling' | 'devices' | 'history';

const TABS: { id: ShieldTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview',  label: 'Shield',    icon: Shield },
  { id: 'signals',   label: 'Signals',   icon: Radio },
  { id: 'decisions', label: 'Decisions', icon: Layers },
  { id: 'cooling',   label: 'Cool-Off',  icon: Timer },
  { id: 'devices',   label: 'Devices',   icon: Smartphone },
  { id: 'history',   label: 'History',   icon: History },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Risk Meter Ring ── */
const RiskMeterRing: React.FC<{ score: number; band: RiskBand }> = ({ score, band }) => {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (circumference * score) / 100;
  const strokeColor = band === 'critical' ? '#ef4444' : band === 'high' ? '#f97316' : band === 'medium' ? '#c5a059' : '#1f8c5c';

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#f5f4f0" strokeWidth="10" />
        <motion.circle
          cx="60" cy="60" r="54" fill="none" stroke={strokeColor} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2.5, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-black text-[#1b3a57] tracking-tighter"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          {score}
        </motion.span>
        <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: strokeColor }}>
          TRUST SCORE
        </span>
      </div>
    </div>
  );
};

/* ── Shield Pulse Animation ── */
const ShieldPulse: React.FC<{ band: RiskBand }> = ({ band }) => {
  const color = band === 'critical' ? '#ef4444' : band === 'high' ? '#f97316' : band === 'medium' ? '#f59e0b' : '#10b981';
  return (
    <div className="absolute top-4 right-4 z-0">
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-16 h-16 rounded-full"
        style={{ background: `radial-gradient(circle, ${color}40, transparent)` }}
      />
      <Shield className="w-6 h-6 absolute top-5 left-5" style={{ color }} />
    </div>
  );
};

/* ── Cooling Countdown ── */
const CoolingCountdown: React.FC<{ entry: CoolingOffEntry }> = ({ entry }) => {
  const [label, setLabel] = useState(countdownLabel(entry.expiresAt));
  useEffect(() => {
    if (entry.status !== 'active') return;
    const interval = setInterval(() => setLabel(countdownLabel(entry.expiresAt)), 1000);
    return () => clearInterval(interval);
  }, [entry]);

  const isActive = entry.status === 'active';
  const rc = riskBandColor[entry.riskBand];

  return (
    <motion.div variants={itemVars} className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rc.bg} border ${rc.border}`}>
            <Hourglass className={`w-5 h-5 ${rc.text}`} />
          </div>
          <div>
            <p className="text-sm font-black text-slate-800">{entry.transactionType}</p>
            <p className="text-[10px] font-bold text-slate-400">₹{fmtShort(entry.amount)}</p>
          </div>
        </div>
        <span className={`text-[8px] font-black uppercase tracking-widest ${rc.text} ml-2`}>
          {entry.status}
        </span>
      </div>

      {isActive && (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black uppercase text-slate-400">Cooling Period</span>
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xs font-black text-blue-600"
            >
              {label}
            </motion.span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 43200, ease: 'linear' }}
            />
          </div>
        </div>
      )}

      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{entry.reason}</p>

      {isActive && entry.canCancel && (
        <div className="flex gap-2">
          <button className="flex-1 bg-red-50 border border-red-200 text-red-600 text-[10px] font-black uppercase py-2.5 rounded-xl hover:bg-red-100 transition-all">
            Cancel Transaction
          </button>
          <button className="flex-1 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-black uppercase py-2.5 rounded-xl hover:bg-blue-100 transition-all">
            Pause Timer
          </button>
        </div>
      )}
    </motion.div>
  );
};

/* ── Decision Card with Explainable AI ── */
const DecisionCard: React.FC<{ decision: AdaptiveDecision; expanded: boolean; onToggle: () => void }> = ({ decision, expanded, onToggle }) => {
  const outcome = DECISION_OUTCOMES[decision.outcome];
  const insights = EXPLAINABLE_INSIGHTS.filter(i => i.transactionId === decision.id);

  return (
    <motion.div
      variants={itemVars}
      className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer"
      onClick={onToggle}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${outcomeColor[decision.outcome]}`}>
            {outcomeIcon[decision.outcome]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-black text-slate-800 leading-tight">{decision.transactionType}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-300" />
                  <span className="text-[9px] text-slate-400 font-medium">{timeAgo(decision.timestamp)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={`text-[8px] font-black uppercase tracking-widest flex items-center gap-1 ${outcomeColor[decision.outcome].split(' ')[1]} ml-2`}>
                  {outcomeIcon[decision.outcome]}
                  {outcome.label}
                </span>
                {decision.amount > 0 && (
                  <span className="text-[10px] font-black text-slate-600">₹{fmtShort(decision.amount)}</span>
                )}
              </div>
            </div>
          </div>
          {expanded
            ? <ChevronUp className="w-4 h-4 text-slate-300 shrink-0 mt-2" />
            : <ChevronDown className="w-4 h-4 text-slate-300 shrink-0 mt-2" />
          }
        </div>

        {/* Risk score mini-bar */}
        <div className="mt-3 flex items-center gap-3">
          <span className="text-[8px] font-black text-slate-400 uppercase w-12">Risk {decision.riskScore}</span>
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${decision.riskScore}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{
                background: decision.riskScore > 70 ? '#ef4444'
                  : decision.riskScore > 40 ? '#f59e0b'
                  : '#10b981',
              }}
            />
          </div>
        </div>
      </div>

      {/* Expanded: Reasoning + Explainable AI */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-slate-50 pt-3">
              {/* Reasoning */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <p className="text-[9px] font-black uppercase text-slate-400 mb-1">AI Decision Reasoning</p>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{decision.reasoning}</p>
              </div>

              {/* Explainable insights */}
              {insights.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Security Insights</p>
                  {insights.map(ins => {
                    const rc = riskBandColor[ins.severity];
                    return (
                      <div key={ins.id} className={`flex items-start gap-2 ${rc.bg} border ${rc.border} rounded-xl px-3 py-2`}>
                        <span className="text-sm mt-0.5 shrink-0">{ins.icon}</span>
                        <span className={`text-[11px] font-bold ${rc.text} leading-relaxed`}>{ins.insight}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PANEL
   ═══════════════════════════════════════════════════════════════════════════ */

const FraudShieldPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ShieldTab>('overview');
  const [expandedDecision, setExpandedDecision] = useState<string | null>(null);
  const [showAssetRules, setShowAssetRules] = useState(false);
  const [expandedAnomaly, setExpandedAnomaly] = useState<string | null>(null);

  const assessment = CURRENT_RISK_ASSESSMENT;
  const detectedSignals = useMemo(() => assessment.signals.filter(s => s.detected), [assessment]);
  const detectedCount = detectedSignals.length;

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-6">

      {/* ══════════ TAB NAVIGATION ══════════ */}
      <motion.div variants={itemVars} className="overflow-x-auto no-scrollbar -mx-1">
        <div className="flex gap-1.5 px-1 min-w-max">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#0e212b] text-emerald-400 shadow-lg shadow-slate-900/20'
                    : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-600 hover:border-slate-200'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >

          {/* ═══════════════════════════════════════════════════════════════
              TAB: OVERVIEW — Hero Risk Meter + Metrics + Behavioral
              ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-6">

              {/* ── Risk Score Hero ── */}
              <motion.div variants={itemVars}>
                <div className="bg-[#fcfbf9] rounded-[24px] sm:rounded-[28px] p-6 relative overflow-hidden border border-[#e6e4d9] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                  <ShieldPulse band={assessment.riskBand} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <ShieldCheck className="w-5 h-5 text-[#1f8c5c]" />
                      </motion.div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#1f8c5c]">Wealth Protection Intelligence — Active</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
                      <RiskMeterRing score={assessment.fraudRiskScore} band={assessment.riskBand} />
                      <div className="flex-1 space-y-3.5 w-full">
                        <div className="flex items-center gap-2 mt-4 ml-2">
                          <div className={`w-2 h-2 rounded-full ${riskBandColor[assessment.riskBand].dot} animate-pulse`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${riskBandColor[assessment.riskBand].text}`}>
                            {riskBandLabel[assessment.riskBand]} RISK PROFILE
                          </span>
                        </div>
                        <p className="text-xs text-[#5c6065] font-medium leading-relaxed italic">"{assessment.summary}"</p>
                        <div className="flex items-center gap-2.5 bg-[#f5f4f0] border border-[#e6e4d9] px-3 py-2 rounded-xl w-fit">
                          <Radio className="w-3.5 h-3.5 text-[#1f8c5c] animate-pulse" />
                          <span className="text-[10px] font-black text-[#1b3a57]">{detectedCount} Behavioral Signals Detected</span>
                        </div>
                      </div>
                    </div>

                    {/* Trust Score Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Device Integrity', val: SHIELD_METRICS.securityScore, c: '#1f8c5c', icon: Smartphone },
                        { label: 'Behavioral Match', val: 75, c: '#c5a059', icon: Activity },
                        { label: 'Network Safety', val: 88, c: '#1b3a57', icon: Globe },
                        { label: 'Identity Vault', val: 78, c: '#6366f1', icon: Fingerprint },
                      ].map(m => (
                        <div key={m.label} className="bg-white/70 border border-[#e6e4d9] rounded-2xl p-3 text-center shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all hover:bg-white/90">
                          <m.icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: m.c }} />
                          <p className="text-[8px] font-bold uppercase text-[#5c6065] mb-1">{m.label}</p>
                          <p className="text-lg font-black" style={{ color: m.c }}>{m.val}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── Metrics Strip ── */}
              <motion.div variants={itemVars} className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Threats Blocked', val: SHIELD_METRICS.threatsBlocked.toString(), icon: ShieldAlert, color: '#ef4444' },
                  { label: 'Active Cool-Offs', val: SHIELD_METRICS.activeCoolingOffs.toString(), icon: Timer, color: '#3b82f6' },
                  { label: 'False Positive', val: SHIELD_METRICS.falsePositiveRate, icon: TrendingUp, color: '#10b981' },
                ].map(m => (
                  <div key={m.label} className="bg-white border border-slate-100 rounded-2xl p-3 text-center space-y-1">
                    <m.icon className="w-4 h-4 mx-auto" style={{ color: m.color }} />
                    <p className="text-lg font-black text-slate-800">{m.val}</p>
                    <p className="text-[8px] font-black uppercase text-slate-400">{m.label}</p>
                  </div>
                ))}
              </motion.div>

              {/* ── Behavioral Baseline ── */}
              <motion.div variants={itemVars}>
                <SectionHeader icon={HeartPulse} title="Behavioral Baseline" subtitle="Your financial fingerprint" badge="AI-Native" />
                <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3">
                  {[
                    { label: 'Primary Device', value: USER_BEHAVIORAL_BASELINE.usualDevice, icon: '📱' },
                    { label: 'Avg Transfer', value: `₹${USER_BEHAVIORAL_BASELINE.commonTransferSize.toLocaleString('en-IN')}`, icon: '💰' },
                    { label: 'Active Hours', value: USER_BEHAVIORAL_BASELINE.preferredHours, icon: '🕐' },
                    { label: 'Normal Zones', value: USER_BEHAVIORAL_BASELINE.normalGeoZones.join(', '), icon: '📍' },
                    { label: 'Monthly Liquidation', value: `₹${USER_BEHAVIORAL_BASELINE.avgMonthlyLiquidation.toLocaleString('en-IN')}`, icon: '📊' },
                    { label: 'OTP Pattern', value: USER_BEHAVIORAL_BASELINE.pastOtpBehavior, icon: '🔑' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-base w-7 text-center shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{item.label}</p>
                        <p className="text-[11px] font-bold text-slate-700 truncate">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ── Detected Anomalies ── */}
              {DETECTED_ANOMALIES.length > 0 && (
                <motion.div variants={itemVars}>
                  <SectionHeader icon={AlertTriangle} title="Detected Anomalies" subtitle="Deviations from your behavioral baseline" badge={`${DETECTED_ANOMALIES.length} Active`} />
                  <div className="space-y-2">
                    {DETECTED_ANOMALIES.map(anomaly => {
                      const rc = riskBandColor[anomaly.severity];
                      const isExpanded = expandedAnomaly === anomaly.id;
                      return (
                        <motion.div
                          key={anomaly.id}
                          variants={itemVars}
                          onClick={() => setExpandedAnomaly(isExpanded ? null : anomaly.id)}
                          className={`bg-white border border-slate-100 rounded-2xl p-4 cursor-pointer hover:shadow-sm transition-all`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${rc.bg} border ${rc.border} shrink-0`}>
                              {anomaly.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <p className="text-sm font-black text-slate-800">{anomaly.label}</p>
                                  <span className={`text-[8px] font-black uppercase tracking-widest ${rc.text} ml-2`}>
                                    {riskBandLabel[anomaly.severity]}
                                  </span>
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{anomaly.detail}</p>
                            </div>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-50">
                                  <div className="bg-slate-50 rounded-xl p-2.5">
                                    <p className="text-[8px] font-black uppercase text-slate-400">Baseline</p>
                                    <p className="text-[11px] font-bold text-slate-700">{anomaly.baselineValue}</p>
                                  </div>
                                  <div className={`${rc.bg} rounded-xl p-2.5 border ${rc.border}`}>
                                    <p className="text-[8px] font-black uppercase text-slate-400">Current</p>
                                    <p className={`text-[11px] font-bold ${rc.text}`}>{anomaly.currentValue}</p>
                                  </div>
                                  <div className="col-span-2 bg-slate-50 rounded-xl p-2.5">
                                    <p className="text-[8px] font-black uppercase text-slate-400">Deviation</p>
                                    <p className="text-[11px] font-bold text-red-600">{anomaly.deviation}</p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── Asset Protection Rules ── */}
              <motion.div variants={itemVars}>
                <div className="flex items-center justify-between mb-3">
                  <SectionHeader icon={Layers} title="Asset Protection Rules" subtitle="Class-specific security workflows" />
                </div>
                <button
                  onClick={() => setShowAssetRules(!showAssetRules)}
                  className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between text-left hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {ASSET_PROTECTION_RULES.slice(0, 4).map(r => (
                        <div key={r.assetClass} className="w-8 h-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-sm shadow-sm">
                          {r.icon}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{ASSET_PROTECTION_RULES.length} Asset Classes Protected</p>
                      <p className="text-[10px] text-slate-400 font-medium">Tap to view protection rules</p>
                    </div>
                  </div>
                  {showAssetRules
                    ? <ChevronUp className="w-5 h-5 text-slate-300" />
                    : <ChevronDown className="w-5 h-5 text-slate-300" />
                  }
                </button>

                <AnimatePresence>
                  {showAssetRules && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 mt-3">
                        {ASSET_PROTECTION_RULES.map(rule => {
                          const rc = riskBandColor[rule.defaultRiskLevel];
                          return (
                            <div key={rule.assetClass} className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border border-slate-100"
                                    style={{ backgroundColor: `${rule.color}10` }}>
                                    {rule.icon}
                                  </div>
                                  <div>
                                    <p className="text-sm font-black text-slate-800">{rule.assetClass}</p>
                                    <p className="text-[10px] text-slate-400">Min threshold: ₹{fmtShort(rule.minimumSafeThreshold)}</p>
                                  </div>
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${rc.text} ml-2`}>
                                  {riskBandLabel[rule.defaultRiskLevel]}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-[10px]">
                                <div className="bg-slate-50 rounded-xl p-2.5">
                                  <p className="font-black text-slate-400 uppercase text-[8px] mb-1">Cooling Period</p>
                                  <p className="font-bold text-slate-600">{rule.coolingPeriod}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-2.5">
                                  <p className="font-black text-slate-400 uppercase text-[8px] mb-1">Beneficiary Policy</p>
                                  <p className="font-bold text-slate-600 line-clamp-2">{rule.beneficiaryPolicy}</p>
                                </div>
                              </div>

                              {rule.extraApproval.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {rule.extraApproval.map(a => (
                                    <span key={a} className="text-[8px] font-black text-blue-500 uppercase tracking-widest">
                                      {a}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* ── Security Recommendation ── */}
              <motion.div variants={itemVars}>
                <div className="bg-[#1b3a57] rounded-[24px] sm:rounded-[28px] p-6 relative overflow-hidden shadow-xl group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-[#1f8c5c]" />
                      <span className="text-[10px] font-black uppercase tracking-[.2em] text-[#1f8c5c]">AI Security Enhancement</span>
                    </div>
                    <p className="text-xl font-black text-white mb-2 tracking-tight">Enable Hardware Security Key</p>
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed">Adding a FIDO2 hardware key would increase your security score from 82 to 95 and eliminate SIM swap attack vectors entirely.</p>
                    <button className="bg-[#1f8c5c] hover:bg-[#1f8c5c]/90 text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg hover:shadow-[#1f8c5c]/20 hover:-translate-y-0.5">
                      Configure Now
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB: SIGNALS — Multi-Signal Risk Breakdown
              ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'signals' && (
            <div className="space-y-5">
              <SectionHeader icon={Radio} title="Multi-Signal Analysis" subtitle={`${detectedCount} of ${assessment.signals.length} signals triggered`} badge={`Score: ${assessment.fraudRiskScore}`} />

              {/* Signal category grouping */}
              {['device', 'location', 'behavior', 'identity', 'network', 'transaction'].map(cat => {
                const catSignals = assessment.signals.filter(s => s.category === cat);
                const detected = catSignals.filter(s => s.detected);
                const catLabel = cat.charAt(0).toUpperCase() + cat.slice(1);
                const catIcon = cat === 'device' ? Smartphone : cat === 'location' ? MapPin
                  : cat === 'behavior' ? Activity : cat === 'identity' ? Fingerprint
                  : cat === 'network' ? Globe : BarChart3;
                const CatIcon = catIcon;

                return (
                  <motion.div key={cat} variants={itemVars}>
                    <div className="flex items-center gap-2 mb-2">
                      <CatIcon className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{catLabel} Signals</p>
                      {detected.length > 0 && (
                        <span className="text-[8px] font-black text-red-500 uppercase tracking-widest ml-2">
                          {detected.length} triggered
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {catSignals.map(signal => (
                        <div
                          key={signal.id}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-all ${
                            signal.detected
                              ? 'bg-red-50 border-red-100'
                              : 'bg-white border-slate-100'
                          }`}
                        >
                          <span className="text-base shrink-0">{signal.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[11px] font-black ${signal.detected ? 'text-red-600' : 'text-slate-500'}`}>
                              {signal.label}
                            </p>
                            {signal.detected && (
                              <p className="text-[10px] text-red-400 font-medium mt-0.5">{signal.detail}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {signal.detected ? (
                              <>
                                <span className="text-[9px] font-black text-red-500">{signal.confidence}%</span>
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                              </>
                            ) : (
                              <>
                                <span className="text-[9px] font-bold text-slate-300">Clear</span>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}

              {/* Weight distribution */}
              <motion.div variants={itemVars}>
                <div className="bg-white border border-slate-100 rounded-2xl p-4">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">Signal Weight Contribution</p>
                  <div className="space-y-2">
                    {detectedSignals.map(signal => (
                      <div key={signal.id} className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-500 w-28 truncate">{signal.label}</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-red-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(signal.weight / 15) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-red-500 w-6 text-right">+{signal.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB: DECISIONS — Adaptive Decision Timeline
              ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'decisions' && (
            <div className="space-y-5">
              <SectionHeader icon={Layers} title="Decision Timeline" subtitle="AI-powered adaptive security actions" badge={`${RECENT_DECISIONS.length} Decisions`} />

              {/* Decision outcome legend */}
              <motion.div variants={itemVars} className="overflow-x-auto no-scrollbar -mx-1">
                <div className="flex gap-1.5 px-1 min-w-max">
                  {Object.entries(DECISION_OUTCOMES).slice(0, 5).map(([key, val]) => (
                    <div key={key} className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[8px] font-bold ${outcomeColor[key as DecisionOutcome]}`}>
                      {outcomeIcon[key as DecisionOutcome]}
                      <span className="whitespace-nowrap">{val.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Decision cards */}
              <div className="space-y-2">
                {RECENT_DECISIONS.map(decision => (
                  <DecisionCard
                    key={decision.id}
                    decision={decision}
                    expanded={expandedDecision === decision.id}
                    onToggle={() => setExpandedDecision(expandedDecision === decision.id ? null : decision.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB: COOLING — Cooling-Off & Reversal Safety
              ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'cooling' && (
            <div className="space-y-5">
              <SectionHeader icon={Timer} title="Cooling-Off Monitor" subtitle="Transaction hold & reversal safety" badge={`${COOLING_OFF_ENTRIES.filter(e => e.status === 'active').length} Active`} />

              {/* Info banner */}
              <motion.div variants={itemVars} className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-blue-700 mb-1">Anti-Fraud Cooling Protection</p>
                  <p className="text-[10px] text-blue-500 leading-relaxed">
                    Medium-risk: 30 min delay • Critical-risk: 12 hr delay • Cancel anytime before execution • Protects against panic clicks & coercion
                  </p>
                </div>
              </motion.div>

              {/* Cooling entries */}
              <div className="space-y-3">
                {COOLING_OFF_ENTRIES.map(entry => (
                  <CoolingCountdown key={entry.id} entry={entry} />
                ))}
              </div>

              {/* Reversal safety features */}
              <motion.div variants={itemVars}>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">Reversal Safety Features</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: '↩️', label: 'Undo Window', desc: '30min for medium-risk' },
                    { icon: '⏸️', label: 'Pause Option', desc: 'Halt liquidation mid-process' },
                    { icon: '🔐', label: 'Beneficiary Lock', desc: 'New beneficiaries reviewed' },
                    { icon: '📋', label: 'FD Confirmation', desc: 'Delayed FD creation verify' },
                  ].map(f => (
                    <div key={f.label} className="bg-white border border-slate-100 rounded-xl p-3 space-y-1">
                      <span className="text-lg">{f.icon}</span>
                      <p className="text-[10px] font-black text-slate-700">{f.label}</p>
                      <p className="text-[9px] text-slate-400 font-medium">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB: DEVICES — Trusted Zones & Safe Devices
              ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'devices' && (
            <div className="space-y-5">
              <SectionHeader icon={Smartphone} title="Trusted Device Registry" subtitle="Verified safe environments" badge={`${TRUSTED_DEVICES.length} Devices`} />

              {/* Device cards */}
              <div className="space-y-2">
                {TRUSTED_DEVICES.map(device => (
                  <motion.div key={device.id} variants={itemVars} className="bg-white border border-slate-100 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl">
                        {device.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-slate-800">{device.name}</p>
                          {device.biometricEnabled && (
                            <Fingerprint className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">Last used: {device.lastUsed} • {device.sessions} sessions</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-emerald-600">{device.trustScore}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase">Trust</p>
                      </div>
                    </div>
                    <ProgressBar pct={device.trustScore} color="#10b981" height="h-1.5" />
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="w-3 h-3 text-slate-300" />
                      <span className="text-[9px] text-slate-400 font-medium">{device.location}</span>
                      <span className="text-[9px] text-slate-400">•</span>
                      <span className="text-[9px] text-slate-400 font-medium">Since {device.registeredDate}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Trusted Zones */}
              <SectionHeader icon={Wifi} title="Trusted Zones" subtitle="Reduced friction environments" badge={`${TRUSTED_ZONES.length} Active`} />
              <div className="space-y-2">
                {TRUSTED_ZONES.map(zone => (
                  <motion.div key={zone.id} variants={itemVars} className="bg-white border border-slate-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg">
                          {zone.icon}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">{zone.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{zone.detail}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
                          <ArrowRight className="w-3 h-3 text-emerald-500 rotate-[315deg]" />
                          <span className="text-[9px] font-black text-emerald-600">-{zone.riskReduction}% risk</span>
                        </div>
                        <span className={`text-[8px] font-black uppercase mt-1 block ${zone.status === 'active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                          {zone.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Tip */}
              <motion.div variants={itemVars} className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                <Zap className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-emerald-700 mb-1">Friction-Free Tip</p>
                  <p className="text-[10px] text-emerald-500 leading-relaxed">
                    Actions from your trusted MacBook in Bangalore office get a combined 60% risk reduction. High-value transactions process with just biometric — no OTP needed.
                  </p>
                </div>
              </motion.div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB: HISTORY — Suspicious Activity Timeline
              ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'history' && (
            <div className="space-y-5">
              <SectionHeader icon={History} title="Suspicious Activity Log" subtitle="Complete threat & anomaly history" badge={`${SUSPICIOUS_ACTIVITY_HISTORY.length} Events`} />

              <div className="space-y-2">
                {SUSPICIOUS_ACTIVITY_HISTORY.map((entry, idx) => {
                  const outcome = DECISION_OUTCOMES[entry.outcome];
                  return (
                    <motion.div
                      key={entry.id}
                      variants={itemVars}
                      className="bg-white border border-slate-100 rounded-2xl p-4 relative"
                    >
                      {/* Timeline connector */}
                      {idx < SUSPICIOUS_ACTIVITY_HISTORY.length - 1 && (
                        <div className="absolute left-[1.9rem] bottom-0 w-px h-4 bg-slate-100 translate-y-full z-10" />
                      )}

                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border ${outcomeColor[entry.outcome]}`}>
                          {entry.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                              <p className="text-sm font-black text-slate-800">{entry.type}</p>
                              <p className="text-[9px] text-slate-400 font-medium">{entry.date}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${outcomeColor[entry.outcome]}`}>
                                {outcomeIcon[entry.outcome]}
                                {outcome.label}
                              </span>
                              <span className={`text-[9px] font-black ${
                                entry.riskScore > 70 ? 'text-red-500' : entry.riskScore > 40 ? 'text-amber-500' : 'text-emerald-500'
                              }`}>
                                Risk: {entry.riskScore}
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{entry.description}</p>

                          <div className="flex items-center gap-2 mt-2">
                            {entry.resolved ? (
                              <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Resolved
                              </span>
                            ) : (
                              <span className="text-[8px] font-black text-amber-500 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Active
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Summary Card */}
              <motion.div variants={itemVars} className="bg-[#0a1628] rounded-[28px] p-5 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">Protection Summary</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-2xl font-black text-white">{SHIELD_METRICS.totalTransactionsMonitored}</p>
                    <p className="text-[8px] font-black text-slate-500 uppercase">Monitored</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-emerald-400">{SHIELD_METRICS.threatsBlocked}</p>
                    <p className="text-[8px] font-black text-slate-500 uppercase">Blocked</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">{SHIELD_METRICS.uptime}</p>
                    <p className="text-[8px] font-black text-slate-500 uppercase">Uptime</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-[10px] text-slate-400 font-medium">
                    Average response: <span className="text-emerald-400 font-bold">{SHIELD_METRICS.averageResponseTime}</span> • 
                    False positive rate: <span className="text-emerald-400 font-bold">{SHIELD_METRICS.falsePositiveRate}</span>
                  </p>
                </div>
              </motion.div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default FraudShieldPanel;
