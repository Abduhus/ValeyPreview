import fs from 'fs';

// Read both product data files
const processedPerfumesData = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));
const allProductsData = JSON.parse(fs.readFileSync('all-products.json', 'utf-8'));

console.log(`Total products in processed-perfumes.json: ${processedPerfumesData.length}`);
console.log(`Total products in all-products.json: ${allProductsData.length}`);

// Function to create a unique key for each product
function createProductKey(product: any): string {
  // Create a unique key based on brand, name, volume, and type (if available)
  return `${product.brand}|${product.name}|${product.volume}|${product.type || ''}`;
}

// Create a map of all products from processed-perfumes.json
const processedProductsMap = new Map<string, any>();
for (const product of processedPerfumesData) {
  const key = createProductKey(product);
  processedProductsMap.set(key, product);
}

// Check for duplicates between the two files
let crossFileDuplicates = 0;
const uniqueAllProducts: any[] = [];

for (const product of allProductsData) {
  const key = createProductKey(product);
  
  if (processedProductsMap.has(key)) {
    // This product exists in both files
    crossFileDuplicates++;
    console.log(`Cross-file duplicate found: ${product.brand} ${product.name} ${product.volume} ${product.type || ''}`);
  } else {
    // This is a unique product
    uniqueAllProducts.push(product);
  }
}

console.log(`\nFound ${crossFileDuplicates} cross-file duplicate products`);
console.log(`Unique products in all-products.json (excluding duplicates): ${uniqueAllProducts.length}`);

// If there are duplicates, we can merge the files by removing duplicates from all-products.json
if (crossFileDuplicates > 0) {
  console.log('\nUpdating all-products.json to remove cross-file duplicates...');
  fs.writeFileSync('all-products.json', JSON.stringify(uniqueAllProducts, null, 2));
  console.log('Cross-file duplicates removed successfully from all-products.json!');
}