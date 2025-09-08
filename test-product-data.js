// Test script to check product data and image mapping
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the storage file to get product data
const storagePath = path.join(__dirname, 'server', 'storage.ts');
let storageContent = fs.readFileSync(storagePath, 'utf8');

// Extract the initializeProducts function
const initMatch = storageContent.match(/private initializeProducts\(\) \{([\s\S]*?)\n\s*products\.forEach/);
if (!initMatch) {
  console.log('Could not find initializeProducts function');
  process.exit(1);
}

const initContent = initMatch[1];
const productObjects = initContent.split('},').map(p => p.trim()).filter(p => p.includes('id:'));

console.log('Found', productObjects.length, 'product objects');

// Parse product data
const products = [];
for (let i = 0; i < productObjects.length; i++) {
  const productStr = productObjects[i] + (i < productObjects.length - 1 ? '},' : '}');
  
  // Extract key fields using regex
  const idMatch = productStr.match(/id:\s*"([^"]+)"/);
  const nameMatch = productStr.match(/name:\s*"([^"]+)"/);
  const imageUrlMatch = productStr.match(/imageUrl:\s*"([^"]+)"/);
  const moodImageUrlMatch = productStr.match(/moodImageUrl:\s*"([^"]+)"/);
  const imagesMatch = productStr.match(/images:\s*JSON\.stringify\((\[[\s\S]*?\])\)/);
  
  if (idMatch && nameMatch) {
    const product = {
      id: idMatch[1],
      name: nameMatch[1],
      imageUrl: imageUrlMatch ? imageUrlMatch[1] : '',
      moodImageUrl: moodImageUrlMatch ? moodImageUrlMatch[1] : '',
      images: imagesMatch ? JSON.parse(imagesMatch[1]) : []
    };
    products.push(product);
  }
}

// Display first few products to check data
console.log('\nFirst 5 products:');
products.slice(0, 5).forEach((product, index) => {
  console.log(`${index + 1}. ID: ${product.id}, Name: ${product.name}`);
  console.log(`   Main Image: ${product.imageUrl}`);
  console.log(`   Mood Image: ${product.moodImageUrl}`);
  console.log(`   Additional Images: ${product.images.length}`);
  product.images.forEach((img, i) => {
    console.log(`     ${i + 1}. ${img}`);
  });
  console.log('');
});

// Display first few Rabdan products
console.log('\nFirst 5 Rabdan products:');
const rabdanProducts = products.filter(p => parseInt(p.id) >= 9);
rabdanProducts.slice(0, 5).forEach((product, index) => {
  console.log(`${index + 1}. ID: ${product.id}, Name: ${product.name}`);
  console.log(`   Main Image: ${product.imageUrl}`);
  console.log(`   Mood Image: ${product.moodImageUrl}`);
  console.log(`   Additional Images: ${product.images.length}`);
  product.images.forEach((img, i) => {
    console.log(`     ${i + 1}. ${img}`);
  });
  console.log('');
});

// Check if there are any duplicate image paths across different products
console.log('\nChecking for duplicate image paths across products...');

const imageToProductMap = new Map();

products.forEach(product => {
  // Check main image
  if (product.imageUrl) {
    if (imageToProductMap.has(product.imageUrl)) {
      console.log(`⚠️  Duplicate main image: ${product.imageUrl}`);
      console.log(`   Product ${imageToProductMap.get(product.imageUrl).id} (${imageToProductMap.get(product.imageUrl).name})`);
      console.log(`   Product ${product.id} (${product.name})`);
    } else {
      imageToProductMap.set(product.imageUrl, product);
    }
  }
  
  // Check mood image
  if (product.moodImageUrl) {
    if (imageToProductMap.has(product.moodImageUrl)) {
      console.log(`⚠️  Duplicate mood image: ${product.moodImageUrl}`);
      console.log(`   Product ${imageToProductMap.get(product.moodImageUrl).id} (${imageToProductMap.get(product.moodImageUrl).name})`);
      console.log(`   Product ${product.id} (${product.name})`);
    } else {
      imageToProductMap.set(product.moodImageUrl, product);
    }
  }
  
  // Check additional images
  product.images.forEach(image => {
    if (image) {
      if (imageToProductMap.has(image)) {
        console.log(`⚠️  Duplicate additional image: ${image}`);
        console.log(`   Product ${imageToProductMap.get(image).id} (${imageToProductMap.get(image).name})`);
        console.log(`   Product ${product.id} (${product.name})`);
      } else {
        imageToProductMap.set(image, product);
      }
    }
  });
});

console.log('\nDuplicate check complete.');