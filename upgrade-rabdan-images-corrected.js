import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// High-quality replacement URLs for Rabdan products
// These are the actual high-quality URLs from the Rabdan website
const highQualityImageSources = {
  // Chill Vibes
  'Rabdan_CHILL-VIBES_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_CHILL-VIBES_1.webp',
  'Rabdan_CHILL_-VIBES_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_CHILL_VIBES_2.webp',
  
  // Cigar Honey
  'Rabdan_CIGAR_HONEY_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_CIGAR_HONEY_1.webp',
  'Rabdan_CIGAR_HONEY_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_CIGAR_HONEY_2.webp',
  
  // Ginger Time
  'Rabdan_GINGER_TIME_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_GINGER_TIME_1.webp',
  'Rabdan_GINGER_TIME_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_GINGER_TIME_2.webp',
  
  // GWY
  'Rabdan_GWY_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_GWY_1.webp',
  'Rabdan_GWY_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_GWY_2.webp',
  
  // Hibiscus
  'Rabdan_HIBISCUS_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_HIBISCUS_1.webp',
  'Rabdan_HIBISCUS_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_HIBISCUS_2.webp',
  
  // Il Mio Viziato
  'Rabdan_IL_MIO_VIZIATO_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_IL_MIO_VIZIATO_1.webp',
  'Rabdan_IL_MIO_VIZIATO_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_IL_MIO_VIZIATO_2.webp',
  
  // Iris Tabac
  'Rabdan_IRIS_TABAC_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_IRIS_TABAC_1.webp',
  'Rabdan_IRIS_TABAC_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_IRIS_TABAC_2.webp',
  
  // Lignum Vitae
  'Rabdan_LIGNUM_VITAE_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_LIGNUM_VITAE_1.webp',
  'Rabdan_LIGNUM_VITAE_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_LIGNUM_VITAE_2.webp',
  
  // Love Confession
  'Rabdan_LOVE_CONFESSION_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_LOVE_CONFESSION_1.webp',
  'Rabdan_LOVE_CONFESSION_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_LOVE_CONFESSION_2.webp',
  
  // Oud of King
  'Rabdan_OUD_OF_KING_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_OUD_OF_KING_1.webp',
  'Rabdan_OUD_OF_KING_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_OUD_OF_KING_2.webp',
  
  // Rolling in the Deep
  'Rabdan_ROLLING_IN_THE_DEEP_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_ROLLING_IN_THE_DEEP_1.webp',
  'Rabdan_ROLLING_IN_THE_DEEP_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_ROLLING_IN_THE_DEEP_2.webp',
  
  // Room 816
  'Rabdan_Room_816_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_Room_816_1.webp',
  'Rabdan_Room_816_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_Room_816_2.webp',
  
  // The Vert Vetiver
  'Rabdan_THE_VERT_VETIVER_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_THE_VERT_VETIVER_1.webp',
  'Rabdan_THE_VERT_VETIVER_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_THE_VERT_VETIVER_2.webp',
  
  // Saint Petersburg
  'rabdan_saint_petersburg_1.jpeg': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/rabdan_saint_petersburg_1.jpeg',
  'rabdan_saint_petersburg_2.jpeg': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/rabdan_saint_petersburg_2.jpeg'
};

// Create download function
async function downloadHighQualityImage(url, filename) {
  try {
    console.log(`⬇️  Downloading: ${filename}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    const assetsPath = path.join(__dirname, 'assets', 'perfumes', filename);
    
    // Create backup of old image
    if (fs.existsSync(assetsPath)) {
      const backupPath = path.join(__dirname, 'assets', 'perfumes', `backup-${filename}`);
      fs.copyFileSync(assetsPath, backupPath);
      console.log(`💾 Created backup: backup-${filename}`);
    }
    
    // Write new image
    fs.writeFileSync(assetsPath, Buffer.from(buffer));
    
    // Get new file size
    const stats = fs.statSync(assetsPath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    
    console.log(`✅ Downloaded: ${filename} (${sizeKB}KB)`);
    return { success: true, size: stats.size, filename };
    
  } catch (error) {
    console.log(`❌ Error downloading ${filename}: ${error.message}`);
    return { success: false, filename, error: error.message };
  }
}

// Main download function
async function upgradeRabdanImages() {
  console.log('🚀 Starting Rabdan Images Quality Upgrade...\n');
  
  const results = {
    successful: [],
    failed: [],
    totalImproved: 0,
    sizeBefore: 0,
    sizeAfter: 0
  };
  
  // Calculate total size before
  const assetsDir = path.join(__dirname, 'assets', 'perfumes');
  Object.keys(highQualityImageSources).forEach(filename => {
    const filePath = path.join(assetsDir, filename);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      results.sizeBefore += stats.size;
    }
  });
  
  console.log(`📊 Processing ${Object.keys(highQualityImageSources).length} images...\n`);
  
  // Download all images with controlled concurrency
  const downloadPromises = Object.entries(highQualityImageSources).map(([filename, url], index) => {
    // Add small delay to avoid overwhelming the server
    return new Promise((resolve) => {
      setTimeout(async () => {
        const result = await downloadHighQualityImage(url, filename);
        resolve(result);
      }, index * 200); // 200ms delay between requests
    });
  });
  
  const downloadResults = await Promise.all(downloadPromises);
  
  // Process results
  downloadResults.forEach(result => {
    if (result.success) {
      results.successful.push(result);
      results.sizeAfter += result.size;
      results.totalImproved++;
    } else {
      results.failed.push(result);
    }
  });
  
  // Display results
  console.log(`\n📈 UPGRADE COMPLETE!\n`);
  console.log(`✅ Successfully upgraded: ${results.successful.length} images`);
  console.log(`❌ Failed downloads: ${results.failed.length} images`);
  console.log(`📊 Total size before: ${(results.sizeBefore / 1024).toFixed(1)}KB`);
  console.log(`📊 Total size after: ${(results.sizeAfter / 1024).toFixed(1)}KB`);
  
  if (results.sizeAfter > results.sizeBefore) {
    const improvement = ((results.sizeAfter - results.sizeBefore) / 1024).toFixed(1);
    console.log(`📈 Size improvement: +${improvement}KB`);
  } else {
    console.log(`📊 No size improvement (files may have been the same quality)`);
  }
  
  if (results.failed.length > 0) {
    console.log(`\n❌ Failed Downloads:`);
    results.failed.forEach(fail => {
      console.log(`  - ${fail.filename}: ${fail.error}`);
    });
  }
  
  console.log(`\n💡 Next Steps:`);
  console.log(`1. Restart the development server to see changes`);
  console.log(`2. Check product cards in the catalog`);
  console.log(`3. Verify improved image quality on product display`);
  console.log(`4. Remove backup files when satisfied with results`);
  
  return results;
}

// Run the upgrade
upgradeRabdanImages()
  .then((results) => {
    process.exit(results.failed.length > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('💥 Upgrade script failed:', error);
    process.exit(1);
  });