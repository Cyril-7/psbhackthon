// ═══════════════════════════════════════════════════════════════
// AI UNIFIED WEALTH TWIN — ENTERPRISE MOCK DATA
// All 8 Layers: Aggregation → Physical Assets → Net Worth →
//               AI Intelligence → Goals → Risk → Fraud → UI
// ═══════════════════════════════════════════════════════════════

// ─── LAYER 1: Account Aggregator Data ────────────────────────────────────────
export interface LinkedAccount {
  id: string;
  institution: string;
  shortName: string;
  accountType: string;
  accountNumber: string;
  balance: number;
  category: 'liquid' | 'investment' | 'liability' | 'insurance' | 'retirement' | 'business';
  lastSync: string;
  icon: string;
  color: string;
  growth?: number;
  interestRate?: number;
}

export const MOCK_LINKED_ACCOUNTS: LinkedAccount[] = [
  { id: 'a1', institution: 'State Bank of India', shortName: 'SBI', accountType: 'Salary Account', accountNumber: '••••9823', balance: 185000, category: 'liquid', lastSync: '2 mins ago', icon: '🏦', color: '#1e40af', growth: 2.5 },
  { id: 'a2', institution: 'HDFC Bank', shortName: 'HDFC', accountType: 'Savings Account', accountNumber: '••••4412', balance: 124000, category: 'liquid', lastSync: '5 mins ago', icon: '🏛️', color: '#7c3aed', growth: 3.0 },
  { id: 'a3', institution: 'ICICI Bank', shortName: 'ICICI', accountType: 'Fixed Deposit', accountNumber: '••••2201', balance: 500000, category: 'liquid', lastSync: '1 hr ago', icon: '🔒', color: '#ea580c', interestRate: 7.25, growth: 7.25 },
  { id: 'a4', institution: 'Axis Bank', shortName: 'Axis', accountType: 'Credit Card', accountNumber: '••••8812', balance: -45000, category: 'liability', lastSync: '10 mins ago', icon: '💳', color: '#dc2626', growth: -8.0 },
  { id: 'a5', institution: 'Zerodha – Kite', shortName: 'Zerodha', accountType: 'Demat / Stocks', accountNumber: '••••7789', balance: 650000, category: 'investment', lastSync: '12 mins ago', icon: '📊', color: '#c5a059', growth: 14.2 },
  { id: 'a6', institution: 'Groww', shortName: 'Groww', accountType: 'Mutual Funds (SIP)', accountNumber: '••••3310', balance: 1250000, category: 'investment', lastSync: '12 mins ago', icon: '🌱', color: '#10b981', growth: 18.6 },
  { id: 'a7', institution: 'Kotak Securities', shortName: 'Kotak', accountType: 'NPS Tier I', accountNumber: '••••6612', balance: 380000, category: 'retirement', lastSync: '1 day ago', icon: '🏖️', color: '#0891b2', growth: 10.5 },
  { id: 'a8', institution: 'EPFO', shortName: 'EPFO', accountType: 'EPF Corpus', accountNumber: 'UAN••3421', balance: 520000, category: 'retirement', lastSync: '1 day ago', icon: '🛡️', color: '#7c3aed', growth: 8.15 },
  { id: 'a9', institution: 'India Post', shortName: 'PPF', accountType: 'PPF Account', accountNumber: '••••1190', balance: 215000, category: 'retirement', lastSync: '6 hrs ago', icon: '📮', color: '#dc2626', growth: 7.1 },
  { id: 'a10', institution: 'DigiGold Vault', shortName: 'DigiGold', accountType: 'Digital Gold', accountNumber: '••••5501', balance: 350000, category: 'investment', lastSync: '1 hr ago', icon: '🪙', color: '#f59e0b', growth: 12.4 },
  { id: 'a11', institution: 'Paytm Wallet', shortName: 'Paytm', accountType: 'Digital Wallet', accountNumber: '••••7781', balance: 8200, category: 'liquid', lastSync: '30 mins ago', icon: '📱', color: '#3b82f6', growth: 0 },
  { id: 'a12', institution: 'ICICI Pru Life', shortName: 'ICICI Pru', accountType: 'Term Insurance', accountNumber: 'POL••4412', balance: 25000000, category: 'insurance', lastSync: '3 days ago', icon: '💼', color: '#059669', growth: 0 },
  { id: 'a13', institution: 'SBI SME Current', shortName: 'SBI SME', accountType: 'SME Current Account', accountNumber: '••••3344', balance: 320000, category: 'business', lastSync: '4 mins ago', icon: '🏢', color: '#1e40af', growth: 6.8 },
  { id: 'a14', institution: 'HDFC Home Loan', shortName: 'Home Loan', accountType: 'Housing Loan', accountNumber: '••••9901', balance: -3200000, category: 'liability', lastSync: '1 day ago', icon: '🏠', color: '#dc2626', interestRate: 8.75 },
];

