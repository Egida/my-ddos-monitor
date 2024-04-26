const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const logsDir = path.join(__dirname, 'logs'); // 设置日志文件的目录
const logFilePath = path.join(logsDir, 'combined.log'); // 完整的日志文件路径

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: logFilePath }) // 使用完整路径
    ]
});

module.exports = logger;
