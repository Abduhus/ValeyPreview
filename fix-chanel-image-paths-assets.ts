import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the processed-perfumes.json file
const filePath = path.join(__dirname, 'processed-perfumes.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Fix image paths for CHANEL products to point to the assets directory
const fixedData = data.map((product: any) => {
  if (product.brand === 'CHANEL') {
    // Fix imageUrl
    if (product.imageUrl) {
      product.imageUrl = product.imageUrl.replace('/dist/public/perfumes/chanel/', '/assets/perfumes/CHANEL/');
    }
    
    // Fix moodImageUrl
    if (product.moodImageUrl) {
      product.moodImageUrl = product.moodImageUrl.replace('/dist/public/perfumes/chanel/', '/assets/perfumes/CHANEL/');
    }
    
    // Fix images array
    if (product.images && product.images !== '[]') {
      try {
        const images = JSON.parse(product.images);
        const fixedImages = images.map((img: string) => 
          img.replace('/dist/public/perfumes/chanel/', '/assets/perfumes/CHANEL/')
        );
        product.images = JSON.stringify(fixedImages);
      } catch (e) {
        console.error('Error parsing images for product:', product.id);
      }
    }
  }
  return product;
});

// Write the fixed data back to the file
fs.writeFileSync(filePath, JSON.stringify(fixedData, null, 2));
console.log('Fixed CHANEL image paths in processed-perfumes.json to point to the assets directory');