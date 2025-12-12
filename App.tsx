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
import { LiffProvider } from './contexts/LiffContext';
import { ProductProvider } from './contexts/ProductContext';
import { BookingProvider } from './contexts/BookingContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { StylistProvider } from './contexts/StylistContext';
import { PromotionProvider } from './contexts/PromotionContext';
import { ShopProvider } from './contexts/ShopContext';

// Scroll to top on route change wrapper
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <ShopProvider>
      <LiffProvider>
        <ProductProvider>
          <StylistProvider>
            <PromotionProvider>
              <BookingProvider>
                <CartProvider>
                  <OrderProvider>
                    <Router>
                      <ScrollToTop />
                      {/* 
                        Container setup to emulate a mobile app view on larger screens.
                        Background color set to brand off-white.
                      */}
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
                    </Router>
                  </OrderProvider>
                </CartProvider>
              </BookingProvider>
            </PromotionProvider>
          </StylistProvider>
        </ProductProvider>
      </LiffProvider>
    </ShopProvider>
  );
};

export default App;