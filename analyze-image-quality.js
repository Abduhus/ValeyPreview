import fs from 'fs';
import path from 'path';

// Analyze image quality in assets/perfumes directory
const assetsDir = path.join(process.cwd(), 'assets', 'perfumes');

console.log('🔍 Analyzing Rabdan Images Quality...\n');

// Get all Rabdan-related images
const files = fs.readdirSync(assetsDir);
const rabdanImages = files.filter(file => 
    file.toLowerCase().includes('rabdan') && 
    (file.endsWith('.jpg') || file.endsWith('.webp') || file.endsWith('.png'))
);

console.log(`Found ${rabdanImages.length} Rabdan images:\n`);

let lowQualityCount = 0;
let mediumQualityCount = 0;
let highQualityCount = 0;
const lowQualityImages = [];
const mediumQualityImages = [];
const highQualityImages = [];

rabdanImages.forEach(file => {
    const filePath = path.join(assetsDir, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    
    let quality = '';
    let sizeCategory = '';
    
    // Determine quality based on file size
    if (stats.size < 15000) { // Less than 15KB
        quality = '🔴 Low Quality';
        sizeCategory = 'LOW';
        lowQualityCount++;
        lowQualityImages.push(file);
    } else if (stats.size < 50000) { // 15KB - 50KB
        quality = '🟡 Medium Quality';
        sizeCategory = 'MEDIUM';
        mediumQualityCount++;
        mediumQualityImages.push(file);
    } else {
        quality = '🟢 High Quality';
        sizeCategory = 'HIGH';
        highQualityCount++;
        highQualityImages.push(file);
    }
    
    console.log(`${quality} | ${file} | ${sizeKB}KB`);
});

console.log(`\n📊 Quality Summary:`);
console.log(`🔴 Low Quality (< 15KB): ${lowQualityCount} images`);
console.log(`🟡 Medium Quality (15-50KB): ${mediumQualityCount} images`);
console.log(`🟢 High Quality (> 50KB): ${highQualityCount} images`);

console.log(`\n🔴 Low Quality Images Needing Upgrade:`);
lowQualityImages.forEach(img => console.log(`  - ${img}`));

console.log(`\n💡 Recommendations:`);
console.log(`1. ${lowQualityCount} images need quality upgrade from rabdanperfumes.com`);
console.log(`2. Look for larger resolution versions (non-300x300) on the website`);
console.log(`3. Consider sourcing original product images directly from Rabdan`);
console.log(`4. Target minimum 50KB+ file size for better quality display`);

console.log(`\n🌐 Next Steps:`);
console.log(`1. Visit rabdanperfumes.com product pages`);
console.log(`2. Right-click on images and "Open image in new tab"`);
console.log(`3. Look for larger resolution versions (600x600, 800x800, etc.)`);
console.log(`4. Download and replace the 300x300 versions`);