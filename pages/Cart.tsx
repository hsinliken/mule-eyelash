import React from 'react';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, totalAmount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-50/30 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-4 text-brand-400">
           <Trash2 size={32} />
        </div>
        <h2 className="text-xl font-medium text-brand-900">購物車是空的</h2>
        <p className="text-brand-500 mt-2 text-sm mb-8">看起來您還沒選購任何美妝好物。</p>
        <button 
          onClick={() => navigate('/shop')}
          className="px-8 py-3 bg-brand-800 text-white rounded-xl font-medium shadow-lg shadow-brand-200"
        >
          去逛逛
        </button>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-brand-50/30 min-h-screen">
      <div className="bg-white p-6 sticky top-0 z-30 shadow-sm mb-4">
        <h1 className="text-xl font-light tracking-wide text-brand-900">購物車</h1>
        <p className="text-xs text-brand-400 mt-1">{items.length} 件商品</p>
      </div>

      <div className="px-4 space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-brand-100 flex gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
               <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
               <div>
                  <h3 className="font-medium text-brand-900 text-sm line-clamp-1">{item.name}</h3>
                  <p className="text-brand-600 font-semibold mt-1">${item.price}</p>
               </div>
               
               <div className="flex items-center justify-between mt-2">
                 <div className="flex items-center bg-brand-50 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-brand-600 hover:bg-white rounded-md transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-brand-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-brand-600 hover:bg-white rounded-md transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                 </div>
                 <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-brand-300 hover:text-red-400 p-2"
                 >
                    <Trash2 size={18} />
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-100 p-6 z-40 max-w-md mx-auto">
         <div className="flex justify-between items-center mb-4">
            <span className="text-brand-500">小計</span>
            <span className="text-xl font-bold text-brand-900">${totalAmount}</span>
         </div>
         <button 
           onClick={() => navigate('/checkout')}
           className="w-full bg-brand-800 text-white py-4 rounded-xl font-medium flex justify-center items-center gap-2 shadow-lg shadow-brand-200"
         >
           前往結帳
           <ArrowRight size={18} />
         </button>
      </div>
    </div>
  );
};

export default Cart;