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
const ProfileScreen: React.FC<{ profile: ProfileData; onUpdate: (field: keyof ProfileData, value: any) => void }> = ({ profile, onUpdate }) => {
  const [step, setStep] = useState(0);

  const update = (f: keyof ProfileData, v: any) => { onUpdate(f, v); };
  const next = () => setStep(s => Math.min(s + 1, ProfileSTEPS.length));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen text-slate-900 pb-32 font-sans overflow-y-auto no-scrollbar">
      
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-between items-center px-6 py-5 shrink-0">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.4em] text-brand-accent mb-1 leading-none">Security Provisioning</p>
          <h1 className="text-xl font-black tracking-tight text-brand-primary leading-none">Identity Architect</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400"><User className="w-5 h-5" /></div>
      </header>

      <div className="px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
          
          {step < ProfileSTEPS.length && (
            <nav className="relative flex justify-between items-center px-4 max-w-xl mx-auto py-4">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0 mx-10" />
              <motion.div 
                className="absolute top-1/2 left-0 h-0.5 bg-brand-accent -translate-y-1/2 z-0 mx-10 origin-left"
                initial={{ width: 0 }}
                animate={{ width: `${(step / (ProfileSTEPS.length - 1)) * 100}%` }}
                transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
              />
              
              {ProfileSTEPS.map((s, i) => {
                const active = i === step;
                const done = i < step;
                return (
                  <div key={s.id} className="relative z-10 flex flex-col items-center">
                    <motion.div
                      animate={{ 
                        scale: active ? 1.25 : 1,
                        backgroundColor: done ? '#10B981' : active ? '#C5A059' : '#FFFFFF',
                        borderColor: done ? '#10B981' : active ? '#C5A059' : '#E2E8F0',
                        color: done || active ? '#FFFFFF' : '#94A3B8'
                      }}
                      className={`w-9 h-9 rounded-[14px] border-2 flex items-center justify-center transition-all ${active ? 'shadow-premium shadow-brand-accent/30' : 'shadow-sm'}`}
                    >
                      {done ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                    </motion.div>
                    <motion.span 
                      animate={{ 
                        opacity: active ? 1 : 0.4,
                        y: active ? 8 : 4
                      }}
                      className={`absolute top-full text-[7px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${active ? 'text-brand-primary' : 'text-slate-400'}`}
                    >
                      {s.label.split(' ')[0]}
                    </motion.span>
                  </div>
                )
              })}
            </nav>
          )}

          <div className="bg-white border border-slate-100 rounded-[48px] p-8 md:p-14 relative overflow-hidden shadow-premium">
             <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none" />
             
             {step < ProfileSTEPS.length ? (
               <div className="space-y-10 relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                     <div className="space-y-3">
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-brand-accent uppercase tracking-[.4em] bg-brand-accent/10 px-3 py-1 rounded-full border border-brand-accent/10">Step {step + 1} of {ProfileSTEPS.length}</span>
                           <div className="w-1 h-1 rounded-full bg-slate-300" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{Math.round(((step + 1) / ProfileSTEPS.length) * 100)}% Integrated</span>
                        </div>
                        <h2 className="text-3xl font-black text-brand-primary tracking-tighter uppercase">{ProfileSTEPS[step].label}</h2>
                     </div>
                     <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-brand-accent shadow-premium relative overflow-hidden group/icon shrink-0">
                        <div className="absolute inset-0 bg-brand-accent opacity-0 group-hover/icon:opacity-5 transition-opacity" />
                        {React.createElement(ProfileSTEPS[step].icon, { className: 'w-8 h-8 relative z-10' })}
                     </div>
                  </div>

                  <AnimatePresence mode="wait">
                     <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                        {step === 0 && <Step1BasicInfo data={profile} update={update} />}
                        {step === 1 && <Step2Income data={profile} update={update} />}
                        {step === 2 && <Step3Expenses data={profile} update={update} />}
                        {step === 3 && <Step4Assets data={profile} update={update} />}
                        {step === 4 && <Step5Goals data={profile} update={update} />}
                        {step === 5 && <Step6RiskQuiz data={profile} update={update} />}
                     </motion.div>
                  </AnimatePresence>

                  <div className="flex gap-4 pt-12 mt-12 border-t border-slate-50 relative z-10">
                     {step > 0 && (
                       <button onClick={prev} className="px-8 py-4.5 rounded-2xl border border-slate-200 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95">
                         <ChevronLeft className="w-4 h-4" /> Back
                       </button>
                     )}
                     <button onClick={next} className="flex-1 bg-brand-primary hover:bg-brand-accent text-white font-black py-4.5 rounded-2xl uppercase tracking-[.3em] text-[10px] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 leading-none group">
                        {step === ProfileSTEPS.length - 1 ? 'Generate Digital Twin' : 'Continue Integration'} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </button>
                  </div>
               </div>
             ) : (
               <div className="text-center py-10 space-y-12 relative z-10">
                  <div className="space-y-4">
                     <div className="w-24 h-24 bg-brand-accent/10 border border-brand-accent/20 rounded-[32px] mx-auto flex items-center justify-center text-brand-accent relative">
                        <Sparkles className="w-12 h-12" />
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-2 -right-2 bg-brand-success text-white p-2 rounded-full shadow-lg"><CheckCircle2 className="w-4 h-4" /></motion.div>
                     </div>
                     <h2 className="text-3xl font-black text-brand-primary tracking-tighter">Strategic Twin Synthesized</h2>
                     <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto">Your identity has been securely mapped to the SecureWealth alpha engine.</p>
                  </div>
                  
                  <div className="grid gap-4 max-w-sm mx-auto">
                     {[
                        { label: 'Calculated Risk', val: profile.riskPreference === 'high' ? 'Aggressive' : 'Conservative' },
                        { label: 'Linked Objectives', val: `${profile.goals.length} Strategic Nodes` },
                        { label: 'Security Grade', val: 'Bank-Grade RSA-256' }
                     ].map(item => (
                        <div key={item.label} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                           <span className="text-slate-400">{item.label}</span>
                           <span className="text-brand-primary">{item.val}</span>
                        </div>
                     ))}
                  </div>

                  <button 
                     onClick={() => {}} 
                     className="w-full bg-brand-primary hover:bg-brand-accent text-white font-black py-5 rounded-2xl uppercase tracking-[.4em] text-[10px] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                  >
                     <Shield className="w-4 h-4" /> Deploy to Digital Twin
                  </button>
               </div>
             )}
          </div>

          <div className="flex items-start gap-3 opacity-60 max-w-md mx-auto px-4">
            <AlertTriangle className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed text-center">
               All data encrypted via 256-bit AES protocol. We strictly adhere to PCI-DSS & RBI Account Aggregator guidelines for sovereign privacy.
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default ProfileScreen;
