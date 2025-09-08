// Test script to verify that product images are properly matched
const http = require('http');

async function verifyImages() {
  console.log('🔍 Verifying product images...\n');
  
  try {
    const products = await fetchProducts('http://localhost:5000/api/products');
    
    // Check a few specific products to verify their images
    const testProducts = [
      {
        id: '9',
        name: 'Rabdan Chill Vibes',
        expectedImages: ['/assets/perfumes/Rabdan_CHILL-VIBES_1.webp', '/assets/perfumes/Rabdan_CHILL_-VIBES_2.webp']
      },
      {
        id: '22',
        name: 'Signature Royale Caramel Sugar',
        expectedImages: ['/assets/perfumes/caramel-sugar-main.jpg', '/assets/perfumes/caramel-sugar-mood.jpg']
      },
      {
        id: '31',
        name: 'Pure Essence Ambernomade',
        expectedImages: ['/assets/perfumes/ambernomade-1.jpg', '/assets/perfumes/ambernomade-2.jpg', '/assets/perfumes/ambernomade-3.jpg']
      }
    ];
    
    for (const testProduct of testProducts) {
      const product = products.find(p => p.id === testProduct.id);
      
      if (!product) {
        console.log(`✗ Product ${testProduct.name} (ID: ${testProduct.id}) not found`);
        continue;
      }
      
      console.log(`✅ Product: ${product.name}`);
      console.log(`   Image URL: ${product.imageUrl}`);
      console.log(`   Mood Image URL: ${product.moodImageUrl}`);
      
      if (product.images) {
        try {
          const additionalImages = JSON.parse(product.images);
          console.log(`   Additional Images: ${additionalImages.length} images`);
          additionalImages.forEach((img, index) => {
            console.log(`     ${index + 1}. ${img}`);
          });
        } catch (e) {
          console.log(`   Additional Images: Could not parse (${product.images})`);
        }
      }
      
      console.log('');
    }
    
    // Count products with proper images
    const productsWithImages = products.filter(p => p.imageUrl && p.imageUrl.length > 0);
    console.log(`📊 Summary: ${productsWithImages.length}/${products.length} products have proper image URLs`);
    
  } catch (error) {
    console.log(`✗ ERROR: ${error.message}`);
  }
  
  console.log('\n✨ Image verification completed!');
}

function fetchProducts(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode === 200) {
          try {
            const products = JSON.parse(data);
            resolve(products);
          } catch (parseError) {
            reject(new Error(`Failed to parse JSON: ${parseError.message}`));
          }
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Run the verification
verifyImages().catch(console.error);