import fs from 'fs';
import path from 'path';

// Function to get all image files in a directory recursively
function getAllImageFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllImageFiles(filePath, arrayOfFiles);
    } else if (file.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
      arrayOfFiles.push(filePath);
    }
  });
  
  return arrayOfFiles;
}

// Function to normalize perfume name for matching
function normalizePerfumeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Function to check if a perfume name matches an image filename
function isMatch(perfumeName: string, imageName: string): boolean {
  const normalizedPerfume = normalizePerfumeName(perfumeName);
  const normalizedImage = normalizePerfumeName(
    path.basename(imageName, path.extname(imageName))
  );
  
  // Exact match
  if (normalizedPerfume === normalizedImage) {
    return true;
  }
  
  // Partial match (perfume name contained in image name)
  if (normalizedImage.includes(normalizedPerfume)) {
    return true;
  }
  
  // Partial match (image name contained in perfume name)
  if (normalizedPerfume.includes(normalizedImage)) {
    return true;
  }
  
  return false;
}

// Read the processed perfumes data
const perfumesData = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));

// Get all image files
const imageFiles = getAllImageFiles('assets/perfumes');

console.log(`Found ${imageFiles.length} image files`);
console.log(`Processing ${perfumesData.length} perfumes`);

// Create a mapping of perfume to image files
const perfumeImageMap: { [key: string]: string[] } = {};

// Match perfumes with images
perfumesData.forEach((perfume: any) => {
  const matches: string[] = [];
  
  imageFiles.forEach(imageFile => {
    // Check if the image file path contains the brand name
    const brandInPath = perfume.brand.toLowerCase().replace(/\s+/g, '');
    const imagePath = imageFile.toLowerCase();
    
    // If brand is in the path, check for name match
    if (imagePath.includes(brandInPath) || imagePath.includes(perfume.brand.toLowerCase().replace(/\s+/g, '-'))) {
      if (isMatch(perfume.name, imageFile)) {
        matches.push(imageFile);
      }
    }
    
    // Also check for general name matches
    if (isMatch(perfume.name, imageFile)) {
      // Avoid duplicates
      if (!matches.includes(imageFile)) {
        matches.push(imageFile);
      }
    }
  });
  
  if (matches.length > 0) {
    perfumeImageMap[perfume.id] = matches;
  }
});

// Update the perfumes data with image URLs
const updatedPerfumes = perfumesData.map((perfume: any) => {
  const images = perfumeImageMap[perfume.id] || [];
  
  if (images.length > 0) {
    // Convert absolute paths to relative URLs with correct format
    const relativeImages = images.map(imagePath => {
      // Convert Windows path separators to forward slashes
      let relativePath = imagePath.replace(/\\/g, '/');
      // Ensure the path starts with /assets/perfumes/
      if (!relativePath.startsWith('/assets/perfumes/')) {
        if (relativePath.startsWith('assets/perfumes/')) {
          relativePath = '/' + relativePath;
        } else {
          relativePath = '/assets/perfumes/' + relativePath;
        }
      }
      return relativePath;
    });
    
    return {
      ...perfume,
      imageUrl: relativeImages[0],
      moodImageUrl: relativeImages[0], // For now, use the same image
      images: JSON.stringify(relativeImages)
    };
  }
  
  // If no images found, keep the default ones
  return perfume;
});

// Write updated data back to file
fs.writeFileSync('processed-perfumes.json', JSON.stringify(updatedPerfumes, null, 2));

console.log(`Successfully updated ${Object.keys(perfumeImageMap).length} perfumes with images`);
console.log('Sample matches:');
Object.keys(perfumeImageMap).slice(0, 10).forEach(perfumeId => {
  const perfume = perfumesData.find((p: any) => p.id === perfumeId);
  console.log(`- ${perfume.name} (${perfume.brand}): ${perfumeImageMap[perfumeId].length} images`);
});