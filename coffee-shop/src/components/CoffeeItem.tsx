// src/components/CoffeeItem.tsx
import React from 'react';

interface Coffee {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface Props {
  coffee: Coffee;
}

const CoffeeItem: React.FC<Props> = ({ coffee }) => {
  return (
    <div>
      <h3>{coffee.name}</h3>
      <p>{coffee.description}</p>
      <p>Цена: {coffee.price} тг</p>
      <button>В корзину</button>
    </div>
  );
};

export default CoffeeItem;
