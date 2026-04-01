export const MOCK_USER = {
  name: 'Cyril',
  netWorth: 2450000, // in INR
  netWorthGrowth: 12.5, // percentage
  savingsRate: 35, // percentage
  goalProgress: 68, // percentage
  riskScore: 'Low', // Low, Medium, High
  currency: '₹',
  monthlyIncome: 125000,
  monthlyExpense: 81250,
  monthlySavings: 43750,
  riskAppetite: 'Conservative', // Conservative, Moderate, Aggressive
  twinAge: 34,
  financialHealthScore: 78, // out of 100
  learningTrend: 'Improving', // Improving, Stable, Declining
};

export const MOCK_TRANSACTIONS = [
  { id: 1, title: 'SIP Auto-Invest', amount: -15000, date: '2026-03-15', category: 'Investment', status: 'Success' },
  { id: 2, title: 'Salary Credit', amount: 125000, date: '2026-03-01', category: 'Income', status: 'Success' },
  { id: 3, title: 'Amazon Shopping', amount: -3200, date: '2026-03-12', category: 'Shopping', status: 'Success' },
  { id: 4, title: 'Grocery Supermart', amount: -4500, date: '2026-03-10', category: 'Food', status: 'Success' },
];

export const MOCK_AI_NUDGE = {
  title: 'Optimize your Tax Savings',
  message: "You're ₹45,000 away from your Section 80C limit. Investing this in ELSS now could save you up to ₹13,500 in taxes this year.",
  actionText: 'View ELSS Funds',
};

export const MOCK_GOALS = [
  { 
    id: 1, 
    title: 'Comfortable Retirement', 
    target: 50000000, 
    current: 12500000, 
    deadline: '2045-12-31', 
    progress: 25, 
    category: 'Future',
    monthlyRequired: 42000,
    projectedCompletion: '2045-06-01',
    icon: '🏖️',
    color: '#7C3AED',
  },
  { 
    id: 2, 
    title: 'Euro Summer Trip 2026', 
    target: 800000, 
    current: 560000, 
    deadline: '2026-06-15', 
    progress: 70, 
    category: 'Lifestyle',
    monthlyRequired: 13333,
    projectedCompletion: '2026-06-01',
    icon: '✈️',
    color: '#2DC653',
  },
  { 
    id: 3, 
    title: 'Tesla Model S Fund', 
    target: 4500000, 
    current: 1800000, 
    deadline: '2027-03-01', 
    progress: 40, 
    category: 'Asset',
    monthlyRequired: 58333,
    projectedCompletion: '2027-05-01',
    icon: '🚗',
    color: '#D4AF37',
  },
  { 
    id: 4, 
    title: 'Dream Home – Bangalore', 
    target: 12000000, 
    current: 2400000, 
    deadline: '2030-01-01', 
    progress: 20, 
    category: 'Asset',
    monthlyRequired: 118000,
    projectedCompletion: '2032-03-01', // 14 months late with current savings
    icon: '🏠',
    color: '#E63946',
  },
];

export const MOCK_PORTFOLIO = [
  { name: 'Equity Mutual Funds', value: 1250000, allocation: 51, change: +8.4, color: '#0A1628' },
  { name: 'US Tech Stocks', value: 650000, allocation: 26, change: +14.2, color: '#D4AF37' },
  { name: 'Digital Gold/Silver', value: 350000, allocation: 14, change: -1.8, color: '#94A3B8' },
  { name: 'Emergency Cash', value: 200000, allocation: 9, change: +2.5, color: '#2DC653' },
];

export const MOCK_PROTECTION = [
  { 
    id: 1, 
    type: 'Family Floater Health', 
    insurer: 'HDFC Ergo', 
    coverage: 1500000, 
    premium: 24500, 
    status: 'Active', 
    renewalDate: '2026-09-12', 
    gap: false 
  },
  { 
    id: 2, 
    type: 'Term Life Cover', 
    insurer: 'ICICI Prudential', 
    coverage: 25000000, 
    premium: 18000, 
    status: 'Active', 
    renewalDate: '2027-01-20', 
    gap: false 
  },
  { 
    id: 3, 
    type: 'Critical Illness Cover', 
    insurer: 'Not Secured', 
    coverage: 0, 
    premium: 0, 
    status: 'Missing', 
    renewalDate: 'N/A', 
    gap: true 
  },
];

