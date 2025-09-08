const fs = require('fs').promises;
const path = require('path');

// Configuration
const ASSETS_DIR = path.join(__dirname, 'assets', 'perfumes');

// Remove low-quality images with -300x300 suffix
async function removeLowQualityImages() {
  console.log('🔍 Looking for low-quality images to remove...');
  
  try {
    const files = await fs.readdir(ASSETS_DIR);
    let removed = 0;
    
    for (const file of files) {
      if (file.includes('-300x300')) {
        const filePath = path.join(ASSETS_DIR, file);
        await fs.unlink(filePath);
        console.log(`  ✓ Removed: ${file}`);
        removed++;
      }
    }
    
    console.log(`\n📊 Cleanup Summary:`);
    console.log(`  ✓ Successfully removed: ${removed} low-quality images`);
    console.log(`\n✨ Cleanup completed!`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  console.log('✨ Starting image cleanup process...\n');
  
  try {
    await removeLowQualityImages();
    
    console.log('\n🎉 Image cleanup process completed!');
    console.log('\nNext steps:');
    console.log('1. Restart your development server to see the changes');
    console.log('2. Check the product pages to verify image quality improvement');
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { removeLowQualityImages };