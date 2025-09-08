const https = require('https');
const fs = require('fs');
const path = require('path');

// Rabdan product images with their URLs from the official website
const rabdanImages = {
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
  
  // Saint Petersburg
  'rabdan_saint_petersburg_1.jpeg': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/rabdan_saint_petersburg_1.jpeg',
  'rabdan_saint_petersburg_2.jpeg': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/rabdan_saint_petersburg_2.jpeg',
  
  // The Vert Vetiver
  'Rabdan_THE_VERT_VETIVER_1.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_THE_VERT_VETIVER_1.webp',
  'Rabdan_THE_VERT_VETIVER_2.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/08/Rabdan_THE_VERT_VETIVER_2.webp'
};

// Directory to save images
const assetsDir = path.join(__dirname, 'assets', 'perfumes');

// Create directory if it doesn't exist
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Download function
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(assetsDir, filename);
    
    // Create backup of existing file
    if (fs.existsSync(filepath)) {
      const backupPath = path.join(assetsDir, `backup-${filename}`);
      fs.copyFileSync(filepath, backupPath);
      console.log(`Created backup: ${filename} -> backup-${filename}`);
    }
    
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          // Get file size
          const stats = fs.statSync(filepath);
          const sizeKB = (stats.size / 1024).toFixed(1);
          console.log(`✓ Downloaded: ${filename} (${sizeKB}KB)`);
          resolve();
        });
      } else {
        file.close();
        fs.unlink(filepath, () => {}); // Delete temp file
        reject(new Error(`HTTP ${response.statusCode} for ${filename}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {}); // Delete temp file
      reject(err);
    });
  });
}

// Download all Rabdan images
async function downloadAllRabdanImages() {
  console.log('🚀 Starting Rabdan Images Redownload...\n');
  console.log(`Found ${Object.keys(rabdanImages).length} Rabdan images to download\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  // Process images with a delay to avoid overwhelming the server
  for (const [filename, url] of Object.entries(rabdanImages)) {
    try {
      await downloadImage(url, filename);
      successCount++;
    } catch (error) {
      console.error(`✗ Failed to download ${filename}: ${error.message}`);
      errorCount++;
    }
    
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`\n📊 Download Summary:`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`\n✨ Redownload process completed!`);
  
  if (errorCount > 0) {
    console.log(`\n💡 Troubleshooting Tips:`);
    console.log(`1. Check your internet connection`);
    console.log(`2. Verify the URLs are still valid`);
    console.log(`3. Try running this script again`);
  }
}

// Run the download
downloadAllRabdanImages().catch(console.error);