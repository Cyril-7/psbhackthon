// ═══════════════════════════════════════════════════════════════════════════
// WEALTH PROTECTION INTELLIGENCE LAYER — DATA & TYPES
// Enterprise-grade cyber-financial protection engine
// ═══════════════════════════════════════════════════════════════════════════

// ─── 1) Multi-Signal Risk Analysis ──────────────────────────────────────────

export type RiskBand = 'low' | 'medium' | 'high' | 'critical';

export interface RiskSignal {
  id: string;
  label: string;
  icon: string;
  weight: number;        // 0–15 contribution to total score
  detected: boolean;
  confidence: number;    // 0–100
  detail: string;
  category: 'device' | 'location' | 'behavior' | 'identity' | 'network' | 'transaction';
}

export interface FraudRiskAssessment {
  fraudRiskScore: number;  // 0–100
  riskBand: RiskBand;
  summary: string;
  signals: RiskSignal[];
  timestamp: string;
}

export const RISK_SIGNAL_CATALOG: RiskSignal[] = [
  { id: 'rs01', label: 'Unusual Device Fingerprint',     icon: '🖥️', weight: 10, detected: false, confidence: 0, detail: '', category: 'device' },
  { id: 'rs02', label: 'First-Time Device',              icon: '📱', weight: 12, detected: true,  confidence: 92, detail: 'Samsung Galaxy S24 — first seen 2 hours ago', category: 'device' },
  { id: 'rs03', label: 'New IP / Location Mismatch',     icon: '🌐', weight: 8,  detected: true,  confidence: 78, detail: 'IP from Hyderabad, user baseline is Bangalore', category: 'location' },
  { id: 'rs04', label: 'Impossible Travel Detection',    icon: '✈️', weight: 14, detected: false, confidence: 0, detail: '', category: 'location' },
  { id: 'rs05', label: 'First-Time Beneficiary',         icon: '👤', weight: 11, detected: true,  confidence: 100, detail: 'Beneficiary "Ravi K." has never been used', category: 'transaction' },
  { id: 'rs06', label: 'Rushed Repeated Clicks',         icon: '⚡', weight: 6,  detected: false, confidence: 0, detail: '', category: 'behavior' },
  { id: 'rs07', label: 'Abnormal Time-of-Day',           icon: '🌙', weight: 7,  detected: true,  confidence: 85, detail: 'Transaction at 11:42 PM — user is usually active 9 AM – 6 PM', category: 'behavior' },
  { id: 'rs08', label: 'High-Value Deviation',           icon: '📊', weight: 13, detected: true,  confidence: 94, detail: 'Amount ₹5L is 8.3x larger than historical median ₹60K', category: 'transaction' },
  { id: 'rs09', label: 'Sudden Full Liquidation',        icon: '💰', weight: 15, detected: false, confidence: 0, detail: '', category: 'transaction' },
  { id: 'rs10', label: 'OTP Retry / Resend Spike',       icon: '🔑', weight: 9,  detected: false, confidence: 0, detail: '', category: 'identity' },
  { id: 'rs11', label: 'SIM Swap Suspicion',             icon: '📡', weight: 14, detected: false, confidence: 0, detail: '', category: 'identity' },
  { id: 'rs12', label: 'Browser Fingerprint Mismatch',   icon: '🔍', weight: 8,  detected: false, confidence: 0, detail: '', category: 'device' },
  { id: 'rs13', label: 'Session Hijack Indicators',      icon: '🛡️', weight: 13, detected: false, confidence: 0, detail: '', category: 'network' },
  { id: 'rs14', label: 'Biometric Mismatch',             icon: '🧬', weight: 12, detected: false, confidence: 0, detail: '', category: 'identity' },
  { id: 'rs15', label: 'Unusual Network / VPN Usage',    icon: '🔒', weight: 7,  detected: true,  confidence: 62, detail: 'Connected via NordVPN — not in user\'s usual network patterns', category: 'network' },
];

