import React, { createContext, useContext, useState } from 'react';
import { Promotion } from '../types';

const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo1',
    title: '冬季保養限定',
    description: 'Mule 睫毛滋養液全面 8 折',
    image: 'https://picsum.photos/id/431/800/450',
    label: '當季特惠',
    active: true
  }
];

interface PromotionContextType {
  promotions: Promotion[];
  addPromotion: (promo: Omit<Promotion, 'id'>) => void;
  updatePromotion: (id: string, updates: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
}

const PromotionContext = createContext<PromotionContextType>({
  promotions: [],
  addPromotion: () => {},
  updatePromotion: () => {},
  deletePromotion: () => {},
});

export const usePromotions = () => useContext(PromotionContext);

export const PromotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);

  const addPromotion = (data: Omit<Promotion, 'id'>) => {
    const newPromo: Promotion = {
      ...data,
      id: `promo_${Date.now()}`
    };
    setPromotions(prev => [...prev, newPromo]);
  };

  const updatePromotion = (id: string, updates: Partial<Promotion>) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePromotion = (id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
  };

  return (
    <PromotionContext.Provider value={{ promotions, addPromotion, updatePromotion, deletePromotion }}>
      {children}
    </PromotionContext.Provider>
  );
};
