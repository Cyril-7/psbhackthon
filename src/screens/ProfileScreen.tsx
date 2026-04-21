import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProfileData } from '../types/profile';
import { STEPS as ProfileSTEPS } from '../types/profile';
import {
  User,
  Briefcase,
  MapPin,
  TrendingUp,
  Shield,
  Target,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Home,
  Car,
  AlertTriangle,
  Plus,
  Trash2,
  Sparkles,
  Plane,
  Heart,
  TrendingDown,
  Info,
  X,
} from 'lucide-react';

// ─── Sub-components ───────────────────────────────────────────────────────────
const InputField = ({ label, value, onChange, type = 'text', placeholder = '', icon: Icon, prefix }: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 ml-1">{label}</label>
    <div className="relative flex items-center">
      {Icon && <div className="absolute left-4 text-brand-accent pointer-events-none"><Icon className="w-4 h-4" /></div>}
      {prefix && <span className="absolute left-4 text-brand-accent font-black text-sm pointer-events-none">{prefix}</span>}
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 text-brand-primary font-bold text-sm placeholder-slate-300 focus:outline-none focus:border-brand-accent focus:bg-white focus:ring-4 focus:ring-brand-accent/5 transition-all shadow-inner ${Icon ? 'pl-11 pr-4' : prefix ? 'pl-8 pr-4' : 'px-4'}`}
      />
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, options, icon: Icon }: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 ml-1">{label}</label>
    <div className="relative flex items-center">
      {Icon && <div className="absolute left-4 text-brand-accent z-10 pointer-events-none"><Icon className="w-4 h-4" /></div>}
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 text-brand-primary font-bold text-sm focus:outline-none focus:border-brand-accent focus:bg-white focus:ring-4 focus:ring-brand-accent/5 transition-all shadow-inner appearance-none ${Icon ? 'pl-11 pr-10' : 'px-4'}`}
      >
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronRight className="absolute right-4 text-slate-300 w-4 h-4 rotate-90 pointer-events-none" />
    </div>
  </div>
);

// ─── Step Forms ───────────────────────────────────────────────────────────────
const Step1BasicInfo = ({ data, update }: any) => (
  <div className="space-y-6 relative z-10">
    <InputField label="Full Name" value={data.fullName} onChange={(v:any) => update('fullName', v)} icon={User} placeholder="Your legal name" />
    <div className="grid grid-cols-2 gap-4">
      <InputField label="Age" value={data.age} onChange={(v:any) => update('age', v)} type="number" placeholder="34" />
      <InputField label="City" value={data.city} onChange={(v:any) => update('city', v)} icon={MapPin} placeholder="e.g. Bangalore" />
    </div>
    <SelectField label="Job Type" value={data.jobType} onChange={(v:any) => update('jobType', v)} options={['Salaried', 'Self-Employed', 'Business', 'Freelancer', 'Student', 'Retired']} icon={Briefcase} />
  </div>
);

const Step2Income = ({ data, update }: any) => (
  <div className="space-y-8 relative z-10">
    <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-2xl p-5 flex items-start gap-4">
      <Sparkles className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
      <p className="text-xs text-brand-accent font-bold leading-relaxed">Input your monthly post-tax earnings to architect your savings potential.</p>
    </div>
    <InputField label="Monthly Salary (Post-Tax)" value={data.monthlySalary} onChange={(v:any) => update('monthlySalary', v)} prefix="₹" type="number" placeholder="50000" />
    <InputField label="Side Income / ROI" value={data.sideIncome} onChange={(v:any) => update('sideIncome', v)} prefix="₹" type="number" placeholder="10000" />
    <div className="p-6 rounded-[32px] bg-brand-primary text-white flex justify-between items-center shadow-lg">
      <div className="space-y-1">
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Net Current Income</p>
        <p className="font-black text-2xl">₹{(Number(data.monthlySalary || 0) + Number(data.sideIncome || 0)).toLocaleString('en-IN')}</p>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10"><TrendingUp className="w-6 h-6 text-brand-accent" /></div>
    </div>
  </div>
);

