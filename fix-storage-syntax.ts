import fs from 'fs';

// Read the storage file
let storageContent = fs.readFileSync('server/storage.ts', 'utf-8');

// Fix the syntax error by adding a comma after the rating field
// Find the pattern: rating: "4.8"        imageUrl:
const fixedContent = storageContent.replace(
  /rating: "([0-9.]+)"\s+imageUrl:/g,
  'rating: "$1",\n        imageUrl:'
);

// Write the fixed content back to the file
fs.writeFileSync('server/storage.ts', fixedContent);

console.log('Syntax error fixed in storage.ts');