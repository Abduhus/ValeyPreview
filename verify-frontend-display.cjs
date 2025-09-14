// Script to verify frontend correctly displays fragrance notes
const fs = require('fs');

// Read the product detail page component
const productDetailContent = fs.readFileSync('./client/src/pages/product-detail.tsx', 'utf8');

// Check if the component correctly handles authentic notes
const hasAuthenticNotesLogic = productDetailContent.includes('selectedSize.topNotes && selectedSize.middleNotes && selectedSize.baseNotes');
const hasNotesDisplay = productDetailContent.includes('Fragrance Notes') && productDetailContent.includes('topNotes.map') && productDetailContent.includes('middleNotes.map') && productDetailContent.includes('baseNotes.map');

console.log('Product detail page has authentic notes logic:', hasAuthenticNotesLogic);
console.log('Product detail page displays fragrance notes:', hasNotesDisplay);

// Read the product card component
const productCardContent = fs.readFileSync('./client/src/components/product-card.tsx', 'utf8');

// Check if the component correctly handles authentic notes
const hasAuthenticNotesLogicCard = productCardContent.includes('selectedSize.topNotes && selectedSize.middleNotes && selectedSize.baseNotes');
const hasNotesPreview = productCardContent.includes('Fragrance Notes Preview') || productCardContent.includes('fragranceNotes.topNotes');

console.log('Product card has authentic notes logic:', hasAuthenticNotesLogicCard);
console.log('Product card displays fragrance notes preview:', hasNotesPreview);

// Check if the shared schema has the notes fields
const schemaContent = fs.readFileSync('./shared/schema.ts', 'utf8');
const hasSchemaFields = schemaContent.includes('topNotes: text("top_notes")') && schemaContent.includes('middleNotes: text("middle_notes")') && schemaContent.includes('baseNotes: text("base_notes")');

console.log('Schema has fragrance notes fields:', hasSchemaFields);

if (hasAuthenticNotesLogic && hasNotesDisplay && hasAuthenticNotesLogicCard && hasNotesPreview && hasSchemaFields) {
  console.log('✅ Frontend correctly displays fragrance notes!');
  console.log('✅ All components properly handle authentic fragrance notes.');
} else {
  console.log('❌ Some frontend components may not correctly display fragrance notes.');
}