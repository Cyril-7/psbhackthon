import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Shield, AlertTriangle, CheckCircle2, Hourglass, Fingerprint,
  Phone, UserCheck, FileWarning, Snowflake, Siren, Loader2, Radio,
  Smartphone, MapPin, Activity, Globe, BarChart3,
} from 'lucide-react';
import {
  DECISION_OUTCOMES, USER_BEHAVIORAL_BASELINE,
  type RiskBand, type DecisionOutcome,
} from '../../data/wealthProtectionData';
import { containerVars, itemVars, SectionHeader } from './TwinUtils';
import { analyzeFraudRisk } from '../../services/gemini';

// ── Types ────────────────────────────────────────────────────────────────────
interface SimSignal {
  id: string;
  label: string;
  icon: string;
  weight: number;
  triggered: boolean;
  detail: string;
  category: string;
}

interface SimParams {
  amount: number;
  beneficiary: 'known' | 'unknown';
  device: 'trusted' | 'new';
  time: 'normal' | 'offhours';
  network: 'clean' | 'vpn';
  location: 'home' | 'foreign';
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const computeSignals = (p: SimParams): SimSignal[] => {
  const baseline = USER_BEHAVIORAL_BASELINE.commonTransferSize;
  const deviation = p.amount / baseline;
  return [
    {
      id: 'dev',
      label: p.device === 'new' ? 'First-Time Device' : 'Trusted Device',
      icon: '📱', weight: 12,
      triggered: p.device === 'new',
      detail: p.device === 'new' ? 'Samsung Galaxy S24 — first seen 2 hrs ago' : 'iPhone 15 Pro — 98% of sessions',
      category: 'device',
    },
    {
      id: 'loc',
      label: p.location === 'foreign' ? 'IP / Location Mismatch' : 'Known Location',
      icon: '🌐', weight: 8,
      triggered: p.location === 'foreign',
      detail: p.location === 'foreign' ? 'IP from Hyderabad — user baseline is Bangalore' : 'Bangalore — within geo-baseline',
      category: 'location',
    },
    {
      id: 'time',
      label: p.time === 'offhours' ? 'Abnormal Time-of-Day' : 'Normal Activity Hours',
      icon: '🌙', weight: 7,
      triggered: p.time === 'offhours',
      detail: p.time === 'offhours' ? 'Transaction at 11:42 PM — normal: 9 AM–6 PM' : 'Within preferred hours 9 AM–6 PM',
      category: 'behavior',
    },
    {
      id: 'bene',
      label: p.beneficiary === 'unknown' ? 'First-Time Beneficiary' : 'Known Beneficiary',
      icon: '👤', weight: 11,
      triggered: p.beneficiary === 'unknown',
      detail: p.beneficiary === 'unknown' ? '"Ravi K." — never used across all accounts' : 'Pre-verified beneficiary in registry',
      category: 'transaction',
    },
    {
      id: 'net',
      label: p.network === 'vpn' ? 'VPN / Unusual Network' : 'Trusted Network',
      icon: '🔒', weight: 7,
      triggered: p.network === 'vpn',
      detail: p.network === 'vpn' ? 'NordVPN detected — never used for banking' : 'Jio Fiber — verified home network',
      category: 'network',
    },
    {
      id: 'amt',
      label: deviation > 2 ? 'High-Value Deviation' : 'Normal Amount',
      icon: '📊', weight: 13,
      triggered: deviation > 2,
      detail: deviation > 2
        ? `₹${p.amount.toLocaleString('en-IN')} is ${deviation.toFixed(1)}× your median ₹${baseline.toLocaleString('en-IN')}`
        : `Amount within normal range (median ₹${baseline.toLocaleString('en-IN')})`,
      category: 'transaction',
    },
  ];
};

const computeScore = (signals: SimSignal[]): number =>
  Math.min(100, signals.filter(s => s.triggered).reduce((acc, s) => acc + s.weight, 0) * 1.3);

const getOutcome = (score: number): DecisionOutcome => {
  if (score <= 10) return 'allow_instant';
  if (score <= 35) return 'allow_warning';
  if (score <= 55) return 'biometric_required';
  if (score <= 70) return 'delayed_cooling';
  if (score <= 80) return 'voice_callback';
  if (score <= 90) return 'temp_freeze';
  return 'fraud_escalation';
};

const getRiskBand = (score: number): RiskBand => {
  if (score <= 20) return 'low';
  if (score <= 50) return 'medium';
  if (score <= 75) return 'high';
  return 'critical';
};

const bandColor: Record<RiskBand, string> = {
  low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444',
};

const outcomeIconMap: Record<DecisionOutcome, React.ReactNode> = {
  allow_instant:      <CheckCircle2 className="w-5 h-5" />,
  allow_warning:      <AlertTriangle className="w-5 h-5" />,
  delayed_cooling:    <Hourglass className="w-5 h-5" />,
  biometric_required: <Fingerprint className="w-5 h-5" />,
  voice_callback:     <Phone className="w-5 h-5" />,
  co_owner_approval:  <UserCheck className="w-5 h-5" />,
  rm_review:          <FileWarning className="w-5 h-5" />,
  temp_freeze:        <Snowflake className="w-5 h-5" />,
  fraud_escalation:   <Siren className="w-5 h-5" />,
};

// ── Slider ────────────────────────────────────────────────────────────────────
const AmountSlider: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => {
  const steps = [10000, 25000, 60000, 150000, 300000, 500000, 1000000];
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 tracking-widest">
        <span>Amount</span>
        <span className="text-slate-700">₹{value.toLocaleString('en-IN')}</span>
      </div>
      <input
        type="range" min={0} max={steps.length - 1} step={1}
        value={steps.indexOf(value) === -1 ? 2 : steps.indexOf(value)}
        onChange={e => onChange(steps[Number(e.target.value)])}
        className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-[8px] text-slate-300 font-bold">
        <span>₹10K</span><span>₹1Cr</span>
      </div>
    </div>
  );
};

