const fs = require('fs');
const path = require('path');

// Read the main storage file
const storageFilePath = path.join(__dirname, 'server', 'storage.ts');
let storageContent = fs.readFileSync(storageFilePath, 'utf8');

// Read the fragment files
const fragmentFiles = [
  'server/storage-fixed-chanel.ts',
  'server/storage-fixed-marc.ts'
];

let allProducts = [];

// Extract products from fragment files
fragmentFiles.forEach(fragmentFile => {
  const fullPath = path.join(__dirname, fragmentFile);
  if (fs.existsSync(fullPath)) {
    let fragmentContent = fs.readFileSync(fullPath, 'utf8');
    
    // Remove the fragment files as they're not valid TS files
    fs.unlinkSync(fullPath);
    console.log(`Removed fragment file: ${fragmentFile}`);
  }
});

// Also remove the storage-updated.ts file as it seems to be a duplicate/corrupted version
const storageUpdatedPath = path.join(__dirname, 'server', 'storage-updated.ts');
if (fs.existsSync(storageUpdatedPath)) {
  fs.unlinkSync(storageUpdatedPath);
  console.log('Removed storage-updated.ts');
}

// Fix the main storage.ts file by ensuring all products have the required properties
storageContent = storageContent.replace(/(inStock:\s*true|inStock:\s*false)(\s*\n\s*\},)/g, '$1,\n        topNotes: null,\n        middleNotes: null,\n        baseNotes: null$2');
storageContent = storageContent.replace(/(inStock:\s*true|inStock:\s*false)(\s*\n\s*\}\n\s*\],)/g, '$1,\n        topNotes: null,\n        middleNotes: null,\n        baseNotes: null$2');

// Also fix cases where there might be extra commas
storageContent = storageContent.replace(/(inStock:\s*true|inStock:\s*false),(\s*\n\s*\},)/g, '$1,\n        topNotes: null,\n        middleNotes: null,\n        baseNotes: null$2');
storageContent = storageContent.replace(/(inStock:\s*true|inStock:\s*false),(\s*\n\s*\}\n\s*\],)/g, '$1,\n        topNotes: null,\n        middleNotes: null,\n        baseNotes: null$2');

// Fix any formatting issues with missing commas
storageContent = storageContent.replace(/(baseNotes:\s*null)(\s*\n\s*\},)/g, '$1,$2');
storageContent = storageContent.replace(/(baseNotes:\s*null)(\s*\n\s*\}\n\s*\],)/g, '$1,$2');

// Write the fixed content back to the main storage file
fs.writeFileSync(storageFilePath, storageContent, 'utf8');
console.log('Fixed main storage.ts file');

console.log('Storage files cleanup completed!');