export const UNIFIED_FINANCIAL_IDENTITY = {
  totalLiquid: 185000 + 124000 + 500000 + 8200,
  totalInvestments: 650000 + 1250000 + 350000,
  totalRetirement: 380000 + 520000 + 215000,
  totalInsurance: 25000000,
  totalLiabilities: 45000 + 3200000,
  totalBusiness: 320000,
  lastFullSync: new Date().toISOString(),
};

// ─── LAYER 2: Physical Asset Vault ───────────────────────────────────────────
export type AssetLiquidityScore = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
export type AssetOwnership = 'Sole Owner' | 'Joint' | 'Family Trust' | 'Business';

export interface PhysicalAsset {
  id: string;
  name: string;
  category: 'property' | 'gold' | 'vehicle' | 'business' | 'collectible' | 'land';
  icon: string;
  currentValue: number;
  purchaseValue: number;
  appreciationRate: number;  // %
  liquidityScore: AssetLiquidityScore;
  ownershipType: AssetOwnership;
  linkedLoan?: number;
  resaleConfidence: number; // 0-100
  riskDependency: 'Low' | 'Medium' | 'High';
  location?: string;
  notes?: string;
}

export const MOCK_PHYSICAL_ASSETS: PhysicalAsset[] = [
  {
    id: 'p1', name: 'Residential Apartment – HSR Layout', category: 'property', icon: '🏠',
    currentValue: 8500000, purchaseValue: 5500000, appreciationRate: 7.2,
    liquidityScore: 'Very Low', ownershipType: 'Joint', linkedLoan: 3200000,
    resaleConfidence: 72, riskDependency: 'High', location: 'Bangalore',
    notes: 'Prime HSR Layout 3BHK, Rented for ₹32K/month'
  },
  {
    id: 'p2', name: 'Agricultural Land – Mysuru', category: 'land', icon: '🌾',
    currentValue: 2400000, purchaseValue: 1200000, appreciationRate: 9.5,
    liquidityScore: 'Very Low', ownershipType: 'Family Trust', linkedLoan: 0,
    resaleConfidence: 45, riskDependency: 'Low', location: 'Mysuru District',
  },
  {
    id: 'p3', name: 'Physical Gold – 80g', category: 'gold', icon: '💛',
    currentValue: 560000, purchaseValue: 320000, appreciationRate: 5.8,
    liquidityScore: 'High', ownershipType: 'Sole Owner', linkedLoan: 0,
    resaleConfidence: 95, riskDependency: 'Low',
    notes: 'Stored in HDFC SafeDeposit'
  },
  {
    id: 'p4', name: 'Honda City – 2023', category: 'vehicle', icon: '🚗',
    currentValue: 950000, purchaseValue: 1200000, appreciationRate: -8.5,
    liquidityScore: 'Medium', ownershipType: 'Sole Owner', linkedLoan: 0,
    resaleConfidence: 78, riskDependency: 'Low',
    notes: 'Fully owned, good resale market'
  },
  {
    id: 'p5', name: 'SME Machinery – CNC Unit', category: 'business', icon: '⚙️',
    currentValue: 750000, purchaseValue: 920000, appreciationRate: -6.0,
    liquidityScore: 'Low', ownershipType: 'Business', linkedLoan: 0,
    resaleConfidence: 40, riskDependency: 'Medium',
    notes: '3 CNC units at manufacturing unit'
  },
  {
    id: 'p6', name: 'Vintage Watch Collection', category: 'collectible', icon: '⌚',
    currentValue: 420000, purchaseValue: 280000, appreciationRate: 11.2,
    liquidityScore: 'Low', ownershipType: 'Sole Owner', linkedLoan: 0,
    resaleConfidence: 55, riskDependency: 'Low',
    notes: '6 collector-grade Swiss watches'
  },
];

