import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import {
  MOCK_LINKED_ACCOUNTS, MOCK_AI_INTERVENTIONS, NET_WORTH_METRICS,
  UNIFIED_FINANCIAL_IDENTITY,
} from '../data/wealthTwinData';
import {
  TrendingUp, Search, ChevronRight, ShieldCheck, Zap,
  BarChart3, ArrowUpRight, ArrowRight, Sparkles, Target, XCircle,
  Lock, Plus, Check,
} from 'lucide-react';
import type { ProfileData } from '../types/profile';
import { containerVars, itemVars, fmtShort as twinFmtShort } from './twin/TwinUtils';
import MarketRecommendationEngine from './invest/MarketRecommendationEngine';

const fmtShort = (v: number) =>
  v >= 10000000 ? `${(v / 10000000).toFixed(1)}Cr` :
  v >= 100000 ? `${(v / 100000).toFixed(0)}L` :
  `${(v / 1000).toFixed(0)}K`;

const investmentAccounts = MOCK_LINKED_ACCOUNTS.filter(a => a.category === 'investment');
const retirementAccounts = MOCK_LINKED_ACCOUNTS.filter(a => a.category === 'retirement');

const investAllocation = [
  { name: 'Equity MFs', value: 1250000, color: '#1f8c5c', pct: 44 },
  { name: 'Stocks', value: 650000, color: '#1b3a57', pct: 23 },
  { name: 'Digital Gold', value: 350000, color: '#b45309', pct: 12 },
  { name: 'NPS', value: 380000, color: '#1d4ed8', pct: 13 },
  { name: 'EPF + PPF', value: 215000 + 520000, color: '#536375', pct: 26 },
];

// ─── Holding Detail Sheet ─────────────────────────────────────────────────────

