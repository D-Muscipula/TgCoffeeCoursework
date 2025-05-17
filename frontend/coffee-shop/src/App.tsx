import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CoffeeDetail from './pages/CoffeeDetail';
import Cart from './components/Cart';
import Orders from './pages/Orders';
import { TelegramContext } from './store/TelegramContext';

function sendInitData(initData: string) {
  fetch('/api/check-initdata', {
    method: 'GET',
    headers: {
      'X-Telegram-InitData': initData
    }
  })
    .then(res => res.text())
    .then(text => {
      alert('Ответ сервера: ' + text);
    })
    .catch(err => alert('Ошибка: ' + err));
}

const App: React.FC = () => {
  // @ts-ignore
  const initData = window.Telegram?.WebApp?.initData || null;

  useEffect(() => {
    if (initData) sendInitData(initData);
  }, [initData]);

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
