const fs = require('fs');

// Read the storage file
const storageFilePath = 'server/storage.ts';
let content = fs.readFileSync(storageFilePath, 'utf8');

// Add the missing properties to all product objects
// Look for product objects that have inStock but are missing the notes properties
content = content.replace(/(inStock:\s*true|inStock:\s*false)(\s*\n\s*\},)/g, '$1,\n        topNotes: null,\n        middleNotes: null,\n        baseNotes: null$2');
content = content.replace(/(inStock:\s*true|inStock:\s*false)(\s*\n\s*\}\n\s*\],)/g, '$1,\n        topNotes: null,\n        middleNotes: null,\n        baseNotes: null$2');

// Also fix cases where there might be extra commas
content = content.replace(/(inStock:\s*true|inStock:\s*false),(\s*\n\s*\},)/g, '$1,\n        topNotes: null,\n        middleNotes: null,\n        baseNotes: null$2');
content = content.replace(/(inStock:\s*true|inStock:\s*false),(\s*\n\s*\}\n\s*\],)/g, '$1,\n        topNotes: null,\n        middleNotes: null,\n        baseNotes: null$2');

// Fix any formatting issues with missing commas
content = content.replace(/(baseNotes:\s*null)(\s*\n\s*\},)/g, '$1,$2');
content = content.replace(/(baseNotes:\s*null)(\s*\n\s*\}\n\s*\],)/g, '$1,$2');

// Write the fixed content back to the file
fs.writeFileSync(storageFilePath, content, 'utf8');
console.log('Fixed storage.ts file');