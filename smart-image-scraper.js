import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create assets/perfumes directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets', 'perfumes');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Function to make HTTP requests and get page content
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        resolve(data);
      });
      
      response.on('error', (error) => {
        reject(error);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Function to extract image URLs from HTML content
function extractImageUrls(html) {
  const imageUrls = new Set();
  
  // Look for various image URL patterns in the HTML
  const patterns = [
    // WordPress media library images
    /https:\/\/rabdanperfumes\.com\/wp-content\/uploads\/[^"'\s)]+\.(jpg|jpeg|png|webp)/gi,
    // Product images in src attributes
    /src="(https:\/\/rabdanperfumes\.com\/wp-content\/uploads\/[^"]+\.(jpg|jpeg|png|webp))"/gi,
    // Background images in CSS
    /background-image:\s*url\(['"]?(https:\/\/rabdanperfumes\.com\/wp-content\/uploads\/[^'")\s]+\.(jpg|jpeg|png|webp))['"]?\)/gi,
    // Data attributes
    /data-[^=]*="(https:\/\/rabdanperfumes\.com\/wp-content\/uploads\/[^"]+\.(jpg|jpeg|png|webp))"/gi
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const url = match[1] || match[0];
      if (url && url.includes('rabdanperfumes.com')) {
        imageUrls.add(url);
      }
    }
  });
  
  return Array.from(imageUrls);
}

// Function to download a single image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    const request = https.get(url, (response) => {
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
        fs.unlink(filepath, () => {});
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
  let filename = path.basename(urlPath);
  
  // Handle URLs with query parameters
  filename = filename.split('?')[0];
  
  return filename;
}

// Main scraping and download function
async function scrapeAndDownloadImages() {
  console.log('🔍 Starting intelligent image scraping from rabdanperfumes.com...');
  
  const results = {
    successful: [],
    failed: [],
    skipped: []
  };
  
  // URLs to scrape for images
  const pagesToScrape = [
    'https://rabdanperfumes.com',
    'https://rabdanperfumes.com/product-category/brands/rabdan/',
    'https://rabdanperfumes.com/product-category/brands/signature-royale/',
    'https://rabdanperfumes.com/product-category/brands/pure-essence/',
    'https://rabdanperfumes.com/product-category/brands/coreterno/',
    'https://rabdanperfumes.com/product-category/perfumes-2/',
  ];
  
  let allImageUrls = new Set();
  
  // Scrape each page for image URLs
  for (const pageUrl of pagesToScrape) {
    try {
      console.log(`📄 Scraping page: ${pageUrl}`);
      const html = await fetchPage(pageUrl);
      const imageUrls = extractImageUrls(html);
      
      console.log(`   Found ${imageUrls.length} images on this page`);
      
      imageUrls.forEach(url => allImageUrls.add(url));
      
      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.log(`   ⚠️ Failed to scrape ${pageUrl}: ${error.message}`);
    }
  }
  
  console.log(`\n📊 Total unique images found: ${allImageUrls.size}`);
  
  // Download each unique image
  const imageUrlsArray = Array.from(allImageUrls);
  for (let i = 0; i < imageUrlsArray.length; i++) {
    const url = imageUrlsArray[i];
    const filename = getFilenameFromUrl(url);
    const filepath = path.join(assetsDir, filename);
    
    try {
      console.log(`📥 [${i + 1}/${imageUrlsArray.length}] Downloading: ${filename}`);
      
      // Skip if file already exists and has content
      if (fs.existsSync(filepath)) {
        const stats = fs.statSync(filepath);
        if (stats.size > 0) {
          console.log(`   ✓ File already exists: ${filename} (${(stats.size / 1024).toFixed(1)}KB)`);
          results.skipped.push({ url, filename, size: stats.size });
          continue;
        }
      }
      
      await downloadImage(url, filepath);
      const stats = fs.statSync(filepath);
      console.log(`   ✓ Downloaded: ${filename} (${(stats.size / 1024).toFixed(1)}KB)`);
      results.successful.push({ url, filename, size: stats.size });
      
      // Add delay between downloads
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.log(`   ✗ Failed: ${filename} - ${error.message}`);
      results.failed.push({ url, filename, error: error.message });
    }
  }
  
  // Summary
  console.log('\n🎉 === DOWNLOAD SUMMARY ===');
  console.log(`Total images found: ${imageUrlsArray.length}`);
  console.log(`Successfully downloaded: ${results.successful.length}`);
  console.log(`Already existed: ${results.skipped.length}`);
  console.log(`Failed: ${results.failed.length}`);
  
  // Calculate total size
  const totalSize = [...results.successful, ...results.skipped]
    .reduce((sum, item) => sum + item.size, 0);
  
  console.log(`Total size: ${(totalSize / (1024 * 1024)).toFixed(2)}MB`);
  
  if (results.successful.length > 0) {
    console.log('\n✅ New downloads:');
    results.successful.forEach(item => {
      console.log(`   ${item.filename} (${(item.size / 1024).toFixed(1)}KB)`);
    });
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed downloads:');
    results.failed.slice(0, 10).forEach(item => {
      console.log(`   ${item.filename}: ${item.error}`);
    });
    if (results.failed.length > 10) {
      console.log(`   ... and ${results.failed.length - 10} more failures`);
    }
  }
  
  console.log(`\n📁 All images saved to: ${assetsDir}`);
  
  return results;
}

// Run the scraper
scrapeAndDownloadImages().catch(console.error);