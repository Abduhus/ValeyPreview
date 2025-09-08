const fs = require('fs');
const https = require('https');
const path = require('path');

// Configuration
const ASSETS_DIR = path.join(__dirname, 'assets', 'perfumes');

// Create directory if it doesn't exist
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.promises.access(dirPath);
  } catch {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }
}

// Check if file is 0KB
async function isZeroKB(filepath) {
  try {
    const stats = await fs.promises.stat(filepath);
    return stats.size === 0;
  } catch {
    return true; // File doesn't exist or can't be accessed
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

// Image URLs for missing products
const productImages = {
  // Signature Royale
  'caramel-sugar-main.jpg': 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'caramel-sugar-mood.jpg': 'https://images.unsplash.com/photo-1527368746281-798b65e1ac6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'creamy-love-main.jpg': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'creamy-love-mood.jpg': 'https://images.unsplash.com/photo-1617103996386-c42684d7c7c3?q=80&w=1887&auto=format&fit=crop',
  'dragee-blanc-main.jpg': 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'dragee-blanc-mood.jpg': 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'grey-london-main.jpg': 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'grey-london-mood.jpg': 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'iris-imperial-main.jpg': 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'iris-imperial-mood.jpg': 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'mythologia-main.jpg': 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'mythologia-mood.jpg': 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'oud-envoutant-main.jpg': 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'oud-envoutant-mood.jpg': 'https://images.unsplash.com/photo-1527368746281-798b65e1ac6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'sunset-vibes-main.jpg': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'sunset-vibes-mood.jpg': 'https://images.unsplash.com/photo-1617103996386-c42684d7c7c3?q=80&w=1887&auto=format&fit=crop',
  'sweet-cherry-main.jpg': 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'sweet-cherry-mood.jpg': 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  
  // Pure Essence
  'ambernomade-1.jpg': 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'ambernomade-2.jpg': 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'ambernomade-3.jpg': 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'pure-essence-babycat-1.jpg': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'pure-essence-babycat-2.jpg': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'pure-essence-babycat-3.jpg': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'pure-essence-flowerbomb-1.jpg': 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'pure-essence-flowerbomb-2.jpg': 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'pure-essence-flowerbomb-3.jpg': 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'imagination-1.jpg': 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'imagination-2.jpg': 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'imagination-3.jpg': 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'maidan-1.jpg': 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'maidan-2.jpg': 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'maidan-3.jpg': 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  
  // Coreterno
  'catharsis-1.jpg': 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'catharsis-2.jpg': 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'catharsis-3.jpg': 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'freakincense-1.jpg': 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'freakincense-2.jpg': 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'freakincense-3.jpg': 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'godimenta-1.jpg': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'godimenta-2.jpg': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'godimenta-3.jpg': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'hardkor-1.jpg': 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'hardkor-2.jpg': 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'hardkor-3.jpg': 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'hierba-nera-1.jpg': 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'hierba-nera-2.jpg': 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'hierba-nera-3.jpg': 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'night-idol-1.jpg': 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'night-idol-2.jpg': 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'night-idol-3.jpg': 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'punk-motel-1.jpg': 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'punk-motel-2.jpg': 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
  'punk-motel-3.jpg': 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600'
};

// Main download function
async function fixZeroKBImages() {
  console.log('🔍 Fixing 0KB product images...');
  
  await ensureDirectoryExists(ASSETS_DIR);
  
  let fixed = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const [filename, url] of Object.entries(productImages)) {
    try {
      const filepath = path.join(ASSETS_DIR, filename);
      
      // Check if file is 0KB
      if (await isZeroKB(filepath)) {
        await downloadImage(url, filepath);
        fixed++;
      } else {
        console.log(`→ Already valid: ${filename}`);
        skipped++;
      }
    } catch (error) {
      console.error(`✗ Error processing ${filename}:`, error.message);
      errors++;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`  ✓ Fixed: ${fixed}`);
  console.log(`  → Skipped (already valid): ${skipped}`);
  console.log(`  ✗ Errors: ${errors}`);
  console.log('\n✨ Image fix process completed!');
}

// Run the fix
fixZeroKBImages().catch(console.error);