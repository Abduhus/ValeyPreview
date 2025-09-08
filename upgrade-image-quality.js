const fs = require('fs').promises;
const https = require('https');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

// Configuration
const ASSETS_DIR = path.join(__dirname, 'assets', 'perfumes');
const STORAGE_FILE = path.join(__dirname, 'server', 'storage.ts');
const RABDAN_BASE_URL = 'https://rabdanperfumes.com/wp-content/uploads';

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

// Get all Rabdan images that need upgrading (300x300 versions)
async function getRabdanThumbnails() {
  try {
    const files = await fs.readdir(ASSETS_DIR);
    return files
      .filter(file => file.toLowerCase().includes('rabdan'))
      .filter(file => file.includes('-300x300'))
      .map(file => ({
        thumbnail: file,
        fullPath: path.join(ASSETS_DIR, file)
      }));
  } catch (error) {
    console.error('Error reading assets directory:', error.message);
    return [];
  }
}

// Try to construct full-size URL patterns
function getFullSizeUrlPatterns(thumbnailName) {
  // Remove the -300x300 suffix and extension
  const baseName = thumbnailName.replace(/-\d+x\d+\.(webp|jpg|jpeg|png)$/i, '');
  const extension = thumbnailName.match(/\.(webp|jpg|jpeg|png)$/i)[1];
  
  // Common years and months for Rabdan uploads
  const years = ['2024', '2023', '2022'];
  const months = ['11', '12', '10', '09', '08'];
  
  const patterns = [];
  for (const year of years) {
    for (const month of months) {
      // Try different naming patterns
      patterns.push(`${RABDAN_BASE_URL}/${year}/${month}/${baseName}.${extension}`);
      patterns.push(`${RABDAN_BASE_URL}/${year}/${month}/${thumbnailName.replace('-300x300', '')}`);
      patterns.push(`${RABDAN_BASE_URL}/${year}/${month}/${baseName}-1.${extension}`);
      patterns.push(`${RABDAN_BASE_URL}/${year}/${month}/${baseName}_1.${extension}`);
    }
  }
  
  return patterns;
}

// Download full-size images for all Rabdan thumbnails
async function downloadFullSizeImages() {
  console.log('🔍 Identifying Rabdan thumbnail images...');
  const thumbnails = await getRabdanThumbnails();
  
  if (thumbnails.length === 0) {
    console.log('ℹ️  No Rabdan thumbnail images found');
    return;
  }
  
  console.log(`Found ${thumbnails.length} Rabdan thumbnail images`);
  
  let downloaded = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const { thumbnail } of thumbnails) {
    try {
      console.log(`\nProcessing: ${thumbnail}`);
      
      // Construct potential full-size filename
      const fullSizeName = thumbnail.replace('-300x300', '');
      const fullSizePath = path.join(ASSETS_DIR, fullSizeName);
      
      // Check if full-size version already exists
      try {
        await fs.access(fullSizePath);
        console.log(`  → Full-size version already exists: ${fullSizeName}`);
        skipped++;
        continue;
      } catch {
        // File doesn't exist, proceed to download
      }
      
      // Try to download full-size version
      const urlPatterns = getFullSizeUrlPatterns(thumbnail);
      let success = false;
      
      for (const url of urlPatterns) {
        try {
          await downloadImage(url, fullSizePath);
          downloaded++;
          success = true;
          break;
        } catch (err) {
          // Try next URL pattern
          continue;
        }
      }
      
      if (!success) {
        console.log(`  → Could not find full-size version for ${thumbnail}`);
        errors++;
      }
      
    } catch (error) {
      console.error(`  ✗ Error processing ${thumbnail}:`, error.message);
      errors++;
    }
  }
  
  console.log(`\n📊 Download Summary:`);
  console.log(`  ✓ Successfully downloaded: ${downloaded}`);
  console.log(`  → Already existed: ${skipped}`);
  console.log(`  ✗ Errors: ${errors}`);
  
  return downloaded > 0;
}

// Update storage.ts to use full-size images
async function updateStorageFile() {
  console.log('\n🔄 Updating storage.ts to use full-size images...');
  
  try {
    let content = await fs.readFile(STORAGE_FILE, 'utf8');
    let changesMade = false;
    
    // Pattern to match Rabdan image paths with -300x300 suffix
    const rabdanImagePattern = /("\/assets\/perfumes\/Rabdan[^"]*-300x300\.(webp|jpg|jpeg|png)")/g;
    
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
  console.log('✨ Starting image quality upgrade process...\n');
  
  try {
    await ensureDirectoryExists(ASSETS_DIR);
    
    // Download full-size images
    const hasDownloads = await downloadFullSizeImages();
    
    // Update storage.ts if we downloaded new images
    if (hasDownloads) {
      await updateStorageFile();
    } else {
      console.log('\nℹ️  No new images downloaded, skipping storage.ts update');
    }
    
    console.log('\n🎉 Image quality upgrade process completed!');
    console.log('\nNext steps:');
    console.log('1. Restart your development server to see the changes');
    console.log('2. Check the product pages to verify image quality improvement');
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { downloadFullSizeImages, updateStorageFile };