// ─── LAYER 3: Net Worth Engine ────────────────────────────────────────────────
export interface NetWorthSnapshot {
  month: string;
  total: number;
  financial: number;
  physical: number;
  debt: number;
}

export const MOCK_NET_WORTH_TIMELINE: NetWorthSnapshot[] = [
  { month: "Oct '25", total: 10800000, financial: 2980000, physical: 11200000, debt: 3380000 },
  { month: "Nov '25", total: 11100000, financial: 3180000, physical: 11300000, debt: 3380000 },
  { month: "Dec '25", total: 11350000, financial: 3380000, physical: 11370000, debt: 3400000 },
  { month: "Jan '26", total: 11620000, financial: 3580000, physical: 11390000, debt: 3350000 },
  { month: "Feb '26", total: 11890000, financial: 3820000, physical: 11420000, debt: 3350000 },
  { month: "Mar '26", total: 12180000, financial: 4107200, physical: 12580000, debt: 3245000 },
];

export const NET_WORTH_METRICS = {
  total: 12180000,
  financialAssets: 4107200,
  physicalAssets: 12580000,
  liabilities: 3245000,
  monthlyGrowth: 2.4,
  annualCAGR: 14.8,
  debtBurdenRatio: 26.6,
  liquidityRatio: 22.4,
  concentrationScore: 71, // % in real estate
  emergencyRunwayMonths: 4.7,
  assetDiversificationScore: 58,
};

// ─── LAYER 4: AI Twin Intelligence ───────────────────────────────────────────
export interface BehaviorTrait {
  label: string;
  icon: string;
  score: number;
  description: string;
  trend: 'up' | 'down' | 'stable';
}

export const MOCK_PSYCHOMETRIC_TRAITS: BehaviorTrait[] = [
  { label: 'Financial Discipline', icon: '🎯', score: 82, description: 'Consistent SIP & budget adherence', trend: 'up' },
  { label: 'Risk Appetite', icon: '⚖️', score: 38, description: 'Conservative — prefers capital safety', trend: 'stable' },
  { label: 'Liquidity Anxiety', icon: '💧', score: 71, description: 'Moderate-high discomfort with illiquid assets', trend: 'up' },
  { label: 'Long-Term Patience', icon: '⏳', score: 85, description: 'Excellent goal commitment streak (24mo)', trend: 'up' },
  { label: 'Impulsive Spending Index', icon: '🛍️', score: 34, description: 'Low impulsivity, planned purchases dominant', trend: 'down' },
  { label: 'Investment Consistency', icon: '📈', score: 74, description: 'SIP activated — no missed months in 18mo', trend: 'up' },
];

export interface SimulationPath {
  year: string;
  Baseline: number;
  Optimized: number;
  Conservative: number;
}

export const MOCK_SIMULATION_PATHS: SimulationPath[] = [
  { year: '2026', Baseline: 13500000, Optimized: 14200000, Conservative: 12800000 },
  { year: '2027', Baseline: 15200000, Optimized: 16800000, Conservative: 13900000 },
  { year: '2028', Baseline: 17100000, Optimized: 20100000, Conservative: 15100000 },
  { year: '2029', Baseline: 19300000, Optimized: 24200000, Conservative: 16400000 },
  { year: '2030', Baseline: 21800000, Optimized: 29100000, Conservative: 17800000 },
  { year: '2031', Baseline: 24600000, Optimized: 35000000, Conservative: 19400000 },
  { year: '2032', Baseline: 27800000, Optimized: 42100000, Conservative: 21100000 },
  { year: '2035', Baseline: 40500000, Optimized: 72000000, Conservative: 28000000 },
];

