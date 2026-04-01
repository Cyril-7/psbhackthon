import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCtURgQF6OjmH6q6PpN3G6zQwtZF41m3yQ";
const genAI = new GoogleGenerativeAI(API_KEY);

// Core helper: generate content from a prompt
export const getGeminiResponse = async (prompt: string): Promise<string | null> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return null;
  }
};

// Helper: parse JSON from Gemini response (handles markdown wrapping)
const parseJSON = <T>(text: string): T | null => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]) as T;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
};

// ─── LAYER 4: Behavioral Psychometric Analysis ────────────────────────────────
export const analyzeFinancialTwin = async (profile: any) => {
  const prompt = `
    As an elite AI Private Banker for the "AI Unified Wealth Twin" platform, perform a deep psychometric and financial analysis.
    
    User Profile:
    - Full Name: ${profile.fullName}
    - Age: ${profile.age}
    - Occupation: ${profile.jobType}
    - City: ${profile.city}
    - Monthly Gross Income: ₹${Number(profile.monthlySalary) + Number(profile.sideIncome)}
    - Monthly Expenses: ₹${Object.values(profile.expenses).reduce((a: any, b: any) => Number(a) + Number(b), 0)}
    - Risk Preference: ${profile.riskPreference}
    - Market Drop Reaction: ${profile.marketDropReaction}

    Provide a JSON response with:
    {
      "behavioralSummary": "3-sentence deep psychometric analysis of this user's financial personality",
      "wealthPersona": "One-word psychographic label like 'The Systematic Builder'",
      "interventions": [
        { "id": "1", "action": "...", "reason": "...", "impact": "High", "icon": "💡", "impactPositive": true },
        { "id": "2", ... },
        { "id": "3", ... }
      ],
      "riskAssessment": "One paragraph risk analysis",
      "topOpportunity": "Single most impactful financial move for this user right now"
    }
  `;
  const text = await getGeminiResponse(prompt);
  if (!text) return null;
  return parseJSON(text);
};

// ─── LAYER 4: Interactive Twin Chat with full wealth context ──────────────────
export const getWealthTwinChatResponse = async (
  userMessage: string,
  profile: any,
  netWorth: number,
  monthlyIncome: number,
  monthlyExpenses: number,
  riskAlerts: string[],
): Promise<string | null> => {
  const prompt = `
    You are the "AI Unified Wealth Twin" — a hyper-personalized AI private banker and financial consciousness for ${profile.fullName}.
    
    USER'S COMPLETE FINANCIAL SNAPSHOT:
    - Net Worth: ₹${(netWorth / 100000).toFixed(1)}L
    - Monthly Income: ₹${(monthlyIncome / 1000).toFixed(0)}K
    - Monthly Expenses: ₹${(monthlyExpenses / 1000).toFixed(0)}K
    - Monthly Surplus: ₹${((monthlyIncome - monthlyExpenses) / 1000).toFixed(0)}K
    - Occupation: ${profile.jobType}, ${profile.city}
    - Risk Profile: ${profile.riskPreference === 'high' ? 'Growth Aggressive' : 'Conservative Shield'}
    - Active Risk Alerts: ${riskAlerts.join(', ')}
    
    INSTRUCTIONS:
    - Act as a brilliant, empathetic Indian private banker who knows the user deeply
    - Be concise (under 120 words), specific with INR numbers, and actionable
    - Reference the user's actual financial data when relevant
    - Use Indian financial context (RBI, SEBI, AA framework, SIP, PPF, EPF, NPS)
    - Occasionally use ✅ or 📊 emojis for premium feel
    
    USER ASKED: "${userMessage}"
  `;
  return getGeminiResponse(prompt);
};

// ─── LAYER 5: Goal AI Analysis ────────────────────────────────────────────────
export const analyzeGoalFeasibility = async (
  goalName: string,
  targetAmount: number,
  currentProgress: number,
  monthlySurplus: number,
  linkedAssets: string[]
): Promise<string | null> => {
  const prompt = `
    As an AI Wealth Strategist, analyze this financial goal and provide a concise 2-sentence feasibility assessment.
    
    Goal: ${goalName}
    Target: ₹${(targetAmount / 100000).toFixed(1)}L
    Current Progress: ₹${(currentProgress / 100000).toFixed(1)}L (${Math.round((currentProgress / targetAmount) * 100)}%)
    Monthly Surplus Available: ₹${(monthlySurplus / 1000).toFixed(0)}K
    Linked Assets: ${linkedAssets.join(', ')}
    
    Provide ONE powerful, specific insight about this goal's feasibility and the #1 action to accelerate it.
    Keep it under 60 words. Write in second person ("Your..."). Be specific with numbers.
  `;
  return getGeminiResponse(prompt);
};

// ─── LAYER 6: Risk Intelligence Narrative ────────────────────────────────────
export const generateRiskNarrative = async (
  riskAlerts: { title: string; severity: string; affectedAmount?: number }[]
): Promise<string | null> => {
  const alertSummary = riskAlerts
    .map(a => `${a.severity.toUpperCase()}: ${a.title}${a.affectedAmount ? ` (₹${(a.affectedAmount / 100000).toFixed(1)}L affected)` : ''}`)
    .join('\n');

  const prompt = `
    As a Chief Risk Officer AI for an Indian wealth management platform, analyze these portfolio risks:
    
    ${alertSummary}
    
    Write a 2-sentence executive risk summary that:
    1. Identifies the single most dangerous risk
    2. Provides the one immediate action to take
    
    Be specific with numbers. Write in second person. Max 80 words.
  `;
  return getGeminiResponse(prompt);
};

// ─── LAYER 7: Fraud Detection Analysis ───────────────────────────────────────
export const analyzeFraudRisk = async (
  transactionType: string,
  amount: number,
  riskFactors: string[],
  userBehaviorNorm: string
): Promise<{ recommendation: string; riskScore: number } | null> => {
  const prompt = `
    As an AI Fraud Detection Engine for Indian banking, evaluate this transaction:
    
    Transaction: ${transactionType}
    Amount: ₹${(amount / 1000).toFixed(0)}K
    Risk Factors Detected: ${riskFactors.join(', ')}
    User's Normal Pattern: ${userBehaviorNorm}
    
    Respond with JSON only:
    {
      "recommendation": "One sentence on whether to allow/warn/block this transaction and why",
      "riskScore": 0-100
    }
  `;
  const text = await getGeminiResponse(prompt);
  if (!text) return null;
  return parseJSON(text);
};

// ─── LAYER 3: Net Worth AI Commentary ─────────────────────────────────────────
export const generateNetWorthInsight = async (
  currentNetWorth: number,
  monthlyGrowth: number,
  cagr: number,
  topRisk: string
): Promise<string | null> => {
  const prompt = `
    Generate a 2-sentence premium wealth insight for an Indian user:
    - Current Net Worth: ₹${(currentNetWorth / 10000000).toFixed(2)} Cr
    - Monthly Growth: ${monthlyGrowth}%
    - Annual CAGR: ${cagr}%
    - Top Risk: ${topRisk}
    
    Write like an elite private banker. Reference specific numbers. Max 60 words. Be motivating but honest.
  `;
  return getGeminiResponse(prompt);
};
