import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the storage file to get Bvlgari product information
const storagePath = path.join(__dirname, 'server', 'storage.ts');
const storageContent = fs.readFileSync(storagePath, 'utf8');

// Extract Bvlgari products from storage with more detailed info
const bvlgariProductRegex = /{\s*id:\s*"(\d+)",\s*name:\s*"([^"]*)",\s*description:\s*"([^"]*)",\s*price:\s*"([^"]*)",\s*category:\s*"([^"]*)",\s*brand:\s*"BVLGARI",\s*volume:\s*"([^"]*)",\s*rating:\s*"([^"]*)",\s*imageUrl:\s*"([^"]*)",\s*moodImageUrl:\s*"([^"]*)"[^}]*}/gs;
const bvlgariProducts = [];
let match;

while ((match = bvlgariProductRegex.exec(storageContent)) !== null) {
  bvlgariProducts.push({
    id: match[1],
    name: match[2],
    description: match[3],
    price: match[4],
    category: match[5],
    volume: match[6],
    rating: match[7],
    imageUrl: match[8],
    moodImageUrl: match[9]
  });
}

console.log('=== BVLGARI PRODUCTS IN CATALOG ===');
bvlgariProducts.forEach((product, index) => {
  console.log(`${index + 1}. ${product.name} (ID: ${product.id})`);
  console.log(`   Current Image URL: ${product.imageUrl}`);
  console.log(`   Current Mood Image URL: ${product.moodImageUrl}`);
});

// Check existing images in the perfumes directory
const perfumesDir = path.join(__dirname, 'assets', 'perfumes');
const files = fs.readdirSync(perfumesDir);

// Filter for Bvlgari images
const bvlgariImages = files.filter(file => file.toLowerCase().includes('bvlgari') || file.toLowerCase().includes('le_gemme'));
console.log('\n=== EXISTING BVLGARI IMAGES ===');
bvlgariImages.forEach((image, index) => {
  console.log(`${index + 1}. ${image}`);
});

// Create a mapping of product names to keywords for better matching
const productKeywords = {
  'BVLGARI LE GEMME MAN TYGAR': ['man', 'tygar'],
  'BVLGARI LE GEMME KOBRAA': ['kobraa'],
  'BVLGARI LE GEMME SAHARE': ['sahare'],
  'BVLGARI LE GEMME MEN ONEKH': ['men', 'onekh'],
  'BVLGARI LE GEMME OROM': ['orom'],
  'BVLGARI LE GEMME FALKAR': ['falkar'],
  'BVLGARI LE GEMME GYAN': ['gyan'],
  'BVLGARI LE GEMME AMUNE': ['amune']
};

// Function to find matching images for a product
function findMatchingImages(productName, allImages) {
  const keywords = productKeywords[productName] || [];
  if (keywords.length === 0) return [];
  
  return allImages.filter(image => {
    const imageName = image.toLowerCase();
    return keywords.some(keyword => imageName.includes(keyword));
  });
}

console.log('\n=== IMAGE MATCHING RESULTS ===');
const matchedProducts = [];

bvlgariProducts.forEach(product => {
  console.log(`\n${product.name}:`);
  
  // Find matching images
  const matchingImages = findMatchingImages(product.name, bvlgariImages);
  
  if (matchingImages.length > 0) {
    console.log(`  Found ${matchingImages.length} matching images:`);
    matchingImages.forEach(img => console.log(`    - ${img}`));
    
    // Select primary and secondary images
    let primaryImage = matchingImages.find(img => img.includes('_1')) || matchingImages[0];
    let secondaryImage = matchingImages.find(img => img.includes('_2')) || matchingImages[1] || primaryImage;
    
    // If we have the exact named images, use those
    const exactPrimary = matchingImages.find(img => img === path.basename(product.imageUrl));
    const exactSecondary = matchingImages.find(img => img === path.basename(product.moodImageUrl));
    
    if (exactPrimary) primaryImage = exactPrimary;
    if (exactSecondary) secondaryImage = exactSecondary;
    
    matchedProducts.push({
      ...product,
      primaryImage,
      secondaryImage
    });
    
    console.log(`  Selected primary: ${primaryImage}`);
    console.log(`  Selected secondary: ${secondaryImage}`);
  } else {
    console.log('  No matching images found');
    matchedProducts.push({
      ...product,
      primaryImage: null,
      secondaryImage: null
    });
  }
});

// Generate report of what needs to be done
console.log('\n=== ACTION PLAN ===');
console.log('1. Verify that the selected images match the product descriptions');
console.log('2. If images need to be renamed to match the product naming convention:');
console.log('   - Format: bvlgari_le_gemme_[product_name_lowercase]_[volume]_[product_id]_[image_number].webp');

matchedProducts.forEach(product => {
  console.log(`\n${product.name}:`);
  if (product.primaryImage) {
    console.log(`  Primary image: ${product.primaryImage}`);
    console.log(`  Should be named: ${path.basename(product.imageUrl)}`);
    if (product.primaryImage !== path.basename(product.imageUrl)) {
      console.log(`  ACTION: Rename ${product.primaryImage} to ${path.basename(product.imageUrl)}`);
    }
  }
  
  if (product.secondaryImage) {
    console.log(`  Secondary image: ${product.secondaryImage}`);
    console.log(`  Should be named: ${path.basename(product.moodImageUrl)}`);
    if (product.secondaryImage !== path.basename(product.moodImageUrl)) {
      console.log(`  ACTION: Rename ${product.secondaryImage} to ${path.basename(product.moodImageUrl)}`);
    }
  }
});

// Check for unused Bvlgari images
const usedImages = matchedProducts.flatMap(product => [
  product.primaryImage,
  product.secondaryImage
]).filter(Boolean);

const unusedImages = bvlgariImages.filter(image => !usedImages.includes(image));

if (unusedImages.length > 0) {
  console.log('\n=== UNUSED BVLGARI IMAGES ===');
  console.log('These images are not currently matched to any product:');
  unusedImages.forEach(img => console.log(`  - ${img}`));
}

console.log('\n=== NEXT STEPS ===');
console.log('1. Manually verify the image-to-product matching');
console.log('2. Rename images as needed to match the expected naming convention');
console.log('3. Update the storage.ts file if image paths change');
console.log('4. Consider downloading additional high-quality images from Bvlgari official website');