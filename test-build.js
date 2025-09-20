const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing build process...');

try {
  // Clean dist directory if it exists
  if (fs.existsSync('dist')) {
    console.log('🗑️  Cleaning dist directory...');
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Run the build command
  console.log('🔨 Running build command: npm run build');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Check if dist directory was created
  if (fs.existsSync('dist')) {
    console.log('✅ Build completed successfully');
    
    // Check contents of dist directory
    const distContents = fs.readdirSync('dist');
    console.log('📁 dist directory contents:', distContents);
    
    // Check if server directory exists
    if (fs.existsSync('dist/server')) {
      const serverContents = fs.readdirSync('dist/server');
      console.log('📁 dist/server contents:', serverContents);
    } else {
      console.log('⚠️  dist/server directory not found');
    }
    
    // Check if public directory exists
    if (fs.existsSync('dist/public')) {
      const publicContents = fs.readdirSync('dist/public');
      console.log('📁 dist/public contents:', publicContents);
    } else {
      console.log('⚠️  dist/public directory not found');
    }
    
  } else {
    console.log('❌ Build failed - dist directory not created');
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}