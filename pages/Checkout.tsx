import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrderContext';
import { useLiff } from '../contexts/LiffContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Truck, CreditCard, User, Store, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { DeliveryMethod, PaymentMethod } from '../types';

const DELIVERY_FEE_HOME = 100;
const DELIVERY_FEE_STORE = 60;

const Checkout: React.FC = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { profile, isLoggedIn } = useLiff();
  const navigate = useNavigate();

  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [loading, setLoading] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    deliveryMethod: 'home_delivery' as DeliveryMethod,
    address: '',
    storeName: '',
    paymentMethod: 'credit_card' as PaymentMethod,
  });

  // Auto-fill user data if logged in
  useEffect(() => {
    if (isLoggedIn && profile?.displayName) {
      setFormData(prev => ({
        ...prev,
        name: profile.displayName
      }));
    }
  }, [isLoggedIn, profile]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && step !== 'success') {
      navigate('/shop');
    }
  }, [items, navigate, step]);

  const currentDeliveryFee = formData.deliveryMethod === 'home_delivery' ? DELIVERY_FEE_HOME : DELIVERY_FEE_STORE;
  const finalTotal = totalAmount + currentDeliveryFee;

  const handleCreateOrder = () => {
    // Validation
    if (!formData.name.trim()) { alert('請填寫收件人姓名'); return; }
    if (!formData.phone.trim() || formData.phone.length < 9) { alert('請填寫正確的手機號碼'); return; }
    
    if (formData.deliveryMethod === 'home_delivery' && !formData.address.trim()) {
       alert('請填寫宅配收件地址'); return;
    }
    if (formData.deliveryMethod === 'convenience_store' && !formData.storeName.trim()) {
       alert('請填寫取件門市名稱'); return;
    }

    setLoading(true);

    // Simulate API Delay
    setTimeout(() => {
      const orderId = createOrder({
        items: items,
        totalAmount: finalTotal,
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email
        },
        delivery: {
          method: formData.deliveryMethod,
          address: formData.deliveryMethod === 'home_delivery' ? formData.address : formData.storeName
        },
        payment: {
          method: formData.paymentMethod,
          isPaid: true // Simulate successful payment gateway callback
        }
      });
      
      setCreatedOrderId(orderId);
      clearCart();
      setLoading(false);
      setStep('success');
      window.scrollTo(0, 0);
    }, 1500);
  };

  const getPaymentLabel = (method: string) => {
     switch(method) {
        case 'credit_card': return '信用卡 (Visa/Master/JCB)';
        case 'line_pay': return 'LINE Pay';
        case 'transfer': return '銀行轉帳 (虛擬帳號)';
        default: return method;
     }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-600 shadow-sm">
          <CheckCircle size={48} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-light text-brand-900 mb-2">訂單已確認！</h1>
        <p className="text-brand-500 mb-6 text-sm leading-relaxed">
          感謝您的購買，<span className="font-medium text-brand-800">{formData.name}</span>。<br/>
          我們已收到您的訂單，將盡快為您安排出貨。
        </p>
        
        <div className="bg-brand-50 rounded-xl p-4 w-full mb-8 border border-brand-100">
           <p className="text-xs text-brand-400 uppercase tracking-wider mb-1">訂單編號</p>
           <p className="text-lg font-mono font-medium text-brand-800">#{createdOrderId.slice(-6)}</p>
        </div>

        <button 
          onClick={() => navigate('/shop')}
          className="w-full bg-brand-800 text-white py-3.5 rounded-xl font-medium shadow-lg shadow-brand-200 transition-transform active:scale-[0.98]"
        >
          繼續購物
        </button>
        <button 
           onClick={() => navigate('/profile')}
           className="w-full mt-3 text-brand-500 py-3 text-sm hover:text-brand-800 transition-colors"
        >
           查看訂單紀錄
        </button>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-brand-50/30 min-h-screen">
      <div className="bg-white p-6 sticky top-0 z-30 shadow-sm flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-brand-400 hover:text-brand-600 transition-colors">
           <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-light tracking-wide text-brand-900">結帳</h1>
      </div>

      <div className="p-4 space-y-6 max-w-lg mx-auto">
        
        {/* SECTION 1: CONTACT INFO */}
        <div className="bg-white p-5 rounded-xl border border-brand-100 shadow-sm">
           <h2 className="flex items-center gap-2 font-medium text-brand-800 mb-4 text-sm uppercase tracking-wide">
             <User size={16} /> 聯絡資訊
           </h2>
           <div className="space-y-3">
             <div>
                <label className="text-xs text-brand-400 mb-1 block">收件人姓名</label>
                <input 
                  type="text" placeholder="請輸入真實姓名"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-brand-50 border border-brand-200 rounded-lg p-3 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 transition-all"
                />
             </div>
             <div>
                <label className="text-xs text-brand-400 mb-1 block">手機號碼</label>
                <input 
                  type="tel" placeholder="09xxxxxxxx"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-brand-50 border border-brand-200 rounded-lg p-3 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 transition-all"
                />
             </div>
             <div>
                <label className="text-xs text-brand-400 mb-1 block">電子信箱 <span className="text-brand-200">(選填)</span></label>
                <input 
                  type="email" placeholder="接收訂單通知"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-brand-50 border border-brand-200 rounded-lg p-3 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 transition-all"
                />
             </div>
           </div>
        </div>

        {/* SECTION 2: DELIVERY */}
        <div className="bg-white p-5 rounded-xl border border-brand-100 shadow-sm">
           <h2 className="flex items-center gap-2 font-medium text-brand-800 mb-4 text-sm uppercase tracking-wide">
             <Truck size={16} /> 配送方式
           </h2>
           
           <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={() => setFormData({...formData, deliveryMethod: 'home_delivery'})}
                className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                  formData.deliveryMethod === 'home_delivery' 
                  ? 'border-brand-500 bg-brand-50 text-brand-800 ring-1 ring-brand-500' 
                  : 'border-brand-100 text-brand-400 hover:bg-brand-50'
                }`}
              >
                <div className="text-sm font-bold mb-1">宅配到府</div>
                <div className="text-xs opacity-80">+${DELIVERY_FEE_HOME}</div>
              </button>
              <button 
                onClick={() => setFormData({...formData, deliveryMethod: 'convenience_store'})}
                className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                  formData.deliveryMethod === 'convenience_store' 
                  ? 'border-brand-500 bg-brand-50 text-brand-800 ring-1 ring-brand-500' 
                  : 'border-brand-100 text-brand-400 hover:bg-brand-50'
                }`}
              >
                <div className="text-sm font-bold mb-1">超商取貨</div>
                <div className="text-xs opacity-80">+${DELIVERY_FEE_STORE}</div>
              </button>
           </div>

           {formData.deliveryMethod === 'home_delivery' ? (
             <div className="animate-fade-in">
               <label className="text-xs text-brand-400 mb-1 block">收件地址</label>
               <div className="relative">
                 <MapPin className="absolute left-3 top-3 text-brand-300" size={18} />
                 <textarea 
                   placeholder="縣市、區、街道、樓層..."
                   value={formData.address}
                   onChange={e => setFormData({...formData, address: e.target.value})}
                   rows={2}
                   className="w-full bg-brand-50 border border-brand-200 rounded-lg p-3 pl-10 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 transition-all resize-none"
                 />
               </div>
             </div>
           ) : (
             <div className="animate-fade-in">
               <label className="text-xs text-brand-400 mb-1 block">門市資訊</label>
               <div className="relative">
                 <Store className="absolute left-3 top-3 text-brand-300" size={18} />
                 <input 
                    type="text" placeholder="請輸入超商門市名稱 / 店號"
                    value={formData.storeName}
                    onChange={e => setFormData({...formData, storeName: e.target.value})}
                    className="w-full bg-brand-50 border border-brand-200 rounded-lg p-3 pl-10 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 transition-all"
                 />
               </div>
               <p className="text-[10px] text-brand-400 mt-2 flex items-center gap-1">
                 <AlertCircle size={10} /> 請務必確認門市名稱正確，以免無法取件。
               </p>
             </div>
           )}
        </div>

        {/* SECTION 3: PAYMENT */}
        <div className="bg-white p-5 rounded-xl border border-brand-100 shadow-sm">
           <h2 className="flex items-center gap-2 font-medium text-brand-800 mb-4 text-sm uppercase tracking-wide">
             <CreditCard size={16} /> 付款方式
           </h2>
           <div className="space-y-2">
              {['credit_card', 'line_pay', 'transfer'].map((method) => (
                <label key={method} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.paymentMethod === method 
                    ? 'border-brand-500 bg-brand-50' 
                    : 'border-brand-100 hover:bg-brand-50'
                }`}>
                   <input 
                     type="radio" 
                     name="payment"
                     checked={formData.paymentMethod === method}
                     onChange={() => setFormData({...formData, paymentMethod: method as PaymentMethod})}
                     className="accent-brand-600 w-4 h-4"
                   />
                   <span className="text-sm text-brand-800">
                     {getPaymentLabel(method)}
                   </span>
                </label>
              ))}
           </div>
        </div>

        {/* SUMMARY */}
        <div className="mt-6 bg-brand-50/50 p-4 rounded-xl border border-brand-100/50">
           <div className="flex justify-between text-brand-500 text-sm mb-2">
              <span>商品小計 ({items.length} 件)</span>
              <span>${totalAmount}</span>
           </div>
           <div className="flex justify-between text-brand-500 text-sm mb-4">
              <span>運費 ({formData.deliveryMethod === 'home_delivery' ? '宅配' : '超商'})</span>
              <span>${currentDeliveryFee}</span>
           </div>
           <div className="flex justify-between text-brand-900 font-bold text-lg border-t border-brand-200 pt-4 mb-2">
              <span>訂單總計</span>
              <span>${finalTotal}</span>
           </div>
        </div>

        <button 
             onClick={handleCreateOrder}
             disabled={loading}
             className="w-full bg-brand-800 text-white py-4 rounded-xl font-medium shadow-lg shadow-brand-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99] transition-all"
           >
             {loading ? (
               <>
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 <span>處理中...</span>
               </>
             ) : '確認並送出訂單'}
        </button>

      </div>
    </div>
  );
};

export default Checkout;