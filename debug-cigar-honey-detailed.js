// Debug script to trace the exact allImages array construction for Rabdan Cigar Honey
import fs from 'fs';

// Read the current product data from server
console.log('🔍 DEBUGGING CIGAR HONEY IMAGE DUPLICATION ISSUE\n');

// Simulate fetching the product data as the frontend would
const storageContent = fs.readFileSync('c:/Games/ValleyPreview/server/storage.ts', 'utf8');

// Find Rabdan Cigar Honey product (ID: 10)
const cigarHoneyMatch = storageContent.match(/{\s*id:\s*"10",[\s\S]*?inStock:\s*true,?\s*}/);

if (cigarHoneyMatch) {
  const productBlock = cigarHoneyMatch[0];
  
  // Extract the product fields
  const imageUrlMatch = productBlock.match(/imageUrl:\s*"([^"]+)"/);
  const moodImageUrlMatch = productBlock.match(/moodImageUrl:\s*"([^"]+)"/);
  const imagesMatch = productBlock.match(/images:\s*JSON\.stringify\(\[([\s\S]*?)\]\)/);
  
  const product = {
    id: "10",
    name: "Rabdan Cigar Honey",
    imageUrl: imageUrlMatch ? imageUrlMatch[1] : null,
    moodImageUrl: moodImageUrlMatch ? moodImageUrlMatch[1] : null,
    images: null
  };
  
  if (imagesMatch) {
    const imagesStr = imagesMatch[1];
    const imageUrls = imagesStr.match(/"([^"]+)"/g) || [];
    const cleanImageUrls = imageUrls.map(url => url.replace(/"/g, ''));
    product.images = JSON.stringify(cleanImageUrls);
  }
  
  console.log('📋 PRODUCT DATA:');
  console.log('================');
  console.log('imageUrl:', product.imageUrl);
  console.log('moodImageUrl:', product.moodImageUrl);
  console.log('images JSON:', product.images);
  
  // Simulate what ProductCard component does
  console.log('\n🔄 COMPONENT PROCESSING:');
  console.log('========================');
  
  // Step 1: Parse additional images
  const additionalImages = product.images ? JSON.parse(product.images) : [];
  console.log('additionalImages array:', additionalImages);
  
  // Step 2: Create allImages array (EXACT ProductCard logic)
  const allImagesBeforeFilter = [product.imageUrl, product.moodImageUrl, ...additionalImages];
  console.log('allImages BEFORE filtering:', allImagesBeforeFilter);
  console.log('Length before filtering:', allImagesBeforeFilter.length);
  
  // Step 3: Apply filtering (EXACT ProductCard logic)
  const allImages = allImagesBeforeFilter.filter((img, index, arr) => 
    img && arr.indexOf(img) === index // Remove duplicates
  );
  
  console.log('\n🎯 FINAL RESULT:');
  console.log('================');
  console.log('allImages AFTER filtering:', allImages);
  console.log('Final length:', allImages.length);
  
  // Debug the filtering process
  console.log('\n🔍 FILTERING ANALYSIS:');
  console.log('======================');
  allImagesBeforeFilter.forEach((img, index) => {
    const firstIndex = allImagesBeforeFilter.indexOf(img);
    const isKept = img && firstIndex === index;
    console.log(`[${index}] "${img}" -> indexOf: ${firstIndex}, kept: ${isKept}`);
  });
  
  if (allImages.length === 4) {
    console.log('\n❌ CONFIRMED: 4 images detected in allImages array!');
    console.log('This explains the 4 dots and "1/4" counter in the UI.');
    
    // Check for subtle differences
    console.log('\n🔬 CHECKING FOR SUBTLE DIFFERENCES:');
    console.log('===================================');
    const uniqueCheck = new Set(allImages);
    console.log('Unique images by Set:', uniqueCheck.size);
    console.log('Unique images:', Array.from(uniqueCheck));
    
    if (uniqueCheck.size < allImages.length) {
      console.log('⚠️  There are identical duplicates that filtering missed!');
    } else {
      console.log('ℹ️  All images are technically different (possibly subtle character differences)');
    }
  }
  
} else {
  console.log('❌ Rabdan Cigar Honey product not found!');
}