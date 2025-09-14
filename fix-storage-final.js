const fs = require('fs');
const path = require('path');

// Function to fix storage files
function fixStorageFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File ${filePath} does not exist`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if this is a JSON file that should be a TS file
  if (path.extname(filePath) === '.json' && content.includes('id:') && content.includes('name:')) {
    // This is actually a JS/TS file with wrong extension
    console.log(`Renaming ${filePath} to .ts extension`);
    const newFilePath = filePath.replace('.json', '.ts');
    fs.renameSync(filePath, newFilePath);
    filePath = newFilePath;
    content = fs.readFileSync(filePath, 'utf8');
  }
  
  // Fix the product objects by ensuring they have all required properties
  // Look for product objects that have inStock but might be missing the notes properties
  content = content.replace(/(inStock:\s*true|inStock:\s*false)(\s*\n\s*\},)/g, '$1,\n        topNotes: null,\n        middleNotes: null,\n        baseNotes: null$2');
  content = content.replace(/(inStock:\s*true|inStock:\s*false)(\s*\n\s*\}\n\s*\],)/g, '$1,\n        topNotes: null,\n        middleNotes: null,\n        baseNotes: null$2');
  
  // Also fix cases where there might be extra commas
  content = content.replace(/(inStock:\s*true|inStock:\s*false),(\s*\n\s*\},)/g, '$1,\n        topNotes: null,\n        middleNotes: null,\n        baseNotes: null$2');
  content = content.replace(/(inStock:\s*true|inStock:\s*false),(\s*\n\s*\}\n\s*\],)/g, '$1,\n        topNotes: null,\n        middleNotes: null,\n        baseNotes: null$2');
  
  // Fix any formatting issues with missing commas
  content = content.replace(/(baseNotes:\s*null)(\s*\n\s*\},)/g, '$1,$2');
  content = content.replace(/(baseNotes:\s*null)(\s*\n\s*\}\n\s*\],)/g, '$1,$2');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${filePath}`);
}

// Fix all storage files
const storageFiles = [
  'server/storage.ts',
  'server/storage-updated.ts',
  'server/storage-fixed-chanel.json',
  'server/storage-fixed-marc.json'
];

storageFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  fixStorageFile(fullPath);
});

console.log('All storage files fixed!');