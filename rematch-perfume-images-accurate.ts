import fs from 'fs';
import path from 'path';

// Function to get all image files in a directory recursively
function getAllImageFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  try {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      try {
        if (fs.statSync(filePath).isDirectory()) {
          arrayOfFiles = getAllImageFiles(filePath, arrayOfFiles);
        } else if (file.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
          arrayOfFiles.push(filePath);
        }
      } catch (error) {
        console.log(`Warning: Could not access ${filePath}`);
      }
    });
  } catch (error) {
    console.log(`Warning: Could not read directory ${dirPath}`);
  }
  
  return arrayOfFiles;
}

// Function to normalize perfume name for matching
function normalizePerfumeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\-+/g, ' ')
    .trim();
}

// Function to create a more specific perfume name for matching
function createPerfumeMatchKey(brand: string, name: string): string {
  // Combine brand and name for more precise matching
  const combined = `${brand} ${name}`;
  return normalizePerfumeName(combined);
}

// Function to check if a perfume matches an image filename
function isMatch(perfumeKey: string, imageName: string): boolean {
  const normalizedImage = normalizePerfumeName(
    path.basename(imageName, path.extname(imageName))
  );
  
  // Exact match
  if (perfumeKey === normalizedImage) {
    return true;
  }
  
  // Partial match (perfume key contained in image name)
  if (normalizedImage.includes(perfumeKey)) {
    return true;
  }
  
  // Partial match (image name contained in perfume key)
  if (perfumeKey.includes(normalizedImage)) {
    return true;
  }
  
  return false;
}

// Function to check if image belongs to a specific brand folder
function isBrandFolderMatch(imagePath: string, brandFolder: string): boolean {
  const normalizedImagePath = imagePath.toLowerCase();
  const normalizedBrandFolder = brandFolder.toLowerCase();
  
  // Check if the image path contains the brand folder name
  return normalizedImagePath.includes(normalizedBrandFolder);
}

// Function to get brand folder name from image path
function getBrandFolderFromPath(imagePath: string): string | null {
  const parts = imagePath.split(path.sep);
  const perfumesIndex = parts.indexOf('perfumes');
  
  if (perfumesIndex !== -1 && perfumesIndex + 1 < parts.length) {
    return parts[perfumesIndex + 1];
  }
  
  return null;
}

// Read the processed perfumes data
let perfumesData: any[] = [];
try {
  perfumesData = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));
  console.log(`Loaded ${perfumesData.length} perfumes from processed-perfumes.json`);
} catch (error) {
  console.error('Error reading processed-perfumes.json:', error);
  process.exit(1);
}

// Get all image files from the assets/perfumes directory
const imageFiles = getAllImageFiles('assets/perfumes');
console.log(`Found ${imageFiles.length} image files in assets/perfumes`);

// Create a mapping of perfume to image files
const perfumeImageMap: { [key: string]: string[] } = {};

// Create reverse mapping for debugging
const imagePerfumeMap: { [key: string]: string[] } = {};

// Create brand to folder mapping for better matching
const brandFolderMap: { [key: string]: string } = {
  'CHANEL': 'chanel',
  'VERSACE': 'versace',
  'BVLGARI': 'bvlgari',
  'RABDAN': 'rabdan',
  'SIGNATURE ROYALE': 'signature royale',
  'PURE ESSENCE': 'pure essence',
  'CORETERNO': 'coreterno',
  'BOHOBOCO': 'bohoboco',
  'ESCENTRIC MOLECULE': 'escentric',
  'DIPTYQUE': 'diptyque',
  'GIARDINI DI TOSCANA': 'giardini',
  'CHRISTIAN DIOR': 'dior',
  'DIOR': 'dior',
  'XERJOFF': 'xerjoff'
};

