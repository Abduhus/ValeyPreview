// Debug script to check image arrays for Rabdan Cigar Honey
import fs from 'fs';

// Read and parse the storage file
const storageContent = fs.readFileSync('c:/Games/ValleyPreview/server/storage.ts', 'utf8');

// Find Rabdan Cigar Honey product
const cigarHoneyMatch = storageContent.match(/{\s*id:\s*"10",[\s\S]*?inStock:\s*true,?\s*}/);

if (cigarHoneyMatch) {
  const productBlock = cigarHoneyMatch[0];
  
  // Extract image-related fields
  const imageUrlMatch = productBlock.match(/imageUrl:\s*"([^"]+)"/);
  const moodImageUrlMatch = productBlock.match(/moodImageUrl:\s*"([^"]+)"/);
  const imagesMatch = productBlock.match(/images:\s*JSON\.stringify\(\[([\s\S]*?)\]\)/);
  
  console.log('🔍 RABDAN CIGAR HONEY - IMAGE ANALYSIS');
  console.log('=======================================\n');
  
  console.log('📷 imageUrl:', imageUrlMatch ? imageUrlMatch[1] : 'NOT FOUND');
  console.log('🖼️  moodImageUrl:', moodImageUrlMatch ? moodImageUrlMatch[1] : 'NOT FOUND');
  
  if (imagesMatch) {
    const imagesStr = imagesMatch[1];
    const imageUrls = imagesStr.match(/"([^"]+)"/g) || [];
    const cleanImageUrls = imageUrls.map(url => url.replace(/"/g, ''));
    
    console.log('📁 images array:', cleanImageUrls.length, 'items');
    cleanImageUrls.forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`);
    });
    
    // Simulate what ProductCard component does
    const simulatedAllImages = [
      imageUrlMatch ? imageUrlMatch[1] : null,
      moodImageUrlMatch ? moodImageUrlMatch[1] : null,
      ...cleanImageUrls
    ].filter((img, index, arr) => img && arr.indexOf(img) === index);
    
    console.log('\n🎯 SIMULATED allImages array (what ProductCard shows):');
    console.log('Total images:', simulatedAllImages.length);
    simulatedAllImages.forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`);
    });
    
    if (simulatedAllImages.length === 4) {
      console.log('\n❌ ISSUE FOUND: 4 images detected!');
      console.log('This explains why the website shows 4 photos.');
      
      // Check for duplicates before filtering
      const beforeFiltering = [
        imageUrlMatch ? imageUrlMatch[1] : null,
        moodImageUrlMatch ? moodImageUrlMatch[1] : null,
        ...cleanImageUrls
      ].filter(img => img);
      
      console.log('\n🔄 Before duplicate filtering:', beforeFiltering.length, 'items');
      beforeFiltering.forEach((url, index) => {
        console.log(`   ${index + 1}. ${url}`);
      });
      
    } else {
      console.log('\n✅ Expected result: Only', simulatedAllImages.length, 'unique images');
    }
    
  } else {
    console.log('📁 images array: NOT FOUND');
  }
  
} else {
  console.log('❌ Rabdan Cigar Honey product not found!');
}