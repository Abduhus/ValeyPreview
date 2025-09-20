const fs = require('fs');
const path = require('path');

// Load the processed perfumes data
const perfumesData = JSON.parse(fs.readFileSync('./processed-perfumes.json', 'utf8'));

// Function to get all image files from a brand directory (case-insensitive)
function getBrandImages(brand) {
  // Normalize brand name for directory search
  const normalizedBrand = brand.toLowerCase().replace(/\s+/g, '');
  
  // Check common directory naming patterns
  const possibleDirs = [
    `./assets/perfumes/${brand}`,
    `./assets/perfumes/${brand.toLowerCase()}`,
    `./assets/perfumes/${brand.toUpperCase()}`,
    `./assets/perfumes/${normalizedBrand}`,
    `./assets/perfumes/${normalizedBrand.toLowerCase()}`,
    `./assets/perfumes/${normalizedBrand.toUpperCase()}`
  ];
  
  let brandDir = null;
  for (const dir of possibleDirs) {
    if (fs.existsSync(dir)) {
      brandDir = dir;
      break;
    }
  }
  
  if (!brandDir) {
    // Try to find any directory that matches the brand name (case-insensitive)
    const perfumesDir = './assets/perfumes';
    if (fs.existsSync(perfumesDir)) {
      const dirs = fs.readdirSync(perfumesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      for (const dir of dirs) {
        if (dir.toLowerCase().includes(normalizedBrand) || normalizedBrand.includes(dir.toLowerCase())) {
          brandDir = path.join(perfumesDir, dir);
          break;
        }
      }
    }
  }
  
  if (!brandDir || !fs.existsSync(brandDir)) {
    console.log(`Brand directory not found for: ${brand}`);
    return [];
  }
  
  console.log(`Found brand directory: ${brandDir}`);
  
  const files = fs.readdirSync(brandDir);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp' || ext === '.avif';
  }).map(file => `/assets/perfumes/${path.basename(brandDir)}/${file}`);
}

// Function to match images to a specific perfume based on name and type
function matchImagesToPerfume(perfume, allBrandImages) {
  const matchedImages = [];
  
  // Normalize perfume name for matching
  const normalizedName = perfume.name.toLowerCase().replace(/\s+/g, '_');
  const fullName = perfume.fullName ? perfume.fullName.toLowerCase() : '';
  const type = perfume.type ? perfume.type.toLowerCase() : '';
  
  // Match images based on perfume name
  for (const imagePath of allBrandImages) {
    const fileName = path.basename(imagePath, path.extname(imagePath)).toLowerCase();
    
    // Exact name match
    if (fileName.includes(normalizedName.replace(/\s+/g, '_'))) {
      matchedImages.push(imagePath);
    }
    // Full name match
    else if (fullName && fileName.includes(fullName.replace(/\s+/g, '_').replace(/\(.+?\)/g, '').trim())) {
      matchedImages.push(imagePath);
    }
    // Partial name matches for variants
    else if (perfume.name.includes('SPORT') && fileName.includes('sport')) {
      matchedImages.push(imagePath);
    }
    else if (perfume.name.includes('EDITION BLANCHE') && fileName.includes('blanche')) {
      matchedImages.push(imagePath);
    }
    else if (perfume.name.includes('EAU EXTREME') && fileName.includes('extreme')) {
      matchedImages.push(imagePath);
    }
    else if (perfume.name.includes('SENSUELLE') && fileName.includes('sensuelle')) {
      matchedImages.push(imagePath);
    }
    // For Rabdan perfumes, match by exact name
    else if (perfume.brand === 'RABDAN') {
      const cleanPerfumeName = perfume.name.toLowerCase().replace(/\s+/g, '_');
      if (fileName.includes(cleanPerfumeName)) {
        matchedImages.push(imagePath);
      }
    }
  }
  
  // If no specific matches found, try matching by type
  if (matchedImages.length === 0 && type) {
    for (const imagePath of allBrandImages) {
      const fileName = path.basename(imagePath, path.extname(imagePath)).toLowerCase();
      
      // Match by type if available
      if (fileName.includes(type)) {
        matchedImages.push(imagePath);
      }
    }
  }
  
  // If still no matches, use all images (for brands like Rabdan that have generic naming)
  if (matchedImages.length === 0 && allBrandImages.length > 0) {
    // For Rabdan, we want to use all images since they're all relevant
    if (perfume.brand === 'RABDAN') {
      return allBrandImages;
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
  console.log('Starting improved image rematching process...');
  
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
  fs.writeFileSync('./processed-perfumes-improved-rematched.json', JSON.stringify(updatedPerfumes, null, 2));
  console.log('Image rematching completed. Results saved to processed-perfumes-improved-rematched.json');
  
  // Also save to the main file
  fs.writeFileSync('./processed-perfumes.json', JSON.stringify(updatedPerfumes, null, 2));
  console.log('Updated data also saved to processed-perfumes.json');
  
  return updatedPerfumes;
}

// Run the rematching process
rematchImages();