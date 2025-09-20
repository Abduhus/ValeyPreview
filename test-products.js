const fs = require('fs');

// Read the processed-perfumes.json file
const perfumesData = JSON.parse(fs.readFileSync('./processed-perfumes.json', 'utf-8'));

console.log(`Total products: ${perfumesData.length}`);

// Check brands
const brands = [...new Set(perfumesData.map(p => p.brand))];
console.log(`Unique brands: ${brands.length}`);
console.log('Brands:', brands);

// Check Chanel products
const chanelProducts = perfumesData.filter(p => p.brand === 'CHANEL');
console.log(`Chanel products: ${chanelProducts.length}`);

// Check if products have required fields
const productsWithMissingFields = perfumesData.filter(p => !p.id || !p.name || !p.brand);
console.log(`Products with missing fields: ${productsWithMissingFields.length}`);

// Check a sample product
if (perfumesData.length > 0) {
  console.log('Sample product:', JSON.stringify(perfumesData[0], null, 2));
}