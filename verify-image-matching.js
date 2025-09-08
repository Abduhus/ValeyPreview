import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, 'assets', 'perfumes');

console.log('🔍 Verifying image file matching...\n');

// Read all files in the assets directory
const files = fs.readdirSync(ASSETS_DIR);

// Filter for Rabdan images (excluding backup files)
const rabdanImages = files.filter(file => 
  file.toLowerCase().includes('rabdan') && 
  !file.toLowerCase().includes('backup') &&
  (file.endsWith('.webp') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
);

console.log(`Found ${rabdanImages.length} Rabdan image files:`);
rabdanImages.forEach(file => {
  console.log(`  - ${file}`);
});

// Check for case sensitivity issues
console.log('\n🔍 Checking for case sensitivity issues...');
const lowercaseFiles = rabdanImages.map(file => file.toLowerCase());

// Check if there are any duplicates when converted to lowercase
const uniqueLowercase = [...new Set(lowercaseFiles)];
if (uniqueLowercase.length !== lowercaseFiles.length) {
  console.log('⚠️  Potential case sensitivity issues found!');
  // Find duplicates
  const seen = new Set();
  const duplicates = [];
  lowercaseFiles.forEach((file, index) => {
    if (seen.has(file)) {
      duplicates.push({ original: rabdanImages[index], lowercase: file });
    } else {
      seen.add(file);
    }
  });
  if (duplicates.length > 0) {
    console.log('Duplicate files (case-insensitive):');
    duplicates.forEach(dup => {
      console.log(`  - ${dup.original}`);
    });
  }
} else {
  console.log('✅ No case sensitivity issues found.');
}

// Check specific product image references
console.log('\n🔍 Checking specific product references...');

const productChecks = [
  {
    product: "Rabdan Chill Vibes",
    expected: ["/perfumes/Rabdan_CHILL-VIBES_1.webp", "/perfumes/Rabdan_CHILL_-VIBES_2.webp"]
  },
  {
    product: "Rabdan Room 816",
    expected: ["/perfumes/Rabdan_Room_816_1.webp", "/perfumes/Rabdan_Room_816_2.webp"]
  },
  {
    product: "Rabdan Saint Petersburg",
    expected: ["/perfumes/rabdan_saint_petersburg_1.jpeg", "/perfumes/rabdan_saint_petersburg_2.jpeg"]
  }
];

productChecks.forEach(check => {
  console.log(`\n${check.product}:`);
  check.expected.forEach(imagePath => {
    // Extract just the filename
    const filename = path.basename(imagePath);
    const exists = rabdanImages.includes(filename);
    if (exists) {
      console.log(`  ✅ ${filename} - Found`);
    } else {
      console.log(`  ❌ ${filename} - NOT FOUND`);
      // Check for case-insensitive match
      const lowerFilename = filename.toLowerCase();
      const match = rabdanImages.find(f => f.toLowerCase() === lowerFilename);
      if (match) {
        console.log(`     🔄 Case mismatch: Found ${match} instead`);
      }
    }
  });
});