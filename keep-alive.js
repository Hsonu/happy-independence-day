const https = require('https');
const url = 'https://happy-independence-day-2.onrender.com/';

console.log(`[${new Date().toISOString()}] Starting ping service for ${url}...`);

function ping() {
  https.get(url, (res) => {
    console.log(`[${new Date().toISOString()}] Pinged successfully. Status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Ping failed:`, err.message);
  });
}

// Ping immediately
ping();

// Ping every 5 minutes (300,000 ms)
setInterval(ping, 300000);
