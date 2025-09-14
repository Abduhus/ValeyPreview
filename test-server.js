// Simple test script to verify server can start
const { spawn } = require('child_process');

console.log('Testing server startup...');

// Set environment variables
process.env.NODE_ENV = 'development';

// Start the server
const server = spawn('node', ['-r', 'tsx', 'server/index.ts'], {
  cwd: __dirname,
  env: process.env
});

let serverStarted = false;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`stdout: ${output}`);
  
  if (output.includes('serving on port')) {
    console.log('Server started successfully!');
    serverStarted = true;
    server.kill();
  }
});

server.stderr.on('data', (data) => {
  const output = data.toString();
  console.error(`stderr: ${output}`);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  if (serverStarted) {
    console.log('✅ Server test passed');
  } else {
    console.log('❌ Server failed to start');
  }
});

// Timeout after 10 seconds
setTimeout(() => {
  if (!serverStarted) {
    console.log('Timeout: Server did not start within 10 seconds');
    server.kill();
  }
}, 10000);