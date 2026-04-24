import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { Shield, AlertTriangle, ArrowRight, Zap, ChevronRight, TrendingDown, CheckCircle2, Loader2 } from 'lucide-react';
import {
  MOCK_RISK_ALERTS, RISK_SCORE_BREAKDOWN, NET_WORTH_METRICS,
} from '../../data/wealthTwinData';
import type { RiskAlert } from '../../data/wealthTwinData';
import { generateRiskNarrative } from '../../services/gemini';
import {
  containerVars, itemVars, fmtShort, SectionHeader, ProgressBar, severityColor,
} from './TwinUtils';

const riskBarData = [
  { name: 'Concentration', score: RISK_SCORE_BREAKDOWN.concentrationRisk, fill: '#ef4444' },
  { name: 'Liquidity', score: RISK_SCORE_BREAKDOWN.liquidityRisk, fill: '#f59e0b' },
  { name: 'Debt', score: RISK_SCORE_BREAKDOWN.debtRisk, fill: '#f97316' },
  { name: 'Market', score: RISK_SCORE_BREAKDOWN.marketRisk, fill: '#3b82f6' },
  { name: 'Operational', score: RISK_SCORE_BREAKDOWN.operationalRisk, fill: '#10b981' },
];

const assetAllocationData = [
  { name: 'Real Estate', value: 62, fill: '#6366f1' },
  { name: 'Gold', value: 7, fill: '#f59e0b' },
  { name: 'Equity', value: 16, fill: '#10b981' },
  { name: 'Debt', value: 9, fill: '#3b82f6' },
  { name: 'Cash', value: 6, fill: '#94a3b8' },
];

