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
    <div style={{ 
      maxWidth: 900, 
      margin: '30px auto', 
      fontFamily: 'Arial, sans-serif', 
      padding: '0 15px' 
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: 25, 
        color: '#333' 
      }}>
        Список заказов
      </h2>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: 20 
      }}>
        <button 
          onClick={loadOrders} 
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: 5, 
            cursor: 'pointer' 
          }}
        >
          Обновить заказы
        </button>
      </div>
      
      {orders.length === 0 && (
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          marginTop: 30 
        }}>
          Заказов нет.
        </p>
      )}

      {orders.map(order => {
        const totalPrice = order.items.reduce((sum, item) => sum + item.coffee.price * item.quantity, 0);

        return (
          <div
            key={order.id}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
              backgroundColor: '#fff',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: 15 
            }}>
              <p style={{ color: '#666', margin: 0 }}>
                Дата: {new Date(order.createdAt).toLocaleString()}
              </p>
              <p style={{ margin: 0 }}>
                Статус: {
                  order.status === 'CANCELED' ? 
                    <span style={{ color: 'red' }}>Отменён</span> : 
                    order.status === 'COMPLETED' ?
                      <span style={{ color: 'green' }}>Выполнен</span> :
                      'Создан'
                }
              </p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ 
                    borderBottom: '1px solid #ccc', 
                    textAlign: 'left', 
                    padding: '8px', 
                    color: '#666' 
                  }}>
                    Товар
                  </th>
                  <th style={{ 
                    borderBottom: '1px solid #ccc', 
                    textAlign: 'center', 
                    padding: '8px', 
                    color: '#666' 
                  }}>
                    Кол-во
                  </th>
                  <th style={{ 
                    borderBottom: '1px solid #ccc', 
                    textAlign: 'right', 
                    padding: '8px', 
                    color: '#666' 
                  }}>
                    Цена за шт.
                  </th>
                  <th style={{ 
                    borderBottom: '1px solid #ccc', 
                    textAlign: 'right', 
                    padding: '8px', 
                    color: '#666' 
                  }}>
                    Итого
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td style={{ 
                      borderBottom: '1px solid #eee', 
                      padding: '8px', 
                      color: '#333' 
                    }}>
                      {item.coffee.name}
                    </td>
                    <td style={{ 
                      borderBottom: '1px solid #eee', 
                      textAlign: 'center', 
                      color: '#666' 
                    }}>
                      {item.quantity}
                    </td>
                    <td style={{ 
                      borderBottom: '1px solid #eee', 
                      textAlign: 'right', 
                      color: '#666' 
                    }}>
                      {item.coffee.price} ₽
                    </td>
                    <td style={{ 
                      borderBottom: '1px solid #eee', 
                      textAlign: 'right', 
                      color: '#333', 
                      fontWeight: 'bold' 
                    }}>
                      {item.coffee.price * item.quantity} ₽
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginTop: 15 
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: '1.1em', 
                fontWeight: 'bold', 
                color: '#333' 
              }}>
                Итого по заказу: {totalPrice} ₽
              </p>
              {order.status !== 'CANCELED' && (
                <button 
                  onClick={() => handleCancel(order.id)}
                  style={{ 
                    padding: '8px 15px', 
                    backgroundColor: '#f44336', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 5, 
                    cursor: 'pointer' 
                  }}
                >
                  Отменить заказ
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Orders;