// ── Toggle Row ────────────────────────────────────────────────────────────────
const ToggleRow: React.FC<{
  label: string; icon: string;
  options: { value: string; label: string; safe: boolean }[];
  value: string; onChange: (v: string) => void;
}> = ({ label, icon, options, value, onChange }) => (
  <div className="space-y-1.5">
    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{icon} {label}</p>
    <div className="flex gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all border ${
            value === opt.value
              ? opt.safe
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-red-50 text-red-700 border-red-200'
              : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const TransactionSimulator: React.FC = () => {
  const [params, setParams] = useState<SimParams>({
    amount: 60000, beneficiary: 'known', device: 'trusted',
    time: 'normal', network: 'clean', location: 'home',
  });
  const [running, setRunning] = useState(false);
  const [scanIndex, setScanIndex] = useState(-1);
  const [done, setDone] = useState(false);
  const [aiVerdict, setAiVerdict] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const signals = computeSignals(params);
  const score = done ? computeScore(signals) : 0;
  const band = getRiskBand(score);
  const outcome = getOutcome(score);
  const outcomeData = DECISION_OUTCOMES[outcome];
  const strokeColor = bandColor[band];

  const set = (key: keyof SimParams, val: any) => {
    setParams(p => ({ ...p, [key]: val }));
    setDone(false);
    setScanIndex(-1);
    setAiVerdict(null);
  };

  const runScan = async () => {
    setDone(false);
    setScanIndex(-1);
    setAiVerdict(null);
    setRunning(true);

    for (let i = 0; i < signals.length; i++) {
      await new Promise(r => setTimeout(r, 350));
      setScanIndex(i);
    }
    await new Promise(r => setTimeout(r, 300));
    setDone(true);
    setRunning(false);

    // Fetch AI verdict
    const triggered = signals.filter(s => s.triggered);
    if (triggered.length > 0) {
      setLoadingAi(true);
      const factors = triggered.map(s => s.detail);
      const verdict = await analyzeFraudRisk(
        'Bank Transfer', params.amount, factors,
        `Usual device: ${USER_BEHAVIORAL_BASELINE.usualDevice}, amount: ₹${USER_BEHAVIORAL_BASELINE.commonTransferSize}`
      );
      if (verdict) setAiVerdict(verdict.recommendation);
      setLoadingAi(false);
    }
  };

  const catIcon = (cat: string) => {
    if (cat === 'device') return <Smartphone className="w-3 h-3" />;
    if (cat === 'location') return <MapPin className="w-3 h-3" />;
    if (cat === 'behavior') return <Activity className="w-3 h-3" />;
    if (cat === 'network') return <Globe className="w-3 h-3" />;
    return <BarChart3 className="w-3 h-3" />;
  };

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-5">
      <SectionHeader
        icon={Radio}
        title="Live Security Simulator"
        subtitle="Configure a transaction and watch the 15-signal engine evaluate it"
        badge="Behavioral Biometrics"
      />

      {/* ── Controls ── */}
      <motion.div variants={itemVars} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-5">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Configure Transaction</p>
        <AmountSlider value={params.amount} onChange={v => set('amount', v)} />
        <ToggleRow label="Beneficiary" icon="👤" value={params.beneficiary} onChange={v => set('beneficiary', v as any)}
          options={[{ value: 'known', label: 'Known', safe: true }, { value: 'unknown', label: 'New / Unknown', safe: false }]} />
        <ToggleRow label="Device" icon="📱" value={params.device} onChange={v => set('device', v as any)}
          options={[{ value: 'trusted', label: 'Trusted', safe: true }, { value: 'new', label: 'New Device', safe: false }]} />
        <ToggleRow label="Time" icon="🕐" value={params.time} onChange={v => set('time', v as any)}
          options={[{ value: 'normal', label: '9 AM–6 PM', safe: true }, { value: 'offhours', label: 'After Midnight', safe: false }]} />
        <ToggleRow label="Network" icon="🌐" value={params.network} onChange={v => set('network', v as any)}
          options={[{ value: 'clean', label: 'Home WiFi', safe: true }, { value: 'vpn', label: 'VPN', safe: false }]} />
        <ToggleRow label="Location" icon="📍" value={params.location} onChange={v => set('location', v as any)}
          options={[{ value: 'home', label: 'Bangalore', safe: true }, { value: 'foreign', label: 'Hyderabad IP', safe: false }]} />

        <button
          onClick={runScan}
          disabled={running}
          className="w-full bg-[#0e212b] hover:bg-[#1b3a57] disabled:opacity-50 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all"
        >
          {running ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning 15 Signals...</> : <><Zap className="w-4 h-4" /> Run Security Analysis</>}
        </button>
      </motion.div>

      {/* ── Signal Scan ── */}
      {scanIndex >= 0 && (
        <motion.div variants={itemVars} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-2">
          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">Signal Evaluation</p>
          {signals.map((sig, i) => {
            const scanned = i <= scanIndex;
            const isScanning = i === scanIndex && running;
            return (
              <motion.div
                key={sig.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: scanned ? 1 : 0.3, x: 0 }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-all ${
                  !scanned ? 'bg-slate-50 border-slate-100' :
                  isScanning ? 'bg-blue-50 border-blue-100' :
                  sig.triggered ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'
                }`}
              >
                <span className="text-base shrink-0">{sig.icon}</span>
                <div className="flex items-center gap-1 shrink-0 text-slate-400">{catIcon(sig.category)}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[11px] font-black ${
                    isScanning ? 'text-blue-600' :
                    sig.triggered && scanned ? 'text-red-600' :
                    scanned ? 'text-emerald-600' : 'text-slate-400'
                  }`}>{sig.label}</p>
                  {scanned && !isScanning && <p className="text-[9px] font-medium text-slate-400 truncate">{sig.detail}</p>}
                </div>
                <div className="shrink-0">
                  {isScanning ? <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" /> :
                   scanned && sig.triggered ? <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> :
                   scanned ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : null}
                </div>
                {scanned && sig.triggered && (
                  <span className="text-[9px] font-black text-red-500 shrink-0">+{sig.weight}</span>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ── Result ── */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Score ring + outcome */}
            <div className="bg-[#0a1628] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
              {/* Ring */}
              <div className="relative w-28 h-28 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="10" />
                  <motion.circle
                    cx="50" cy="50" r="40" fill="none" stroke={strokeColor} strokeWidth="10" strokeLinecap="round"
                    strokeDasharray="251"
                    initial={{ strokeDashoffset: 251 }}
                    animate={{ strokeDashoffset: 251 - (251 * score) / 100 }}
                    transition={{ duration: 1.2 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">{Math.round(score)}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: strokeColor }}>RISK</span>
                </div>
              </div>

              {/* Decision */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: strokeColor }} />
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: strokeColor }}>
                    {band.toUpperCase()} RISK — {signals.filter(s => s.triggered).length} Signals Triggered
                  </span>
                </div>
                <div className={`flex items-center gap-3 rounded-xl p-3 border ${
                  outcome === 'allow_instant' ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-400' :
                  outcome === 'allow_warning' ? 'bg-amber-900/30 border-amber-500/30 text-amber-400' :
                  outcome === 'fraud_escalation' ? 'bg-red-900/30 border-red-500/30 text-red-400' :
                  'bg-blue-900/30 border-blue-500/30 text-blue-400'
                }`}>
                  {outcomeIconMap[outcome]}
                  <div>
                    <p className="text-sm font-black">{outcomeData.label}</p>
                    <p className="text-[10px] opacity-80 font-medium">{outcomeData.description}</p>
                  </div>
                </div>
                {/* Weight breakdown */}
                {signals.filter(s => s.triggered).length > 0 && (
                  <div className="space-y-1">
                    {signals.filter(s => s.triggered).map(s => (
                      <div key={s.id} className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-400 w-32 truncate">{s.label}</span>
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-red-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${(s.weight / 15) * 100}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                        <span className="text-[9px] font-black text-red-400">+{s.weight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Verdict */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4">
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">🤖 AI Fraud Analysis</p>
              {loadingAi ? (
                <div className="flex items-center gap-2 text-[#1f8c5c] text-xs animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" /> Calling Gemini AI Chief Risk Officer...
                </div>
              ) : aiVerdict ? (
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{aiVerdict}</p>
                </div>
              ) : signals.filter(s => s.triggered).length === 0 ? (
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <p className="text-sm font-bold">All clear — transaction matches behavioral baseline perfectly.</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400">AI analysis unavailable (offline mode)</p>
              )}
            </div>

            {/* XAI Insights */}
            {signals.filter(s => s.triggered).length > 0 && (
              <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-2">
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">Explainable AI — Why This Decision</p>
                {signals.filter(s => s.triggered).map(s => (
                  <div key={s.id} className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                    <span className="text-sm shrink-0">{s.icon}</span>
                    <p className="text-[11px] font-bold text-red-700 leading-relaxed">{s.detail}</p>
                  </div>
                ))}
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 flex items-center gap-2 mt-2">
                  <Shield className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <p className="text-[10px] font-bold text-blue-700">
                    This graduated response protects you while minimizing friction on legitimate transactions.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TransactionSimulator;