const HoldingDetailSheet: React.FC<{
  account: any;
  onClose: () => void;
}> = ({ account, onClose }) => {
  return (
    <div className="fixed inset-0 z-[250] flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full max-w-[430px] bg-[#fdfcf9] rounded-t-[40px] overflow-hidden shadow-2xl flex flex-col h-[75vh]"
      >
        <div className="h-1.5 w-12 bg-slate-200 rounded-full mx-auto mt-3 mb-1 shrink-0" />
        
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: account.color + '15', border: `1px solid ${account.color}25` }}>
              {account.icon}
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Account Details</p>
              <h3 className="text-sm font-black text-slate-900">{account.institution}</h3>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar space-y-6">
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
             <p className="text-[10px] font-black uppercase tracking-widest text-[#8a9bb0] mb-1">Total Position Value</p>
             <h2 className="text-3xl font-black text-[#1b3a57]">₹{account.balance.toLocaleString('en-IN')}</h2>
             <div className="flex items-center gap-2 mt-4">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${account.growth >= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {account.growth >= 0 ? '+' : ''}{account.growth}% Unrealized
                </span>
                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {account.accountType}
                 </span>
             </div>
          </div>

          <div className="space-y-3">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Allocation</h4>
             <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-slate-50">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-xs font-bold text-slate-700">Equities</span>
                   </div>
                   <span className="text-xs font-black text-slate-900">72%</span>
                </div>
                <div className="p-4 flex items-center justify-between border-b border-slate-50">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-700">Mutual Funds</span>
                   </div>
                   <span className="text-xs font-black text-slate-900">22%</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                      <span className="text-xs font-bold text-slate-700">Cash/Liquid</span>
                   </div>
                   <span className="text-xs font-black text-slate-900">6%</span>
                </div>
             </div>
          </div>

          <div className="bg-indigo-900 rounded-[28px] p-5 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-[0.05] pointer-events-none">
                <Sparkles className="w-20 h-20" />
             </div>
             <div className="relative z-10 flex items-start gap-3">
                <div className="p-2 bg-white/10 rounded-xl"><Lock className="w-4 h-4 text-emerald-400" /></div>
                <div className="flex-1">
                   <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-1">Cyber-Protected Vault</p>
                   <p className="text-[11px] font-medium leading-relaxed text-indigo-100">
                     This holding is verified via multi-layer financial sync. All transactions are protected by Alpha Vault's cooling-off protocol.
                   </p>
                </div>
             </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
           <button onClick={onClose} className="w-full bg-slate-900 text-white rounded-2xl py-4 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-slate-200">
              Close Details
           </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Add Investment Sheet ─────────────────────────────────────────────────────

const PLATFORMS = [
  { name: 'Zerodha – Kite', icon: '📊', type: 'Demat / Stocks', color: '#c5a059' },
  { name: 'Groww', icon: '🌱', type: 'Mutual Funds (SIP)', color: '#10b981' },
  { name: 'Upstox', icon: '📈', type: 'Stocks & MFs', color: '#6366f1' },
  { name: 'Kotak Securities', icon: '🏖️', type: 'NPS / Stocks', color: '#0891b2' },
  { name: 'DigiGold Vault', icon: '🪙', type: 'Digital Gold', color: '#f59e0b' },
  { name: 'Paytm Money', icon: '📱', type: 'Mutual Funds', color: '#3b82f6' },
  { name: 'Angel One', icon: '💹', type: 'Stocks & F&O', color: '#1d4ed8' },
  { name: 'SBI MF', icon: '🏦', type: 'Mutual Funds', color: '#1e40af' },
  { name: 'HDFC Securities', icon: '🏛️', type: 'Demat / Stocks', color: '#7c3aed' },
  { name: 'ICICI Direct', icon: '🔒', type: 'Stocks & MFs', color: '#ea580c' },
  { name: 'Other Platform', icon: '➕', type: 'Custom', color: '#64748b' },
];

const AddInvestmentSheet: React.FC<{
  onClose: () => void;
  onAdd: (holding: any) => void;
}> = ({ onClose, onAdd }) => {
  const [step, setStep] = useState<'platform' | 'details' | 'done'>('platform');
  const [selectedPlatform, setSelectedPlatform] = useState<typeof PLATFORMS[0] | null>(null);
  const [accountNum, setAccountNum] = useState('');
  const [balance, setBalance] = useState('');
  const [searchPlatform, setSearchPlatform] = useState('');

  const filteredPlatforms = PLATFORMS.filter(p =>
    p.name.toLowerCase().includes(searchPlatform.toLowerCase())
  );

  const handleSubmit = () => {
    if (!selectedPlatform || !balance) return;
    onAdd({
      id: `custom_${Date.now()}`,
      institution: selectedPlatform.name,
      shortName: selectedPlatform.name.split(' ')[0],
      accountType: selectedPlatform.type,
      accountNumber: accountNum || '••••' + Math.floor(1000 + Math.random() * 9000),
      balance: parseInt(balance.replace(/,/g, ''), 10) || 0,
      category: 'investment' as const,
      lastSync: 'Just now',
      icon: selectedPlatform.icon,
      color: selectedPlatform.color,
      growth: 0,
    });
    setStep('done');
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full max-w-[430px] bg-[#fdfcf9] rounded-t-[40px] overflow-hidden shadow-2xl flex flex-col h-[80vh]"
      >
        <div className="h-1.5 w-12 bg-slate-200 rounded-full mx-auto mt-3 mb-1 shrink-0" />

        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <Plus className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-indigo-500">New Holding</p>
              <h3 className="text-sm font-black text-slate-900">Add Investment</h3>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 no-scrollbar">
          <AnimatePresence mode="wait">
            {/* STEP 1: Select Platform */}
            {step === 'platform' && (
              <motion.div key="platform" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <p className="text-[10px] font-bold text-slate-500">Select the investment platform you want to link or add:</p>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchPlatform}
                    onChange={e => setSearchPlatform(e.target.value)}
                    placeholder="Search platforms..."
                    className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-11 pr-4 outline-none text-xs font-bold text-slate-700 shadow-sm focus:border-indigo-300"
                  />
                </div>

                <div className="space-y-2">
                  {filteredPlatforms.map(platform => (
                    <button
                      key={platform.name}
                      onClick={() => { setSelectedPlatform(platform); setStep('details'); }}
                      className="w-full flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4 hover:shadow-sm hover:border-indigo-200 transition-all text-left"
                    >
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0"
                        style={{ background: platform.color + '15', border: `1px solid ${platform.color}25` }}>
                        {platform.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800">{platform.name}</p>
                        <p className="text-[9px] font-medium text-slate-400">{platform.type}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-200" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Enter Details */}
            {step === 'details' && selectedPlatform && (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: selectedPlatform.color + '15', border: `1px solid ${selectedPlatform.color}25` }}>
                    {selectedPlatform.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{selectedPlatform.name}</p>
                    <p className="text-[9px] font-medium text-slate-400">{selectedPlatform.type}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Account Number / Folio (Optional)</label>
                    <input
                      type="text"
                      value={accountNum}
                      onChange={e => setAccountNum(e.target.value)}
                      placeholder="e.g. ••••7789"
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 px-4 outline-none text-sm font-bold text-slate-700 focus:border-indigo-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Current Value (₹) *</label>
                    <input
                      type="text"
                      value={balance}
                      onChange={e => setBalance(e.target.value.replace(/[^0-9,]/g, ''))}
                      placeholder="e.g. 5,00,000"
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 px-4 outline-none text-sm font-bold text-slate-700 focus:border-indigo-300 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep('platform')} className="flex-1 bg-slate-100 text-slate-600 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest">
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!balance}
                    className="flex-1 bg-indigo-600 text-white py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-500 transition-all disabled:opacity-30"
                  >
                    Add Holding
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Success */}
            {step === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-16 gap-5 text-center">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center"
                >
                  <Check className="w-10 h-10 text-emerald-600" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 mb-1">Holding Added!</h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {selectedPlatform?.name} has been added to your investment portfolio.
                  </p>
                </div>
                <button onClick={onClose} className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg">
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

const InvestScreen: React.FC<{ profile: ProfileData }> = ({ profile }) => {
  const [activeAccount, setActiveAccount] = useState<any>(null);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [customHoldings, setCustomHoldings] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('alpha_vault_custom_holdings');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const allInvestAccounts = [...investmentAccounts, ...retirementAccounts, ...customHoldings];

  const handleAddHolding = (holding: any) => {
    const updated = [...customHoldings, holding];
    setCustomHoldings(updated);
    localStorage.setItem('alpha_vault_custom_holdings', JSON.stringify(updated));
  };

  const totalInvestments = UNIFIED_FINANCIAL_IDENTITY.totalInvestments + UNIFIED_FINANCIAL_IDENTITY.totalRetirement
    + customHoldings.reduce((sum, h) => sum + (h.balance || 0), 0);

  return (
    <div className="flex-1 flex flex-col bg-[#f5f4ef] min-h-screen text-[#1b3a57] overflow-y-auto pb-32 font-sans no-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#f5f4ef]/90 backdrop-blur-xl border-b border-[#e6e4d9] px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-[46px] h-[46px] rounded-[18px] bg-[#0e212b] border border-[#1b3a5a] flex items-center justify-center text-[#0cd89a] shrink-0 shadow-lg">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[.3em] text-[#1f8c5c] mb-1 leading-none">Investment Intelligence</p>
            <h1 className="text-xl font-black tracking-tight text-[#1b3a57] leading-none">Alpha Vault</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-[#fdfcf9] rounded-xl text-slate-400 border border-[#e6e4d9] hover:text-slate-900 transition-all shadow-sm">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="px-5 py-6">
        <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-6">

          {/* ── Portfolio Hero ── */}
          <motion.div variants={itemVars}>
            <div className="bg-[#fdfcf9] rounded-[24px] p-6 border border-[#e6e4d9] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
              <div className="w-full md:w-2/5 h-52 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={investAllocation} cx="50%" cy="50%" innerRadius={65} outerRadius={88} paddingAngle={5} dataKey="value" stroke="none">
                      {investAllocation.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#0e212b', border: 'none', borderRadius: 12, color: '#fff', fontSize: 10, padding: '8px 12px' }}
                      formatter={(val: any) => [`₹${twinFmtShort(val)}`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#8a9bb0]">Total AUM</p>
                  <h3 className="text-2xl font-black text-[#1b3a57]">₹{twinFmtShort(totalInvestments)}</h3>
                  <span className="text-[9px] font-black text-[#1f8c5c] flex items-center gap-1 uppercase tracking-widest">
                    <ArrowUpRight className="w-3 h-3" />+{NET_WORTH_METRICS.annualCAGR}% CAGR
                  </span>
                </div>
              </div>

              <div className="w-full md:w-3/5 space-y-3 relative z-10">
                <div className="flex items-center gap-2 mb-3 bg-[#d2efe2] border border-[#bce3d1] w-fit px-3 py-1.5 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5 text-[#1f8c5c]" />
                  <span className="text-[9px] font-black text-[#1f8c5c] uppercase tracking-widest">Portfolio Health: Optimal</span>
                </div>
                {investAllocation.map(asset => (
                  <div key={asset.name} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-[#8a9bb0] flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: asset.color }} /> {asset.name}
                      </span>
                      <span className="text-[#1b3a57] font-black">₹{twinFmtShort(asset.value)}</span>
                    </div>
                    <div className="h-[6px] bg-[#e3e6ea] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${asset.pct}%` }}
                        transition={{ duration: 1.5, ease: 'circOut' }}
                        className="h-full rounded-full" style={{ background: asset.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── MARKET STRATEGY ENGINE ── */}
          <motion.div variants={itemVars}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-lg bg-[#0e212b] flex items-center justify-center">
                <BarChart3 className="w-3 h-3 text-[#0cd89a]" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Market-Aware Strategy Engine</h3>
              <span className="text-[8px] font-black text-[#1f8c5c] bg-[#d2efe2] border border-[#bce3d1] px-2 py-0.5 rounded-full uppercase tracking-widest">AI LIVE</span>
            </div>
            <MarketRecommendationEngine profile={profile} />
          </motion.div>

          {/* ── Investment Holdings ── */}
          <motion.div variants={itemVars}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-500" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Investment Holdings</h3>
              </div>
              <span className="text-[9px] font-bold text-slate-400">{allInvestAccounts.length} Accounts</span>
            </div>
            <div className="space-y-2">
              {allInvestAccounts.map(acc => (
                <motion.div key={acc.id} whileHover={{ x: 2 }}
                  onClick={() => setActiveAccount(acc)}
                  className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:shadow-sm transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={{ background: acc.color + '15', border: `1px solid ${acc.color}25` }}>
                      {acc.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{acc.institution}</p>
                      <p className="text-[9px] font-medium text-slate-400">{acc.accountType} • {acc.accountNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-800">₹{fmtShort(acc.balance)}</p>
                      {acc.growth !== undefined && (
                        <p className={`text-[9px] font-bold ${acc.growth >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                          {acc.growth >= 0 ? '+' : ''}{acc.growth}% p.a.
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Add Investment Button */}
            <button
              onClick={() => setShowAddSheet(true)}
              className="w-full mt-3 py-3.5 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-xs flex items-center justify-center gap-2 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Add Investment Holding
            </button>
          </motion.div>

          {/* ── AI Strategy Card ── */}
          <motion.div variants={itemVars}>
            <div className="bg-slate-900 rounded-[24px] p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                <BarChart3 className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit mb-4">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Rebalance Intelligence</span>
                </div>
                <h4 className="text-lg font-black tracking-tight mb-2">Gold Overexposure — Rebalance ₹2.8L</h4>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-5">
                  Combined gold (physical + digital) is at <span className="text-amber-400 font-bold">7.4%</span> of net worth vs recommended 5%. 
                  Shifting ₹2.8L to equity mutual funds would improve your diversification score by <span className="text-emerald-400 font-bold">+12 points</span>.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all">
                    Execute Rebalance
                  </button>
                  <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all">
                    View Analysis
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Top Interventions ── */}
          <motion.div variants={itemVars}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Investment Opportunities</h3>
              </div>
            </div>
            <div className="space-y-3">
              {MOCK_AI_INTERVENTIONS.filter(i => ['cash', 'gold', 'investment', 'tax'].includes(i.category)).slice(0, 3).map(int => (
                <div key={int.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-start gap-3 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-slate-50 border border-slate-100 shrink-0">{int.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-slate-800 leading-tight mb-1">{int.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-2">{int.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[10px] font-black ${int.impactPositive ? 'text-emerald-500' : 'text-red-400'}`}>{int.impact}</span>
                    <button className="text-[8px] font-black uppercase text-indigo-500 flex items-center gap-1">
                      {int.actionLabel} <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {activeAccount && (
          <HoldingDetailSheet
            account={activeAccount}
            onClose={() => setActiveAccount(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAddSheet && (
          <AddInvestmentSheet
            onClose={() => setShowAddSheet(false)}
            onAdd={handleAddHolding}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(InvestScreen);
