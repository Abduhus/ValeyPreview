const fs = require('fs').promises;
const https = require('https');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

// Configuration
const ASSETS_DIR = path.join(__dirname, 'assets', 'perfumes');
const RABDAN_BASE_URL = 'https://rabdanperfumes.com/wp-content/uploads';

// Create directory if it doesn't exist
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// Download image with better error handling
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${path.basename(filepath)}`);
          resolve();
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

// Try to find full-size image by removing size suffixes
async function tryFullSizeImage(thumbnailPath) {
  const filename = path.basename(thumbnailPath);
  const dir = path.dirname(thumbnailPath);
  
  // Common patterns to remove
  const patterns = [
    '-300x300',
    '-600x600',
    '-768x845',
    '-1536x1536',
    '-600x400',
    '-scaled'
  ];
  
  for (const pattern of patterns) {
    if (filename.includes(pattern)) {
      const fullSizeName = filename.replace(pattern, '');
      const fullPath = path.join(dir, fullSizeName);
      
      // Check if full size file already exists
      try {
        await fs.access(fullPath);
        console.log(`✓ Full size version already exists: ${fullSizeName}`);
        return fullSizeName;
      } catch {
        // File doesn't exist, continue to next pattern
      }
    }
  }
  
  return null;
}

// Get list of all Rabdan images in our assets
async function getRabdanImages() {
  const files = await fs.readdir(ASSETS_DIR);
  return files
    .filter(file => file.toLowerCase().includes('rabdan'))
    .filter(file => file.includes('-300x300')) // Only thumbnail images
    .map(file => path.join(ASSETS_DIR, file));
}

// Try to download full-size versions from Rabdan's website
async function downloadFullSizeImages() {
  console.log('🔍 Searching for Rabdan images to upgrade...');
  
  const rabdanImages = await getRabdanImages();
  console.log(`Found ${rabdanImages.length} Rabdan thumbnail images`);
  
  let downloaded = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const imagePath of rabdanImages) {
    try {
      const filename = path.basename(imagePath);
      console.log(`\nProcessing: ${filename}`);
      
      // Check if we already have a full-size version
      const existingFullSize = await tryFullSizeImage(imagePath);
      if (existingFullSize) {
        console.log(`  → Already have full size version: ${existingFullSize}`);
        skipped++;
        continue;
      }
      
      // Try to construct full-size URL by removing size suffix
      const baseFilename = filename.replace(/-\d+x\d+/, '');
      const year = '2024'; // You might need to adjust this based on actual URLs
      const month = '11';  // You might need to adjust this based on actual URLs
      
      // Try common URL patterns
      const urlPatterns = [
        `${RABDAN_BASE_URL}/${year}/${month}/${baseFilename}`,
        `${RABDAN_BASE_URL}/${year}/${month}/${filename.replace('-300x300', '')}`,
        `${RABDAN_BASE_URL}/${year}/${month}/${baseFilename.replace('.webp', '.jpg')}`,
        `${RABDAN_BASE_URL}/${year}/${month}/${baseFilename.replace('.jpg', '.webp')}`
      ];
      
      let downloadedFile = false;
      for (const url of urlPatterns) {
        try {
          const fullSizePath = path.join(ASSETS_DIR, baseFilename);
          await downloadImage(url, fullSizePath);
          downloaded++;
          downloadedFile = true;
          break;
        } catch (err) {
          // Try next URL pattern
          continue;
        }
      }
      
      if (!downloadedFile) {
        console.log(`  → Could not find full-size version for ${filename}`);
        errors++;
      }
      
    } catch (error) {
      console.error(`  ✗ Error processing ${path.basename(imagePath)}:`, error.message);
      errors++;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`  ✓ Downloaded: ${downloaded}`);
  console.log(`  → Skipped (already existed): ${skipped}`);
  console.log(`  ✗ Errors: ${errors}`);
}

// Main execution
async function main() {
  try {
    await ensureDirectoryExists(ASSETS_DIR);
    await downloadFullSizeImages();
    console.log('\n✨ Image upgrade process completed!');
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { downloadFullSizeImages, tryFullSizeImage };