export interface AIIntervention {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'cash' | 'gold' | 'emi' | 'sme' | 'emergency' | 'tax' | 'investment';
  icon: string;
  title: string;
  description: string;
  impact: string;
  impactPositive: boolean;
  actionLabel: string;
  savingsUnlocked?: number;
}

export const MOCK_AI_INTERVENTIONS: AIIntervention[] = [
  {
    id: 'i1', priority: 'critical', category: 'emergency',
    icon: '🚨', title: 'Emergency Fund Below Safe Threshold',
    description: 'Your liquid reserves cover only 4.7 months. Industry standard is 6 months. You need ₹1.05L more to reach safety.',
    impact: '₹1.05L gap', impactPositive: false, actionLabel: 'Build Buffer', savingsUnlocked: 105000
  },
  {
    id: 'i2', priority: 'high', category: 'cash',
    icon: '💰', title: 'Idle Cash Optimization Alert',
    description: '₹3.09L sitting across 3 savings accounts earns just 2.5%. Moving to liquid funds earns 7%+ with T+1 withdrawal.',
    impact: '+₹13,905/yr', impactPositive: true, actionLabel: 'Optimize Now', savingsUnlocked: 13905
  },
  {
    id: 'i3', priority: 'high', category: 'emi',
    icon: '🏠', title: 'EMI Prepayment Opportunity',
    description: 'Prepaying ₹50K on your home loan saves ₹2.1L in total interest and reduces tenure by 8 months.',
    impact: '₹2.1L saved', impactPositive: true, actionLabel: 'Prepay EMI'
  },
  {
    id: 'i4', priority: 'high', category: 'gold',
    icon: '🪙', title: 'Gold Overexposure Warning',
    description: 'Combined gold (physical + digital) is 7.4% of net worth vs recommended 5%. Rebalance ₹2.8L to equity.',
    impact: 'Rebalance 2.8L', impactPositive: false, actionLabel: 'Rebalance'
  },
  {
    id: 'i5', priority: 'medium', category: 'sme',
    icon: '🏢', title: 'SME Account Idle Capital',
    description: '₹3.2L sitting in SME current at 0% interest. Deploy in business FD or working capital fund for 6.5% yield.',
    impact: '+₹20,800/yr', impactPositive: true, actionLabel: 'Deploy Capital', savingsUnlocked: 20800
  },
  {
    id: 'i6', priority: 'medium', category: 'tax',
    icon: '📋', title: '80C Tax Window Closing',
    description: 'You\'re ₹45K short of your 80C limit. Invest before Mar 31 to unlock ₹13,500 direct tax savings.',
    impact: '₹13.5K tax saved', impactPositive: true, actionLabel: 'Invest in ELSS', savingsUnlocked: 13500
  },
];

// ─── LAYER 5: Goal Lattice Engine ─────────────────────────────────────────────
export interface WealthGoal {
  id: string;
  icon: string;
  title: string;
  category: string;
  targetAmount: number;
  currentProgress: number; // INR
  progressPct: number;
  targetYear: number;
  confidencePct: number;
  monthsAccelerated: number;
  additionalSIPRequired: number;
  linkedAssets: string[];
  assetCoverageMsg: string;
  color: string;
  status: 'on-track' | 'at-risk' | 'achieved' | 'ahead';
}

