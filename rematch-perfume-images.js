const fs = require('fs');
const path = require('path');

// Load the processed perfumes data
const perfumesData = JSON.parse(fs.readFileSync('./processed-perfumes.json', 'utf8'));

// Function to get all image files from a brand directory
function getBrandImages(brand) {
  const brandDir = path.join('./assets/perfumes', brand.toLowerCase());
  if (!fs.existsSync(brandDir)) {
    console.log(`Brand directory not found: ${brandDir}`);
    return [];
  }
  
  const files = fs.readdirSync(brandDir);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp' || ext === '.avif';
  }).map(file => `/assets/perfumes/${brand.toLowerCase()}/${file}`);
}

// Function to match images to a specific perfume based on name and type
function matchImagesToPerfume(perfume, allBrandImages) {
  const matchedImages = [];
  
  // Normalize perfume name for matching
  const normalizedName = perfume.name.toLowerCase().replace(/\s+/g, '_');
  const fullName = perfume.fullName ? perfume.fullName.toLowerCase() : '';
  const type = perfume.type ? perfume.type.toLowerCase() : '';
  
  // Match images based on perfume name and type
  for (const imagePath of allBrandImages) {
    const fileName = path.basename(imagePath, path.extname(imagePath)).toLowerCase();
    
    // Check if the image filename contains the perfume name
    if (fileName.includes(normalizedName) || 
        (fullName && fileName.includes(fullName.replace(/\s+/g, '_')))) {
      matchedImages.push(imagePath);
    }
    // Special case for variants
    else if (perfume.name.includes('SPORT') && fileName.includes('sport')) {
      matchedImages.push(imagePath);
    }
    else if (perfume.name.includes('EDITION BLANCHE') && fileName.includes('blanche')) {
      matchedImages.push(imagePath);
    }
    else if (perfume.name.includes('EAU EXTREME') && fileName.includes('extreme')) {
      matchedImages.push(imagePath);
    }
  }
  
  // If no specific matches found, try matching by type
  if (matchedImages.length === 0 && type) {
    for (const imagePath of allBrandImages) {
      const fileName = path.basename(imagePath, path.extname(imagePath)).toLowerCase();
      
      // Match by type if available
      if (type && fileName.includes(type)) {
        matchedImages.push(imagePath);
      }
    }
  }
  
  return matchedImages;
}

// Function to determine primary and mood images
function assignPrimaryAndMoodImages(images) {
  if (images.length === 0) return { primary: null, mood: null, additional: [] };
  
  // First image as primary
  const primary = images[0];
  
  // Second image as mood (if exists)
  const mood = images.length > 1 ? images[1] : null;
  
  // Additional images
  const additional = images.slice(2);
  
  return { primary, mood, additional };
}

// Main rematching function
function rematchImages() {
  console.log('Starting image rematching process...');
  
  // Group perfumes by brand
  const brands = [...new Set(perfumesData.map(p => p.brand))];
  console.log(`Found ${brands.length} brands: ${brands.join(', ')}`);
  
  // Process each perfume
  const updatedPerfumes = perfumesData.map(perfume => {
    try {
      // Get all images for this brand
      const brandImages = getBrandImages(perfume.brand);
      
      if (brandImages.length === 0) {
        console.log(`No images found for brand: ${perfume.brand}`);
        return perfume; // Return unchanged if no images found
      }
      
      // Match images to this specific perfume
      const matchedImages = matchImagesToPerfume(perfume, brandImages);
      
      if (matchedImages.length === 0) {
        console.log(`No matching images found for perfume: ${perfume.name} (${perfume.brand})`);
        return perfume; // Return unchanged if no matches found
      }
      
      console.log(`Matched ${matchedImages.length} images for ${perfume.name} (${perfume.brand})`);
      
      // Assign primary, mood, and additional images
      const { primary, mood, additional } = assignPrimaryAndMoodImages(matchedImages);
      
      // Update the perfume object
      const updatedPerfume = {
        ...perfume,
        imageUrl: primary || perfume.imageUrl, // Keep existing if no new primary found
        moodImageUrl: mood || perfume.moodImageUrl, // Keep existing if no new mood found
        images: JSON.stringify(additional) // Store additional images as JSON string
      };
      
      return updatedPerfume;
    } catch (error) {
      console.error(`Error processing perfume ${perfume.name}:`, error);
      return perfume; // Return unchanged on error
    }
  });
  
  // Save the updated data
  fs.writeFileSync('./processed-perfumes-rematched.json', JSON.stringify(updatedPerfumes, null, 2));
  console.log('Image rematching completed. Results saved to processed-perfumes-rematched.json');
  
  // Also save to the main file
  fs.writeFileSync('./processed-perfumes.json', JSON.stringify(updatedPerfumes, null, 2));
  console.log('Updated data also saved to processed-perfumes.json');
  
  return updatedPerfumes;
}

// Run the rematching process
rematchImages();