export const CURRENT_RISK_ASSESSMENT: FraudRiskAssessment = {
  fraudRiskScore: 72,
  riskBand: 'high',
  summary: 'Risk score 72: new device + high-value gold liquidation + first-time beneficiary + midnight execution + VPN usage.',
  signals: RISK_SIGNAL_CATALOG,
  timestamp: new Date().toISOString(),
};

// ─── 2) Behavioral Baseline Engine ──────────────────────────────────────────

export interface BehavioralBaseline {
  usualDevice: string;
  commonTransferSize: number;
  preferredHours: string;
  normalBeneficiaries: string[];
  typicalAssetClasses: string[];
  avgMonthlyLiquidation: number;
  usualApprovalSpeed: string;
  normalGeoZones: string[];
  pastOtpBehavior: string;
  repaymentHabits: string;
}

export interface BehavioralAnomaly {
  id: string;
  icon: string;
  label: string;
  severity: RiskBand;
  detail: string;
  deviation: string;   // e.g. "8.3x above historical median"
  baselineValue: string;
  currentValue: string;
}

export const USER_BEHAVIORAL_BASELINE: BehavioralBaseline = {
  usualDevice: 'iPhone 15 Pro — 98% of sessions',
  commonTransferSize: 60000,
  preferredHours: '9:00 AM – 6:00 PM IST',
  normalBeneficiaries: ['Self Savings', 'HDFC CC Payment', 'Swiggy', 'Groww SIP', 'Amazon'],
  typicalAssetClasses: ['Mutual Funds', 'Fixed Deposits', 'Digital Gold'],
  avgMonthlyLiquidation: 25000,
  usualApprovalSpeed: 'Within 30 seconds',
  normalGeoZones: ['Bangalore, KA', 'Mysuru, KA'],
  pastOtpBehavior: '1 attempt per transaction, no retries in 6 months',
  repaymentHabits: 'CC bill: auto-debit on 5th — 24 consecutive months',
};

export const DETECTED_ANOMALIES: BehavioralAnomaly[] = [
  {
    id: 'ba01', icon: '📊', label: 'Transfer Amount Deviation',
    severity: 'critical',
    detail: 'This transfer of ₹5,00,000 is 8.3× larger than your historical median of ₹60,000.',
    deviation: '8.3× above median',
    baselineValue: '₹60,000',
    currentValue: '₹5,00,000',
  },
  {
    id: 'ba02', icon: '📱', label: 'New Device Detected',
    severity: 'high',
    detail: 'Samsung Galaxy S24 was registered only 2 hours ago. 98% of your sessions use iPhone 15 Pro.',
    deviation: 'First-time device',
    baselineValue: 'iPhone 15 Pro',
    currentValue: 'Samsung Galaxy S24',
  },
  {
    id: 'ba03', icon: '🌙', label: 'Off-Hours Activity',
    severity: 'medium',
    detail: 'Transaction initiated at 11:42 PM. Your normal activity window is 9 AM – 6 PM.',
    deviation: 'Outside normal hours',
    baselineValue: '9:00 AM – 6:00 PM',
    currentValue: '11:42 PM',
  },
  {
    id: 'ba04', icon: '👤', label: 'Unknown Beneficiary',
    severity: 'high',
    detail: 'Beneficiary "Ravi K." has never been used for any past transaction across all accounts.',
    deviation: 'First-time beneficiary',
    baselineValue: '5 known beneficiaries',
    currentValue: 'New: Ravi K.',
  },
  {
    id: 'ba05', icon: '🌐', label: 'VPN Network Anomaly',
    severity: 'medium',
    detail: 'Session is routed through NordVPN. You have never used a VPN for financial transactions.',
    deviation: 'First VPN usage',
    baselineValue: 'Jio/Airtel broadband',
    currentValue: 'NordVPN (Netherlands)',
  },
];

// ─── 3) Asset-Specific Protection Rules ─────────────────────────────────────

