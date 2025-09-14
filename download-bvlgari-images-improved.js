import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create assets/perfumes directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets', 'perfumes');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Bvlgari product URLs and corresponding image filenames from your catalog
const bvlgariProducts = [
  {
    url: "https://www.bulgari.com/en-ae/fragrances/bvlgari-le-gemme/bvlgari-le-gemme-tygar-eau-de-parfum-42170",
    name: "BVLGARI LE GEMME MAN TYGAR",
    images: [
      "bvlgari_le_gemme_man_tygar_125_39_1.webp",
      "bvlgari_le_gemme_man_tygar_125_39_2.webp"
    ]
  },
  {
    url: "https://www.bulgari.com/en-us/fragrances/bvlgari-le-gemme/le-gemme-kobraa-eau-de-parfum-42181",
    name: "BVLGARI LE GEMME KOBRAA",
    images: [
      "bvlgari_le_gemme_kobraa_125ml_40_1.webp",
      "bvlgari_le_gemme_kobraa_125ml_40_2.webp"
    ]
  },
  {
    url: "https://www.bulgari.com/en-ae/fragrances/bvlgari-le-gemme/bvlgari-le-gemme-sahare-eau-de-parfum-42327",
    name: "BVLGARI LE GEMME SAHARE",
    images: [
      "bvlgari_le_gemme_sahare_125ml_41_1.webp",
      "bvlgari_le_gemme_sahare_125ml_41_2.webp"
    ]
  },
  {
    url: "https://www.bulgari.com/en-ae/fragrances/bvlgari-le-gemme/bvlgari-le-gemme-onekh-eau-de-parfum-42175",
    name: "BVLGARI LE GEMME MEN ONEKH",
    images: [
      "bvlgari_le_gemme_men_onekh_125_42_1.webp",
      "bvlgari_le_gemme_men_onekh_125_42_2.webp"
    ]
  },
  {
    url: "https://www.bulgari.com/en-ae/fragrances/bvlgari-le-gemme/bvlgari-le-gemme-orom-eau-de-parfum-42180",
    name: "BVLGARI LE GEMME OROM",
    images: [
      "bvlgari_le_gemme_orom_125_ml_e_43_1.webp",
      "bvlgari_le_gemme_orom_125_ml_e_43_2.webp"
    ]
  },
  {
    url: "https://www.bulgari.com/en-ae/fragrances/bvlgari-le-gemme/bvlgari-le-gemme-falkar-eau-de-parfum-42178",
    name: "BVLGARI LE GEMME FALKAR",
    images: [
      "bvlgari_le_gemme_falkar_125_ml_44_1.webp",
      "bvlgari_le_gemme_falkar_125_ml_44_2.webp"
    ]
  },
  {
    url: "https://www.bulgari.com/en-ae/fragrances/bvlgari-le-gemme/bvlgari-le-gemme-gyan-eau-de-parfum-42179",
    name: "BVLGARI LE GEMME GYAN",
    images: [
      "bvlgari_le_gemme_gyan_125_ml_e_45_1.webp",
      "bvlgari_le_gemme_gyan_125_ml_e_45_2.webp"
    ]
  },
  {
    url: "https://www.bulgari.com/en-us/fragrances/bvlgari-le-gemme/le-gemme-amunae-42488",
    name: "BVLGARI LE GEMME AMUNE",
    images: [
      "bvlgari_le_gemme_amune_125_ml_46_1.webp",
      "bvlgari_le_gemme_amune_125_ml_46_2.webp"
    ]
  }
];