// ─── Digital Twin Specific Data ──────────────────────────────────────────────

export const MOCK_TWIN_PROFILE = {
  persona: 'The Cautious Builder',
  description: 'Systematic saver with strong income growth trajectory. Risk-averse but slowly warming up to equity markets.',
  traits: [
    { label: 'Spending Discipline', level: 82, icon: '🎯' },
    { label: 'Investment Consistency', level: 74, icon: '📈' },
    { label: 'Goal Commitment', level: 90, icon: '🏆' },
    { label: 'Risk Tolerance', level: 38, icon: '⚖️' },
  ],
  behaviorPatterns: [
    { month: 'Oct', saving: 38000, spending: 87000 },
    { month: 'Nov', saving: 41000, spending: 84000 },
    { month: 'Dec', saving: 35000, spending: 90000 },
    { month: 'Jan', saving: 44000, spending: 81000 },
    { month: 'Feb', saving: 42000, spending: 83000 },
    { month: 'Mar', saving: 43750, spending: 81250 },
  ],
};

export const MOCK_NET_WORTH_HISTORY = [
  { month: "Oct '25", value: 1980000 },
  { month: "Nov '25", value: 2050000 },
  { month: "Dec '25", value: 2120000 },
  { month: "Jan '26", value: 2220000 },
  { month: "Feb '26", value: 2340000 },
  { month: "Mar '26", value: 2450000 },
];

export const MOCK_SCENARIOS = {
  bull: {
    label: 'Bull Market',
    color: '#2DC653',
    description: 'Equity markets rally 18% p.a.',
    projections: [
      { year: '2026', value: 2900000 },
      { year: '2027', value: 3450000 },
      { year: '2028', value: 4200000 },
      { year: '2029', value: 5100000 },
      { year: '2030', value: 6200000 },
    ],
  },
  base: {
    label: 'Base Case',
    color: '#D4AF37',
    description: 'Moderate growth at 12% p.a.',
    projections: [
      { year: '2026', value: 2750000 },
      { year: '2027', value: 3090000 },
      { year: '2028', value: 3500000 },
      { year: '2029', value: 3950000 },
      { year: '2030', value: 4450000 },
    ],
  },
  bear: {
    label: 'Bear Market',
    color: '#E63946',
    description: 'Market downturn, 4% p.a.',
    projections: [
      { year: '2026', value: 2550000 },
      { year: '2027', value: 2660000 },
      { year: '2028', value: 2780000 },
      { year: '2029', value: 2900000 },
      { year: '2030', value: 3030000 },
    ],
  },
};

export const MOCK_ACCOUNT_AGGREGATOR_ASSETS = [
  {
    id: 1,
    institution: 'State Bank of India',
    type: 'Savings Account',
    accountNumber: '••••9823',
    balance: 185000,
    icon: '🏦',
    lastSync: '2 mins ago',
    color: '#1e40af',
  },
  {
    id: 2,
    institution: 'HDFC Bank',
    type: 'Fixed Deposit',
    accountNumber: '••••4412',
    balance: 500000,
    icon: '🏛️',
    lastSync: '5 mins ago',
    color: '#7c3aed',
  },
  {
    id: 3,
    institution: 'Zerodha – Kite',
    type: 'Demat / Stocks',
    accountNumber: '••••7789',
    balance: 650000,
    icon: '📊',
    lastSync: '12 mins ago',
    color: '#D4AF37',
  },
  {
    id: 4,
    institution: 'Groww',
    type: 'Mutual Funds',
    accountNumber: '••••3310',
    balance: 1250000,
    icon: '🌱',
    lastSync: '12 mins ago',
    color: '#2DC653',
  },
  {
    id: 5,
    institution: 'DigiGold Vault',
    type: 'Digital Gold',
    accountNumber: '••••5501',
    balance: 350000,
    icon: '🪙',
    lastSync: '1 hr ago',
    color: '#f59e0b',
  },
];

