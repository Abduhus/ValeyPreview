const fs = require('fs').promises;
const path = require('path');

// Path to storage.ts file
const STORAGE_FILE = path.join(__dirname, 'server', 'storage.ts');

// Function to update image paths in storage.ts
async function updateImagePaths() {
  try {
    console.log('🔍 Reading storage.ts file...');
    let content = await fs.readFile(STORAGE_FILE, 'utf8');
    
    console.log('🔄 Updating image paths to use higher quality versions...');
    
    // Pattern to match image paths with -300x300 suffix
    const imagePattern = /("\/assets\/perfumes\/[^"]+-300x300\.(webp|jpg|jpeg|png)")/g;
    
    // Replace all -300x300 suffixes with empty string to get full size
    const updatedContent = content.replace(imagePattern, (match, imagePath) => {
      const newPath = imagePath.replace('-300x300', '');
      console.log(`  Updated: ${imagePath} → ${newPath}`);
      return newPath;
    });
    
    // Check if any changes were made
    if (content === updatedContent) {
      console.log('ℹ️  No image paths needed updating (already using high quality versions)');
      return;
    }
    
    // Write updated content back to file
    await fs.writeFile(STORAGE_FILE, updatedContent, 'utf8');
    console.log('✅ Successfully updated storage.ts with higher quality image paths!');
    
    // Count how many replacements were made
    const matches = content.match(imagePattern);
    console.log(`📊 Updated ${matches ? matches.length : 0} image paths`);
    
  } catch (error) {
    console.error('❌ Error updating image paths:', error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  try {
    await updateImagePaths();
    console.log('\n✨ Image path update process completed!');
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { updateImagePaths };