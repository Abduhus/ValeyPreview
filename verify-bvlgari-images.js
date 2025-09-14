import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the storage file to get Bvlgari product information
const storagePath = path.join(__dirname, 'server', 'storage.ts');
const storageContent = fs.readFileSync(storagePath, 'utf8');

// Extract Bvlgari products from storage
const bvlgariProductRegex = /{\s*id:\s*"(\d+)",\s*name:\s*"([^"]*)",\s*[^}]*brand:\s*"BVLGARI"[^}]*imageUrl:\s*"([^"]*)"[^}]*moodImageUrl:\s*"([^"]*)"[^}]*images:\s*JSON\.stringify\(\[([^\]]*)\]/gs;
const bvlgariProducts = [];
let match;

while ((match = bvlgariProductRegex.exec(storageContent)) !== null) {
  // Extract additional images
  const imagesContent = match[5];
  const imagePaths = [];
  
  // Extract individual image paths
  const imagePathRegex = /"([^"]+)"/g;
  let imageMatch;
  while ((imageMatch = imagePathRegex.exec(imagesContent)) !== null) {
    imagePaths.push(imageMatch[1]);
  }
  
  bvlgariProducts.push({
    id: match[1],
    name: match[2],
    imageUrl: match[3],
    moodImageUrl: match[4],
    additionalImages: imagePaths
  });
}

console.log('Found Bvlgari products in catalog:');
console.log('====================================');

let allImagesValid = true;

bvlgariProducts.forEach(product => {
  console.log(`\nProduct: ${product.name} (ID: ${product.id})`);
  
  // Check main image
  const mainImagePath = path.join(__dirname, 'assets', product.imageUrl.substring(1));
  const mainImageExists = fs.existsSync(mainImagePath);
  console.log(`  Main image: ${product.imageUrl} - ${mainImageExists ? '✓ VALID' : '✗ MISSING'}`);
  if (!mainImageExists) allImagesValid = false;
  
  // Check mood image
  const moodImagePath = path.join(__dirname, 'assets', product.moodImageUrl.substring(1));
  const moodImageExists = fs.existsSync(moodImagePath);
  console.log(`  Mood image: ${product.moodImageUrl} - ${moodImageExists ? '✓ VALID' : '✗ MISSING'}`);
  if (!moodImageExists) allImagesValid = false;
  
  // Check additional images
  if (product.additionalImages.length > 0) {
    console.log('  Additional images:');
    product.additionalImages.forEach(imagePath => {
      const fullPath = path.join(__dirname, 'assets', imagePath.substring(1));
      const imageExists = fs.existsSync(fullPath);
      console.log(`    ${imagePath} - ${imageExists ? '✓ VALID' : '✗ MISSING'}`);
      if (!imageExists) allImagesValid = false;
    });
  } else {
    console.log('  No additional images');
  }
});

console.log('\n====================================');
if (allImagesValid) {
  console.log('✓ ALL BVLGARI IMAGE PATHS ARE VALID');
} else {
  console.log('✗ SOME BVLGARI IMAGE PATHS ARE MISSING');
}

console.log("\nVerification complete.");