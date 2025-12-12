import React from 'react';
import { ShoppingCart, Plus, Check } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Shop: React.FC = () => {
  const { products } = useProducts();
  const { addToCart, totalItems } = useCart();
  const navigate = useNavigate();
  const [addedId, setAddedId] = React.useState<string | null>(null);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1000);
  };

  return (
    <div className="pb-24 bg-brand-50/30 min-h-screen">
      <div className="bg-white p-6 sticky top-0 z-30 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-light tracking-wide text-brand-900">線上商城</h1>
        <button 
          onClick={() => navigate('/cart')}
          className="relative p-2 bg-brand-50 rounded-full text-brand-800 hover:bg-brand-100 transition-colors"
        >
          <ShoppingCart size={20} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-brand-100 group flex flex-col h-full">
            <div className="aspect-square overflow-hidden relative bg-gray-100">
               <img 
                 src={product.image} 
                 alt={product.name} 
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
               />
               {!product.inStock && (
                 <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">補貨中</span>
                 </div>
               )}
            </div>
            <div className="p-3 flex flex-col flex-1">
               <h3 className="text-sm font-medium text-brand-900 line-clamp-1">{product.name}</h3>
               <p className="text-xs text-brand-400 mt-1 line-clamp-2 flex-1">{product.description}</p>
               
               <div className="mt-3 flex justify-between items-center pt-2 border-t border-brand-50/50">
                 <span className="font-semibold text-brand-800">${product.price}</span>
                 <button 
                   disabled={!product.inStock}
                   onClick={() => handleAddToCart(product)}
                   className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                     addedId === product.id 
                       ? 'bg-green-500 text-white' 
                       : 'bg-brand-100 text-brand-800 hover:bg-brand-800 hover:text-white disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400'
                   }`}
                 >
                   {addedId === product.id ? <Check size={16} /> : <Plus size={16} />}
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;