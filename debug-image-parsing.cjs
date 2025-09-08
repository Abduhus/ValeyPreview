// Test the image parsing logic
const product = {
  "id": "9",
  "name": "Rabdan Chill Vibes",
  "description": "A refreshing and contemporary fragrance perfect for relaxed moments with modern appeal and vibrant energy",
  "price": "375.00",
  "category": "unisex",
  "brand": "Rabdan",
  "volume": "50ml",
  "rating": "4.8",
  "imageUrl": "/assets/perfumes/Rabdan_CHILL-VIBES_1.webp",
  "moodImageUrl": "/assets/perfumes/Rabdan_CHILL_-VIBES_2.webp",
  "images": "[\"/assets/perfumes/Rabdan_CHILL-VIBES_1.webp\",\"/assets/perfumes/Rabdan_CHILL_-VIBES_2.webp\"]",
  "inStock": true
};

console.log('Product image data:');
console.log('imageUrl:', product.imageUrl);
console.log('moodImageUrl:', product.moodImageUrl);
console.log('images:', product.images);

// Parse additional images from the product
const additionalImages = product.images ? JSON.parse(product.images) : [];
console.log('\nParsed additionalImages:', additionalImages);

const allImages = [product.imageUrl, product.moodImageUrl, ...additionalImages].filter((img, index, arr) => 
  img && arr.indexOf(img) === index // Remove duplicates
);

console.log('\nallImages after deduplication:', allImages);
console.log('allImages length:', allImages.length);

// Test the high quality image path function
const getHighQualityImagePath = (imagePath) => {
  // For Rabdan images with -300x300 suffix, try to find higher quality versions
  if (imagePath.includes('-300x300')) {
    // Try removing the -300x300 suffix to get full size
    const fullPath = imagePath.replace('-300x300', '');
    return fullPath;
  }
  
  // For other images, return as is
  return imagePath;
};

// Map all images to potentially higher quality versions
const highQualityImages = allImages.map(getHighQualityImagePath);
console.log('\nhighQualityImages:', highQualityImages);