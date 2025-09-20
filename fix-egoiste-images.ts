import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the processed perfumes file
const processedPerfumes = JSON.parse(fs.readFileSync(path.join(__dirname, 'processed-perfumes.json'), 'utf8'));

// Find the EGOISTE PLATINUM POUR HOMME product
const egoisteProduct = processedPerfumes.find((p: any) => 
  p.name === "EGOISTE PLATINUM POUR HOMME"
);

if (egoisteProduct) {
  console.log(`Found EGOISTE PLATINUM POUR HOMME product:`);
  console.log(`Current imageUrl: ${egoisteProduct.imageUrl}`);
  console.log(`Current moodImageUrl: ${egoisteProduct.moodImageUrl}`);
  
  // Get all image files in the Chanel directory
  const imageDir = path.join(__dirname, 'assets', 'perfumes', 'CHANEL');
  const imageFiles = fs.readdirSync(imageDir);
  
  // Find allure-homme images (exclude blanche images)
  const allureHommeImages = imageFiles
    .filter((file: string) => 
      file.includes('allure-homme') && !file.includes('blanche')
    )
    .map((file: string) => `/assets/perfumes/CHANEL/${file}`);
  
  console.log(`\nFound ${allureHommeImages.length} allure-homme (non-blanche) images:`);
  allureHommeImages.forEach((img: string) => console.log(`  ${img}`));
  
  if (allureHommeImages.length > 0) {
    const productIndex = processedPerfumes.findIndex((p: any) => p.id === egoisteProduct.id);
    
    if (productIndex !== -1) {
      // Set the first allure-homme image as the main image URL
      processedPerfumes[productIndex].imageUrl = allureHommeImages[0];
      
      // Set the second allure-homme image (if available) as the mood image
      if (allureHommeImages.length > 1) {
        processedPerfumes[productIndex].moodImageUrl = allureHommeImages[1];
      } else {
        processedPerfumes[productIndex].moodImageUrl = allureHommeImages[0];
      }
      
      // Update the images array to only include allure-homme images (no blanche)
      processedPerfumes[productIndex].images = JSON.stringify(allureHommeImages);
      
      console.log(`\n✓ Updated images for EGOISTE PLATINUM POUR HOMME`);
      console.log(`New imageUrl: ${processedPerfumes[productIndex].imageUrl}`);
      console.log(`New moodImageUrl: ${processedPerfumes[productIndex].moodImageUrl}`);
    }
  }
  
  // Save the updated processed-perfumes.json file
  fs.writeFileSync(
    path.join(__dirname, 'processed-perfumes.json'),
    JSON.stringify(processedPerfumes, null, 2),
    'utf8'
  );
  
  console.log(`\nSuccessfully fixed images for EGOISTE PLATINUM POUR HOMME.`);
} else {
  console.log("EGOISTE PLATINUM POUR HOMME product not found.");
}