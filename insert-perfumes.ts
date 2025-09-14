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

// Insert the perfumes at the correct position
const beforeInsert = storageContent.substring(0, insertPosition);
const afterInsert = storageContent.substring(insertPosition);

// Add the formatted perfumes and a comma at the end
const newStorageContent = beforeInsert + formattedPerfumes + ',\n      ' + afterInsert;

// Write the updated content to a new file
fs.writeFileSync('server/storage-updated.ts', newStorageContent);

console.log('Perfumes have been inserted into storage-updated.ts');