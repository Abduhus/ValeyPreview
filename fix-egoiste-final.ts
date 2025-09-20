import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the processed perfumes file
const processedPerfumes = JSON.parse(fs.readFileSync(path.join(__dirname, 'processed-perfumes.json'), 'utf8'));

// Find the EGOISTE PLATINUM POUR HOMME product
const productIndex = processedPerfumes.findIndex((p: any) => 
  p.name === "EGOISTE PLATINUM POUR HOMME"
);

if (productIndex !== -1) {
  console.log(`Found EGOISTE PLATINUM POUR HOMME product:`);
  console.log(`Current imageUrl: ${processedPerfumes[productIndex].imageUrl}`);
  console.log(`Current moodImageUrl: ${processedPerfumes[productIndex].moodImageUrl}`);
  
  // Get the current images array
  const currentImages = JSON.parse(processedPerfumes[productIndex].images);
  console.log(`Current images count: ${currentImages.length}`);
  
  // Filter out blanche images
  const filteredImages = currentImages.filter((img: string) => 
    !img.includes('blanche')
  );
  
  console.log(`Filtered images count: ${filteredImages.length}`);
  filteredImages.forEach((img: string) => console.log(`  ${img}`));
  
  if (filteredImages.length > 0) {
    // Update the product with filtered images
    processedPerfumes[productIndex].imageUrl = filteredImages[0];
    
    if (filteredImages.length > 1) {
      processedPerfumes[productIndex].moodImageUrl = filteredImages[1];
    } else {
      processedPerfumes[productIndex].moodImageUrl = filteredImages[0];
    }
    
    processedPerfumes[productIndex].images = JSON.stringify(filteredImages);
    
    console.log(`\n✓ Updated images for EGOISTE PLATINUM POUR HOMME`);
    console.log(`New imageUrl: ${processedPerfumes[productIndex].imageUrl}`);
    console.log(`New moodImageUrl: ${processedPerfumes[productIndex].moodImageUrl}`);
    console.log(`New images count: ${filteredImages.length}`);
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