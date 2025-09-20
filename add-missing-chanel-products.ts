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
const allChanelPerfumes = allPerfumes.filter((p: any) => p.brand.includes('CHANEL'));
const processedChanelPerfumes = processedPerfumes.filter((p: any) => p.brand === 'CHANEL');

// Create maps for easier comparison using barcode as key
const allChanelMap = new Map();
allChanelPerfumes.forEach((p: any) => {
  allChanelMap.set(p.barcode, p);
});

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

console.log(`Found ${missingProducts.length} missing Chanel products.`);

// Generate new IDs for the missing products (find the highest existing ID and increment)
let maxId = 0;
processedPerfumes.forEach((p: any) => {
  const idNum = parseInt(p.id);
  if (idNum > maxId) {
    maxId = idNum;
  }
});

// Add missing products to the processed perfumes array
const updatedProcessedPerfumes = [...processedPerfumes];
let nextId = maxId + 1;

missingProducts.forEach((product: any) => {
  // Extract volume from fullName (e.g., "100 ml" from "CHANEL ALLURE HOMME (M) EDT 100 ml FR")
  let volume = "UNKNOWN";
  const volumeMatch = product.fullName.match(/(\d+)\s*ml/i);
  if (volumeMatch && volumeMatch[1]) {
    volume = volumeMatch[1] + "ml";
  }
  
  // Extract name (everything before the first parenthesis or volume)
  let name = product.fullName;
  const nameMatch = product.fullName.match(/^CHANEL\s+([^(\d]+)(?:\s*\(.*\))?.*$/i);
  if (nameMatch && nameMatch[1]) {
    name = nameMatch[1].trim();
  }
  
  // Determine gender from fullName
  let category = "unisex";
  if (product.fullName.includes('(M)')) {
    category = "men";
  } else if (product.fullName.includes('(W)')) {
    category = "women";
  }
  
  const newProduct = {
    id: nextId.toString(),
    name: name,
    brand: "CHANEL",
    price: product.price.toString(),
    volume: volume,
    category: category,
    barcode: product.barcode,
    fullName: product.fullName,
    type: product.type,
    imageUrl: "", // Will be updated when rematching photos
    moodImageUrl: "", // Will be updated when rematching photos
    images: "[]"
  };
  
  updatedProcessedPerfumes.push(newProduct);
  nextId++;
  
  console.log(`Added: ${product.fullName} (${product.barcode})`);
});

// Save the updated processed-perfumes.json file
fs.writeFileSync(
  path.join(__dirname, 'processed-perfumes.json'),
  JSON.stringify(updatedProcessedPerfumes, null, 2),
  'utf8'
);

console.log(`Successfully added ${missingProducts.length} missing Chanel products to processed-perfumes.json`);