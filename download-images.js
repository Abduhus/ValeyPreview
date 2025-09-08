import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create assets/perfumes directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets', 'perfumes');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// All rabdanperfumes.com image URLs from the product data
const imageUrls = [
  // Rabdan Chill Vibes
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/4-1.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/chill-vibes-2.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/chill-vibes-3.jpg",
  
  // Rabdan Cigar Honey
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/cigar-honey-1.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/cigar-honey-2.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/cigar-honey-3.jpg",
  
  // Rabdan Ginger Time
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/ginger-time-1.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/ginger-time-2.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/ginger-time-3.jpg",
  
  // Rabdan GWY
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/gwy-1.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/gwy-2.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/gwy-3.jpg",
  
  // Rabdan Hibiscus
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/hibiscus-1.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/hibiscus-2.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/hibiscus-3.jpg",
  
  // Rabdan Il Mio Viziato
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/il-mio-viziato-1.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/il-mio-viziato-2.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/il-mio-viziato-3.jpg",
  
  // Rabdan Iris Tabac
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/iris-tabac-main.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/iris-tabac-mood.jpg",
  
  // Rabdan Love Confession Daring
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/love-confession-main.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/love-confession-mood.jpg",
  
  // Rabdan Oud of King
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/oud-king-main.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/oud-king-mood.jpg",
  
  // Rabdan Rolling in the Deep
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/rolling-deep-main.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/rolling-deep-mood.jpg",
  
  // Rabdan Room 816
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/room-816-main.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/room-816-mood.jpg",
  
  // Rabdan Saint Petersburg
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/3-3.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/saint-petersburg-2.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/saint-petersburg-3.jpg",
  
  // Rabdan The Vert Vetiver
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/vert-vetiver-1.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/vert-vetiver-2.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/vert-vetiver-3.jpg",
  
  // Signature Royale Caramel Sugar
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/Signature-Royale_ecriture-doree-big.png",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/caramel-sugar-2.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/caramel-sugar-3.jpg",
  
  // Signature Royale Creamy Love
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/creamy-love-main.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/creamy-love-mood.jpg",
  
  // Signature Royale Dragée Blanc
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/dragee-blanc-main.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/dragee-blanc-mood.jpg",
  
  // Pure Essence Babycat
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/pure-essence-babycat-1.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/pure-essence-babycat-2.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/pure-essence-babycat-3.jpg",
  
  // Pure Essence Flowerbomb
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/pure-essence-flowerbomb-1.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/pure-essence-flowerbomb-2.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/pure-essence-flowerbomb-3.jpg",
  
  // Coreterno brand image
  "https://rabdanperfumes.com/wp-content/uploads/2025/01/coreterno-brand.webp"
];

// Function to download a single image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const file = fs.createWriteStream(filepath);
    
    const request = protocol.get(url, (response) => {
      // Check if the response is successful
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage} for ${url}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file async
        reject(err);
      });
    });
    
    request.on('error', (err) => {
      reject(err);
    });
    
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error(`Request timeout for ${url}`));
    });
  });
}

// Function to get filename from URL
function getFilenameFromUrl(url) {
  const urlPath = new URL(url).pathname;
  return path.basename(urlPath);
}

// Main download function
async function downloadAllImages() {
  console.log(`Starting download of ${imageUrls.length} images...`);
  
  const results = {
    successful: [],
    failed: []
  };
  
  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i];
    const filename = getFilenameFromUrl(url);
    const filepath = path.join(assetsDir, filename);
    
    try {
      console.log(`[${i + 1}/${imageUrls.length}] Downloading: ${filename}`);
      
      // Skip if file already exists
      if (fs.existsSync(filepath)) {
        console.log(`  ✓ File already exists: ${filename}`);
        results.successful.push({ url, filename, status: 'already_exists' });
        continue;
      }
      
      await downloadImage(url, filepath);
      console.log(`  ✓ Downloaded: ${filename}`);
      results.successful.push({ url, filename, status: 'downloaded' });
      
      // Add a small delay to be respectful to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`  ✗ Failed: ${filename} - ${error.message}`);
      results.failed.push({ url, filename, error: error.message });
    }
  }
  
  // Summary
  console.log('\n=== DOWNLOAD SUMMARY ===');
  console.log(`Total images: ${imageUrls.length}`);
  console.log(`Successful: ${results.successful.length}`);
  console.log(`Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log('\nFailed downloads:');
    results.failed.forEach(item => {
      console.log(`  - ${item.filename}: ${item.error}`);
    });
  }
  
  console.log(`\nAll images saved to: ${assetsDir}`);
  
  return results;
}

// Run the download
downloadAllImages().catch(console.error);