export interface AssetProtectionRule {
  assetClass: string;
  icon: string;
  defaultRiskLevel: RiskBand;
  minimumSafeThreshold: number;
  extraApproval: string[];
  coolingPeriod: string;
  beneficiaryPolicy: string;
  color: string;
}

export const ASSET_PROTECTION_RULES: AssetProtectionRule[] = [
  {
    assetClass: 'Gold Liquidation', icon: '🪙', defaultRiskLevel: 'medium',
    minimumSafeThreshold: 50000,
    extraApproval: ['Biometric reconfirmation'],
    coolingPeriod: '2 hours',
    beneficiaryPolicy: 'Must be pre-verified beneficiary',
    color: '#f59e0b',
  },
  {
    assetClass: 'Property Sale', icon: '🏠', defaultRiskLevel: 'critical',
    minimumSafeThreshold: 2500000,
    extraApproval: ['Biometric + Voice verification', 'Relationship Manager review', 'Co-owner approval'],
    coolingPeriod: '24 hours',
    beneficiaryPolicy: 'Physical verification + 48hr lock review',
    color: '#ef4444',
  },
  {
    assetClass: 'SME Reserve Withdrawal', icon: '🏢', defaultRiskLevel: 'high',
    minimumSafeThreshold: 100000,
    extraApproval: ['Business approval flow', 'Director sign-off'],
    coolingPeriod: '12 hours',
    beneficiaryPolicy: 'Business beneficiary registry only',
    color: '#6366f1',
  },
  {
    assetClass: 'Mutual Fund Redemption', icon: '📊', defaultRiskLevel: 'medium',
    minimumSafeThreshold: 100000,
    extraApproval: ['Biometric reconfirmation'],
    coolingPeriod: '30 minutes',
    beneficiaryPolicy: 'Self-account transfers only',
    color: '#10b981',
  },
  {
    assetClass: 'Retirement Corpus Movement', icon: '🏖️', defaultRiskLevel: 'high',
    minimumSafeThreshold: 200000,
    extraApproval: ['Biometric + OTP', 'Financial advisor confirmation'],
    coolingPeriod: '12 hours',
    beneficiaryPolicy: 'Only pre-registered pension accounts',
    color: '#7c3aed',
  },
  {
    assetClass: 'Education Goal Funds', icon: '🎓', defaultRiskLevel: 'medium',
    minimumSafeThreshold: 50000,
    extraApproval: ['Extra OTP confirmation', 'Goal impact review'],
    coolingPeriod: '1 hour',
    beneficiaryPolicy: 'Only verified educational institutions',
    color: '#0891b2',
  },
  {
    assetClass: 'Family Shared Assets', icon: '👨‍👩‍👧', defaultRiskLevel: 'high',
    minimumSafeThreshold: 100000,
    extraApproval: ['All co-owner approvals required', 'Family consent protocol'],
    coolingPeriod: '24 hours',
    beneficiaryPolicy: 'Unanimous family member consent',
    color: '#ec4899',
  },
];

// ─── 4) Adaptive Decision Engine ────────────────────────────────────────────

export type DecisionOutcome =
  | 'allow_instant'
  | 'allow_warning'
  | 'delayed_cooling'
  | 'biometric_required'
  | 'voice_callback'
  | 'co_owner_approval'
  | 'rm_review'
  | 'temp_freeze'
  | 'fraud_escalation';

export interface DecisionAction {
  outcome: DecisionOutcome;
  icon: string;
  label: string;
  description: string;
  color: string;
}

