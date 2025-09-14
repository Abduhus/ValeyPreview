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

// Bvlgari product URLs and corresponding image filenames from your catalog (second images)
const bvlgariProducts = [
  {
    url: "https://www.bulgari.com/en-ae/fragrances/bvlgari-le-gemme/bvlgari-le-gemme-tygar-eau-de-parfum-42170",
    name: "BVLGARI LE GEMME MAN TYGAR",
    images: [
      "bvlgari_le_gemme_man_tygar_125_39_2.webp"
    ]
  },
  {
    url: "https://www.bulgari.com/en-us/fragrances/bvlgari-le-gemme/le-gemme-kobraa-eau-de-parfum-42181",
    name: "BVLGARI LE GEMME KOBRAA",
    images: [
      "bvlgari_le_gemme_kobraa_125ml_40_2.webp"
    ]
  },
  {
    url: "https://www.bulgari.com/en-ae/fragrances/bvlgari-le-gemme/bvlgari-le-gemme-sahare-eau-de-parfum-42327",
    name: "BVLGARI LE GEMME SAHARE",
    images: [
      "bvlgari_le_gemme_sahare_125ml_41_2.webp"
    ]
  },
  {
    url: "https://www.bulgari.com/en-ae/fragrances/bvlgari-le-gemme/bvlgari-le-gemme-onekh-eau-de-parfum-42175",
    name: "BVLGARI LE GEMME MEN ONEKH",
    images: [
      "bvlgari_le_gemme_men_onekh_125_42_2.webp"
    ]
  },
  {
    url: "https://www.bulgari.com/en-ae/fragrances/bvlgari-le-gemme/bvlgari-le-gemme-orom-eau-de-parfum-42180",
    name: "BVLGARI LE GEMME OROM",
    images: [
      "bvlgari_le_gemme_orom_125_ml_e_43_2.webp"
    ]
  },
  {
    url: "https://www.bulgari.com/en-ae/fragrances/bvlgari-le-gemme/bvlgari-le-gemme-falkar-eau-de-parfum-42178",
    name: "BVLGARI LE GEMME FALKAR",
    images: [
      "bvlgari_le_gemme_falkar_125_ml_44_2.webp"
    ]
  },
  {
    url: "https://www.bulgari.com/en-ae/fragrances/bvlgari-le-gemme/bvlgari-le-gemme-gyan-eau-de-parfum-42179",
    name: "BVLGARI LE GEMME GYAN",
    images: [
      "bvlgari_le_gemme_gyan_125_ml_e_45_2.webp"
    ]
  },
  {
    url: "https://www.bulgari.com/en-us/fragrances/bvlgari-le-gemme/le-gemme-amunae-42488",
    name: "BVLGARI LE GEMME AMUNE",
    images: [
      "bvlgari_le_gemme_amune_125_ml_46_2.webp"
    ]
  }
];

