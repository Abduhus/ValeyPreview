import fs from 'fs';
import { storage } from './server/storage';

// Read the processed perfumes data
const perfumesData = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));

// Take first 10 products for testing
const sampleProducts = perfumesData.slice(0, 10);

console.log(`Loading ${sampleProducts.length} sample products...`);

// Initialize storage with sample products
async function initProducts() {
  try {
    for (const product of sampleProducts) {
      // Add product to storage
      await storage.createProduct({
        id: product.id,
        name: product.name,
        brand: product.brand,
        description: product.description || '',
        price: product.price || 0,
        category: product.category || 'perfume',
        volume: product.volume || '100ml',
        images: product.images || null,
        inStock: product.inStock !== undefined ? product.inStock : true,
        topNotes: product.topNotes || null,
        middleNotes: product.middleNotes || null,
        baseNotes: product.baseNotes || null,
        gender: product.gender || 'unisex'
      });
    }
    
    // Verify products were added
    const allProducts = await storage.getAllProducts();
    console.log(`Successfully loaded ${allProducts.length} products into storage`);
    
    // Show first few products as examples
    console.log('\nSample products:');
    allProducts.slice(0, 3).forEach(product => {
      console.log(`- ${product.name} by ${product.brand} - AED ${product.price}`);
    });
  } catch (error) {
    console.error('Error initializing products:', error);
  }
}

initProducts();