export const DECISION_OUTCOMES: Record<DecisionOutcome, DecisionAction> = {
  allow_instant:     { outcome: 'allow_instant',     icon: '✅', label: 'Allow Instantly',              description: 'Transaction approved without friction.',                        color: '#10b981' },
  allow_warning:     { outcome: 'allow_warning',     icon: '⚠️', label: 'Allow with Warning',            description: 'Approved, but warning banner shown.',                           color: '#f59e0b' },
  delayed_cooling:   { outcome: 'delayed_cooling',   icon: '⏳', label: 'Cooling-Off Period',            description: 'Execution delayed. Cancel anytime before expiry.',              color: '#3b82f6' },
  biometric_required:{ outcome: 'biometric_required',icon: '🔒', label: 'Biometric Reconfirmation',     description: 'FaceID / Fingerprint re-scan required.',                        color: '#8b5cf6' },
  voice_callback:    { outcome: 'voice_callback',    icon: '📞', label: 'Voice Confirmation',           description: 'Callback to registered mobile for verbal confirmation.',        color: '#6366f1' },
  co_owner_approval: { outcome: 'co_owner_approval', icon: '👥', label: 'Co-Owner Approval',            description: 'All co-owners must approve before execution.',                  color: '#ec4899' },
  rm_review:         { outcome: 'rm_review',         icon: '🧾', label: 'RM Review',                    description: 'Relationship manager manual review required.',                  color: '#0891b2' },
  temp_freeze:       { outcome: 'temp_freeze',       icon: '❄️', label: 'Temporary Freeze',              description: 'Account temporarily frozen. Contact support.',                  color: '#64748b' },
  fraud_escalation:  { outcome: 'fraud_escalation',  icon: '🚨', label: 'Fraud Escalation',             description: 'Fraud ticket created. Incident forwarded to cyber cell.',        color: '#ef4444' },
};

export interface AdaptiveDecision {
  id: string;
  transactionType: string;
  amount: number;
  outcome: DecisionOutcome;
  reasoning: string;
  timestamp: string;
  expiresAt?: string;
  riskScore: number;
}

export const RECENT_DECISIONS: AdaptiveDecision[] = [
  {
    id: 'ad01', transactionType: 'Property Advance Payment', amount: 500000,
    outcome: 'delayed_cooling',
    reasoning: 'Property-class payment above ₹2.5L from new city requires 12-hour cooling period and voice confirmation.',
    timestamp: '2026-03-31T23:42:00', expiresAt: '2026-04-01T11:42:00', riskScore: 72,
  },
  {
    id: 'ad02', transactionType: 'Digital Gold Liquidation', amount: 280000,
    outcome: 'biometric_required',
    reasoning: 'Gold liquidation is 8.3× above your historical average. Biometric reconfirmation enforced.',
    timestamp: '2026-03-29T15:30:00', riskScore: 58,
  },
  {
    id: 'ad03', transactionType: 'UPI Payment — Swiggy', amount: 840,
    outcome: 'allow_instant',
    reasoning: 'Regular merchant, trusted device, normal amount, within activity hours.',
    timestamp: '2026-03-31T11:45:00', riskScore: 4,
  },
  {
    id: 'ad04', transactionType: 'SIM Swap Detection', amount: 0,
    outcome: 'fraud_escalation',
    reasoning: 'OTP delivery rerouted to unknown number. Possible SIM swap attack — immediate account freeze.',
    timestamp: '2026-03-25T08:15:00', riskScore: 96,
  },
  {
    id: 'ad05', transactionType: 'Monthly SIP — Groww', amount: 15000,
    outcome: 'allow_instant',
    reasoning: 'Auto-approved recurring trusted transaction, 24-month history.',
    timestamp: '2026-03-27T12:00:00', riskScore: 2,
  },
  {
    id: 'ad06', transactionType: 'Login from Hyderabad', amount: 0,
    outcome: 'allow_warning',
    reasoning: 'New city login at 11:12 PM. OTP verified but session monitored for 24hrs.',
    timestamp: '2026-03-30T23:12:00', riskScore: 42,
  },
];

// ─── 5) Cooling-Off & Reversal Safety ───────────────────────────────────────

export interface CoolingOffEntry {
  id: string;
  transactionType: string;
  amount: number;
  initiatedAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'cancelled' | 'executed';
  riskBand: RiskBand;
  canCancel: boolean;
  reason: string;
}