const Step3Expenses = ({ data, update }: any) => {
  const [fetching, setFetching] = useState(false);
  const simulateAutoFetch = () => {
    setFetching(true);
    setTimeout(() => {
      update('expenseMode', 'auto');
      update('expenses', { dining: '12400', rent: '35000', shopping: '8500', travel: '4200' });
      setFetching(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 relative z-10">
      {!data.expenseMode ? (
        <div className="grid gap-5">
          <motion.button whileTap={{ scale: 0.98 }} onClick={simulateAutoFetch} disabled={fetching} className="relative overflow-hidden bg-brand-primary text-white rounded-[32px] p-8 text-left transition-all shadow-xl group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none transition-transform group-hover:scale-110"><Sparkles className="w-24 h-24" /></div>
            <div className="relative z-10 flex flex-col gap-4">
               <div>
                  <span className="text-brand-accent font-black text-[9px] uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-full border border-white/10">Recommended Integration</span>
                  <h3 className="font-black text-xl mt-3 tracking-tight">AI Auto-Fetch Analysis</h3>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">Securely authorize your banking feed to automatically categorize behavior.</p>
               </div>
               {fetching && <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }} className="h-1 bg-brand-accent rounded-full" />}
            </div>
          </motion.button>
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => update('expenseMode', 'manual')} className="bg-white border border-slate-200 rounded-[32px] p-8 text-left hover:shadow-premium transition-all">
            <h3 className="font-black text-lg text-brand-primary">Manual Entry Path</h3>
            <p className="text-slate-500 text-xs mt-1 font-medium">Define your core expenditure categories manually.</p>
          </motion.button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-black text-brand-primary uppercase tracking-widest text-xs">{data.expenseMode === 'auto' ? 'Automated Ledger' : 'Manual Ledger'}</h3>
            <button onClick={() => update('expenseMode', null)} className="text-brand-accent text-[10px] font-black uppercase tracking-widest hover:underline">Reset Mode</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Dining" value={data.expenses.dining} onChange={(v:any) => update('expenses', { ...data.expenses, dining: v })} prefix="₹" type="number" />
            <InputField label="Rent" value={data.expenses.rent} onChange={(v:any) => update('expenses', { ...data.expenses, rent: v })} prefix="₹" type="number" />
            <InputField label="Shopping" value={data.expenses.shopping} onChange={(v:any) => update('expenses', { ...data.expenses, shopping: v })} prefix="₹" type="number" />
            <InputField label="Travel" value={data.expenses.travel} onChange={(v:any) => update('expenses', { ...data.expenses, travel: v })} prefix="₹" type="number" />
          </div>
        </div>
      )}
    </div>
  );
};

const Step4Assets = ({ data, update }: any) => {
  const addAsset = () => update('assets', [...data.assets, { type: 'Bank Balance', value: '0' }]);
  const removeAsset = (i: number) => { const n = [...data.assets]; n.splice(i, 1); update('assets', n); };
  const updateAsset = (i: number, f: string, v: string) => { const n = [...data.assets]; (n[i] as any)[f] = v; update('assets', n); };

  return (
    <div className="space-y-6 relative z-10">
      {data.assets.map((asset:any, i:number) => (
        <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 relative group shadow-sm hover:shadow-premium transition-all">
          <button onClick={() => removeAsset(i)} className="absolute top-6 right-6 text-slate-300 hover:text-brand-danger transition-colors"><Trash2 className="w-4 h-4" /></button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Asset Type" value={asset.type} onChange={(v:any) => updateAsset(i, 'type', v)} options={['Bank Balance', 'Mutual Funds', 'Stocks', 'Gold', 'Property', 'PF/PPF', 'Other']} />
            <InputField label="Valuation" value={asset.value} onChange={(v:any) => updateAsset(i, 'value', v)} prefix="₹" type="number" />
          </div>
        </div>
      ))}
      <button onClick={addAsset} className="w-full border-2 border-dashed border-slate-200 rounded-3xl py-6 text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:border-brand-accent hover:text-brand-accent transition-all ring-offset-2 active:ring-2 ring-brand-accent/20">
        <Plus className="w-4 h-4" /> Add Asset Position
      </button>
    </div>
  );
};

