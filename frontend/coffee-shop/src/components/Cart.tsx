import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addToCart, removeFromCart, deleteFromCart, clearCart } from '../store/cartSlice';

const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <h2>Ваша Корзина</h2>
        <p>Нет товаров в корзине</p>
      </div>
    );
  }
  

  return (
    <div>
      <h2>Ваша Корзина</h2>
      <ul className="cart-list">
        {cartItems.map(item => (
          <li key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>Цена: {item.price} ₽</p>
              <p>Количество: {item.quantity}</p>
              <div className="cart-item-controls">
                <button onClick={() => dispatch(addToCart(item))}>+</button>
                <button onClick={() => dispatch(removeFromCart(item.id))}>-</button>
                <button onClick={() => dispatch(deleteFromCart(item.id))}>Удалить</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <h3 className="cart-total">Общая сумма: {totalPrice} ₽</h3>
      <button className="cart-clear-btn" onClick={() => dispatch(clearCart())}>
        Очистить корзину
      </button>
    </div>
  );
};

export default Cart;
