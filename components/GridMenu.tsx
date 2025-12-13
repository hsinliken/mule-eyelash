import React from 'react';
import { CalendarCheck, ListOrdered, ShoppingBag, Gift, MessageCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../contexts/ShopContext';

const GridMenu: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useShop();

  // 格式: https://line.me/R/ti/p/<LINE_ID>
  // 移除 LINE ID 可能包含的 '@' 符號以確保連結正確，或者保留視商家輸入習慣而定
  // LINE Add Friend Link 通常格式為 https://line.me/R/ti/p/@lineid
  const getLineUrl = () => {
    const id = settings.lineId || '';
    if (id.startsWith('http')) return id;
    return `https://line.me/R/ti/p/${id}`;
  };

  const menuItems = [
    {
      label: '立即預約',
      sub: '預約服務',
      icon: CalendarCheck,
      action: () => navigate('/booking'),
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      subText: 'text-orange-600/80',
      iconColor: 'text-orange-600'
    },
    {
      label: '消費紀錄',
      sub: '歷史明細',
      icon: ListOrdered,
      action: () => navigate('/profile'),
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      subText: 'text-blue-600/80',
      iconColor: 'text-blue-600'
    },
    {
      label: '線上商城',
      sub: '美睫產品',
      icon: ShoppingBag,
      action: () => navigate('/shop'),
      bg: 'bg-amber-100',
      text: 'text-amber-900',
      subText: 'text-amber-700/80',
      iconColor: 'text-amber-600'
    },
    {
      label: '會員集點',
      sub: '點數兌換',
      icon: Gift,
      action: () => navigate('/profile'),
      bg: 'bg-rose-100',
      text: 'text-rose-800',
      subText: 'text-rose-600/80',
      iconColor: 'text-rose-600'
    },
    {
      label: '線上諮詢',
      sub: '真人客服',
      icon: MessageCircle,
      // 使用 window.open 開啟 LINE 官方帳號連結
      action: () => window.open(getLineUrl(), '_blank'),
      bg: 'bg-teal-100',
      text: 'text-teal-800',
      subText: 'text-teal-600/80',
      iconColor: 'text-teal-600'
    },
    {
      label: '商家後台',
      sub: '管理系統',
      icon: Settings,
      action: () => navigate('/admin'),
      bg: 'bg-slate-100',
      text: 'text-slate-800',
      subText: 'text-slate-600/80',
      iconColor: 'text-slate-600'
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={item.action}
          // 使用 inline style 添加重複的線性漸層來製作淺色條紋效果
          // 45度角，白色半透明線條，間隔 20px
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 10px, transparent 10px, transparent 20px)'
          }}
          className={`${item.bg} p-4 flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-all aspect-[5/4] rounded-2xl shadow-sm border border-white/50 relative overflow-hidden`}
        >
          {/* 圖示背景保持白色高亮，增加對比 */}
          <div className={`p-3 rounded-full bg-white/90 shadow-sm backdrop-blur-sm relative z-10 ${item.iconColor}`}>
            <item.icon size={26} strokeWidth={1.5} />
          </div>
          <div className="text-center relative z-10">
            <div className={`font-semibold text-sm ${item.text}`}>{item.label}</div>
            <div className={`text-xs mt-0.5 font-medium ${item.subText}`}>{item.sub}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default GridMenu;