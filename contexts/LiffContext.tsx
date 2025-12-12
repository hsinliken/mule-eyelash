import React, { createContext, useContext, useEffect, useState } from 'react';
import liff from '@line/liff';
import { useShop } from './ShopContext';

interface Profile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

interface LiffContextType {
  liffObject: any;
  profile: Profile | null;
  isLoggedIn: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
}

const LiffContext = createContext<LiffContextType>({
  liffObject: null,
  profile: null,
  isLoggedIn: false,
  error: null,
  login: () => {},
  logout: () => {},
});

export const useLiff = () => useContext(LiffContext);

export const LiffProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useShop();
  const [liffObject, setLiffObject] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    const currentLiffId = settings.liffId;

    // 檢查 LIFF ID 是否存在
    if (!currentLiffId || currentLiffId === 'YOUR_LIFF_ID') {
      console.log('⚠️ LIFF ID 未設定，啟用模擬模式 (Mock Mode)。');
      setIsMockMode(true);
      return;
    }

    // 初始化真實 LIFF
    liff
      .init({ liffId: currentLiffId })
      .then(() => {
        setLiffObject(liff);
        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          liff
            .getProfile()
            .then((p: any) => setProfile(p))
            .catch((e: any) => console.error('Failed to get profile:', e));
        }
      })
      .catch((err: any) => {
        console.warn('LIFF Initialization failed:', err);
        setError(err.message);
        // 若初始化失敗（例如網路問題或 ID 錯誤），也切換回模擬模式以免 App 當掉
        setIsMockMode(true);
      });
  }, [settings.liffId]); // 當設定中的 LIFF ID 改變時重新執行

  const login = () => {
    // 偵測是否在 Iframe 中執行 (例如 StackBlitz 預覽視窗)
    const isInIframe = window.self !== window.top;

    if (isMockMode || isInIframe) {
      if (isInIframe && !isMockMode) {
         console.warn("Detected iframe environment. LINE Login does not support iframes. Falling back to Mock Mode.");
         alert("【環境限制提示】\nLINE 官方基於安全考量，禁止在 Iframe (預覽視窗) 中進行登入。\n\n系統將自動切換為「模擬登入」模式供您測試。\n若需測試真實登入，請點擊編輯器右上角的「Open in New Tab」在新視窗開啟網頁。");
      }

      // --- 模擬登入行為 ---
      console.log('執行模擬登入...');
      const mockProfile: Profile = {
        userId: 'mock_user_123',
        displayName: '測試用戶 (Sarah)',
        pictureUrl: 'https://picsum.photos/id/64/200/200',
        statusMessage: 'Mock Login Active'
      };
      setProfile(mockProfile);
      setIsLoggedIn(true);
      
      if (isMockMode) {
        alert('【開發模式提示】\n您已成功模擬登入！\n目前使用 LIFF ID: ' + settings.liffId);
      }
    } else {
      // --- 真實 LINE 登入 ---
      if (liffObject && !isLoggedIn) {
        // 使用 login 進行重導向
        liffObject.login({ redirectUri: window.location.href });
      }
    }
  };

  const logout = () => {
    // 偵測是否在 Iframe 中執行
    const isInIframe = window.self !== window.top;

    if (isMockMode || isInIframe) {
      // --- 模擬登出 ---
      setIsLoggedIn(false);
      setProfile(null);
      console.log('執行模擬登出...');
    } else {
      // --- 真實 LINE 登出 ---
      if (liffObject && isLoggedIn) {
        liffObject.logout();
        setIsLoggedIn(false);
        setProfile(null);
        window.location.reload(); // LIFF 登出通常建議重新整理頁面以清除狀態
      }
    }
  };

  return (
    <LiffContext.Provider value={{ liffObject, profile, isLoggedIn, error, login, logout }}>
      {children}
    </LiffContext.Provider>
  );
};