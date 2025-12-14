import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShopSettings } from '../types';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

interface ShopContextType {
  settings: ShopSettings;
  updateSettings: (newSettings: Partial<ShopSettings>) => Promise<void>;
}

const ShopContext = createContext<ShopContextType>({
  settings: {
    name: 'MULE EYELASH',
    subtitle: 'STUDIO',
    logo: 'https://cdn-icons-png.flaticon.com/512/3163/3163219.png',
    lineId: 'https://lin.ee/BpNFDWqS',
    liffId: '2008685421-wjbyqf1k',
    makeWebhookUrl: '',
    adminIds: []
  },
  updateSettings: async () => { },
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
    adminIds: ['U3339e986a2680ec5f57bd32ac81204d1']
  });

  // Load Settings from Firestore
  useEffect(() => {
    console.log("ShopContext: Initializing Firestore listener...");
    const settingsRef = doc(db, 'shop', 'settings');

    // Ensure document exists
    getDoc(settingsRef).then((snap) => {
      if (!snap.exists()) {
        console.log("ShopContext: Settings doc not found, creating default...");
        setDoc(settingsRef, settings)
          .then(() => console.log("ShopContext: Default settings created."))
          .catch(err => console.error("ShopContext: Failed to create default settings:", err));
      }
    });

    const unsubscribe = onSnapshot(settingsRef, (doc) => {
      if (doc.exists()) {
        console.log("ShopContext: Fetched settings update:", doc.data());
        setSettings(prev => ({ ...prev, ...doc.data() }));
      }
    }, (error) => {
      console.error("ShopContext: Snapshot listener error:", error);
    });

    return () => unsubscribe();
  }, []);

  const updateSettings = async (newSettings: Partial<ShopSettings>) => {
    // Optimistic update
    setSettings(prev => ({ ...prev, ...newSettings }));

    console.log("ShopContext: saving settings...", newSettings);

    // Write to Firestore
    try {
      const settingsRef = doc(db, 'shop', 'settings');
      await setDoc(settingsRef, newSettings, { merge: true });
      console.log("ShopContext: Settings saved successfully to Firestore.");
      alert("資料庫儲存成功！");
    } catch (error: any) {
      console.error("ShopContext: Failed to save settings:", error);
      alert(`設定儲存失敗: ${error.message || error.code || error}\n請檢查 Firebase Console 的 Firestore Rules (應設為 allow write: if true)。`);
    }
  };

  return (
    <ShopContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ShopContext.Provider>
  );
};