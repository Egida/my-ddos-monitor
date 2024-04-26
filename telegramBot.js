const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const { addIP, removeIP, getBlockedIPs } = require('./ipBlockList');

const telegramToken = '7193827058:AAHoSraIfucW7CKUeTKcTy4JC6gkMQmEopw';
const chatId = '6117865803';
const bot = new TelegramBot(telegramToken, { polling: true });

function sendNotification(message) {
    const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
    axios.post(url, {
        chat_id: chatId,
        text: message
    }).then(response => {
        console.log('Telegram message sent');
    }).catch(error => {
        console.log('Failed to send Telegram message', error);
    });
}

bot.onText(/\/block (.+)/, (msg, match) => {
    const ip = match[1];
    const blockedIPs = getBlockedIPs();
    if (!blockedIPs.includes(ip)) {
        addIP(ip);
        bot.sendMessage(msg.chat.id, `Blocked IP: ${ip}`);
    } else {
        bot.sendMessage(msg.chat.id, `IP already blocked: ${ip}`);
    }
});

bot.onText(/\/clean (.+)/, (msg, match) => {
    const ip = match[1];
    const blockedIPs = getBlockedIPs();
    const index = blockedIPs.indexOf(ip);
    if (index !== -1) {
        removeIP(ip);
        bot.sendMessage(msg.chat.id, `IP removed from block list: ${ip}`);
    } else {
        bot.sendMessage(msg.chat.id, `IP was not in block list: ${ip}`);
    }
});

bot.onText(/\/blocklist/, (msg) => {
    const blockedIPs = getBlockedIPs();
    bot.sendMessage(msg.chat.id, `Blocked IPs: ${blockedIPs.join(', ')}`);
});

module.exports = {
    sendNotification
};