export const MOCK_AI_INSIGHTS = [
  {
    id: 1,
    type: 'goal_boost',
    priority: 'high',
    icon: '🏠',
    title: 'Reach Home Goal 14 Months Early',
    message: "If you save ₹800 more/month by cutting streaming & dining subscriptions, you'll reach your Dream Home goal 14 months ahead of schedule.",
    impact: '+14 months saved',
    impactColor: 'text-safe',
    actionText: 'Simulate This',
    tag: 'Goal Accelerator',
  },
  {
    id: 2,
    type: 'tax_optimize',
    priority: 'high',
    icon: '📋',
    title: 'Tax Savings Window Closing',
    message: "You're ₹45,000 short of your 80C limit. Invest before March 31 to save ₹13,500 in taxes.",
    impact: '₹13,500 saved',
    impactColor: 'text-safe',
    actionText: 'Invest in ELSS',
    tag: 'Tax Alpha',
  },
  {
    id: 3,
    type: 'risk_warning',
    priority: 'medium',
    icon: '⚠️',
    title: 'US Tech Over-Exposure',
    message: "Your US Tech allocation (26%) is above your risk profile limit. Rebalance ₹1.2L to Debt funds to stay aligned.",
    impact: 'Risk Normalized',
    impactColor: 'text-gold',
    actionText: 'Rebalance Now',
    tag: 'Risk Alert',
  },
  {
    id: 4,
    type: 'income_behavior',
    priority: 'low',
    icon: '💡',
    title: 'Your Best Savings Month',
    message: 'January was your best savings month (₹44,000). Your twin noticed you spent 7% less on food. Replicate this habit.',
    impact: '+₹44,000 saved',
    impactColor: 'text-safe',
    actionText: 'View Pattern',
    tag: 'Behavior Insight',
  },
];

export const MOCK_SIMULATOR_PRESETS = [
  { label: '₹500 more/month', extraSaving: 500 },
  { label: '₹800 more/month', extraSaving: 800 },
  { label: '₹2,000 more/month', extraSaving: 2000 },
  { label: '₹5,000 more/month', extraSaving: 5000 },
];

// ─── NEW: Asset Breakdown (360° View) ────────────────────────────────────────
export const MOCK_ASSET_BREAKDOWN = [
  { label: 'Bank Balance', value: 685000, icon: '🏦', color: '#1e40af', percentage: 28 },
  { label: 'Mutual Funds', value: 1250000, icon: '🌱', color: '#2DC653', percentage: 51 },
  { label: 'Stocks', value: 650000, icon: '📈', color: '#D4AF37', percentage: 27 },
  { label: 'Digital Gold', value: 350000, icon: '🪙', color: '#f59e0b', percentage: 14 },
  { label: 'Property', value: 8500000, icon: '🏠', color: '#7C3AED', percentage: 70 },
  { label: 'Other Assets', value: 215000, icon: '🚗', color: '#94A3B8', percentage: 9 },
];

// ─── NEW: Spending Behavior Analysis ──────────────────────────────────────────
export const MOCK_SPENDING_CATEGORIES = [
  { category: 'Dining & Food', spent: 18500, avg: 15000, overspend: true, icon: '🍔', pct: 23, color: '#E63946' },
  { category: 'Shopping', spent: 12000, avg: 10000, overspend: true, icon: '🛍️', pct: 15, color: '#f59e0b' },
  { category: 'Travel', spent: 8000, avg: 9500, overspend: false, icon: '✈️', pct: 10, color: '#2DC653' },
  { category: 'Entertainment', spent: 5500, avg: 4000, overspend: true, icon: '🎬', pct: 7, color: '#7C3AED' },
  { category: 'Utilities', spent: 6200, avg: 6000, overspend: false, icon: '⚡', pct: 8, color: '#D4AF37' },
  { category: 'Health & Fitness', spent: 3500, avg: 4500, overspend: false, icon: '💪', pct: 4, color: '#0A1628' },
];

