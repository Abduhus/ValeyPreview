import XLSX from 'xlsx';
const fs = require('fs');
const path = require('path');

// Create brand folders and move images
const brands = [
  'BOHOBOCO',
  'BVLGARI',
  'CHANEL',
  'CHRISTIAN DIOR',
  'CORETERNO',
  'DIPTYQUE',
  'ESCENTRIC MOLECULE',
  'GIARDINI DI TOSCANA',
  'MARC ANTOINE BARRIOS',
  'MARC ANTOINE BARROIS',
  'PURE ESSENCE',
  'RABDAN',
  'SIGNATURE ROYALE',
  'VERSACE',
  'XERJOFF'
];

// Brand name to folder name mapping
const brandFolderMapping = {
  'BOHOBOCO': 'Bohoboco',
  'BVLGARI': 'bvlgari',
  'CHANEL': 'chanel',
  'CHRISTIAN DIOR': 'dior',
  'CORETERNO': 'Coreterno',
  'DIPTYQUE': 'diptyque',
  'ESCENTRIC MOLECULE': 'Escentric',
  'GIARDINI DI TOSCANA': 'Giardini',
  'MARC ANTOINE BARRIOS': 'marc antoine',
  'MARC ANTOINE BARROIS': 'marc antoine',
  'PURE ESSENCE': 'PureEssence',
  'RABDAN': 'Rabdan',
  'SIGNATURE ROYALE': 'SignatureRoyale',
  'VERSACE': 'Versace',
  'XERJOFF': 'Xerjoff'
};

