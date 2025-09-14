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

// Bvlgari Le Gemme products in our catalog
const bvlgariProducts = [
  {
    name: "BVLGARI LE GEMME MAN TYGAR",
    id: "82",
    images: [
      "https://media.bulgari.com/f_auto,q_auto,w_600,c_limit/production/media/carousels/fragrances/le_gemme/1440x1500_man_tygar.jpg",
      "https://media.bulgari.com/f_auto,q_auto,w_600,c_limit/production/media/products/fragrances/le_gemme/125ml/125ml_1.jpg"
    ]
  },
  {
    name: "BVLGARI LE GEMME KOBRAA",
    id: "83",
    images: [
      "https://media.bulgari.com/f_auto,q_auto,w_600,c_limit/production/media/carousels/fragrances/le_gemme/1440x1500_kobraa.jpg",
      "https://media.bulgari.com/f_auto,q_auto,w_600,c_limit/production/media/products/fragrances/le_gemme/125ml/125ml_2.jpg"
    ]
  },
  {
    name: "BVLGARI LE GEMME SAHARE",
    id: "84",
    images: [
      "https://media.bulgari.com/f_auto,q_auto,w_600,c_limit/production/media/carousels/fragrances/le_gemme/1440x1500_sahare.jpg",
      "https://media.bulgari.com/f_auto,q_auto,w_600,c_limit/production/media/products/fragrances/le_gemme/125ml/125ml_3.jpg"
    ]
  },
  {
    name: "BVLGARI LE GEMME MEN ONEKH",
    id: "85",
    images: [
      "https://media.bulgari.com/f_auto,q_auto,w_600,c_limit/production/media/carousels/fragrances/le_gemme/1440x1500_men_onekh.jpg",
      "https://media.bulgari.com/f_auto,q_auto,w_600,c_limit/production/media/products/fragrances/le_gemme/125ml/125ml_4.jpg"
    ]
  },
  {
    name: "BVLGARI LE GEMME OROM",
    id: "86",
    images: [
      "https://media.bulgari.com/f_auto,q_auto,w_600,c_limit/production/media/carousels/fragrances/le_gemme/1440x1500_orom.jpg",
      "https://media.bulgari.com/f_auto,q_auto,w_600,c_limit/production/media/products/fragrances/le_gemme/125ml/125ml_5.jpg"
    ]
  },
  {
    name: "BVLGARI LE GEMME FALKAR",
    id: "87",
    images: [
      "https://media.bulgari.com/f_auto,q_auto,w_600,c_limit/production/media/carousels/fragrances/le_gemme/1440x1500_falkar.jpg",
      "https://media.bulgari.com/f_auto,q_auto,w_600,c_limit/production/media/products/fragrances/le_gemme/125ml/125ml_6.jpg"
    ]
  },
  {
    name: "BVLGARI LE GEMME GYAN",
    id: "88",
    images: [
      "https://media.bulgari.com/f_auto,q_auto,w_600,c_limit/production/media/carousels/fragrances/le_gemme/1440x1500_gyan.jpg",
      "https://media.bulgari.com/f_auto,q_auto,w_600,c_limit/production/media/products/fragrances/le_gemme/125ml/125ml_7.jpg"
    ]
  },
  {
    name: "BVLGARI LE GEMME AMUNE",
    id: "89",
    images: [
      "https://media.bulgari.com/f_auto,q_auto,w_600,c_limit/production/media/carousels/fragrances/le_gemme/1440x1500_amune.jpg",
      "https://media.bulgari.com/f_auto,q_auto,w_600,c_limit/production/media/products/fragrances/le_gemme/125ml/125ml_8.jpg"
    ]
  }
];

