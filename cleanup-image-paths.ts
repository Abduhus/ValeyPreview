import fs from 'fs';
import path from 'path';

// Read the processed perfumes data
let perfumesData: any[] = [];
try {
  perfumesData = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));
  console.log(`Loaded ${perfumesData.length} perfumes from processed-perfumes.json`);
} catch (error) {
  console.error('Error reading processed-perfumes.json:', error);
  process.exit(1);
}

// Function to fix image paths
function fixImagePath(imagePath: string): string {
  // Fix duplicate directory issues
  if (imagePath.includes('/Rabdan/Rabdan/')) {
    return imagePath.replace('/Rabdan/Rabdan/', '/Rabdan/');
  }
  
  // Fix other path issues as needed
  return imagePath;
}

// Clean up image paths for all perfumes
const updatedPerfumes = perfumesData.map((perfume: any) => {
  let updated = false;
  
  // Fix imageUrl if it exists
  if (perfume.imageUrl) {
    const fixedPath = fixImagePath(perfume.imageUrl);
    if (fixedPath !== perfume.imageUrl) {
      perfume.imageUrl = fixedPath;
      updated = true;
    }
  }
  
  // Fix moodImageUrl if it exists
  if (perfume.moodImageUrl) {
    const fixedPath = fixImagePath(perfume.moodImageUrl);
    if (fixedPath !== perfume.moodImageUrl) {
      perfume.moodImageUrl = fixedPath;
      updated = true;
    }
  }
  
  // Fix images array if it exists
  if (perfume.images) {
    try {
      const images = JSON.parse(perfume.images);
      const fixedImages = images.map((imgPath: string) => fixImagePath(imgPath));
      
      // Check if any paths were fixed
      const pathsChanged = JSON.stringify(images) !== JSON.stringify(fixedImages);
      if (pathsChanged) {
        perfume.images = JSON.stringify(fixedImages);
        updated = true;
      }
    } catch (error) {
      console.log(`Error parsing images for perfume ${perfume.id}: ${perfume.name}`);
    }
  }
  
  if (updated) {
    console.log(`Fixed paths for ${perfume.name} (${perfume.brand})`);
  }
  
  return perfume;
});

// Write updated data back to file
try {
  fs.writeFileSync('processed-perfumes.json', JSON.stringify(updatedPerfumes, null, 2));
  console.log('\nSuccessfully updated processed-perfumes.json with cleaned image paths');
} catch (error) {
  console.error('Error writing to processed-perfumes.json:', error);
  process.exit(1);
}

console.log('Image path cleanup complete!');