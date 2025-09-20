import fs from 'fs';
import path from 'path';

// Read the processed perfumes data
const perfumesData = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));

console.log(`Processing ${perfumesData.length} perfumes`);

// Function to normalize perfume name for matching
function normalizePerfumeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/-+/g, ' ')
    .trim();
}

// Function to convert perfume name to possible image naming patterns
function generateImagePatterns(brand: string, name: string): string[] {
  const patterns: string[] = [];
  
  // Normalize brand and name
  const normalBrand = brand.toLowerCase();
  const normalName = normalizePerfumeName(name);
  
  // Generate various possible patterns
  patterns.push(`${normalBrand} ${normalName}`);
  patterns.push(`${normalName}`);
  patterns.push(`${normalBrand}_${normalName.replace(/\s+/g, '_')}`);
  patterns.push(`${normalName.replace(/\s+/g, '_')}`);
  patterns.push(`${normalBrand}-${normalName.replace(/\s+/g, '-')}`);
  patterns.push(`${normalName.replace(/\s+/g, '-')}`);
  
  // Special handling for specific brands
  if (normalBrand === 'chanel') {
    patterns.push(`chanel ${normalName.replace(/\s+/g, '-')}`);
    patterns.push(`${normalName.replace(/\s+/g, '-')}-eau-de-parfum`);
    patterns.push(`${normalName.replace(/\s+/g, '-')}-eau-de-toilette`);
  }
  
  if (normalBrand === 'rabdan') {
    patterns.push(`rabdan_${normalName.replace(/\s+/g, '_')}`);
    patterns.push(`rabdan-${normalName.replace(/\s+/g, '-')}`);
  }
  
  if (normalBrand === 'signature royale') {
    patterns.push(`signature_royale_${normalName.replace(/\s+/g, '_')}`);
    patterns.push(`signature-royale-${normalName.replace(/\s+/g, '-')}`);
  }
  
  if (normalBrand === 'coreterno') {
    patterns.push(`coreterno_${normalName.replace(/\s+/g, '_')}`);
    patterns.push(`coreterno-${normalName.replace(/\s+/g, '-')}`);
  }
  
  if (normalBrand === 'bohoboco') {
    patterns.push(`bohoboco_${normalName.replace(/\s+/g, '_')}`);
    patterns.push(`bohoboco-${normalName.replace(/\s+/g, '-')}`);
  }
  
  return patterns;
}

// Function to check if an image filename matches a pattern
function matchesPattern(filename: string, patterns: string[]): boolean {
  const normalFilename = filename.toLowerCase().replace(/\.[^/.]+$/, ""); // Remove extension
  
  for (const pattern of patterns) {
    // Check for exact match or partial match
    if (normalFilename.includes(pattern) || pattern.includes(normalFilename)) {
      return true;
    }
    
    // Check for word boundary matches
    const words = pattern.split(/\s+/);
    let allWordsMatch = true;
    
    for (const word of words) {
      if (word.length > 2 && !normalFilename.includes(word)) {
        allWordsMatch = false;
        break;
      }
    }
    
    if (allWordsMatch && words.length > 0) {
      return true;
    }
  }
  
  return false;
}

// Map brand names to folder names (some brands have different folder names)
const brandFolderMap: { [key: string]: string } = {
  'CHANEL': 'chanel',
  'RABDAN': 'Rabdan',
  'SIGNATURE ROYALE': 'SignatureRoyale',
  'CORETERNO': 'Coreterno',
  'BOHOBOCO': 'Bohoboco',
  'BVLGARI': 'bvlgari',
  'ESCENTRIC MOLECULE': 'Escentric',
  'GIARDINI DI TOSCANA': 'Giardini',
  'MARC ANTOINE BARROIS': 'marc antoine',
  'DIO': 'dior',
  'DIPTYQUE': 'diptyque'
};

// Get list of brand folders
const assetsDir = path.join('assets', 'perfumes');
const brandFolders = fs.readdirSync(assetsDir).filter(file => 
  fs.statSync(path.join(assetsDir, file)).isDirectory()
);

console.log(`Found brand folders: ${brandFolders.join(', ')}`);

let updatedPerfumes = 0;

