import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearCart } from './cartSlice';

export const makeOrder = createAsyncThunk<
  void,
  { items: { coffeeId: number, quantity: number }[], initData: string | null },
  { dispatch: any }
>(
  'cart/makeOrder',
  async ({ items, initData }, { dispatch }) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-InitData': initData || '',
      },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      throw new Error('Ошибка при оформлении заказа');
    }
    dispatch(clearCart());
  }
);
