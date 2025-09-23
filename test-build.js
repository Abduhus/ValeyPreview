// Test script to verify build process
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== Build Process Test ===');

// Check if dist directory exists
const distPath = path.resolve(__dirname, 'dist');
console.log('Dist directory exists:', fs.existsSync(distPath));

// Check if dist/public directory exists
const distPublicPath = path.resolve(__dirname, 'dist', 'public');
console.log('Dist/public directory exists:', fs.existsSync(distPublicPath));

if (fs.existsSync(distPublicPath)) {
  // List files in dist/public
  try {
    const files = fs.readdirSync(distPublicPath);
    console.log('Files in dist/public:', files);
  } catch (e) {
    console.log('Error reading dist/public:', e.message);
  }
}

// Check if client directory exists
const clientPath = path.resolve(__dirname, 'client');
console.log('Client directory exists:', fs.existsSync(clientPath));

if (fs.existsSync(clientPath)) {
  // List files in client
  try {
    const files = fs.readdirSync(clientPath);
    console.log('Files in client:', files);
  } catch (e) {
    console.log('Error reading client:', e.message);
  }
}

console.log('\n=== Test Completed ===');