const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const cron = require('node-cron');

const groupChatId = '120363241557953097@g.us';
let reminder = null;

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

    cron.schedule('47 12 * * *', () => {
        sendMessage();
    }, {
        timezone: 'America/Sao_Paulo'
    });

    cron.schedule('48 12 * * *', () => {
        sendMessage();
    }, {
        timezone: 'America/Sao_Paulo'
    });

    cron.schedule('49 12 * * *', () => {
        sendMessage();
    }, {
        timezone: 'America/Sao_Paulo'
    });

    cron.schedule('50 12 * * *', () => {
        sendMessage();
    }, {
        timezone: 'America/Sao_Paulo'
    });


    // verifica se a mensagem foi respondida todo dia às 22h
    cron.schedule('54 13 * * *', () => {
        checkAnswer();
    }, {
        timezone: 'America/Sao_Paulo'
    });

    cron.schedule('59 13 * * *', () => {
        checkAnswer();
    }, {
        timezone: 'America/Sao_Paulo'
    });

    cron.schedule('04 14 * * *', () => {
        checkAnswer();
    }, {
        timezone: 'America/Sao_Paulo'
    });

    cron.schedule('09 14 * * *', () => {
        checkAnswer();
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
    const dataAtual = new Date();
    const horaAtual = dataAtual.toLocaleTimeString().slice(0, 5);

    respondeu = false;

    try {
        const message = `Oi, já bateu o ponto das ${horaAtual}? 🤔`;
        await client.sendMessage(groupChatId, message);
        console.log('Message sent:', message);
      } catch (err) {
        console.error('Error sending message:', err);
      }
}

// verifica se a mensagem foi respondida. se não, seta um lembrete a cada hora
async function checkAnswer() {
    if (!respondeu) {
        reminder = cron.schedule('*/10 * * * *', () => {
            sendReminder();
        });
    }
}
  

// manda o lembrete
async function sendReminder() {
    await client.sendMessage(groupChatId, 'Bater o ponto urgentih');
}

client.initialize();
