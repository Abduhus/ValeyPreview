// Simple test to check if the server starts correctly
const { spawn } = require('child_process');

// Start the dev server
const server = spawn('npm', ['run', 'dev'], {
  cwd: process.cwd(),
  stdio: 'pipe'
});

let serverStarted = false;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  if (output.includes('serving on port')) {
    serverStarted = true;
    console.log('Server started successfully!');
    server.kill();
    process.exit(0);
  }
});

server.stderr.on('data', (data) => {
  const error = data.toString();
  console.error('Error:', error);
  
  if (error.includes('Error') || error.includes('ERR_')) {
    server.kill();
    process.exit(1);
  }
});

// Timeout after 10 seconds
setTimeout(() => {
  if (!serverStarted) {
    console.log('Server did not start within 10 seconds');
    server.kill();
    process.exit(1);
  }
}, 10000);