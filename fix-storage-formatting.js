import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the storage file
const storagePath = path.join(__dirname, 'server', 'storage.ts');
let storageContent = fs.readFileSync(storagePath, 'utf8');

console.log('Fixing storage file formatting issues...');

// Fix the formatting issues where imageUrl and moodImageUrl are on the same line
const fixRegex = /(imageUrl:\s*"[^"]*")([a-zA-Z])/g;
storageContent = storageContent.replace(fixRegex, '$1,\n        $2');

// Fix another pattern where there are extra commas
const fixCommaRegex = /,,/g;
storageContent = storageContent.replace(fixCommaRegex, ',');

// Write the fixed content back to the file
fs.writeFileSync(storagePath, storageContent);

console.log('Storage file formatting fixed successfully!');