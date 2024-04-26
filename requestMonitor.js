const { sendNotification } = require('./telegramBot');

const requestTimes = {};
const lastNotified = {}; // 用于存储最后通知时间的对象

function monitorRequests(req, res, next) {
    const ip = req.ip;
    const now = Date.now();
    
    if (!requestTimes[ip]) {
        requestTimes[ip] = [];
    }
    requestTimes[ip].push(now);

    // 清除旧的时间戳
    requestTimes[ip] = requestTimes[ip].filter(timestamp => now - timestamp < 10000); // 保留最近10秒内的时间戳

    // 检查该IP是否已经发送过通知，并检查是否已经过了10秒
    if (requestTimes[ip].length > 10 && (!lastNotified[ip] || now - lastNotified[ip] > 10000)) {
        sendNotification(`High traffic detected from IP: ${ip}`);
        lastNotified[ip] = now; // 更新最后通知时间
    }

    next();
}

module.exports = {
    monitorRequests
};
