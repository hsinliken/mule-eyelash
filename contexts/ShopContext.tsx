import React, { createContext, useContext, useState } from 'react';
import { ShopSettings } from '../types';

interface ShopContextType {
  settings: ShopSettings;
  updateSettings: (newSettings: Partial<ShopSettings>) => void;
}

const ShopContext = createContext<ShopContextType>({
  settings: {
    name: 'MULE EYELASH',
    subtitle: 'STUDIO',
    logo: '',
    lineId: 'https://lin.ee/BpNFDWqS',
    liffId: '2008685421-wjbyqf1k'
  },
  updateSettings: () => { },
});

export const useShop = () => useContext(ShopContext);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ShopSettings>({
    name: 'MULE EYELASH',
    subtitle: 'STUDIO',
    logo: 'https://cdn-icons-png.flaticon.com/512/3163/3163219.png', // 預設暫時圖示
    lineId: 'https://lin.ee/BpNFDWqS', // 預設商家 LINE 連結
    liffId: '2008685421-wjbyqf1k' // 預設 LIFF ID
  });

  const updateSettings = (newSettings: Partial<ShopSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <ShopContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ShopContext.Provider>
  );
};