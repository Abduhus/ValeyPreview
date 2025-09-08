// Test script to verify that filtering is working correctly
const http = require('http');

// Test cases
const testCases = [
  {
    name: 'All products',
    url: 'http://localhost:5000/api/products',
    expectedMinProducts: 35
  },
  {
    name: 'Women products',
    url: 'http://localhost:5000/api/products?category=women',
    expectedMinProducts: 10
  },
  {
    name: 'Rabdan brand products',
    url: 'http://localhost:5000/api/products?brand=Rabdan',
    expectedMinProducts: 12
  },
  {
    name: 'Search for "Rose"',
    url: 'http://localhost:5000/api/products?search=Rose',
    expectedMinProducts: 1
  }
];

async function testFiltering() {
  console.log('🔍 Testing product filtering functionality...\n');
  
  for (const testCase of testCases) {
    try {
      const products = await fetchProducts(testCase.url);
      const productCount = products.length;
      
      console.log(`✅ ${testCase.name}: ${productCount} products found`);
      
      if (productCount >= testCase.expectedMinProducts) {
        console.log(`   ✓ PASS: Expected at least ${testCase.expectedMinProducts} products\n`);
      } else {
        console.log(`   ✗ FAIL: Expected at least ${testCase.expectedMinProducts} products\n`);
      }
    } catch (error) {
      console.log(`✗ ${testCase.name}: ERROR - ${error.message}\n`);
    }
  }
  
  console.log('✨ Filtering tests completed!');
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

// Run the tests
testFiltering().catch(console.error);