// Process each perfume
for (let i = 0; i < perfumesData.length; i++) {
  const perfume = perfumesData[i];
  const brand = perfume.brand;
  const name = perfume.name;
  
  if (!brand || !name) continue;
  
  // Get the brand folder name
  const brandFolderName = brandFolderMap[brand] || brand.toLowerCase();
  const brandFolderPath = path.join(assetsDir, brandFolderName);
  
  // Check if brand folder exists
  if (!fs.existsSync(brandFolderPath)) {
    // Try to find a matching folder
    const matchingFolder = brandFolders.find(folder => 
      folder.toLowerCase() === brandFolderName.toLowerCase() || 
      folder.toLowerCase().includes(brand.toLowerCase())
    );
    
    if (!matchingFolder) {
      console.log(`  No folder found for brand: ${brand}`);
      continue;
    }
    
    // Use the matching folder
    const brandFolderPath = path.join(assetsDir, matchingFolder);
    
    // Generate image patterns for this perfume
    const patterns = generateImagePatterns(brand, name);
    console.log(`  Checking ${brand} - ${name} with patterns: ${patterns.join(', ')}`);
    
    // Get all image files in the brand folder
    try {
      const imageFiles = fs.readdirSync(brandFolderPath).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp' || ext === '.avif';
      });
      
      // Find matching images
      const matchingImages = imageFiles.filter(file => matchesPattern(file, patterns));
      
      if (matchingImages.length > 0) {
        console.log(`    Found ${matchingImages.length} matching images for ${brand} - ${name}`);
        
        // Create image URLs
        const imageUrls = matchingImages.map(img => `/assets/perfumes/${matchingFolder}/${img}`);
        
        // Update the perfume with matched images
        if (imageUrls.length > 0) {
          perfume.imageUrl = imageUrls[0];
          perfume.moodImageUrl = imageUrls[0];
        }
        
        if (imageUrls.length > 1) {
          perfume.images = JSON.stringify(imageUrls);
        }
        
        updatedPerfumes++;
      }
    } catch (error: any) {
      console.log(`  Error processing ${brand}:`, error.message);
    }
  } else {
    // Brand folder exists, process images
    // Generate image patterns for this perfume
    const patterns = generateImagePatterns(brand, name);
    console.log(`  Checking ${brand} - ${name} with patterns: ${patterns.join(', ')}`);
    
    // Get all image files in the brand folder
    try {
      const imageFiles = fs.readdirSync(brandFolderPath).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp' || ext === '.avif';
      });
      
      // Find matching images
      const matchingImages = imageFiles.filter(file => matchesPattern(file, patterns));
      
      if (matchingImages.length > 0) {
        console.log(`    Found ${matchingImages.length} matching images for ${brand} - ${name}`);
        
        // Create image URLs
        const imageUrls = matchingImages.map(img => `/assets/perfumes/${brandFolderName}/${img}`);
        
        // Update the perfume with matched images
        if (imageUrls.length > 0) {
          perfume.imageUrl = imageUrls[0];
          perfume.moodImageUrl = imageUrls[0];
        }
        
        if (imageUrls.length > 1) {
          perfume.images = JSON.stringify(imageUrls);
        }
        
        updatedPerfumes++;
      }
    } catch (error: any) {
      console.log(`  Error processing ${brand}:`, error.message);
    }
  }
}

// Also check the root assets/perfumes directory for images
console.log('Checking root assets/perfumes directory...');
const rootImageFiles = fs.readdirSync(assetsDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp' || ext === '.avif';
});

for (let i = 0; i < perfumesData.length; i++) {
  const perfume = perfumesData[i];
  const brand = perfume.brand;
  const name = perfume.name;
  
  if (!brand || !name) continue;
  
  // Only process perfumes that don't already have images from brand folders
  if (!perfume.imageUrl || perfume.imageUrl.includes('/perfumes/default')) {
    // Generate image patterns for this perfume
    const patterns = generateImagePatterns(brand, name);
    
    // Find matching images in root directory
    const matchingImages = rootImageFiles.filter(file => matchesPattern(file, patterns));
    
    if (matchingImages.length > 0) {
      console.log(`  Found ${matchingImages.length} matching images in root for ${brand} - ${name}`);
      
      // Create image URLs
      const imageUrls = matchingImages.map(img => `/assets/perfumes/${img}`);
      
      // Update the perfume with matched images
      if (imageUrls.length > 0) {
        perfume.imageUrl = imageUrls[0];
        perfume.moodImageUrl = imageUrls[0];
      }
      
      if (imageUrls.length > 1) {
        perfume.images = JSON.stringify(imageUrls);
      }
      
      updatedPerfumes++;
    }
  }
}

// Save the updated data
fs.writeFileSync('processed-perfumes.json', JSON.stringify(perfumesData, null, 2));
console.log(`\nUpdated ${updatedPerfumes} perfumes with matched images`);