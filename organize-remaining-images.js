const fs = require('fs');
const path = require('path');

// Load the processed perfumes data
let perfumesData = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));

console.log(`Processing ${perfumesData.length} perfume products...`);

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

// Try to match remaining images to products based on naming patterns
let movedCount = 0;

imageFiles.forEach(image => {
  const imageName = image.name.toLowerCase();
  let targetFolder = null;
  let matchedProduct = null;
  
  // Try to find a product that might match this image
  for (const product of perfumesData) {
    // Check if product name or brand appears in the image name
    const productName = product.name.toLowerCase();
    const brandName = product.brand.toLowerCase();
    const fullName = product.fullName ? product.fullName.toLowerCase() : '';
    
    // Create a more comprehensive matching
    if (imageName.includes(productName.replace(/\s+/g, '')) ||
        imageName.includes(productName.replace(/\s+/g, '_')) ||
        imageName.includes(brandName.replace(/\s+/g, '')) ||
        imageName.includes(brandName.replace(/\s+/g, '_')) ||
        (fullName && (imageName.includes(fullName.replace(/\s+/g, '')) || 
                     imageName.includes(fullName.replace(/\s+/g, '_'))))) {
      matchedProduct = product;
      break;
    }
    
    // Special handling for specific patterns
    if (imageName.includes('areej') && (brandName.includes('signature') || brandName.includes('royale'))) {
      matchedProduct = product;
      break;
    }
    
    if (imageName.includes('meleg') && brandName.includes('giardini')) {
      matchedProduct = product;
      break;
    }
    
    if (imageName.includes('gion') && brandName.includes('giardini')) {
      matchedProduct = product;
      break;
    }
    
    if (imageName.includes('bortnikoff') && brandName.includes('xerjoff')) {
      matchedProduct = product;
      break;
    }
    
    if (imageName.includes('musk') && (brandName.includes('rabdan') || brandName.includes('signature'))) {
      matchedProduct = product;
      break;
    }
    
    if (imageName.includes('triad') && (brandName.includes('rabdan') || brandName.includes('signature'))) {
      matchedProduct = product;
      break;
    }
  }
  
  // If we found a matching product, move the image to that brand's folder
  if (matchedProduct) {
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
    
    const brandFolder = brandFolderMapping[matchedProduct.brand];
    if (brandFolder) {
      targetFolder = brandFolder;
    }
  }
  
  // If we still haven't found a folder, try to determine it based on image name patterns
  if (!targetFolder) {
    // Look for brand indicators in the image name
    if (imageName.includes('areej') || imageName.includes('sandal')) {
      targetFolder = 'SignatureRoyale'; // These seem to be Signature Royale products
    } else if (imageName.includes('meleg') || imageName.includes('gion')) {
      targetFolder = 'Giardini'; // These seem to be Giardini di Toscana products
    } else if (imageName.includes('bortnikoff')) {
      targetFolder = 'Xerjoff'; // This seems to be a Xerjoff product
    } else if (imageName.includes('musk') || imageName.includes('triad')) {
      targetFolder = 'SignatureRoyale'; // These seem to be Signature Royale products
    } else if (imageName.includes('bomb')) {
      targetFolder = 'Coreterno'; // This seems to be a Coreterno product based on previous moves
    } else if (imageName.includes('leaumaliz') || imageName.includes('o.3749')) {
      // Try to match these to brands based on existing patterns
      targetFolder = 'Coreterno'; // Default to Coreterno for unidentifiable images
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
  } else {
    console.log(`No brand match found for ${image.name}`);
  }
});

console.log(`\n✅ Organization complete! Moved ${movedCount} images to brand folders.`);