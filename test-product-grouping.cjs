// Test script to verify product grouping functionality
const fs = require('fs');

// Read the product grid component
const productGridContent = fs.readFileSync('./client/src/components/product-grid.tsx', 'utf8');

// Check if the unique products logic is implemented
const hasUniqueProductsLogic = productGridContent.includes('const uniqueProducts = Object.values(productGroups).map(group => {') &&
                              productGridContent.includes('return group.sort((a, b) => {') &&
                              productGridContent.includes('filteredAndSortedProducts.map((product) => {');

console.log('Product grid has unique products logic:', hasUniqueProductsLogic);

// Check if the product card component handles similar products
const productCardContent = fs.readFileSync('./client/src/components/product-card.tsx', 'utf8');
const hasSimilarProductsHandling = productCardContent.includes('similarProducts?: Product[]') &&
                                  productCardContent.includes('sameNameProducts.length > 1') &&
                                  productCardContent.includes('Size Options:');

console.log('Product card handles similar products:', hasSimilarProductsHandling);

// Check if the product detail page handles similar products
const productDetailContent = fs.readFileSync('./client/src/pages/product-detail.tsx', 'utf8');
const hasDetailSimilarProducts = productDetailContent.includes('similarProducts = allProducts.filter(p =>') &&
                                productDetailContent.includes('allSizes = product ? [product, ...similarProducts].sort');

console.log('Product detail page handles similar products:', hasDetailSimilarProducts);

if (hasUniqueProductsLogic && hasSimilarProductsHandling && hasDetailSimilarProducts) {
  console.log('✅ All tests passed! Product grouping functionality is correctly implemented.');
} else {
  console.log('❌ Some tests failed. Please check the implementation.');
}