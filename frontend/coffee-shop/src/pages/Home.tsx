import React from 'react';
import CoffeeList from '../components/CoffeeList';

const Home: React.FC = () => {
  return (
    <div style={{ maxWidth: 800, margin: '30px auto' }}>
      <h1>Добро пожаловать в наш магазин кофе!</h1>
      <CoffeeList />
    </div>
  );
};

export default Home;
