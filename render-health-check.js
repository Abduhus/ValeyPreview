// Health check script for Render deployment
// This script verifies that all necessary build steps completed successfully

const fs = require('fs');
const path = require('path');

console.log('=== Render Health Check for ValleyPreview ===');

// Check if required directories exist
const requiredDirs = [
  'dist',
  'dist/public',
  'dist/server'
];

// Check if required files exist
const requiredFiles = [
  'dist/server/index.cjs',
  'dist/public/index.html',
  'package.json',
  'render.json'
];

console.log('Checking required directories...');
let allDirsExist = true;
for (const dir of requiredDirs) {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`✓ ${dir} exists`);
  } else {
    console.log(`✗ ${dir} is missing`);
    allDirsExist = false;
  }
}

console.log('\nChecking required files...');
let allFilesExist = true;
for (const file of requiredFiles) {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    console.log(`✓ ${file} exists`);
  } else {
    console.log(`✗ ${file} is missing`);
    allFilesExist = false;
  }
}

if (allDirsExist && allFilesExist) {
  console.log('\n✓ All required files and directories are present');
  console.log('✓ Render deployment should succeed');
  process.exit(0);
} else {
  console.log('\n✗ Missing required files or directories');
  console.log('✗ Render deployment may fail');
  process.exit(1);
}