const Step5Goals = ({ data, update }: any) => {
  const goalTypes = [{ label: 'Home', icon: Home }, { label: 'Travel', icon: Plane }, { label: 'Retirement', icon: Heart }, { label: 'Car', icon: Car }];
  const updateGoal = (i: number, f: string, v: string) => { const n = [...data.goals]; (n[i] as any)[f] = v; update('goals', n); };
  const toggleGoal = (type: string) => {
    const exists = data.goals.find((g:any) => g.type === type);
    if (exists) update('goals', data.goals.filter((g:any) => g.type !== type));
    else update('goals', [...data.goals, { type, target: '1000000', years: '5' }]);
  };

  return (
    <div className="space-y-8 relative z-10">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Architect Objectives</label>
        <div className="grid grid-cols-4 gap-3">
          {goalTypes.map((gt) => {
            const active = data.goals.some((g:any) => g.type === gt.label);
            return (
              <button key={gt.label} onClick={() => toggleGoal(gt.label)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${active ? 'border-brand-accent bg-brand-accent/5 text-brand-accent shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-300 hover:border-slate-200'}`}>
                <gt.icon className="w-6 h-6" />
                <span className="text-[8px] font-black uppercase tracking-tight">{gt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="space-y-4">
        {data.goals.map((goal:any, i:number) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[32px] p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-brand-accent"><Target className="w-6 h-6" /></div><h4 className="font-black text-brand-primary uppercase tracking-widest text-sm">{goal.type} Node</h4></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField label="Capital Target" value={goal.target} onChange={(v:any) => updateGoal(i, 'target', v)} prefix="₹" type="number" />
              <InputField label="Horizon (Years)" value={goal.years} onChange={(v:any) => updateGoal(i, 'years', v)} type="number" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Step6RiskQuiz = ({ data, update }: any) => (
  <div className="space-y-10 relative z-10">
    <div className="space-y-4">
      <label className="text-sm font-black text-brand-primary flex items-center gap-3 uppercase tracking-tight">Capital Strategy Preference</label>
      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'safe', label: 'Conservative', sub: 'Capital Stability', icon: Shield },
          { id: 'high', label: 'Aggressive', sub: 'Growth Pursuit', icon: TrendingUp }
        ].map(opt => (
          <button key={opt.id} onClick={() => update('riskPreference', opt.id as any)} className={`p-6 rounded-3xl border text-left transition-all ${data.riskPreference === opt.id ? 'border-brand-accent bg-brand-accent/5 shadow-premium' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
            <opt.icon className={`w-8 h-8 mb-4 ${data.riskPreference === opt.id ? 'text-brand-accent' : 'text-slate-200'}`} />
            <h4 className="font-black text-brand-primary text-base">{opt.label}</h4>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">{opt.sub}</p>
          </button>
        ))}
      </div>
    </div>
    <div className="space-y-4">
      <label className="text-sm font-black text-brand-primary flex items-center gap-3 uppercase tracking-tight">Market Latency Tolerance</label>
      <div className="grid gap-3">
        {[
          { id: 'sell', label: 'Immediate Exit', icon: TrendingDown },
          { id: 'hold', label: 'Retain Position', icon: Info },
          { id: 'buy', label: 'Aggressive Re-entry', icon: Plus }
        ].map(opt => (
          <button key={opt.id} onClick={() => update('marketDropReaction', opt.id as any)} className={`w-full p-5 rounded-2xl border flex items-center gap-5 transition-all ${data.marketDropReaction === opt.id ? 'border-brand-accent bg-brand-accent/5' : 'border-slate-50 bg-white'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${data.marketDropReaction === opt.id ? 'bg-brand-accent font-black text-white' : 'bg-slate-50 text-slate-300'}`}><opt.icon className="w-6 h-6" /></div>
            <p className="flex-1 font-black text-brand-primary uppercase tracking-widest text-xs text-left">{opt.label}</p>
            {data.marketDropReaction === opt.id && <CheckCircle2 className="w-5 h-5 text-brand-accent" />}
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
interface ProfileProps {
  profile: ProfileData;
  onUpdate: (field: keyof ProfileData, value: any) => void;
  onComplete?: () => void;
}

const ProfileScreen = ({ profile, onUpdate, onComplete }: ProfileProps) => {
  const [step, setStep] = useState(0);

  const update = (f: keyof ProfileData, v: any) => { onUpdate(f, v); };
  const next = () => setStep(s => Math.min(s + 1, ProfileSTEPS.length));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="flex-1 flex flex-col min-h-screen text-[#1b3a57] font-sans">
      {/* Header - Mobile Only */}
      <header className="md:hidden sticky top-0 z-50 bg-[#f5f4ef]/90 backdrop-blur-xl border-b border-[#e6e4d9] flex justify-between items-center px-6 py-5 shrink-0">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.4em] text-brand-accent mb-1 leading-none">Security Provisioning</p>
          <h1 className="text-xl font-black tracking-tight text-brand-primary leading-none">Identity Architect</h1>
        </div>
        {onComplete ? (
          <button onClick={onComplete} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400"><User className="w-5 h-5" /></div>
        )}
      </header>

      <div className="flex-1 flex items-center justify-center p-5 md:p-12 overflow-y-auto no-scrollbar">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl space-y-12">
          
          {/* Progress Navigator - Custom Premium Design */}
          {step < ProfileSTEPS.length && (
            <div className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[32px] p-8 shadow-sm">
              <div className="flex justify-between items-center relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 -z-0 mx-8" />
                <motion.div 
                  className="absolute top-1/2 left-0 h-0.5 bg-brand-accent -translate-y-1/2 z-0 mx-8 origin-left"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / (ProfileSTEPS.length - 1)) * 100}%` }}
                  transition={{ duration: 0.8, ease: "circOut" }}
                />
                
                {ProfileSTEPS.map((s, i) => {
                  const active = i === step;
                  const done = i < step;
                  return (
                    <div key={s.id} className="relative z-10 flex flex-col items-center">
                      <motion.div
                        whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                        animate={{ 
                          scale: active ? 1.25 : 1,
                          backgroundColor: done ? "#10B981" : active ? "#C5A059" : "#FFFFFF",
                          borderColor: done ? "#10B981" : active ? "#C5A059" : "#E2E8F0",
                          color: done || active ? "#FFFFFF" : "#CBD5E1"
                        }}
                        className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${active ? 'shadow-lg shadow-brand-accent/20' : ''}`}
                      >
                        {done ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                      </motion.div>
                      <span className={`absolute top-full mt-4 text-[8px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-colors ${active ? 'text-brand-primary' : 'text-slate-400'}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-100 rounded-[48px] p-10 md:p-16 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-accent/5 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />
              
              {step < ProfileSTEPS.length ? (
                <div className="space-y-12 relative z-10">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                      <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-brand-accent uppercase tracking-[.4em] bg-brand-accent/10 px-4 py-1.5 rounded-full border border-brand-accent/10">PHASE 0{step + 1}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{Math.round(((step + 1) / ProfileSTEPS.length) * 100)}% Synchronized</span>
                         </div>
                         <h2 className="text-4xl font-black text-brand-primary tracking-tight uppercase leading-none">{ProfileSTEPS[step].label}</h2>
                      </div>
                      <div className="w-20 h-20 bg-[#fdfcf9] border border-slate-100 rounded-3xl flex items-center justify-center text-brand-accent shadow-xl shrink-0 group hover:scale-105 transition-transform cursor-pointer">
                         {React.createElement(ProfileSTEPS[step].icon, { className: 'w-10 h-10' })}
                      </div>
                   </div>

                   <AnimatePresence mode="wait">
                      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-[300px]">
                         {step === 0 && <Step1BasicInfo data={profile} update={update} />}
                         {step === 1 && <Step2Income data={profile} update={update} />}
                         {step === 2 && <Step3Expenses data={profile} update={update} />}
                         {step === 3 && <Step4Assets data={profile} update={update} />}
                         {step === 4 && <Step5Goals data={profile} update={update} />}
                         {step === 5 && <Step6RiskQuiz data={profile} update={update} />}
                      </motion.div>
                   </AnimatePresence>

                   <div className="flex gap-6 pt-12 border-t border-slate-50 mt-12">
                      {step > 0 && (
                        <button onClick={prev} className="px-10 py-5 rounded-2xl border border-slate-200 text-slate-500 font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-[0.98]">
                          <ChevronLeft className="w-5 h-5" /> Previous Phase
                        </button>
                      )}
                      <button onClick={next} className="flex-1 bg-brand-primary hover:bg-slate-900 text-white font-black py-5 rounded-2xl uppercase tracking-[.4em] text-[11px] transition-all flex items-center justify-center gap-4 shadow-xl active:scale-[0.98] group">
                         {step === ProfileSTEPS.length - 1 ? 'Finalize Synthesis' : 'Proceed to Next Phase'} 
                         <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                   </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-14 relative z-10">
                   <div className="space-y-6">
                      <div className="w-28 h-28 bg-emerald-50 border border-emerald-100 rounded-[40px] mx-auto flex items-center justify-center text-emerald-500 relative shadow-inner">
                         <Sparkles className="w-14 h-14" />
                         <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-3 -right-3 bg-emerald-600 text-white p-2.5 rounded-full shadow-xl border-4 border-white"><CheckCircle2 className="w-5 h-5" /></motion.div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-4xl font-black text-brand-primary tracking-tight uppercase">Digital Persona Synthesized</h2>
                        <p className="text-base text-slate-500 font-medium max-w-md mx-auto">Your identity has been successfully mapped to the SecureWealth core engine.</p>
                      </div>
                   </div>
                   
                   <div className="grid gap-4 max-w-md mx-auto bg-slate-50/50 p-8 rounded-[32px] border border-slate-100">
                      {[
                         { label: 'Capital Strategy', val: profile.riskPreference === 'high' ? 'Aggressive Growth' : 'Capital Stability' },
                         { label: 'Strategic Objectives', val: `${profile.goals.length} Active Nodes` },
                         { label: 'Provisioning Grade', val: 'Institutional (256-bit)' }
                      ].map(item => (
                         <div key={item.label} className="flex justify-between items-center py-3 border-b border-slate-200/50 last:border-0">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{item.label}</span>
                            <span className="text-[11px] font-black text-brand-primary uppercase tracking-wider">{item.val}</span>
                         </div>
                      ))}
                   </div>

                   <button 
                      onClick={() => onComplete?.()} 
                      className="w-full max-w-md mx-auto bg-brand-primary hover:bg-slate-900 text-white font-black py-6 rounded-[24px] uppercase tracking-[.5em] text-[11px] transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-4"
                   >
                      <Shield className="w-5 h-5" /> Deploy Unified Twin
                   </button>
                </div>
              )}
          </div>

          <div className="flex items-start gap-4 opacity-70 max-w-lg mx-auto bg-[#fdfcf9] border border-[#e6e4d9] rounded-2xl p-6">
            <AlertTriangle className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.15em] leading-relaxed">
               All Provisioning data encrypted via military-grade AES-256. Fully compliant with RBI Account Aggregator & Personal Data Protection guidelines.
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default ProfileScreen;