/* Detail sheet */
const RiskDetailSheet: React.FC<{ alert: RiskAlert; onClose: () => void }> = ({ alert, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end" onClick={onClose}
  >
    <motion.div
      initial={{ y: 400 }} animate={{ y: 0 }} exit={{ y: 400 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="w-full bg-white rounded-t-[32px] p-6 space-y-5 max-h-[85vh] overflow-y-auto no-scrollbar"
      onClick={e => e.stopPropagation()}
    >
      <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border ${severityColor[alert.severity]}`}>
          {alert.icon}
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800">{alert.title}</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{alert.category} • {alert.severity.toUpperCase()}</p>
        </div>
      </div>

      <p className="text-sm text-slate-600 font-medium leading-relaxed">{alert.description}</p>

      {alert.affectedAmount && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-red-400">Affected Amount</span>
          <span className="text-lg font-black text-red-500">₹{fmtShort(alert.affectedAmount)}</span>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Mitigation Steps</p>
        {alert.mitigationSteps.map((step, i) => (
          <div key={i} className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600 font-medium">{step}</p>
          </div>
        ))}
      </div>

      {alert.reallocationTarget && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <p className="text-[9px] font-black uppercase text-emerald-600 mb-1">Recommended Reallocation</p>
          <p className="text-sm font-black text-emerald-700">{alert.reallocationTarget}</p>
        </div>
      )}

      <button onClick={onClose} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm">Close</button>
    </motion.div>
  </motion.div>
);

const RiskSentinelPanel: React.FC = () => {
  const [selected, setSelected] = useState<RiskAlert | null>(null);
  const [aiNarrative, setAiNarrative] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const fetchNarrative = async () => {
      setLoadingAi(true);
      const result = await generateRiskNarrative(
        MOCK_RISK_ALERTS.map(a => ({ title: a.title, severity: a.severity, affectedAmount: a.affectedAmount }))
      );
      if (result) setAiNarrative(result);
      setLoadingAi(false);
    };
    fetchNarrative();
  }, []);

  const overallScore = RISK_SCORE_BREAKDOWN.overall;
  const scoreColor = overallScore > 70 ? '#10b981' : overallScore > 40 ? '#f59e0b' : '#ef4444';
  const scoreLabel = overallScore > 70 ? 'LOW RISK' : overallScore > 40 ? 'MODERATE RISK' : 'HIGH RISK';

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">

      {/* ── Risk Score Hero ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fcfbf9] rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 relative overflow-hidden border border-[#e6e4d9] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5">
              <Shield className="w-5 h-5" style={{ color: scoreColor }} />
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: scoreColor }}>
                Risk Sentinel Intelligence
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-6">
              {/* Score Ring */}
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f5f4f0" strokeWidth="10" />
                  <motion.circle
                    cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="10" strokeLinecap="round"
                    strokeDasharray="264"
                    initial={{ strokeDashoffset: 264 }}
                    animate={{ strokeDashoffset: 264 - (264 * overallScore) / 100 }}
                    transition={{ duration: 2 }}
                  />
                  <defs>
                    <filter id="scoreShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                      <feOffset dx="0" dy="1" result="offsetblur" />
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.2" />
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-[#1b3a57] tracking-tighter">{overallScore}</span>
                  <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: scoreColor }}>{scoreLabel}</span>
                </div>
              </div>

              <div className="space-y-3 flex-1 w-full">
                {riskBarData.map(r => (
                  <div key={r.name} className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-black uppercase text-[#5c6065] tracking-widest">
                      <span>{r.name}</span>
                      <span className="font-black" style={{ color: r.fill }}>{r.score}%</span>
                    </div>
                    <ProgressBar pct={r.score} color={r.fill} height="h-1.5" />
                  </div>
                ))}
              </div>
            </div>

            {/* AI Risk Narrative */}
            <div className="bg-white/70 border border-[#e6e4d9] backdrop-blur-sm rounded-2xl p-4 shadow-sm transition-all hover:bg-white/90">
              {loadingAi ? (
                <div className="flex items-center gap-2 text-[#1f8c5c] text-xs animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating risk intelligence...
                </div>
              ) : aiNarrative ? (
                <div className="flex gap-3 items-start">
                  <Zap className="w-4 h-4 mt-1 shrink-0" style={{ color: scoreColor }} />
                  <p className="text-xs font-medium text-[#5c6065] leading-relaxed italic">"{aiNarrative}"</p>
                </div>
              ) : (
                <p className="text-xs text-[#8a9bb0]">Risk narrative unavailable</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Asset Allocation Concentration ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[24px] p-6 shadow-sm">
          <SectionHeader icon={Shield} title="Concentration Analysis" subtitle="Asset class distribution" badge={`${NET_WORTH_METRICS.concentrationScore}% Property Heavy`} />
          <div className="flex flex-col sm:flex-row items-center gap-8 mt-6">
            <div className="w-44 h-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie data={assetAllocationData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} stroke="none">
                    {assetAllocationData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1b3a57', border: 'none', borderRadius: 12, color: '#fff', fontSize: 10, padding: '8px 12px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(val: any) => [`${val}%`, 'Allocation']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2.5 flex-1 w-full">
              {assetAllocationData.map(a => (
                <div key={a.name} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full" style={{ background: a.fill }} />
                    <span className="text-[10px] font-black text-[#5c6065] uppercase tracking-widest group-hover:text-[#1b3a57] transition-colors">{a.name}</span>
                  </div>
                  <span className="text-xs font-black text-[#1b3a57]">{a.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Risk Alert Cards ── */}
      <motion.div variants={itemVars}>
        <SectionHeader icon={AlertTriangle} title="Active Risk Alerts" subtitle="Click to view mitigation steps" badge={`${MOCK_RISK_ALERTS.length} Detected`} />
        <div className="space-y-3">
          {MOCK_RISK_ALERTS.map(alert => (
            <motion.div
              key={alert.id}
              whileHover={{ x: 2 }}
              onClick={() => setSelected(alert)}
              className="bg-white border border-slate-100 rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border shrink-0 ${severityColor[alert.severity]}`}>
                  {alert.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{alert.title}</h4>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${alert.severity === 'critical' ? 'text-red-500' : alert.severity === 'warning' ? 'text-amber-600' : 'text-blue-500'} shrink-0 ml-2`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">{alert.description}</p>
                  {alert.affectedAmount && (
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingDown className="w-3 h-3 text-red-400" />
                      <span className="text-[10px] font-black text-red-500">₹{fmtShort(alert.affectedAmount)} at risk</span>
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0 mt-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Rebalance CTA ── */}
      <motion.div variants={itemVars}>
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[28px] p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">AI Rebalance Recommendation</span>
            </div>
            <p className="text-lg font-black text-white">Shift 12% from Real Estate to Equity MFs</p>
            <p className="text-xs text-slate-400 mt-1">This would improve your diversification score from 58 to 74 and increase liquidity by 3.2 months.</p>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 shrink-0">
            Execute Rebalance <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {selected && <RiskDetailSheet alert={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default RiskSentinelPanel;
