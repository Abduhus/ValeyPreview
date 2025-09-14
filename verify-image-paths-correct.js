import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the storage file
const storagePath = path.join(__dirname, 'server', 'storage.ts');
const storageContent = fs.readFileSync(storagePath, 'utf8');

console.log('Verifying image paths in storage...\n');

// Extract all image paths from the storage file
const imagePathRegex = /imageUrl:\s*"([^"]*)"/g;
const moodImagePathRegex = /moodImageUrl:\s*"([^"]*)"/g;
const additionalImagesRegex = /images:\s*JSON\.stringify\($$[^$$]*$$/g;

const imagePaths = [];
let match;

// Extract imageUrl paths
while ((match = imagePathRegex.exec(storageContent)) !== null) {
  imagePaths.push(match[1]);
}

// Extract moodImageUrl paths
while ((match = moodImagePathRegex.exec(storageContent)) !== null) {
  imagePaths.push(match[1]);
}

// Extract additional image paths
while ((match = additionalImagesRegex.exec(storageContent)) !== null) {
  try {
    // Extract the array content
    const arrayContent = match[0].replace('images: JSON.stringify(', '').replace(')', '');
    // Parse the array
    const imagesArray = JSON.parse(arrayContent);
    if (Array.isArray(imagesArray)) {
      imagePaths.push(...imagesArray);
    }
  } catch (e) {
    // If parsing fails, try to extract paths with a simpler regex
    const simpleRegex = /"([^"]*?\.(?:jpg|jpeg|png|webp|avif))"/g;
    let simpleMatch;
    while ((simpleMatch = simpleRegex.exec(arrayContent)) !== null) {
      imagePaths.push(simpleMatch[1]);
    }
  }
}

console.log(`Found ${imagePaths.length} image paths to verify`);

// Filter out external URLs and keep only local paths
const localPaths = imagePaths.filter(path => 
  path && 
  !path.startsWith('http') && 
  (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.webp') || path.endsWith('.avif'))
);

console.log(`Found ${localPaths.length} local image paths to verify`);

// Check which paths exist and which don't
const validPaths = [];
const invalidPaths = [];

localPaths.forEach(imagePath => {
  // Skip empty paths
  if (!imagePath || imagePath.trim() === '') {
    return;
  }
  
  // Create full path - images are in assets/perfumes
  const fullPath = path.join(__dirname, 'assets', imagePath.substring(1)); // Remove leading slash
  
  // Check if file exists
  if (fs.existsSync(fullPath)) {
    validPaths.push(imagePath);
  } else {
    invalidPaths.push(imagePath);
  }
});

console.log(`\nValid image paths: ${validPaths.length}`);
console.log(`Invalid image paths: ${invalidPaths.length}`);

if (invalidPaths.length > 0) {
  console.log('\nInvalid image paths:');
  invalidPaths.forEach(path => console.log(`  - ${path}`));
  
  // Show some examples of valid paths for comparison
  console.log('\nSome valid paths for comparison:');
  validPaths.slice(0, 5).forEach(path => console.log(`  - ${path}`));
} else {
  console.log('\n✅ All local image paths are valid!');
}

console.log('\nVerification complete.');