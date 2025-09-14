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

// Function to make HTTP requests and get page content
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    console.log(`🌐 Making request to: ${url}`);

    const request = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      },
      timeout: 30000 // 30 second timeout
    }, (response) => {
      console.log(`📡 Response status: ${response.statusCode}`);

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }

      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        console.log(`📄 Received ${data.length} characters of HTML`);
        resolve(data);
      });

      response.on('error', (error) => {
        reject(error);
      });
    });

    request.on('error', (error) => {
      console.log(`❌ Request error: ${error.message}`);
      reject(error);
    });

    request.on('timeout', () => {
      console.log(`⏰ Request timeout for ${url}`);
      request.destroy();
      reject(new Error(`Request timeout for ${url}`));
    });
  });
}

// Function to extract high-quality image URLs from Bulgari product page
function extractProductImageUrls(html) {
  const imageUrls = [];
  
  // Look for product images in various formats
  const patterns = [
    // Main product image in data attributes
    /data-image-original=["']([^"']+)["']/gi,
    /data-image-hd=["']([^"']+)["']/gi,
    /data-zoom-image=["']([^"']+)["']/gi,
    // Standard image sources
    /<img[^>]*src=["']([^"']*\/products\/[^"']*\.(jpg|jpeg|png|webp))["'][^>]*>/gi,
    // Background images
    /background-image:\s*url\(['"]([^'"]*\/products\/[^'"]*\.(jpg|jpeg|png|webp))['"]\)/gi,
    // Any high-res Bulgari product images
    /https?:\/\/[^"'\s)]*\/products\/[^"'\s)]*[_-](hd|hq|high|large)[^"'\s)]*\.(jpg|jpeg|png|webp)/gi,
    // Any Bulgari product images (fallback)
    /https?:\/\/[^"'\s)]*bulgari[^"'\s)]*\/products\/[^"'\s)]*\.(jpg|jpeg|png|webp)/gi
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const url = match[1];
      if (url && (url.includes('bulgari') || url.includes('product')) && !url.includes('logo') && !url.includes('icon')) {
        // Clean and normalize URL
        let cleanUrl = url.replace(/(\?|&)(wid|hei|qlt|op_sharpen|resMode|op_usm).*?(&|$)/g, '');
        cleanUrl = cleanUrl.replace(/&$/, '');
        
        // Ensure full quality
        cleanUrl = cleanUrl.replace(/\/w_\d+\//g, '/w_1200/');
        cleanUrl = cleanUrl.replace(/\/h_\d+\//g, '/h_1600/');
        cleanUrl = cleanUrl.replace(/\/q_\d+\//g, '/q_100/');
        
        if (!imageUrls.includes(cleanUrl)) {
          imageUrls.push(cleanUrl);
        }
      }
    }
  });

  return imageUrls.slice(0, 2); // Return at most 2 images
}

// Function to download a single image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    const request = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.bulgari.com/'
      }
    }, (response) => {
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

// Main function to download images for all Bvlgari products
async function downloadAllBvlgariImages() {
  console.log('🔍 Starting to download Bvlgari Le Gemme perfume images...');
  console.log(`📄 Found ${bvlgariProducts.length} products to process...\n`);

  const results = {
    successful: [],
    failed: []
  };

  for (let i = 0; i < bvlgariProducts.length; i++) {
    const product = bvlgariProducts[i];
    console.log(`📦 [${i + 1}/${bvlgariProducts.length}] Processing: ${product.name}`);
    console.log(`🔗 URL: ${product.url}`);

    try {
      // Fetch the product page
      const html = await fetchPage(product.url);
      
      // Extract image URLs
      const imageUrls = extractProductImageUrls(html);
      
      if (imageUrls.length === 0) {
        console.log(`⚠️  No images found for ${product.name}`);
        results.failed.push({ product: product.name, error: 'No images found' });
        continue;
      }

      console.log(`📸 Found ${imageUrls.length} images for ${product.name}`);

      // Download each image
      for (let j = 0; j < Math.min(imageUrls.length, product.images.length); j++) {
        const imageUrl = imageUrls[j];
        const filename = product.images[j];
        const filepath = path.join(assetsDir, filename);

        try {
          console.log(`   📥 Downloading: ${filename}`);
          
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

          await downloadImage(imageUrl, filepath);
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
        console.log(`⏳ Waiting 3 seconds before next product...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

    } catch (error) {
      console.log(`❌ Error processing ${product.name}: ${error.message}`);
      results.failed.push({ product: product.name, error: error.message });
    }

    console.log(); // Empty line for readability
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