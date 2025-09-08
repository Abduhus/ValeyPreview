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

// Function to extract product URLs from the main products page
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

// Function to extract image URLs from product page HTML
function extractProductImages(html) {
  const imageUrls = new Set();
  
  // Look for main product images (larger sizes)
  const imagePatterns = [
    // WooCommerce product gallery images (full size)
    /<img[^>]*src=["'](https:\/\/rabdanperfumes\.com\/wp-content\/uploads\/[^"']*?\.(?:jpg|jpeg|png|webp))["'][^>]*class=["'][^"']*wp-post-image[^"']*["'][^>]*>/gi,
    /<img[^>]*class=["'][^"']*wp-post-image[^"']*["'][^>]*src=["'](https:\/\/rabdanperfumes\.com\/wp-content\/uploads\/[^"']*?\.(?:jpg|jpeg|png|webp))["'][^>]*>/gi,
    
    // Product gallery images
    /<img[^>]*src=["'](https:\/\/rabdanperfumes\.com\/wp-content\/uploads\/[^"']*?\.(?:jpg|jpeg|png|webp))["'][^>]*data-large_image=["'][^"']*["'][^>]*>/gi,
    /<img[^>]*data-large_image=["']([^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/gi,
    
    // WooCommerce gallery thumbnails (but we want the full size)
    /<img[^>]*src=["'](https:\/\/rabdanperfumes\.com\/wp-content\/uploads\/[^"']*?-\d+x\d+\.(?:jpg|jpeg|png|webp))["'][^>]*>/gi,
    
    // Any high-quality Rabdan images
    /https:\/\/rabdanperfumes\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/[^"'\s)]+\.(jpg|jpeg|png|webp)/gi
  ];
  
  imagePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      let url = match[1] || match[0];
      
      // If it's a thumbnail, try to get the full-size version
      if (url.includes('-300x300') || url.includes('-600x600') || url.includes('-768x') || url.includes('-1536x')) {
        // Try to remove size suffix to get full size
        const fullSizeUrl = url.replace(/-\d+x\d+(\.[^.]+)$/, '$1');
        imageUrls.add(fullSizeUrl);
      }
      
      imageUrls.add(url);
    }
  });
  
  // Remove query parameters and duplicates
  const cleanUrls = Array.from(imageUrls).map(url => {
    try {
      const urlObj = new URL(url);
      return urlObj.origin + urlObj.pathname; // Remove query parameters
    } catch {
      return url.split('?')[0]; // Fallback method
    }
  });
  
  return [...new Set(cleanUrls)];
}

// Function to check if a product is in stock
function isProductInStock(html) {
  // Look for stock status indicators
  const outOfStockIndicators = [
    /out.of.stock/i,
    /sold.out/i,
    /currently.unavailable/i,
    /not.in.stock/i
  ];
  
  const inStockIndicators = [
    /in.stock/i,
    /available/i,
    /add.to.cart/i
  ];
  
  // If we find out of stock indicators, assume it's not in stock
  for (const pattern of outOfStockIndicators) {
    if (pattern.test(html)) {
      return false;
    }
  }
  
  // If we find in stock indicators, assume it's in stock
  for (const pattern of inStockIndicators) {
    if (pattern.test(html)) {
      return true;
    }
  }
  
  // Default to assuming it's in stock if we can't determine
  return true;
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
    
    const file = fs.createWriteStream(filepath);
    
    request.on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {});
      reject(err);
    });
    
    request.setTimeout(30000, () => {
      request.destroy();
      file.close();
      fs.unlink(filepath, () => {});
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

// Main function to download all in-stock perfume images
async function downloadAllRabdanImages() {
  console.log('🔍 Starting comprehensive Rabdan perfume image download...');
  console.log('🎯 Target: All perfume photos at full quality (ignoring stock status)\n');
  
  const results = {
    successful: [],
    failed: [],
    skipped: [],
    productsChecked: 0,
    productsProcessed: 0
  };
  
  try {
    // Fetch the main products page
    console.log('📄 Fetching main products page...');
    const mainPageHtml = await fetchPage('https://rabdanperfumes.com/product-category/perfumes-2/');
    
    // Extract product URLs
    const productUrls = extractProductUrls(mainPageHtml);
    console.log(`🔗 Found ${productUrls.length} product pages to check\n`);
    
    // Track all image URLs to avoid duplicates
    const allImageUrls = new Set();
    
    // Process each product page
    for (let i = 0; i < productUrls.length; i++) {
      const productUrl = productUrls[i];
      console.log(`📦 [${i + 1}/${productUrls.length}] Checking product: ${productUrl}`);
      
      try {
        const productHtml = await fetchPage(productUrl);
        results.productsChecked++;
        
        // Extract images from this product (ignore stock status)
        const productImages = extractProductImages(productHtml);
        console.log(`   🖼️  Found ${productImages.length} images for this product`);
        
        // Add to our collection
        productImages.forEach(url => allImageUrls.add(url));
        
        results.productsProcessed++;
        
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.log(`   ⚠️  Failed to process product page: ${error.message}`);
      }
    }
    
    console.log(`\n📊 Product Analysis Summary:`);
    console.log(`   Total products checked: ${results.productsChecked}`);
    console.log(`   Products processed: ${results.productsProcessed}`);
    console.log(`   Unique images found: ${allImageUrls.size}\n`);
    
    // Download each unique image
    const imageUrlsArray = Array.from(allImageUrls);
    console.log(`📥 Starting download of ${imageUrlsArray.length} images...\n`);
    
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
        await new Promise(resolve => setTimeout(resolve, 500));
        
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
  console.log(`Products processed: ${results.productsProcessed}`);
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

// Run the downloader
downloadAllRabdanImages()
  .then(results => {
    console.log('\n✨ Script completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Script failed with error:', error);
    process.exit(1);
  });