export const MOCK_WEALTH_GOALS: WealthGoal[] = [
  {
    id: 'g1', icon: '🏖️', title: 'Comfortable Retirement', category: 'Retirement',
    targetAmount: 50000000, currentProgress: 13115000, progressPct: 26, targetYear: 2045,
    confidencePct: 74, monthsAccelerated: 0, additionalSIPRequired: 22000,
    linkedAssets: ['NPS Tier I', 'EPF Corpus', 'PPF Account'],
    assetCoverageMsg: 'EPF + NPS covers ₹9L of retirement corpus. PPF adds ₹2.15L.',
    color: '#7c3aed', status: 'on-track'
  },
  {
    id: 'g2', icon: '🏠', title: 'Dream Home – Bangalore', category: 'Real Estate',
    targetAmount: 15000000, currentProgress: 5220000, progressPct: 35, targetYear: 2030,
    confidencePct: 62, monthsAccelerated: 8, additionalSIPRequired: 18000,
    linkedAssets: ['Mutual Funds', 'Fixed Deposit'],
    assetCoverageMsg: 'Groww MFs cover ₹12.5L. FD adds ₹5L. EMI prepayment saves 8 months.',
    color: '#e63946', status: 'at-risk'
  },
  {
    id: 'g3', icon: '🎓', title: 'Child\'s Higher Education', category: 'Education',
    targetAmount: 5000000, currentProgress: 1100000, progressPct: 22, targetYear: 2035,
    confidencePct: 81, monthsAccelerated: 14, additionalSIPRequired: 8000,
    linkedAssets: ['Digital Gold', 'Physical Gold'],
    assetCoverageMsg: 'Gold holdings (physical + digital) cover 22% of education corpus.',
    color: '#0891b2', status: 'on-track'
  },
  {
    id: 'g4', icon: '💍', title: 'Family Wedding Fund', category: 'Lifestyle',
    targetAmount: 2500000, currentProgress: 1750000, progressPct: 70, targetYear: 2027,
    confidencePct: 92, monthsAccelerated: 5, additionalSIPRequired: 0,
    linkedAssets: ['Fixed Deposit', 'Savings Account'],
    assetCoverageMsg: 'FD + Savings covers 70% already. On track without additional SIP.',
    color: '#f59e0b', status: 'ahead'
  },
  {
    id: 'g5', icon: '🛡️', title: 'Emergency Corpus', category: 'Safety Net',
    targetAmount: 750000, currentProgress: 317200, progressPct: 42, targetYear: 2026,
    confidencePct: 55, monthsAccelerated: 0, additionalSIPRequired: 36000,
    linkedAssets: ['Savings Account', 'Wallet'],
    assetCoverageMsg: 'Liquid accounts cover only 4.7 months. Need ₹1.05L more.',
    color: '#10b981', status: 'at-risk'
  },
  {
    id: 'g6', icon: '🏢', title: 'Business Expansion', category: 'SME',
    targetAmount: 3000000, currentProgress: 1070000, progressPct: 36, targetYear: 2028,
    confidencePct: 68, monthsAccelerated: 6, additionalSIPRequired: 15000,
    linkedAssets: ['SME Current Account', 'Business Assets'],
    assetCoverageMsg: 'SME reserves + machinery liquidation covers 36% of expansion cost.',
    color: '#6366f1', status: 'on-track'
  },
];

// ─── LAYER 6: Risk Sentinel ───────────────────────────────────────────────────
export interface RiskAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  icon: string;
  title: string;
  description: string;
  affectedAmount?: number;
  mitigationSteps: string[];
  reallocationTarget?: string;
}

