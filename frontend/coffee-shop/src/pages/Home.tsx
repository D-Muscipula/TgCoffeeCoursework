import React from 'react';
import CoffeeList from '../components/CoffeeList';

const Home: React.FC = () => {
  const handleMakeOrder = () => {
    const orderData = {
      userId: 1,
      items: [
        { coffeeId: 2, quantity: 1 },
        { coffeeId: 3, quantity: 2 }
      ]
    };

    fetch('/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Ошибка при отправке заказа');
        }
        alert('Заказ успешно создан!');
      })
      .catch(err => {
        alert(`Ошибка: ${err.message}`);
      });
  };

  return (
    <div style={{ maxWidth: 800, margin: '30px auto' }}>
      <h1>Добро пожаловать в наш магазин кофе!</h1>
      <CoffeeList />
      <button 
        onClick={handleMakeOrder} 
        style={{
          marginTop: 20,
          padding: '12px 28px',
          fontSize: '16px',
          backgroundColor: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Сделать заказ
      </button>
    </div>
  );
};

export default Home;
