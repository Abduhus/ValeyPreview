// Test script to simulate Railway deployment environment
const { spawn } = require('child_process');
const path = require('path');

console.log('=== Testing Railway Deployment Environment ===\n');

// Set Railway environment variables to simulate Railway deployment
const env = {
  ...process.env,
  RAILWAY_ENVIRONMENT: 'production',
  NODE_ENV: 'production',
  PORT: '5000'
};

console.log('Setting Railway environment variables:');
console.log('  RAILWAY_ENVIRONMENT=production');
console.log('  NODE_ENV=production');
console.log('  PORT=5000');
console.log('');

// Test the start.sh script
console.log('Testing start.sh script execution...\n');

const startScript = spawn('bash', ['start.sh'], {
  cwd: __dirname,
  env: env
});

let outputReceived = false;

startScript.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  outputReceived = true;
  
  // If we see the "Running on Railway" message, we know it's working
  if (output.includes('Running on Railway')) {
    console.log('\n✅ Railway environment detection working correctly');
    startScript.kill();
  }
  
  // If we see build process starting, that's also good
  if (output.includes('Building project')) {
    console.log('\n✅ Build process started correctly');
    startScript.kill();
  }
});

startScript.stderr.on('data', (data) => {
  const output = data.toString();
  process.stderr.write(`stderr: ${output}`);
});

startScript.on('close', (code) => {
  console.log(`\nStart script process exited with code ${code}`);
  if (outputReceived) {
    console.log('✅ Start script executed successfully');
  } else {
    console.log('❌ Start script failed to produce output');
  }
  
  console.log('\n=== Test Complete ===');
});

// Timeout after 15 seconds
setTimeout(() => {
  console.log('\n⚠️  Test timeout - killing process');
  startScript.kill();
}, 15000);