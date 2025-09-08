import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the storage file to get product data
const storagePath = path.join(__dirname, 'server', 'storage.ts');
const storageContent = fs.readFileSync(storagePath, 'utf8');

// Extract product data from storage file
const productMatches = storageContent.match(/const products: Product\[] = \[([\s\S]*?)\];/);
if (!productMatches) {
  console.log('Could not find products array in storage.ts');
  process.exit(1);
}

const productsArrayContent = productMatches[1];

// Extract individual product objects
const productObjects = productsArrayContent.split('},').map(p => p.trim()).filter(p => p.length > 0);

// Parse product data
const products = [];
for (let i = 0; i < productObjects.length; i++) {
  const productStr = productObjects[i] + (i < productObjects.length - 1 ? '}' : '');
  
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

console.log('Found', products.length, 'products');

// Check image files
const assetsDir = path.join(__dirname, 'assets', 'perfumes');
const imageFiles = fs.readdirSync(assetsDir);

console.log('\nChecking image references...\n');

let mismatchCount = 0;
let matchCount = 0;

products.forEach(product => {
  // Check main image
  if (product.imageUrl && !product.imageUrl.startsWith('http')) {
    const imagePath = path.join(assetsDir, path.basename(product.imageUrl));
    if (fs.existsSync(imagePath)) {
      console.log(`✓ Product ${product.id} (${product.name}): Main image exists`);
      matchCount++;
    } else {
      console.log(`✗ Product ${product.id} (${product.name}): Main image missing - ${product.imageUrl}`);
      mismatchCount++;
    }
  }
  
  // Check mood image
  if (product.moodImageUrl && !product.moodImageUrl.startsWith('http')) {
    const imagePath = path.join(assetsDir, path.basename(product.moodImageUrl));
    if (fs.existsSync(imagePath)) {
      console.log(`✓ Product ${product.id} (${product.name}): Mood image exists`);
      matchCount++;
    } else {
      console.log(`✗ Product ${product.id} (${product.name}): Mood image missing - ${product.moodImageUrl}`);
      mismatchCount++;
    }
  }
  
  // Check additional images
  product.images.forEach((image, index) => {
    if (image && !image.startsWith('http')) {
      const imagePath = path.join(assetsDir, path.basename(image));
      if (fs.existsSync(imagePath)) {
        console.log(`✓ Product ${product.id} (${product.name}): Additional image ${index + 1} exists`);
        matchCount++;
      } else {
        console.log(`✗ Product ${product.id} (${product.name}): Additional image ${index + 1} missing - ${image}`);
        mismatchCount++;
      }
    }
  });
});

console.log(`\nSummary: ${matchCount} images found, ${mismatchCount} images missing`);

// Check if all Rabdan products have matching images
console.log('\nRabdan Products Check:');
const rabdanProducts = products.filter(p => parseInt(p.id) >= 9 && parseInt(p.id) <= 21);
rabdanProducts.forEach(product => {
  console.log(`\nProduct ${product.id}: ${product.name}`);
  console.log(`  Main image: ${product.imageUrl}`);
  console.log(`  Mood image: ${product.moodImageUrl}`);
  console.log(`  Additional images: ${product.images.length}`);
  
  // Check if all images exist
  const allImages = [product.imageUrl, product.moodImageUrl, ...product.images].filter(img => img && !img.startsWith('http'));
  let allExist = true;
  allImages.forEach(image => {
    const imagePath = path.join(assetsDir, path.basename(image));
    if (!fs.existsSync(imagePath)) {
      allExist = false;
    }
  });
  
  console.log(`  All images exist: ${allExist ? 'YES' : 'NO'}`);
});