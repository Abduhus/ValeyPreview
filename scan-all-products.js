import fs from 'fs';

// Comprehensive scan and fix for ALL perfume product cards
console.log('🔍 COMPREHENSIVE PERFUME CATALOG CLEANUP');
console.log('=====================================\n');

// Read the storage file
const storageContent = fs.readFileSync('c:/Games/ValleyPreview/server/storage.ts', 'utf8');

// Define suspicious images that should not be in product arrays
const suspiciousImages = [
  // Cadence/unrelated brand images
  '1000014059.webp',
  
  // Generic numbered images (likely from other brands/unrelated)
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

// Extract product blocks for analysis
const productBlocks = storageContent.match(/{\s*id:\s*"[^"]+",[\s\S]*?inStock:\s*true,?\s*}/g) || [];

console.log(`Found ${productBlocks.length} products to analyze\n`);

const issuesFound = [];
let productsWithIssues = 0;
let totalSuspiciousImagesFound = 0;

// Analyze each product
productBlocks.forEach((block, index) => {
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
    
    // Check for suspicious images
    const suspiciousInProduct = [];
    cleanImageUrls.forEach(imageUrl => {
      suspiciousImages.forEach(suspicious => {
        if (imageUrl.includes(suspicious)) {
          suspiciousInProduct.push(imageUrl);
        }
      });
    });
    
    if (suspiciousInProduct.length > 0) {
      productsWithIssues++;
      totalSuspiciousImagesFound += suspiciousInProduct.length;
      
      issuesFound.push({
        id,
        name,
        brand,
        suspiciousImages: suspiciousInProduct,
        totalImages: cleanImageUrls.length,
        allImages: cleanImageUrls
      });
      
      console.log(`❌ ${name} (ID: ${id}) - ${brand}`);
      console.log(`   Total images: ${cleanImageUrls.length}`);
      console.log(`   Suspicious images: ${suspiciousInProduct.length}`);
      suspiciousInProduct.forEach(img => {
        console.log(`   → ${img}`);
      });
      console.log('');
    }
  }
});

console.log('📊 SCAN SUMMARY:');
console.log('================');
console.log(`Total products scanned: ${productBlocks.length}`);
console.log(`Products with issues: ${productsWithIssues}`);
console.log(`Total suspicious images found: ${totalSuspiciousImagesFound}`);

if (issuesFound.length > 0) {
  console.log('\n🔧 CLEANUP REQUIRED FOR:');
  console.log('========================');
  issuesFound.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.name} (${issue.brand})`);
    console.log(`   ID: ${issue.id}`);
    console.log(`   Issues: ${issue.suspiciousImages.length} suspicious images`);
    console.log(`   Action: Remove ${issue.suspiciousImages.join(', ')}`);
    console.log('');
  });
  
  console.log('🎯 RECOMMENDED ACTIONS:');
  console.log('=======================');
  console.log('1. Remove all suspicious images from product image arrays');
  console.log('2. Keep only authentic product-specific images');
  console.log('3. Update moodImageUrl for affected products if needed');
  console.log('4. Restart server to apply changes');
  
} else {
  console.log('\n✅ SUCCESS: All product cards are clean!');
  console.log('No suspicious images found in any product.');
}

// Export the issues for fixing
if (issuesFound.length > 0) {
  fs.writeFileSync('c:/Games/ValleyPreview/cleanup-issues.json', JSON.stringify(issuesFound, null, 2));
  console.log('\n📄 Issues exported to cleanup-issues.json for automated fixing.');
}