export const COOLING_OFF_ENTRIES: CoolingOffEntry[] = [
  {
    id: 'co01', transactionType: 'Property Advance — Ravi K.',
    amount: 500000, initiatedAt: '2026-03-31T23:42:00', expiresAt: '2026-04-01T11:42:00',
    status: 'active', riskBand: 'critical', canCancel: true,
    reason: 'High-value transfer to first-time beneficiary from new device. 12-hour mandatory hold.',
  },
  {
    id: 'co02', transactionType: 'Gold Liquidation — ₹2.8L',
    amount: 280000, initiatedAt: '2026-03-29T15:30:00', expiresAt: '2026-03-29T17:30:00',
    status: 'executed', riskBand: 'medium', canCancel: false,
    reason: 'Unusual gold sell behavior. 2-hour delay applied. User confirmed.',
  },
  {
    id: 'co03', transactionType: 'FD Pre-closure — ₹5L ICICI',
    amount: 500000, initiatedAt: '2026-03-28T10:00:00', expiresAt: '2026-03-28T10:30:00',
    status: 'cancelled', riskBand: 'medium', canCancel: false,
    reason: 'FD pre-closure request. User cancelled during cooling period.',
  },
];

// ─── 6) Trusted Zones & Safe Devices ────────────────────────────────────────

export interface TrustedDevice {
  id: string;
  name: string;
  type: 'phone' | 'laptop' | 'tablet' | 'desktop';
  icon: string;
  registeredDate: string;
  lastUsed: string;
  trustScore: number;    // 0–100
  biometricEnabled: boolean;
  location: string;
  sessions: number;
}

export interface TrustedZone {
  id: string;
  name: string;
  type: 'home_wifi' | 'office_ip' | 'geo_zone';
  icon: string;
  riskReduction: number;  // percentage
  status: 'active' | 'inactive';
  detail: string;
}

export const TRUSTED_DEVICES: TrustedDevice[] = [
  {
    id: 'td01', name: 'iPhone 15 Pro', type: 'phone', icon: '📱',
    registeredDate: '2025-04-10', lastUsed: '2 mins ago',
    trustScore: 98, biometricEnabled: true, location: 'Bangalore, KA',
    sessions: 1247,
  },
  {
    id: 'td02', name: 'MacBook Pro M3', type: 'laptop', icon: '💻',
    registeredDate: '2025-06-15', lastUsed: '3 hrs ago',
    trustScore: 95, biometricEnabled: true, location: 'Bangalore, KA',
    sessions: 342,
  },
  {
    id: 'td03', name: 'iPad Air', type: 'tablet', icon: '📲',
    registeredDate: '2025-09-01', lastUsed: '5 days ago',
    trustScore: 78, biometricEnabled: false, location: 'Mysuru, KA',
    sessions: 45,
  },
];

export const TRUSTED_ZONES: TrustedZone[] = [
  { id: 'tz01', name: 'Home WiFi – Jio Fiber', type: 'home_wifi', icon: '🏠', riskReduction: 25, status: 'active', detail: 'Static IP 103.x.x.42 — verified 18 months' },
  { id: 'tz02', name: 'Office – Airtel Business', type: 'office_ip', icon: '🏢', riskReduction: 20, status: 'active', detail: 'Corporate IP range 223.x.x.0/24' },
  { id: 'tz03', name: 'Bangalore Geo-Fence', type: 'geo_zone', icon: '📍', riskReduction: 15, status: 'active', detail: 'Bangalore metro area — 50km radius from HSR Layout' },
];

// ─── 7) Explainable AI Insights ─────────────────────────────────────────────

export interface ExplainableInsight {
  id: string;
  transactionId: string;
  icon: string;
  insight: string;
  category: 'amount' | 'device' | 'beneficiary' | 'timing' | 'pattern' | 'network';
  severity: RiskBand;
}

