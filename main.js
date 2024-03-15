const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const cron = require('node-cron');

const groupChatId = '120363241557953097@g.us';
let reminder = null;
let respondeu = false;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
		args: ['--no-sandbox']
	}
});

// imprime o qr code no console
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// quando o cliente está pronto
client.on('ready', () => {
    console.log('Client is ready!');
    // manda a mensagem todo dia às 13h

    cron.schedule('49 14 * * *', () => {
        sendMessage();
    }, {
        timezone: 'America/Sao_Paulo'
    });

    cron.schedule('52 14 * * *', () => {
        sendMessage();
    }, {
        timezone: 'America/Sao_Paulo'
    });

    cron.schedule('55 14 * * *', () => {
        sendMessage();
    }, {
        timezone: 'America/Sao_Paulo'
    });

   


    // verifica se a mensagem foi respondida

    cron.schedule('51 14 * * *', () => {
        checkAnswer("14:51");
    }, {
        timezone: 'America/Sao_Paulo'
    });

    cron.schedule('54 14 * * *', () => {
        checkAnswer("14:54");
    }, {
        timezone: 'America/Sao_Paulo'
    });

    cron.schedule('57 14 * * *', () => {
        checkAnswer("14:57");
    }, {
        timezone: 'America/Sao_Paulo'
    });
});

// executado quando uma mensagem é recebida
client.on('message', async (msg) => {
    if (msg.from == groupChatId && msg.body.toLowerCase() === 'sim') {
        respondeu = true;
        if (reminder) {
            reminder.stop();
            reminder = null;
        }
        await client.sendMessage(groupChatId, 'Que bom! 😊');
    }
    console.log('Mensagem recebida de:', msg.from);
});

// manda a mensagem
async function sendMessage() {
    
    let currentTime = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    currentTime = currentTime.split(', ')[1];
    currentTime = currentTime.split(':')[0] + ':' + currentTime.split(':')[1];
    respondeu = false;

    try {
        const message = `Oi, já bateu o ponto das ${currentTime}? 🤔`;
        await client.sendMessage(groupChatId, message);
        console.log('Message sent:', message);
      } catch (err) {
        console.error('Error sending message:', err);
      }
}

// verifica se a mensagem foi respondida. se não, seta um lembrete a cada hora
async function checkAnswer(a) {
    console.log("Checando a resposta")
    if (!respondeu) {
      console.log("Não respondeu! Criando o reminder")
      if(reminder){reminder.stop()}
      reminder = cron.schedule('*/2 * * * *', () => {
        sendReminder(a);
      });
    }
  }
  

// manda o lembrete
async function sendReminder(a) {
    console.log("Mandando lembrete")
    await client.sendMessage(groupChatId, 'Bater o ponto das ' +a+ ' urgentih');
}

client.initialize();
