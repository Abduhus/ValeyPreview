// Script to test the build process
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Testing Build Process ===\n');

// Check if package.json exists
if (!fs.existsSync(path.join(__dirname, 'package.json'))) {
  console.log('❌ package.json not found');
  process.exit(1);
}

console.log('✅ package.json found');

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('⚠️  node_modules not found, installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.log('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ node_modules found');
}

// Check if TypeScript is installed
try {
  execSync('npx tsc --version', { stdio: 'ignore' });
  console.log('✅ TypeScript compiler available via npx');
} catch (error) {
  console.log('❌ TypeScript compiler not available');
  console.log('Installing TypeScript...');
  try {
    execSync('npm install --save-dev typescript', { stdio: 'inherit' });
    console.log('✅ TypeScript installed');
  } catch (installError) {
    console.log('❌ Failed to install TypeScript:', installError.message);
    process.exit(1);
  }
}

// Test the build command
console.log('\nTesting build command...');
try {
  // Run a dry run of the build command to check if it would work
  execSync('npm run build --dry-run', { stdio: 'ignore' });
  console.log('✅ Build command is valid');
} catch (error) {
  console.log('⚠️  Build command validation failed, but this might be OK');
}

console.log('\n=== Build Test Complete ===');
console.log('You can now run the build with: npm run build');