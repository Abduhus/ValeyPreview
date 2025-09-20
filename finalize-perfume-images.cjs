const fs = require('fs');
const path = require('path');

// Load the updated product cards
const productCards = JSON.parse(fs.readFileSync('processed-perfumes-updated.json', 'utf8'));

// Function to normalize image paths
function normalizeImagePath(imagePath) {
  if (!imagePath) return imagePath;
  
  // Convert to lowercase and fix any path inconsistencies
  return imagePath
    .replace(/\/assets\/perfumes\/([^/]+)\//g, (match, brand) => {
      // Convert brand name to lowercase
      return `/assets/perfumes/${brand.toLowerCase()}/`;
    });
}

// Function to check if image file exists
function imageExists(imagePath) {
  if (!imagePath) return false;
  
  // Convert web path to file system path
  const filePath = path.join('.', imagePath);
  return fs.existsSync(filePath);
}

// Normalize all image paths in product cards
const finalizedProductCards = productCards.map(card => {
  // Normalize image paths
  const normalizedImageUrl = normalizeImagePath(card.imageUrl);
  const normalizedMoodImageUrl = normalizeImagePath(card.moodImageUrl);
  
  // Check if images exist, if not try to find alternatives
  let finalImageUrl = normalizedImageUrl;
  let finalMoodImageUrl = normalizedMoodImageUrl;
  
  // If primary image doesn't exist, try to find a valid one
  if (normalizedImageUrl && !imageExists(normalizedImageUrl)) {
    console.log(`Warning: Image not found: ${normalizedImageUrl}`);
    finalImageUrl = null;
  }
  
  // If mood image doesn't exist, try to find a valid one
  if (normalizedMoodImageUrl && !imageExists(normalizedMoodImageUrl)) {
    console.log(`Warning: Mood image not found: ${normalizedMoodImageUrl}`);
    finalMoodImageUrl = null;
  }
  
  // Normalize images array if it exists
  let normalizedImages = card.images;
  if (card.images && typeof card.images === 'string') {
    try {
      const imagesArray = JSON.parse(card.images);
      const normalizedImagesArray = imagesArray.map(img => normalizeImagePath(img));
      normalizedImages = JSON.stringify(normalizedImagesArray);
    } catch (e) {
      console.log(`Warning: Could not parse images array for ${card.name}`);
    }
  }
  
  return {
    ...card,
    imageUrl: finalImageUrl,
    moodImageUrl: finalMoodImageUrl,
    images: normalizedImages
  };
});

// Save the finalized product cards
fs.writeFileSync('processed-perfumes-final.json', JSON.stringify(finalizedProductCards, null, 2));
console.log('Finalized product cards saved to processed-perfumes-final.json');

// Generate a summary report
const totalCards = finalizedProductCards.length;
const cardsWithImages = finalizedProductCards.filter(card => card.imageUrl).length;
const cardsWithMoodImages = finalizedProductCards.filter(card => card.moodImageUrl).length;
const cardsWithImageArrays = finalizedProductCards.filter(card => card.images).length;

console.log('\n=== FINAL SUMMARY ===');
console.log(`Total product cards: ${totalCards}`);
console.log(`Cards with primary images: ${cardsWithImages} (${((cardsWithImages/totalCards)*100).toFixed(1)}%)`);
console.log(`Cards with mood images: ${cardsWithMoodImages} (${((cardsWithMoodImages/totalCards)*100).toFixed(1)}%)`);
console.log(`Cards with image arrays: ${cardsWithImageArrays} (${((cardsWithImageArrays/totalCards)*100).toFixed(1)}%)`);

// Show some examples of the improvements
console.log('\n=== EXAMPLE IMPROVEMENTS ===');
finalizedProductCards.slice(0, 5).forEach((card, i) => {
  console.log(`${i+1}. ${card.brand} ${card.name}`);
  console.log(`   Type: ${card.type}`);
  console.log(`   Primary Image: ${card.imageUrl || 'None'}`);
  console.log(`   Mood Image: ${card.moodImageUrl || 'None'}`);
  if (card.images) {
    try {
      const imagesArray = JSON.parse(card.images);
      console.log(`   Total Images: ${imagesArray.length}`);
    } catch (e) {
      console.log(`   Total Images: Unknown`);
    }
  }
  console.log('');
});

// Create a report of cards without images
const cardsWithoutImages = finalizedProductCards.filter(card => !card.imageUrl);
if (cardsWithoutImages.length > 0) {
  console.log(`\n=== CARDS WITHOUT IMAGES (${cardsWithoutImages.length}) ===`);
  cardsWithoutImages.slice(0, 10).forEach((card, i) => {
    console.log(`${i+1}. ${card.brand} ${card.name} (${card.type})`);
  });
  if (cardsWithoutImages.length > 10) {
    console.log(`... and ${cardsWithoutImages.length - 10} more`);
  }
}