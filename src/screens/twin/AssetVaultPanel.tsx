import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, X, Trash2, Clock, Shield } from 'lucide-react';
import { MOCK_PHYSICAL_ASSETS } from '../../data/wealthTwinData';
import { containerVars, itemVars, fmt, fmtShort } from './TwinUtils';
import type { PhysicalAsset } from '../../data/wealthTwinData';

const liquidityColor: Record<string, string> = {
  'Very Low': '#6b7a8c',
  'Low':      '#536375',
  'Medium':   '#3e4f61',
  'High':     '#1a5ce5',
  'Very High':'#103bb3',
};

const categoryIcon: Record<string, string> = {
  property: '🏠', land: '🌾', gold: '💛', vehicle: '🚗', business: '⚙️', collectible: '⌚',
};

const AssetDetailSheet: React.FC<{ asset: PhysicalAsset; onClose: () => void; onDelete: (id: string) => void }> = ({ asset, onClose, onDelete }) => {
  const gain = asset.currentValue - asset.purchaseValue;
  const gainPct = ((gain / asset.purchaseValue) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-md z-[150] flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full bg-[#fcfbf9] rounded-t-[40px] p-8 pb-12 space-y-6 border-t border-[#e6e4d9] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl border border-slate-100 grayscale">
              {categoryIcon[asset.category] || '📦'}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 leading-tight">{asset.name}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 capitalize">{asset.category} • {asset.ownershipType}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (confirm('Are you sure you want to de-register this asset? This action is permanent.')) {
                onDelete(asset.id);
                onClose();
              }
            }}
            className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Current Valuation</p>
            <p className="text-xl font-black text-slate-950">₹{fmtShort(asset.currentValue)}</p>
          </div>
          <div className="bg-slate-950 rounded-2xl p-4">
            <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Unrealized Gain</p>
            <p className="text-xl font-black text-white">
              {gain >= 0 ? '+' : ''}₹{fmtShort(Math.abs(gain))}
              <span className="text-[10px] text-slate-400 font-bold ml-1.5">{gainPct}%</span>
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Purchase Basis', val: `₹${fmtShort(asset.purchaseValue)}` },
            { label: 'Growth Velocity', val: `${asset.appreciationRate > 0 ? '+' : ''}${asset.appreciationRate}% MoM` },
            { label: 'Liquidity Matrix', val: `${asset.resaleConfidence}% Score` },
            { label: 'Registry ID', val: asset.riskDependency },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-slate-50">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.label}</span>
              <span className="text-xs font-black text-slate-900">{row.val}</span>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="w-full bg-[#1b3a57] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg">
          Close Registry
        </button>
      </motion.div>
    </motion.div>
  );
};

