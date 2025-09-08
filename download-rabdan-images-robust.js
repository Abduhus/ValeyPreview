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
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };
    
    https.get(url, options, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage} for ${url}`));
        }
      });
      
      response.on('error', (error) => {
        reject(error);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Function to extract high-quality image URLs from product page HTML
function extractHighQualityImages(html) {
  const imageUrls = new Set();
  
  // Look for full-size product images (avoid thumbnails)
  const imagePatterns = [
    // High-quality product images without size suffixes
    /https:\/\/rabdanperfumes\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/[^"'\s\-]*?\.(?:jpg|jpeg|png|webp)(?![\-\d])/gi,
    
    // Product images with specific patterns that indicate full size
    /https:\/\/rabdanperfumes\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/[a-zA-Z0-9_]+?\.(?:jpg|jpeg|png|webp)/gi,
    
    // WooCommerce large images
    /data-large_image=["'](https:\/\/rabdanperfumes\.com\/wp-content\/uploads\/[^"']*?\.(?:jpg|jpeg|png|webp))["']/gi
  ];
  
  imagePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      let url = match[1] || match[0];
      
      // Validate URL format
      try {
        new URL(url);
        imageUrls.add(url);
      } catch (e) {
        // Skip invalid URLs
        continue;
      }
    }
  });
  
  return Array.from(imageUrls);
}

// Function to download a single image with retry logic
async function downloadImageWithRetry(url, filepath, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await downloadImage(url, filepath);
    } catch (error) {
      console.log(`   ⚠️  Attempt ${attempt} failed for ${path.basename(filepath)}: ${error.message}`);
      if (attempt === maxRetries) {
        throw error;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Function to download a single image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };
    
    const request = https.get(url, options, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage} for ${url}`));
        return;
      }
      
      const file = fs.createWriteStream(filepath);
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
  try {
    const urlPath = new URL(url).pathname;
    let filename = path.basename(urlPath);
    
    // Handle URLs with query parameters
    filename = filename.split('?')[0];
    
    return filename;
  } catch (error) {
    // Fallback method
    return url.split('/').pop().split('?')[0];
  }
}

// Function to prioritize full-size images over thumbnails
function prioritizeFullSizeImages(imageUrls) {
  const fullSizeImages = [];
  const thumbnailImages = [];
  
  imageUrls.forEach(url => {
    if (url.includes('-300x300') || url.includes('-600x600') || url.includes('-150x150') || url.includes('-768x')) {
      thumbnailImages.push(url);
    } else {
      fullSizeImages.push(url);
    }
  });
  
  // Return full-size images first, then thumbnails
  return [...fullSizeImages, ...thumbnailImages];
}

// Main function to download all Rabdan perfume images
async function downloadAllRabdanImagesRobust() {
  console.log('🔍 Starting robust Rabdan perfume image download...');
  console.log('🎯 Target: All perfume photos at highest available quality\n');
  
  const results = {
    successful: [],
    failed: [],
    skipped: [],
    productsChecked: 0
  };
  
  // URLs for different product categories
  const categoryUrls = [
    'https://rabdanperfumes.com/product-category/perfumes-2/',
    'https://rabdanperfumes.com/product-category/brands/rabdan/',
    'https://rabdanperfumes.com/product-category/brands/signature-royale/',
    'https://rabdanperfumes.com/product-category/brands/pure-essence/',
    'https://rabdanperfumes.com/product-category/brands/coreterno/'
  ];
  
  try {
    // Track all image URLs to avoid duplicates
    const allImageUrls = new Set();
    
    // Process each category
    for (let i = 0; i < categoryUrls.length; i++) {
      const categoryUrl = categoryUrls[i];
      console.log(`📂 [${i + 1}/${categoryUrls.length}] Checking category: ${categoryUrl}`);
      
      try {
        const categoryHtml = await fetchPage(categoryUrl);
        
        // Extract product URLs from this category
        const productUrls = extractProductUrls(categoryHtml);
        console.log(`   🔗 Found ${productUrls.length} products in this category`);
        
        // Process each product page
        for (let j = 0; j < Math.min(productUrls.length, 5); j++) { // Limit to 5 products per category to avoid overwhelming
          const productUrl = productUrls[j];
          console.log(`   📦 [${j + 1}/${Math.min(productUrls.length, 5)}] Checking product: ${productUrl}`);
          
          try {
            const productHtml = await fetchPage(productUrl);
            results.productsChecked++;
            
            // Extract high-quality images from this product
            const productImages = extractHighQualityImages(productHtml);
            console.log(`      🖼️  Found ${productImages.length} potential high-quality images`);
            
            // Add to our collection
            productImages.forEach(url => allImageUrls.add(url));
            
            // Add delay between requests
            await new Promise(resolve => setTimeout(resolve, 500));
            
          } catch (error) {
            console.log(`      ⚠️  Failed to process product page: ${error.message}`);
          }
        }
        
        // Add delay between category requests
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.log(`   ⚠️  Failed to process category: ${error.message}`);
      }
    }
    
    console.log(`\n📊 Analysis Summary:`);
    console.log(`   Total products checked: ${results.productsChecked}`);
    console.log(`   Unique images found: ${allImageUrls.size}\n`);
    
    // Prioritize full-size images
    const prioritizedImageUrls = prioritizeFullSizeImages(Array.from(allImageUrls));
    console.log(`📥 Starting download of ${prioritizedImageUrls.length} images (prioritized for quality)...\n`);
    
    // Download each image
    for (let i = 0; i < prioritizedImageUrls.length; i++) {
      const url = prioritizedImageUrls[i];
      const filename = getFilenameFromUrl(url);
      const filepath = path.join(assetsDir, filename);
      
      try {
        console.log(`📥 [${i + 1}/${prioritizedImageUrls.length}] Downloading: ${filename}`);
        
        // Skip if file already exists and has content
        if (fs.existsSync(filepath)) {
          const stats = fs.statSync(filepath);
          if (stats.size > 0) {
            console.log(`   ✓ File already exists: ${filename} (${(stats.size / 1024).toFixed(1)}KB)`);
            results.skipped.push({ url, filename, size: stats.size });
            continue;
          }
        }
        
        await downloadImageWithRetry(url, filepath);
        const stats = fs.statSync(filepath);
        console.log(`   ✓ Downloaded: ${filename} (${(stats.size / 1024).toFixed(1)}KB)`);
        results.successful.push({ url, filename, size: stats.size });
        
        // Add delay between downloads
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error) {
        console.log(`   ✗ Failed: ${filename} - ${error.message}`);
        results.failed.push({ url, filename, error: error.message });
      }
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    return results;
  }
  
  // Summary
  console.log('\n🎉 === DOWNLOAD SUMMARY ===');
  console.log(`Total products checked: ${results.productsChecked}`);
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
  console.log('\n💡 Next steps:');
  console.log('1. Restart the development server to see new images');
  console.log('2. Update product data in server/storage.ts to reference new images');
  console.log('3. Verify image quality and product associations');
  
  return results;
}

// Function to extract product URLs from HTML
function extractProductUrls(html) {
  const productUrls = new Set();
  
  // Look for product links
  const productLinkRegex = /<a[^>]*href=["'](https:\/\/rabdanperfumes\.com\/product\/[^"']*)["'][^>]*>/gi;
  let match;
  
  while ((match = productLinkRegex.exec(html)) !== null) {
    productUrls.add(match[1]);
  }
  
  return Array.from(productUrls);
}

// Run the downloader
downloadAllRabdanImagesRobust()
  .then(results => {
    console.log('\n✨ Script completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Script failed with error:', error);
    process.exit(1);
  });