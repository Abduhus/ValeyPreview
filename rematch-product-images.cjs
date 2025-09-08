const fs = require('fs');
const path = require('path');
const http = require('http');

// Function to fetch all products
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

// Function to update product images in storage
async function rematchProductImages() {
  console.log('🔍 Rematching product images to their correct product cards...\n');
  
  try {
    const products = await fetchProducts();
    console.log(`Found ${products.length} products in total`);
    
    // Filter for Rabdan products specifically
    const rabdanProducts = products.filter(p => p.brand === 'Rabdan');
    console.log(`Found ${rabdanProducts.length} Rabdan products\n`);
    
    // Display current image assignments
    console.log('Current Rabdan product image assignments:');
    rabdanProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Main: ${product.imageUrl}`);
      console.log(`   Mood: ${product.moodImageUrl}`);
      if (product.images) {
        try {
          const additionalImages = JSON.parse(product.images);
          console.log(`   Additional: ${additionalImages.length} images`);
        } catch (e) {
          console.log(`   Additional: Could not parse`);
        }
      }
      console.log('');
    });
    
    // Check if images exist
    const assetsDir = path.join(__dirname, 'assets', 'perfumes');
    console.log('Verifying image file existence...\n');
    
    let missingImages = 0;
    let totalImages = 0;
    
    for (const product of rabdanProducts) {
      // Check main image
      const mainImagePath = path.join(assetsDir, path.basename(product.imageUrl));
      totalImages++;
      if (!fs.existsSync(mainImagePath)) {
        console.log(`✗ Missing main image for ${product.name}: ${product.imageUrl}`);
        missingImages++;
      }
      
      // Check mood image
      const moodImagePath = path.join(assetsDir, path.basename(product.moodImageUrl));
      totalImages++;
      if (!fs.existsSync(moodImagePath)) {
        console.log(`✗ Missing mood image for ${product.name}: ${product.moodImageUrl}`);
        missingImages++;
      }
      
      // Check additional images
      if (product.images) {
        try {
          const additionalImages = JSON.parse(product.images);
          for (const img of additionalImages) {
            const imgPath = path.join(assetsDir, path.basename(img));
            totalImages++;
            if (!fs.existsSync(imgPath)) {
              console.log(`✗ Missing additional image for ${product.name}: ${img}`);
              missingImages++;
            }
          }
        } catch (e) {
          console.log(`✗ Could not parse additional images for ${product.name}`);
        }
      }
    }
    
    console.log(`\n📊 Image Verification Summary:`);
    console.log(`✅ Total image references: ${totalImages}`);
    console.log(`✅ Images found: ${totalImages - missingImages}`);
    console.log(`❌ Images missing: ${missingImages}`);
    
    if (missingImages === 0) {
      console.log('\n🎉 All product images are properly matched and available!');
    } else {
      console.log('\n⚠️  Some images are missing. You may need to download them from the Rabdan website.');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the rematch process
rematchProductImages();