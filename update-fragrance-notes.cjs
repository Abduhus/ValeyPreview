const fs = require('fs');
const path = require('path');

// Read the fragrance data
const fragranceData = require('./fragrance-notes-data.json');

// Read the storage file
const storagePath = path.join(__dirname, 'server', 'storage.ts');
let storageContent = fs.readFileSync(storagePath, 'utf8');

// Function to escape special characters in strings for regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Process each product in our fragrance data
fragranceData.products.forEach(product => {
  console.log(`Updating product ID: ${product.id} - ${product.name}`);
  
  // Create a regex pattern to find this specific product
  const productRegex = new RegExp(
    `(id:\\s*"${product.id}"[^}]*?description:[^}]*?)(?=\\n\\s*\\})`,
    's'
  );
  
  // Check if we found the product
  if (productRegex.test(storageContent)) {
    // Check if the product already has fragrance notes
    const hasNotesRegex = new RegExp(
      `(id:\\s*"${product.id}"[^}]*?)(topNotes:|middleNotes:|baseNotes:)`,
      's'
    );
    
    if (!hasNotesRegex.test(storageContent)) {
      // Add the fragrance notes before the closing brace
      storageContent = storageContent.replace(
        productRegex,
        `$1,\n        topNotes: "${product.topNotes}",\n        middleNotes: "${product.middleNotes}",\n        baseNotes: "${product.baseNotes}"\n      `
      );
      console.log(`  ✓ Added fragrance notes`);
    } else {
      console.log(`  - Notes already exist, skipping`);
    }
  } else {
    console.log(`  ✗ Product not found in storage.ts`);
  }
});

// Write the updated content back to the file
fs.writeFileSync(storagePath, storageContent, 'utf8');
console.log('\nAll products updated successfully!');