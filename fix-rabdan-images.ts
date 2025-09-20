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

// Get all Rabdan image files
const rabdanImageFiles = fs.readdirSync('assets/perfumes/Rabdan');
console.log(`Found ${rabdanImageFiles.length} Rabdan image files`);

// Create a mapping of Rabdan product names to image files
const rabdanImageMap: { [key: string]: string[] } = {};

// Process each image file
rabdanImageFiles.forEach(imageFile => {
  if (imageFile.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i) && imageFile !== 'rabdan.png') {
    // Extract product name from image filename
    const imageName = path.basename(imageFile, path.extname(imageFile));
    
    // Handle different naming conventions
    let productName = imageName;
    
    // Remove "Rabdan_" prefix if present
    if (productName.startsWith('Rabdan_')) {
      productName = productName.substring(7);
    }
    
    // Remove "_1", "_2", etc. suffixes
    productName = productName.replace(/_\d+$/, '');
    
    // Convert to uppercase and replace underscores with spaces for matching
    const matchName = productName.replace(/_/g, ' ').toUpperCase();
    
    if (!rabdanImageMap[matchName]) {
      rabdanImageMap[matchName] = [];
    }
    rabdanImageMap[matchName].push(`/assets/perfumes/Rabdan/${imageFile}`);
  }
});

console.log('Rabdan image mapping:');
Object.keys(rabdanImageMap).forEach(productName => {
  console.log(`- ${productName}: ${rabdanImageMap[productName].length} images`);
});

// Update Rabdan perfumes with proper images
const updatedPerfumes = perfumesData.map((perfume: any) => {
  if (perfume.brand === 'RABDAN') {
    // Normalize the perfume name for matching
    const normalizedName = perfume.name
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Try to find matching images
    const images = rabdanImageMap[normalizedName] || [];
    
    if (images.length > 0) {
      console.log(`Matched ${perfume.name} with ${images.length} images`);
      return {
        ...perfume,
        imageUrl: images[0],
        moodImageUrl: images.length > 1 ? images[1] : images[0],
        images: JSON.stringify(images)
      };
    } else {
      console.log(`No images found for ${perfume.name}`);
    }
  }
  
  return perfume;
});

// Write updated data back to file
try {
  fs.writeFileSync('processed-perfumes.json', JSON.stringify(updatedPerfumes, null, 2));
  console.log('\nSuccessfully updated processed-perfumes.json with proper Rabdan images');
} catch (error) {
  console.error('Error writing to processed-perfumes.json:', error);
  process.exit(1);
}

console.log('Rabdan image fixing complete!');