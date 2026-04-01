import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Send, Sparkles, Loader2, Zap, TrendingUp, Shield, Target as TargetIcon, HelpCircle,
} from 'lucide-react';
import { getWealthTwinChatResponse } from '../../services/gemini';
import { NET_WORTH_METRICS, MOCK_RISK_ALERTS, TWIN_OVERVIEW } from '../../data/wealthTwinData';
import type { ProfileData } from '../../types/profile';
import { containerVars, itemVars, fmtShort } from './TwinUtils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  { icon: <TrendingUp className="w-3.5 h-3.5" />, label: 'Analyze my net worth', prompt: 'Analyze my current net worth of ₹1.22Cr and suggest the best strategy to reach ₹2Cr.' },
  { icon: <Shield className="w-3.5 h-3.5" />, label: 'Review my risks', prompt: 'What are the top 3 risks in my portfolio and what should I do about each one?' },
  { icon: <TargetIcon className="w-3.5 h-3.5" />, label: 'Goal acceleration', prompt: 'How can I accelerate my home purchase goal? I want to buy in Bangalore by 2030.' },
  { icon: <Sparkles className="w-3.5 h-3.5" />, label: 'Tax optimization', prompt: 'What tax-saving moves should I make before March 31? I have ELSS, PPF, and NPS available.' },
  { icon: <Zap className="w-3.5 h-3.5" />, label: 'Idle cash strategy', prompt: 'I have ₹3L sitting idle in savings accounts. What liquid fund or short-term options do you recommend?' },
  { icon: <HelpCircle className="w-3.5 h-3.5" />, label: 'SIP review', prompt: 'Review my current SIP of ₹15K/month and tell me if I should increase it to reach my retirement goal faster.' },
];

interface Props {
  profile: ProfileData;
}

const NeuralChatPanel: React.FC<Props> = ({ profile }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalIncome = Number(profile.monthlySalary) + Number(profile.sideIncome);
  const totalExpenses = Object.values(profile.expenses).reduce((a, b) => Number(a) + Number(b), 0);
  const riskAlerts = MOCK_RISK_ALERTS.map(a => a.title);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello ${profile.fullName}! 👋 I'm your AI Unified Wealth Twin — your personal financial consciousness.\n\nI've analyzed your complete wealth profile across ${TWIN_OVERVIEW.institutionsLinked} institutions with a net worth of ₹${fmtShort(NET_WORTH_METRICS.total)}.\n\nHow can I help optimize your wealth today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;

    const userMsg: Message = { role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await getWealthTwinChatResponse(
      msg, profile, NET_WORTH_METRICS.total, totalIncome, totalExpenses, riskAlerts
    );

    const assistantMsg: Message = {
      role: 'assistant',
      content: response || "I'm experiencing a neural sync interruption. Please try again in a moment.",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
    inputRef.current?.focus();
  };

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="flex flex-col h-full">

      {/* ── Twin Status Bar ── */}
      <motion.div variants={itemVars} className="shrink-0 mb-4 px-1">
        <div className="bg-[#fcfbf9] border border-[#e6e4d9] rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f5f4f0] border border-[#e6e4d9] rounded-xl flex items-center justify-center shadow-sm">
              <Brain className="w-5 h-5 text-[#1f8c5c]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#1f8c5c] uppercase tracking-widest leading-tight">Neural Link Active</p>
              <p className="text-[11px] text-[#5c6065] font-medium">Gemini 2.0 Flash • {TWIN_OVERVIEW.dataPoints} data points synced</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-[#d2efe2] border border-[#bce3d1] px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1f8c5c] animate-pulse" />
            <span className="text-[9px] font-black text-[#1f8c5c] uppercase tracking-wider">Live Sync</span>
          </div>
        </div>
      </motion.div>

      {/* ── Chat Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 no-scrollbar min-h-0">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] relative group shadow-sm ${
              msg.role === 'user'
                ? 'bg-[#1b3a57] text-white rounded-2xl rounded-tr-sm'
                : 'bg-[#fdfcf9] border border-[#e6e4d9] text-[#1b3a57] rounded-2xl rounded-tl-sm'
            }`}>
              {msg.role === 'assistant' && (
                <div className="absolute -left-2 -top-2">
                  <div className="w-6 h-6 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center">
                    <Brain className="w-3 h-3 text-emerald-500" />
                  </div>
                </div>
              )}
              <div className="px-5 py-4">
                <p className="text-sm font-medium leading-relaxed whitespace-pre-line">{msg.content}</p>
                <p className={`text-[9px] font-bold mt-2 ${msg.role === 'user' ? 'text-slate-500' : 'text-slate-300'}`}>
                  {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
              <div className="flex items-center gap-2 text-[#1f8c5c]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-black uppercase tracking-widest opacity-70">Neural Fusion in progress...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Quick Prompts ── */}
      {messages.length <= 2 && (
        <motion.div variants={itemVars} className="shrink-0 mb-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp.prompt)}
                className="flex items-center gap-1.5 bg-white border border-slate-100 hover:border-emerald-300 hover:shadow-sm px-3 py-2 rounded-xl text-[10px] font-bold text-slate-600 transition-all"
              >
                <span className="text-emerald-500">{qp.icon}</span>
                {qp.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Input Bar ── */}
      <motion.div variants={itemVars} className="shrink-0 mt-auto pt-4 bg-[#f5f4ef]">
        <div className="relative group">
          <input
            ref={inputRef}
            type="text" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Interrogate your wealth twin..."
            className="w-full bg-[#fdfcf9] border border-[#e6e4d9] rounded-2xl py-4.5 pl-6 pr-16 text-sm font-medium placeholder-[#8a9bb0] focus:border-[#1f8c5c] focus:ring-4 focus:ring-[#1f8c5c]/5 outline-none transition-all shadow-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#1b3a57] hover:bg-[#1f8c5c] text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg hover:shadow-[#1f8c5c]/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-3 opacity-60">
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
          <p className="text-[9px] font-black uppercase tracking-widest text-[#8a9bb0]">Institutional Grade Cryptographic Feedback</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NeuralChatPanel;
