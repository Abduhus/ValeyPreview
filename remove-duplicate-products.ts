import fs from 'fs';

// Read the processed perfumes data
const perfumesData = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));

console.log(`Original number of products: ${perfumesData.length}`);

// Function to create a unique key for each product
function createProductKey(product: any): string {
  // Create a unique key based on brand, name, volume, and type
  return `${product.brand}|${product.name}|${product.volume}|${product.type}`;
}

// Remove duplicates by keeping track of seen products
const seenProducts = new Set<string>();
const uniquePerfumes: any[] = [];

let duplicateCount = 0;

for (const perfume of perfumesData) {
  const key = createProductKey(perfume);
  
  if (seenProducts.has(key)) {
    // This is a duplicate
    duplicateCount++;
    console.log(`Duplicate found: ${perfume.brand} ${perfume.name} ${perfume.volume} ${perfume.type}`);
  } else {
    // This is a unique product
    seenProducts.add(key);
    uniquePerfumes.push(perfume);
  }
}

console.log(`\nFound ${duplicateCount} duplicate products`);
console.log(`Unique products after deduplication: ${uniquePerfumes.length}`);

// Write the deduplicated data back to file
fs.writeFileSync('processed-perfumes.json', JSON.stringify(uniquePerfumes, null, 2));

console.log('Duplicate products removed successfully!');