// Create brand folders if they don't exist
brands.forEach(brand => {
  const folderName = brandFolderMapping[brand];
  const folderPath = path.join('assets', 'perfumes', folderName);
  
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created folder: ${folderPath}`);
  }
});

// Get all image files in the perfumes directory (only from root, not subdirectories)
function getImageFilesFromRoot(dirPath) {
  let results = [];
  const list = fs.readdirSync(dirPath);
  list.forEach(file => {
    const fullPath = path.resolve(dirPath, file);
    const stat = fs.statSync(fullPath);
    // Only process files in the root directory, not subdirectories
    if (stat && stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.webp' || ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        results.push({
          name: file,
          fullPath: fullPath
        });
      }
    }
  });
  return results;
}

// Get all image files from root perfumes directory
const perfumesDir = path.join('assets', 'perfumes');
const imageFiles = getImageFilesFromRoot(perfumesDir);

console.log(`Found ${imageFiles.length} image files in the root perfumes directory`);

// Match images to brands based on naming patterns
let movedCount = 0;

imageFiles.forEach(image => {
  const imageName = image.name.toLowerCase();
  let targetFolder = null;
  
  // Check each brand to see if it matches the image name
  for (const brand of brands) {
    const brandName = brand.toLowerCase();
    const folderName = brandFolderMapping[brand];
    
    // Check for brand name in image filename
    if (imageName.includes(brandName.replace(/\s+/g, '')) || 
        imageName.includes(brandName.replace(/\s+/g, '_')) ||
        imageName.includes(brandName.split(' ')[0].toLowerCase())) {
      targetFolder = folderName;
      break;
    }
    
    // Special cases for brand matching
    if (brand === 'CHRISTIAN DIOR' && (imageName.includes('dior') || imageName.includes('christian'))) {
      targetFolder = folderName;
      break;
    }
    
    if (brand === 'ESCENTRIC MOLECULE' && imageName.includes('escentric')) {
      targetFolder = folderName;
      break;
    }
    
    if (brand === 'GIARDINI DI TOSCANA' && (imageName.includes('giardini') || imageName.includes('toscano'))) {
      targetFolder = folderName;
      break;
    }
    
    if ((brand === 'MARC ANTOINE BARRIOS' || brand === 'MARC ANTOINE BARROIS') && imageName.includes('marc')) {
      targetFolder = folderName;
      break;
    }
    
    // Check for Signature Royale special cases
    if (brand === 'SIGNATURE ROYALE' && 
        (imageName.includes('signature') || imageName.includes('royale') || 
         imageName.includes('caramel') || imageName.includes('creamy') || 
         imageName.includes('dragee') || imageName.includes('grey') || 
         imageName.includes('ghost') || imageName.includes('oud'))) {
      targetFolder = folderName;
      break;
    }
    
    // Check for RABDAN special cases
    if (brand === 'RABDAN' && 
        (imageName.includes('rabdan') || imageName.includes('chill') || 
         imageName.includes('cigar') || imageName.includes('ginger') || 
         imageName.includes('gwy') || imageName.includes('hibiscus') || 
         imageName.includes('viz') || imageName.includes('iris') || 
         imageName.includes('love') || imageName.includes('room') || 
         imageName.includes('saint') || imageName.includes('vert'))) {
      targetFolder = folderName;
      break;
    }
  }
  
  // Move image to appropriate brand folder
  if (targetFolder) {
    const targetPath = path.join('assets', 'perfumes', targetFolder, image.name);
    const sourcePath = image.fullPath;
    
    try {
      fs.renameSync(sourcePath, targetPath);
      console.log(`Moved ${image.name} to ${targetFolder}/`);
      movedCount++;
    } catch (error) {
      console.error(`Error moving ${image.name}:`, error.message);
    }
  }
});

console.log(`\n✅ Organization complete! Moved ${movedCount} images to brand folders.`);
console.log('\nFolders created for all brands. Images have been organized accordingly.');

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
      brandFolder: brandFolder,
      keywords: extractProductKeywords(productName)
    });
  } else {
    unmatchedProducts.push({
      ...product,
      brand: brand,
      keywords: extractProductKeywords(productName)
    });
  }
});

console.log(`\nMatched ${matchedProducts.length} products to brand folders`);

// Now, for each brand folder, organize the images
console.log('\n=== ORGANIZING IMAGES ===');

const processedImages = new Set();
const imagesToRemove = [];

brandFolders.forEach(brandFolder => {
  const brandFolderPath = path.join(assetsPerfumesDir, brandFolder);
  const files = fs.readdirSync(brandFolderPath);
  
  console.log(`\nProcessing ${brandFolder} folder (${files.length} files):`);
  
  // Get products that belong to this brand
  const brandProducts = matchedProducts.filter(p => p.brandFolder === brandFolder);
  
  files.forEach(file => {
    const filePath = path.join(brandFolderPath, file);
    
    // Skip directories
    if (fs.statSync(filePath).isDirectory()) {
      return;
    }
    
    // Check if this image matches any product
    let matchedProduct = null;
    
    for (const product of brandProducts) {
      const fileName = path.parse(file).name.toLowerCase();
      const matches = product.keywords.some(keyword => 
        fileName.includes(keyword.toLowerCase())
      );
      
      if (matches) {
        matchedProduct = product;
        break;
      }
    }
    
    if (matchedProduct) {
      console.log(`  ✓ ${file} -> ${matchedProduct.Prodeuct}`);
      processedImages.add(filePath);
    } else {
      console.log(`  ✗ ${file} (no match - will be removed)`);
      imagesToRemove.push(filePath);
    }
  });
});

// Handle unmatched products (check if they have images in the root perfumes folder)
const rootPerfumesDir = path.join(__dirname, 'perfumes');
const rootFiles = fs.readdirSync(rootPerfumesDir);

console.log(`\nChecking root perfumes directory (${rootFiles.length} files):`);

matchedProducts.forEach(product => {
  if (!product.brandFolder) {
    // Check if any root images match this product
    const keywords = extractProductKeywords(product.Prodeuct);
    
    rootFiles.forEach(file => {
      const filePath = path.join(rootPerfumesDir, file);
      
      // Skip directories
      if (fs.statSync(filePath).isDirectory()) {
        return;
      }
      
      const fileName = path.parse(file).name.toLowerCase();
      const matches = keywords.some(keyword => 
        fileName.includes(keyword.toLowerCase())
      );
      
      if (matches) {
        console.log(`  ✓ ${file} -> ${product.Prodeuct}`);
        processedImages.add(filePath);
      }
    });
  }
});

console.log(`\n=== SUMMARY ===`);
console.log(`Processed images: ${processedImages.size}`);
console.log(`Images to remove: ${imagesToRemove.length}`);

// Actually remove the unmatched images
console.log('\n=== REMOVING UNMATCHED IMAGES ===');
let removedCount = 0;

imagesToRemove.forEach(filePath => {
  try {
    fs.unlinkSync(filePath);
    console.log(`  Removed: ${path.basename(filePath)}`);
    removedCount++;
  } catch (error) {
    console.log(`  Error removing ${path.basename(filePath)}: ${error.message}`);
  }
});

console.log(`\nRemoved ${removedCount} unmatched images`);

console.log('\n=== PROCESS COMPLETE ===');