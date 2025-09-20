import fs from 'fs';

// Read the all-products.json data
const allProductsData = JSON.parse(fs.readFileSync('all-products.json', 'utf-8'));

console.log(`Original number of products in all-products.json: ${allProductsData.length}`);

// Function to create a unique key for each product
function createProductKey(product: any): string {
  // Create a unique key based on brand, name, volume, and type (if available)
  return `${product.brand}|${product.name}|${product.volume}|${product.type || ''}`;
}

// Remove duplicates by keeping track of seen products
const seenProducts = new Set<string>();
const uniqueProducts: any[] = [];

let duplicateCount = 0;

for (const product of allProductsData) {
  const key = createProductKey(product);
  
  if (seenProducts.has(key)) {
    // This is a duplicate
    duplicateCount++;
    console.log(`Duplicate found: ${product.brand} ${product.name} ${product.volume} ${product.type || ''}`);
  } else {
    // This is a unique product
    seenProducts.add(key);
    uniqueProducts.push(product);
  }
}

console.log(`\nFound ${duplicateCount} duplicate products in all-products.json`);
console.log(`Unique products after deduplication: ${uniqueProducts.length}`);

// Write the deduplicated data back to file
fs.writeFileSync('all-products.json', JSON.stringify(uniqueProducts, null, 2));

console.log('Duplicate products removed successfully from all-products.json!');