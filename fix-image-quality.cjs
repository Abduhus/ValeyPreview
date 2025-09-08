const fs = require('fs').promises;
const https = require('https');
const path = require('path');

// Configuration
const ASSETS_DIR = path.join(__dirname, 'assets', 'perfumes');
const STORAGE_FILE = path.join(__dirname, 'server', 'storage.ts');

// Ensure directory exists
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// Download image with error handling
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${path.basename(filepath)}`);
          resolve(filepath);
        });
      } else {
        file.close();
        fs.unlink(filepath, () => {}); // Delete temp file
        reject(new Error(`Failed to download ${url}: ${response.statusCode} ${response.statusMessage}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {}); // Delete temp file
      reject(err);
    });
  });
}

// Try to download full-size images from Rabdan's website
async function downloadRabdanFullSizeImages() {
  console.log('🔍 Looking for Rabdan product images to upgrade...');
  
  // Common Rabdan product image patterns from the website
  const rabdanProducts = [
    { name: 'Rabdan_CHILL-VIBES', id: '9' },
    { name: 'Rabdan_CIGAR_HONEY', id: '10' },
    { name: 'Rabdan_GINGER_TIME', id: '11' },
    { name: 'Rabdan_GWY', id: '12' },
    { name: 'Rabdan_HIBISCUS', id: '13' },
    { name: 'Rabdan_IL_MIO_VIZIATO', id: '14' },
    { name: 'Rabdan_IRIS_TABAC', id: '15' },
    { name: 'Rabdan_LOVE_CONFESSION', id: '16' },
    { name: 'Rabdan_OUD_OF_KING', id: '17' },
    { name: 'Rabdan_ROLLING_IN_THE_DEEP', id: '18' },
    { name: 'Rabdan_Room_816', id: '19' },
    { name: 'rabdan_saint_petersburg', id: '20' },
    { name: 'Rabdan_THE_VERT_VETIVER', id: '21' },
    { name: 'Rabdan_LIGNUM_VITAE', id: '43' }
  ];
  
  // Try common URL patterns for Rabdan images
  const years = ['2024', '2023', '2022'];
  const months = ['11', '12', '10', '09', '08'];
  
  let downloaded = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const product of rabdanProducts) {
    console.log(`\nProcessing ${product.name}...`);
    
    // Try to download both images for each product
    for (let i = 1; i <= 2; i++) {
      const baseFilename = `${product.name}_${i}`;
      const fullSizePath = path.join(ASSETS_DIR, `${baseFilename}.webp`);
      
      // Check if full-size version already exists
      try {
        await fs.access(fullSizePath);
        console.log(`  → Full-size version already exists: ${baseFilename}.webp`);
        skipped++;
        continue;
      } catch {
        // File doesn't exist, proceed to download
      }
      
      // Try different URL patterns
      let success = false;
      for (const year of years) {
        for (const month of months) {
          const urls = [
            `https://rabdanperfumes.com/wp-content/uploads/${year}/${month}/${product.name}_${i}.webp`,
            `https://rabdanperfumes.com/wp-content/uploads/${year}/${month}/${product.name}_${i}-1.webp`,
            `https://rabdanperfumes.com/wp-content/uploads/${year}/${month}/${product.name}_${i}_1.webp`,
            `https://rabdanperfumes.com/wp-content/uploads/${year}/${month}/${product.name}_${i}.jpg`,
            `https://rabdanperfumes.com/wp-content/uploads/${year}/${month}/${product.name}_${i}-1.jpg`,
            `https://rabdanperfumes.com/wp-content/uploads/${year}/${month}/${product.name}_${i}_1.jpg`
          ];
          
          for (const url of urls) {
            try {
              await downloadImage(url, fullSizePath);
              downloaded++;
              success = true;
              break;
            } catch (err) {
              // Try next URL
              continue;
            }
          }
          
          if (success) break;
        }
        if (success) break;
      }
      
      if (!success) {
        console.log(`  → Could not find full-size version for ${baseFilename}`);
        errors++;
      }
    }
  }
  
  console.log(`\n📊 Download Summary:`);
  console.log(`  ✓ Successfully downloaded: ${downloaded}`);
  console.log(`  → Already existed: ${skipped}`);
  console.log(`  ✗ Errors: ${errors}`);
  
  return downloaded > 0;
}

// Update storage.ts to use full-size images instead of 300x300 thumbnails
async function updateStorageToUseFullSizeImages() {
  console.log('\n🔄 Updating storage.ts to use full-size images...');
  
  try {
    let content = await fs.readFile(STORAGE_FILE, 'utf8');
    let changesMade = false;
    
    // Pattern to match Rabdan image paths with -300x300 suffix
    const rabdanImagePattern = /("\/assets\/perfumes\/(Rabdan_[^"]*|rabdan_[^"]*)-300x300\.(webp|jpg|jpeg|png)")/g;
    
    // Replace all Rabdan -300x300 suffixes with empty string to get full size
    const updatedContent = content.replace(rabdanImagePattern, (match, imagePath) => {
      const newPath = imagePath.replace('-300x300', '');
      if (match !== newPath) {
        console.log(`  Updated: ${JSON.parse(match)} → ${JSON.parse(newPath)}`);
        changesMade = true;
      }
      return newPath;
    });
    
    if (changesMade) {
      await fs.writeFile(STORAGE_FILE, updatedContent, 'utf8');
      console.log('✅ Successfully updated storage.ts with full-size image paths!');
    } else {
      console.log('ℹ️  No changes needed in storage.ts (already using full-size paths or no Rabdan images found)');
    }
    
  } catch (error) {
    console.error('❌ Error updating storage.ts:', error.message);
  }
}

// Main execution
async function main() {
  console.log('✨ Starting image quality fix process...\n');
  
  try {
    await ensureDirectoryExists(ASSETS_DIR);
    
    // Download full-size images
    const hasDownloads = await downloadRabdanFullSizeImages();
    
    // Update storage.ts to use full-size images
    await updateStorageToUseFullSizeImages();
    
    console.log('\n🎉 Image quality fix process completed!');
    console.log('\nNext steps:');
    console.log('1. Restart your development server to see the changes');
    console.log('2. Check the product pages to verify image quality improvement');
    console.log('3. If some images are still not found, you may need to manually download them from Rabdan\'s website');
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { downloadRabdanFullSizeImages, updateStorageToUseFullSizeImages };