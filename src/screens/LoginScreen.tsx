import React, { useState } from 'react';
import { ShieldCheck, Coins, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [mobile, setMobile] = useState('');
  const [mpin, setMpin] = useState('');
  const [step, setStep] = useState(1);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length === 10) setStep(2);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (mpin.length >= 4) onLogin();
  };

  return (
    <div className="flex-1 flex flex-col bg-navy min-h-screen relative overflow-hidden text-slate-50">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <header className="p-6 flex items-center gap-3 relative z-10 pt-12">
        <div className="relative flex items-center justify-center">
          <ShieldCheck className="w-10 h-10 text-gold" />
          <Coins className="w-4 h-4 text-white absolute bottom-0 right-0" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
            SecureWealth<span className="text-gold">Twin</span>
          </h1>
          <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Wealth Intelligence</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center px-6 relative z-10 pb-20 max-w-md mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-10">
            <h2 className="text-3xl font-semibold mb-2">Welcome Back</h2>
            <p className="text-slate-400 text-sm">Sign in to access your wealth twin and continue planning for your future.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
            {step === 1 ? (
              <form onSubmit={handleNext}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Mobile Number</label>
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-gold/50 transition-colors">
                      <span className="text-slate-400 mr-2">+91</span>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="bg-transparent border-none outline-none w-full text-white placeholder-slate-500 font-medium"
                        placeholder="00000 00000"
                        autoFocus
                      />
                    </div>
                    {/* Step progress */}
                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ backgroundColor: i < mobile.length ? '#c5a059' : 'rgba(255,255,255,0.1)' }}
                          className="flex-1 h-0.5 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={mobile.length !== 10}
                    className="w-full bg-gold hover:bg-yellow-500 text-navy font-semibold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <label className="block text-xs font-medium text-slate-400 flex justify-between">
                    <span>Enter MPIN</span>
                    <button type="button" onClick={() => { setStep(1); setMpin(''); }} className="text-gold hover:underline">
                      Change Mobile
                    </button>
                  </label>

                  {/* Visual MPIN dot indicators */}
                  <div className="flex justify-center gap-4 my-4">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <motion.div
                        key={i}
                        animate={
                          mpin.length > i
                            ? { scale: [1, 1.4, 1], backgroundColor: '#c5a059' }
                            : { scale: 1, backgroundColor: 'rgba(255,255,255,0.12)' }
                        }
                        transition={{ duration: 0.18 }}
                        className="w-4 h-4 rounded-full border-2 border-white/20"
                      />
                    ))}
                  </div>

                  {/* Real input (hidden, auto-focused) */}
                  <input
                    type="password"
                    inputMode="numeric"
                    id="mpin-field"
                    value={mpin}
                    onChange={(e) => setMpin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="sr-only"
                    autoFocus
                  />
                  <label
                    htmlFor="mpin-field"
                    className="block text-center text-[10px] text-slate-500 cursor-pointer hover:text-gold transition-colors"
                  >
                    Tap here then type your MPIN
                  </label>

                  <button
                    type="submit"
                    disabled={mpin.length < 4}
                    className="w-full bg-gold hover:bg-yellow-500 text-navy font-semibold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Secure Login <ShieldCheck className="w-4 h-4" />
                  </button>
                  <div className="text-center">
                    <button type="button" className="text-xs text-slate-400 hover:text-white transition-colors">Forgot MPIN?</button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Security layer strip */}
          <div className="mt-6 space-y-3">
            <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-safe" />
              Protected by Bank-grade 256-bit encryption
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '2-Factor Auth', icon: '🔐' },
                { label: 'Behavioral AI', icon: '🧠' },
                { label: 'RBI AA Standard', icon: '🏛️' },
              ].map(b => (
                <div key={b.label} className="bg-white/5 border border-white/10 rounded-xl p-2 text-center">
                  <p className="text-lg mb-0.5">{b.icon}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{b.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LoginScreen;
