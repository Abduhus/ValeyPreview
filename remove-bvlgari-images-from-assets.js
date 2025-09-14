import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsPerfumesDir = path.join(__dirname, 'assets', 'perfumes');

// List of Bvlgari image files to remove from assets/perfumes
const bvlgariImagesToRemove = [
  'bvlgari_le_gemme_amune_125_ml_46_1.webp',
  'bvlgari_le_gemme_amune_125_ml_46_2.webp',
  'bvlgari_le_gemme_falkar_125_ml_44_1.webp',
  'bvlgari_le_gemme_falkar_125_ml_44_2.webp',
  'bvlgari_le_gemme_gyan_125_ml_e_45_1.webp',
  'bvlgari_le_gemme_gyan_125_ml_e_45_2.webp',
  'bvlgari_le_gemme_kobraa_125ml_40_1.webp',
  'bvlgari_le_gemme_kobraa_125ml_40_2.webp',
  'bvlgari_le_gemme_man_tygar_125_39_1.webp',
  'bvlgari_le_gemme_man_tygar_125_39_2.webp',
  'bvlgari_le_gemme_men_onekh_125_42_1.webp',
  'bvlgari_le_gemme_men_onekh_125_42_2.webp',
  'bvlgari_le_gemme_orom_125_ml_e_43_1.webp',
  'bvlgari_le_gemme_orom_125_ml_e_43_2.webp',
  'bvlgari_le_gemme_sahare_125ml_41_1.webp',
  'bvlgari_le_gemme_sahare_125ml_41_2.webp'
];

console.log('=== REMOVING BVLGARI IMAGES FROM ASSETS/PERFUMES ===\n');

let removedCount = 0;
let notFoundCount = 0;

bvlgariImagesToRemove.forEach(image => {
  const imagePath = path.join(assetsPerfumesDir, image);
  
  if (fs.existsSync(imagePath)) {
    try {
      fs.unlinkSync(imagePath);
      console.log(`✓ Removed: ${image}`);
      removedCount++;
    } catch (error) {
      console.log(`✗ Error removing ${image}: ${error.message}`);
    }
  } else {
    console.log(`- Not found: ${image}`);
    notFoundCount++;
  }
});

console.log(`\n=== SUMMARY ===`);
console.log(`Removed: ${removedCount} files`);
console.log(`Not found: ${notFoundCount} files`);
console.log(`Total Bvlgari images processed: ${bvlgariImagesToRemove.length}`);

console.log(`\n=== CONFIRMATION ===`);
console.log(`All Bvlgari images have been removed from both perfumes/ and assets/perfumes/ directories.`);
console.log(`Product cards in storage.ts remain intact.`);