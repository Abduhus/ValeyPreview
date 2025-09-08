const http = require('http');
const fs = require('fs');
const path = require('path');

// Test if a specific image file exists and is accessible
function testImageAccess(imagePath) {
  const fullPath = path.join(__dirname, imagePath.replace('/assets/', 'assets/'));
  console.log(`Checking: ${imagePath}`);
  console.log(`Full path: ${fullPath}`);
  
  try {
    const exists = fs.existsSync(fullPath);
    if (exists) {
      const stats = fs.statSync(fullPath);
      console.log(`✓ File exists: ${stats.size} bytes`);
    } else {
      console.log(`✗ File does not exist`);
    }
    return exists;
  } catch (error) {
    console.log(`✗ Error checking file: ${error.message}`);
    return false;
  }
}

// Test a few Rabdan images
const testImages = [
  '/assets/perfumes/Rabdan_CHILL-VIBES_1.webp',
  '/assets/perfumes/Rabdan_CIGAR_HONEY_1.webp',
  '/assets/perfumes/Rabdan_GINGER_TIME_1.webp'
];

console.log('🔍 Testing image file access...\n');

testImages.forEach(imagePath => {
  testImageAccess(imagePath);
  console.log('');
});

// Also test via HTTP request
function testHttpAccess(imagePath) {
  return new Promise((resolve) => {
    console.log(`Testing HTTP access: http://localhost:5000${imagePath}`);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: imagePath,
      method: 'GET'
    };
    
    const req = http.request(options, (res) => {
      console.log(`HTTP Status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log('✓ Image is accessible via HTTP');
      } else {
        console.log('✗ Image is not accessible via HTTP');
      }
      resolve();
    });
    
    req.on('error', (error) => {
      console.log(`✗ HTTP Error: ${error.message}`);
      resolve();
    });
    
    req.end();
  });
}

// Test HTTP access for one image
testHttpAccess('/assets/perfumes/Rabdan_CHILL-VIBES_1.webp');