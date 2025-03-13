const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
const axios = require('axios')




const bot = new Telegraf('7535195778:AAHTR-q3Vo3HuDgnAzY_ff9WQsRm7wzepZk')
bot.start((ctx) => ctx.reply('Welcome'))
bot.on('message', async (ctx) => {

  if (ctx.message) {
   
    if (ctx.message.text === "Бубу") {

      axios.get('https://mate.academy/students-api/goods/146')
      .then(response => {
       ctx.reply(response.data.name); 
      })
      .catch(error => {
    console.error('Ошибка запроса:', error);
  });



      ctx.reply('БуБу Жинку');
      
    }
   

    if (ctx.message.text === "Мілан") {
      const map = 'https://www.google.com/maps/place/%D0%BC%D1%96%D0%BB%D0%B0%D0%BD/data=!4m2!3m1!1s0x4786c1493f1275e7:0x3cffcd13c6740e8d?sa=X&ved=1t:155783&ictx=111'
      ctx.reply("А там жде Оксана");
      ctx.reply(map);
    }



  }
  
})
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))



