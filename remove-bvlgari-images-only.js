import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const perfumesDir = path.join(__dirname, 'perfumes');

// List of Bvlgari image files to remove
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

console.log('=== REMOVING BVLGARI IMAGES ONLY ===\n');

let removedCount = 0;
let notFoundCount = 0;

bvlgariImagesToRemove.forEach(image => {
  const imagePath = path.join(perfumesDir, image);
  
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

console.log(`\n=== IMPORTANT ===`);
console.log(`The Bvlgari product cards (IDs 82-89) in the catalog remain intact.`);
console.log(`Only the image files have been removed.`);
console.log(`The products will now show placeholder images since their image files have been removed.`);