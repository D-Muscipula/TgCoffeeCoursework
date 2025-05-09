import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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

  useEffect(() => {
    if (!id) return;

    fetch(`/coffee/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка при загрузке данных');
        return res.json();
      })
      .then((data) => {
        setCoffee(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>Ошибка: {error}</p>;
  if (!coffee) return <p>Коф не найден</p>;

  return (
    <div style={{ maxWidth: 700, margin: '30px auto', padding: 20, background: '#fff', borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.1)' }}>
      <h2>{coffee.name}</h2>
      <img
        src={coffee.image}
        alt={coffee.name}
        style={{ width: '100%', maxHeight: 350, objectFit: 'cover', borderRadius: 10, marginBottom: 20 }}
      />
      <p>{coffee.description}</p>
      <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginTop: 15 }}>{coffee.price} ₽</p>
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
        onClick={() => alert(`Добавлено в корзину: ${coffee.name}`)}
      >
        Добавить в корзину
      </button>
    </div>
  );
};

export default CoffeeDetail;
