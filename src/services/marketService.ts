// ═══════════════════════════════════════════════════════════════
// REAL-TIME MARKET SERVICE — Indian Stock Exchange API
// Fetches live market data to power the Strategic Recommendation Engine
// ═══════════════════════════════════════════════════════════════

const API_KEY = import.meta.env.VITE_STOCK_API_KEY;
const BASE_URL = import.meta.env.VITE_STOCK_API_BASE || 'https://stock.indianapi.in';

const headers = {
  'X-Api-Key': API_KEY,
  'Content-Type': 'application/json',
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrendingStock {
  ticker_id: string;
  company_name: string;
  price: string;
  percent_change: string;
  net_change: string;
  high: string;
  low: string;
  open: string;
  volume: string;
  year_high: string;
  year_low: string;
  overall_rating: string;
  short_term_trends: string;
  long_term_trends: string;
}

export interface TrendingData {
  trending_stocks: {
    top_gainers: TrendingStock[];
    top_losers: TrendingStock[];
  };
}

export interface MutualFund {
  fund_name: string;
  latest_nav: number;
  percentage_change: number;
  asset_size: number;
  '1_month_return': number;
  '3_month_return': number;
  '6_month_return': number;
  '1_year_return': number;
  '3_year_return': number;
  '5_year_return': number;
  star_rating: number;
}

export interface MutualFundCategory {
  [category: string]: MutualFund[];
}

export interface MutualFundsData {
  [assetClass: string]: MutualFundCategory;
}

export interface CommodityFuture {
  contractId: string;
  commoditySymbol: string;
  expiryDate: string;
  lastTradedPrice: number;
  openingPrice: number;
  highPrice: number;
  lowPrice: number;
  closingPrice: number;
  priceChange: number;
  percentageChange: number;
  totalVolume: number;
  priceUnit: string;
  contractMonth: string;
}

export interface NSEMostActive {
  ticker: string;
  company: string;
  price: number;
  percent_change: number;
  net_change: number;
  volume: number;
}

export interface MarketSnapshot {
  trending: TrendingData | null;
  mutualFunds: MutualFundsData | null;
  commodities: CommodityFuture[] | null;
  nseActive: NSEMostActive[] | null;
  fetchedAt: Date;
  error?: string;
}

// ─── API Fetchers ─────────────────────────────────────────────────────────────

const fetchJSON = async <T>(endpoint: string): Promise<T | null> => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, { headers });
    if (!res.ok) {
      console.warn(`Market API error: ${res.status} ${res.statusText} for ${endpoint}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`Market API fetch failed for ${endpoint}:`, err);
    return null;
  }
};

export const fetchTrending = () => fetchJSON<TrendingData>('/trending');
export const fetchMutualFunds = () => fetchJSON<MutualFundsData>('/mutual_funds');
export const fetchCommodities = () => fetchJSON<CommodityFuture[]>('/commodities');
export const fetchNSEMostActive = () => fetchJSON<NSEMostActive[]>('/NSE_most_active');
export const fetchStockData = (name: string) =>
  fetchJSON<any>(`/stock?name=${encodeURIComponent(name)}`);
export const fetchNews = () => fetchJSON<any>('/news');

// Fetch personalized news for user's holdings
export const fetchPortfolioNews = async (holdings: string[]): Promise<any[]> => {
  const allNews: any[] = [];
  // Try dedicated news endpoint first
  const generalNews = await fetchNews();
  if (generalNews && Array.isArray(generalNews)) {
    allNews.push(...generalNews.slice(0, 5));
  } else if (generalNews?.news && Array.isArray(generalNews.news)) {
    allNews.push(...generalNews.news.slice(0, 5));
  }
  // Also fetch stock-specific news for each holding
  const stockPromises = holdings.slice(0, 4).map(async (name) => {
    const data = await fetchStockData(name);
    if (data?.recentNews && Array.isArray(data.recentNews)) {
      return data.recentNews.map((n: any) => ({ ...n, relatedStock: name }));
    }
    if (data?.news && Array.isArray(data.news)) {
      return data.news.map((n: any) => ({ ...n, relatedStock: name }));
    }
    return [];
  });
  const results = await Promise.allSettled(stockPromises);
  results.forEach(r => { if (r.status === 'fulfilled') allNews.push(...r.value); });
  return allNews;
};

export const fetchFullMarketSnapshot = async (): Promise<MarketSnapshot> => {
  const [trending, mutualFunds, commodities, nseActive] = await Promise.allSettled([
    fetchTrending(),
    fetchMutualFunds(),
    fetchCommodities(),
    fetchNSEMostActive(),
  ]);

  return {
    trending: trending.status === 'fulfilled' ? trending.value : null,
    mutualFunds: mutualFunds.status === 'fulfilled' ? mutualFunds.value : null,
    commodities: commodities.status === 'fulfilled' ? commodities.value : null,
    nseActive: nseActive.status === 'fulfilled' ? nseActive.value : null,
    fetchedAt: new Date(),
  };
};

// ─── Market Signal Derivation ─────────────────────────────────────────────────

export interface MarketSignal {
  indicator: string;
  value: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  change: string;
  icon: string;
  source: string;
}

export const deriveMarketSignals = (snapshot: MarketSnapshot): MarketSignal[] => {
  const signals: MarketSignal[] = [];

  // 1. Equity market signal from top gainers/losers ratio
  if (snapshot.trending) {
    const gainers = snapshot.trending.trending_stocks.top_gainers;
    const losers = snapshot.trending.trending_stocks.top_losers;
    if (gainers.length > 0) {
      const topGainer = gainers[0];
      const avgGain = gainers.reduce((s, g) => s + parseFloat(g.percent_change || '0'), 0) / gainers.length;
      const avgLoss = losers.reduce((s, l) => s + parseFloat(l.percent_change || '0'), 0) / losers.length;
      const marketMood = avgGain + avgLoss; // net sentiment

      signals.push({
        indicator: 'Equity Market',
        value: `Nifty Sentiment: ${marketMood > 0 ? 'Positive' : 'Negative'}`,
        trend: marketMood > 1 ? 'bullish' : marketMood < -1 ? 'bearish' : 'neutral',
        change: `Top Gainer: ${topGainer.company_name} +${topGainer.percent_change}%`,
        icon: '📈',
        source: 'NSE Live',
      });

      signals.push({
        indicator: 'Market Volatility',
        value: Math.abs(parseFloat(losers[0]?.percent_change || '0')) > 3 ? 'High Volatility' : 'Moderate',
        trend: Math.abs(parseFloat(losers[0]?.percent_change || '0')) > 3 ? 'bearish' : 'neutral',
        change: `Top Loser: ${losers[0]?.company_name} ${losers[0]?.percent_change}%`,
        icon: '⚡',
        source: 'NSE Live',
      });
    }
  }

  // 2. Gold signal from commodities (GOLD futures)
  if (snapshot.commodities) {
    const gold = snapshot.commodities.find(c => c.commoditySymbol?.toUpperCase().includes('GOLD'));
    if (gold) {
      signals.push({
        indicator: 'Gold Price',
        value: `₹${gold.lastTradedPrice.toLocaleString('en-IN')} /10g`,
        trend: gold.percentageChange > 0.5 ? 'bullish' : gold.percentageChange < -0.5 ? 'bearish' : 'neutral',
        change: `${gold.percentageChange >= 0 ? '+' : ''}${gold.percentageChange.toFixed(2)}% today`,
        icon: '🪙',
        source: 'MCX Futures',
      });
    }
    // Crude Oil
    const crude = snapshot.commodities.find(c => c.commoditySymbol?.toUpperCase().includes('CRUDE') || c.commoditySymbol?.toUpperCase().includes('OIL'));
    if (crude) {
      signals.push({
        indicator: 'Crude Oil',
        value: `₹${crude.lastTradedPrice.toLocaleString('en-IN')} /bbl`,
        trend: crude.percentageChange > 1 ? 'bearish' : crude.percentageChange < -1 ? 'bullish' : 'neutral',
        change: `${crude.percentageChange >= 0 ? '+' : ''}${crude.percentageChange.toFixed(2)}% (inflation risk)`,
        icon: '🛢️',
        source: 'MCX Futures',
      });
    }
  }

  // 3. Mutual Fund performance signal
  if (snapshot.mutualFunds) {
    const equity = snapshot.mutualFunds['Equity'];
    if (equity) {
      const largeCap = equity['Large Cap'];
      if (largeCap?.length > 0) {
        const avgReturn = largeCap.slice(0, 5).reduce((s, f) => s + (f['1_year_return'] || 0), 0) / Math.min(largeCap.length, 5);
        signals.push({
          indicator: 'Large Cap MFs',
          value: `Avg 1Y Return: ${avgReturn.toFixed(1)}%`,
          trend: avgReturn > 15 ? 'bullish' : avgReturn > 8 ? 'neutral' : 'bearish',
          change: `Top: ${largeCap[0]?.fund_name?.split(' ').slice(0, 3).join(' ')} · ★${largeCap[0]?.star_rating}`,
          icon: '🌱',
          source: 'AMFI Data',
        });
      }
    }
  }

  // 4. Static macro signals (RBI/Inflation — enriched via Gemini later)
  signals.push({
    indicator: 'RBI Repo Rate',
    value: '6.50% p.a.',
    trend: 'neutral',
    change: 'Stable since Feb 2024',
    icon: '🏛️',
    source: 'RBI Policy',
  });

  signals.push({
    indicator: 'India Inflation (CPI)',
    value: '4.85%',
    trend: 'neutral',
    change: 'Within RBI target band',
    icon: '📊',
    source: 'MoSPI Data',
  });

  return signals;
};

// ─── Strategy Recommendation Builder ─────────────────────────────────────────

export interface StrategyRecommendation {
  id: string;
  priority: 'urgent' | 'high' | 'medium' | 'info';
  trigger: string;        // what market signal caused this
  action: string;         // what to do
  rationale: string;      // why
  amount?: number;        // suggested amount in INR
  from?: string;          // move from (asset class)
  to?: string;            // move to (asset class)
  expectedGain?: string;  // expected upside
  riskLevel: 'low' | 'medium' | 'high';
  icon: string;
  category: 'rebalance' | 'accumulate' | 'protect' | 'optimize' | 'tax';
  cyberCheckRequired: boolean;
}

export const buildRecommendations = (
  _snapshot: MarketSnapshot,
  signals: MarketSignal[],
  portfolioMix: { equity: number; debt: number; gold: number; fd: number; cash: number },
  riskProfile: 'conservative' | 'moderate' | 'aggressive',
  _goalTimeline: 'short' | 'medium' | 'long'
): StrategyRecommendation[] => {
  const recs: StrategyRecommendation[] = [];

  const goldSignal = signals.find(s => s.indicator === 'Gold Price');
  const equitySignal = signals.find(s => s.indicator === 'Equity Market');
  const volatilitySignal = signals.find(s => s.indicator === 'Market Volatility');
  const mfSignal = signals.find(s => s.indicator === 'Large Cap MFs');
  const crudSignal = signals.find(s => s.indicator === 'Crude Oil');

  const totalPortfolio = Object.values(portfolioMix).reduce((a, b) => a + b, 0);
  const goldPct = totalPortfolio > 0 ? (portfolioMix.gold / totalPortfolio) * 100 : 0;
  const equityPct = totalPortfolio > 0 ? (portfolioMix.equity / totalPortfolio) * 100 : 0;
  const cashPct = totalPortfolio > 0 ? (portfolioMix.cash / totalPortfolio) * 100 : 0;

  // ── Gold Overweight → Rebalance ──
  if (goldPct > 8 || goldSignal?.trend === 'bullish') {
    recs.push({
      id: 'r1',
      priority: goldPct > 10 ? 'urgent' : 'high',
      trigger: `Gold at ${goldSignal?.value || 'elevated price'} — ${goldPct.toFixed(1)}% of portfolio`,
      action: `Rebalance ${goldPct > 10 ? '15%' : '10%'} of gold to debt funds`,
      rationale: 'Gold has outperformed its allocation threshold. Locking in gains and shifting to debt preserves wealth and improves diversification score.',
      amount: Math.round(portfolioMix.gold * (goldPct > 10 ? 0.15 : 0.10)),
      from: 'Digital Gold / Physical Gold',
      to: 'Short-duration Debt Funds',
      expectedGain: '+8–9% annualised from debt vs gold storage costs',
      riskLevel: 'low',
      icon: '🪙',
      category: 'rebalance',
      cyberCheckRequired: true,
    });
  }

  // ── Equity Market Bullish → SIP Step-up ──
  if (equitySignal?.trend === 'bullish' && equityPct < 55) {
    recs.push({
      id: 'r2',
      priority: 'high',
      trigger: `Positive market sentiment — top gainers averaging +${equitySignal.change}`,
      action: 'Step up SIP by ₹5,000/month in Large Cap index fund',
      rationale: 'Bull phase with fundamental support is an ideal window to increase systematic equity exposure for long-term goals.',
      amount: 5000,
      from: 'Idle Savings',
      to: 'Nifty 50 Index Fund',
      expectedGain: `${mfSignal?.value || '14–16% CAGR'} (5-yr avg)`,
      riskLevel: riskProfile === 'aggressive' ? 'medium' : 'high',
      icon: '📈',
      category: 'accumulate',
      cyberCheckRequired: false,
    });
  }

  // ── High Volatility → SIP Window ──
  if (volatilitySignal?.trend === 'bearish') {
    recs.push({
      id: 'r3',
      priority: 'medium',
      trigger: `Market correction detected — ${volatilitySignal.change}`,
      action: 'Activate lump-sum SIP top-up of ₹25,000 (use market dip)',
      rationale: 'Market corrections create rupee-cost averaging opportunities. A lump-sum top-up during dips historically yields 2–3% better entry price.',
      amount: 25000,
      from: 'Liquid Fund / Cash Buffer',
      to: 'Equity Mutual Funds (existing SIPs)',
      expectedGain: 'Improved avg cost by est. ₹18–22K over 5yr',
      riskLevel: 'medium',
      icon: '⚡',
      category: 'accumulate',
      cyberCheckRequired: false,
    });
  }

  // ── High Cash → FD Ladder ──
  if (cashPct > 12) {
    recs.push({
      id: 'r4',
      priority: 'high',
      trigger: `Cash at ${cashPct.toFixed(1)}% of portfolio — earning <3%`,
      action: 'Ladder ₹1.5L into 3×6-month FDs (staggered maturity)',
      rationale: 'FD rates at 7.25% (ICICI/HDFC/SBI). Ladder strategy maintains liquidity while earning 4%+ more than savings rates.',
      amount: 150000,
      from: 'Savings Account (idle cash)',
      to: '1-Year Fixed Deposit',
      expectedGain: '+₹10,875/yr vs savings account',
      riskLevel: 'low',
      icon: '🏦',
      category: 'optimize',
      cyberCheckRequired: true,
    });
  }

  // ── Crude Oil Rising → Inflation Hedge ──
  if (crudSignal?.trend === 'bearish') {
    recs.push({
      id: 'r5',
      priority: 'medium',
      trigger: `Crude oil rising — ${crudSignal?.change}`,
      action: 'Increase debt allocation by 5% (short-term gilts / liquid funds)',
      rationale: 'Rising crude signals inflation pressure. Short-duration debt and inflation-linked bonds protect real wealth during inflationary cycles.',
      amount: Math.round(totalPortfolio * 0.05),
      from: 'Long-duration equity exposure',
      to: 'Short-duration Gilt / Liquid Fund',
      expectedGain: 'Inflation-adjusted wealth protection',
      riskLevel: 'low',
      icon: '🛢️',
      category: 'protect',
      cyberCheckRequired: false,
    });
  }

  // ── Equity Underweight → Rebalance In ──
  if (equityPct < 30 && riskProfile !== 'conservative') {
    recs.push({
      id: 'r6',
      priority: 'medium',
      trigger: `Equity at ${equityPct.toFixed(1)}% — below optimal ${riskProfile === 'aggressive' ? '65' : '50'}%`,
      action: 'Increase equity SIP by ₹8,000/month via ELSS (tax 80C benefit)',
      rationale: 'Under-exposure to equity reduces long-term wealth compounding. ELSS provides the dual benefit of equity returns + ₹1.5L 80C tax deduction.',
      amount: 8000,
      from: 'Monthly surplus cash flow',
      to: 'ELSS Mutual Fund',
      expectedGain: 'Tax saving ₹13,500 + 14%+ CAGR on invested corpus',
      riskLevel: 'medium',
      icon: '📋',
      category: 'tax',
      cyberCheckRequired: false,
    });
  }

  // ── SME Idle Cash ──
  recs.push({
    id: 'r7',
    priority: 'info',
    trigger: '90-day surplus cash idle in SME current account',
    action: 'Deploy ₹2L into a 1-year business FD or liquid fund ladder',
    rationale: 'Zero-yield current account capital represents opportunity cost. Liquid + short-term FD laddering earns 6.5–7.5% with 1-day withdrawal flexibility.',
    amount: 200000,
    from: 'SME Current Account',
    to: 'Business Liquid Fund / FD',
    expectedGain: '+₹13,000–15,000/yr',
    riskLevel: 'low',
    icon: '🏢',
    category: 'optimize',
    cyberCheckRequired: true,
  });

  // Sort by priority
  const priorityOrder = { urgent: 0, high: 1, medium: 2, info: 3 };
  return recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
};
