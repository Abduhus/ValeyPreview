const express = require('express');

const app = express();

// Simple test endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Port binding test successful',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 'Not set'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 'Not set'
  });
});

// Start server
const port = parseInt(process.env.PORT || '10000', 10);
const host = '0.0.0.0';

console.log(`Starting test server on ${host}:${port}...`);

const server = app.listen(port, host, () => {
  console.log(`✅ Test server listening on http://${host}:${port}`);
  console.log(`✅ Health check: http://${host}:${port}/health`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('🚨 Server failed to start:', error);
  process.exit(1);
});