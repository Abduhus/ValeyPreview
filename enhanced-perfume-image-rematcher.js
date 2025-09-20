const fs = require('fs');
const path = require('path');

// Load the processed perfumes data
const perfumesData = JSON.parse(fs.readFileSync('./processed-perfumes.json', 'utf8'));

// Perfume concentration definitions
const PERFUME_TYPES = {
  EDT: { name: "Eau de Toilette", concentration: "5-15%", duration: "3-5 hours" },
  EDP: { name: "Eau de Parfum", concentration: "15-20%", duration: "5-8 hours" },
  PARFUM: { name: "Parfum", concentration: "20-40%", duration: "8+ hours" },
  COLOGNE: { name: "Eau de Cologne", concentration: "2-5%", duration: "2-3 hours" }
};

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

// Function to match images to a specific perfume based on name, type, and concentration
function matchImagesToPerfume(perfume, allBrandImages) {
  const matchedImages = [];
  
  // Normalize perfume name for matching
  const normalizedName = perfume.name.toLowerCase().replace(/\s+/g, '_');
  const fullName = perfume.fullName ? perfume.fullName.toLowerCase() : '';
  const type = perfume.type ? perfume.type.toLowerCase() : '';
  
  console.log(`Matching images for: ${perfume.name} (${perfume.brand}) - Type: ${type}`);
  
  // First, try to match by exact perfume name
  for (const imagePath of allBrandImages) {
    const fileName = path.basename(imagePath, path.extname(imagePath)).toLowerCase();
    const cleanFileName = fileName.replace(/\s+/g, '_');
    
    // Exact name match
    if (cleanFileName.includes(normalizedName)) {
      matchedImages.push(imagePath);
    }
    // Full name match (without parentheses and extra info)
    else if (fullName && cleanFileName.includes(fullName.replace(/\(.+?\)/g, '').trim().replace(/\s+/g, '_'))) {
      matchedImages.push(imagePath);
    }
  }
  
  // If we have matches by name, return those
  if (matchedImages.length > 0) {
    console.log(`Found ${matchedImages.length} name-matched images`);
    return matchedImages;
  }
  
  // If no name matches, try matching by type/concentration
  if (type) {
    for (const imagePath of allBrandImages) {
      const fileName = path.basename(imagePath, path.extname(imagePath)).toLowerCase();
      
      // Match by type if available
      if (type === 'edt' && (fileName.includes('edt') || fileName.includes('toilette'))) {
        matchedImages.push(imagePath);
      } else if (type === 'edp' && (fileName.includes('edp') || fileName.includes('parfum'))) {
        matchedImages.push(imagePath);
      } else if (type === 'parfum' && fileName.includes('parfum')) {
        matchedImages.push(imagePath);
      } else if (type === 'cologne' && fileName.includes('cologne')) {
        matchedImages.push(imagePath);
      }
    }
  }
  
  // If still no matches, for specific brands like Rabdan, use all images
  if (matchedImages.length === 0 && allBrandImages.length > 0) {
    if (perfume.brand === 'RABDAN') {
      console.log(`Using all ${allBrandImages.length} images for Rabdan perfume`);
      return allBrandImages;
    }
  }
  
  console.log(`Found ${matchedImages.length} type-matched images`);
  return matchedImages;
}

// Function to determine primary and mood images with type awareness
function assignPrimaryAndMoodImages(images, perfumeType) {
  if (images.length === 0) return { primary: null, mood: null, additional: [] };
  
  // Sort images based on type preferences
  let sortedImages = [...images];
  
  if (perfumeType) {
    const type = perfumeType.toLowerCase();
    
    // Sort based on type-specific preferences
    if (type === 'edt') {
      // Prefer images with "toilette" or "edt" in filename
      sortedImages.sort((a, b) => {
        const aName = path.basename(a, path.extname(a)).toLowerCase();
        const bName = path.basename(b, path.extname(b)).toLowerCase();
        const aScore = (aName.includes('toilette') ? 2 : 0) + (aName.includes('edt') ? 1 : 0);
        const bScore = (bName.includes('toilette') ? 2 : 0) + (bName.includes('edt') ? 1 : 0);
        return bScore - aScore;
      });
    } else if (type === 'edp') {
      // Prefer images with "parfum" or "edp" in filename
      sortedImages.sort((a, b) => {
        const aName = path.basename(a, path.extname(a)).toLowerCase();
        const bName = path.basename(b, path.extname(b)).toLowerCase();
        const aScore = (aName.includes('parfum') ? 2 : 0) + (aName.includes('edp') ? 1 : 0);
        const bScore = (bName.includes('parfum') ? 2 : 0) + (bName.includes('edp') ? 1 : 0);
        return bScore - aScore;
      });
    }
  }
  
  // First image as primary
  const primary = sortedImages[0];
  
  // Second image as mood (if exists)
  const mood = sortedImages.length > 1 ? sortedImages[1] : null;
  
  // Additional images
  const additional = sortedImages.slice(2);
  
  return { primary, mood, additional };
}

// Main rematching function
function rematchImages() {
  console.log('Starting enhanced image rematching process with perfume type awareness...');
  
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
      
      // Assign primary, mood, and additional images with type awareness
      const { primary, mood, additional } = assignPrimaryAndMoodImages(matchedImages, perfume.type);
      
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
  fs.writeFileSync('./processed-perfumes-enhanced-rematched.json', JSON.stringify(updatedPerfumes, null, 2));
  console.log('Enhanced image rematching completed. Results saved to processed-perfumes-enhanced-rematched.json');
  
  // Also save to the main file
  fs.writeFileSync('./processed-perfumes.json', JSON.stringify(updatedPerfumes, null, 2));
  console.log('Updated data also saved to processed-perfumes.json');
  
  return updatedPerfumes;
}

// Run the rematching process
rematchImages();