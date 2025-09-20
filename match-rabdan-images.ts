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
  
  // Exact match
  if (normalizedPerfume === normalizedImage) {
    return true;
  }
  
  // Handle special cases and variations
  const perfumeToImageMap: { [key: string]: string[] } = {
    'chill vibes': ['chill vibes', 'chill v'],
    'cigar honey': ['cigar honey', 'tobacco night'],
    'ginger time': ['ginger time', 'tea time'],
    'gwy': ['gwy'],
    'hibiscus': ['hibiscus'],
    'il mio viziato': ['il mio viziato'],
    'iris tabac': ['iris tabac'],
    'love confession daring': ['love confession'],
    'oud of king': ['oud of king'],
    'rolling in the deep': ['rolling in the deep'],
    'room 816': ['room 816'],
    'saint petersburg': ['saint petersburg'],
    'the vert vetiver': ['the vert vetiver'],
    'vanilla latte': ['vanilla latte', 'silky vanilla']
  };
  
  // Check if there's a mapping for this perfume
  const mappedNames = perfumeToImageMap[normalizedPerfume] || [normalizedPerfume];
  
  for (const mappedName of mappedNames) {
    if (normalizedImage.includes(mappedName) || mappedName.includes(normalizedImage)) {
      return true;
    }
    
    // Handle partial matches with spaces and hyphens
    const mappedNameNoSpaces = mappedName.replace(/\s+/g, '');
    const imageNameNoSpaces = normalizedImage.replace(/\s+/g, '');
    if (imageNameNoSpaces.includes(mappedNameNoSpaces) || mappedNameNoSpaces.includes(imageNameNoSpaces)) {
      return true;
    }
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

// Create a mapping of perfume to image files
const perfumeImageMap: { [key: string]: string[] } = {};

// Match RABDAN perfumes with images
rabdanPerfumes.forEach((perfume: any) => {
  const matches: string[] = [];
  
  rabdanImageFiles.forEach(imageFile => {
    if (isMatch(perfume.name, imageFile)) {
      matches.push(`/assets/perfumes/${imageFile}`);
    }
  });
  
  if (matches.length > 0) {
    perfumeImageMap[perfume.id] = matches;
  }
});

// Display matches
console.log('\nMatching Results:');
Object.keys(perfumeImageMap).forEach(perfumeId => {
  const perfume = rabdanPerfumes.find((p: any) => p.id === perfumeId);
  console.log(`- ${perfume.name}: ${perfumeImageMap[perfumeId].length} images`);
});

// Also show perfumes that didn't match
const unmatchedPerfumes = rabdanPerfumes.filter((perfume: any) => !perfumeImageMap[perfume.id]);
if (unmatchedPerfumes.length > 0) {
  console.log('\nUnmatched Perfumes:');
  unmatchedPerfumes.forEach((perfume: any) => {
    console.log(`- ${perfume.name}`);
  });
}

// Update the RABDAN perfumes data with image URLs
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

console.log(`\nSuccessfully updated ${Object.keys(perfumeImageMap).length} RABDAN perfumes with images`);