import fs from 'fs';
import path from 'path';

// Read the formatted perfumes data
const formattedPerfumes = fs.readFileSync('formatted-perfumes-corrected.txt', 'utf-8');

// Read the original storage file
let storageContent = fs.readFileSync('server/storage.ts', 'utf-8');

// Find the position to insert the perfumes (before the comment about new perfumes)
const insertPosition = storageContent.indexOf('// NEW PERFUMES ADDED - CHANEL, VERSACE, XERJOFF (182 products)');

if (insertPosition === -1) {
  console.error('Could not find the insertion point in storage.ts');
  process.exit(1);
}

// Find the end of the products array (the closing bracket before the forEach)
const productsEndPosition = storageContent.lastIndexOf('];', insertPosition);

if (productsEndPosition === -1) {
  console.error('Could not find the end of products array in storage.ts');
  process.exit(1);
}

// Insert the perfumes at the correct position (before the closing bracket)
const beforeInsert = storageContent.substring(0, productsEndPosition);
const afterInsert = storageContent.substring(productsEndPosition);

// Add the formatted perfumes with proper comma separation
const newStorageContent = beforeInsert + ',\n' + formattedPerfumes.trim() + '\n    ' + afterInsert;

// Write the updated content to the storage file
fs.writeFileSync('server/storage.ts', newStorageContent);

console.log('Perfumes have been inserted into storage.ts');