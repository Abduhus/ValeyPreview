const http = require('http');

function fetchProducts() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:5000/api/products', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const products = JSON.parse(data);
            resolve(products);
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

async function checkRabdanProducts() {
  try {
    const products = await fetchProducts();
    const rabdanProducts = products.filter(p => p.brand === 'Rabdan' && p.inStock);
    
    console.log(`Rabdan products in stock: ${rabdanProducts.length}`);
    
    rabdanProducts.forEach(p => {
      console.log(`- ${p.name}:`);
      console.log(`  Main image: ${p.imageUrl}`);
      console.log(`  Mood image: ${p.moodImageUrl}`);
      if (p.images) {
        try {
          const additionalImages = JSON.parse(p.images);
          console.log(`  Additional images: ${additionalImages.length}`);
          additionalImages.forEach((img, i) => console.log(`    ${i+1}. ${img}`));
        } catch (e) {
          console.log(`  Additional images: Could not parse`);
        }
      }
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkRabdanProducts();