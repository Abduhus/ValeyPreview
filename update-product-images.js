import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the Excel file
const workbook = XLSX.readFile('565 .xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const excelData = XLSX.utils.sheet_to_json(worksheet);

console.log(`Found ${excelData.length} products in Excel file`);

// Read the assets/perfumes directory to get brand folders
const assetsPerfumesDir = path.join(__dirname, 'assets', 'perfumes');
const brandFolders = fs.readdirSync(assetsPerfumesDir).filter(file => {
  const fullPath = path.join(assetsPerfumesDir, file);
  return fs.statSync(fullPath).isDirectory();
});

console.log(`Found ${brandFolders.length} brand folders`);

// Create a mapping of brand names to folder names (case insensitive)
const brandFolderMap = {};
brandFolders.forEach(folder => {
  brandFolderMap[folder.toLowerCase()] = folder;
});

// Function to normalize brand names
function normalizeBrandName(brandName) {
  // Remove common words and normalize
  return brandName
    .replace(/^(ESCENTRIC MOLECULE|ESCENTRIC MOLECULES|ESCENTRIC)/i, 'ESCENTRIC')
    .replace(/^(MARC ANTOINE|BARROIS|BARRIOS)/i, 'MARC')
    .replace(/^(GIARDINI DI TOSCANA|GIARDINI)/i, 'GIARDINI')
    .replace(/^(BOHOBOCO|BOHOCO)/i, 'BOHOBOCO')
    .replace(/^(DIPTYQUE)/i, 'DIPTYQUE')
    .replace(/^(BVLGARI|BULGARI)/i, 'BVLGARI')
    .replace(/^(CHRISTIAN DIOR|DIOR)/i, 'DIOR')
    .replace(/^(CORETERNO)/i, 'CORETERNO')
    .replace(/^(PURE ESSENCE)/i, 'PURE ESSENCE')
    .replace(/^(SIGNATURE ROYALE)/i, 'SIGNATURE ROYALE')
    .replace(/^(RABDAN)/i, 'RABDAN')
    .replace(/^(VALLEY BREEZES)/i, 'VALLEY BREEZES')
    .trim();
}

// Function to extract brand from product name
function extractBrandFromProductName(productName) {
  const normalized = normalizeBrandName(productName);
  
  // Special handling for some brands
  if (normalized.includes('ESCENTRIC')) return 'ESCENTRIC';
  if (normalized.includes('MARC')) return 'MARC';
  if (normalized.includes('GIARDINI')) return 'GIARDINI';
  if (normalized.includes('BOHOBOCO')) return 'BOHOBOCO';
  if (normalized.includes('DIPTYQUE')) return 'DIPTYQUE';
  if (normalized.includes('BVLGARI')) return 'BVLGARI';
  if (normalized.includes('DIOR')) return 'DIOR';
  if (normalized.includes('CORETERNO')) return 'CORETERNO';
  if (normalized.includes('PURE ESSENCE')) return 'PURE ESSENCE';
  if (normalized.includes('SIGNATURE ROYALE')) return 'SIGNATURE ROYALE';
  if (normalized.includes('RABDAN')) return 'RABDAN';
  if (normalized.includes('VALLEY BREEZES')) return 'VALLEY BREEZES';
  
  return 'UNKNOWN';
}

// Function to extract specific product keywords for matching
function extractProductKeywords(productName) {
  // Remove brand names and common words
  const cleanedName = productName
    .replace(/^(ESCENTRIC MOLECULE|ESCENTRIC MOLECULES|ESCENTRIC)/i, '')
    .replace(/^(MARC ANTOINE|BARROIS|BARRIOS)/i, '')
    .replace(/^(GIARDINI DI TOSCANA|GIARDINI)/i, '')
    .replace(/^(BOHOBOCO|BOHOCO)/i, '')
    .replace(/^(DIPTYQUE)/i, '')
    .replace(/^(BVLGARI|BULGARI)/i, '')
    .replace(/^(CHRISTIAN DIOR|DIOR)/i, '')
    .replace(/^(CORETERNO)/i, '')
    .replace(/^(PURE ESSENCE)/i, '')
    .replace(/^(SIGNATURE ROYALE)/i, '')
    .replace(/^(RABDAN)/i, '')
    .replace(/^(VALLEY BREEZES)/i, '')
    .replace(/\d+ml/i, '') // Remove volume
    .replace(/\d+ml/i, '') // Remove volume again
    .replace(/EDP|EDT|EXTRAIT DE PARFUM|Eau De Parfum|Eau de Parfum|Eau De Toilette|Parfum|Perfume/i, '')
    .trim();
  
  // Split into keywords
  const keywords = cleanedName.split(' ').filter(word => 
    word.length > 2 && 
    !['the', 'and', 'or', 'of', 'in', 'on', 'with', 'for', 'to', 'by', 'at', 'as', 'is', 'it', 'an', 'de', 'la', 'le', 'du', 'des'].includes(word.toLowerCase())
  );
  
  return keywords;
}

// Match products to brand folders
const matchedProducts = [];

excelData.forEach((product, index) => {
  const productName = product.Prodeuct || '';
  const brand = extractBrandFromProductName(productName);
  
  // Check if we have a folder for this brand
  const brandFolderKey = brand.toLowerCase();
  const brandFolder = brandFolderMap[brandFolderKey];
  
  matchedProducts.push({
    ...product,
    brand: brand,
    brandFolder: brandFolder,
    keywords: extractProductKeywords(productName)
  });
});

console.log(`Matched ${matchedProducts.length} products to brand folders`);

// Function to find matching images for a product
function findMatchingImages(product) {
  const matchingImages = [];
  
  if (product.brandFolder) {
    const brandFolderPath = path.join(assetsPerfumesDir, product.brandFolder);
    
    // Check if the brand folder exists
    if (fs.existsSync(brandFolderPath)) {
      const files = fs.readdirSync(brandFolderPath);
      
      // Find matching images based on keywords
      files.forEach(file => {
        const filePath = path.join(brandFolderPath, file);
        
        // Skip directories
        if (fs.statSync(filePath).isDirectory()) {
          return;
        }
        
        const fileName = path.parse(file).name.toLowerCase();
        const matches = product.keywords.some(keyword => 
          fileName.includes(keyword.toLowerCase())
        );
        
        if (matches) {
          // Create the correct path format
          const relativePath = `/perfumes/${product.brandFolder}/${file}`;
          matchingImages.push(relativePath);
        }
      });
    }
  }
  
  return matchingImages;
}

// Generate the updated storage content
const storagePath = path.join(__dirname, 'server', 'storage.ts');
let storageContent = fs.readFileSync(storagePath, 'utf8');

console.log('\n=== UPDATING PRODUCT IMAGES ===');

// Process each product and update its image paths
matchedProducts.forEach((product, index) => {
  const matchingImages = findMatchingImages(product);
  
  if (matchingImages.length > 0) {
    console.log(`\n${product.Prodeuct}:`);
    console.log(`  Found ${matchingImages.length} matching images:`);
    matchingImages.forEach(img => console.log(`    - ${img}`));
    
    // Update the storage content with the new image paths
    // We'll look for the product by its name in the storage file
    const productName = product.Prodeuct.replace(/"/g, '\\"'); // Escape quotes
    const productRegex = new RegExp(`({\\s*id:\\s*"\\d+",\\s*name:\\s*"${productName}",[\\s\\S]*?)(imageUrl:\\s*"[^"]*")(,[\\s\\S]*?moodImageUrl:\\s*"[^"]*")(,[\\s\\S]*?})`, 'g');
    
    storageContent = storageContent.replace(productRegex, (match, prefix, imageUrlPart, moodImageUrlPart, suffix) => {
      // Use the first image as main image and second as mood image (if available)
      const mainImage = matchingImages[0] || imageUrlPart.match(/"([^"]*)"/)[1];
      const moodImage = matchingImages[1] || matchingImages[0] || moodImageUrlPart.match(/"([^"]*)"/)[1];
      
      // Create the images array
      const imagesArray = JSON.stringify(matchingImages.slice(2)); // Remaining images
      
      // Replace the image URLs
      const newImageUrlPart = `imageUrl: "${mainImage}"`;
      const newMoodImageUrlPart = `moodImageUrl: "${moodImage}"`;
      
      // Add the images array if it doesn't exist
      const imagesPart = `images: JSON.stringify(${imagesArray})`;
      
      // Check if images property already exists
      if (suffix.includes('images:')) {
        // Update existing images property
        return `${prefix}${newImageUrlPart}${newMoodImageUrlPart},${suffix.replace(/images:\s*JSON\.stringify\([^)]*\)/, imagesPart)}`;
      } else {
        // Add images property
        return `${prefix}${newImageUrlPart}${newMoodImageUrlPart},\n        ${imagesPart}${suffix}`;
      }
    });
  }
});

// Write the updated storage content back to the file
fs.writeFileSync(storagePath, storageContent);

console.log('\n=== STORAGE FILE UPDATED ===');
console.log('The storage.ts file has been updated with the correct image paths.');

console.log('\n=== PROCESS COMPLETE ===');