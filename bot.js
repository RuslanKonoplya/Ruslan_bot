const { Telegraf } = require('telegraf');
const { MongoClient } = require('mongodb');

// Создаем бота
const bot = new Telegraf('7535195778:AAHTR-q3Vo3HuDgnAzY_ff9WQsRm7wzepZk');

// Подключение к базе данных MongoDB
const mongoUrl = 'mongodb+srv://Ruslan:Ruslan4115653@cluster0.7nuwr1b.mongodb.net/anna-vel?retryWrites=true&w=majority'; 
const dbName = 'anna-vel'; // Имя вашей базы данных
const collectionName = 'feedbacks'; // Имя коллекции с отзывами

let chatId = null; // переменная для хранения chatId

// Команда /start для получения chatId
bot.start((ctx) => {
  chatId = ctx.message.chat.id;  // Сохраняем chatId
  ctx.reply('Welcome to the bot!');
  console.log('chatId:', chatId); // Выводим chatId в консоль для проверки
});

// Функция для отправки сообщения в Telegram
const sendTelegramMessage = async (message) => {
  try {
    // Отправляем сообщение в того же пользователя, с которым началась сессия
    if (chatId) {
      await bot.telegram.sendMessage(chatId, message);
      console.log('Сообщение отправлено:', message);
    } else {
      console.log('chatId еще не получен');
    }
  } catch (error) {
    console.error('Ошибка при отправке сообщения в Telegram:', error);
  }
};

// Подключаемся к MongoDB
const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect().then(() => {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // Настройка change stream для отслеживания новых отзывов
  const changeStream = collection.watch();

  // Когда появляется новый отзыв, отправляем его в Telegram
  changeStream.on('change', async (change) => {
    if (change.operationType === 'insert') {
      const newReview = change.fullDocument;
      
      // Форматируем сообщение, используя поля из базы данных
      const message = `Новий відгук від ${newReview.name} (Телефон: ${newReview.phone}):\n${newReview.message}`;
      console.log('fgdfgfghfghhfghg');
      await sendTelegramMessage(message);
    }
  });

  console.log('Бот запущен и отслеживает изменения в базе данных MongoDB...');
}).catch(err => {
  console.error('Ошибка подключения к базе данных:', err);
});

// Запуск бота
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
