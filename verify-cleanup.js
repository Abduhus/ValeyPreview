// Verify that all products now have clean image arrays
const productIds = [10, 11, 22, 31, 36]; // Sample products from different brands

Promise.all(
  productIds.map(id => fetch(`http://localhost:5000/api/products/${id}`))
).then(responses => 
  Promise.all(responses.map(r => r.json()))
).then(products => {
  console.log('🔍 VERIFICATION: Product Image Counts After Cleanup');
  console.log('==================================================\n');
  
  products.forEach(product => {
    const images = JSON.parse(product.images);
    console.log(`${product.name} (${product.brand})`);
    console.log(`  Images: ${images.length}`);
    console.log(`  Details: ${images.join(', ')}`);
    console.log('');
  });
}).catch(console.error);