// Match perfumes with images
console.log('Matching perfumes with images...');
perfumesData.forEach((perfume: any, index: number) => {
  // Show progress every 50 perfumes
  if (index % 50 === 0) {
    console.log(`Processing perfume ${index + 1}/${perfumesData.length}: ${perfume.name} (${perfume.brand})`);
  }
  
  const matches: string[] = [];
  const perfumeKey = createPerfumeMatchKey(perfume.brand, perfume.name);
  
  // Get the expected brand folder for this perfume
  const brandFolder = brandFolderMap[perfume.brand.toUpperCase()] || perfume.brand.toLowerCase();
  
  imageFiles.forEach(imageFile => {
    // Check if the image belongs to the correct brand folder
    if (isBrandFolderMatch(imageFile, brandFolder)) {
      // Check if the perfume name matches the image filename
      if (isMatch(perfumeKey, imageFile)) {
        matches.push(imageFile);
        
        // Track which perfumes match each image (for debugging)
        if (!imagePerfumeMap[imageFile]) {
          imagePerfumeMap[imageFile] = [];
        }
        imagePerfumeMap[imageFile].push(perfume.id);
      }
    }
  });
  
  if (matches.length > 0) {
    perfumeImageMap[perfume.id] = matches;
  }
});

console.log(`\nMatch Results:`);
console.log(`- ${Object.keys(perfumeImageMap).length} perfumes matched with images`);
console.log(`- ${imageFiles.length - Object.keys(imagePerfumeMap).length} images not matched to any perfume`);

// Show some sample matches
console.log('\nSample matches:');
Object.keys(perfumeImageMap).slice(0, 15).forEach(perfumeId => {
  const perfume = perfumesData.find((p: any) => p.id === perfumeId);
  console.log(`- ${perfume.name} (${perfume.brand}): ${perfumeImageMap[perfumeId].length} images`);
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
          // Find the perfumes directory in the path
          const perfumesIndex = relativePath.indexOf('assets/perfumes/');
          if (perfumesIndex !== -1) {
            relativePath = '/' + relativePath.substring(perfumesIndex);
          } else {
            relativePath = '/assets/perfumes/' + path.basename(relativePath);
          }
        }
      }
      
      return relativePath;
    });
    
    // For specific brands, ensure we're using the correct directory structure
    if (perfume.brand === 'RABDAN') {
      const rabdanImages = relativeImages.map(imgPath => {
        // Ensure Rabdan images use the correct path format
        if (imgPath.includes('Rabdan_') || imgPath.includes('rabdan')) {
          return imgPath.replace(/.*assets\/perfumes\//, '/assets/perfumes/Rabdan/');
        }
        return imgPath;
      });
      return {
        ...perfume,
        imageUrl: rabdanImages[0],
        moodImageUrl: rabdanImages.length > 1 ? rabdanImages[1] : rabdanImages[0],
        images: JSON.stringify(rabdanImages)
      };
    }
    
    return {
      ...perfume,
      imageUrl: relativeImages[0],
      moodImageUrl: relativeImages.length > 1 ? relativeImages[1] : relativeImages[0],
      images: JSON.stringify(relativeImages)
    };
  }
  
  // If no images found, keep the existing ones or use defaults
  return perfume;
});

// Write updated data back to file
try {
  fs.writeFileSync('processed-perfumes.json', JSON.stringify(updatedPerfumes, null, 2));
  console.log('\nSuccessfully updated processed-perfumes.json with image information');
} catch (error) {
  console.error('Error writing to processed-perfumes.json:', error);
  process.exit(1);
}

// Generate a report of unmatched images
const unmatchedImages = imageFiles.filter(imageFile => !imagePerfumeMap[imageFile]);
if (unmatchedImages.length > 0) {
  console.log(`\n${unmatchedImages.length} unmatched images:`);
  unmatchedImages.slice(0, 15).forEach(image => {
    console.log(`- ${image}`);
  });
  if (unmatchedImages.length > 15) {
    console.log(`... and ${unmatchedImages.length - 15} more`);
  }
}

// Generate a report of perfumes without images
const perfumesWithoutImages = perfumesData.filter((perfume: any) => !perfumeImageMap[perfume.id]);
if (perfumesWithoutImages.length > 0) {
  console.log(`\n${perfumesWithoutImages.length} perfumes without images:`);
  perfumesWithoutImages.slice(0, 15).forEach((perfume: any) => {
    console.log(`- ${perfume.name} (${perfume.brand})`);
  });
  if (perfumesWithoutImages.length > 15) {
    console.log(`... and ${perfumesWithoutImages.length - 15} more`);
  }
}

console.log('\nImage rematching complete!');