export const EXPLAINABLE_INSIGHTS: ExplainableInsight[] = [
  { id: 'ei01', transactionId: 'ad01', icon: '📊', insight: 'This transfer is 8.3× larger than your historical average of ₹60,000.', category: 'amount', severity: 'critical' },
  { id: 'ei02', transactionId: 'ad01', icon: '📱', insight: 'The request originates from a first-time Samsung Galaxy S24, registered only 2 hours ago.', category: 'device', severity: 'high' },
  { id: 'ei03', transactionId: 'ad01', icon: '👤', insight: 'Beneficiary "Ravi K." has never been used for any transaction across all linked accounts.', category: 'beneficiary', severity: 'high' },
  { id: 'ei04', transactionId: 'ad01', icon: '🌙', insight: 'Execution time (11:42 PM) differs significantly from your normal activity pattern (9 AM – 6 PM).', category: 'timing', severity: 'medium' },
  { id: 'ei05', transactionId: 'ad01', icon: '🌐', insight: 'Session is routed through NordVPN — you have never used VPN for financial transactions.', category: 'network', severity: 'medium' },
  { id: 'ei06', transactionId: 'ad02', icon: '🪙', insight: 'Gold liquidation amount is 560% above your monthly norm. First large gold sale ever.', category: 'pattern', severity: 'high' },
  { id: 'ei07', transactionId: 'ad04', icon: '📡', insight: 'OTP delivery was rerouted to an unrecognized mobile number — classic SIM swap indicator.', category: 'device', severity: 'critical' },
  { id: 'ei08', transactionId: 'ad06', icon: '🗺️', insight: 'Login from Hyderabad while your geo-baseline covers only Bangalore and Mysuru.', category: 'pattern', severity: 'medium' },
];

// ─── 8) Activity History ────────────────────────────────────────────────────

export interface SuspiciousActivityEntry {
  id: string;
  date: string;
  type: string;
  icon: string;
  description: string;
  riskScore: number;
  outcome: DecisionOutcome;
  resolved: boolean;
}

export const SUSPICIOUS_ACTIVITY_HISTORY: SuspiciousActivityEntry[] = [
  { id: 'sa01', date: '2026-03-31', type: 'High-Value Transfer',   icon: '🚨', description: 'Property advance ₹5L to new beneficiary — cooling-off active',           riskScore: 72, outcome: 'delayed_cooling',    resolved: false },
  { id: 'sa02', date: '2026-03-30', type: 'Login Anomaly',         icon: '🔐', description: 'Login from Hyderabad at 11 PM — session monitored',                        riskScore: 42, outcome: 'allow_warning',      resolved: true },
  { id: 'sa03', date: '2026-03-29', type: 'Gold Liquidation',      icon: '🪙', description: 'Digital gold sell ₹2.8L — 560% above norm, delayed 2hr',                    riskScore: 58, outcome: 'biometric_required', resolved: true },
  { id: 'sa04', date: '2026-03-25', type: 'SIM Swap Attempt',      icon: '📡', description: 'OTP rerouted to unknown number — account frozen, fraud ticket raised',       riskScore: 96, outcome: 'fraud_escalation',   resolved: true },
  { id: 'sa05', date: '2026-03-20', type: 'Rapid OTP Resends',     icon: '🔑', description: '5 OTP resend requests in 90 seconds — suspicious pattern flagged',            riskScore: 34, outcome: 'allow_warning',      resolved: true },
  { id: 'sa06', date: '2026-03-15', type: 'Credit Card Over-limit',icon: '💳', description: 'Attempted ₹1.2L authorization on ₹45K limit card — auto-blocked',            riskScore: 28, outcome: 'temp_freeze',        resolved: true },
];

// ─── Shield Metrics Summary ─────────────────────────────────────────────────

export const SHIELD_METRICS = {
  securityScore: 82,
  threatsBlocked: 7,
  threatsBlockedThisMonth: 3,
  activeCoolingOffs: 1,
  trustedDevices: 3,
  trustedZones: 3,
  fraudTicketsTotal: 1,
  fraudTicketsResolved: 1,
  lastSecurityAudit: '5 days ago',
  averageResponseTime: '< 200ms',
  uptime: '99.97%',
  totalTransactionsMonitored: 1247,
  falsePositiveRate: '0.8%',
};
