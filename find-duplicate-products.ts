import fs from 'fs';

// Read the processed perfumes data
const perfumesData = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));

console.log(`Total products in processed-perfumes.json: ${perfumesData.length}`);

// Function to create a unique key for each product
function createProductKey(product: any): string {
  // Create a unique key based on brand, name, volume, and type
  return `${product.brand}|${product.name}|${product.volume}|${product.type || ''}`;
}

// Count occurrences of each product key
const productCounts = new Map<string, number>();
const productDetails = new Map<string, any[]>();

for (const product of perfumesData) {
  const key = createProductKey(product);
  
  if (productCounts.has(key)) {
    productCounts.set(key, productCounts.get(key)! + 1);
    productDetails.get(key)!.push(product);
  } else {
    productCounts.set(key, 1);
    productDetails.set(key, [product]);
  }
}

// Find duplicates
const duplicates = Array.from(productCounts.entries()).filter(([key, count]) => count > 1);

console.log(`\nFound ${duplicates.length} unique product types with duplicates:`);

// Display duplicates with details
for (const [key, count] of duplicates) {
  console.log(`\n${key} - ${count} duplicates:`);
  const products = productDetails.get(key)!;
  products.forEach((product, index) => {
    console.log(`  ${index + 1}. ID: ${product.id} - ${product.fullName || 'No full name'}`);
  });
}

// Create a map of unique products (keeping only the first occurrence)
const uniqueProductsMap = new Map<string, any>();
const duplicatesToRemove: string[] = [];

for (const product of perfumesData) {
  const key = createProductKey(product);
  
  if (!uniqueProductsMap.has(key)) {
    uniqueProductsMap.set(key, product);
  } else {
    duplicatesToRemove.push(product.id);
  }
}

console.log(`\nTotal duplicate products to remove: ${duplicatesToRemove.length}`);

// Create array of unique products
const uniqueProducts = Array.from(uniqueProductsMap.values());

console.log(`\nUnique products after deduplication: ${uniqueProducts.length}`);

// Write the deduplicated data back to file
fs.writeFileSync('processed-perfumes.json', JSON.stringify(uniqueProducts, null, 2));

console.log('\nDuplicate products removed successfully from processed-perfumes.json!');

// Also update all-products.json if it exists and has duplicates
if (fs.existsSync('all-products.json')) {
  const allProductsData = JSON.parse(fs.readFileSync('all-products.json', 'utf-8'));
  
  console.log(`\nChecking all-products.json: ${allProductsData.length} products`);
  
  // Create a set of product keys from processed-perfumes.json to check for cross-file duplicates
  const processedProductKeys = new Set(Array.from(uniqueProductsMap.keys()));
  
  const uniqueAllProducts: any[] = [];
  let crossFileDuplicates = 0;
  
  for (const product of allProductsData) {
    const key = createProductKey(product);
    
    // Check if this product already exists in processed-perfumes.json
    if (processedProductKeys.has(key)) {
      crossFileDuplicates++;
      console.log(`Cross-file duplicate found: ${product.brand} ${product.name} ${product.volume} ${product.type || ''}`);
    } else {
      uniqueAllProducts.push(product);
    }
  }
  
  console.log(`Found ${crossFileDuplicates} cross-file duplicates`);
  console.log(`Unique products in all-products.json after deduplication: ${uniqueAllProducts.length}`);
  
  // Write the deduplicated data back to file
  fs.writeFileSync('all-products.json', JSON.stringify(uniqueAllProducts, null, 2));
  
  console.log('Cross-file duplicates removed successfully from all-products.json!');
}