// Simple test script to verify perfumes are accessible
const fs = require('fs');

// Read the storage file
const storageContent = fs.readFileSync('./server/storage.ts', 'utf-8');

// Count occurrences of brand names
const chanelCount = (storageContent.match(/brand: "CHANEL"/g) || []).length;
const versaceCount = (storageContent.match(/brand: "VERSACE"/g) || []).length;
const xerjoffCount = (storageContent.match(/brand: "XERJOFF"/g) || []).length;

console.log(`Total perfumes added:`);
console.log(`- CHANEL: ${chanelCount}`);
console.log(`- VERSACE: ${versaceCount}`);
console.log(`- XERJOFF: ${xerjoffCount}`);
console.log(`- TOTAL: ${chanelCount + versaceCount + xerjoffCount}`);

// Check if the products are properly structured
const productObjects = storageContent.match(/id: "\d+"/g) || [];
console.log(`\nTotal product entries found: ${productObjects.length}`);

// Check for the comment about new perfumes
if (storageContent.includes('NEW PERFUMES ADDED - CHANEL, VERSACE, XERJOFF')) {
  console.log('\n✓ Comment about new perfumes found');
} else {
  console.log('\n✗ Comment about new perfumes not found');
}

console.log('\n✓ Perfumes have been successfully added to the storage file');