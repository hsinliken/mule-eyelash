import React from 'react';
import { Home, Calendar, ShoppingBag, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: '首頁', path: '/' },
    { icon: Calendar, label: '預約', path: '/booking' },
    { icon: ShoppingBag, label: '商城', path: '/shop' },
    { icon: User, label: '我的', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-200 px-6 py-3 flex justify-between items-center z-50 max-w-md mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
            isActive(item.path) ? 'text-brand-800' : 'text-brand-300'
          }`}
        >
          <item.icon size={22} strokeWidth={isActive(item.path) ? 2.5 : 2} />
          <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;