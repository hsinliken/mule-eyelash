import React, { createContext, useContext, useState } from 'react';
import { Stylist } from '../types';

// Mock Initial Stylists
const INITIAL_STYLISTS: Stylist[] = [
  {
    id: 'st1',
    name: 'Luna',
    role: '資深美睫師',
    image: 'https://picsum.photos/id/65/200/200',
    rating: 4.9,
    specialties: ['Lash', 'Care'],
    workDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
    workHours: { start: '10:00', end: '19:00' }
  },
  {
    id: 'st2',
    name: 'Emma',
    role: '紋繡總監',
    image: 'https://picsum.photos/id/64/200/200',
    rating: 5.0,
    specialties: ['Lash', 'Brow', 'Lip'],
    workDays: [2, 3, 4, 5, 6], // Tue-Sat
    workHours: { start: '11:00', end: '20:00' }
  }
];

interface StylistContextType {
  stylists: Stylist[];
  addStylist: (stylist: Omit<Stylist, 'id'>) => void;
  updateStylist: (id: string, updates: Partial<Stylist>) => void;
  deleteStylist: (id: string) => void;
}

const StylistContext = createContext<StylistContextType>({
  stylists: [],
  addStylist: () => {},
  updateStylist: () => {},
  deleteStylist: () => {},
});

export const useStylists = () => useContext(StylistContext);

export const StylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stylists, setStylists] = useState<Stylist[]>(INITIAL_STYLISTS);

  const addStylist = (data: Omit<Stylist, 'id'>) => {
    const newStylist: Stylist = {
      ...data,
      id: `st_${Date.now()}`
    };
    setStylists(prev => [...prev, newStylist]);
  };

  const updateStylist = (id: string, updates: Partial<Stylist>) => {
    setStylists(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStylist = (id: string) => {
    setStylists(prev => prev.filter(s => s.id !== id));
  };

  return (
    <StylistContext.Provider value={{ stylists, addStylist, updateStylist, deleteStylist }}>
      {children}
    </StylistContext.Provider>
  );
};