export const MOCK_RISK_ALERTS: RiskAlert[] = [
  {
    id: 'r1', severity: 'critical', category: 'Concentration Risk', icon: '⚠️',
    title: 'Real Estate Concentration: 62% of Net Worth',
    description: '62% of your total wealth is locked in illiquid real estate. If property markets decline 15%, you lose ₹75L in paper value with no liquidity.',
    affectedAmount: 10900000,
    mitigationSteps: [
      'Reduce property concentration below 50% over 3 years',
      'Do not buy additional property until equity allocation reaches 30%',
      'Consider REIT investments for diversified real estate exposure'
    ],
    reallocationTarget: 'Equity Mutual Funds / REITs'
  },
  {
    id: 'r2', severity: 'warning', category: 'Gold Overexposure', icon: '🪙',
    title: 'Gold Holdings Exceed 7% Threshold',
    description: 'Physical + digital gold totals ₹9.1L (7.4% of net worth). Recommended ceiling is 5%. Excess gold underperforms equity in the long term.',
    affectedAmount: 910000,
    mitigationSteps: [
      'Reduce physical gold by 30% (₹1.68L) via Sovereign Gold Bond swap',
      'Re-invest into balanced advantage funds',
      'Keep digital gold only for goal-linked corpus'
    ],
    reallocationTarget: 'Sovereign Gold Bonds / Equity'
  },
  {
    id: 'r3', severity: 'warning', category: 'Liquidity Risk', icon: '💧',
    title: 'Low Emergency Runway (4.7 Months)',
    description: 'You have only 4.7 months of expense coverage in liquid assets. Any job disruption or medical emergency exceeding ₹3L would require forced asset liquidation.',
    affectedAmount: 317200,
    mitigationSteps: [
      'Build liquid fund balance to ₹7.5L (6 months runway)',
      'Activate auto-sweep from salary account to liquid fund',
      'Avoid any new EMI commitments until runway reaches 6 months'
    ],
    reallocationTarget: 'Liquid Funds / Overnight Funds'
  },
  {
    id: 'r4', severity: 'warning', category: 'Debt Stress', icon: '📉',
    title: 'Rising Total Debt Burden (29.1% of Net Worth)',
    description: 'Home loan + credit card liability represents 29.1% of your net worth. Credit card at ₹45K is expensive at 36% APR and should be cleared immediately.',
    affectedAmount: 3245000,
    mitigationSteps: [
      'Clear credit card balance of ₹45K immediately (36% APR is extreme)',
      'Prepay ₹50K on home loan to save ₹2.1L in interest',
      'Avoid any new credit card purchases this month'
    ],
    reallocationTarget: 'Debt Repayment'
  },
  {
    id: 'r5', severity: 'info', category: 'SME Stagnation', icon: '🏢',
    title: 'SME Account Capital Sitting Idle',
    description: '₹3.2L in SME current account earning 0%. Business cycle analysis shows this capital is not being deployed in working capital efficiently.',
    affectedAmount: 320000,
    mitigationSteps: [
      'Move ₹2L to a business FD for 6.5% yield',
      'Use remaining ₹1.2L to pre-pay any vendor invoices for additional discounts',
      'Review quarterly SME cash flow for deployment optimization'
    ],
    reallocationTarget: 'Business FD / Working Capital'
  },
];

export const RISK_SCORE_BREAKDOWN = {
  overall: 58, // out of 100 (lower = more risk)
  concentrationRisk: 72, // higher = more concentrated
  liquidityRisk: 55,
  debtRisk: 42,
  marketRisk: 38,
  operationalRisk: 25,
};

// ─── LAYER 7: Fraud Shield ────────────────────────────────────────────────────
export type FraudEventStatus = 'allowed' | 'warned' | 'blocked' | 'cooling_off' | 'escalated';
export type FraudEventSeverity = 'safe' | 'low' | 'medium' | 'high' | 'critical';

export interface FraudEvent {
  id: string;
  timestamp: string;
  type: string;
  icon: string;
  description: string;
  amount?: number;
  status: FraudEventStatus;
  severity: FraudEventSeverity;
  riskFactors: string[];
  action: string;
  deviceInfo?: string;
  location?: string;
}

