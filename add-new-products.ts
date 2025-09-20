import fs from 'fs';

// Read existing processed-perfumes.json
const existingPerfumes = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));

// Read new products
const newProducts = JSON.parse(fs.readFileSync('new-products.json', 'utf-8'));

// Combine existing perfumes with new products
const updatedPerfumes = [...existingPerfumes, ...newProducts];

// Write updated data back to file
fs.writeFileSync('processed-perfumes.json', JSON.stringify(updatedPerfumes, null, 2));

console.log(`Successfully added ${newProducts.length} new products to processed-perfumes.json`);
console.log(`Total products now: ${updatedPerfumes.length}`);