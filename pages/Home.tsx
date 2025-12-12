import React, { useState } from 'react';
import GridMenu from '../components/GridMenu';
import { usePromotions } from '../contexts/PromotionContext';
import { useShop } from '../contexts/ShopContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Home: React.FC = () => {
  const { promotions } = usePromotions();
  const { settings } = useShop();
  const activePromotions = promotions.filter(p => p.active);
  
  // State to control visibility of the GridMenu
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(true);

  return (
    <div className="pb-24">
      {/* Brand Header - Horizontal Layout (Left: Logo, Right: Name) */}
      <div className="bg-white/95 backdrop-blur-md px-6 py-4 sticky top-0 z-40 border-b border-brand-100/50 shadow-[0_2px_15px_-8px_rgba(0,0,0,0.05)] transition-all duration-300">
        <div className="flex flex-row items-center justify-center gap-3">
            {/* Logo Image - Smaller & Refined */}
            <div className="w-12 h-12 rounded-full bg-white p-0.5 shadow-sm border border-brand-100 overflow-hidden flex items-center justify-center shrink-0">
               {settings.logo ? (
                 <img src={settings.logo} alt={settings.name} className="w-full h-full object-contain" />
               ) : (
                 <span className="text-lg font-serif text-brand-300">M</span>
               )}
            </div>
            
            {/* Shop Name Text - Left Aligned relative to Logo */}
            <div className="flex flex-col items-start justify-center">
              <h1 className="text-lg font-normal tracking-[0.15em] text-brand-900 uppercase leading-none">{settings.name}</h1>
              {settings.subtitle && (
                <p className="text-[10px] text-brand-500 tracking-[0.3em] mt-1 uppercase">
                  {settings.subtitle}
                </p>
              )}
            </div>
        </div>
      </div>

      {/* Hero / Promo Banner */}
      {activePromotions.length > 0 ? (
        activePromotions.map(promo => (
          <div key={promo.id} className="p-4 pb-0 mt-2">
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg bg-brand-200 group">
                <img 
                  src={promo.image} 
                  alt={promo.title} 
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/800x450?text=Promotion')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                    <span className="text-brand-100 text-xs tracking-wider uppercase mb-1">{promo.label}</span>
                    <h2 className="text-white text-xl font-medium tracking-wide">{promo.title}</h2>
                    <p className="text-white/80 text-sm mt-1">{promo.description}</p>
                </div>
            </div>
          </div>
        ))
      ) : (
        /* Fallback if no promotions are active */
        <div className="p-4 pb-0 mt-2">
          <div className="w-full aspect-[16/9] rounded-2xl bg-brand-50 flex items-center justify-center border border-brand-100">
             <p className="text-brand-300 text-sm tracking-widest">MULE EYELASH</p>
          </div>
        </div>
      )}

      {/* Quick Actions / Grid Menu (Collapsible) */}
      <div className="px-4 mt-6">
        <button 
          onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
          className="w-full flex justify-between items-center mb-3 px-1 focus:outline-none group"
        >
          <h3 className="text-brand-800 text-sm font-medium flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-500 rounded-full"></span>
            快速選單
          </h3>
          <div className="p-1 rounded-full text-brand-400 group-hover:bg-brand-50 transition-colors">
            {isQuickMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>
        
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isQuickMenuOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
           <GridMenu />
        </div>
      </div>

      {/* Featured Review or Highlight */}
      <div className="px-4 mt-8">
        <div className="bg-brand-50 rounded-xl p-6 border border-brand-100">
            <div className="flex items-center gap-3 mb-3">
                <img src="https://picsum.photos/id/64/100/100" className="w-10 h-10 rounded-full object-cover border border-white" alt="Stylist" />
                <div>
                    <p className="text-sm font-semibold text-brand-800">美睫師推薦</p>
                    <p className="text-xs text-brand-500">Luna 強力推薦</p>
                </div>
            </div>
            <p className="text-brand-700 text-sm leading-relaxed italic">
                「針對冬季乾燥氣候，推薦角蛋白翹睫術，讓您的睫毛在乾燥天氣下依然保持健康捲翹，展現自然神采。」
            </p>
        </div>
      </div>
    </div>
  );
};

export default Home;