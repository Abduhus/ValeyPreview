import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const perfumesDir = path.join(__dirname, 'assets', 'perfumes');

// Bvlgari product image URLs for better quality thumbnails
const bvlgariThumbnails = [
  {
    filename: "bvlgari_le_gemme_man_tygar_125_39_1.webp",
    url: "https://media.bulgari.com/image/upload/c_fill,h_1080,w_1920/q_auto/f_auto/v1756726737/collection/LeGemme/LeGemmexRefik/P-25_LeGemme_Refik_Product01_1080x1920_pm48jq.jpg"
  },
  {
    filename: "bvlgari_le_gemme_sahare_125ml_41_1.webp",
    url: "https://media.bulgari.com/image/upload/c_fill,h_1080,w_1920/q_auto/f_auto/v1756726737/collection/LeGemme/LeGemmexRefik/P-25_LeGemme_Refik_Product01_1080x1920_pm48jq.jpg"
  },
  {
    filename: "bvlgari_le_gemme_men_onekh_125_42_1.webp",
    url: "https://media.bulgari.com/image/upload/c_fill,h_1080,w_1920/q_auto/f_auto/v1756726737/collection/LeGemme/LeGemmexRefik/P-25_LeGemme_Refik_Product01_1080x1920_pm48jq.jpg"
  },
  {
    filename: "bvlgari_le_gemme_orom_125_ml_e_43_1.webp",
    url: "https://media.bulgari.com/image/upload/c_fill,h_1080,w_1920/q_auto/f_auto/v1756726737/collection/LeGemme/LeGemmexRefik/P-25_LeGemme_Refik_Product01_1080x1920_pm48jq.jpg"
  },
  {
    filename: "bvlgari_le_gemme_falkar_125_ml_44_1.webp",
    url: "https://media.bulgari.com/image/upload/c_fill,h_1080,w_1920/q_auto/f_auto/v1756726737/collection/LeGemme/LeGemmexRefik/P-25_LeGemme_Refik_Product01_1080x1920_pm48jq.jpg"
  },
  {
    filename: "bvlgari_le_gemme_gyan_125_ml_e_45_1.webp",
    url: "https://media.bulgari.com/image/upload/c_fill,h_1080,w_1920/q_auto/f_auto/v1756726737/collection/LeGemme/LeGemmexRefik/P-25_LeGemme_Refik_Product01_1080x1920_pm48jq.jpg"
  }
];

// Function to download image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    const request = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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

// Replace thumbnails
async function replaceThumbnails() {
  console.log('🔍 Replacing Bvlgari thumbnail images with higher quality versions...\n');
  
  let replacedCount = 0;
  let failedCount = 0;
  
  for (const thumbnail of bvlgariThumbnails) {
    const filepath = path.join(perfumesDir, thumbnail.filename);
    
    // Check if file exists
    if (fs.existsSync(filepath)) {
      try {
        console.log(`📥 Replacing: ${thumbnail.filename}`);
        await downloadImage(thumbnail.url, filepath);
        const stats = fs.statSync(filepath);
        console.log(`   ✓ Replaced with higher quality image (${(stats.size / 1024).toFixed(1)}KB)`);
        replacedCount++;
      } catch (error) {
        console.log(`   ✗ Failed to replace ${thumbnail.filename}: ${error.message}`);
        failedCount++;
      }
    } else {
      console.log(`   - File not found: ${thumbnail.filename}`);
      failedCount++;
    }
  }
  
  console.log('\n🎉 === REPLACEMENT SUMMARY ===');
  console.log(`Successfully replaced: ${replacedCount}`);
  console.log(`Failed to replace: ${failedCount}`);
  
  if (replacedCount > 0) {
    console.log('\n✅ Updated files:');
    bvlgariThumbnails.slice(0, replacedCount).forEach(item => {
      console.log(`   ${item.filename}`);
    });
  }
}

// Run the replacement
replaceThumbnails().catch(console.error);