const RegisterAssetSheet: React.FC<{ onAdd: (asset: any) => void; onClose: () => void }> = ({ onAdd, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [valuation, setValuation] = useState('5000000');
  const [category, setCategory] = useState<any>(null);

  const formatIndianNumber = (num: string) => {
    const value = num.replace(/,/g, '');
    if (isNaN(Number(value)) || value === '') return num;
    return Number(value).toLocaleString('en-IN');
  };

  const handleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      const newAsset = {
        id: `p${Date.now()}`,
        name: `Registered ${category.name} Node`,
        category: category.name.toLowerCase() as any,
        icon: category.icon,
        currentValue: Number(valuation),
        purchaseValue: Number(valuation) * 0.9,
        appreciationRate: 7.5,
        liquidityScore: 'Medium' as any,
        ownershipType: 'Sole Owner' as any,
        resaleConfidence: 85,
        riskDependency: 'Low' as any,
      };
      onAdd(newAsset);
      setLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-md z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-[430px] bg-[#fcfbf9] rounded-t-[40px] sm:rounded-[48px] p-8 space-y-6 relative border border-[#e6e4d9] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-[#e6e4d9] rounded-full mx-auto sm:hidden mb-2" />
        
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-[#1b3a57] tracking-tight uppercase">Asset Registry</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[.2em]">Institutional Wealth Tokenization</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white border border-[#e6e4d9] rounded-xl text-slate-400 hover:text-slate-900 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 1 ? (
          <div className="space-y-6 py-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-[#1b3a57] opacity-60">Select Asset Category</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Property', icon: '🏠' },
                { name: 'Gold', icon: '💛' },
                { name: 'Business', icon: '⚙️' },
                { name: 'Land', icon: '🌾' },
                { name: 'Vehicle', icon: '🚗' },
                { name: 'Collectibles', icon: '⌚' }
              ].map(cat => (
                <button 
                  key={cat.name}
                  onClick={() => { setCategory(cat); setStep(2); }}
                  className="bg-white border border-[#e6e4d9] p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all hover:border-[#1b3a57] hover:bg-slate-50 group"
                >
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{cat.icon}</span>
                  <span className="text-[10px] font-black uppercase text-[#1b3a57]">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 py-6">
            <div className="space-y-4">
              <div className="bg-white border border-[#e6e4d9] rounded-3xl p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block px-1">Asset Valuation (₹)</label>
                  <input 
                    type="text" 
                    value={formatIndianNumber(valuation)}
                    onChange={(e) => setValuation(e.target.value.replace(/,/g, ''))}
                    placeholder="₹50,0,000" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-lg font-black text-[#1b3a57] placeholder:text-slate-300 outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block px-1">Registry/ID Document</label>
                  <div className="w-full border-2 border-dashed border-slate-100 rounded-2xl p-6 flex flex-col items-center gap-2 text-slate-400 hover:text-[#1b3a57] hover:border-[#1b3a57] cursor-pointer transition-all">
                    <span className="text-[10px] font-black uppercase tracking-widest">Upload Sales Deed / Certificate</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-[#1b3a57] text-[#0cd89a] py-5 rounded-3xl font-black uppercase tracking-[.3em] text-[11px] flex items-center justify-center gap-3 relative overflow-hidden group shadow-xl"
            >
              <AnimatePresence>
                {loading && (
                  <motion.div 
                    initial={{ x: "-100%" }} animate={{ x: "100%" }} 
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 bg-white/10" 
                  />
                )}
              </AnimatePresence>
              {loading ? 'Tokenizing Asset...' : 'Deploy to Wealth Vault'}
            </button>
            <button onClick={() => setStep(1)} className="text-center w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
              Go back
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 opacity-40 py-2">
          <Shield className="w-3 h-3" />
          <span className="text-[8px] font-black uppercase tracking-[.4em]">ISO 27001 SECURED VAULT</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AssetVaultPanel: React.FC = () => {
  const [assets, setAssets] = useState<PhysicalAsset[]>(() => {
    const saved = localStorage.getItem('securewealth_assets');
    return saved ? JSON.parse(saved) : MOCK_PHYSICAL_ASSETS;
  });
  const [selected, setSelected] = useState<PhysicalAsset | null>(null);
  const [showAddAsset, setShowAddAsset] = useState(false);

  const addAsset = (newAsset: PhysicalAsset) => {
    const updated = [newAsset, ...assets];
    setAssets(updated);
    localStorage.setItem('securewealth_assets', JSON.stringify(updated));
  };

  const deleteAsset = (id: string) => {
    const updated = assets.filter(a => a.id !== id);
    setAssets(updated);
    localStorage.setItem('securewealth_assets', JSON.stringify(updated));
  };

  const totalValue = assets.reduce((s, a) => s + a.currentValue, 0);
  const totalCost = assets.reduce((s, a) => s + a.purchaseValue, 0);
  const totalLinkedDebt = assets.reduce((s, a) => s + (a.linkedLoan || 0), 0);
  const totalGain = totalValue - totalCost;

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">
      {/* ── Vault Summary ── */}
      <motion.div variants={itemVars}>
        <div className="bg-[#fcfbf9] rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 relative overflow-hidden border border-[#e6e4d9] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1b3a57] shadow-[0_0_8px_rgba(27,58,87,0.3)]" />
              <p className="text-[9px] font-black uppercase tracking-widest text-[#5c6065]">Secure Asset Registry • {assets.length} Nodes</p>
            </div>
            
            <p className="text-[#5c6065] text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Consolidated Vault Valuation</p>
            <p className="text-5xl font-black text-[#1b3a57] tracking-tighter leading-none mb-6">
              <span className="text-[#8a9bb0] text-3xl font-medium pr-1">₹</span>{fmt(totalValue)}
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Purchase', val: `₹${fmtShort(totalCost)}`, color: 'text-[#5c6065]' },
                { label: 'Wealth Gain', val: `+₹${fmtShort(totalGain)}`, color: 'text-[#1b3a57]' },
                { label: 'Asset Debt', val: `-₹${fmtShort(totalLinkedDebt)}`, color: 'text-[#8a9bb0]' },
              ].map(item => (
                <div key={item.label} className="bg-white/70 border border-[#e6e4d9] rounded-2xl p-3 text-center shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all hover:bg-white/90">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-[#5c6065] mb-1">{item.label}</p>
                  <p className={`text-sm font-black ${item.color}`}>{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Asset Inventory ── */}
      <motion.div variants={itemVars}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-[46px] h-[46px] rounded-[18px] bg-[#1b3a57] border border-[#2b4c6a] flex items-center justify-center shrink-0 shadow-lg">
            <Target className="w-5 h-5 text-[#0cd89a]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="font-black text-[#1b3a57] text-[17px] tracking-tight uppercase leading-none mt-0.5">Asset Inventory</h2>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#1f8c5c] leading-none ml-2">
                {assets.length} Verified
              </span>
            </div>
            <p className="text-[#8a9bb0] text-[10px] font-black uppercase tracking-widest leading-none">Market-Linked Tangible Holdings</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 xl:gap-5">
          {assets.map((asset, i) => {
            const gain = asset.currentValue - asset.purchaseValue;
            const isPositive = gain >= 0;
            const equity = asset.currentValue - (asset.linkedLoan || 0);

            return (
              <motion.div
                key={asset.id}
                variants={itemVars}
                whileHover={{ y: -1 }}
                onClick={() => setSelected(asset)}
                className="bg-[#fdfcf9] border border-[#e6e4d9] rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 flex items-stretch gap-4 sm:gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] cursor-pointer"
              >
                <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] bg-[#f5f4f0] border border-[#ebeaeb] shadow-sm rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 grayscale opacity-75">
                  {categoryIcon[asset.category] || '📦'}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-[14px] sm:text-[15px] font-black text-[#1b3a57] leading-tight truncate">{asset.name}</p>
                      <p className="text-[9px] sm:text-[10px] font-black text-[#8a9bb0] mt-1.5 uppercase tracking-widest leading-none">{asset.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[14px] sm:text-[15px] font-black text-[#1b3a57] leading-tight">₹{fmtShort(asset.currentValue)}</p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-[#8a9bb0] mt-1.5 leading-none">
                        {isPositive ? '+' : ''}{asset.appreciationRate}% Growth
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end gap-5">
                    <div className="flex-1">
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[9px] font-black uppercase text-[#8a9bb0] tracking-widest leading-none">Verified Equity</span>
                        <span className="text-[10px] sm:text-[11px] font-black text-[#1b3a57] leading-none">₹{fmtShort(equity)}</span>
                      </div>
                      <div className="w-full h-[6px] sm:h-2 bg-[#e3e6ea] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, Math.max(0, (equity / asset.currentValue) * 100))}%` }}
                          transition={{ duration: 1.1, delay: i * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
                          className="h-full bg-[#132c3f] rounded-full"
                        />
                      </div>
                    </div>
                    <div className="text-left shrink-0 min-w-[50px] sm:min-w-[60px]">
                      <p className="text-[9px] font-black uppercase text-[#8a9bb0] tracking-widest leading-none mb-1.5">Liquidity</p>
                      <p className="text-[10px] font-black leading-none" style={{ color: liquidityColor[asset.liquidityScore] }}>
                        {asset.liquidityScore}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Add Asset Prompt ── */}
      <motion.div variants={itemVars}>
        <button 
          onClick={() => setShowAddAsset(true)}
          className="w-full border-2 border-dashed border-[#1b3a57]/20 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-[#1b3a57] hover:border-[#1b3a57] hover:bg-slate-50 transition-all group shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#e6e4d9] flex items-center justify-center group-hover:bg-[#1b3a57] group-hover:text-[#0cd89a] transition-all shadow-sm">
            <Target className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[.3em] mt-1">Register New Asset</span>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Connect Real Estate, Gold, or Tangibles</p>
        </button>
      </motion.div>

      <AnimatePresence>
        {selected && <AssetDetailSheet asset={selected} onClose={() => setSelected(null)} onDelete={deleteAsset} />}
      </AnimatePresence>

      <AnimatePresence>
        {showAddAsset && <RegisterAssetSheet onAdd={addAsset} onClose={() => setShowAddAsset(false)} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default AssetVaultPanel;
