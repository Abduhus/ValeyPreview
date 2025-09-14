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
console.log('Columns:', Object.keys(excelData[0] || {}));

// Read the assets/perfumes directory to get brand folders
const assetsPerfumesDir = path.join(__dirname, 'assets', 'perfumes');
const brandFolders = fs.readdirSync(assetsPerfumesDir).filter(file => {
  const fullPath = path.join(assetsPerfumesDir, file);
  return fs.statSync(fullPath).isDirectory();
});

console.log(`Found ${brandFolders.length} brand folders:`);
brandFolders.forEach(folder => console.log(`- ${folder}`));

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

// Match products to brand folders
const matchedProducts = [];
const unmatchedProducts = [];

excelData.forEach((product, index) => {
  const productName = product.Prodeuct || '';
  const brand = extractBrandFromProductName(productName);
  
  // Check if we have a folder for this brand
  const brandFolderKey = brand.toLowerCase();
  const brandFolder = brandFolderMap[brandFolderKey];
  
  if (brandFolder) {
    matchedProducts.push({
      ...product,
      brand: brand,
      brandFolder: brandFolder
    });
  } else {
    unmatchedProducts.push({
      ...product,
      brand: brand
    });
  }
});

console.log(`\nMatched ${matchedProducts.length} products to brand folders:`);
matchedProducts.forEach(product => {
  console.log(`- ${product.Prodeuct} (${product.brand}) -> ${product.brandFolder}`);
});

console.log(`\nUnmatched ${unmatchedProducts.length} products:`);
unmatchedProducts.forEach(product => {
  console.log(`- ${product.Prodeuct} (${product.brand})`);
});

// Now, for each matched product, check if we can find corresponding images in the brand folder
console.log('\n=== IMAGE MATCHING ===');

matchedProducts.forEach(product => {
  const brandFolder = product.brandFolder;
  const brandFolderPath = path.join(assetsPerfumesDir, brandFolder);
  
  // Read all files in the brand folder
  const files = fs.readdirSync(brandFolderPath);
  
  // Try to match images based on product name keywords
  const productName = product.Prodeuct.toLowerCase();
  const keywords = productName.split(' ').filter(word => 
    word.length > 2 && 
    !['the', 'and', 'or', 'of', 'in', 'on', 'with', 'for', 'to', 'by', 'at', 'as', 'is', 'it', 'an'].includes(word)
  );
  
  // Find matching images
  const matchingImages = files.filter(file => {
    const fileName = file.toLowerCase().replace(/\.(jpg|jpeg|png|webp|avif)$/i, '');
    return keywords.some(keyword => fileName.includes(keyword.toLowerCase()));
  });
  
  if (matchingImages.length > 0) {
    console.log(`\n${product.Prodeuct}:`);
    console.log(`  Found ${matchingImages.length} matching images:`);
    matchingImages.forEach(img => console.log(`    - ${img}`));
  }
});

console.log('\n=== PROCESS COMPLETE ===');