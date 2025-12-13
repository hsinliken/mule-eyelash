import React, { createContext, useContext, useEffect, useState } from 'react';
import { Stylist } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

// Mock Initial Stylists (Moved from outside to inside for seeding logic if needed, or keep ref)
const INITIAL_STYLISTS_DATA: Omit<Stylist, 'id'>[] = [
  {
    name: 'Luna',
    role: '資深美睫師',
    image: 'https://picsum.photos/id/65/200/200',
    rating: 4.9,
    specialties: ['Lash', 'Care'],
    workDays: [1, 2, 3, 4, 5, 6],
    workHours: { start: '10:00', end: '19:00' }
  },
  {
    name: 'Emma',
    role: '紋繡總監',
    image: 'https://picsum.photos/id/64/200/200',
    rating: 5.0,
    specialties: ['Lash', 'Brow', 'Lip'],
    workDays: [2, 3, 4, 5, 6],
    workHours: { start: '11:00', end: '20:00' }
  }
];

interface StylistContextType {
  stylists: Stylist[];
  addStylist: (stylist: Omit<Stylist, 'id'>) => Promise<void>;
  updateStylist: (id: string, updates: Partial<Stylist>) => Promise<void>;
  deleteStylist: (id: string) => Promise<void>;
}

const StylistContext = createContext<StylistContextType>({
  stylists: [],
  addStylist: async () => { },
  updateStylist: async () => { },
  deleteStylist: async () => { },
});

export const useStylists = () => useContext(StylistContext);

export const StylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stylists, setStylists] = useState<Stylist[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'stylists'), orderBy('rating', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        console.log('Seeding initial stylists...');
        for (const s of INITIAL_STYLISTS_DATA) {
          await addDoc(collection(db, 'stylists'), s);
        }
        return;
      }
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Stylist));
      setStylists(items);
    });
    return () => unsubscribe();
  }, []);

  const addStylist = async (data: Omit<Stylist, 'id'>) => {
    await addDoc(collection(db, 'stylists'), data);
  };

  const updateStylist = async (id: string, updates: Partial<Stylist>) => {
    await updateDoc(doc(db, 'stylists', id), updates);
  };

  const deleteStylist = async (id: string) => {
    await deleteDoc(doc(db, 'stylists', id));
  };

  return (
    <StylistContext.Provider value={{ stylists, addStylist, updateStylist, deleteStylist }}>
      {children}
    </StylistContext.Provider>
  );
};