// Function to download an image directly from URL
async function downloadImageDirect(page, imageUrl, filepath) {
  try {
    const response = await page.goto(imageUrl, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    if (response.status() !== 200) {
      throw new Error(`HTTP ${response.status()}`);
    }
    
    const buffer = await response.buffer();
    fs.writeFileSync(filepath, buffer);
    return fs.statSync(filepath).size;
  } catch (error) {
    throw new Error(`Failed to download: ${error.message}`);
  }
}

// Function to extract product images using more comprehensive selectors
async function extractProductImages(page, productUrl) {
  console.log(`   🌐 Navigating to product page...`);
  
  await page.goto(productUrl, {
    waitUntil: 'networkidle0',
    timeout: 60000
  });
  
  // Wait a bit for all content to load
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Extract image URLs using comprehensive page evaluation
  const imageData = await page.evaluate(() => {
    const images = [];
    
    // Try multiple approaches to find product images
    // 1. Look for images in product detail areas
    const productImageSelectors = [
      '.product-image-container img',
      '.pdp-image img',
      '.product-main-image img',
      '.main-product-image img',
      '.product-hero img',
      '.product-gallery img',
      '.pdp-media img',
      '.product-slider img',
      '.product-images img',
      '[data-image-original]',
      '[data-zoom-image]',
      '[data-image-hd]',
      'img[src*="bulgari"]'
    ];
    
    // Try each selector
    for (const selector of productImageSelectors) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        let src = el.getAttribute('src') || 
                  el.getAttribute('data-image-original') || 
                  el.getAttribute('data-zoom-image') ||
                  el.getAttribute('data-image-hd') ||
                  el.getAttribute('data-image');
        
        if (src) {
          // Convert to absolute URL if needed
          if (src.startsWith('//')) {
            src = 'https:' + src;
          } else if (src.startsWith('/')) {
            src = 'https://www.bulgari.com' + src;
          }
          
          // Filter for product images
          if (src.includes('bulgari') && 
              (src.includes('product') || src.includes('le-gemme') || src.includes('collection')) &&
              !src.includes('logo') && 
              !src.includes('icon') && 
              !src.includes('thumb')) {
            
            // Try to get high quality version
            let highQualitySrc = src;
            // Remove common size parameters
            highQualitySrc = highQualitySrc.replace(/\/w_\d+/, '/w_1200')
                                           .replace(/\/h_\d+/, '/h_1600')
                                           .replace(/\/q_\d+/, '/q_100')
                                           .replace(/\/c_[^\/]+/, '/c_fill')
                                           .replace(/\?.*$/, ''); // Remove query parameters
            
            // Add to images array if not already present
            if (!images.includes(highQualitySrc)) {
              images.push(highQualitySrc);
            }
          }
        }
      });
      
      // If we found images, break to avoid duplicates
      if (images.length > 0) {
        break;
      }
    }
    
    // 2. Look for background images
    const bgImageElements = document.querySelectorAll('[style*="background-image"]');
    bgImageElements.forEach(el => {
      const style = el.getAttribute('style');
      if (style) {
        const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
        if (match && match[1]) {
          let src = match[1];
          if (src.startsWith('//')) {
            src = 'https:' + src;
          } else if (src.startsWith('/')) {
            src = 'https://www.bulgari.com' + src;
          }
          
          if (src.includes('bulgari') && 
              (src.includes('product') || src.includes('le-gemme') || src.includes('collection')) &&
              !src.includes('logo') && 
              !src.includes('icon') && 
              !src.includes('thumb')) {
            
            let highQualitySrc = src;
            highQualitySrc = highQualitySrc.replace(/\/w_\d+/, '/w_1200')
                                           .replace(/\/h_\d+/, '/h_1600')
                                           .replace(/\/q_\d+/, '/q_100')
                                           .replace(/\?.*$/, '');
            
            if (!images.includes(highQualitySrc)) {
              images.push(highQualitySrc);
            }
          }
        }
      }
    });
    
    // 3. Look for images in JSON-LD structured data
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(script => {
      try {
        const json = JSON.parse(script.textContent);
        if (json.image) {
          if (Array.isArray(json.image)) {
            json.image.forEach(img => {
              if (typeof img === 'string' && img.includes('bulgari')) {
                let highQualitySrc = img;
                highQualitySrc = highQualitySrc.replace(/\/w_\d+/, '/w_1200')
                                               .replace(/\/h_\d+/, '/h_1600')
                                               .replace(/\/q_\d+/, '/q_100')
                                               .replace(/\?.*$/, '');
                
                if (!images.includes(highQualitySrc)) {
                  images.push(highQualitySrc);
                }
              }
            });
          } else if (typeof json.image === 'string' && json.image.includes('bulgari')) {
            let highQualitySrc = json.image;
            highQualitySrc = highQualitySrc.replace(/\/w_\d+/, '/w_1200')
                                           .replace(/\/h_\d+/, '/h_1600')
                                           .replace(/\/q_\d+/, '/q_100')
                                           .replace(/\?.*$/, '');
            
            if (!images.includes(highQualitySrc)) {
              images.push(highQualitySrc);
            }
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    });
    
    return images;
  });
  
  console.log(`   📸 Found ${imageData.length} potential product images`);
  return imageData.slice(0, 2); // Return at most 2 images
}

// Main function to download all Bvlgari images
async function downloadAllBvlgariImages() {
  console.log('🔍 Starting Bvlgari Le Gemme perfume image download (Improved)...');
  console.log(`📄 Found ${bvlgariProducts.length} products to process...\n`);
  
  let browser;
  const results = {
    successful: [],
    failed: []
  };
  
  try {
    console.log('🚀 Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    for (let i = 0; i < bvlgariProducts.length; i++) {
      const product = bvlgariProducts[i];
      console.log(`📦 [${i + 1}/${bvlgariProducts.length}] Processing: ${product.name}`);
      console.log(`🔗 URL: ${product.url}`);
      
      try {
        // Extract image URLs
        const imageUrls = await extractProductImages(page, product.url);
        
        if (imageUrls.length === 0) {
          console.log(`⚠️  No images found for ${product.name}`);
          results.failed.push({ product: product.name, error: 'No images found' });
          
          // Try a fallback approach - look for any Bulgari images on the page
          console.log(`   🔍 Trying fallback approach...`);
          const fallbackImages = await page.evaluate(() => {
            const images = [];
            const imgElements = document.querySelectorAll('img');
            imgElements.forEach(img => {
              const src = img.src || img.getAttribute('data-src');
              if (src && src.includes('bulgari') && 
                  (src.includes('product') || src.includes('le-gemme')) &&
                  !src.includes('logo') && !src.includes('icon')) {
                // Try to get high quality version
                let highQualitySrc = src;
                highQualitySrc = highQualitySrc.replace(/\/w_\d+/, '/w_1200')
                                               .replace(/\/h_\d+/, '/h_1600')
                                               .replace(/\/q_\d+/, '/q_100')
                                               .replace(/\?.*$/, '');
                images.push(highQualitySrc);
              }
            });
            return images.slice(0, 2);
          });
          
          if (fallbackImages.length === 0) {
            continue;
          } else {
            console.log(`   📸 Found ${fallbackImages.length} images with fallback approach`);
            // Use fallback images
            for (let j = 0; j < Math.min(fallbackImages.length, product.images.length); j++) {
              const imageUrl = fallbackImages[j];
              const filename = product.images[j];
              const filepath = path.join(assetsDir, filename);
              
              try {
                console.log(`   📥 Downloading: ${filename}`);
                const size = await downloadImageDirect(page, imageUrl, filepath);
                console.log(`   ✓ Downloaded: ${filename} (${(size / 1024).toFixed(1)}KB)`);
                results.successful.push({ 
                  product: product.name, 
                  filename, 
                  url: imageUrl,
                  status: 'downloaded',
                  size: size
                });
              } catch (error) {
                console.log(`   ✗ Failed to download ${filename}: ${error.message}`);
                results.failed.push({ 
                  product: product.name, 
                  filename, 
                  url: imageUrl,
                  error: error.message 
                });
              }
            }
            continue;
          }
        }
        
        // Download each image
        for (let j = 0; j < Math.min(imageUrls.length, product.images.length); j++) {
          const imageUrl = imageUrls[j];
          const filename = product.images[j];
          const filepath = path.join(assetsDir, filename);
          
          try {
            console.log(`   📥 Downloading: ${filename}`);
            console.log(`   🌐 Image URL: ${imageUrl}`);
            
            // Skip if file already exists
            if (fs.existsSync(filepath)) {
              const stats = fs.statSync(filepath);
              if (stats.size > 0) {
                console.log(`   ✓ File already exists: ${filename} (${(stats.size / 1024).toFixed(1)}KB)`);
                results.successful.push({ 
                  product: product.name, 
                  filename, 
                  url: imageUrl,
                  status: 'already_exists',
                  size: stats.size
                });
                continue;
              }
            }
            
            const size = await downloadImageDirect(page, imageUrl, filepath);
            console.log(`   ✓ Downloaded: ${filename} (${(size / 1024).toFixed(1)}KB)`);
            results.successful.push({ 
              product: product.name, 
              filename, 
              url: imageUrl,
              status: 'downloaded',
              size: size
            });
            
          } catch (error) {
            console.log(`   ✗ Failed to download ${filename}: ${error.message}`);
            results.failed.push({ 
              product: product.name, 
              filename, 
              url: imageUrl,
              error: error.message 
            });
          }
        }
        
        // Add delay between products to be respectful
        if (i < bvlgariProducts.length - 1) {
          console.log(`   ⏳ Waiting 3 seconds before next product...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
      } catch (error) {
        console.log(`❌ Error processing ${product.name}: ${error.message}`);
        results.failed.push({ product: product.name, error: error.message });
      }
      
      console.log(); // Empty line for readability
    }
    
  } catch (error) {
    console.log(`❌ Browser error: ${error.message}`);
  } finally {
    if (browser) {
      console.log('🔒 Closing browser...');
      await browser.close();
    }
  }
  
  // Summary
  console.log('🎉 === DOWNLOAD SUMMARY ===');
  console.log(`Total products processed: ${bvlgariProducts.length}`);
  console.log(`Successful downloads: ${results.successful.filter(r => r.status === 'downloaded').length}`);
  console.log(`Already existing files: ${results.successful.filter(r => r.status === 'already_exists').length}`);
  console.log(`Failed downloads: ${results.failed.length}`);
  
  if (results.successful.filter(r => r.status === 'downloaded').length > 0) {
    console.log('\n✅ New downloads:');
    results.successful.filter(r => r.status === 'downloaded').forEach(item => {
      console.log(`   ${item.filename} (${(item.size / 1024).toFixed(1)}KB)`);
    });
  }
  
  if (results.successful.filter(r => r.status === 'already_exists').length > 0) {
    console.log('\n📋 Already existing files:');
    results.successful.filter(r => r.status === 'already_exists').forEach(item => {
      console.log(`   ${item.filename} (${(item.size / 1024).toFixed(1)}KB)`);
    });
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed downloads:');
    results.failed.forEach(item => {
      console.log(`   ${item.product}: ${item.error}`);
    });
  }
  
  console.log(`\n📁 All images saved to: ${assetsDir}`);
  return results;
}

// Run the download
downloadAllBvlgariImages().catch(console.error);