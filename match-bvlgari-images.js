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
const bvlgariProductRegex = /{\s*id:\s*"(\d+)",\s*name:\s*"([^"]*)",\s*[^}]*brand:\s*"BVLGARI"[^}]*imageUrl:\s*"([^"]*)"[^}]*moodImageUrl:\s*"([^"]*)"[^}]*}/gs;
const bvlgariProducts = [];
let match;

while ((match = bvlgariProductRegex.exec(storageContent)) !== null) {
  bvlgariProducts.push({
    id: match[1],
    name: match[2],
    imageUrl: match[3],
    moodImageUrl: match[4]
  });
}

console.log('Found Bvlgari products in catalog:');
bvlgariProducts.forEach(product => {
  console.log(`- ID: ${product.id}, Name: ${product.name}`);
  console.log(`  Image URL: ${product.imageUrl}`);
  console.log(`  Mood Image URL: ${product.moodImageUrl}`);
});

// Check existing images in the perfumes directory
const perfumesDir = path.join(__dirname, 'assets', 'perfumes');
const files = fs.readdirSync(perfumesDir);

// Filter for Bvlgari images
const bvlgariImages = files.filter(file => file.toLowerCase().includes('bvlgari') || file.toLowerCase().includes('le_gemme'));
console.log('\nFound Bvlgari images in assets:');
bvlgariImages.forEach(image => {
  console.log(`- ${image}`);
});

// Try to match images to products based on naming patterns
console.log('\n=== IMAGE TO PRODUCT MATCHING ===');

bvlgariProducts.forEach(product => {
  console.log(`\nProduct: ${product.name} (ID: ${product.id})`);
  
  // Extract product name keywords for matching
  const productName = product.name.toLowerCase();
  const keywords = productName.split(' ').filter(word => 
    word !== 'bvlgari' && word !== 'le' && word !== 'gemme'
  );
  
  console.log(`Keywords for matching: ${keywords.join(', ')}`);
  
  // Find matching images
  const matchingImages = bvlgariImages.filter(image => {
    const imageName = image.toLowerCase();
    return keywords.some(keyword => imageName.includes(keyword));
  });
  
  if (matchingImages.length > 0) {
    console.log(`Matching images found: ${matchingImages.length}`);
    matchingImages.forEach(img => console.log(`  - ${img}`));
  } else {
    console.log('No matching images found');
  }
});

console.log('\n=== VERIFICATION NEEDED ===');
console.log('Please verify that the images match the products correctly.');
console.log('If any images need to be renamed or moved, please do so manually.');