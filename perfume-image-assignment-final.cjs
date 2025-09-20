const fs = require('fs');
const path = require('path');

// Load the processed perfume data from Excel
const excelPerfumes = JSON.parse(fs.readFileSync('182-perfumes-processed.json', 'utf8'));

// Load the existing product cards
const productCards = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf8'));

// Function to normalize perfume names for matching
function normalizePerfumeName(name) {
  if (!name) return '';
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Function to extract key perfume information from full name
function extractPerfumeInfo(fullName) {
  if (!fullName) return { brand: 'UNKNOWN', name: 'UNKNOWN', type: 'UNKNOWN', volume: 'UNKNOWN' };
  
  // Extract brand - first word(s) before perfume name
  let brand = 'UNKNOWN';
  if (fullName.startsWith('CHANEL ')) {
    brand = 'CHANEL';
  } else if (fullName.startsWith('VERSACE ')) {
    brand = 'VERSACE';
  } else if (fullName.startsWith('XERJOFF ')) {
    brand = 'XERJOFF';
  } else {
    // Extract first word as brand
    const firstSpace = fullName.indexOf(' ');
    if (firstSpace > 0) {
      brand = fullName.substring(0, firstSpace);
    } else {
      brand = fullName;
    }
  }
  
  // Extract perfume name - the main part
  let name = fullName;
  if (brand !== 'UNKNOWN' && fullName.startsWith(brand + ' ')) {
    name = fullName.substring(brand.length + 1);
  }
  
  // Remove type, volume, gender and other info
  name = name
    .replace(/\s*\(M\)\s*|\s*\(W\)\s*|\s*\(U\)\s*/g, ' ') // Remove gender indicators
    .replace(/\s+(EDT|EDP|PARFUM|COLOGNE|FRAGRANCE|MIST)\b/gi, '') // Remove type indicators
    .replace(/\s+\d+(?:\.\d+)?\s*(?:ml|oz)\b/gi, '') // Remove volume
    .replace(/\s+(?:FR|IT)\b/gi, '') // Remove country codes
    .replace(/\s+TRAVEL SPRAY.*/gi, '') // Remove travel spray info
    .replace(/\s+REFILL.*/gi, '') // Remove refill info
    .replace(/\s+REFILLS.*/gi, '') // Remove refills info
    .trim();
  
  // Extract type (EDT, EDP, Parfum, Cologne, etc.)
  let type = 'UNKNOWN';
  if (fullName.includes('EDT')) type = 'EDT';
  else if (fullName.includes('EDP')) type = 'EDP';
  else if (fullName.includes('PARFUM')) type = 'PARFUM';
  else if (fullName.includes('COLOGNE')) type = 'COLOGNE';
  
  // Extract volume (e.g., 100ml, 50ml, etc.)
  const volumeMatch = fullName.match(/(\d+(?:\.\d+)?\s*(?:ml|oz))/i);
  const volume = volumeMatch ? volumeMatch[1] : 'UNKNOWN';
  
  return { brand, name, type, volume };
}

// Create a mapping of product cards by normalized name for matching
const productCardMap = {};
productCards.forEach((card, index) => {
  const key = normalizePerfumeName(card.name);
  if (!productCardMap[key]) {
    productCardMap[key] = [];
  }
  productCardMap[key].push({ ...card, originalIndex: index });
});

console.log('=== PRODUCT CARD MAPPING ===');
console.log(`Mapped ${Object.keys(productCardMap).length} unique perfume names`);

// Map available images by brand
const imageMap = {};
const brandsDir = path.join('assets', 'perfumes');

if (fs.existsSync(brandsDir)) {
  const brands = fs.readdirSync(brandsDir).filter(item => 
    fs.statSync(path.join(brandsDir, item)).isDirectory()
  );
  
  brands.forEach(brand => {
    const brandPath = path.join(brandsDir, brand);
    const images = fs.readdirSync(brandPath).filter(file => 
      /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(file)
    );
    
    imageMap[brand.toLowerCase()] = images;
  });
}

console.log(`\n=== IMAGE MAP ===`);
console.log(`Found images for ${Object.keys(imageMap).length} brands`);

// Function to find matching images for a perfume
function findMatchingImages(brand, perfumeName) {
  const brandKey = brand.toLowerCase();
  const images = imageMap[brandKey] || [];
  
  if (images.length === 0) return [];
  
  // Normalize perfume name for matching
  const normalizedName = normalizePerfumeName(perfumeName).toLowerCase();
  const nameParts = normalizedName.split(' ').filter(part => part.length > 2);
  
  // Filter images that match the perfume name
  const matchingImages = images.filter(image => {
    const imageName = path.parse(image).name.toLowerCase();
    
    // Check for exact matches or partial matches
    if (normalizedName.length > 2 && imageName.includes(normalizedName)) {
      return true;
    }
    
    // Check if most name parts are in the image name
    if (nameParts.length > 0) {
      const matchedParts = nameParts.filter(part => imageName.includes(part));
      return matchedParts.length >= Math.max(1, Math.floor(nameParts.length * 0.5));
    }
    
    return false;
  });
  
  // Return full paths
  return matchingImages.map(img => `/assets/perfumes/${brandKey}/${img}`);
}

// Match Excel perfumes to product cards and assign images
const matchedPerfumes = [];
const unmatchedPerfumes = [];
const updatedProductCards = [...productCards];

excelPerfumes.forEach((excelPerfume, index) => {
  const fullName = excelPerfume.fullName || '';
  const { brand, name, type, volume } = extractPerfumeInfo(fullName);
  
  // Try to match by normalized name
  const normalizedName = normalizePerfumeName(name);
  const potentialMatches = productCardMap[normalizedName] || [];
  
  if (potentialMatches.length > 0) {
    // Find the best match based on type
    let bestMatch = null;
    
    // First try to match by type
    const typeMatches = potentialMatches.filter(card => 
      card.type && card.type.toUpperCase() === type
    );
    
    if (typeMatches.length > 0) {
      bestMatch = typeMatches[0];
    } else {
      // If no type match, use the first available match
      bestMatch = potentialMatches[0];
    }
    
    // Find matching images
    const imagePaths = findMatchingImages(brand, name);
    
    matchedPerfumes.push({
      excelData: excelPerfume,
      productCard: bestMatch,
      matchType: 'exact',
      brand,
      name,
      type,
      volume,
      imagePaths
    });
    
    // Update the product card
    const productIndex = bestMatch.originalIndex;
    if (imagePaths.length > 0) {
      const primaryImage = imagePaths[0];
      const moodImage = imagePaths.length > 1 ? imagePaths[1] : primaryImage;
      
      updatedProductCards[productIndex] = {
        ...updatedProductCards[productIndex],
        imageUrl: primaryImage,
        moodImageUrl: moodImage,
        images: JSON.stringify(imagePaths),
        type: type,
        fullName: fullName,
        price: excelPerfume.price?.toString() || updatedProductCards[productIndex].price,
        barcode: excelPerfume.barcode || updatedProductCards[productIndex].barcode
      };
    } else {
      // At least update the type and other information
      updatedProductCards[productIndex] = {
        ...updatedProductCards[productIndex],
        type: type,
        fullName: fullName,
        price: excelPerfume.price?.toString() || updatedProductCards[productIndex].price,
        barcode: excelPerfume.barcode || updatedProductCards[productIndex].barcode
      };
    }
  } else {
    unmatchedPerfumes.push({
      excelData: excelPerfume,
      brand,
      name,
      type,
      volume
    });
  }
});

console.log(`\n=== MATCHING RESULTS ===`);
console.log(`Matched: ${matchedPerfumes.length} perfumes`);
console.log(`Unmatched: ${unmatchedPerfumes.length} perfumes`);

// Show some examples of successful matches
console.log(`\n=== SUCCESSFUL MATCHES EXAMPLES ===`);
const matchesWithImages = matchedPerfumes.filter(m => m.imagePaths.length > 0);
matchesWithImages.slice(0, 10).forEach((match, i) => {
  console.log(`${i+1}. ${match.excelData.fullName}`);
  console.log(`   -> Matched to: ${match.productCard.brand} ${match.productCard.name}`);
  console.log(`   -> Type: ${match.type}, Volume: ${match.volume}`);
  console.log(`   -> Images found: ${match.imagePaths.length}`);
  if (match.imagePaths.length > 0) {
    console.log(`   -> Primary: ${match.imagePaths[0]}`);
  }
  console.log('');
});

// Show some examples of unmatched perfumes
if (unmatchedPerfumes.length > 0) {
  console.log(`\n=== UNMATCHED EXAMPLES ===`);
  unmatchedPerfumes.slice(0, 10).forEach((unmatched, i) => {
    console.log(`${i+1}. ${unmatched.excelData.fullName}`);
    console.log(`   -> Brand: ${unmatched.brand}, Name: ${unmatched.name}, Type: ${unmatched.type}`);
    console.log('');
  });
}

// Save matching results
fs.writeFileSync('perfume-matching-final-results.json', JSON.stringify({
  matchedPerfumes: matchedPerfumes.map(m => ({
    excelData: {
      id: m.excelData.id,
      fullName: m.excelData.fullName,
      price: m.excelData.price,
      barcode: m.excelData.barcode
    },
    productCard: {
      id: m.productCard.id,
      name: m.productCard.name,
      brand: m.productCard.brand,
      type: m.productCard.type
    },
    matchType: m.matchType,
    brand: m.brand,
    name: m.name,
    type: m.type,
    volume: m.volume,
    imageCount: m.imagePaths.length
  })),
  unmatchedPerfumes: unmatchedPerfumes.map(u => ({
    excelData: {
      id: u.excelData.id,
      fullName: u.excelData.fullName,
      price: u.excelData.price,
      barcode: u.excelData.barcode
    },
    brand: u.brand,
    name: u.name,
    type: u.type,
    volume: u.volume
  }))
}, null, 2));

console.log('Matching results saved to perfume-matching-final-results.json');

// Save updated product cards
fs.writeFileSync('processed-perfumes-final.json', JSON.stringify(updatedProductCards, null, 2));
console.log('\nFinal product cards saved to processed-perfumes-final.json');

// Generate summary report
const totalCards = updatedProductCards.length;
const cardsWithImages = updatedProductCards.filter(card => card.imageUrl).length;
const cardsWithMoodImages = updatedProductCards.filter(card => card.moodImageUrl).length;
const cardsWithImageArrays = updatedProductCards.filter(card => card.images).length;

console.log('\n=== FINAL SUMMARY ===');
console.log(`Total product cards: ${totalCards}`);
console.log(`Cards with primary images: ${cardsWithImages} (${((cardsWithImages/totalCards)*100).toFixed(1)}%)`);
console.log(`Cards with mood images: ${cardsWithMoodImages} (${((cardsWithMoodImages/totalCards)*100).toFixed(1)}%)`);
console.log(`Cards with image arrays: ${cardsWithImageArrays} (${((cardsWithImageArrays/totalCards)*100).toFixed(1)}%)`);
console.log(`Successfully matched perfumes: ${matchedPerfumes.length} (${((matchedPerfumes.length/excelPerfumes.length)*100).toFixed(1)}%)`);
console.log(`Perfumes with assigned images: ${matchesWithImages.length} (${((matchesWithImages.length/excelPerfumes.length)*100).toFixed(1)}%)`);