// Function to download a single image with retry logic
function downloadImage(url, filepath, retries = 3) {
  return new Promise((resolve, reject) => {
    const attemptDownload = (attempt) => {
      const file = fs.createWriteStream(filepath);
      
      // Determine protocol
      const protocol = url.startsWith('https') ? https : http;
      
      const request = protocol.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.bulgari.com/',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
        },
        timeout: 15000 // 15 second timeout
      }, (response) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          response.pipe(file);
          
          file.on('finish', () => {
            file.close();
            resolve(filepath);
          });
          
          file.on('error', (err) => {
            fs.unlink(filepath, () => {}); // Delete the file async
            if (attempt < retries) {
              console.log(`         Retrying (${attempt + 1}/${retries})...`);
              setTimeout(() => attemptDownload(attempt + 1), 2000);
            } else {
              reject(err);
            }
          });
        } else {
          fs.unlink(filepath, () => {}); // Delete the file async
          if (attempt < retries) {
            console.log(`         Retrying (${attempt + 1}/${retries})...`);
            setTimeout(() => attemptDownload(attempt + 1), 2000);
          } else {
            reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          }
        }
      });
      
      request.on('error', (err) => {
        if (attempt < retries) {
          console.log(`         Retrying (${attempt + 1}/${retries})...`);
          setTimeout(() => attemptDownload(attempt + 1), 2000);
        } else {
          reject(err);
        }
      });
      
      request.setTimeout(15000, () => {
        request.destroy();
        if (attempt < retries) {
          console.log(`         Retrying (${attempt + 1}/${retries})...`);
          setTimeout(() => attemptDownload(attempt + 1), 2000);
        } else {
          reject(new Error(`Request timeout for ${url}`));
        }
      });
    };
    
    attemptDownload(1);
  });
}

// Function to get filename from URL
function getFilenameFromUrl(url, productId, imageIndex) {
  // Extract product name from the bvlgariProducts array
  const product = bvlgariProducts.find(p => p.id === productId);
  const productName = product ? product.name.replace(/ /g, '_').toLowerCase() : 'unknown';
  
  // Clean up the product name for filename
  const cleanProductName = productName
    .replace('bvlgari_le_gemme_', '')
    .replace(/[^a-zA-Z0-9_-]/g, '');
  
  return `bvlgari_le_gemme_${cleanProductName}_125ml_${productId}_${imageIndex + 1}.webp`;
}

// Main download function
async function downloadAllBvlgariImages() {
  console.log('🔍 Starting robust download of Bvlgari Le Gemme product images...');
  console.log(`📊 Found ${bvlgariProducts.length} products in catalog\n`);

  const results = {
    successful: [],
    failed: []
  };

  for (let i = 0; i < bvlgariProducts.length; i++) {
    const product = bvlgariProducts[i];
    console.log(`📦 [${i + 1}/${bvlgariProducts.length}] Processing: ${product.name} (ID: ${product.id})`);

    for (let j = 0; j < product.images.length; j++) {
      const imageUrl = product.images[j];
      const filename = getFilenameFromUrl(imageUrl, product.id, j);
      const filepath = path.join(assetsDir, filename);

      try {
        console.log(`   📥 Downloading image ${j + 1}/${product.images.length}: ${filename}`);

        // Skip if file already exists and has content
        if (fs.existsSync(filepath)) {
          const stats = fs.statSync(filepath);
          if (stats.size > 0) {
            console.log(`      ✓ File already exists: ${filename} (${(stats.size / 1024).toFixed(1)}KB)`);
            results.successful.push({ product: product.name, url: imageUrl, filename, size: stats.size, status: 'already_exists' });
            continue;
          }
        }

        await downloadImage(imageUrl, filepath);
        const stats = fs.statSync(filepath);
        console.log(`      ✓ Downloaded: ${filename} (${(stats.size / 1024).toFixed(1)}KB)`);
        results.successful.push({ product: product.name, url: imageUrl, filename, size: stats.size, status: 'downloaded' });

        // Add a small delay to be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 1500));

      } catch (error) {
        console.log(`      ✗ Failed: ${filename} - ${error.message}`);
        results.failed.push({ product: product.name, url: imageUrl, filename, error: error.message });
      }
    }
    
    console.log(''); // Empty line for better readability
  }

  // Summary
  console.log('\n🎉 === DOWNLOAD SUMMARY ===');
  console.log(`Total products processed: ${bvlgariProducts.length}`);
  console.log(`Total images: ${results.successful.length + results.failed.length}`);
  console.log(`Successfully downloaded: ${results.successful.length}`);
  console.log(`Failed: ${results.failed.length}`);

  // Calculate total size
  const totalSize = results.successful.reduce((sum, item) => sum + item.size, 0);
  console.log(`Total size: ${(totalSize / (1024 * 1024)).toFixed(2)}MB`);

  if (results.successful.length > 0) {
    console.log('\n✅ Successful downloads:');
    results.successful.forEach(item => {
      console.log(`   ${item.product}: ${item.filename} (${(item.size / 1024).toFixed(1)}KB)`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed downloads:');
    results.failed.forEach(item => {
      console.log(`   ${item.product}: ${item.filename} - ${item.error}`);
    });
  }

  console.log(`\n📁 All images saved to: ${assetsDir}`);

  return results;
}

// Run the download
downloadAllBvlgariImages().catch(console.error);