// ─── NEW: AI Recommendations ──────────────────────────────────────────────────
export const MOCK_AI_RECOMMENDATIONS = [
  {
    id: 1,
    action: 'Increase SIP by ₹5,000/month',
    reason: 'Your income grew 18% this year but your SIP amount stayed unchanged. Increasing it now captures compounding at its peak.',
    impact: '+₹24L in 10Y',
    impactPositive: true,
    icon: '📈',
    tag: 'Investment',
    priority: 'high',
  },
  {
    id: 2,
    action: 'Cut Dining Expenses by 20%',
    reason: 'You spend 20% more than the average person in your income bracket on dining. Saving just ₹3,700/month frees up ₹44,400/year.',
    impact: '₹44K/year freed',
    impactPositive: true,
    icon: '🍔',
    tag: 'Budgeting',
    priority: 'high',
  },
  {
    id: 3,
    action: 'Rebalance Portfolio',
    reason: 'US Tech stocks at 26% allocation exceed your Conservative risk profile. Moving ₹1.2L to debt funds reduces volatility by 40%.',
    impact: '-40% volatility',
    impactPositive: true,
    icon: '⚖️',
    tag: 'Risk',
    priority: 'medium',
  },
  {
    id: 4,
    action: 'Invest ₹45K in ELSS before Mar 31',
    reason: "You're ₹45,000 short of your 80C tax limit. This investment saves you ₹13,500 in direct taxes this financial year.",
    impact: '₹13.5K tax saved',
    impactPositive: true,
    icon: '📋',
    tag: 'Tax',
    priority: 'high',
  },
];

// ─── NEW: Risk Profile ────────────────────────────────────────────────────────
export const MOCK_RISK_PROFILE = {
  level: 'Conservative',
  score: 38,
  color: '#D4AF37',
  description: 'You prefer capital preservation over aggressive growth. Best suited for FDs, debt funds, and diversified equity at ≤30% allocation.',
  investmentStyle: 'Capital Preserver',
  suitableInstruments: ['Fixed Deposits', 'Debt Mutual Funds', 'Government Bonds', 'Blue-chip Equity (≤30%)'],
  avoidInstruments: ['Crypto', 'Small Cap Funds', 'F&O Trading'],
  metrics: [
    { label: 'Max Drawdown Tolerance', value: '10%' },
    { label: 'Preferred Returns', value: '10–12% p.a.' },
    { label: 'Investment Horizon', value: '7–10 years' },
    { label: 'Liquidity Need', value: 'Medium-High' },
  ],
};

// ─── NEW: Future Projections ──────────────────────────────────────────────────
export const MOCK_FUTURE_PROJECTIONS = {
  netWorth5Y: 4450000,
  netWorth10Y: 8900000,
  goalCompletionDate: '2030-01-01',
  currentBehaviorProjection: [
    { year: '2026', netWorth: 2750000 },
    { year: '2027', netWorth: 3090000 },
    { year: '2028', netWorth: 3500000 },
    { year: '2029', netWorth: 3950000 },
    { year: '2030', netWorth: 4450000 },
    { year: '2031', netWorth: 5050000 },
    { year: '2032', netWorth: 5700000 },
    { year: '2033', netWorth: 6450000 },
    { year: '2034', netWorth: 7300000 },
    { year: '2035', netWorth: 8250000 },
  ],
  improvedSavingsProjection: [
    { year: '2026', netWorth: 2900000 },
    { year: '2027', netWorth: 3450000 },
    { year: '2028', netWorth: 4200000 },
    { year: '2029', netWorth: 5100000 },
    { year: '2030', netWorth: 6200000 },
    { year: '2031', netWorth: 7600000 },
    { year: '2032', netWorth: 9300000 },
    { year: '2033', netWorth: 11400000 },
    { year: '2034', netWorth: 14000000 },
    { year: '2035', netWorth: 17200000 },
  ],
  marketChangeProjection: [
    { year: '2026', netWorth: 2550000 },
    { year: '2027', netWorth: 2660000 },
    { year: '2028', netWorth: 2780000 },
    { year: '2029', netWorth: 2900000 },
    { year: '2030', netWorth: 3030000 },
    { year: '2031', netWorth: 3160000 },
    { year: '2032', netWorth: 3300000 },
    { year: '2033', netWorth: 3440000 },
    { year: '2034', netWorth: 3600000 },
    { year: '2035', netWorth: 3760000 },
  ],
};
