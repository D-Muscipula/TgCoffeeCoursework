import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header>
      <div className="header-container">
        <h1 className="logo">   <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            TgCoffee
          </Link></h1>
        <nav>
          <ul className="nav-list">
            <li><Link to="/" className="nav-link">Главная</Link></li>
            <li><Link to="/cart" className="nav-link">Корзина</Link></li>
            <li><Link to="/orders" className="nav-link">Заказы</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
