const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Testing TypeScript compilation...');

try {
  // Run TypeScript compilation with verbose output
  console.log('🔨 Running TypeScript compilation...');
  const output = execSync('tsc --project tsconfig.build.json --noEmit false --outDir dist/server --listEmittedFiles', { 
    stdio: 'pipe',
    encoding: 'utf8'
  });
  
  console.log('Output:', output);
  
} catch (error) {
  console.log('Error output:', error.stdout);
  console.error('Error message:', error.message);
  console.error('Error stderr:', error.stderr);
}