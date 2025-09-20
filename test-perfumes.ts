import { storagePromise } from './server/storage.js';

async function testPerfumes() {
  const storage = await storagePromise;
  // Test getting all products
  const allProducts = await storage.getAllProducts();
  console.log(`Total products: ${allProducts.length}`);

  // Test getting products by brand
  const chanelProducts = await storage.getProductsByBrand('chanel');
  console.log(`CHANEL products: ${chanelProducts.length}`);

  const versaceProducts = await storage.getProductsByBrand('versace');
  console.log(`VERSACE products: ${versaceProducts.length}`);

  const xerjoffProducts = await storage.getProductsByBrand('xerjoff');
  console.log(`XERJOFF products: ${xerjoffProducts.length}`);

  // Test searching for a specific perfume
  const searchResults = await storage.searchProducts('CHANEL ALLURE HOMME');
  console.log(`Search results for "CHANEL ALLURE HOMME": ${searchResults.length}`);

  // Display first few products as examples
  console.log('\nFirst 3 CHANEL products:');
  chanelProducts.slice(0, 3).forEach(product => {
    console.log(`- ${product.name} (${product.volume}) - AED ${product.price}`);
  });

  console.log('\nFirst 3 VERSACE products:');
  versaceProducts.slice(0, 3).forEach(product => {
    console.log(`- ${product.name} (${product.volume}) - AED ${product.price}`);
  });

  console.log('\nFirst 3 XERJOFF products:');
  xerjoffProducts.slice(0, 3).forEach(product => {
    console.log(`- ${product.name} (${product.volume}) - AED ${product.price}`);
  });
}

testPerfumes().catch(console.error);