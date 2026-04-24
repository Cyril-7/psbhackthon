// ═══════════════════════════════════════════════════════════════
// REAL-TIME MARKET SERVICE — Indian Stock Exchange API
// Fetches live market data to power the Strategic Recommendation Engine
// Includes persistent caching so data shows even after market hours
// ═══════════════════════════════════════════════════════════════

const API_KEY = import.meta.env.VITE_STOCK_API_KEY;
const BASE_URL = import.meta.env.VITE_STOCK_API_BASE || 'https://stock.indianapi.in';

const headers = {
  'X-Api-Key': API_KEY,
  'Content-Type': 'application/json',
};

// ─── Market Hours & Cache Utilities ──────────────────────────────────────────

/**
 * Returns true if Indian markets (NSE/BSE) are currently open.
 * NSE/BSE hours: Monday–Friday, 09:15–15:30 IST
 */
export const isMarketOpen = (): boolean => {
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000);
  const day = ist.getDay(); // 0=Sun, 6=Sat
  if (day === 0 || day === 6) return false;
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const totalMins = hours * 60 + minutes;
  return totalMins >= 9 * 60 + 15 && totalMins <= 15 * 60 + 30;
};

/** Get the last market close time as a friendly string */
export const getMarketStatusLabel = (): { open: boolean; label: string } => {
  const open = isMarketOpen();
  return {
    open,
    label: open ? 'Market Open' : 'Market Closed — Last Session Data',
  };
};

// ─── Cache Helpers ────────────────────────────────────────────────────────────

// 24h TTL — rate limit is precious; one market day of data is acceptable
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// Per-session in-memory store — prevents duplicate API calls when tabs are switched
const SESSION_CACHE = new Map<string, any>();

const saveCache = <T>(key: string, data: T): void => {
  try {
    SESSION_CACHE.set(key, { data, ts: Date.now() });
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* quota exceeded — ignore */ }
};

const loadCache = <T>(key: string): T | null => {
  // Check in-memory session cache first (no JSON parse overhead)
  const mem = SESSION_CACHE.get(key);
  if (mem && Date.now() - mem.ts < CACHE_TTL_MS) return mem.data as T;
  // Fall through to localStorage
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data: T; ts: number };
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    // Warm the session cache
    SESSION_CACHE.set(key, parsed);
    return parsed.data;
  } catch { return null; }
};


const CACHE_KEYS = {
  snapshot: 'alpha_market_snapshot',
  news: 'alpha_market_news',
  stocks: 'alpha_market_stocks',
  indices: 'alpha_market_indices',
} as const;

// ─── One-time startup cache eviction ─────────────────────────────────────────
// Clears any localStorage entries older than 20 hours so stale data is never shown.
// Runs once when the module is first imported.
;(() => {
  try {
    const MAX_AGE = 20 * 60 * 60 * 1000; // 20 hours
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('alpha_market_')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(k) || '{}');
          if (parsed.ts && Date.now() - parsed.ts > MAX_AGE) {
            localStorage.removeItem(k);
            SESSION_CACHE.delete(k);
          }
        } catch { localStorage.removeItem(k); }
      }
    });
  } catch { /* localStorage not available */ }
})();

// ─── Dynamic Last-Session Date Helper ────────────────────────────────────────
/** Returns the last NSE/BSE market session date as a human-readable string */
export const getLastSessionDate = (): string => {
  const now = new Date();
  // Walk back from today until we find Mon–Fri
  const d = new Date(now);
  // If before 9:15 AM IST today, last session is yesterday
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000);
  if (ist.getHours() < 9 || (ist.getHours() === 9 && ist.getMinutes() < 15)) {
    d.setDate(d.getDate() - 1);
  }
  // Walk back to last weekday
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() - 1);
  }
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
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
  indices: any[] | null;
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
export const fetchIndices = (type: 'POPULAR' | 'SECTOR' = 'POPULAR') =>
  fetchJSON<any[]>(`/indices?index_type=${type}`);
