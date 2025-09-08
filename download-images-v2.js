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

// Updated list with confirmed working URLs and additional ones from website scraping
const imageUrls = [
  // Working URLs we already confirmed
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/4-1.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/3-3.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/Signature-Royale_ecriture-doree-big.png",
  "https://rabdanperfumes.com/wp-content/uploads/2025/01/coreterno-brand.webp",
  
  // Additional URLs found from website scraping
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/Bortnikoff.webp",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/leaumaliz.webp",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/o.3749.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/AREEG-LE-DORE.webp",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/MELEG.webp",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/Gallagher-1.webp",
  
  // Try to get some high-resolution product images by exploring common patterns
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/rabdan-chill-vibes.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/rabdan-cigar-honey.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/rabdan-ginger-time.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/rabdan-gwy.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/rabdan-hibiscus.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/rabdan-il-mio-viziato.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/rabdan-iris-tabac.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/rabdan-love-confession.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/rabdan-oud-king.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/rabdan-rolling-deep.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/rabdan-room-816.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/rabdan-saint-petersburg.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/11/rabdan-vert-vetiver.jpg",
  
  // Signature Royale product images
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/signature-royale-caramel-sugar.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/signature-royale-creamy-love.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/signature-royale-dragee-blanc.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/signature-royale-grey-london.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/signature-royale-iris-imperial.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/signature-royale-sweet-cherry.jpg",
  
  // Pure Essence product images
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/pure-essence-ambernomade.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/pure-essence-babycat.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/pure-essence-flowerbomb.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/pure-essence-imagination.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2024/12/pure-essence-maidan.jpg",
  
  // Coreterno product images
  "https://rabdanperfumes.com/wp-content/uploads/2025/01/coreterno-catharsis.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2025/01/coreterno-freakincense.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2025/01/coreterno-godimenta.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2025/01/coreterno-hardkor.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2025/01/coreterno-hierba-nera.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2025/01/coreterno-night-idol.jpg",
  "https://rabdanperfumes.com/wp-content/uploads/2025/01/coreterno-punk-motel.jpg",
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
  
  if (results.successful.length > 0) {
    console.log('\nSuccessful downloads:');
    results.successful.forEach(item => {
      console.log(`  ✓ ${item.filename} (${item.status})`);
    });
  }
  
  if (results.failed.length > 0) {
    console.log('\nFailed downloads:');
    results.failed.forEach(item => {
      console.log(`  ✗ ${item.filename}: ${item.error}`);
    });
  }
  
  console.log(`\nAll images saved to: ${assetsDir}`);
  
  return results;
}

// Run the download
downloadAllImages().catch(console.error);