import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
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
import { TrendingUp, Clock, Layers, Zap, LayoutGrid, Brain } from 'lucide-react';
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

const WealthOverviewPanel: React.FC<Props> = ({ aiInsight }) => {
  const accounts = useMemo(() => MOCK_LINKED_ACCOUNTS, []);

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
                { label: 'Growth', value: `+${NET_WORTH_METRICS.monthlyGrowth}%`, color: 'text-emerald-600', sub: '' },
                { label: 'CAGR', value: `${NET_WORTH_METRICS.annualCAGR}%`, color: 'text-slate-900', sub: '' },
                { label: 'Debt', value: `${NET_WORTH_METRICS.debtBurdenRatio}%`, color: 'text-[#5c7a92]', sub: 'Debt-to-Equity ratio' },
                { label: 'Liquidity', value: `${NET_WORTH_METRICS.emergencyRunwayMonths}mo`, color: 'text-slate-900', sub: `Liquidity: ${NET_WORTH_METRICS.emergencyRunwayMonths}mo` },
              ].map(m => (
                <div key={m.label} className="bg-white/70 border border-[#e6e4d9] rounded-2xl p-4 flex flex-col items-center justify-center min-h-[90px] shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all hover:bg-white/90">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#5c6065] mb-2">{m.label}</p>
                  <p className={`text-xl sm:text-2xl font-black tracking-tight ${m.color}`}>{m.value}</p>
                  {m.sub && <p className="text-[10px] text-slate-500 font-medium mt-1">{m.sub}</p>}
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
        <SectionHeader icon={TrendingUp} title="Linked Accounts" subtitle="Real-time multi-bank sync" badge={String(TWIN_OVERVIEW.institutionsLinked)} />
        <div className="space-y-3">
          {accounts.map(acc => (
            <motion.div key={acc.id} whileHover={{ y: -1 }}
              className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[24px] p-4 flex items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg grayscale opacity-60 bg-slate-50 border border-slate-100">
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
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WealthOverviewPanel;
