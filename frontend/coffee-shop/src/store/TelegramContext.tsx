import React, { createContext, useContext } from 'react';

interface TelegramContextProps {
  initData: string | null;
}

export const TelegramContext = createContext<TelegramContextProps>({ initData: null });

export const useTelegram = () => useContext(TelegramContext);
