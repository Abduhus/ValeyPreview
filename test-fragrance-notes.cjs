// Test script to verify fragrance notes are correctly displayed
const fs = require('fs');

// Read the storage file
const storageContent = fs.readFileSync('./server/storage.ts', 'utf8');

// Check if the Dior products have the fragrance notes
const hasDiorNotes = storageContent.includes('topNotes: "Lavender"') && 
                    storageContent.includes('middleNotes: "Iris, Ambrette, Pear"') && 
                    storageContent.includes('baseNotes: "Virginia Cedar, Vetiver"');

console.log('Dior Homme Intense products have fragrance notes:', hasDiorNotes);

// Read the fragrance notes data file
const fragranceData = JSON.parse(fs.readFileSync('./fragrance-notes-data.json', 'utf8'));

// Check if Dior products are in the fragrance data
const diorProducts = fragranceData.products.filter(p => p.name.includes('DIOR HOMME INTENSE'));
console.log('Dior products in fragrance data:', diorProducts.length);

// Check if products needing notes is empty
const productsNeedingNotes = JSON.parse(fs.readFileSync('./products-needing-fragrance-notes.json', 'utf8'));
console.log('Products still needing fragrance notes:', productsNeedingNotes.products.length);

if (hasDiorNotes && diorProducts.length === 3 && productsNeedingNotes.products.length === 0) {
  console.log('✅ All tests passed! Fragrance notes have been successfully added.');
} else {
  console.log('❌ Some tests failed. Please check the implementation.');
}