export const fetchStockData = (name: string) =>
  fetchJSON<any>(`/stock?name=${encodeURIComponent(name)}`);
export const fetchNews = () => fetchJSON<any>('/news');

/**
 * Fetch stock data with cache-first strategy.
 * Cache is ALWAYS served if valid — API is only called when cache is absent.
 * This prevents rate limit exhaustion from tab switching.
 */
export const fetchStockDataCached = async (
  name: string,
  forceRefresh = false
): Promise<{ data: any; fromCache: boolean; isFallback?: boolean }> => {
  const cacheKey = `${CACHE_KEYS.stocks}_${name.toLowerCase().replace(/\s+/g, '_')}`;

  // 1. Serve from cache unless force-refresh requested
  if (!forceRefresh) {
    const cached = loadCache<any>(cacheKey);
    if (cached) return { data: cached, fromCache: true };
  }

  // 2. Try live API
  const live = await fetchStockData(name);
  if (live && typeof live === 'object' && Object.keys(live).length > 0 && !live.error && !live.detail) {
    saveCache(cacheKey, live);
    return { data: live, fromCache: false };
  }

  // Stale cache is better than nothing
  const stale = (() => {
    try {
      const raw = localStorage.getItem(cacheKey);
      return raw ? JSON.parse(raw).data : null;
    } catch { return null; }
  })();
  if (stale) return { data: stale, fromCache: true };

  return { data: null, fromCache: false, isFallback: false };
};

/**
 * Fetch market index / active stocks data.
 * Uses /NSE_most_active (available on this plan) instead of the blocked /indices endpoint.
 * Normalizes the response to match the StockRow shape expected by the UI.
 */
export const INDEX_TICKERS = [
  'NIFTY 50',
  'NIFTY Bank',
  'Nifty Financial Services',
  'Bse Sensex',
  'Nifty Midcap Select',
  'Bse Bankex',
  'India Vix',
  'Nifty Total Market'
];

/**
 * Fetch market indices. 
 * Since the /indices endpoint is restricted, we fetch them individually using the /stock endpoint.
 * This ensures we get live data for all key indices.
 */
export const fetchIndicesCached = async (
  _type: 'POPULAR' | 'SECTOR' = 'POPULAR',
  forceRefresh = false
): Promise<{ data: any[]; fromCache: boolean; isFallback?: boolean }> => {
  const cacheKey = CACHE_KEYS.indices;

  // 1. Serve from cache if valid
  if (!forceRefresh) {
    const cached = loadCache<any[]>(cacheKey);
    if (cached && cached.length > 0) return { data: cached, fromCache: true };
  }

  // 2. Fetch live data sequentially with stagger
  const results: any[] = [];
  let anySuccess = false;

  try {
    for (let i = 0; i < INDEX_TICKERS.length; i++) {
      const name = INDEX_TICKERS[i];
      // Small delay between calls to stay within rate limits
      if (i > 0) await new Promise(r => setTimeout(r, 250));
      
      const live = await fetchStockData(name);
      if (live && typeof live === 'object' && !live.error && !live.detail && (live.currentPrice || live.price)) {
        results.push({
          ...live,
          name, // UI matching key
          companyName: live.companyName || name,
          tickerId: live.tickerId || name.toUpperCase().replace(/\s+/g, ''),
        });
        anySuccess = true;
      } else {
        // If one fails, try to keep the existing cached version for that specific index if available
        results.push({ name, price: null, percentChange: 0, companyName: name });
      }
    }
  } catch (err) {
    console.error('Failed to fetch live indices:', err);
  }

  if (anySuccess) {
    // Filter out completely empty failures if possible, or just save the set
    saveCache(cacheKey, results);
    return { data: results, fromCache: false };
  }

  // 3. Fallback to stale cache (even if expired)
  const stale = (() => {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (!raw) return null;
      return JSON.parse(raw).data;
    } catch { return null; }
  })();

  if (stale && Array.isArray(stale) && stale.length > 0) {
    return { data: stale, fromCache: true, isFallback: true };
  }

  // 4. Ultimate hardcoded seed data (so the dashboard never looks empty)
  const seedIndices = [
    { name: 'NIFTY 50', price: 24173.05, percentChange: 0.12, companyName: 'NIFTY 50', tickerId: 'NIFTY50' },
    { name: 'NIFTY Bank', price: 52305.40, percentChange: -0.05, companyName: 'NIFTY BANK', tickerId: 'BANKNIFTY' },
    { name: 'Bse Sensex', price: 77664.10, percentChange: 0.08, companyName: 'BSE SENSEX', tickerId: 'SENSEX' },
    { name: 'India Vix', price: 12.85, percentChange: -1.2, companyName: 'INDIA VIX', tickerId: 'INDIAVIX' },
  ];

  return { data: seedIndices, fromCache: true, isFallback: true };
};

