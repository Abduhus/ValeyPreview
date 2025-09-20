const fs = require('fs');
const path = require('path');

// Load the processed perfumes data
let perfumesData = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));

console.log(`Processing ${perfumesData.length} perfume products...`);

// Brand name to folder name mapping (same as in the organization script)
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

// Update image paths for products
let updatedCount = 0;

perfumesData = perfumesData.map(product => {
  // Check if product has image URLs
  if (product.imageUrl || product.moodImageUrl || product.images) {
    const brand = product.brand;
    const brandFolder = brandFolderMapping[brand];
    
    if (brandFolder) {
      let updated = false;
      
      // Update imageUrl if it exists and doesn't already contain the brand folder
      if (product.imageUrl && !product.imageUrl.includes(`/${brandFolder}/`)) {
        const fileName = path.basename(product.imageUrl);
        product.imageUrl = `/assets/perfumes/${brandFolder}/${fileName}`;
        updated = true;
      }
      
      // Update moodImageUrl if it exists and doesn't already contain the brand folder
      if (product.moodImageUrl && !product.moodImageUrl.includes(`/${brandFolder}/`)) {
        const fileName = path.basename(product.moodImageUrl);
        product.moodImageUrl = `/assets/perfumes/${brandFolder}/${fileName}`;
        updated = true;
      }
      
      // Update images array if it exists
      if (product.images) {
        try {
          const imagesArray = JSON.parse(product.images);
          const updatedImages = imagesArray.map(imageUrl => {
            if (imageUrl && !imageUrl.includes(`/${brandFolder}/`)) {
              const fileName = path.basename(imageUrl);
              return `/assets/perfumes/${brandFolder}/${fileName}`;
            }
            return imageUrl;
          });
          product.images = JSON.stringify(updatedImages);
          updated = true;
        } catch (e) {
          console.log(`Error parsing images array for product ${product.id}:`, e.message);
        }
      }
      
      if (updated) {
        updatedCount++;
      }
    }
  }
  
  return product;
});

console.log(`Updated image paths for ${updatedCount} products`);

// Save the updated data
fs.writeFileSync('processed-perfumes.json', JSON.stringify(perfumesData, null, 2));
console.log('\n✅ Updated processed-perfumes.json with new image paths');