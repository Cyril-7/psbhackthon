import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Minus, RefreshCw, Shield, AlertTriangle,
  CheckCircle, XCircle, Clock, Zap, BarChart3, ChevronRight,
  ArrowRight, ArrowUpRight, Info, Wifi, WifiOff, Activity, Lock,
  Newspaper, ExternalLink, Search,
} from 'lucide-react';
import {
  fetchFullMarketSnapshot, deriveMarketSignals, buildRecommendations,
  fetchPortfolioNews, fetchStockDataCached, fetchIndicesCached, getMarketStatusLabel,
  type MarketSnapshot, type MarketSignal, type StrategyRecommendation,
} from '../../services/marketService';
import { getGeminiResponse } from '../../services/gemini';
import type { ProfileData } from '../../types/profile';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtINR = (v: number) =>
  v >= 10000000 ? `₹${(v / 10000000).toFixed(2)}Cr` :
  v >= 100000  ? `₹${(v / 100000).toFixed(1)}L` :
  v >= 1000    ? `₹${(v / 1000).toFixed(0)}K` :
  `₹${v.toLocaleString('en-IN')}`;

const USER_HOLDINGS = ['TCS', 'Reliance', 'HDFC Bank', 'Infosys'];

// ─── Cyber Protection Layer ───────────────────────────────────────────────────

interface CyberCheckResult {
  decision: 'allow' | 'warn' | 'cooling_off' | 'block';
  reasons: string[];
  riskScore: number;
}

const runCyberCheck = (amount: number, isFirstTimeAction: boolean): CyberCheckResult => {
  const reasons: string[] = [];
  let riskScore = 0;
  if (amount > 300000) { reasons.push('High-value transaction (>₹3L)'); riskScore += 30; }
  if (isFirstTimeAction) { reasons.push('First-time product action'); riskScore += 25; }
  if (new Date().getHours() < 7 || new Date().getHours() > 22) { reasons.push('Off-hours execution'); riskScore += 20; }
  return { decision: riskScore >= 50 ? 'cooling_off' : riskScore >= 30 ? 'warn' : 'allow', reasons, riskScore };
};

// ─── Compact News Card ────────────────────────────────────────────────────────

