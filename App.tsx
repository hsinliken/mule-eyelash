import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import BottomNav from './components/BottomNav';
import { LiffProvider, useLiff } from './contexts/LiffContext';
import { ProductProvider } from './contexts/ProductContext';
import { BookingProvider } from './contexts/BookingContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { StylistProvider } from './contexts/StylistContext';
import { PromotionProvider } from './contexts/PromotionContext';
import { ShopProvider } from './contexts/ShopContext';
import { GalleryProvider } from './contexts/GalleryContext';

// Scroll to top on route change wrapper
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isLoggedIn, isInitialized, login } = useLiff();

  // 移除自動登入 useEffect 以防止登出後的無限迴圈
  // React.useEffect(() => { ... }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 text-sm tracking-wider">系統載入中...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-50 px-6 text-center">
        <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-8">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="LINE" className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-light text-brand-900 mb-2">歡迎來到 Mule Eyelash</h1>
        <p className="text-brand-500 mb-8 text-sm">請使用 LINE 帳號登入以此使用預約功能</p>
        <button
          onClick={login}
          className="w-full max-w-xs bg-[#06C755] hover:bg-[#05b34c] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>LINE 帳號登入</span>
        </button>
      </div>
    );
  }

  return children;
};

const App: React.FC = () => {
  return (
    <ShopProvider>
      <LiffProvider>
        <GalleryProvider>
          <ProductProvider>
            <StylistProvider>
              <PromotionProvider>
                <BookingProvider>
                  <CartProvider>
                    <OrderProvider>
                      <Router>
                        <ScrollToTop />
                        <RequireAuth>
                          <div className="min-h-screen bg-gray-100 flex justify-center">
                            <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-x-hidden">
                              <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/booking" element={<Booking />} />
                                <Route path="/shop" element={<Shop />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/admin" element={<Admin />} />
                              </Routes>
                              <BottomNav />
                            </div>
                          </div>
                        </RequireAuth>
                      </Router>
                    </OrderProvider>
                  </CartProvider>
                </BookingProvider>
              </PromotionProvider>
            </StylistProvider>
          </ProductProvider>
        </GalleryProvider>
      </LiffProvider>
    </ShopProvider>
  );
};

export default App;