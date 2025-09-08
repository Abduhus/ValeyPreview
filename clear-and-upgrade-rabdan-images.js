import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const ASSETS_DIR = path.join(__dirname, 'assets', 'perfumes');
const BACKUP_DIR = path.join(__dirname, 'assets', 'perfumes', 'backup');
const RABDAN_BASE_URL = 'https://rabdanperfumes.com/wp-content/uploads';

// Rabdan products that are in stock (based on storage.ts)
const inStockRabdanProducts = [
  {
    id: "9",
    name: "Rabdan Chill Vibes",
    mainImage: "Rabdan_CHILL-VIBES_1.webp",
    moodImage: "Rabdan_CHILL_-VIBES_2.webp"
  },
  {
    id: "10",
    name: "Rabdan Cigar Honey",
    mainImage: "Rabdan_CIGAR_HONEY_1.webp",
    moodImage: "Rabdan_CIGAR_HONEY_2.webp"
  },
  {
    id: "11",
    name: "Rabdan Ginger Time",
    mainImage: "Rabdan_GINGER_TIME_1.webp",
    moodImage: "Rabdan_GINGER_TIME_2.webp"
  },
  {
    id: "12",
    name: "Rabdan GWY",
    mainImage: "Rabdan_GWY_1.webp",
    moodImage: "Rabdan_GWY_2.webp"
  },
  {
    id: "13",
    name: "Rabdan Hibiscus",
    mainImage: "Rabdan_HIBISCUS_1.webp",
    moodImage: "Rabdan_HIBISCUS_2.webp"
  },
  {
    id: "14",
    name: "Rabdan Il Mio Viziato",
    mainImage: "Rabdan_IL_MIO_VIZIATO_1.webp",
    moodImage: "Rabdan_IL_MIO_VIZIATO_2.webp"
  },
  {
    id: "15",
    name: "Rabdan Iris Tabac",
    mainImage: "Rabdan_IRIS_TABAC_1.webp",
    moodImage: "Rabdan_IRIS_TABAC_2.webp"
  },
  {
    id: "16",
    name: "Rabdan Love Confession Daring",
    mainImage: "Rabdan_LOVE_CONFESSION_1.webp",
    moodImage: "Rabdan_LOVE_CONFESSION_2.webp"
  },
  {
    id: "17",
    name: "Rabdan Oud of King",
    mainImage: "Rabdan_OUD_OF_KING_1.webp",
    moodImage: "Rabdan_OUD_OF_KING_2.webp"
  },
  {
    id: "18",
    name: "Rabdan Rolling in the Deep",
    mainImage: "Rabdan_ROLLING_IN_THE_DEEP_1.webp",
    moodImage: "Rabdan_ROLLING_IN_THE_DEEP_2.webp"
  },
  {
    id: "19",
    name: "Rabdan Room 816",
    mainImage: "Rabdan_Room_816_1.webp",
    moodImage: "Rabdan_Room_816_2.webp"
  },
  {
    id: "20",
    name: "Rabdan Saint Petersburg",
    mainImage: "rabdan_saint_petersburg_1.jpeg",
    moodImage: "rabdan_saint_petersburg_2.jpeg"
  },
  {
    id: "21",
    name: "Rabdan The Vert Vetiver",
    mainImage: "Rabdan_THE_VERT_VETIVER_1.webp",
    moodImage: "Rabdan_THE_VERT_VETIVER_2.webp"
  },
  {
    id: "43",
    name: "Rabdan Lignum Vitae",
    mainImage: "Rabdan_LIGNUM_VITAE_1.webp",
    moodImage: "Rabdan_LIGNUM_VITAE_2.webp"
  }
];

// High-quality image URLs for Rabdan products
const highQualityImageSources = {
  // Based on the upgrade-rabdan-images.js file and typical Rabdan URL patterns
  'Rabdan_CHILL-VIBES_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_CHILL-VIBES_1.webp',
  'Rabdan_CHILL_-VIBES_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_CHILL_VIBES_2.webp',
  'Rabdan_CIGAR_HONEY_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_CIGAR_HONEY_1.webp',
  'Rabdan_CIGAR_HONEY_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_CIGAR_HONEY_2.webp',
  'Rabdan_GINGER_TIME_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_GINGER_TIME_1.webp',
  'Rabdan_GINGER_TIME_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_GINGER_TIME_2.webp',
  'Rabdan_GWY_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_GWY_1.webp',
  'Rabdan_GWY_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_GWY_2.webp',
  'Rabdan_HIBISCUS_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_HIBISCUS_1.webp',
  'Rabdan_HIBISCUS_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_HIBISCUS_2.webp',
  'Rabdan_IL_MIO_VIZIATO_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_IL_MIO_VIZIATO_1.webp',
  'Rabdan_IL_MIO_VIZIATO_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_IL_MIO_VIZIATO_2.webp',
  'Rabdan_IRIS_TABAC_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_IRIS_TABAC_1.webp',
  'Rabdan_IRIS_TABAC_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_IRIS_TABAC_2.webp',
  'Rabdan_LIGNUM_VITAE_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_LIGNUM_VITAE_1.webp',
  'Rabdan_LIGNUM_VITAE_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_LIGNUM_VITAE_2.webp',
  'Rabdan_LOVE_CONFESSION_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_LOVE_CONFESSION_1.webp',
  'Rabdan_LOVE_CONFESSION_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_LOVE_CONFESSION_2.webp',
  'Rabdan_OUD_OF_KING_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_OUD_OF_KING_1.webp',
  'Rabdan_OUD_OF_KING_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_OUD_OF_KING_2.webp',
  'Rabdan_ROLLING_IN_THE_DEEP_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_ROLLING_IN_THE_DEEP_1.webp',
  'Rabdan_ROLLING_IN_THE_DEEP_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_ROLLING_IN_THE_DEEP_2.webp',
  'Rabdan_Room_816_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_Room_816_1.webp',
  'Rabdan_Room_816_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_Room_816_2.webp',
  'Rabdan_THE_VERT_VETIVER_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_THE_VERT_VETIVER_1.webp',
  'Rabdan_THE_VERT_VETIVER_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_THE_VERT_VETIVER_2.webp',
  'rabdan_saint_petersburg_1.jpeg': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/rabdan_saint_petersburg_1.jpeg',
  'rabdan_saint_petersburg_2.jpeg': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/rabdan_saint_petersburg_2.jpeg'
};

