const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Building full application...');

try {
  // Clean dist directory if it exists
  if (fs.existsSync('dist')) {
    console.log('🗑️  Cleaning dist directory...');
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Create dist directories
  console.log('📁 Creating dist directories...');
  fs.mkdirSync('dist/server', { recursive: true });
  fs.mkdirSync('dist/public', { recursive: true });

  // Run TypeScript compilation
  console.log('🔨 Running TypeScript compilation...');
  execSync('npx tsc --project tsconfig.build.json', { stdio: 'inherit' });
  
  // Check if server files were created
  if (fs.existsSync('dist/server')) {
    const serverFiles = fs.readdirSync('dist/server');
    console.log('✅ Server files created:', serverFiles);
  } else {
    console.log('⚠️  dist/server directory not found after TypeScript compilation');
  }

  // Run Vite build
  console.log('🔨 Running Vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Check final dist contents
  console.log('📁 Final dist directory contents:');
  if (fs.existsSync('dist')) {
    const distContents = fs.readdirSync('dist');
    console.log('  dist/', distContents);
    
    for (const item of distContents) {
      const itemPath = path.join('dist', item);
      if (fs.statSync(itemPath).isDirectory()) {
        const subContents = fs.readdirSync(itemPath);
        console.log(`    ${item}/`, subContents.slice(0, 5)); // Show first 5 items
        if (subContents.length > 5) {
          console.log(`      ... and ${subContents.length - 5} more items`);
        }
      }
    }
  }
  
  console.log('🎉 Full build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}