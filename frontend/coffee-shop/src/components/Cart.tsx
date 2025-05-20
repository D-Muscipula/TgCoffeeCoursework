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
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      backgroundColor: 'white'
    }}>
      <h2 style={{
        textAlign: 'center', 
        marginBottom: '20px', 
        color: '#333'
      }}>
        Ваша Корзина
      </h2>

      {cartItems.length === 0 ? (
        <p style={{
          textAlign: 'center', 
          color: '#666', 
          padding: '20px 0'
        }}>
          Нет товаров в корзине
        </p>
      ) : (
        <>
          <div style={{
            marginBottom: '20px',
            borderBottom: '1px solid #eee',
            paddingBottom: '15px'
          }}>
            {cartItems.map(item => (
              <div 
                key={item.id} 
                style={{
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}
              >
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '8px', 
                      marginRight: '10px'
                    }} 
                  />
                  <div>
                    <p style={{margin: 0, fontWeight: 'bold'}}>{item.name}</p>
                    <p style={{margin: 0, color: '#666'}}>{item.price} ₽</p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex', 
                  alignItems: 'center'
                }}>
                  <button 
                    onClick={() => dispatch(removeFromCart(item.id))} 
                    style={buttonStyle}
                  >
                    -
                  </button>
                  <span style={{margin: '0 10px'}}>{item.quantity}</span>
                  <button 
                    onClick={() => dispatch(addToCart(item))} 
                    style={buttonStyle}
                  >
                    +
                  </button>
                  <button 
                    onClick={() => dispatch(deleteFromCart(item.id))} 
                    style={{
                      ...buttonStyle, 
                      backgroundColor: '#ff4d4d', 
                      color: 'white',
                      marginLeft: '10px'
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <strong>Общая сумма:</strong>
            <span style={{
              fontSize: '1.2em', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              {totalPrice} ₽
            </span>
          </div>

          <div style={{
            display: 'flex', 
            justifyContent: 'space-between'
          }}>
            <button 
              onClick={() => dispatch(clearCart())}
              style={{
                ...buttonStyle,
                backgroundColor: '#ff4d4d', 
                color: 'white',
                flex: 1,
                marginRight: '10px'
              }}
            >
              Очистить корзину
            </button>
            <button
              onClick={handleMakeOrder}
              style={{
                ...buttonStyle,
                backgroundColor: '#4CAF50', 
                color: 'white',
                flex: 1
              }}
            >
              Оформить заказ
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Общий стиль для кнопок
const buttonStyle = {
  padding: '8px 12px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  backgroundColor: '#e0e0e0',
  color: '#333',
  transition: 'background-color 0.3s ease'
};

export default Cart;
