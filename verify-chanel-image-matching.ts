import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the processed-perfumes.json file
const filePath = path.join(__dirname, 'processed-perfumes.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Get all CHANEL products
const chanelProducts = data.filter((product: any) => product.brand === 'CHANEL');

// Get all image files in the chanel directory
const chanelDir = path.join(__dirname, 'assets', 'perfumes', 'chanel');
let imageFiles: string[] = [];
if (fs.existsSync(chanelDir)) {
  imageFiles = fs.readdirSync(chanelDir);
}

console.log(`Found ${chanelProducts.length} CHANEL products and ${imageFiles.length} image files in the chanel directory.`);

// Verify each product's image references
let issues = 0;
chanelProducts.forEach((product: any) => {
  // Check imageUrl
  if (product.imageUrl) {
    const imageName = path.basename(product.imageUrl);
    if (!imageFiles.includes(imageName)) {
      console.log(`❌ Missing image for product ${product.id} (${product.name}): ${imageName}`);
      issues++;
    } else {
      console.log(`✅ Found image for product ${product.id} (${product.name}): ${imageName}`);
    }
  }
  
  // Check moodImageUrl
  if (product.moodImageUrl) {
    const imageName = path.basename(product.moodImageUrl);
    if (!imageFiles.includes(imageName)) {
      console.log(`❌ Missing mood image for product ${product.id} (${product.name}): ${imageName}`);
      issues++;
    } else {
      console.log(`✅ Found mood image for product ${product.id} (${product.name}): ${imageName}`);
    }
  }
  
  // Check images array
  if (product.images && product.images !== '[]') {
    try {
      const images = JSON.parse(product.images);
      images.forEach((img: string) => {
        const imageName = path.basename(img);
        if (!imageFiles.includes(imageName)) {
          console.log(`❌ Missing gallery image for product ${product.id} (${product.name}): ${imageName}`);
          issues++;
        } else {
          console.log(`✅ Found gallery image for product ${product.id} (${product.name}): ${imageName}`);
        }
      });
    } catch (e) {
      console.log(`❌ Error parsing images for product ${product.id} (${product.name})`);
      issues++;
    }
  }
});

console.log(`\nVerification complete. Found ${issues} issues.`);