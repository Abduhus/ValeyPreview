import fs from 'fs';
import path from 'path';

// Function to normalize perfume name for matching
function normalizePerfumeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/-+/g, ' ')
    .trim();
}

// Function to check if a perfume name matches an image filename
function isMatch(perfumeName: string, imageName: string): boolean {
  const normalizedPerfume = normalizePerfumeName(perfumeName);
  const normalizedImage = normalizePerfumeName(
    path.basename(imageName, path.extname(imageName))
      .replace(/^Rabdan_/, '') // Remove Rabdan_ prefix
  );
  
  // Special handling for specific cases
  if (normalizedPerfume === 'love confession daring') {
    return normalizedImage.includes('love confession');
  }
  
  if (normalizedPerfume === 'room 816') {
    return normalizedImage.includes('room 816');
  }
  
  if (normalizedPerfume === 'chill vibes') {
    return normalizedImage.includes('chill') && normalizedImage.includes('vibes');
  }
  
  // Handle "OUD OF KING" - there might not be images for this perfume
  if (normalizedPerfume === 'oud of king') {
    // We'll check if there are any images that might match
    return false; // No images found for this perfume
  }
  
  // Handle "ROLLING IN THE DEEP" - there might not be images for this perfume
  if (normalizedPerfume === 'rolling in the deep') {
    return false; // No images found for this perfume
  }
  
  // Handle "SAINT PETERSBURG" - there might not be images for this perfume
  if (normalizedPerfume === 'saint petersburg') {
    return false; // No images found for this perfume
  }
  
  // Convert perfume name to image pattern and check if image name contains it
  const imagePattern = perfumeName
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_');
    
  const imageBaseName = path.basename(imageName, path.extname(imageName));
  
  // Check if the image filename contains the perfume name pattern
  if (imageBaseName.includes(imagePattern)) {
    return true;
  }
  
  return false;
}

// Read the processed perfumes data
const perfumesData = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));

// Get all RABDAN perfumes
const rabdanPerfumes = perfumesData.filter((perfume: any) => perfume.brand === 'RABDAN');

console.log(`Found ${rabdanPerfumes.length} RABDAN perfumes`);

// List of RABDAN image files (from our directory listing)
const rabdanImageFiles = [
  'Rabdan_CHILL-VIBES_1.webp',
  'Rabdan_CHILL_-VIBES_2.webp',
  'Rabdan_CIGAR_HONEY_1.webp',
  'Rabdan_CIGAR_HONEY_2.webp',
  'Rabdan_GINGER_TIME_1.webp',
  'Rabdan_GINGER_TIME_2.webp',
  'Rabdan_GWY_1.webp',
  'Rabdan_GWY_2.webp',
  'Rabdan_HIBISCUS_1.webp',
  'Rabdan_HIBISCUS_2.webp',
  'Rabdan_IL_MIO_VIZIATO_1.webp',
  'Rabdan_IL_MIO_VIZIATO_2.webp',
  'Rabdan_IRIS_TABAC_1.webp',
  'Rabdan_IRIS_TABAC_2.webp',
  'Rabdan_LOVE_CONFESSION_1.webp',
  'Rabdan_LOVE_CONFESSION_2.webp',
  'Rabdan_Room_816_1.webp',
  'Rabdan_Room_816_2.webp',
  'Rabdan_SILKY_VANILLA_1.webp',
  'Rabdan_SILKY_VANILLA_2.webp',
  'Rabdan_TEA_TIME_1.webp',
  'Rabdan_TEA_TIME_2.webp',
  'Rabdan_THE_VERT_VETIVER_1.webp',
  'Rabdan_THE_VERT_VETIVER_2.webp',
  'Rabdan_TOBACCO_NIGHT_1.webp',
  'Rabdan_TOBACCO_NIGHT_2.webp',
  'Rabdan_VANILLA_LATTE_1.webp',
  'Rabdan_VANILLA_LATTE_2.webp'
];

console.log(`Found ${rabdanImageFiles.length} RABDAN image files`);

// Create a mapping of perfume to image files (exact matches only)
const perfumeImageMap: { [key: string]: string[] } = {};

// Match RABDAN perfumes with images (exact matches only)
rabdanPerfumes.forEach((perfume: any) => {
  const matches: string[] = [];
  
  rabdanImageFiles.forEach(imageFile => {
    if (isMatch(perfume.name, imageFile)) {
      matches.push(`/assets/perfumes/${imageFile}`);
    }
  });
  
  if (matches.length > 0) {
    // Limit to maximum 2 images per perfume
    const limitedMatches = matches.slice(0, 2);
    perfumeImageMap[perfume.id] = limitedMatches;
  }
});

// Display matches
console.log('\nMatching Results (Exact matches only, max 2 images each):');
Object.keys(perfumeImageMap).forEach(perfumeId => {
  const perfume = rabdanPerfumes.find((p: any) => p.id === perfumeId);
  console.log(`- ${perfume.name}: ${perfumeImageMap[perfumeId].length} images`);
  perfumeImageMap[perfumeId].forEach(image => {
    console.log(`  ${image}`);
  });
});

// Also show perfumes that didn't match
const unmatchedPerfumes = rabdanPerfumes.filter((perfume: any) => !perfumeImageMap[perfume.id]);
if (unmatchedPerfumes.length > 0) {
  console.log('\nUnmatched Perfumes:');
  unmatchedPerfumes.forEach((perfume: any) => {
    console.log(`- ${perfume.name}`);
  });
}

// Update the RABDAN perfumes data with image URLs (exact matches only)
const updatedPerfumes = perfumesData.map((perfume: any) => {
  if (perfume.brand === 'RABDAN' && perfumeImageMap[perfume.id]) {
    const images = perfumeImageMap[perfume.id];
    if (images.length > 0) {
      return {
        ...perfume,
        imageUrl: images[0],
        moodImageUrl: images[0],
        images: JSON.stringify(images)
      };
    }
  }
  return perfume;
});

// Write updated data back to file
fs.writeFileSync('processed-perfumes.json', JSON.stringify(updatedPerfumes, null, 2));

console.log(`\nSuccessfully updated ${Object.keys(perfumeImageMap).length} RABDAN perfumes with exact matching images (max 2 each)`);