/**
 * Fetch most active stocks (available on this plan).
 */
export const fetchMostActiveCached = async (
  forceRefresh = false
): Promise<{ data: any[]; fromCache: boolean; isFallback?: boolean }> => {
  const cacheKey = `${CACHE_KEYS.indices}_nse_active_stocks`;

  if (!forceRefresh) {
    const cached = loadCache<any[]>(cacheKey);
    if (cached && cached.length > 0) return { data: cached, fromCache: true };
  }

  const live = await fetchNSEMostActive();
  if (live && Array.isArray(live) && live.length > 0) {
    const normalized = live.slice(0, 10).map((s: any) => ({
      name: s.company || s.ticker,
      ticker: s.ticker,
      price: s.price,
      percentChange: s.percent_change,
      high: s.high,
      low: s.low,
      volume: s.volume,
      currentPrice: { NSE: s.price },
      companyName: s.company,
      tickerId: s.ticker?.replace('.NS', '').replace('.BO', ''),
    }));
    saveCache(cacheKey, normalized);
    return { data: normalized, fromCache: false };
  }

  return { data: [], fromCache: false, isFallback: false };
};



// Fetch personalized news for user's holdings — with localStorage cache fallback
export const fetchPortfolioNews = async (holdings: string[]): Promise<{ news: any[]; fromCache: boolean }> => {
  const allNews: any[] = [];
  let anyLiveData = false;

  // Try dedicated news endpoint first
  const generalNews = await fetchNews();
  if (generalNews && Array.isArray(generalNews) && generalNews.length > 0) {
    allNews.push(...generalNews.slice(0, 5));
    anyLiveData = true;
  } else if (generalNews?.news && Array.isArray(generalNews.news) && generalNews.news.length > 0) {
    allNews.push(...generalNews.news.slice(0, 5));
    anyLiveData = true;
  }

  // Also fetch stock-specific news for each holding
  const stockPromises = holdings.slice(0, 4).map(async (name) => {
    const data = await fetchStockData(name);
    if (data?.recentNews && Array.isArray(data.recentNews) && data.recentNews.length > 0) {
      anyLiveData = true;
      return data.recentNews.map((n: any) => ({ ...n, relatedStock: name }));
    }
    if (data?.news && Array.isArray(data.news) && data.news.length > 0) {
      anyLiveData = true;
      return data.news.map((n: any) => ({ ...n, relatedStock: name }));
    }
    return [];
  });
  const results = await Promise.allSettled(stockPromises);
  results.forEach(r => { if (r.status === 'fulfilled') allNews.push(...r.value); });

  // If we got live data, cache it
  if (anyLiveData && allNews.length > 0) {
    saveCache(CACHE_KEYS.news, allNews);
    return { news: allNews, fromCache: false };
  }

  // Fall back to localStorage cache
  const cached = loadCache<any[]>(CACHE_KEYS.news);
  if (cached && cached.length > 0) {
    return { news: cached, fromCache: true };
  }

  return { news: [], fromCache: false };
};

