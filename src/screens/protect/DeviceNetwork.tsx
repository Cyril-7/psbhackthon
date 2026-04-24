import React from 'react';
import { motion } from 'framer-motion';
import {
  TRUSTED_DEVICES, TRUSTED_ZONES, COOLING_OFF_ENTRIES,
  ASSET_PROTECTION_RULES, USER_BEHAVIORAL_BASELINE,
} from '../../data/wealthProtectionData';
import { containerVars, itemVars } from '../twin/TwinUtils';
import {
  Smartphone, MapPin, Shield, Lock, Fingerprint,
  Wifi, CheckCircle2, XCircle, Clock,
} from 'lucide-react';

const fmtShort = (v: number) =>
  v >= 10000000 ? `${(v / 10000000).toFixed(1)}Cr`
  : v >= 100000 ? `${(v / 100000).toFixed(0)}L`
  : v >= 1000 ? `${(v / 1000).toFixed(0)}K`
  : `₹${v}`;

const deviceIcon: Record<string, React.ReactNode> = {
  phone: <Smartphone className="w-6 h-6" />,
  laptop: <Wifi className="w-6 h-6" />,
  tablet: <Smartphone className="w-6 h-6" />,
  desktop: <Wifi className="w-6 h-6" />,
};

const trustColor = (score: number) =>
  score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';

const coolingStatus: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-600' },
  expired: { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-400' },
  cancelled: { bg: 'bg-red-50 border-red-200', text: 'text-red-500' },
  executed: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-600' },
};

const DeviceNetwork: React.FC = () => {
  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">
      {/* ── Trusted Devices ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Trusted Devices</h3>
            </div>
            <button className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase hover:bg-slate-900 hover:text-white transition-all tracking-widest shadow-sm">
              Manage
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TRUSTED_DEVICES.map(dev => (
              <motion.div key={dev.id} whileHover={{ y: -4 }}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                    {deviceIcon[dev.type]}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">{dev.name}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{dev.type} • {dev.location}</p>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  <div>
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                      <span>Trust Score</span>
                      <span style={{ color: trustColor(dev.trustScore) }}>{dev.trustScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${dev.trustScore}%` }}
                        transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: trustColor(dev.trustScore) }} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Sessions</p>
                    <p className="text-sm font-black text-slate-700">{dev.sessions.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Last Used</p>
                    <p className="text-[11px] font-black text-slate-700">{dev.lastUsed}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                  {dev.biometricEnabled ? (
                    <div className="flex items-center gap-1.5 text-emerald-500">
                      <Fingerprint className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Biometric Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-amber-500">
                      <XCircle className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-black uppercase tracking-widest">No Biometric</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Trusted Zones ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Trusted Zones</h3>
            </div>
          </div>
          <div className="space-y-3">
            {TRUSTED_ZONES.map(zone => (
              <div key={zone.id} className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl shrink-0">{zone.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-slate-800 truncate">{zone.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{zone.detail}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-black text-emerald-500">-{zone.riskReduction}%</p>
                  <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Risk Reduction</p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border shrink-0 ${zone.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                  {zone.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Behavioral Baseline ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-violet-500" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Behavioral Baseline</h3>
            </div>
            <span className="text-[10px] font-black text-violet-500 bg-violet-50 border border-violet-100 px-3 py-1 rounded-full">AI LEARNED</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'Primary Device', value: USER_BEHAVIORAL_BASELINE.usualDevice, icon: '📱' },
              { label: 'Typical Transfer', value: `₹${fmtShort(USER_BEHAVIORAL_BASELINE.commonTransferSize)}`, icon: '💸' },
              { label: 'Active Hours', value: USER_BEHAVIORAL_BASELINE.preferredHours, icon: '🕐' },
              { label: 'Approval Speed', value: USER_BEHAVIORAL_BASELINE.usualApprovalSpeed, icon: '⚡' },
              { label: 'Geo Zones', value: USER_BEHAVIORAL_BASELINE.normalGeoZones.join(', '), icon: '📍' },
              { label: 'OTP Behavior', value: USER_BEHAVIORAL_BASELINE.pastOtpBehavior, icon: '🔑' },
              { label: 'Monthly Liquidation', value: `₹${fmtShort(USER_BEHAVIORAL_BASELINE.avgMonthlyLiquidation)}`, icon: '📊' },
              { label: 'Repayment', value: USER_BEHAVIORAL_BASELINE.repaymentHabits, icon: '💳' },
            ].map(item => (
              <div key={item.label} className="bg-white border border-slate-100 rounded-xl p-4 flex items-start gap-3 hover:shadow-md transition-all">
                <span className="text-lg">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">{item.label}</p>
                  <p className="text-[11px] font-bold text-slate-700 leading-relaxed">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Cooling-Off Queue ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Cooling-Off Queue</h3>
            </div>
            <span className="text-[10px] font-black text-blue-500 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              {COOLING_OFF_ENTRIES.filter(e => e.status === 'active').length} ACTIVE
            </span>
          </div>
          <div className="space-y-3">
            {COOLING_OFF_ENTRIES.map(entry => {
              const st = coolingStatus[entry.status] || coolingStatus.expired;
              return (
                <div key={entry.id} className={`rounded-2xl p-5 border transition-all hover:shadow-md ${st.bg}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-black text-slate-800">{entry.transactionType}</h4>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${st.text}`}>{entry.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-3">{entry.reason}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-slate-800">₹{fmtShort(entry.amount)}</span>
                      <span className="text-[9px] text-slate-400 font-bold">
                        {new Date(entry.initiatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} →{' '}
                        {new Date(entry.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {entry.canCancel && (
                      <button className="bg-red-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Asset Protection Rules ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Asset Protection Rules</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ASSET_PROTECTION_RULES.map(rule => (
              <div key={rule.assetClass} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-lg transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: rule.color + '15', border: `1px solid ${rule.color}30` }}>
                    {rule.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">{rule.assetClass}</h4>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                      rule.defaultRiskLevel === 'critical' ? 'text-red-500' :
                      rule.defaultRiskLevel === 'high' ? 'text-orange-500' : 'text-amber-500'
                    }`}>{rule.defaultRiskLevel} risk</span>
                  </div>
                </div>
                <div className="space-y-2 text-[10px]">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                    <span className="text-slate-400 font-black uppercase tracking-widest">Min Threshold</span>
                    <span className="font-black text-slate-700">₹{fmtShort(rule.minimumSafeThreshold)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                    <span className="text-slate-400 font-black uppercase tracking-widest">Cooling Period</span>
                    <span className="font-black text-slate-700">{rule.coolingPeriod}</span>
                  </div>
                  <div className="pt-1.5">
                    <p className="text-slate-400 font-black uppercase tracking-widest mb-1.5">Required Approvals</p>
                    {rule.extraApproval.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 py-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="text-slate-600 font-medium">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-2">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <p className="text-[9px] text-slate-400 font-bold">{rule.beneficiaryPolicy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(DeviceNetwork);
