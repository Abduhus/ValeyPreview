import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const perfumesDir = path.join(__dirname, 'assets', 'perfumes');

console.log('=== BVLGARI IMAGE ORGANIZATION REPORT ===\n');

// Define the expected Bvlgari product images based on storage.ts
const bvlgariProducts = [
  {
    name: 'BVLGARI LE GEMME MAN TYGAR',
    id: '82',
    primary: 'bvlgari_le_gemme_man_tygar_125_39_1.webp',
    secondary: 'bvlgari_le_gemme_man_tygar_125_39_2.webp'
  },
  {
    name: 'BVLGARI LE GEMME KOBRAA',
    id: '83',
    primary: 'bvlgari_le_gemme_kobraa_125ml_40_1.webp',
    secondary: 'bvlgari_le_gemme_kobraa_125ml_40_2.webp'
  },
  {
    name: 'BVLGARI LE GEMME SAHARE',
    id: '84',
    primary: 'bvlgari_le_gemme_sahare_125ml_41_1.webp',
    secondary: 'bvlgari_le_gemme_sahare_125ml_41_2.webp'
  },
  {
    name: 'BVLGARI LE GEMME MEN ONEKH',
    id: '85',
    primary: 'bvlgari_le_gemme_men_onekh_125_42_1.webp',
    secondary: 'bvlgari_le_gemme_men_onekh_125_42_2.webp'
  },
  {
    name: 'BVLGARI LE GEMME OROM',
    id: '86',
    primary: 'bvlgari_le_gemme_orom_125_ml_e_43_1.webp',
    secondary: 'bvlgari_le_gemme_orom_125_ml_e_43_2.webp'
  },
  {
    name: 'BVLGARI LE GEMME FALKAR',
    id: '87',
    primary: 'bvlgari_le_gemme_falkar_125_ml_44_1.webp',
    secondary: 'bvlgari_le_gemme_falkar_125_ml_44_2.webp'
  },
  {
    name: 'BVLGARI LE GEMME GYAN',
    id: '88',
    primary: 'bvlgari_le_gemme_gyan_125_ml_e_45_1.webp',
    secondary: 'bvlgari_le_gemme_gyan_125_ml_e_45_2.webp'
  },
  {
    name: 'BVLGARI LE GEMME AMUNE',
    id: '89',
    primary: 'bvlgari_le_gemme_amune_125_ml_46_1.webp',
    secondary: 'bvlgari_le_gemme_amune_125_ml_46_2.webp'
  }
];

// Check the status of each product's images
bvlgariProducts.forEach(product => {
  console.log(`${product.name}:`);
  
  const primaryPath = path.join(perfumesDir, product.primary);
  const secondaryPath = path.join(perfumesDir, product.secondary);
  
  // Check primary image
  if (fs.existsSync(primaryPath)) {
    const stats = fs.statSync(primaryPath);
    if (stats.size > 0) {
      console.log(`  ✓ Primary image: ${product.primary} (${stats.size} bytes)`);
    } else {
      console.log(`  ✗ Primary image: ${product.primary} (0 bytes - CORRUPTED)`);
    }
  } else {
    console.log(`  ✗ Primary image: ${product.primary} (MISSING)`);
  }
  
  // Check secondary image
  if (fs.existsSync(secondaryPath)) {
    const stats = fs.statSync(secondaryPath);
    if (stats.size > 0) {
      console.log(`  ✓ Secondary image: ${product.secondary} (${stats.size} bytes)`);
    } else {
      console.log(`  ✗ Secondary image: ${product.secondary} (0 bytes - CORRUPTED)`);
    }
  } else {
    console.log(`  ✗ Secondary image: ${product.secondary} (MISSING)`);
  }
  
  console.log('');
});

// List all Bvlgari-related images in the directory
const allFiles = fs.readdirSync(perfumesDir);
const bvlgariFiles = allFiles.filter(file => file.toLowerCase().includes('bvlgari'));

console.log('=== ALL BVLGARI IMAGES IN DIRECTORY ===');
bvlgariFiles.forEach(file => {
  const filePath = path.join(perfumesDir, file);
  const stats = fs.statSync(filePath);
  console.log(`${file} (${stats.size} bytes)`);
});

// Summary
console.log('\n=== SUMMARY ===');
const totalProducts = bvlgariProducts.length;
let completeProducts = 0;
let partialProducts = 0;
let missingProducts = 0;

bvlgariProducts.forEach(product => {
  const primaryPath = path.join(perfumesDir, product.primary);
  const secondaryPath = path.join(perfumesDir, product.secondary);
  
  const hasPrimary = fs.existsSync(primaryPath) && fs.statSync(primaryPath).size > 0;
  const hasSecondary = fs.existsSync(secondaryPath) && fs.statSync(secondaryPath).size > 0;
  
  if (hasPrimary && hasSecondary) {
    completeProducts++;
  } else if (hasPrimary || hasSecondary) {
    partialProducts++;
  } else {
    missingProducts++;
  }
});

console.log(`Total Bvlgari products: ${totalProducts}`);
console.log(`Complete products (both images): ${completeProducts}`);
console.log(`Partial products (one image): ${partialProducts}`);
console.log(`Missing products (no images): ${missingProducts}`);

console.log('\n=== RECOMMENDATIONS ===');
if (missingProducts > 0 || partialProducts > 0) {
  console.log('1. Download high-quality images from the official Bvlgari website');
  console.log('2. Use the scrape-bvlgari-images.js script (after fixing the timeout issue)');
  console.log('3. Manually select appropriate images from the existing Bvlgari collection');
  console.log('4. Rename and convert images to match the expected naming convention');
  console.log('5. Ensure all images are in webp format for consistency');
} else {
  console.log('All Bvlgari product images are properly organized!');
}

console.log('\n=== NAMING CONVENTION ===');
console.log('Format: bvlgari_le_gemme_[product_name]_[volume]_[product_id]_[1|2].webp');
console.log('Example: bvlgari_le_gemme_man_tygar_125_39_1.webp');