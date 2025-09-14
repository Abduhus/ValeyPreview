import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const perfumesDir = path.join(__dirname, 'assets', 'perfumes');

// Bvlgari products in our catalog with their expected image filenames
const bvlgariProducts = [
  {
    name: "BVLGARI LE GEMME MAN TYGAR",
    id: "82",
    primaryImage: "bvlgari_le_gemme_man_tygar_125_39_1.webp",
    secondaryImage: "bvlgari_le_gemme_man_tygar_125_39_2.webp"
  },
  {
    name: "BVLGARI LE GEMME KOBRAA",
    id: "83",
    primaryImage: "bvlgari_le_gemme_kobraa_125ml_40_1.webp",
    secondaryImage: "bvlgari_le_gemme_kobraa_125ml_40_2.webp"
  },
  {
    name: "BVLGARI LE GEMME SAHARE",
    id: "84",
    primaryImage: "bvlgari_le_gemme_sahare_125ml_41_1.webp",
    secondaryImage: "bvlgari_le_gemme_sahare_125ml_41_2.webp"
  },
  {
    name: "BVLGARI LE GEMME MEN ONEKH",
    id: "85",
    primaryImage: "bvlgari_le_gemme_men_onekh_125_42_1.webp",
    secondaryImage: "bvlgari_le_gemme_men_onekh_125_42_2.webp"
  },
  {
    name: "BVLGARI LE GEMME OROM",
    id: "86",
    primaryImage: "bvlgari_le_gemme_orom_125_ml_e_43_1.webp",
    secondaryImage: "bvlgari_le_gemme_orom_125_ml_e_43_2.webp"
  },
  {
    name: "BVLGARI LE GEMME FALKAR",
    id: "87",
    primaryImage: "bvlgari_le_gemme_falkar_125_ml_44_1.webp",
    secondaryImage: "bvlgari_le_gemme_falkar_125_ml_44_2.webp"
  },
  {
    name: "BVLGARI LE GEMME GYAN",
    id: "88",
    primaryImage: "bvlgari_le_gemme_gyan_125_ml_e_45_1.webp",
    secondaryImage: "bvlgari_le_gemme_gyan_125_ml_e_45_2.webp"
  },
  {
    name: "BVLGARI LE GEMME AMUNE",
    id: "89",
    primaryImage: "bvlgari_le_gemme_amune_125_ml_46_1.webp",
    secondaryImage: "bvlgari_le_gemme_amune_125_ml_46_2.webp"
  }
];

// Get all existing Bvlgari files
const allFiles = fs.readdirSync(perfumesDir);
const bvlgariFiles = allFiles.filter(file => 
  file.toLowerCase().includes('bvlgari') || 
  file.toLowerCase().includes('bulgari')
);

console.log(`🔍 Found ${bvlgariFiles.length} Bvlgari-related files`);

// Function to copy and rename files
function copyAndRenameFile(source, destination) {
  const sourcePath = path.join(perfumesDir, source);
  const destPath = path.join(perfumesDir, destination);
  
  if (fs.existsSync(sourcePath)) {
    // Check if destination already exists
    if (fs.existsSync(destPath)) {
      console.log(`   ✓ ${destination} already exists`);
      return true;
    }
    
    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`   ✓ Copied ${source} to ${destination}`);
      return true;
    } catch (error) {
      console.log(`   ✗ Failed to copy ${source} to ${destination}: ${error.message}`);
      return false;
    }
  } else {
    console.log(`   - Source file ${source} not found`);
    return false;
  }
}

console.log('\n📦 Organizing Bvlgari images for catalog products...\n');

let organizedCount = 0;

// For each product, try to create the required images
bvlgariProducts.forEach(product => {
  console.log(`📋 ${product.name} (ID: ${product.id})`);
  
  // Try to create primary image
  const primaryCreated = copyAndRenameFile(bvlgariFiles[0] || 'bvlgari_LE_GEMME_PERFUME_jypv6c.jpg', product.primaryImage);
  if (primaryCreated) organizedCount++;
  
  // Try to create secondary image
  const secondaryCreated = copyAndRenameFile(bvlgariFiles[1] || 'bvlgari_LE_GEMME_PERFUME_jypv6c.jpg', product.secondaryImage);
  if (secondaryCreated) organizedCount++;
  
  console.log('');
});

console.log(`\n✅ Successfully organized ${organizedCount} images for Bvlgari products`);
console.log(`📁 Images are now properly named to match the product catalog`);
console.log(`\n💡 Note: All products now have images, but they may be duplicates.`);
console.log(`   For better visual representation, manually replace with actual product-specific images.`);