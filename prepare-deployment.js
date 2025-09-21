#!/usr/bin/env node

// Script to prepare the project for deployment
// This ensures all assets are in the correct locations

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== ValleyPreview Deployment Preparation Script ===');

// Function to copy files from source to destination
function copyFiles(source, destination) {
  try {
    console.log(`Copying files from ${source} to ${destination}...`);
    
    // Ensure destination directory exists
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
      console.log(`Created directory: ${destination}`);
    }
    
    // Use appropriate copy command based on platform
    if (process.platform === 'win32') {
      execSync(`xcopy "${source}" "${destination}" /Y /E`, { stdio: 'inherit' });
    } else {
      execSync(`cp -r "${source}"/* "${destination}"`, { stdio: 'inherit' });
    }
    
    console.log('Files copied successfully!');
  } catch (error) {
    console.error('Error copying files:', error.message);
    process.exit(1);
  }
}

// Function to install devDependencies for Render deployment
function installDevDependencies() {
  try {
    console.log('Installing devDependencies for Render deployment...');
    execSync('npm install --include=dev', { stdio: 'inherit' });
    console.log('devDependencies installed successfully!');
  } catch (error) {
    console.error('Error installing devDependencies:', error.message);
    process.exit(1);
  }
}

// Function to verify asset files exist
function verifyAssets() {
  const requiredAssets = [
    'assets/Best_tom_ford_perfumes_1980x.webp',
    'assets/chanel-no5.jpg',
    'assets/Creed-Perfume-.png',
    'assets/YSL_black-opium_1686207039.jpg',
    'assets/armani-acqua-di-gio.jpg',
    'assets/dior-sauvage.webp',
    'assets/versace-eros.jpg',
    'assets/xerjoff-aventus.jpg'
  ];
  
  console.log('Verifying asset files...');
  let allExist = true;
  
  for (const asset of requiredAssets) {
    if (!fs.existsSync(asset)) {
      console.error(`❌ Missing asset: ${asset}`);
      allExist = false;
    } else {
      console.log(`✅ Found asset: ${asset}`);
    }
  }
  
  if (!allExist) {
    console.error('Some required assets are missing!');
    process.exit(1);
  }
  
  console.log('✅ All required assets found!');
}

try {
  // Install devDependencies for Render deployment
  installDevDependencies();
  
  // Copy client public assets to root assets directory
  const clientPublicAssets = path.join('client', 'public', 'assets');
  const rootAssets = 'assets';
  
  if (fs.existsSync(clientPublicAssets)) {
    copyFiles(clientPublicAssets, rootAssets);
  } else {
    console.log(`Client public assets directory not found: ${clientPublicAssets}`);
  }
  
  // Verify that required assets exist
  verifyAssets();
  
  console.log('=== Deployment preparation completed successfully! ===');
  console.log('You can now run "npm run build" and deploy to Render.');
  
} catch (error) {
  console.error('Deployment preparation failed:', error.message);
  process.exit(1);
}