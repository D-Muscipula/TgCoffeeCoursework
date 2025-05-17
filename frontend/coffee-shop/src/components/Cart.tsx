import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addToCart, removeFromCart, deleteFromCart, clearCart } from '../store/cartSlice';
import { makeOrder } from '../store/cartThunks';
import { useTelegram } from '../store/TelegramContext';

const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const { initData } = useTelegram();

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Асинхронный метод оформления заказа
  const handleMakeOrder = async () => {
    if (cartItems.length === 0) {
      alert('Корзина пуста!');
      return;
    }
    try {
      await dispatch(
        makeOrder({
          items: cartItems.map(i => ({
            coffeeId: i.id,
            quantity: i.quantity,
          })),
          initData,
        })
      ).unwrap();
      alert('Заказ успешно оформлен!');
    } catch (e: any) {
      alert(e.message);
    }
  };

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
      <button
        className="cart-order-btn"
        onClick={handleMakeOrder}
        style={{ marginLeft: 12, background: '#3b82f6', color: '#fff', padding: '10px 30px', borderRadius: 8 }}
      >
        Оформить заказ
      </button>
    </div>
  );
};

export default Cart;
