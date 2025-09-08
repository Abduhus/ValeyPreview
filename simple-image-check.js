import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, 'assets', 'perfumes');

console.log('🔍 Checking image quality...\n');

// Read all files in the assets directory
const files = fs.readdirSync(ASSETS_DIR);

// Filter for Rabdan images
const rabdanImages = files.filter(file => 
  file.toLowerCase().includes('rabdan') && 
  (file.endsWith('.webp') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
);

console.log(`Found ${rabdanImages.length} Rabdan images\n`);

let totalSize = 0;
let smallImages = 0;

// Check each image
rabdanImages.forEach(file => {
  const filePath = path.join(ASSETS_DIR, file);
  const stats = fs.statSync(filePath);
  const sizeKB = stats.size / 1024;
  totalSize += stats.size;
  
  console.log(`${file}: ${sizeKB.toFixed(1)}KB`);
  
  // Flag images smaller than 50KB as potentially low quality
  if (sizeKB < 50) {
    console.log(`  ⚠️  WARNING: This image is very small and might be a thumbnail`);
    smallImages++;
  }
});

const avgSize = totalSize / rabdanImages.length / 1024;
console.log(`\n📊 Average image size: ${avgSize.toFixed(1)}KB`);

if (smallImages > 0) {
  console.log(`\n⚠️  Found ${smallImages} potentially low quality images`);
} else {
  console.log(`\n✅ All images appear to be high quality!`);
}