const express = require('express');
const morgan = require('morgan');
const logger = require('./logger');
const app = express();
const port = 3001;

morgan.token('real-ip', function (req) {
	  return req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.ip;
});

app.use(morgan(':real-ip - :method :url :status :response-time ms', { stream: { write: message => logger.info(message.trim()) } }));

app.get('/', (req, res) => {
	  const realIp = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.ip;
	  logger.info(`Request from real IP: ${realIp}`);
	  res.send('Hello World!');
});

app.listen(port, () => {
	  logger.info(`Server running on port ${port}`);
});
