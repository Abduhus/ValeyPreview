import fs from 'fs';
import path from 'path';

// Read the processed perfumes data
const perfumesData = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));

console.log(`Verifying image paths for ${perfumesData.length} perfumes...`);

let validImages = 0;
let invalidImages = 0;
let missingImages = 0;
const invalidPaths: string[] = [];
const missingPerfumes: any[] = [];

perfumesData.forEach((perfume: any, index: number) => {
  // Show progress every 100 perfumes
  if (index % 100 === 0) {
    console.log(`Checking perfume ${index + 1}/${perfumesData.length}: ${perfume.name} (${perfume.brand})`);
  }
  
  // Check if perfume has images
  if (!perfume.imageUrl && !perfume.moodImageUrl && !perfume.images) {
    missingImages++;
    missingPerfumes.push({
      id: perfume.id,
      name: perfume.name,
      brand: perfume.brand
    });
    return;
  }
  
  // Check imageUrl
  if (perfume.imageUrl) {
    // Convert URL path to file system path
    const imagePath = path.join('.', perfume.imageUrl);
    if (fs.existsSync(imagePath)) {
      validImages++;
    } else {
      invalidImages++;
      invalidPaths.push(perfume.imageUrl);
    }
  }
  
  // Check moodImageUrl
  if (perfume.moodImageUrl) {
    // Convert URL path to file system path
    const moodImagePath = path.join('.', perfume.moodImageUrl);
    if (fs.existsSync(moodImagePath)) {
      validImages++;
    } else {
      invalidImages++;
      invalidPaths.push(perfume.moodImageUrl);
    }
  }
  
  // Check additional images
  if (perfume.images) {
    try {
      const images = JSON.parse(perfume.images);
      images.forEach((imagePath: string) => {
        // Convert URL path to file system path
        const fullImagePath = path.join('.', imagePath);
        if (fs.existsSync(fullImagePath)) {
          validImages++;
        } else {
          invalidImages++;
          invalidPaths.push(imagePath);
        }
      });
    } catch (error) {
      console.log(`Error parsing images for perfume ${perfume.id}: ${perfume.name}`);
    }
  }
});

console.log('\n=== IMAGE VERIFICATION RESULTS ===');
console.log(`Valid images: ${validImages}`);
console.log(`Invalid images: ${invalidImages}`);
console.log(`Perfumes without images: ${missingImages}`);

if (invalidPaths.length > 0) {
  console.log('\nInvalid image paths:');
  invalidPaths.slice(0, 10).forEach(path => console.log(`- ${path}`));
  if (invalidPaths.length > 10) {
    console.log(`... and ${invalidPaths.length - 10} more`);
  }
}

if (missingPerfumes.length > 0) {
  console.log('\nPerfumes without images:');
  missingPerfumes.slice(0, 10).forEach(perfume => 
    console.log(`- ${perfume.name} (${perfume.brand}) - ID: ${perfume.id}`)
  );
  if (missingPerfumes.length > 10) {
    console.log(`... and ${missingPerfumes.length - 10} more`);
  }
}

console.log('\nVerification complete!');