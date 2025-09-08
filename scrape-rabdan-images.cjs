const https = require('https');
const fs = require('fs');
const path = require('path');

// Function to fetch webpage content
function fetchWebpage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        if (response.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${response.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

// Function to download an image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(filepath);
          const sizeKB = (stats.size / 1024).toFixed(1);
          console.log(`✓ Downloaded: ${path.basename(filepath)} (${sizeKB}KB)`);
          resolve();
        });
      } else {
        file.close();
        fs.unlink(filepath, () => {});
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Extract image URLs from HTML
function extractImageUrls(html) {
  // Look for product image patterns
  const imgRegex = /<img[^>]*src=["']([^"']*rabdan[^"']*?\.(?:webp|jpg|jpeg))["'][^>]*>/gi;
  const matches = [];
  let match;
  
  while ((match = imgRegex.exec(html)) !== null) {
    matches.push(match[1]);
  }
  
  return [...new Set(matches)]; // Remove duplicates
}

async function scrapeRabdanImages() {
  console.log('🔍 Scraping Rabdan website for product images...\n');
  
  try {
    // Fetch the main products page
    const html = await fetchWebpage('https://rabdanperfumes.com/product-category/rabdan/');
    
    // Extract image URLs
    const imageUrls = extractImageUrls(html);
    
    console.log(`Found ${imageUrls.length} potential Rabdan product images:\n`);
    
    // Show first 10 images
    imageUrls.slice(0, 10).forEach((url, index) => {
      console.log(`${index + 1}. ${url}`);
    });
    
    if (imageUrls.length > 10) {
      console.log(`... and ${imageUrls.length - 10} more`);
    }
    
    // Create assets directory
    const assetsDir = path.join(__dirname, 'assets', 'perfumes');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    // Download a sample of images to test
    console.log('\n⬇️  Downloading sample images...\n');
    
    let downloaded = 0;
    let errors = 0;
    
    // Download first 5 images as samples
    for (let i = 0; i < Math.min(5, imageUrls.length); i++) {
      try {
        const url = imageUrls[i];
        const filename = path.basename(url).split('?')[0]; // Remove query parameters
        const filepath = path.join(assetsDir, filename);
        
        await downloadImage(url, filepath);
        downloaded++;
      } catch (error) {
        console.error(`✗ Failed to download image: ${error.message}`);
        errors++;
      }
    }
    
    console.log(`\n📊 Sample Download Summary:`);
    console.log(`✅ Downloaded: ${downloaded}`);
    console.log(`❌ Errors: ${errors}`);
    
  } catch (error) {
    console.error('Error scraping Rabdan website:', error.message);
  }
}

// Run the scraper
scrapeRabdanImages();