// Simple test to verify server can start
const { spawn } = require('child_process');

console.log('Testing server start...');

// Start the server
const serverProcess = spawn('npm', ['run', 'start'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: '5000'
  }
});

// Handle server exit
serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle server error
serverProcess.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Give the server some time to start
setTimeout(() => {
  console.log('Server should be running now');
}, 5000);