// Create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Created directory: ${dirPath}`);
    }
  } catch (error) {
    console.error(`❌ Error creating directory ${dirPath}:`, error.message);
  }
}

// Backup existing images
function backupExistingImages() {
  console.log('📦 Creating backup of existing Rabdan images...');
  
  ensureDirectoryExists(BACKUP_DIR);
  
  const files = fs.readdirSync(ASSETS_DIR);
  const rabdanFiles = files.filter(file => 
    file.toLowerCase().includes('rabdan') && 
    (file.endsWith('.webp') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
  );
  
  let backedUp = 0;
  
  rabdanFiles.forEach(file => {
    try {
      const sourcePath = path.join(ASSETS_DIR, file);
      const backupPath = path.join(BACKUP_DIR, file);
      
      // Copy file to backup directory
      fs.copyFileSync(sourcePath, backupPath);
      console.log(`  ✓ Backed up: ${file}`);
      backedUp++;
    } catch (error) {
      console.error(`  ✗ Failed to backup ${file}:`, error.message);
    }
  });
  
  console.log(`✅ Backed up ${backedUp} Rabdan images to backup directory`);
  return rabdanFiles;
}

// Clear existing Rabdan images
function clearRabdanImages() {
  console.log('\n🗑️  Clearing existing Rabdan images...');
  
  const files = fs.readdirSync(ASSETS_DIR);
  const rabdanFiles = files.filter(file => 
    file.toLowerCase().includes('rabdan') && 
    (file.endsWith('.webp') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
  );
  
  let cleared = 0;
  
  rabdanFiles.forEach(file => {
    try {
      const filePath = path.join(ASSETS_DIR, file);
      fs.unlinkSync(filePath);
      console.log(`  ✓ Deleted: ${file}`);
      cleared++;
    } catch (error) {
      console.error(`  ✗ Failed to delete ${file}:`, error.message);
    }
  });
  
  console.log(`✅ Cleared ${cleared} Rabdan images`);
  return cleared;
}

// Download high-quality images
async function downloadHighQualityImages() {
  console.log('\n⬇️  Downloading high-quality Rabdan images...');
  
  let downloaded = 0;
  let failed = 0;
  
  // Process each in-stock Rabdan product
  for (const product of inStockRabdanProducts) {
    console.log(`\n📦 Processing: ${product.name}`);
    
    // Download main image
    const mainImageResult = await downloadImage(
      highQualityImageSources[product.mainImage],
      product.mainImage
    );
    
    if (mainImageResult.success) {
      downloaded++;
    } else {
      failed++;
    }
    
    // Download mood image
    const moodImageResult = await downloadImage(
      highQualityImageSources[product.moodImage],
      product.moodImage
    );
    
    if (moodImageResult.success) {
      downloaded++;
    } else {
      failed++;
    }
  }
  
  console.log(`\n📊 Download Summary:`);
  console.log(`  ✓ Successfully downloaded: ${downloaded} images`);
  console.log(`  ✗ Failed downloads: ${failed} images`);
  
  return { downloaded, failed };
}

// Download a single image
async function downloadImage(url, filename) {
  if (!url) {
    console.log(`  ⚠️  No URL found for ${filename}, skipping...`);
    return { success: false, filename };
  }
  
  try {
    console.log(`  ⬇️  Downloading: ${filename}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    const filePath = path.join(ASSETS_DIR, filename);
    
    fs.writeFileSync(filePath, Buffer.from(buffer));
    
    // Get file size
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    
    console.log(`    ✅ Downloaded: ${filename} (${sizeKB}KB)`);
    return { success: true, filename, size: stats.size };
    
  } catch (error) {
    console.log(`    ❌ Error downloading ${filename}: ${error.message}`);
    return { success: false, filename, error: error.message };
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Rabdan Image Cleanup and Upgrade Process...\n');
  
  try {
    // Ensure assets directory exists
    ensureDirectoryExists(ASSETS_DIR);
    
    // Step 1: Backup existing images
    const backedUpFiles = backupExistingImages();
    
    // Step 2: Clear existing Rabdan images
    const clearedCount = clearRabdanImages();
    
    // Step 3: Download high-quality images
    const downloadResults = await downloadHighQualityImages();
    
    console.log('\n🎉 Process Complete!');
    console.log(`📦 Backed up: ${backedUpFiles.length} files`);
    console.log(`🗑️  Cleared: ${clearedCount} files`);
    console.log(`⬇️  Downloaded: ${downloadResults.downloaded} images`);
    console.log(`❌ Failed: ${downloadResults.failed} images`);
    
    if (downloadResults.failed === 0) {
      console.log('\n✅ All images successfully upgraded to high quality!');
      console.log('💡 Next steps:');
      console.log('1. Restart your development server');
      console.log('2. Check product cards in the catalog');
      console.log('3. Verify improved image quality');
      console.log('4. Remove backup files when satisfied with results');
    } else {
      console.log('\n⚠️  Some downloads failed. Check the errors above.');
      console.log('💡 You can run this script again to retry failed downloads.');
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { backupExistingImages, clearRabdanImages, downloadHighQualityImages };
