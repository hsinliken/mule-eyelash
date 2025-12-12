import React, { useState } from 'react';
import { User, Clock, ChevronRight, LogOut, Package } from 'lucide-react';
import { useLiff } from '../contexts/LiffContext';
import { useBookings } from '../contexts/BookingContext';
import { useOrders } from '../contexts/OrderContext';
import { SERVICES, STYLISTS } from '../constants';

const Profile: React.FC = () => {
  const { profile, isLoggedIn, login, logout } = useLiff();
  const { appointments } = useBookings();
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState<'bookings' | 'orders'>('bookings');

  // Helper to find service/stylist names
  const getServiceName = (id: string) => SERVICES.find(s => s.id === id)?.title || '未知服務';
  const getStylistName = (id: string) => STYLISTS.find(s => s.id === id)?.name || '未知美睫師';

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'confirmed': return '已確認';
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
      case 'pending': return '處理中';
      case 'shipped': return '已出貨';
      default: return status;
    }
  }

  // Fallback mock data if not logged in via LIFF
  const userData = {
    name: profile?.displayName || 'Sarah Chen',
    role: isLoggedIn ? 'LINE 會員' : '金卡會員',
    image: profile?.pictureUrl || 'https://picsum.photos/id/64/200/200'
  };

  return (
    <div className="pb-24 min-h-screen bg-brand-50/50">
      {/* Profile Header */}
      <div className="bg-white p-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-sm border-b border-brand-100 relative overflow-hidden">
        {/* Abstract background decoration */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="flex items-center gap-4 relative z-10">
           <div className="w-16 h-16 rounded-full bg-brand-200 border-2 border-white shadow flex items-center justify-center overflow-hidden">
             <img src={userData.image} alt="User" className="w-full h-full object-cover" />
           </div>
           <div>
             <h1 className="text-xl font-medium text-brand-900">{userData.name}</h1>
             <p className="text-sm text-brand-500">{userData.role}</p>
           </div>
        </div>

        {/* Membership Card */}
        <div className="mt-8 bg-gradient-to-br from-brand-700 to-brand-900 rounded-2xl p-6 text-white shadow-lg shadow-brand-200/50 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <User size={100} />
           </div>
           <p className="text-brand-200 text-xs tracking-widest uppercase mb-1">累積點數</p>
           <h2 className="text-4xl font-light mb-6">2,450</h2>
           
           <div className="w-full bg-white/20 h-1.5 rounded-full mb-2 overflow-hidden">
             <div className="w-[70%] h-full bg-white/90 rounded-full"></div>
           </div>
           <div className="flex justify-between text-[10px] text-brand-200">
             <span>目前等級: 金卡</span>
             <span>下一等級: 白金卡 (還差 550 點)</span>
           </div>
        </div>
      </div>

      {/* Toggle */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-xl p-1 flex shadow-sm border border-brand-100">
           <button 
             onClick={() => setActiveTab('bookings')}
             className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'bookings' ? 'bg-brand-100 text-brand-800' : 'text-brand-400'}`}
           >
             預約紀錄
           </button>
           <button 
             onClick={() => setActiveTab('orders')}
             className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'orders' ? 'bg-brand-100 text-brand-800' : 'text-brand-400'}`}
           >
             我的訂單
           </button>
        </div>
      </div>

      {/* History */}
      <div className="px-6 mt-4">
        <div className="space-y-4">
          
          {activeTab === 'bookings' && (
            appointments.length === 0 ? (
              <div className="text-center text-brand-400 py-4 text-sm">尚無紀錄</div>
            ) : (
               appointments.map(apt => (
                 <div key={apt.id} className={`bg-white p-4 rounded-xl border border-brand-100 shadow-sm flex gap-4 ${apt.status === 'completed' ? 'opacity-70' : ''}`}>
                    <div className="bg-brand-50 w-16 h-16 rounded-lg flex flex-col items-center justify-center text-brand-800 shrink-0">
                      <span className="text-xs font-bold uppercase">{new Date(apt.date).toLocaleString('zh-TW', { month: 'short' })}</span>
                      <span className="text-xl font-light">{new Date(apt.date).getDate()}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-brand-900 font-medium text-sm">{getServiceName(apt.serviceId)}</h4>
                      <p className="text-xs text-brand-500 mt-0.5">美睫師: {getStylistName(apt.stylistId)}</p>
                      <div className={`mt-2 inline-flex items-center text-[10px] px-2 py-0.5 rounded-full ${
                        apt.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                        apt.status === 'completed' ? 'bg-gray-50 text-gray-500' :
                        'bg-red-50 text-red-500'
                      }`}>
                        {getStatusLabel(apt.status)}
                      </div>
                    </div>
                 </div>
               ))
            )
          )}

          {activeTab === 'orders' && (
            orders.length === 0 ? (
              <div className="text-center text-brand-400 py-4 text-sm">尚無近期訂單</div>
            ) : (
               orders.map(order => (
                 <div key={order.id} className="bg-white p-4 rounded-xl border border-brand-100 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                       <div className="flex items-center gap-2">
                          <Package size={16} className="text-brand-400"/>
                          <span className="text-sm font-medium text-brand-900">#{order.id.slice(-6)}</span>
                       </div>
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          order.status === 'shipped' || order.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                       }`}>
                          {getStatusLabel(order.status)}
                       </span>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                       {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-xs text-brand-600">
                             <span>{item.quantity}x {item.name}</span>
                          </div>
                       ))}
                    </div>

                    <div className="pt-2 border-t border-brand-50 flex justify-between items-center">
                       <span className="text-xs text-brand-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                       <span className="text-brand-900 font-bold text-sm">${order.totalAmount}</span>
                    </div>
                 </div>
               ))
            )
          )}

        </div>
      </div>

      {/* Quick Settings */}
      <div className="px-6 mt-8 space-y-2">
         {['個人資訊', '付款方式', '通知設定', '客服支援'].map((item) => (
           <button key={item} className="w-full bg-white p-4 rounded-xl border border-brand-100 shadow-sm flex justify-between items-center text-sm text-brand-800">
             {item}
             <ChevronRight size={16} className="text-brand-300" />
           </button>
         ))}
         
         {!isLoggedIn ? (
            <button 
              onClick={login}
              className="w-full bg-brand-50 p-4 rounded-xl border border-brand-200 shadow-sm flex justify-center items-center text-sm text-brand-800 font-medium mt-4"
            >
              LINE 登入
            </button>
         ) : (
            <button 
              onClick={logout}
              className="w-full bg-white p-4 rounded-xl border border-red-100 shadow-sm flex justify-between items-center text-sm text-red-500 mt-4"
            >
              登出
              <LogOut size={16} />
            </button>
         )}
      </div>
    </div>
  );
};

export default Profile;