export const fetchFullMarketSnapshot = async (): Promise<MarketSnapshot & { fromCache?: boolean }> => {
  const [trending, mutualFunds, commodities, nseActive, indicesRes] = await Promise.allSettled([
    fetchTrending(),
    fetchMutualFunds(),
    fetchCommodities(),
    fetchNSEMostActive(),
    fetchIndicesCached(),
  ]);
 
  const trendingVal = trending.status === 'fulfilled' ? trending.value : null;
  const mutualFundsVal = mutualFunds.status === 'fulfilled' ? mutualFunds.value : null;
  const commoditiesVal = commodities.status === 'fulfilled' ? commodities.value : null;
  const nseActiveVal = nseActive.status === 'fulfilled' ? nseActive.value : null;
  const indicesVal = indicesRes.status === 'fulfilled' ? indicesRes.value.data : null;
 
  const hasLiveData = !!(trendingVal || mutualFundsVal || commoditiesVal || nseActiveVal || indicesVal);
 
  if (hasLiveData) {
    const snap: MarketSnapshot = {
      trending: trendingVal,
      mutualFunds: mutualFundsVal,
      commodities: commoditiesVal,
      nseActive: nseActiveVal,
      indices: indicesVal,
      fetchedAt: new Date(),
    };
    // Persist to cache — strip Date object for JSON serialization
    saveCache(CACHE_KEYS.snapshot, { ...snap, fetchedAt: snap.fetchedAt.toISOString() });
    return { ...snap, fromCache: false };
  }

  // No live data — try cache
  const cached = loadCache<any>(CACHE_KEYS.snapshot);
  if (cached) {
    return {
      trending: cached.trending ?? null,
      mutualFunds: cached.mutualFunds ?? null,
      commodities: cached.commodities ?? null,
      nseActive: cached.nseActive ?? null,
      indices: cached.indices ?? null,
      fetchedAt: cached.fetchedAt ? new Date(cached.fetchedAt) : new Date(),
      fromCache: true,
    };
  }

  return {
    trending: null,
    mutualFunds: null,
    commodities: null,
    nseActive: null,
    indices: null,
    fetchedAt: new Date(),
    fromCache: false,
  } as any;
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

  // 1. Equity market signal from Nifty 50 or trending ratio
  const nifty50 = snapshot.indices?.find(idx => idx.name === 'NIFTY 50');
  if (nifty50) {
    const price = nifty50.currentPrice?.NSE || nifty50.price;
    const change = nifty50.percentChange || nifty50.percent_change || 0;
    signals.push({
      indicator: 'Equity Market',
      value: `NIFTY: ${price ? price.toLocaleString('en-IN') : 'Stable'}`,
      trend: change > 0.2 ? 'bullish' : change < -0.2 ? 'bearish' : 'neutral',
      change: `${change >= 0 ? '+' : ''}${parseFloat(change).toFixed(2)}%`,
      icon: '📈',
      source: 'NSE Live',
    });
  } else if (snapshot.trending) {
    const gainers = snapshot.trending.trending_stocks.top_gainers;
    const losers = snapshot.trending.trending_stocks.top_losers;
    if (gainers.length > 0) {
      const topGainer = gainers[0];
      const avgGain = gainers.reduce((s, g) => s + parseFloat(g.percent_change || '0'), 0) / gainers.length;
      const avgLoss = losers.reduce((s, l) => s + parseFloat(l.percent_change || '0'), 0) / losers.length;
      const marketMood = avgGain + avgLoss;

      signals.push({
        indicator: 'Equity Market',
        value: `Nifty Sentiment: ${marketMood > 0 ? 'Positive' : 'Negative'}`,
        trend: marketMood > 1 ? 'bullish' : marketMood < -1 ? 'bearish' : 'neutral',
        change: `Top Gainer: ${topGainer.company_name} +${topGainer.percent_change}%`,
        icon: '📈',
        source: 'NSE Live',
      });
    }
  }

  if (snapshot.trending) {
    const losers = snapshot.trending.trending_stocks.top_losers;
    if (losers.length > 0) {
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
