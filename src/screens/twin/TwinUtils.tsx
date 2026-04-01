import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

// ─── Animation Variants ───────────────────────────────────────────────────────
export const containerVars: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
export const itemVars: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 22 } },
};

// ─── Formatters ───────────────────────────────────────────────────────────────
export const fmt = (v: number) =>
  v >= 10000000 ? `${(v / 10000000).toFixed(2)} Cr`
  : v >= 100000 ? `${(v / 100000).toFixed(2)} L`
  : v.toLocaleString('en-IN');

export const fmtShort = (v: number) =>
  v >= 10000000 ? `${(v / 10000000).toFixed(1)}Cr`
  : v >= 100000 ? `${(v / 100000).toFixed(0)}L`
  : `${(v / 1000).toFixed(0)}K`;

// ─── Severity / Status Colors ─────────────────────────────────────────────────
export const severityColor: Record<string, string> = {
  critical: 'bg-slate-50 text-slate-900 border-slate-200',
  warning:  'bg-slate-50 text-slate-700 border-slate-200',
  high:     'bg-slate-900 text-white border-slate-900',
  medium:   'bg-slate-50 text-slate-600 border-slate-200',
  info:     'bg-slate-50 text-slate-500 border-slate-200',
  low:      'bg-slate-50 text-slate-400 border-slate-100',
  safe:     'bg-slate-50 text-emerald-600 border-emerald-100',
};

export const statusColor: Record<string, string> = {
  allowed:    'bg-[#d2efe2] text-[#1f8c5c] border-[#bce3d1]',
  warned:     'bg-[#fff8e6] text-[#b45309] border-[#fde68a]',
  blocked:    'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]',
  cooling_off:'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]',
  escalated:  'bg-[#0e212b] text-white border-transparent',
};

export const statusLabel: Record<string, string> = {
  allowed: 'Allowed',
  warned: 'Warned',
  blocked: 'Blocked',
  cooling_off: 'Cooling Off',
  escalated: 'Escalated',
  'on-track': 'On Track',
  'at-risk': 'At Risk',
  achieved: 'Achieved',
  ahead: 'Ahead',
};

// ─── Section Header ───────────────────────────────────────────────────────────
export const SectionHeader = ({
  icon: Icon, title, subtitle, badge,
}: {
  icon: React.ElementType; title: string; subtitle?: string; badge?: string;
}) => (
  <div className="flex items-center gap-4 mb-6">
    <div className="w-[46px] h-[46px] rounded-[18px] bg-[#1b3a57] border border-[#2b4c6a] flex items-center justify-center text-[#0cd89a] shrink-0 shadow-lg">
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <h2 className="font-black text-[#1b3a57] text-[17px] tracking-tight uppercase leading-none mt-0.5">{title}</h2>
        {badge && (
          <span className="text-[10px] font-black uppercase tracking-widest text-[#1f8c5c] leading-none ml-2">
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="text-[#8a9bb0] text-[10px] font-black uppercase tracking-widest leading-none">{subtitle}</p>}
    </div>
  </div>
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export const ProgressBar = ({
  pct, color = '#10B981', delay = 0, height = 'h-2',
}: {
  pct: number; color?: string; delay?: number; height?: string;
}) => (
  <div className={`w-full ${height} bg-slate-100 rounded-full overflow-hidden`}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(pct, 100)}%` }}
      transition={{ duration: 1.1, delay, ease: [0.34, 1.56, 0.64, 1] }}
      className="h-full rounded-full"
      style={{ background: color }}
    />
  </div>
);

// ─── Recharts Custom Tooltip ──────────────────────────────────────────────────
export const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-xl min-w-[160px]">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">{label}</p>
        <div className="space-y-2">
          {payload.map((p: any) => (
            <div key={p.dataKey} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill || '#10B981' }} />
                <span className="text-[10px] font-bold text-slate-400 uppercase">{p.name}:</span>
              </div>
              <span className="text-xs font-black text-emerald-400">₹{fmtShort(p.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
export const StatCard = ({
  label, value, sub, color = 'text-[#1b3a57]', badge,
}: {
  label: string; value: string; sub?: string; color?: string; badge?: string;
}) => (
  <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[24px] p-5 space-y-2 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
    <p className="text-[9px] font-black uppercase tracking-widest text-[#8a9bb0] leading-none">{label}</p>
    <p className={`text-2xl font-black ${color} leading-none tracking-tight`}>{value}</p>
    {sub && <p className="text-[10px] font-bold text-[#8a9bb0] uppercase tracking-tighter leading-none">{sub}</p>}
    {badge && <span className="inline-block text-[9px] font-black uppercase text-[#1f8c5c] leading-none">{badge}</span>}
  </div>
);
