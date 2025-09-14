const fs = require('fs');
const path = require('path');

// Read the storage file
const storagePath = path.join(__dirname, 'server', 'storage.ts');
const storageContent = fs.readFileSync(storagePath, 'utf8');

// Read existing fragrance notes data
const fragranceData = require('./fragrance-notes-data.json');

// Extract all products from storage
const productRegex = /{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",[\s\S]*?brand:\s*"([^"]+)"[\s\S]*?}/g;
const products = [];
let match;

while ((match = productRegex.exec(storageContent)) !== null) {
  products.push({
    id: match[1],
    name: match[2],
    brand: match[3]
  });
}

// Find products that already have fragrance notes in storage
const productsWithNotes = [];
const productsWithoutNotes = [];

products.forEach(product => {
  const hasNotesRegex = new RegExp(
    `id:\\s*"${product.id}"[\\s\\S]*?(topNotes:|middleNotes:|baseNotes:)`,
    'i'
  );
  
  if (hasNotesRegex.test(storageContent)) {
    productsWithNotes.push(product);
  } else {
    productsWithoutNotes.push(product);
  }
});

console.log('=== FRAGRANCE NOTES ANALYSIS ===\n');

console.log(`📊 TOTAL PRODUCTS: ${products.length}`);
console.log(`✅ PRODUCTS WITH AUTHENTIC NOTES: ${productsWithNotes.length}`);
console.log(`❌ PRODUCTS NEEDING AUTHENTIC NOTES: ${productsWithoutNotes.length}\n`);

console.log('=== PRODUCTS WITH AUTHENTIC NOTES ===');
productsWithNotes.forEach(product => {
  console.log(`  • ${product.name} (ID: ${product.id}, Brand: ${product.brand})`);
});

console.log('\n=== PRODUCTS NEEDING AUTHENTIC NOTES ===');
productsWithoutNotes.forEach(product => {
  console.log(`  • ${product.name} (ID: ${product.id}, Brand: ${product.brand})`);
});

// Create a comprehensive list of products needing notes
const productsNeedingNotes = productsWithoutNotes.map(product => ({
  id: product.id,
  name: product.name,
  brand: product.brand,
  fragranticaUrl: "" // To be filled in
}));

// Save to a JSON file for future reference
const outputPath = path.join(__dirname, 'products-needing-fragrance-notes.json');
fs.writeFileSync(outputPath, JSON.stringify({ products: productsNeedingNotes }, null, 2));
console.log(`\n📋 List of products needing fragrance notes saved to: ${outputPath}`);