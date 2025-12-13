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
  isInitialized: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
}

const LiffContext = createContext<LiffContextType>({
  liffObject: null,
  profile: null,
  isLoggedIn: false,
  isInitialized: false,
  error: null,
  login: () => { },
  logout: () => { },
});

export const useLiff = () => useContext(LiffContext);

export const LiffProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useShop();
  const [liffObject, setLiffObject] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const initCalled = React.useRef(false);

  useEffect(() => {
    const currentLiffId = settings.liffId;

    // 0. 防止重複執行 (Strict Mode 或快速重整導致)
    if (initCalled.current) return;
    initCalled.current = true;

    // 1. 檢查 LIFF ID 是否存在
    if (!currentLiffId || currentLiffId === 'YOUR_LIFF_ID') {
      console.log('⚠️ LIFF ID 未設定，啟用模擬模式 (Mock Mode)。');
      setIsMockMode(true);
      setIsInitialized(true);
      return;
    }

    // 2. 初始化真實 LIFF (加入 3 秒超時機制)
    const initLiff = async () => {
      try {
        await Promise.race([
          liff.init({ liffId: currentLiffId }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('LIFF init timeout')), 3000))
        ]);

        setLiffObject(liff);
        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          try {
            const p = await liff.getProfile();
            setProfile(p as any);
          } catch (e) {
            console.error('Failed to get profile:', e);
          }
        }
      } catch (err: any) {
        console.warn('LIFF Initialization failed or timed out:', err);
        setError(err.message || 'LIFF Init Failed');
        // 初始化失敗時，切換回模擬模式或至少讓 isInitialized = true 以便顯示錯誤 UI，而不是卡在 Loading
        setIsMockMode(true);
      } finally {
        setIsInitialized(true);
      }
    };

    initLiff();
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
    <LiffContext.Provider value={{ liffObject, profile, isLoggedIn, isInitialized, error, login, logout }}>
      {children}
    </LiffContext.Provider>
  );
};