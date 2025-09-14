import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const perfumesDir = path.join(__dirname, 'assets', 'perfumes');

// Bvlgari product image mappings - what we need to rename
const imageRenames = [
  // KOBRAA - missing second image
  {
    oldName: 'bvlgari_le_gemme_kobraa_125ml_40_1.webp',
    newName: 'bvlgari_le_gemme_kobraa_125ml_40_1.webp',
    action: 'keep'
  },
  // Need to copy the first image as the second one
  {
    oldName: 'bvlgari_le_gemme_kobraa_125ml_40_1.webp',
    newName: 'bvlgari_le_gemme_kobraa_125ml_40_2.webp',
    action: 'copy'
  },
  
  // MEN ONEKH - wrong image names
  {
    oldName: 'bvlgari_menu-abu_lhv3fk.jpg',
    newName: 'bvlgari_le_gemme_men_onekh_125_42_1.webp',
    action: 'rename'
  },
  // Need to copy the first image as the second one
  {
    oldName: 'bvlgari_menu-abu_lhv3fk.jpg',
    newName: 'bvlgari_le_gemme_men_onekh_125_42_2.webp',
    action: 'copy_and_rename'
  },
  
  // For products with no images, we'll need to identify appropriate images from the unused list
  // SAHARE - need to find appropriate images
  // FALKAR - need to find appropriate images
  // GYAN - need to find appropriate images
  // AMUNE - need to find appropriate images
  // OROM - need to find appropriate images
];

console.log('=== BVLGARI IMAGE RENAMING PLAN ===');

imageRenames.forEach(rename => {
  const oldPath = path.join(perfumesDir, rename.oldName);
  const newPath = path.join(perfumesDir, rename.newName);
  
  if (fs.existsSync(oldPath)) {
    console.log(`${rename.action.toUpperCase()}: ${rename.oldName} -> ${rename.newName}`);
    
    try {
      if (rename.action === 'rename') {
        fs.renameSync(oldPath, newPath);
        console.log(`  ✓ Renamed successfully`);
      } else if (rename.action === 'copy') {
        fs.copyFileSync(oldPath, newPath);
        console.log(`  ✓ Copied successfully`);
      } else if (rename.action === 'copy_and_rename') {
        fs.copyFileSync(oldPath, newPath);
        // Also rename the original
        const finalPath = path.join(perfumesDir, rename.newName.replace('_2.webp', '_1.webp').replace('_42_2', '_42_1'));
        fs.renameSync(oldPath, finalPath);
        console.log(`  ✓ Copied and renamed successfully`);
      } else if (rename.action === 'keep') {
        console.log(`  ✓ Keeping file as is`);
      }
    } catch (error) {
      console.log(`  ✗ Error ${rename.action}: ${error.message}`);
    }
  } else {
    console.log(`SKIP: ${rename.oldName} (file not found)`);
  }
});

// List of unused Bvlgari images that might be suitable for the missing products
const unusedImages = [
  'bvlgari_1581412.png',
  'bvlgari_1581419.png',
  'bvlgari_1609181.png',
  'bvlgari_1609188.png',
  'bvlgari_P-25_LeGemme_Refik_Product01_1080x1920_pm48jq.jpg',
  'bvlgari_P-25_LeGemme_Refik_Product03_1080x1350_dmmmk2.jpg',
  'bvlgari_LE_GEMME_PERFUME_jypv6c.jpg'
];

console.log('\n=== POTENTIAL IMAGES FOR MISSING PRODUCTS ===');
console.log('These images might be suitable for products that currently have no matching images:');
unusedImages.forEach(img => {
  console.log(`- ${img}`);
});

console.log('\n=== MANUAL STEPS REQUIRED ===');
console.log('1. Review the unused images above to find suitable matches for:');
console.log('   - BVLGARI LE GEMME SAHARE');
console.log('   - BVLGARI LE GEMME FALKAR');
console.log('   - BVLGARI LE GEMME GYAN');
console.log('   - BVLGARI LE GEMME AMUNE');
console.log('   - BVLGARI LE GEMME OROM');
console.log('2. Rename selected images to match the naming convention:');
console.log('   bvlgari_le_gemme_[product_name]_[volume]_[product_id]_[1|2].webp');
console.log('3. Convert images to webp format if needed');
console.log('4. Update storage.ts if any image paths change');

console.log('\n=== VERIFICATION ===');
console.log('After renaming, verify that all Bvlgari products have both primary and secondary images:');
const bvlgariProducts = [
  { name: 'BVLGARI LE GEMME MAN TYGAR', id: '82' },
  { name: 'BVLGARI LE GEMME KOBRAA', id: '83' },
  { name: 'BVLGARI LE GEMME SAHARE', id: '84' },
  { name: 'BVLGARI LE GEMME MEN ONEKH', id: '85' },
  { name: 'BVLGARI LE GEMME OROM', id: '86' },
  { name: 'BVLGARI LE GEMME FALKAR', id: '87' },
  { name: 'BVLGARI LE GEMME GYAN', id: '88' },
  { name: 'BVLGARI LE GEMME AMUNE', id: '89' }
];

bvlgariProducts.forEach(product => {
  const primaryImage = `bvlgari_le_gemme_${product.name.toLowerCase().replace(/ /g, '_').replace('bvlgari_le_gemme_', '')}_125_*_${product.id}_1.webp`;
  const secondaryImage = `bvlgari_le_gemme_${product.name.toLowerCase().replace(/ /g, '_').replace('bvlgari_le_gemme_', '')}_125_*_${product.id}_2.webp`;
  console.log(`\n${product.name}:`);
  console.log(`  Primary image pattern: ${primaryImage}`);
  console.log(`  Secondary image pattern: ${secondaryImage}`);
});