import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the processed perfumes file
const processedPerfumes = JSON.parse(fs.readFileSync(path.join(__dirname, 'processed-perfumes.json'), 'utf8'));

// Get all Chanel products
const chanelPerfumes = processedPerfumes.filter((p: any) => p.brand === 'CHANEL');

// Get all image files in the Chanel directory
const imageDir = path.join(__dirname, 'assets', 'perfumes', 'CHANEL');
const imageFiles = fs.readdirSync(imageDir);

// Find products that should specifically use "blanche" images
const blancheProducts = chanelPerfumes.filter((p: any) => 
  p.name.includes('BLANCHE') || p.fullName.includes('BLANCHE')
);

console.log(`Found ${blancheProducts.length} products that should use "blanche" images:`);

const updatedPerfumes = [...processedPerfumes];
let fixedProducts = 0;

blancheProducts.forEach((perfume: any) => {
  console.log(`\nProduct: ${perfume.name}`);
  console.log(`Full name: ${perfume.fullName}`);
  
  // Find blanche-specific images
  const blancheImages = imageFiles.filter((file: string) => 
    file.includes('blanche')
  ).map((file: string) => `/assets/perfumes/CHANEL/${file}`);
  
  console.log(`Found ${blancheImages.length} blanche images:`);
  blancheImages.forEach((img: string) => console.log(`  ${img}`));
  
  if (blancheImages.length > 0) {
    const productIndex = updatedPerfumes.findIndex((p: any) => p.id === perfume.id);
    
    if (productIndex !== -1) {
      // Set the first blanche image as the main image URL
      updatedPerfumes[productIndex].imageUrl = blancheImages[0];
      
      // Set the second blanche image (if available) as the mood image
      if (blancheImages.length > 1) {
        updatedPerfumes[productIndex].moodImageUrl = blancheImages[1];
      } else {
        updatedPerfumes[productIndex].moodImageUrl = blancheImages[0];
      }
      
      // Update the images array to only include blanche images
      updatedPerfumes[productIndex].images = JSON.stringify(blancheImages);
      
      fixedProducts++;
      console.log(`✓ Updated images for ${perfume.name}`);
    }
  }
});

// Save the updated processed-perfumes.json file
fs.writeFileSync(
  path.join(__dirname, 'processed-perfumes.json'),
  JSON.stringify(updatedPerfumes, null, 2),
  'utf8'
);

console.log(`\nSuccessfully fixed images for ${fixedProducts} products.`);