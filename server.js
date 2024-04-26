require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const logger = require('./logger');
const path = require('path'); // 引入path模块来处理文件路径
const { monitorRequests } = require('./requestMonitor');
const app = express();
const port = process.env.PORT || 3001; // 使用环境变量或默认值设置端口

const { getBlockedIPs } = require('./ipBlockList');

app.use((req, res, next) => {
    const ip = req.ip;
    if (getBlockedIPs().includes(ip)) {
        res.status(403).send('Access denied');
    } else {
        next();
    }
});

// morgan设置用于日志记录
morgan.token('real-ip', function (req) {
    return req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.ip;
});

app.use(express.json()); // 解析JSON请求体
app.use(morgan(':real-ip - :method :url :status :response-time ms', { stream: { write: message => logger.info(message.trim()) } }));

// 使用监控请求的中间件
app.use(monitorRequests);

// 设置静态文件服务，这里默认'static'是存放静态文件的目录名
app.use(express.static('static'));

// 根路径请求返回index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// 路由来下载日志文件
app.get('/download-log', (req, res) => {
    const file = `${__dirname}/logs/combined.log`; 
    res.download(file); // Express 的 res.download 方法来触发文件下载
});



app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});
