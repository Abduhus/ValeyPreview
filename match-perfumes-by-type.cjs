const fs = require('fs');
const path = require('path');

// Load the processed perfume data from Excel
const excelPerfumes = JSON.parse(fs.readFileSync('182-perfumes-processed.json', 'utf8'));

// Load the existing product cards
const productCards = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf8'));

// Function to normalize perfume names for matching
function normalizeName(name) {
  if (!name) return '';
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Function to extract key perfume information from full name
function extractPerfumeInfo(fullName) {
  if (!fullName) return { brand: '', name: '', type: '', volume: '' };
  
  // Extract brand (first part before space or parenthesis)
  const brandMatch = fullName.match(/^([A-Z]+(?:\s+[A-Z]+)*?)(?:\s+(?:POUR\s+)?(?:HOMME|FEMME|MAN|WOMAN|L'EAU|EAU|EDITION|SPORT|EXTREME|PRIVEE|ESSENCE|NOIR|BLANCHE|COLOGNE|PARFUM|EDT|EDP|FRAGRANCE|MIST))?/i);
  const brand = brandMatch ? brandMatch[1].trim() : '';
  
  // Extract perfume name (main name part)
  let name = '';
  const nameMatch = fullName.match(/^(?:[A-Z]+(?:\s+[A-Z]+)*?\s+)?([A-Z\s]+?)(?:\s+(?:\(M\)|\(W\)|\(U\)|EDT|EDP|PARFUM|COLOGNE|[\d]+ml|\d+x\d+\s*ml|FR|IT|TRAVEL SPRAY|REFILL|REFILLS))?/i);
  if (nameMatch) {
    name = nameMatch[1].trim();
  } else {
    // Fallback to brand if name extraction failed
    name = brand;
  }
  
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

// Create a mapping of product cards by brand and normalized name
const productCardMap = {};
productCards.forEach((card, index) => {
  const brand = card.brand ? card.brand.toUpperCase() : '';
  const name = card.name ? card.name.toUpperCase() : '';
  const key = `${brand}|${name}`;
  
  if (!productCardMap[key]) {
    productCardMap[key] = [];
  }
  productCardMap[key].push({ ...card, originalIndex: index });
});

console.log('=== PRODUCT CARD MAPPING ===');
console.log(`Mapped ${Object.keys(productCardMap).length} unique brand|name combinations`);

// Match Excel perfumes to product cards
const matchedPerfumes = [];
const unmatchedPerfumes = [];

excelPerfumes.forEach((excelPerfume, index) => {
  const fullName = excelPerfume.fullName || '';
  const { brand, name, type, volume } = extractPerfumeInfo(fullName);
  
  // Try to match by brand and name
  const key = `${brand}|${name}`;
  const potentialMatches = productCardMap[key] || [];
  
  if (potentialMatches.length > 0) {
    // Find the best match based on type and volume
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
    
    matchedPerfumes.push({
      excelData: excelPerfume,
      productCard: bestMatch,
      matchType: 'brand_name_type',
      brand,
      name,
      type,
      volume
    });
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

// Show some examples
console.log(`\n=== MATCHING EXAMPLES ===`);
matchedPerfumes.slice(0, 5).forEach((match, i) => {
  console.log(`${i+1}. ${match.excelData.fullName}`);
  console.log(`   -> Matched to: ${match.productCard.brand} ${match.productCard.name} (${match.productCard.type})`);
  console.log(`   -> Type: ${match.type}, Volume: ${match.volume}`);
  console.log('');
});

console.log(`\n=== UNMATCHED EXAMPLES ===`);
unmatchedPerfumes.slice(0, 5).forEach((unmatched, i) => {
  console.log(`${i+1}. ${unmatched.excelData.fullName}`);
  console.log(`   -> Brand: ${unmatched.brand}, Name: ${unmatched.name}, Type: ${unmatched.type}`);
  console.log('');
});

// Save matching results
fs.writeFileSync('perfume-matching-results.json', JSON.stringify({
  matchedPerfumes,
  unmatchedPerfumes
}, null, 2));

console.log('Matching results saved to perfume-matching-results.json');

// Now let's create a better image assignment script
// First, let's map available images by brand
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

console.log('\n=== IMAGE MAP ===');
console.log(`Found images for ${Object.keys(imageMap).length} brands`);

// Function to find matching images for a perfume
function findMatchingImages(brand, name, type) {
  const brandKey = brand.toLowerCase();
  const images = imageMap[brandKey] || [];
  
  // Normalize name for matching
  const normalizedName = normalizeName(name).toLowerCase().replace(/\s+/g, '-');
  
  // Filter images that match the perfume name
  const matchingImages = images.filter(image => {
    const imageName = path.parse(image).name.toLowerCase();
    return imageName.includes(normalizedName) || 
           imageName.includes(normalizedName.replace(/-/g, ''));
  });
  
  return matchingImages.map(img => `/assets/perfumes/${brand}/${img}`);
}

// Create updated product cards with better image assignments
const updatedProductCards = [...productCards];

matchedPerfumes.forEach(match => {
  const productIndex = match.productCard.originalIndex;
  const { brand, name, type } = match;
  
  // Find matching images
  const imagePaths = findMatchingImages(brand, name, type);
  
  if (imagePaths.length > 0) {
    // Update the product card with better image assignments
    const primaryImage = imagePaths[0];
    const moodImage = imagePaths.length > 1 ? imagePaths[1] : primaryImage;
    
    updatedProductCards[productIndex] = {
      ...updatedProductCards[productIndex],
      imageUrl: primaryImage,
      moodImageUrl: moodImage,
      images: JSON.stringify(imagePaths),
      type: type,
      fullName: match.excelData.fullName,
      price: match.excelData.price?.toString() || updatedProductCards[productIndex].price,
      barcode: match.excelData.barcode || updatedProductCards[productIndex].barcode
    };
  } else if (match.excelData.type) {
    // At least update the type information
    updatedProductCards[productIndex] = {
      ...updatedProductCards[productIndex],
      type: type,
      fullName: match.excelData.fullName,
      price: match.excelData.price?.toString() || updatedProductCards[productIndex].price,
      barcode: match.excelData.barcode || updatedProductCards[productIndex].barcode
    };
  }
});

// Save updated product cards
fs.writeFileSync('processed-perfumes-updated.json', JSON.stringify(updatedProductCards, null, 2));
console.log('\nUpdated product cards saved to processed-perfumes-updated.json');

console.log('\n=== SUMMARY ===');
console.log(`Total product cards: ${updatedProductCards.length}`);
console.log(`Updated ${matchedPerfumes.length} product cards with better image assignments`);
console.log(`Preserved data for ${unmatchedPerfumes.length} unmatched perfumes`);