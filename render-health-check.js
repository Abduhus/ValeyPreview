// Simple health check script for Render
// This script can be used to verify that the application is running correctly

const http = require('http');

// Get port from environment or default to 10000
const port = process.env.PORT || 10000;
const host = 'localhost';

console.log(`Checking health of application on ${host}:${port}`);

// Make a simple HTTP request to the health endpoint
const options = {
  hostname: host,
  port: port,
  path: '/health',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`Health check response status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('Health check response:', jsonData);
      if (jsonData.status === 'ok') {
        console.log('✅ Application is healthy');
        process.exit(0);
      } else {
        console.log('❌ Application is not healthy');
        process.exit(1);
      }
    } catch (error) {
      console.log('Health check response (raw):', data);
      // Even if we can't parse JSON, if we got a 200 response, consider it healthy
      if (res.statusCode === 200) {
        console.log('✅ Application responded with 200 OK');
        process.exit(0);
      } else {
        console.log('❌ Application did not respond with 200 OK');
        process.exit(1);
      }
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Health check failed:', error.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('❌ Health check timed out');
  req.destroy();
  process.exit(1);
});

req.end();