export const MOCK_FRAUD_EVENTS: FraudEvent[] = [
  {
    id: 'f1',
    timestamp: '2026-03-31T14:22:00',
    type: 'High-Value Transfer',
    icon: '🚨',
    description: 'Property advance payment of ₹5L initiated to first-time beneficiary',
    amount: 500000,
    status: 'cooling_off',
    severity: 'high',
    riskFactors: ['First-time beneficiary', 'High amount', 'Off-hours transaction'],
    action: '24-hour cooling-off period applied. Biometric reconfirmation required.',
    deviceInfo: 'Samsung Galaxy S24 (New device — registered 2hr ago)',
    location: 'Bangalore, KA'
  },
  {
    id: 'f2',
    timestamp: '2026-03-31T11:45:00',
    type: 'UPI Transaction',
    icon: '📱',
    description: 'Regular UPI payment to Swiggy – ₹840',
    amount: 840,
    status: 'allowed',
    severity: 'safe',
    riskFactors: [],
    action: 'Transaction approved. Regular merchant recognized.',
    deviceInfo: 'iPhone 15 Pro (Trusted device)',
    location: 'Bangalore, KA'
  },
  {
    id: 'f3',
    timestamp: '2026-03-30T23:12:00',
    type: 'Login Anomaly',
    icon: '🔐',
    description: 'Login attempt from new device at 11:12 PM from Hyderabad',
    status: 'warned',
    severity: 'medium',
    riskFactors: ['Unusual timing (11 PM)', 'New city location', 'New IP address'],
    action: 'OTP verification enforced. Session monitored for 24hrs.',
    deviceInfo: 'Unknown Android (First access)',
    location: 'Hyderabad, TG'
  },
  {
    id: 'f4',
    timestamp: '2026-03-29T15:30:00',
    type: 'Gold Liquidation',
    icon: '🪙',
    description: 'Digital gold liquidation request for ₹2.8L — unusual pattern detected',
    amount: 280000,
    status: 'warned',
    severity: 'medium',
    riskFactors: ['Unusual gold sell behavior', 'Exceeds monthly liquidation norm by 560%'],
    action: 'Behavioral alert sent. 2-hour delay applied. Customer confirmed intent.',
    deviceInfo: 'iPhone 15 Pro (Trusted device)',
    location: 'Bangalore, KA'
  },
  {
    id: 'f5',
    timestamp: '2026-03-28T09:00:00',
    type: 'SIP Modification',
    icon: '📊',
    description: 'SIP amount reduced from ₹15K to ₹2K — unusual change',
    amount: 2000,
    status: 'warned',
    severity: 'low',
    riskFactors: ['Sharp SIP reduction', 'Inconsistent with wealth accumulation goal'],
    action: 'AI nudge sent: "This reduces your retirement corpus by ₹48L." User confirmed.',
    deviceInfo: 'iPhone 15 Pro (Trusted device)',
    location: 'Bangalore, KA'
  },
  {
    id: 'f6',
    timestamp: '2026-03-27T12:00:00',
    type: 'Routine SIP',
    icon: '✅',
    description: 'Monthly SIP of ₹15,000 to Groww Mutual Fund processed',
    amount: 15000,
    status: 'allowed',
    severity: 'safe',
    riskFactors: [],
    action: 'Auto-approved. Recurring trusted transaction.',
    deviceInfo: 'iPhone 15 Pro (Trusted device)',
    location: 'Bangalore, KA'
  },
  {
    id: 'f7',
    timestamp: '2026-03-25T08:15:00',
    type: 'SIM Swap Suspicion',
    icon: '📡',
    description: 'OTP delivery rerouted to different number — possible SIM swap detected',
    status: 'blocked',
    severity: 'critical',
    riskFactors: ['OTP rerouting detected', 'Telecom carrier anomaly', 'No prior device change request'],
    action: 'Account temporarily frozen. Fraud escalation initiated. Call support: 1800-XXX-XXXX',
    deviceInfo: 'Unknown carrier signal redirect',
    location: 'Unknown'
  },
];

export const FRAUD_SHIELD_SCORE = {
  overall: 82, // security health out of 100
  deviceTrust: 90,
  behaviorTrust: 75,
  locationTrust: 88,
  transactionTrust: 78,
  recentThreatsBlocked: 2,
  lastSecurityAudit: '5 days ago',
};

// ─── OVERALL TWIN SUMMARY ──────────────────────────────────────────────────────
export const TWIN_OVERVIEW = {
  syncStatus: 'Live',
  institutionsLinked: 14,
  lastFullSync: '2 mins ago',
  dataPoints: 847,
  twinHealthScore: 78,
  wealthVelocity: '+₹2.4L/month',
  nextMilestone: '₹1.5Cr Net Worth',
  nextMilestonePct: 81,
};
