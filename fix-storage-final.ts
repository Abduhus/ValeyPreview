import fs from 'fs';

// Read the storage file
let storageContent = fs.readFileSync('server/storage.ts', 'utf-8');

// Find the position of the products.forEach line
const forEachPosition = storageContent.indexOf('products.forEach(product => {');

if (forEachPosition === -1) {
  console.error('Could not find products.forEach in storage.ts');
  process.exit(1);
}

// Look backwards from forEachPosition to find the empty line before it
let emptyLinePosition = -1;
for (let i = forEachPosition - 1; i >= 0; i--) {
  if (storageContent[i] === '\n' && storageContent[i - 1] === '\n') {
    emptyLinePosition = i;
    break;
  }
}

if (emptyLinePosition === -1) {
  console.error('Could not find empty line before products.forEach in storage.ts');
  process.exit(1);
}

// Insert the missing ]; before the empty line
const beforeInsert = storageContent.substring(0, emptyLinePosition);
const afterInsert = storageContent.substring(emptyLinePosition);

const fixedContent = beforeInsert + '    ];\n' + afterInsert;

// Write the fixed content back to the file
fs.writeFileSync('server/storage.ts', fixedContent);

console.log('Products array properly closed in storage.ts');