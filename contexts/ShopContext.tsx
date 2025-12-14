import React, { createContext, useContext, useState, useEffect } from 'react';
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
    logo: 'https://cdn-icons-png.flaticon.com/512/3163/3163219.png',
    lineId: 'https://lin.ee/BpNFDWqS',
    liffId: '2008685421-wjbyqf1k',
    makeWebhookUrl: '',
    adminIds: []
  });

  // Load Settings from Firestore
  useEffect(() => {
    import('../firebase').then(({ db }) => {
      import('firebase/firestore').then(({ doc, onSnapshot, setDoc, getDoc }) => {
        const settingsRef = doc(db, 'shop', 'settings');

        // Ensure document exists
        getDoc(settingsRef).then((snap) => {
          if (!snap.exists()) {
            setDoc(settingsRef, settings); // Initialize with defaults if missing
          }
        });

        const unsubscribe = onSnapshot(settingsRef, (doc) => {
          if (doc.exists()) {
            setSettings(prev => ({ ...prev, ...doc.data() }));
          }
        });
        return unsubscribe;
      });
    });
  }, []); // Run once on mount

  const updateSettings = async (newSettings: Partial<ShopSettings>) => {
    // Optimistic update
    setSettings(prev => ({ ...prev, ...newSettings }));

    // Write to Firestore
    try {
      const { db } = await import('../firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      const settingsRef = doc(db, 'shop', 'settings');
      await setDoc(settingsRef, newSettings, { merge: true });
    } catch (error: any) {
      console.error("Failed to save settings:", error);
      alert(`設定儲存失敗: ${error.message || error.code || error}\n請檢查 Firebase Console 的 Firestore Rules 是否有開啟寫入權限。`);
    }
  };

  return (
    <ShopContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ShopContext.Provider>
  );
};