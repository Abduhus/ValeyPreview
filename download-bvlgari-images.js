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

// Bvlgari Le Gemme product image URLs with working placeholder images
const bvlgariImages = [
  // BVLGARI LE GEMME MAN TYGAR
  { url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80", filename: "bvlgari_le_gemme_man_tygar_125_39_1.webp" },
  { url: "https://images.unsplash.com/photo-1528524539224-7e67ed5c9a5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80", filename: "bvlgari_le_gemme_man_tygar_125_39_2.webp" },
  
  // BVLGARI LE GEMME KOBRAA
  { url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80", filename: "bvlgari_le_gemme_kobraa_125ml_40_1.webp" },
  { url: "https://images.unsplash.com/photo-1528524539224-7e67ed5c9a5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80", filename: "bvlgari_le_gemme_kobraa_125ml_40_2.webp" },
  
  // BVLGARI LE GEMME SAHARE
  { url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80", filename: "bvlgari_le_gemme_sahare_125ml_41_1.webp" },
  { url: "https://images.unsplash.com/photo-1528524539224-7e67ed5c9a5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80", filename: "bvlgari_le_gemme_sahare_125ml_41_2.webp" },
  
  // BVLGARI LE GEMME MEN ONEKH
  { url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80", filename: "bvlgari_le_gemme_men_onekh_125_42_1.webp" },
  { url: "https://images.unsplash.com/photo-1528524539224-7e67ed5c9a5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80", filename: "bvlgari_le_gemme_men_onekh_125_42_2.webp" },
  
  // BVLGARI LE GEMME OROM
  { url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80", filename: "bvlgari_le_gemme_orom_125_ml_e_43_1.webp" },
  { url: "https://images.unsplash.com/photo-1528524539224-7e67ed5c9a5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80", filename: "bvlgari_le_gemme_orom_125_ml_e_43_2.webp" },
  
  // BVLGARI LE GEMME FALKAR
  { url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80", filename: "bvlgari_le_gemme_falkar_125_ml_44_1.webp" },
  { url: "https://images.unsplash.com/photo-1528524539224-7e67ed5c9a5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80", filename: "bvlgari_le_gemme_falkar_125_ml_44_2.webp" },
  
  // BVLGARI LE GEMME GYAN
  { url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80", filename: "bvlgari_le_gemme_gyan_125_ml_e_45_1.webp" },
  { url: "https://images.unsplash.com/photo-1528524539224-7e67ed5c9a5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80", filename: "bvlgari_le_gemme_gyan_125_ml_e_45_2.webp" },
  
  // BVLGARI LE GEMME AMUNE
  { url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80", filename: "bvlgari_le_gemme_amune_125_ml_46_1.webp" },
  { url: "https://images.unsplash.com/photo-1528524539224-7e67ed5c9a5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80", filename: "bvlgari_le_gemme_amune_125_ml_46_2.webp" }
];

// Function to download a single image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const file = fs.createWriteStream(filepath);
    
    const request = protocol.get(url, (response) => {
      // Check if the response is successful
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

// Main download function
async function downloadAllBvlgariImages() {
  console.log('Starting to download high-quality Bvlgari Le Gemme perfume images...');
  console.log(`Found ${bvlgariImages.length} images to download...\n`);
  
  const results = {
    successful: [],
    failed: []
  };
  
  for (let i = 0; i < bvlgariImages.length; i++) {
    const image = bvlgariImages[i];
    const filepath = path.join(assetsDir, image.filename);
    
    try {
      console.log(`[${i + 1}/${bvlgariImages.length}] Downloading: ${image.filename}`);
      
      // Skip if file already exists
      if (fs.existsSync(filepath)) {
        console.log(`  ✓ File already exists: ${image.filename}`);
        results.successful.push({ url: image.url, filename: image.filename, status: 'already_exists' });
        continue;
      }
      
      await downloadImage(image.url, filepath);
      console.log(`  ✓ Downloaded: ${image.filename}`);
      results.successful.push({ url: image.url, filename: image.filename, status: 'downloaded' });
      
      // Add a small delay to be respectful to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`  ✗ Failed: ${image.filename} - ${error.message}`);
      results.failed.push({ url: image.url, filename: image.filename, error: error.message });
    }
  }
  
  // Summary
  console.log('\n=== DOWNLOAD SUMMARY ===');
  console.log(`Total images: ${bvlgariImages.length}`);
  console.log(`Successful: ${results.successful.length}`);
  console.log(`Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log('\nFailed downloads:');
    results.failed.forEach(item => {
      console.log(`  - ${item.filename}: ${item.error}`);
    });
  }
  
  console.log(`\nAll images saved to: ${assetsDir}`);
  
  return results;
}

// Run the download
downloadAllBvlgariImages().catch(console.error);