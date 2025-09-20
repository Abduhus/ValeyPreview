import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the processed-perfumes.json file
const filePath = path.join(__dirname, 'processed-perfumes.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Revert image paths from lowercase chanel to uppercase CHANEL
const revertedData = data.map((product: any) => {
  if (product.brand === 'CHANEL') {
    // Revert imageUrl
    if (product.imageUrl) {
      product.imageUrl = product.imageUrl.replace('/assets/perfumes/chanel/', '/assets/perfumes/CHANEL/');
    }
    
    // Revert moodImageUrl
    if (product.moodImageUrl) {
      product.moodImageUrl = product.moodImageUrl.replace('/assets/perfumes/chanel/', '/assets/perfumes/CHANEL/');
    }
    
    // Revert images array
    if (product.images && product.images !== '[]') {
      try {
        const images = JSON.parse(product.images);
        const revertedImages = images.map((img: string) => 
          img.replace('/assets/perfumes/chanel/', '/assets/perfumes/CHANEL/')
        );
        product.images = JSON.stringify(revertedImages);
      } catch (e) {
        console.error('Error parsing images for product:', product.id);
      }
    }
  }
  return product;
});

// Write the reverted data back to the file
fs.writeFileSync(filePath, JSON.stringify(revertedData, null, 2));
console.log('Reverted CHANEL image paths to uppercase in processed-perfumes.json');