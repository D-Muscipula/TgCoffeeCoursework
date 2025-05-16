import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CoffeeDetail from './pages/CoffeeDetail';
import Cart from './components/Cart';
import Orders from './pages/Orders';

function sendInitData(initData: string) {
  fetch('/api/check-initdata', {
    method: 'POST',
    headers: {
      'X-Telegram-InitData': initData,      
      'Content-Type': 'application/json', 
    }
  })
    .then(res => res.text())
    .then(text => {
      alert("Ответ сервера: " + text);
    })
    .catch(err => alert('Ошибка: ' + err));
}

const App: React.FC = () => {
    // @ts-ignore
    const initData = window.Telegram?.WebApp?.initData || "query_id=...&user=...&auth_date=...&hash=...";
    sendInitData(initData);
  return (
    <Router>
      <div className="app-container">
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
  );
};

export default App;