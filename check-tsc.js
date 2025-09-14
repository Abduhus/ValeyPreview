// Script to check if TypeScript compiler is available
const { execSync } = require('child_process');

console.log('=== Checking TypeScript Compiler Availability ===\n');

try {
  // Check if tsc is available
  const version = execSync('tsc --version', { encoding: 'utf8' });
  console.log('✅ TypeScript compiler (tsc) is available:');
  console.log(version);
} catch (error) {
  console.log('❌ TypeScript compiler (tsc) is not available');
  console.log('Error:', error.message);
  
  console.log('\nTo install TypeScript globally:');
  console.log('  npm install -g typescript');
  
  console.log('\nTo install TypeScript as a dev dependency:');
  console.log('  npm install --save-dev typescript');
}

console.log('\n=== Check Complete ===');