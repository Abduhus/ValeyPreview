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

// Function to download image using Puppeteer
async function downloadImageWithPuppeteer(page, url, filepath) {
  try {
    // Navigate to the image URL directly
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Get the image element
    const imageElement = await page.$('img');
    if (!imageElement) {
      throw new Error('No image found on page');
    }
    
    // Get the image source
    const imageUrl = await page.evaluate(el => el.src, imageElement);
    
    // Download the image
    const viewSource = await page.goto(imageUrl);
    const buffer = await viewSource.buffer();
    
    // Save to file
    fs.writeFileSync(filepath, buffer);
    return fs.statSync(filepath).size;
  } catch (error) {
    throw new Error(`Failed to download image: ${error.message}`);
  }
}

// Function to extract product images using Puppeteer
async function extractProductImages(page, productUrl) {
  console.log(`   🌐 Navigating to product page...`);
  
  await page.goto(productUrl, {
    waitUntil: 'networkidle0',
    timeout: 60000
  });
  
  // Wait for product images to load
  await page.waitForSelector('img', { timeout: 10000 }).catch(() => {});
  
  // Scroll to load all images
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Extract image URLs using page evaluation
  const imageUrls = await page.evaluate(() => {
    const images = new Set();
    
    // Look for product images in various selectors
    const selectors = [
      '.product-image img',           // Main product image
      '.product-gallery img',         // Gallery images
      '.pdp-media img',               // Product detail images
      '.product-slider img',          // Slider images
      '[data-image-original]',        // Data attributes
      '[data-zoom-image]',            // Zoom images
      'img[src*="product"]',          // Product images in src
      'img[src*="le-gemme"]'          // Le Gemme specific images
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // Get image from src or data attributes
        const src = el.getAttribute('src') || 
                   el.getAttribute('data-image-original') || 
                   el.getAttribute('data-zoom-image') ||
                   el.getAttribute('data-image-hd');
        
        if (src && src.includes('bulgari') && (src.includes('product') || src.includes('le-gemme'))) {
          // Convert to full URL if needed
          let fullUrl = src;
          if (src.startsWith('//')) {
            fullUrl = 'https:' + src;
          } else if (src.startsWith('/')) {
            fullUrl = 'https://www.bulgari.com' + src;
          } else if (!src.startsWith('http')) {
            fullUrl = 'https://www.bulgari.com/' + src;
          }
          
          // Try to get high quality version
          fullUrl = fullUrl.replace(/\/w_\d+\//g, '/w_1200/')
                          .replace(/\/h_\d+\//g, '/h_1600/')
                          .replace(/\/q_\d+\//g, '/q_100/')
                          .replace(/\?.*$/, ''); // Remove query parameters
          
          images.add(fullUrl);
        }
      });
    });
    
    // Also check for background images
    const bgElements = document.querySelectorAll('[style*="background-image"]');
    bgElements.forEach(el => {
      const style = el.getAttribute('style');
      if (style) {
        const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
        if (match && match[1] && match[1].includes('bulgari') && match[1].includes('product')) {
          let fullUrl = match[1];
          if (fullUrl.startsWith('//')) {
            fullUrl = 'https:' + fullUrl;
          } else if (fullUrl.startsWith('/')) {
            fullUrl = 'https://www.bulgari.com' + fullUrl;
          }
          
          fullUrl = fullUrl.replace(/\/w_\d+\//g, '/w_1200/')
                          .replace(/\/h_\d+\//g, '/h_1600/')
                          .replace(/\/q_\d+\//g, '/q_100/')
                          .replace(/\?.*$/, '');
          
          images.add(fullUrl);
        }
      }
    });
    
    return Array.from(images);
  });
  
  console.log(`   📸 Found ${imageUrls.length} potential product images`);
  return imageUrls.slice(0, 2); // Return at most 2 images
}

// Main function to download all Bvlgari images using Puppeteer
async function downloadAllBvlgariImagesWithPuppeteer() {
  console.log('🔍 Starting Bvlgari Le Gemme perfume image download with Puppeteer...');
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
          continue;
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
            
            // Navigate directly to image URL and download
            await page.goto(imageUrl, { 
              waitUntil: 'networkidle0',
              timeout: 30000
            });
            
            const imageBuffer = await page.screenshot({ 
              type: 'jpeg',
              quality: 100,
              fullPage: true
            });
            
            fs.writeFileSync(filepath, imageBuffer);
            const stats = fs.statSync(filepath);
            console.log(`   ✓ Downloaded: ${filename} (${(stats.size / 1024).toFixed(1)}KB)`);
            results.successful.push({ 
              product: product.name, 
              filename, 
              url: imageUrl,
              status: 'downloaded',
              size: stats.size
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

// Run the Puppeteer download
downloadAllBvlgariImagesWithPuppeteer().catch(console.error);