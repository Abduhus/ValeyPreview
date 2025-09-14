const fs = require('fs');

// Read the storage files
const storageFiles = [
  'server/storage.ts',
  'server/storage-updated.ts'
];

storageFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add the missing properties to product objects
    // Look for product objects that have inStock but are missing the notes properties
    content = content.replace(/(inStock:\s*true|inStock:\s*false)(\s*\n\s*\},)/g, '$1,\n        topNotes: null,\n        middleNotes: null,\n        baseNotes: null$2');
    content = content.replace(/(inStock:\s*true|inStock:\s*false)(\s*\n\s*\}\n\s*\],)/g, '$1,\n        topNotes: null,\n        middleNotes: null,\n        baseNotes: null$2');
    
    // Also fix cases where there might be extra commas
    content = content.replace(/(inStock:\s*true|inStock:\s*false),(\s*\n\s*\},)/g, '$1,\n        topNotes: null,\n        middleNotes: null,\n        baseNotes: null$2');
    content = content.replace(/(inStock:\s*true|inStock:\s*false),(\s*\n\s*\}\n\s*\],)/g, '$1,\n        topNotes: null,\n        middleNotes: null,\n        baseNotes: null$2');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed ${file}`);
  }
});