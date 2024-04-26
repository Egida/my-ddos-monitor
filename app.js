const express = require('express');
const app = express();
const port = 3001;

let requestCount = 0;

app.get('/', (req, res) => {
	  requestCount++;
	  const realIp = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.ip;
	  console.log(`Received ${requestCount} requests so far.`);
	  console.log(`Request from IP: ${realIp}, Time: ${new Date().toISOString()}`);
	  res.send('Hello World!');
});


app.listen(port, () => {
	  console.log(`Server running on port ${port}`);
});