const NewsCard: React.FC<{ item: any; index: number }> = ({ item, index }) => {
  const title = item.title || item.headline || item.heading || 'Market Update';
  const source = item.source || item.publisher || item.relatedStock || 'NSE';
  const time = item.date || item.time || item.publishedAt || '';
  const url = item.url || item.link || '';
  const relatedStock = item.relatedStock || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-xl px-3 py-2.5 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-2.5">
        <Newspaper className="w-3.5 h-3.5 text-[#8a9bb0] shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-[#1b3a57] leading-snug line-clamp-1">{title}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {relatedStock && (
              <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-px rounded bg-indigo-100 text-indigo-600">{relatedStock}</span>
            )}
            <span className="text-[7px] font-bold text-slate-400 uppercase">{source}</span>
            {time && <span className="text-[7px] font-bold text-slate-300">{time}</span>}
          </div>
        </div>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <ExternalLink className="w-3 h-3 text-slate-300 hover:text-indigo-500 transition-colors" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

// ─── Market Status Strip ──────────────────────────────────────────────────────

const MarketStatusStrip: React.FC<{ signals: MarketSignal[] }> = ({ signals }) => {
  const equitySignal = signals.find(s => s.indicator === 'Equity Market');
  const volatilitySignal = signals.find(s => s.indicator === 'Market Volatility');
  const getTrendIcon = (trend: string) => {
    if (trend === 'bullish') return <TrendingUp className="w-3 h-3 text-emerald-500" />;
    if (trend === 'bearish') return <TrendingDown className="w-3 h-3 text-red-500" />;
    return <Minus className="w-3 h-3 text-slate-400" />;
  };
  const getTrendColor = (trend: string) => {
    if (trend === 'bullish') return 'text-emerald-600';
    if (trend === 'bearish') return 'text-red-600';
    return 'text-slate-500';
  };
  return (
    <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-3.5 h-3.5 text-[#1f8c5c]" />
        <span className="text-[9px] font-black uppercase tracking-widest text-[#1f8c5c]">Current Market Status</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          {getTrendIcon(equitySignal?.trend || 'neutral')}
          <div className="min-w-0">
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">NIFTY 50</p>
            <p className={`text-[11px] font-black leading-tight ${getTrendColor(equitySignal?.trend || 'neutral')}`}>
              {equitySignal?.value?.replace('Nifty Sentiment: ', '') || 'Stable'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getTrendIcon(volatilitySignal?.trend || 'neutral')}
          <div className="min-w-0">
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Volatility</p>
            <p className={`text-[11px] font-black leading-tight ${getTrendColor(volatilitySignal?.trend || 'neutral')}`}>
              {volatilitySignal?.value || 'Moderate'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Live Stock Row ───────────────────────────────────────────────────────────

const StockRow: React.FC<{ data: any; name: string }> = ({ data, name }) => {
  // Support both live API shape and fallback/index shape
  const price = data?.currentPrice?.NSE ?? data?.currentPrice?.BSE ?? data?.price ?? null;
  const change = parseFloat(data?.percentChange ?? data?.percent_change ?? '0');
  const isUp = change >= 0;
  const high = data?.high ?? data?.dayHigh ?? null;
  const low = data?.low ?? data?.dayLow ?? null;
  const volume = data?.volume ?? null;
  const isFallback = !!(data?.isFallback);
  const noData = price === null;

  const fmtPrice = (v: number | string | null) => {
    if (v === null || v === undefined) return '—';
    const n = typeof v === 'string' ? parseFloat(v) : v;
    return isNaN(n) ? '—' : n.toLocaleString('en-IN');
  };

  return (
    <div className={`border rounded-xl px-3.5 py-3 transition-all hover:bg-slate-50/50 ${isFallback ? 'bg-amber-50/40 border-amber-100' : 'bg-white border-slate-100'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${noData ? 'bg-slate-50 border-slate-100' : isUp ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
            {noData
              ? <Minus className="w-3.5 h-3.5 text-slate-300" />
              : isUp
                ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                : <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-[11px] font-bold text-slate-800 truncate">{data?.companyName || data?.company_name || name}</p>
              {isFallback && (
                <span className="text-[6px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-100 text-amber-600 shrink-0">Last Session</span>
              )}
            </div>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{data?.tickerId || data?.ticker_id || 'NSE'}</p>
          </div>
        </div>
        <div className="text-right shrink-0 pl-2">
          <p className="text-[12px] font-black text-slate-900">₹{fmtPrice(price)}</p>
          {!noData && (
            <p className={`text-[9px] font-black ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
              {isUp ? '+' : ''}{change.toFixed(2)}%
            </p>
          )}
        </div>
      </div>

      {data && !noData && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-50 grid grid-cols-3 gap-2">
          <div>
            <p className="text-[7px] font-black uppercase tracking-widest text-[#8a9bb0]">High</p>
            <p className="text-[9px] font-bold text-slate-500">₹{fmtPrice(high)}</p>
          </div>
          <div className="text-center">
            <p className="text-[7px] font-black uppercase tracking-widest text-[#8a9bb0]">Low</p>
            <p className="text-[9px] font-bold text-slate-500">₹{fmtPrice(low)}</p>
          </div>
          <div className="text-right">
            <p className="text-[7px] font-black uppercase tracking-widest text-[#8a9bb0]">Volume</p>
            <p className="text-[9px] font-bold text-slate-500">{volume !== null ? (typeof volume === 'number' ? volume.toLocaleString('en-IN') : volume) : '—'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Cyber Protection Modal ───────────────────────────────────────────────────

const CyberModal: React.FC<{
  rec: StrategyRecommendation; check: CyberCheckResult;
  onConfirm: () => void; onCancel: () => void;
}> = ({ rec, check, onConfirm, onCancel }) => {
  const [step, setStep] = useState<'review' | 'otp'>('review');
  const [otp, setOtp] = useState('');
  const decisionConfig = {
    allow:       { color: '#10b981', label: 'Low Risk — Proceed', icon: CheckCircle, bg: '#d1fae5' },
    warn:        { color: '#f59e0b', label: 'Moderate Risk — Verify', icon: AlertTriangle, bg: '#fef3c7' },
    cooling_off: { color: '#ef4444', label: 'High Risk — Cooling Period', icon: Clock, bg: '#fee2e2' },
    block:       { color: '#dc2626', label: 'Blocked — Security Alert', icon: XCircle, bg: '#fee2e2' },
  };
  const cfg = decisionConfig[check.decision];
  const DecisionIcon = cfg.icon;
  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }} className="w-full max-w-[430px] bg-white rounded-t-[32px] overflow-hidden shadow-2xl">
        <div className="px-6 pt-6 pb-4" style={{ background: cfg.bg }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: cfg.color + '20' }}><Lock className="w-5 h-5" style={{ color: cfg.color }} /></div>
            <div><p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Cyber Protection Layer</p><h3 className="text-sm font-black text-slate-900">Security Review</h3></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: cfg.color + '15', border: `1px solid ${cfg.color}30` }}>
            <DecisionIcon className="w-4 h-4 shrink-0" style={{ color: cfg.color }} /><span className="text-[10px] font-black" style={{ color: cfg.color }}>{cfg.label}</span>
          </div>
        </div>
        <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Requested Action</p>
            <p className="text-sm font-bold text-slate-800">{rec.action}</p>
            {rec.amount && <p className="text-xs font-black text-emerald-600 mt-1">{fmtINR(rec.amount)}</p>}
          </div>
          {check.reasons.length > 0 && (
            <div><p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Risk Signals</p>
              <div className="space-y-1.5">{check.reasons.map((r, i) => (
                <div key={i} className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2"><AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" /><span className="text-[10px] font-bold text-amber-800">{r}</span></div>
              ))}</div>
            </div>
          )}
          <div>
            <div className="flex justify-between mb-1"><span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Risk Score</span><span className="text-[10px] font-black" style={{ color: check.riskScore > 40 ? '#ef4444' : '#10b981' }}>{check.riskScore}/100</span></div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${check.riskScore}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ background: check.riskScore > 40 ? '#ef4444' : '#10b981' }} /></div>
          </div>
          {step === 'review' && (
            <>
              {check.decision === 'allow' && (<div className="flex gap-3"><button onClick={onConfirm} className="flex-1 bg-emerald-500 text-white py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest">Proceed ✓</button><button onClick={onCancel} className="flex-1 bg-slate-100 text-slate-600 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest">Cancel</button></div>)}
              {check.decision === 'warn' && (<div className="space-y-2"><button onClick={() => setStep('otp')} className="w-full bg-amber-500 text-white py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest">Verify with OTP</button><button onClick={onCancel} className="w-full bg-slate-100 text-slate-600 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest">Cancel</button></div>)}
              {check.decision === 'cooling_off' && (<div className="space-y-2"><div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center"><Clock className="w-6 h-6 text-red-500 mx-auto mb-2" /><p className="text-xs font-black text-red-800">24-hour cooling-off period applied</p></div><button onClick={() => setStep('otp')} className="w-full bg-red-500 text-white py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest">Override with OTP</button><button onClick={onCancel} className="w-full bg-slate-100 text-slate-600 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest">Accept Cooling-off</button></div>)}
            </>
          )}
          {step === 'otp' && (
            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Enter OTP sent to ••••4412</p>
              <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} className="w-full text-center text-2xl font-black tracking-[0.6em] border-2 border-slate-200 focus:border-emerald-500 rounded-2xl py-4 outline-none" placeholder="• • • • • •" />
              <button onClick={() => otp === '123456' ? onConfirm() : alert('Incorrect OTP. Use 123456 for demo.')} disabled={otp.length < 6} className="w-full py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest disabled:opacity-30" style={{ background: otp.length === 6 ? '#10b981' : '#e2e8f0', color: otp.length === 6 ? 'white' : '#94a3b8' }}>Confirm</button>
              <p className="text-center text-[9px] text-slate-400">Demo: use 123456</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ─── Recommendation Card ──────────────────────────────────────────────────────

const RecCard: React.FC<{ rec: StrategyRecommendation; onExecute: (r: StrategyRecommendation) => void; executedIds: Set<string> }> = ({ rec, onExecute, executedIds }) => {
  const [expanded, setExpanded] = useState(false);
  const isExecuted = executedIds.has(rec.id);
  const priorityConfig = {
    urgent: { bg: '#fff1f2', border: '#fca5a5', badge: '#ef4444', badgeBg: '#fee2e2', label: 'URGENT' },
    high:   { bg: '#fffbeb', border: '#fde68a', badge: '#f59e0b', badgeBg: '#fef3c7', label: 'HIGH' },
    medium: { bg: '#eff6ff', border: '#bfdbfe', badge: '#3b82f6', badgeBg: '#dbeafe', label: 'MEDIUM' },
    info:   { bg: '#f0fdf4', border: '#bbf7d0', badge: '#10b981', badgeBg: '#d1fae5', label: 'INFO' },
  };
  const p = priorityConfig[rec.priority];
  const catIcons: Record<string, string> = { rebalance: '⚖️', accumulate: '📈', protect: '🛡️', optimize: '⚡', tax: '📋' };
  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[20px] overflow-hidden" style={{ background: isExecuted ? '#f0fdf4' : p.bg, border: `1px solid ${isExecuted ? '#86efac' : p.border}` }}>
      <button className="w-full text-left px-4 pt-4 pb-3" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white/80 border border-white/60 shrink-0 shadow-sm">{rec.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: p.badgeBg, color: p.badge }}>{p.label}</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{catIcons[rec.category]} {rec.category}</span>
              {rec.cyberCheckRequired && <span className="text-[8px] font-black uppercase tracking-widest text-indigo-500 flex items-center gap-0.5"><Shield className="w-2.5 h-2.5" /> Protected</span>}
            </div>
            <h4 className="text-sm font-black text-slate-900 leading-tight line-clamp-2">{rec.action}</h4>
          </div>
          <ChevronRight className={`w-4 h-4 text-slate-300 shrink-0 transition-transform mt-1 ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </button>
      <div className="mx-4 mb-3 px-3 py-2 rounded-xl bg-white/60 border border-white/80"><p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Trigger</p><p className="text-[10px] font-bold text-slate-700">{rec.trigger}</p></div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-3">
              <div className="bg-white/70 rounded-2xl p-3 border border-white/80"><p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Why This Matters</p><p className="text-[11px] text-slate-700 leading-relaxed">{rec.rationale}</p></div>
              {rec.from && rec.to && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-red-50 border border-red-100 rounded-xl p-2.5 text-center"><p className="text-[8px] font-black uppercase tracking-widest text-red-400 mb-0.5">From</p><p className="text-[10px] font-bold text-red-700">{rec.from}</p>{rec.amount && <p className="text-[9px] font-black text-red-600 mt-1">{fmtINR(rec.amount)}</p>}</div>
                  <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
                  <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 text-center"><p className="text-[8px] font-black uppercase tracking-widest text-emerald-500 mb-0.5">To</p><p className="text-[10px] font-bold text-emerald-700">{rec.to}</p>{rec.expectedGain && <p className="text-[9px] font-black text-emerald-600 mt-1">{rec.expectedGain}</p>}</div>
                </div>
              )}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-1.5 bg-white/60 border border-white/80 rounded-xl px-3 py-2"><Activity className="w-3 h-3 text-slate-400" /><div><p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Risk</p><p className={`text-[10px] font-black capitalize ${rec.riskLevel === 'low' ? 'text-emerald-600' : rec.riskLevel === 'medium' ? 'text-amber-500' : 'text-red-500'}`}>{rec.riskLevel}</p></div></div>
                {!isExecuted ? (
                  <button onClick={() => onExecute(rec)} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-white hover:opacity-90" style={{ background: p.badge }}>Execute <ArrowUpRight className="w-3.5 h-3.5" /></button>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500 rounded-xl px-3 py-2"><CheckCircle className="w-3.5 h-3.5 text-white" /><span className="text-[10px] font-black text-white uppercase tracking-widest">Executed</span></div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props { profile: ProfileData }

const MarketRecommendationEngine: React.FC<Props> = ({ profile }) => {
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [recommendations, setRecommendations] = useState<StrategyRecommendation[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [cyberModal, setCyberModal] = useState<{ rec: StrategyRecommendation; check: CyberCheckResult } | null>(null);
  const [executedIds, setExecutedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'news' | 'stocks' | 'actions'>('news');
  const [isOnline, setIsOnline] = useState(true);
  const [dataFromCache, setDataFromCache] = useState(false);
  const [dataIsFallback, setDataIsFallback] = useState(false);
  const [newsFromCache, setNewsFromCache] = useState(false);
  const [stocksFromCache, setStocksFromCache] = useState(false);
  const [stocksIsFallback, setStocksIsFallback] = useState(false);
  const [marketStatus, setMarketStatus] = useState(getMarketStatusLabel());

  // Live stocks state
  const [stocksData, setStocksData] = useState<Record<string, any>>({});
  const [indicesData, setIndicesData] = useState<any[]>([]);
  const [stocksLoading, setStocksLoading] = useState(false);
  const [stockSearch, setStockSearch] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [stockSubTab, setStockSubTab] = useState<'indian' | 'global'>('indian');

  const INDEX_TICKERS = [
    'NIFTY 50',
    'NIFTY Bank',
    'Nifty Financial Services',
    'Bse Sensex',
    'Nifty Midcap Select',
    'Bse Bankex',
    'India Vix',
    'Nifty Total Market'
  ];

  const portfolioMix = { equity: 1250000 + 650000, debt: 500000 + 215000 + 380000, gold: 350000 + 560000, fd: 500000, cash: 185000 + 124000 + 8200 };
  const riskProfile = profile.riskPreference === 'high' ? 'aggressive' as const : 'moderate' as const;

  const loadMarketData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setIsOnline(navigator.onLine);
    setMarketStatus(getMarketStatusLabel());
    try {
      const snap = await fetchFullMarketSnapshot();
      setSnapshot(snap);
      setDataFromCache(!!(snap as any).fromCache);
      setDataIsFallback(!!(snap as any).isFallback);
      const sigs = deriveMarketSignals(snap);
      setSignals(sigs);
      const recs = buildRecommendations(snap, sigs, portfolioMix, riskProfile, 'long');
      setRecommendations(recs);
      setNewsLoading(true);
      fetchPortfolioNews(USER_HOLDINGS).then(result => {
        setNews(result.news);
        setNewsFromCache(result.fromCache);
        setNewsLoading(false);
      });
      setAiLoading(true);
      const hasLiveData = snap.trending || snap.commodities || snap.mutualFunds;
      const contextStr = sigs.map(s => `${s.indicator}: ${s.value} (${s.trend})`).join('; ');
      const prompt = `As an elite Indian wealth strategist for "Alpha Vault", provide a sharp 2-sentence macro-market briefing.\nUser: ${profile.fullName}, Risk: ${riskProfile}, Portfolio ₹${((Object.values(portfolioMix).reduce((a,b)=>a+b,0))/100000).toFixed(0)}L\n${hasLiveData ? `Live Signals: ${contextStr}` : 'Simulated market signals'}\nWrite like a Bloomberg analyst. Indian market context (SEBI, RBI, NSE, MCX). Max 60 words.`;
      getGeminiResponse(prompt).then(text => { setAiInsight(text); setAiLoading(false); });
    } catch (err) { console.error('Market load error:', err); setIsOnline(false); }
    finally { setLoading(false); setRefreshing(false); }
  }, [profile.fullName, riskProfile]);

  useEffect(() => { loadMarketData(); }, [loadMarketData]);

  // Load stocks data when stocks tab is active
  useEffect(() => {
    if (activeTab !== 'stocks') return;
    const loadStocks = async () => {
      setStocksLoading(true);
      let anyFromCache = false;
      try {
        // 1. Fetch user holdings with cache fallback
        const holdResults: Record<string, any> = {};
        const holdPromises = USER_HOLDINGS.map(async name => {
          const { data, fromCache } = await fetchStockDataCached(name);
          if (data) { holdResults[name] = data; if (fromCache) anyFromCache = true; }
        });

        // 2. Fetch all indices with cache fallback
        const [popRes, secRes] = await Promise.allSettled([
          fetchIndicesCached('POPULAR'),
          fetchIndicesCached('SECTOR')
        ]);

        const allIndices = [
          ...(popRes.status === 'fulfilled' ? popRes.value.data : []),
          ...(secRes.status === 'fulfilled' ? secRes.value.data : [])
        ];
        if (
          (popRes.status === 'fulfilled' && popRes.value.fromCache) ||
          (secRes.status === 'fulfilled' && secRes.value.fromCache)
        ) anyFromCache = true;

        await Promise.allSettled(holdPromises);
        setStocksData(holdResults);
        setIndicesData(allIndices);
        setStocksFromCache(anyFromCache);
        // Check if any returned data is fallback
        const anyFallback = Object.values(holdResults).some((d: any) => d?.isFallback) ||
          allIndices.some((d: any) => d?.isFallback);
        setStocksIsFallback(anyFallback);
      } catch (err) {
        console.error('Error loading stocks/indices:', err);
      } finally {
        setStocksLoading(false);
      }
    };
    loadStocks();
  }, [activeTab]);

  const handleSearchStock = async () => {
    if (!stockSearch.trim()) return;
    setSearchLoading(true);
    const data = await fetchStockData(stockSearch.trim());
    setSearchResult(data);
    setSearchLoading(false);
  };

  const handleExecute = (rec: StrategyRecommendation) => {
    if (!rec.cyberCheckRequired) { setExecutedIds(prev => new Set(prev).add(rec.id)); return; }
    const check = runCyberCheck(rec.amount || 0, !executedIds.size);
    setCyberModal({ rec, check });
  };
  const handleCyberConfirm = () => { if (cyberModal) setExecutedIds(prev => new Set(prev).add(cyberModal.rec.id)); setCyberModal(null); };

  if (loading) {
    return (
      <div className="bg-[#fdfcf9] rounded-[24px] p-6 border border-[#e6e4d9] shadow-sm flex flex-col items-center justify-center gap-4 min-h-[200px]">
        <div className="w-12 h-12 rounded-2xl bg-[#0e212b] flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}><Activity className="w-6 h-6 text-[#0cd89a]" /></motion.div>
        </div>
        <div className="text-center"><p className="text-[9px] font-black uppercase tracking-widest text-[#1f8c5c]">Market Intelligence Engine</p><p className="text-xs text-slate-400 font-medium mt-1">Scanning live market signals…</p></div>
      </div>
    );
  }

  const urgentCount = recommendations.filter(r => r.priority === 'urgent' || r.priority === 'high').length;
  const tabs = [
    { key: 'news' as const, label: `📰 News (${news.length})` },
    { key: 'stocks' as const, label: `📈 Live Stocks` },
    { key: 'actions' as const, label: `⚡ Actions (${recommendations.length})` },
  ];

  return (
    <>
      <div className="space-y-4">
        {/* ── Engine Header ── */}
        <div className="bg-[#0e212b] rounded-[24px] p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5 pointer-events-none" style={{ background: '#0cd89a', transform: 'translate(30%, -30%)', filter: 'blur(40px)' }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0cd89a]/10 border border-[#0cd89a]/20 flex items-center justify-center"><BarChart3 className="w-4 h-4 text-[#0cd89a]" /></div>
                  <div><p className="text-[8px] font-black uppercase tracking-[.3em] text-[#0cd89a]">Alpha Intelligence</p><h2 className="text-sm font-black text-white leading-none">Market Strategy Engine</h2></div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Market open/closed pill */}
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${
                    marketStatus.open
                      ? 'bg-emerald-500/10 border-emerald-500/20'
                      : 'bg-amber-500/10 border-amber-500/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${marketStatus.open ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span className={`text-[8px] font-bold ${marketStatus.open ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {marketStatus.open ? 'LIVE' : 'CLOSED'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                    {isOnline ? <Wifi className="w-2.5 h-2.5 text-[#0cd89a]" /> : <WifiOff className="w-2.5 h-2.5 text-red-400" />}
                    <span className="text-[8px] font-bold text-white/60">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
                  </div>
                  <button onClick={() => loadMarketData(true)} disabled={refreshing} className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                    <RefreshCw className={`w-3.5 h-3.5 text-white/60 ${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

            {/* AI Insight */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-4">
              <div className="flex items-center gap-1.5 mb-1.5"><Zap className="w-3 h-3 text-[#0cd89a]" /><span className="text-[8px] font-black uppercase tracking-widest text-[#0cd89a]">AI Market Briefing</span></div>
              {aiLoading ? (
                <div className="flex gap-1 items-center">{[0, 0.2, 0.4].map(d => (<motion.div key={d} className="w-1 h-1 rounded-full bg-white/40" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: d }} />))}<span className="text-[10px] text-white/40 ml-1">Generating insight…</span></div>
              ) : (<p className="text-[11px] text-white/80 leading-relaxed">{aiInsight || 'Market analysis unavailable.'}</p>)}
              {snapshot?.fetchedAt && <p className="text-[8px] text-white/30 mt-1.5 font-bold">Updated {snapshot.fetchedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 text-center"><p className="text-lg font-black text-white">{news.length || signals.length}</p><p className="text-[8px] font-bold uppercase tracking-widest text-white/40">Updates</p></div>
              <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 text-center"><p className="text-lg font-black text-[#f59e0b]">{urgentCount}</p><p className="text-[8px] font-bold uppercase tracking-widest text-white/40">Action Req.</p></div>
              <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 text-center"><p className="text-lg font-black text-[#0cd89a]">{executedIds.size}</p><p className="text-[8px] font-bold uppercase tracking-widest text-white/40">Executed</p></div>
            </div>
          </div>
        </div>

        {/* ── Market Closed Global Banner ── */}
        {(!marketStatus.open || dataFromCache || dataIsFallback) && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-amber-800 uppercase tracking-wide">
                {dataIsFallback ? 'Last Session Data (Apr 22, 2025)' : dataFromCache ? 'Cached Data' : 'Market Closed'}
              </p>
              <p className="text-[9px] font-medium text-amber-700 leading-relaxed">
                {dataIsFallback
                  ? 'NSE/BSE data unavailable after hours. Showing Apr 22 closing prices. Live prices return Mon–Fri 9:15–15:30 IST.'
                  : dataFromCache
                    ? 'Serving cached last-session data. Prices update when market reopens.'
                    : 'NSE/BSE closed. Displaying last session data. Market reopens Mon–Fri at 9:15 AM IST.'}
              </p>
            </div>
            <button onClick={() => loadMarketData(true)} disabled={refreshing}
              className="shrink-0 text-[9px] font-black text-amber-600 border border-amber-300 bg-white rounded-xl px-3 py-1.5 hover:bg-amber-100 transition-all uppercase tracking-widest">
              Retry
            </button>
          </div>
        )}

        {/* ── Market Status ── */}
        <MarketStatusStrip signals={signals} />

        {/* ── 3-Tab Toggle ── */}
        <div className="flex bg-[#f1ede6] rounded-2xl p-1 gap-0.5">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all"
              style={{ background: activeTab === tab.key ? '#fdfcf9' : 'transparent', color: activeTab === tab.key ? '#1b3a57' : '#8a9bb0', boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content Panels ── */}
        <AnimatePresence mode="wait">

          {/* ── NEWS ── */}
          {activeTab === 'news' && (
            <motion.div key="news" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5 mb-3 w-fit">
                <Search className="w-3 h-3 text-indigo-500" />
                <p className="text-[8px] font-bold text-indigo-700">Tracking: {USER_HOLDINGS.join(', ')}</p>
              </div>
              {/* Cache / Fallback badge */}
              {(newsFromCache || !marketStatus.open) && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <p className="text-[9px] font-bold text-amber-700">
                    {newsFromCache
                      ? 'Cached news from last session. Live updates return when market reopens.'
                      : 'Market closed — showing last known financial news (Apr 22, 2025).'}
                  </p>
                </div>
              )}
              {newsLoading ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2"><RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" /><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Fetching news…</p></div>
              ) : news.length > 0 ? (
                <div className="space-y-1.5">{news.slice(0, 15).map((item, i) => <NewsCard key={i} item={item} index={i} />)}</div>
              ) : (
                <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-2xl p-5 text-center space-y-2"><Newspaper className="w-8 h-8 text-slate-200 mx-auto" /><p className="text-xs font-bold text-slate-500">No news available</p><p className="text-[10px] text-slate-400">News for {USER_HOLDINGS.join(', ')} will appear here.</p></div>
              )}
            </motion.div>
          )}

          {/* ── LIVE STOCKS ── */}
          {activeTab === 'stocks' && (
            <motion.div key="stocks" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
              
              {/* Fallback / Cache badge for stocks */}
              {(stocksFromCache || stocksIsFallback) && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <p className="text-[9px] font-bold text-amber-700">
                    {stocksIsFallback
                      ? 'Showing Apr 22, 2025 closing prices. Each row is tagged “Last Session”. Live prices return Mon–Fri 9:15–15:30 IST.'
                      : 'Market Closed — Showing cached last session prices. Updates when market reopens.'}
                  </p>
                </div>
              )}

              {/* Sub-tabs for Indian/Global */}
              <div className="flex border-b border-slate-100 mb-2">
                <button 
                  onClick={() => setStockSubTab('indian')}
                  className={`pb-2 px-4 text-[10px] font-black uppercase tracking-widest transition-all ${stockSubTab === 'indian' ? 'text-[#0cd89a] border-b-2 border-[#0cd89a]' : 'text-slate-400'}`}
                >
                  Indian Indices
                </button>
                <button 
                  onClick={() => setStockSubTab('global')}
                  className={`pb-2 px-4 text-[10px] font-black uppercase tracking-widest transition-all ${stockSubTab === 'global' ? 'text-[#0cd89a] border-b-2 border-[#0cd89a]' : 'text-slate-400'}`}
                >
                  Global Indices
                </button>
              </div>

              {stockSubTab === 'indian' ? (
                <>
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={stockSearch}
                      onChange={e => setStockSearch(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSearchStock()}
                      placeholder="Search any stock (e.g. Wipro, SBI)..."
                      className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-10 pr-20 outline-none text-xs font-bold text-slate-700 shadow-sm focus:border-indigo-300 transition-all"
                    />
                    <button onClick={handleSearchStock} className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl hover:bg-slate-700 transition-all">
                      Search
                    </button>
                  </div>

                  {/* Search Result */}
                  {searchLoading && (
                    <div className="flex items-center justify-center py-4 gap-2"><RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" /><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Searching…</span></div>
                  )}
                  {searchResult && !searchLoading && (
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Search Result</p>
                      <StockRow data={searchResult} name={stockSearch} />
                    </div>
                  )}

                  {/* Your Holdings */}
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">📊 Your Holdings</p>
                    {stocksLoading ? (
                      <div className="flex items-center justify-center py-6 gap-2"><RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" /><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Loading live data…</span></div>
                    ) : (
                      <div className="space-y-1.5">
                        {USER_HOLDINGS.map(name => (
                          <StockRow key={name} name={name} data={stocksData[name] || null} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Live Indices */}
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">🏛️ Live Indices</p>
                    {stocksLoading ? (
                      <div className="flex items-center justify-center py-6 gap-2"><RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" /><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Loading indices…</span></div>
                    ) : (
                      <div className="space-y-1.5">
                        {INDEX_TICKERS.map(name => {
                          // Try to find in indicesData first
                          const item = indicesData.find((idx: any) => 
                            idx.name?.toLowerCase().includes(name.toLowerCase()) || 
                            name.toLowerCase().includes(idx.name?.toLowerCase())
                          );
                          return (
                            <StockRow key={name} name={name} data={item || stocksData[name] || null} />
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Trending from snapshot */}
                  {snapshot?.trending && (
                    <div className="space-y-4 pt-2">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">🔥 Top Gainers</p>
                        <div className="space-y-1.5">
                          {snapshot.trending.trending_stocks.top_gainers.slice(0, 4).map((s, i) => (
                            <div key={i} className="bg-emerald-50/50 border border-emerald-100 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <TrendingUp className="w-3 h-3 text-emerald-500" />
                                <span className="text-[11px] font-bold text-slate-700 truncate">{s.company_name}</span>
                              </div>
                              <span className="text-[10px] font-black text-emerald-600 shrink-0">+{s.percent_change}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">📉 Top Losers</p>
                        <div className="space-y-1.5">
                          {snapshot.trending.trending_stocks.top_losers.slice(0, 4).map((s, i) => (
                            <div key={i} className="bg-red-50/50 border border-red-100 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <TrendingDown className="w-3 h-3 text-red-500" />
                                <span className="text-[11px] font-bold text-slate-700 truncate">{s.company_name}</span>
                              </div>
                              <span className="text-[10px] font-black text-red-600 shrink-0">{s.percent_change}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <Activity className="w-10 h-10 text-slate-200 mx-auto" />
                  <p className="text-xs font-bold text-slate-400">Global Indices Integration Pending</p>
                  <p className="text-[10px] text-slate-300 max-w-[200px] mx-auto">Real-time connection to NASDAQ, NYSE, and FTSE 100 is being established.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ── ACTIONS ── */}
          {activeTab === 'actions' && (
            <motion.div key="recs" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
              {recommendations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3"><CheckCircle className="w-12 h-12 text-emerald-300" /><p className="font-black text-slate-500">Portfolio is optimally balanced</p><p className="text-xs text-slate-300">No rebalancing actions required</p></div>
              ) : (
                <>
                  <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-2xl px-3 py-2.5"><Shield className="w-4 h-4 text-indigo-500 shrink-0" /><p className="text-[10px] text-indigo-700 font-bold leading-tight">Cyber-protected actions trigger multi-layer security review including OTP and cooling-off protocols.</p></div>
                  {recommendations.map(rec => <RecCard key={rec.id} rec={rec} onExecute={handleExecute} executedIds={executedIds} />)}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Cyber Modal ── */}
      <AnimatePresence>
        {cyberModal && <CyberModal rec={cyberModal.rec} check={cyberModal.check} onConfirm={handleCyberConfirm} onCancel={() => setCyberModal(null)} />}
      </AnimatePresence>
    </>
  );
};

export default MarketRecommendationEngine;
