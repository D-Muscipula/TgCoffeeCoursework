// import React from 'react';
// import { useDispatch } from 'react-redux';
// import { addToCart } from '../store/cartSlice';

// interface Coffee {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
//   description: string;
// }

// interface Props {
//   coffee: Coffee;
// }

// const CoffeeItem: React.FC<Props> = ({ coffee }) => {
//   const dispatch = useDispatch();

//   const handleAddToCart = () => {
//     console.log('Добавляем товар в корзину:', coffee);  // Логируем объект кофе
//     dispatch(addToCart({
//       id: coffee.id,
//       name: coffee.name,
//       price: coffee.price,
//       image: coffee.image,
//     }));
//   };

//   return (
//     <div>
//       <h3>{coffee.name}</h3>
//       <p>{coffee.description}</p>
//       <p>Цена: {coffee.price} ₽</p>
//       <button onClick={handleAddToCart}>В корзину</button>
//     </div>
//   );
// };

// export default CoffeeItem;
