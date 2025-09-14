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
    const imagesArray = JSON.parse(match[0].replace('images: JSON.stringify(', '').replace(')', ''));
    if (Array.isArray(imagesArray)) {
      imagePaths.push(...imagesArray);
    }
  } catch (e) {
    // Ignore parsing errors
  }
}

console.log(`Found ${imagePaths.length} image paths to verify`);

// Check which paths exist and which don't
const validPaths = [];
const invalidPaths = [];

imagePaths.forEach(imagePath => {
  // Skip empty paths
  if (!imagePath || imagePath.trim() === '') {
    return;
  }
  
  // Create full path
  const fullPath = path.join(__dirname, 'client', 'public', imagePath);
  
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
} else {
  console.log('\n✅ All image paths are valid!');
}

console.log('\nVerification complete.');