import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to assets directory
const ASSETS_DIR = path.join(__dirname, 'assets', 'perfumes');

// Rabdan products from storage.ts
const rabdanProducts = [
  {
    id: "9",
    name: "Rabdan Chill Vibes",
    mainImage: "Rabdan_CHILL-VIBES_1.webp",
    moodImage: "Rabdan_CHILL_-VIBES_2.webp"
  },
  {
    id: "10",
    name: "Rabdan Cigar Honey",
    mainImage: "Rabdan_CIGAR_HONEY_1.webp",
    moodImage: "Rabdan_CIGAR_HONEY_2.webp"
  },
  {
    id: "11",
    name: "Rabdan Ginger Time",
    mainImage: "Rabdan_GINGER_TIME_1.webp",
    moodImage: "Rabdan_GINGER_TIME_2.webp"
  },
  {
    id: "12",
    name: "Rabdan GWY",
    mainImage: "Rabdan_GWY_1.webp",
    moodImage: "Rabdan_GWY_2.webp"
  },
  {
    id: "13",
    name: "Rabdan Hibiscus",
    mainImage: "Rabdan_HIBISCUS_1.webp",
    moodImage: "Rabdan_HIBISCUS_2.webp"
  },
  {
    id: "14",
    name: "Rabdan Il Mio Viziato",
    mainImage: "Rabdan_IL_MIO_VIZIATO_1.webp",
    moodImage: "Rabdan_IL_MIO_VIZIATO_2.webp"
  },
  {
    id: "15",
    name: "Rabdan Iris Tabac",
    mainImage: "Rabdan_IRIS_TABAC_1.webp",
    moodImage: "Rabdan_IRIS_TABAC_2.webp"
  },
  {
    id: "16",
    name: "Rabdan Love Confession Daring",
    mainImage: "Rabdan_LOVE_CONFESSION_1.webp",
    moodImage: "Rabdan_LOVE_CONFESSION_2.webp"
  },
  {
    id: "17",
    name: "Rabdan Oud of King",
    mainImage: "Rabdan_OUD_OF_KING_1.webp",
    moodImage: "Rabdan_OUD_OF_KING_2.webp"
  },
  {
    id: "18",
    name: "Rabdan Rolling in the Deep",
    mainImage: "Rabdan_ROLLING_IN_THE_DEEP_1.webp",
    moodImage: "Rabdan_ROLLING_IN_THE_DEEP_2.webp"
  },
  {
    id: "19",
    name: "Rabdan Room 816",
    mainImage: "Rabdan_Room_816_1.webp",
    moodImage: "Rabdan_Room_816_2.webp"
  },
  {
    id: "20",
    name: "Rabdan Saint Petersburg",
    mainImage: "rabdan_saint_petersburg_1.jpeg",
    moodImage: "rabdan_saint_petersburg_2.jpeg"
  },
  {
    id: "21",
    name: "Rabdan The Vert Vetiver",
    mainImage: "Rabdan_THE_VERT_VETIVER_1.webp",
    moodImage: "Rabdan_THE_VERT_VETIVER_2.webp"
  },
  {
    id: "43",
    name: "Rabdan Lignum Vitae",
    mainImage: "Rabdan_LIGNUM_VITAE_1.webp",
    moodImage: "Rabdan_LIGNUM_VITAE_2.webp"
  }
];

console.log('🔍 Verifying Rabdan Image Files...\n');

let missingFiles = [];
let existingFiles = [];

// Check each product's images
rabdanProducts.forEach(product => {
  console.log(`📦 ${product.name} (ID: ${product.id})`);
  
  // Check main image
  const mainImagePath = path.join(ASSETS_DIR, product.mainImage);
  if (fs.existsSync(mainImagePath)) {
    const stats = fs.statSync(mainImagePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`  ✅ Main Image: ${product.mainImage} (${sizeKB}KB)`);
    existingFiles.push(product.mainImage);
  } else {
    console.log(`  ❌ Main Image MISSING: ${product.mainImage}`);
    missingFiles.push(product.mainImage);
  }
  
  // Check mood image
  const moodImagePath = path.join(ASSETS_DIR, product.moodImage);
  if (fs.existsSync(moodImagePath)) {
    const stats = fs.statSync(moodImagePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`  ✅ Mood Image: ${product.moodImage} (${sizeKB}KB)`);
    existingFiles.push(product.moodImage);
  } else {
    console.log(`  ❌ Mood Image MISSING: ${product.moodImage}`);
    missingFiles.push(product.moodImage);
  }
  
  console.log('');
});

console.log('📊 Verification Summary:');
console.log(`  ✅ Existing files: ${existingFiles.length}`);
console.log(`  ❌ Missing files: ${missingFiles.length}`);

if (missingFiles.length > 0) {
  console.log('\n📁 Missing Files:');
  missingFiles.forEach(file => {
    console.log(`  - ${file}`);
  });
  
  console.log('\n💡 Recommendations:');
  console.log('1. Download missing images from Rabdan website');
  console.log('2. Ensure file names match exactly with product data');
  console.log('3. Place images in assets/perfumes directory');
} else {
  console.log('\n🎉 All Rabdan images are present and accounted for!');
  console.log('✅ Product images should be displaying correctly in product cards.');
}

console.log('\n📝 Note:');
console.log('File sizes indicate image quality:');
console.log('- Files > 100KB are likely high quality');
console.log('- Files < 50KB may be thumbnails and should be replaced');