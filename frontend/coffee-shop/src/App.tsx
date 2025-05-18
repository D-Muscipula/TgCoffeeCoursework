import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CoffeeDetail from './pages/CoffeeDetail';
import Cart from './components/Cart';
import Orders from './pages/Orders';
import { TelegramContext } from './store/TelegramContext';

const App: React.FC = () => {
  // @ts-ignore
  const initData = window.Telegram?.WebApp?.initData || null;

  return (
    <TelegramContext.Provider value={{ initData }}>
      <Router>
        <div>
          <Header />
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/coffee/:id" element={<CoffeeDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </TelegramContext.Provider>
  );
};

export default App;