// Function to download image using Puppeteer
async function downloadImageWithPuppeteer(page, imageUrl, filepath) {
  try {
    // Navigate to the image URL
    const response = await page.goto(imageUrl, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    if (response.status() === 200) {
      const buffer = await response.buffer();
      fs.writeFileSync(filepath, buffer);
      const stats = fs.statSync(filepath);
      return stats.size;
    } else {
      throw new Error(`HTTP ${response.status()}`);
    }
  } catch (error) {
    throw new Error(`Failed to download: ${error.message}`);
  }
}

// Function to extract second product images
async function extractSecondProductImages(page, productUrl) {
  console.log(`   🌐 Navigating to product page...`);
  
  await page.goto(productUrl, {
    waitUntil: 'networkidle0',
    timeout: 60000
  });
  
  // Wait and scroll to load all content
  await new Promise(resolve => setTimeout(resolve, 3000));
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Comprehensive image extraction for second images
  const imageData = await page.evaluate(() => {
    const images = [];
    
    // Method 1: Look for product gallery images
    const galleryImages = document.querySelectorAll('.product-gallery img, .pdp-media img, .product-slider img');
    galleryImages.forEach((el, index) => {
      // Skip the first image (main image) and get subsequent ones
      if (index > 0) {
        const src = el.src || el.getAttribute('data-src') || el.getAttribute('data-image-original');
        if (src && src.includes('bulgari')) {
          let cleanUrl = src;
          // Convert relative URLs to absolute
          if (cleanUrl.startsWith('//')) {
            cleanUrl = 'https:' + cleanUrl;
          } else if (cleanUrl.startsWith('/')) {
            cleanUrl = 'https://www.bulgari.com' + cleanUrl;
          }
          // Remove query parameters
          cleanUrl = cleanUrl.replace(/\?.*$/, '');
          if (!images.includes(cleanUrl)) {
            images.push(cleanUrl);
          }
        }
      }
    });
    
    // Method 2: Check for additional images in structured data
    const jsonScripts = document.querySelectorAll('script[type="application/ld+json"]');
    jsonScripts.forEach(script => {
      try {
        const json = JSON.parse(script.textContent);
        if (json.image && Array.isArray(json.image)) {
          // Get images beyond the first one
          for (let i = 1; i < json.image.length; i++) {
            const img = json.image[i];
            if (typeof img === 'string' && img.includes('bulgari')) {
              let cleanUrl = img.replace(/\?.*$/, '');
              if (!images.includes(cleanUrl)) {
                images.push(cleanUrl);
              }
            }
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    });
    
    // Method 3: Fallback - find any additional Bulgari images
    if (images.length === 0) {
      const allImages = document.querySelectorAll('img');
      allImages.forEach((img, index) => {
        // Skip first few images which are likely the main product image
        if (index > 0) {
          const src = img.src || img.getAttribute('data-src');
          if (src && src.includes('bulgari') && 
              !src.includes('logo') && !src.includes('icon') && !src.includes('thumb')) {
            let cleanUrl = src;
            // Convert relative URLs to absolute
            if (cleanUrl.startsWith('//')) {
              cleanUrl = 'https:' + cleanUrl;
            } else if (cleanUrl.startsWith('/')) {
              cleanUrl = 'https://www.bulgari.com' + cleanUrl;
            }
            // Remove query parameters
            cleanUrl = cleanUrl.replace(/\?.*$/, '');
            if (!images.includes(cleanUrl)) {
              images.push(cleanUrl);
            }
          }
        }
      });
    }
    
    return images.slice(0, 2); // Return up to 2 additional images
  });
  
  console.log(`   📸 Found ${imageData.length} potential additional product images`);
  return imageData;
}

// Main function to download all second Bvlgari images
async function downloadAllSecondBvlgariImages() {
  console.log('🔍 Starting Bvlgari Le Gemme second perfume image download...');
  console.log(`📄 Found ${bvlgariProducts.length} products to process for second images...\n`);
  
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
    
    // Set extra headers
    await page.setExtraHTTPHeaders({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    });
    
    for (let i = 0; i < bvlgariProducts.length; i++) {
      const product = bvlgariProducts[i];
      console.log(`📦 [${i + 1}/${bvlgariProducts.length}] Processing: ${product.name}`);
      console.log(`🔗 URL: ${product.url}`);
      
      try {
        // Extract image URLs
        const imageUrls = await extractSecondProductImages(page, product.url);
        
        if (imageUrls.length === 0) {
          console.log(`⚠️  No additional images found for ${product.name}`);
          results.failed.push({ product: product.name, error: 'No additional images found' });
          continue;
        }
        
        console.log(`   📥 Found ${imageUrls.length} additional images, downloading first one...`);
        
        // Download the first additional image (which should be the second image for the product)
        const imageUrl = imageUrls[0];
        const filename = product.images[0];
        const filepath = path.join(assetsDir, filename);
        
        try {
          console.log(`   📥 Downloading: ${filename}`);
          console.log(`   🌐 From: ${imageUrl}`);
          
          // Skip if file already exists and is not empty
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
          
          // Download with Puppeteer
          const size = await downloadImageWithPuppeteer(page, imageUrl, filepath);
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
downloadAllSecondBvlgariImages().catch(console.error);