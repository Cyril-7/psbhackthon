import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltipJS,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltipJS,
  Filler,
  Legend
);
import { 
  TrendingUp, Clock, Layers, Zap, LayoutGrid, Brain, Plus, X, Shield, Landmark 
} from 'lucide-react';
import { 
  MOCK_LINKED_ACCOUNTS, MOCK_NET_WORTH_TIMELINE, NET_WORTH_METRICS, TWIN_OVERVIEW 
} from '../../data/wealthTwinData';
import { 
  containerVars, itemVars, fmt, fmtShort, SectionHeader, StatCard 
} from './TwinUtils';

interface Props {
  aiInsight: string | null;
}

const categoryConfig: Record<string, { label: string; color: string }> = {
  liquid:     { label: 'Liquid', color: '#1e293b' },
  investment: { label: 'Investment', color: '#2563eb' },
  liability:  { label: 'Liability', color: '#64748b' },
  insurance:  { label: 'Protection', color: '#475569' },
  retirement: { label: 'Retirement', color: '#0f172a' },
  business:   { label: 'SME/Corp', color: '#334155' },
};

const AddAccountSheet: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleLink = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-[430px] bg-[#fcfbf9] rounded-t-[32px] sm:rounded-[40px] p-8 space-y-6 relative border border-[#e6e4d9] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-[#e6e4d9] rounded-full mx-auto sm:hidden mb-2" />
        
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-[#1b3a57] tracking-tight">LINK NEW NODE</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[.2em]">Institutional Account Aggregator</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white border border-[#e6e4d9] rounded-xl text-slate-400 hover:text-slate-900 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 1 ? (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-3">
              {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'KOTAK', 'HSBC'].map(bank => (
                <button 
                  key={bank}
                  onClick={() => setStep(2)}
                  className="bg-white border border-[#e6e4d9] p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all hover:border-[#1b3a57] hover:bg-[#f5f7f9] group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#f5f4f0] flex items-center justify-center text-slate-500 group-hover:text-[#1b3a57] transition-colors">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-[#1b3a57]">{bank}</span>
                </button>
              ))}
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or integrate via Account Aggregator</p>
              <button className="mt-4 w-full bg-[#1b3a57] text-[#0cd89a] py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all">
                Connect via Sahamati AA
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 py-6">
            <div className="bg-white border border-[#e6e4d9] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-4 border-b border-[#f5f4f0] pb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorization Pending</p>
                  <p className="text-sm font-black text-[#1b3a57]">Confirm OTP Sent to +91 ••••• ••923</p>
                </div>
              </div>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="w-10 h-12 bg-[#f5f4f0] border border-[#e6e4d9] rounded-xl flex items-center justify-center font-black text-xl text-[#1b3a57]">
                    {i === 1 ? '7' : ''}
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleLink}
              disabled={loading}
              className="w-full bg-[#1b3a57] text-white py-5 rounded-2xl font-black uppercase tracking-[.3em] text-[11px] flex items-center justify-center gap-3 relative overflow-hidden group shadow-xl"
            >
              <AnimatePresence>
                {loading && (
                  <motion.div 
                    initial={{ x: "-100%" }} animate={{ x: "100%" }} 
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 bg-white/10" 
                  />
                )}
              </AnimatePresence>
              {loading ? 'Authenticating...' : 'Authorize Institutional Link'}
            </button>
            <button onClick={() => setStep(1)} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
              Reset selection
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 opacity-40 py-2">
          <Shield className="w-3 h-3" />
          <span className="text-[8px] font-black uppercase tracking-[.4em]">256-BIT AES ENCRYPTED</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const WealthOverviewPanel: React.FC<Props> = ({ aiInsight }) => {
  const [accounts, setAccounts] = useState<typeof MOCK_LINKED_ACCOUNTS>(() => {
    const saved = localStorage.getItem('securewealth_linked_accounts');
    return saved ? JSON.parse(saved) : MOCK_LINKED_ACCOUNTS;
  });
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<typeof MOCK_LINKED_ACCOUNTS[0] | null>(null);

  const deleteAccount = (id: string) => {
    const newAccounts = accounts.filter(acc => acc.id !== id);
    setAccounts(newAccounts);
    localStorage.setItem('securewealth_linked_accounts', JSON.stringify(newAccounts));
  };

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">

      {/* ── Hero Net Worth Card ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fcfbf9] rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 relative overflow-hidden border border-[#e6e4d9] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="relative z-10">
            <div className="flex flex-col mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-4">
                <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-[#5c6065]">
                  Institutional Link • {TWIN_OVERVIEW.institutionsLinked} Nodes Active
                </span>
              </div>
              <p className="text-slate-900 text-[11px] font-bold uppercase tracking-widest mb-1">Unified Net Worth</p>
              <h2 className="text-[46px] font-black text-[#1b3a57] tracking-tight leading-none mt-1">
                <span className="pr-1 text-[38px]">₹</span>{fmt(NET_WORTH_METRICS.total)}
              </h2>
            </div>

            {/* Metric Row - Monochromatic Professional */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6">
              {[
                { label: 'Growth', value: `+${NET_WORTH_METRICS.monthlyGrowth}%`, color: 'text-emerald-500', sub: '30-day change in total equity' },
                { label: 'CAGR', value: `${NET_WORTH_METRICS.annualCAGR}%`, color: 'text-[#1b3a57]', sub: 'Compound Annual Growth Rate' },
                { label: 'Debt', value: `${NET_WORTH_METRICS.debtBurdenRatio}%`, color: 'text-blue-600', sub: 'Total Liabilities / Total Assets' },
                { label: 'Liquidity', value: `${NET_WORTH_METRICS.emergencyRunwayMonths}mo`, color: 'text-[#1b3a57]', sub: 'Cash / Monthly Expenditures' },
              ].map(m => (
                <div key={m.label} className="bg-white/70 border border-[#e6e4d9] rounded-2xl p-4 flex flex-col items-center justify-center min-h-[100px] shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all hover:bg-white/90">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#5c6065] mb-2">{m.label}</p>
                  <p className={`text-xl sm:text-2xl font-black tracking-tight ${m.color}`}>{m.value}</p>
                  {m.sub && <p className="text-[9px] text-[#8a9bb0] font-bold uppercase tracking-widest mt-2">{m.sub}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── AI Insights - Consolidated Look ── */}
      {aiInsight && (
        <motion.div variants={itemVars}>
          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 flex gap-4 items-start">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-blue-100 shrink-0">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Strategic Intervention</p>
              <p className="text-[13px] text-slate-700 font-medium leading-relaxed">{aiInsight}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Net Worth Timeline Chart ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fcfbf9] border border-[#e6e4d9] rounded-[24px] sm:rounded-[28px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] pt-5 pb-0">
          <div className="px-5 sm:px-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Timeline Velocity</h3>
              <span className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest ml-3">
                6-Month Rolling
              </span>
            </div>
            <div className="h-56">
              <Line
                data={{
                  labels: MOCK_NET_WORTH_TIMELINE.map(d => d.month),
                  datasets: [
                    {
                      fill: true,
                      label: 'Net Worth',
                      data: MOCK_NET_WORTH_TIMELINE.map(d => d.total),
                      borderColor: '#418b95',
                      borderWidth: 3,
                      backgroundColor: (context: any) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                        gradient.addColorStop(0, 'rgba(65, 139, 149, 0.25)');
                        gradient.addColorStop(1, 'rgba(65, 139, 149, 0)');
                        return gradient;
                      },
                      tension: 0.4,
                      pointRadius: 3,
                      pointBackgroundColor: '#fff',
                      pointBorderColor: '#418b95',
                      pointBorderWidth: 1.5,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: '#418b95',
                      pointHoverBorderColor: '#fff',
                      pointHoverBorderWidth: 2,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      enabled: true,
                      backgroundColor: '#0f172a',
                      titleFont: { size: 10, weight: 'bold' },
                      bodyFont: { size: 12, weight: 'bold' },
                      padding: 12,
                      cornerRadius: 12,
                      displayColors: false,
                      callbacks: {
                        label: (context: any) => `₹${fmtShort(context.parsed.y)}`,
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: true, color: '#e4e2d7', drawTicks: false },
                      border: { display: false },
                      ticks: {
                        color: '#5c6065',
                        font: { size: 10, weight: '500' },
                        padding: 10,
                      },
                    },
                    y: {
                      display: true,
                      grid: { display: false },
                      border: { display: false },
                      ticks: {
                        color: '#5c6065',
                        font: { size: 10, weight: '500' },
                        callback: (val: any) => `${(val / 10000000).toFixed(2)}Cr`,
                      },
                      suggestedMin: Math.min(...MOCK_NET_WORTH_TIMELINE.map(d => d.total)) - 200000,
                      suggestedMax: Math.max(...MOCK_NET_WORTH_TIMELINE.map(d => d.total)) + 200000,
                    },
                  },
                } as any}
              />
            </div>
          </div>
          <div className="border-t border-[#e6e4d9] p-4 sm:p-5 flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-[#eae8de] text-slate-700">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Unified Twin</p>
                <p className="text-[14px] sm:text-[15px] font-medium text-slate-900 leading-none">₹{fmtShort(NET_WORTH_METRICS.total)} Net Worth</p>
              </div>
            </div>
            <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest ml-3">
              +{NET_WORTH_METRICS.monthlyGrowth}% MoM
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Financial Exposure Overview ── */}
      <motion.div variants={itemVars}>
        <SectionHeader icon={Layers} title="Global Balance" subtitle="Account Aggregator Aggregation" badge="SECURE" />
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard label="Financial" value={`₹${fmtShort(NET_WORTH_METRICS.financialAssets)}`} sub="All Accounts" color="text-slate-900" />
          <StatCard label="Physical" value={`₹${fmtShort(NET_WORTH_METRICS.physicalAssets)}`} sub="Asset Vault" color="text-slate-700" />
          <StatCard label="Liabilities" value={`-₹${fmtShort(NET_WORTH_METRICS.liabilities)}`} sub="Total Debt" color="text-slate-500" />
          <StatCard label="Risk Index" value={`${NET_WORTH_METRICS.assetDiversificationScore}/100`} sub="Institutional Score" color="text-blue-600" />
        </div>
      </motion.div>

      {/* ── Account List ── */}
      <motion.div variants={itemVars}>
        <SectionHeader icon={TrendingUp} title="Linked Accounts" subtitle="Real-time multi-bank sync" badge={String(accounts.length)} />
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {accounts.map(acc => (
              <div key={acc.id} className="relative overflow-hidden rounded-[24px]">
                {/* Deactivation Action (Behind the Card) */}
                <div className="absolute inset-0 bg-[#dc2626] flex items-center justify-end px-8 rounded-[24px]">
                  <div className="flex flex-col items-center gap-1 text-white opacity-80 group-swipe:opacity-100 transition-opacity">
                    <X className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Unlink</span>
                  </div>
                </div>

                <motion.div
                  drag="x"
                  dragConstraints={{ left: -100, right: 0 }}
                  dragElastic={0}
                  dragMomentum={false}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) {
                      deleteAccount(acc.id);
                    }
                  }}
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  whileHover={{ cursor: 'grab' }}
                  whileTap={{ cursor: 'grabbing' }}
                  className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[24px] p-4 flex items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative z-10 hover:border-[#1b3a57] transition-all"
                  onClick={() => setSelectedAccount(acc)}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg grayscale opacity-60 bg-slate-50 border border-slate-100 shrink-0">
                    {acc.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] sm:text-[14px] font-black text-slate-900 leading-tight truncate">{acc.institution}</p>
                        <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter truncate">{acc.accountType} • {acc.accountNumber}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[13px] sm:text-[14px] font-black text-slate-900">
                          ₹{fmtShort(Math.abs(acc.balance))}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[8px] font-black uppercase text-slate-400 tracking-[.15em]">
                      {categoryConfig[acc.category]?.label}
                    </span>
                    <div className="flex items-center gap-1 text-[8px] text-slate-400 font-bold uppercase tracking-tighter">
                      <Clock className="w-2.5 h-2.5" />
                      {acc.lastSync}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Add Account Button ── */}
        <motion.div variants={itemVars} className="mt-4">
          <button 
            onClick={() => setShowAddAccount(true)}
            className="w-full border-2 border-dashed border-[#e6e4d9] rounded-[24px] p-5 flex items-center justify-center gap-3 text-slate-400 hover:border-[#1b3a57] hover:text-[#1b3a57] transition-all group shadow-sm bg-[#fcfbf9]/50"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-[#e6e4d9] flex items-center justify-center group-hover:bg-[#1b3a57] group-hover:text-[#0cd89a] transition-all">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[.2em]">Add institutional account</span>
          </button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showAddAccount && <AddAccountSheet onClose={() => setShowAddAccount(false)} />}
        {selectedAccount && <AccountDetailsModal account={selectedAccount} onClose={() => setSelectedAccount(null)} />}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Account Details Modal ──
const AccountDetailsModal: React.FC<{ 
  account: typeof MOCK_LINKED_ACCOUNTS[0]; 
  onClose: () => void 
}> = ({ account, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-[430px] bg-[#fcfbf9] rounded-t-[32px] sm:rounded-[40px] p-0 space-y-0 relative border border-[#e6e4d9] shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 pb-4 space-y-6">
          <div className="w-12 h-1.5 bg-[#e6e4d9] rounded-full mx-auto sm:hidden mb-2" />
          
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#e6e4d9] flex items-center justify-center text-2xl shadow-sm">
                {account.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#1b3a57] tracking-tight">{account.institution}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[.2em]">{account.accountType}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white border border-[#e6e4d9] rounded-xl text-slate-400 hover:text-slate-900 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-white border border-[#e6e4d9] rounded-[24px] p-6 text-center space-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Shield className="w-12 h-12 text-[#1b3a57]" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Balance</p>
            <h2 className="text-[32px] font-black text-[#1b3a57] tracking-tighter">
              <span className="text-2xl mr-1">₹</span>{fmt(Math.abs(account.balance))}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${account.balance >= 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                {account.balance >= 0 ? 'ASSET' : 'LIABILITY'}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{account.accountNumber}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Performance Insights</h4>
              {account.growth !== undefined && (
                <span className={`text-[11px] font-black ${account.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {account.growth >= 0 ? '+' : ''}{account.growth}% (30D)
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-[#e6e4d9]/50 rounded-2xl p-4">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Interest Rate</p>
                <p className="text-sm font-black text-[#1b3a57]">{account.interestRate || 'N/A'}% p.a.</p>
              </div>
              <div className="bg-slate-50 border border-[#e6e4d9]/50 rounded-2xl p-4">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Sync</p>
                <p className="text-sm font-black text-[#1b3a57]">{account.lastSync}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Recent Activity</h4>
            <div className="space-y-3">
              {[
                { label: 'UPI - Amazon Pay', val: -1240, date: 'Today' },
                { label: 'Salary Credit', val: 85000, date: '2 days ago' },
                { label: 'ATM Withdrawal', val: -5000, date: '4 days ago' },
              ].map((tx, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-[#f5f4f0] last:border-0">
                  <div>
                    <p className="text-[12px] font-black text-[#1b3a57]">{tx.label}</p>
                    <p className="text-[9px] font-medium text-slate-400">{tx.date}</p>
                  </div>
                  <p className={`text-xs font-black ${tx.val > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.val > 0 ? '+' : ''}₹{Math.abs(tx.val).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#f5f4f0]/50 border-t border-[#e6e4d9] flex gap-3">
          <button className="flex-1 bg-white border border-[#e6e4d9] text-[#1b3a57] py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-sm hover:bg-[#f5f7f9] transition-all">
            Full Statement
          </button>
          <button className="flex-1 bg-[#1b3a57] text-[#0cd89a] py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all">
            Secure Transfer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WealthOverviewPanel;
