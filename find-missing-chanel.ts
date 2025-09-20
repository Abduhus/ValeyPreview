import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read both files
const allPerfumes = JSON.parse(fs.readFileSync(path.join(__dirname, '182-perfumes-processed.json'), 'utf8'));
const processedPerfumes = JSON.parse(fs.readFileSync(path.join(__dirname, 'processed-perfumes.json'), 'utf8'));

// Filter Chanel products from both files
// In 182-perfumes-processed.json, brand field contains "CHANEL" as part of the string
const allChanelPerfumes = allPerfumes.filter((p: any) => p.brand.includes('CHANEL'));
// In processed-perfumes.json, brand field is exactly "CHANEL"
const processedChanelPerfumes = processedPerfumes.filter((p: any) => p.brand === 'CHANEL');

// Create maps for easier comparison
// For allChanelPerfumes, we'll use the barcode as the key since it's unique
const allChanelMap = new Map();
allChanelPerfumes.forEach((p: any) => {
  allChanelMap.set(p.barcode, p);
});

// For processedChanelPerfumes, we'll also use the barcode as the key
const processedChanelMap = new Map();
processedChanelPerfumes.forEach((p: any) => {
  processedChanelMap.set(p.barcode, p);
});

// Find missing products
const missingProducts: any[] = [];
allChanelMap.forEach((product, barcode) => {
  if (!processedChanelMap.has(barcode)) {
    missingProducts.push(product);
  }
});

console.log(`Total Chanel products in 182-perfumes-processed.json: ${allChanelPerfumes.length}`);
console.log(`Total Chanel products in processed-perfumes.json: ${processedChanelPerfumes.length}`);
console.log(`Missing products: ${missingProducts.length}`);

if (missingProducts.length > 0) {
  console.log('\nMissing products:');
  missingProducts.forEach((product, index) => {
    console.log(`${index + 1}. ${product.fullName} (${product.barcode})`);
  });
} else {
  console.log('\nAll Chanel products are present in the processed file.');
}