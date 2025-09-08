import fs from 'fs';

// Comprehensive scan for remaining suspicious/unrelated images in ALL product cards
console.log('🔍 COMPREHENSIVE SCAN: Checking ALL product cards for unrelated images\n');

// Read the storage file
const storageContent = fs.readFileSync('c:/Games/ValleyPreview/server/storage.ts', 'utf8');

// Define suspicious images that should not be in product arrays
const suspiciousImages = [
  // Cadence/unrelated brand images
  '1000014059.webp',
  
  // Generic numbered images
  '3-3.jpg',
  '4-1.jpg', 
  '105-300x300.jpg',
  '106-300x300.jpg',
  '107-300x300.jpg', 
  '108-300x300.jpg',
  '126-300x300.jpg',
  '127-300x300.jpg',
  '128-300x300.jpg',
  '129-300x300.jpg',
  '130-300x300.jpg',
  '130.jpg',
  
  // Generic/unidentified images
  'DSC_104-300x300.jpg',
  'o.3749.jpg',
  'a421b34f-1b58-42f1-94d1-3128da30c60c.webp',
  
  // Generic brand images (should not be in product galleries)
  'rabdan-perfumes.webp',
  'rabdan.png', 
  'coreterno-brand.webp',
  'Signature-Royale_ecriture-doree-big.png',
  'Bortnikoff.webp',
  'Gallagher-1.webp',
  'leaumaliz.webp',
  'AREEG-LE-DORE.webp',
  'MELEG.webp'
];

// Extract all image references from the storage file
const imageMatches = storageContent.match(/["'\/]assets\/perfumes\/[^"']+["']/g) || [];
const allImageReferences = imageMatches.map(match => match.replace(/["']/g, ''));

console.log('📊 SCANNING RESULTS:');
console.log('===================\n');

// Check for suspicious images in the storage file
const foundSuspiciousImages = [];
suspiciousImages.forEach(suspicious => {
  const foundReferences = allImageReferences.filter(ref => ref.includes(suspicious));
  if (foundReferences.length > 0) {
    foundSuspiciousImages.push({
      image: suspicious,
      references: foundReferences
    });
  }
});

if (foundSuspiciousImages.length > 0) {
  console.log('🚨 SUSPICIOUS IMAGES FOUND:');
  foundSuspiciousImages.forEach((item, index) => {
    console.log(`${index + 1}. ${item.image}`);
    item.references.forEach(ref => {
      console.log(`   → ${ref}`);
    });
    console.log('');
  });
} else {
  console.log('✅ NO SUSPICIOUS IMAGES FOUND!');
  console.log('All product cards appear to be clean.');
}

// Check for misplaced Saint Petersburg images
console.log('\n🏛️ SAINT PETERSBURG IMAGE CHECK:');
console.log('=================================');
const saintPetersburgImages = [
  'rabdan_saint_petersburg_1-300x300.jpeg',
  'rabdan_saint_petersburg_2-300x300.jpeg'
];

saintPetersburgImages.forEach(spImage => {
  const spReferences = allImageReferences.filter(ref => ref.includes(spImage));
  console.log(`${spImage}: ${spReferences.length} reference(s)`);
  spReferences.forEach(ref => console.log(`   → ${ref}`));
});

// Validate brand-specific image patterns
console.log('\n🏷️ BRAND VALIDATION CHECK:');
console.log('==========================');

// Extract product blocks for analysis
const productBlocks = storageContent.match(/{\s*id:\s*"[^"]+",[\s\S]*?inStock:\s*true,?\s*}/g) || [];

const brandValidationIssues = [];

productBlocks.forEach(block => {
  const idMatch = block.match(/id:\s*"([^"]+)"/);
  const nameMatch = block.match(/name:\s*"([^"]+)"/);
  const brandMatch = block.match(/brand:\s*"([^"]+)"/);
  const imagesMatch = block.match(/images:\s*JSON\.stringify\(\[([\s\S]*?)\]\)/);
  
  if (idMatch && nameMatch && brandMatch && imagesMatch) {
    const id = idMatch[1];
    const name = nameMatch[1];
    const brand = brandMatch[1];
    const imagesStr = imagesMatch[1];
    
    // Extract image paths from the images array
    const imageUrls = imagesStr.match(/"([^"]+)"/g) || [];
    const cleanImageUrls = imageUrls.map(url => url.replace(/"/g, ''));
    
    // Validate based on brand
    cleanImageUrls.forEach(imageUrl => {
      if (brand === 'Rabdan') {
        // Rabdan products should only have Rabdan_PRODUCTNAME pattern or specific allowed images
        const isValidRabdan = 
          /Rabdan_.*_[12]-300x300\.webp$/.test(imageUrl) ||
          /rabdan_saint_petersburg_[12]-300x300\.jpeg$/.test(imageUrl) ||
          imageUrl.includes('3-3.jpg'); // Special case for Saint Petersburg
        
        if (!isValidRabdan) {
          brandValidationIssues.push({
            product: `${name} (ID: ${id})`,
            brand: brand,
            issue: `Invalid Rabdan image: ${imageUrl}`
          });
        }
      } else if (brand === 'Signature Royale') {
        // Signature Royale should only have their specific pattern
        const isValidSR = /SignatureRoyale|Signature-Royale/.test(imageUrl);
        if (!isValidSR) {
          brandValidationIssues.push({
            product: `${name} (ID: ${id})`,
            brand: brand,
            issue: `Invalid Signature Royale image: ${imageUrl}`
          });
        }
      }
      // Add more brand validations as needed
    });
  }
});

if (brandValidationIssues.length > 0) {
  console.log('🚨 BRAND VALIDATION ISSUES:');
  brandValidationIssues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.product} (${issue.brand})`);
    console.log(`   → ${issue.issue}`);
  });
} else {
  console.log('✅ ALL BRAND VALIDATIONS PASSED!');
}

console.log('\n📋 SCAN SUMMARY:');
console.log('================');
console.log(`Total image references found: ${allImageReferences.length}`);
console.log(`Suspicious images found: ${foundSuspiciousImages.length}`);
console.log(`Brand validation issues: ${brandValidationIssues.length}`);

if (foundSuspiciousImages.length === 0 && brandValidationIssues.length === 0) {
  console.log('\n🎉 SUCCESS: All product cards are clean!');
  console.log('✅ No Cadence images found');
  console.log('✅ No suspicious images detected');
  console.log('✅ All brand validations passed');
} else {
  console.log('\n🔧 ACTION REQUIRED:');
  console.log('Remove the identified suspicious images from product image arrays.');
}