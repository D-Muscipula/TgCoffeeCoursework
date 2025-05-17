import React, { useEffect, useState } from 'react';
import { useTelegram } from '../store/TelegramContext';

interface Coffee {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

interface OrderItem {
  id: number;
  coffee: Coffee;
  quantity: number;
}

interface Order {
  id: number;
  userId: number;
  createdAt: string;
  status: string;                         
  items: OrderItem[];
}

const ORDERS_UPDATE_INTERVAL = 5_000;

const Orders: React.FC = () => {
  const { initData } = useTelegram();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = () => {
    setLoading(true);
    setError(null);
    fetch('/api/orders/user', {
      headers: {
        'X-Telegram-InitData': initData || ''
      }
    })
      .then(res => {
        console.log(res.headers.get('content-type'));
        if (!res.ok) throw new Error('Ошибка при загрузке заказов');
        return res.json();
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleCancel = async (orderId: number) => {
    if (!window.confirm('Вы уверены, что хотите отменить этот заказ?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'X-Telegram-InitData': initData || '',
        },
      });
      if (!res.ok) throw new Error('Ошибка при отмене заказа');
      loadOrders(); // перезагрузка списка заказов
    } catch (e: any) {
      alert(e.message);
    }
  };

  useEffect(() => {
    loadOrders();

    const intervalId = setInterval(() => {
      loadOrders();
    }, ORDERS_UPDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [initData]);

  if (loading) return <p>Загрузка заказов...</p>;
  if (error) return <p style={{ color: 'red' }}>Ошибка: {error}</p>;

  return (
    <div style={{ maxWidth: 900, margin: '30px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Список заказов</h2>
      <button onClick={loadOrders} style={{ marginBottom: 16 }}>
        Обновить заказы вручную
      </button>
      {orders.length === 0 && <p>Заказов нет.</p>}

      {orders.map(order => {
        const totalPrice = order.items.reduce((sum, item) => sum + item.coffee.price * item.quantity, 0);

        return (
          <div
            key={order.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 20,
              marginBottom: 20,
              backgroundColor: '#fff',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            }}
          >
            <p style={{ fontWeight: 'bold' }}>Заказ №{order.id}</p>
            {/* <p>Пользователь ID: {order.userId}</p> */}
            <p>Дата: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Статус: {
              order.status === 'CANCELED' ? 
                <span style={{ color: 'red' }}>Отменён</span> : 
                order.status === 'COMPLETED' ?
                  <span style={{ color: 'green' }}>Выполнен</span> :
                  'Создан'
            }</p>

            <table>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '8px' }}>Товар</th>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'center', padding: '8px' }}>Кол-во</th>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'right', padding: '8px' }}>Цена за шт.</th>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'right', padding: '8px' }}>Итого</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{item.coffee.name}</td>
                    <td style={{ borderBottom: '1px solid #eee', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ borderBottom: '1px solid #eee', textAlign: 'right' }}>{item.coffee.price} ₽</td>
                    <td style={{ borderBottom: '1px solid #eee', textAlign: 'right' }}>
                      {item.coffee.price * item.quantity} ₽
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ textAlign: 'right', fontWeight: 'bold', marginTop: 10 }}>
              Итого по заказу: {totalPrice} ₽
            </p>
            {/* Кнопка "Отменить заказ" только если он не отменён */}
            {order.status !== 'CANCELED' && (
              <button onClick={() => handleCancel(order.id)}>
                Отменить заказ
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Orders;
