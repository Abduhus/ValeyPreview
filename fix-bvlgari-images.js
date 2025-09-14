import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const perfumesDir = path.join(__dirname, 'assets', 'perfumes');

// Function to copy and convert image to webp
function copyAndConvertToWebp(source, destination) {
  try {
    // For now, we'll just copy the file and change extension
    // In a production environment, you'd want to actually convert the image format
    fs.copyFileSync(source, destination);
    console.log(`✓ Copied ${source} to ${destination}`);
    return true;
  } catch (error) {
    console.log(`✗ Error copying ${source} to ${destination}: ${error.message}`);
    return false;
  }
}

console.log('=== FIXING BVLGARI IMAGES ===');

// Fix MAN TYGAR secondary image (it's 0 bytes)
const manTygarPrimary = path.join(perfumesDir, 'bvlgari_le_gemme_man_tygar_125_39_1.webp');
const manTygarSecondary = path.join(perfumesDir, 'bvlgari_le_gemme_man_tygar_125_39_2.webp');
const manTygarOriginal = path.join(perfumesDir, 'bvlgari_BVLGARI_MAN_PERFUME_wdmmyg.jpg');

if (fs.existsSync(manTygarOriginal) && fs.existsSync(manTygarSecondary)) {
  const stats = fs.statSync(manTygarSecondary);
  if (stats.size === 0) {
    console.log('Fixing MAN TYGAR secondary image (0 bytes)');
    // Remove the corrupted file
    fs.unlinkSync(manTygarSecondary);
    // Copy from original
    copyAndConvertToWebp(manTygarOriginal, manTygarSecondary);
  }
}

// Check all Bvlgari products and ensure they have both images
const bvlgariProducts = [
  { name: 'BVLGARI LE GEMME MAN TYGAR', id: '82', volume: '125' },
  { name: 'BVLGARI LE GEMME KOBRAA', id: '83', volume: '125ml' },
  { name: 'BVLGARI LE GEMME SAHARE', id: '84', volume: '125ml' },
  { name: 'BVLGARI LE GEMME MEN ONEKH', id: '85', volume: '125' },
  { name: 'BVLGARI LE GEMME OROM', id: '86', volume: '125_ml_e' },
  { name: 'BVLGARI LE GEMME FALKAR', id: '87', volume: '125_ml' },
  { name: 'BVLGARI LE GEMME GYAN', id: '88', volume: '125_ml_e' },
  { name: 'BVLGARI LE GEMME AMUNE', id: '89', volume: '125_ml' }
];

const potentialImages = [
  'bvlgari_1581412.png',
  'bvlgari_1581419.png',
  'bvlgari_1609181.png',
  'bvlgari_1609188.png',
  'bvlgari_P-25_LeGemme_Refik_Product01_1080x1920_pm48jq.jpg',
  'bvlgari_P-25_LeGemme_Refik_Product03_1080x1350_dmmmk2.jpg',
  'bvlgari_LE_GEMME_PERFUME_jypv6c.jpg'
];

bvlgariProducts.forEach(product => {
  console.log(`\nChecking ${product.name}...`);
  
  // Generate expected filenames
  const productId = product.id;
  const volume = product.volume;
  
  // Extract product name part for filename
  const productNameForFile = product.name
    .toLowerCase()
    .replace(/ /g, '_')
    .replace('bvlgari_le_gemme_', '');
    
  const primaryImage = `bvlgari_le_gemme_${productNameForFile}_${volume}_${productId}_1.webp`;
  const secondaryImage = `bvlgari_le_gemme_${productNameForFile}_${volume}_${productId}_2.webp`;
  
  const primaryPath = path.join(perfumesDir, primaryImage);
  const secondaryPath = path.join(perfumesDir, secondaryImage);
  
  console.log(`  Expected primary: ${primaryImage}`);
  console.log(`  Expected secondary: ${secondaryImage}`);
  
  // Check if primary image exists
  if (!fs.existsSync(primaryPath)) {
    console.log(`  ✗ Missing primary image`);
  } else {
    const stats = fs.statSync(primaryPath);
    console.log(`  ✓ Primary image exists (${stats.size} bytes)`);
  }
  
  // Check if secondary image exists
  if (!fs.existsSync(secondaryPath)) {
    console.log(`  ✗ Missing secondary image`);
  } else {
    const stats = fs.statSync(secondaryPath);
    if (stats.size === 0) {
      console.log(`  ✗ Secondary image is corrupted (0 bytes)`);
    } else {
      console.log(`  ✓ Secondary image exists (${stats.size} bytes)`);
    }
  }
});

console.log('\n=== RECOMMENDATIONS ===');
console.log('1. For products with missing images, select appropriate images from:');
potentialImages.forEach(img => console.log(`   - ${img}`));

console.log('\n2. Rename selected images to match the naming convention:');
console.log('   bvlgari_le_gemme_[product_name]_[volume]_[product_id]_[1|2].webp');

console.log('\n3. Convert images to webp format for consistency');

console.log('\n=== VERIFICATION COMPLETE ===');