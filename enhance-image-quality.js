import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enhanced image quality analysis and optimization
async function analyzeImageQuality() {
  const assetsDir = path.join(__dirname, 'assets', 'perfumes');
  
  try {
    const files = await fs.readdir(assetsDir);
    const rabdanImages = files.filter(file => file.toLowerCase().includes('rabdan'));
    
    console.log('🔍 Analyzing Rabdan Image Quality...\n');
    
    const imageAnalysis = [];
    
    for (const file of rabdanImages) {
      const filePath = path.join(assetsDir, file);
      const stats = await fs.stat(filePath);
      const sizeKB = Math.round(stats.size / 1024 * 10) / 10;
      
      // Estimate quality based on file size and name
      let qualityScore = 'Low';
      let resolution = '300x300 (estimated)';
      
      if (sizeKB > 100) {
        qualityScore = 'High';
        resolution = '600x600+ (estimated)';
      } else if (sizeKB > 20) {
        qualityScore = 'Medium';
        resolution = '400x400 (estimated)';
      }
      
      imageAnalysis.push({
        file,
        sizeKB,
        qualityScore,
        resolution,
        needsUpgrade: sizeKB < 15 // Flag images under 15KB as needing upgrade
      });
    }
    
    // Sort by size descending
    imageAnalysis.sort((a, b) => b.sizeKB - a.sizeKB);
    
    console.log('📊 Current Image Quality Report:');
    console.log('==========================================');
    imageAnalysis.forEach(img => {
      const status = img.needsUpgrade ? '❌ NEEDS UPGRADE' : '✅ Good Quality';
      console.log(`${img.file}: ${img.sizeKB}KB - ${img.qualityScore} - ${status}`);
    });
    
    const needsUpgrade = imageAnalysis.filter(img => img.needsUpgrade);
    
    console.log(`\n📋 Summary:`);
    console.log(`Total Rabdan Images: ${imageAnalysis.length}`);
    console.log(`High Quality (>100KB): ${imageAnalysis.filter(img => img.sizeKB > 100).length}`);
    console.log(`Medium Quality (20-100KB): ${imageAnalysis.filter(img => img.sizeKB >= 20 && img.sizeKB <= 100).length}`);
    console.log(`Low Quality (<20KB): ${imageAnalysis.filter(img => img.sizeKB < 20).length}`);
    console.log(`Images Needing Upgrade: ${needsUpgrade.length}`);
    
    if (needsUpgrade.length > 0) {
      console.log('\n🎯 Recommended Actions:');
      console.log('1. Source higher resolution versions from rabdanperfumes.com');
      console.log('2. Look for non-300x300 versions of these products');
      console.log('3. Check for original/full-size images on the website');
      console.log('4. Consider using AI upscaling for critical product images');
      
      console.log('\n📝 Images to upgrade:');
      needsUpgrade.forEach(img => {
        console.log(`  - ${img.file} (${img.sizeKB}KB)`);
      });
    }
    
    return imageAnalysis;
    
  } catch (error) {
    console.error('Error analyzing images:', error);
  }
}

// Run the analysis
analyzeImageQuality().then(() => {
  console.log('\n✅ Analysis complete!');
}).catch(console.error);