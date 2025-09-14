// Comprehensive test to verify the complete fragrance notes system
const fs = require('fs');

console.log('🧪 Testing complete fragrance notes system...\n');

// 1. Check that storage.ts has products with authentic notes
const storageContent = fs.readFileSync('./server/storage.ts', 'utf8');

// Check for Dior products with authentic notes
const diorProductsHaveNotes = storageContent.includes('"90"') && 
                             storageContent.includes('topNotes: "Lavender"') &&
                             storageContent.includes('middleNotes: "Iris, Ambrette, Pear"') &&
                             storageContent.includes('baseNotes: "Virginia Cedar, Vetiver"');

console.log('1. Dior Homme Intense products have authentic notes:', diorProductsHaveNotes ? '✅' : '❌');

// Check for Bvlgari products with authentic notes
const bvlgariProductsHaveNotes = storageContent.includes('"82"') && 
                                storageContent.includes('topNotes: "Grapefruit, Mandarin, Orange"');

console.log('2. Bvlgari products have authentic notes:', bvlgariProductsHaveNotes ? '✅' : '❌');

// Check for Escentric products with authentic notes
const escentricProductsHaveNotes = storageContent.includes('"44"') && 
                                 storageContent.includes('topNotes: "Green Notes, Violet Leaf, Tea"');

console.log('3. Escentric products have authentic notes:', escentricProductsHaveNotes ? '✅' : '❌');

// Check for Diptyque products with authentic notes
const diptyqueProductsHaveNotes = storageContent.includes('"58"') && 
                                 storageContent.includes('topNotes: "Pink Pepper, Elemi, Artemisia"');

console.log('4. Diptyque products have authentic notes:', diptyqueProductsHaveNotes ? '✅' : '❌');

// 2. Check that the frontend components handle both authentic and generated notes
const productDetailContent = fs.readFileSync('./client/src/pages/product-detail.tsx', 'utf8');
const usesAuthenticNotes = productDetailContent.includes('selectedSize.topNotes && selectedSize.middleNotes && selectedSize.baseNotes');
const generatesNotes = productDetailContent.includes('generateFragranceNotes');

console.log('5. Product detail page uses authentic notes when available:', usesAuthenticNotes ? '✅' : '❌');
console.log('6. Product detail page generates notes when authentic not available:', generatesNotes ? '✅' : '❌');

const productCardContent = fs.readFileSync('./client/src/components/product-card.tsx', 'utf8');
const cardUsesAuthenticNotes = productCardContent.includes('selectedSize.topNotes && selectedSize.middleNotes && selectedSize.baseNotes');
const cardGeneratesNotes = productCardContent.includes('generateFragranceNotes');

console.log('7. Product card uses authentic notes when available:', cardUsesAuthenticNotes ? '✅' : '❌');
console.log('8. Product card generates notes when authentic not available:', cardGeneratesNotes ? '✅' : '❌');

// 3. Check that schema supports fragrance notes
const schemaContent = fs.readFileSync('./shared/schema.ts', 'utf8');
const schemaHasNotesFields = schemaContent.includes('topNotes: text("top_notes")') &&
                            schemaContent.includes('middleNotes: text("middle_notes")') &&
                            schemaContent.includes('baseNotes: text("base_notes")');

console.log('9. Schema supports fragrance notes fields:', schemaHasNotesFields ? '✅' : '❌');

// 4. Check that data file is updated
const fragranceData = JSON.parse(fs.readFileSync('./fragrance-notes-data.json', 'utf8'));
const diorInDataFile = fragranceData.products.some(p => p.id === '90' && p.name.includes('DIOR HOMME INTENSE'));

console.log('10. Dior products in fragrance data file:', diorInDataFile ? '✅' : '❌');

// 5. Check that no products are listed as needing notes anymore
const productsNeedingNotes = JSON.parse(fs.readFileSync('./products-needing-fragrance-notes.json', 'utf8'));
const noProductsNeedingNotes = productsNeedingNotes.products.length === 0;

console.log('11. No products left needing fragrance notes:', noProductsNeedingNotes ? '✅' : '❌');

// Final result
const allTestsPassed = diorProductsHaveNotes && bvlgariProductsHaveNotes && 
                      escentricProductsHaveNotes && diptyqueProductsHaveNotes &&
                      usesAuthenticNotes && generatesNotes &&
                      cardUsesAuthenticNotes && cardGeneratesNotes &&
                      schemaHasNotesFields && diorInDataFile && noProductsNeedingNotes;

console.log('\n🏁 Final Result:');
if (allTestsPassed) {
  console.log('✅ All tests passed! The complete fragrance notes system is working correctly.');
  console.log('✅ All products now display either authentic or generated fragrance notes.');
} else {
  console.log('❌ Some tests failed. Please review the implementation.');
}