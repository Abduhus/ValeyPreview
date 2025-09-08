const fs = require('fs');
const https = require('https');
const path = require('path');

// Create perfumes directory if it doesn't exist
const perfumesDir = path.join(__dirname, 'assets', 'perfumes');
if (!fs.existsSync(perfumesDir)) {
  fs.mkdirSync(perfumesDir, { recursive: true });
}

// Map of low-res to high-res image URLs
// These are examples - you would need to find the actual high-res URLs for each product
const imageMap = {
  // Rabdan products
  '/assets/perfumes/Rabdan_CHILL-VIBES_1-300x300.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/11/Rabdan_CHILL-VIBES_1.webp',
  '/assets/perfumes/Rabdan_CHILL_-VIBES_2-300x300.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/11/Rabdan_CHILL_-VIBES_2.webp',
  '/assets/perfumes/Rabdan_CIGAR_HONEY_1-300x300.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/11/Rabdan_CIGAR_HONEY_1.webp',
  '/assets/perfumes/Rabdan_CIGAR_HONEY_2-300x300.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/11/Rabdan_CIGAR_HONEY_2.webp',
  '/assets/perfumes/Rabdan_GINGER_TIME_1-300x300.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/11/Rabdan_GINGER_TIME_1.webp',
  '/assets/perfumes/Rabdan_GINGER_TIME_2-300x300.webp': 'https://rabdanperfumes.com/wp-content/uploads/2024/11/Rabdan_GINGER_TIME_2.webp',
  // Add more mappings as needed
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${filepath}`);
          resolve();
        });
      } else {
        file.close();
        fs.unlink(filepath, () => {}); // Delete temp file
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {}); // Delete temp file
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log('Starting image download...');
  
  for (const [lowResPath, highResUrl] of Object.entries(imageMap)) {
    try {
      // Create the high-res filename by removing the -300x300 suffix
      const filename = path.basename(lowResPath).replace('-300x300', '');
      const filepath = path.join(perfumesDir, filename);
      
      // Check if file already exists
      if (fs.existsSync(filepath)) {
        console.log(`File already exists: ${filepath}`);
        continue;
      }
      
      console.log(`Downloading ${highResUrl}...`);
      await downloadImage(highResUrl, filepath);
    } catch (error) {
      console.error(`Error downloading ${highResUrl}:`, error.message);
    }
  }
  
  console.log('Image download complete!');
}

downloadAllImages().catch(console.error);