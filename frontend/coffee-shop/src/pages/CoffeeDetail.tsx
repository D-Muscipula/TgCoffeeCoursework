import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

interface Coffee {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

const CoffeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [coffee, setCoffee] = useState<Coffee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;

    fetch(`/api/coffee/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Ошибка при загрузке данных');
        return res.json();
      })
      .then(data => {
        setCoffee(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!coffee) return;
    dispatch(addToCart({
      id: coffee.id,
      name: coffee.name,
      price: coffee.price,
      image: coffee.image,
    }));

    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!coffee) return <p>Кофе не найден</p>;

  return (
    <div style={{ position: 'relative' }}>
      <h2>{coffee.name}</h2>
      <img src={coffee.image} alt={coffee.name} style={{width: 600, maxWidth: '100%', borderRadius: 8, marginBottom: 20 }} />
      <p>{coffee.description}</p>
      <p>{coffee.price} ₽</p>
      <button
        style={{
          marginTop: 20,
          padding: '12px 24px',
          fontSize: '1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
        onClick={handleAddToCart}
      >
        Добавить в корзину
      </button>

      {showMessage && (
        <div className="toast-message">
          Товар "{coffee.name}" добавлен в корзину!
        </div>
      )}
    </div>
  );
};

export default CoffeeDetail;
