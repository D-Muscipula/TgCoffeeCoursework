const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const webAppUrl = 'https://coffeetelegram.website';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text?.trim();

    if (text === '/start') {
        await bot.sendMessage(chatId, 
            '👋 Привет! Добро пожаловать в Telegram-магазин кофе.\n\n' +
            'Нажми кнопку ниже, чтобы открыть наш онлайн-магазин и сделать заказ!',
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: '☕ Открыть магазин', web_app: { url: webAppUrl } }
                        ]
                    ]
                }
            }
        );
        return;
    }
});
