import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Coffee {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

const CoffeeList: React.FC = () => {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/coffee')
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при загрузке данных');
        }
        return response.json();
      })
      .then(data => {
        setCoffees(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>Ошибка: {error}</p>;

  return (
    <>
      <h2>Наш Кофе</h2>
      <div className="coffee-card-list">
        {coffees.map(({ id, name, image, description, price }) => (
          <Link to={`/coffee/${id}`} key={id} className="coffee-card">
            <img src={image} alt={name} className="coffee-image" />
            <div className="coffee-info">
              <h3>{name}</h3>
              <p>{description}</p>
              <p className="coffee-price">{price} ₽</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default CoffeeList;
