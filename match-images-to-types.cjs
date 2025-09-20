const fs = require('fs');
const path = require('path');

// Read the processed perfume data
const perfumeData = JSON.parse(fs.readFileSync('182-perfumes-processed.json', 'utf-8'));
const processedPerfumes = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));

console.log(`Loaded ${perfumeData.length} perfumes from Excel data`);
console.log(`Loaded ${processedPerfumes.length} perfumes from processed data`);

// Function to normalize perfume names for matching
function normalizePerfumeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Function to extract key information from perfume names
function extractPerfumeKey(fullName) {
  // Extract brand and perfume name
  const brandMatch = fullName.match(/^([A-Z]+(?:\s+[A-Z]+)?)/);
  const brand = brandMatch ? brandMatch[1] : 'UNKNOWN';
  
  // Extract perfume name (after brand)
  const nameMatch = fullName.match(/^[A-Z]+(?:\s+[A-Z]+)?\s+(.*?)(?:\s+(?:EDT|EDP|PARFUM|COLOGNE))?/);
  const name = nameMatch ? nameMatch[1].trim() : fullName;
  
  // Extract type
  let type = 'UNKNOWN';
  if (fullName.includes('EDT')) type = 'EDT';
  else if (fullName.includes('EDP')) type = 'EDP';
  else if (fullName.includes('PARFUM')) type = 'PARFUM';
  else if (fullName.includes('COLOGNE')) type = 'COLOGNE';
  
  // Extract volume
  const volumeMatch = fullName.match(/(\d+ml)/i);
  const volume = volumeMatch ? volumeMatch[1] : 'UNKNOWN';
  
  return {
    brand: brand.toUpperCase(),
    name: name.toUpperCase(),
    type,
    volume
  };
}

// Create a mapping of existing products by brand and name
const productMap = {};
processedPerfumes.forEach(product => {
  const key = `${product.brand}|${product.name}`.toUpperCase();
  if (!productMap[key]) {
    productMap[key] = [];
  }
  productMap[key].push(product);
});

console.log(`\nCreated product map with ${Object.keys(productMap).length} unique brand|name combinations`);

// Try to match Excel data to existing products
let matches = 0;
const unmatched = [];

perfumeData.forEach((perfume, index) => {
  if (!perfume.fullName) return;
  
  const keyInfo = extractPerfumeKey(perfume.fullName);
  const mapKey = `${keyInfo.brand}|${keyInfo.name}`;
  
  // Look for matching products
  const matchingProducts = productMap[mapKey] || [];
  
  if (matchingProducts.length > 0) {
    // Try to find exact volume match first
    let matchedProduct = matchingProducts.find(p => 
      p.volume && p.volume.toLowerCase() === keyInfo.volume.toLowerCase()
    );
    
    // If no exact volume match, try to find type match
    if (!matchedProduct) {
      matchedProduct = matchingProducts.find(p => 
        (p.type || '').toUpperCase() === keyInfo.type
      );
    }
    
    // If still no match, use first product
    if (!matchedProduct && matchingProducts.length > 0) {
      matchedProduct = matchingProducts[0];
    }
    
    if (matchedProduct) {
      matches++;
      console.log(`Matched: ${perfume.fullName} -> Product ID: ${matchedProduct.id}`);
      
      // Update the product with additional information if needed
      // In a real implementation, we would update the processed-perfumes.json file here
    } else {
      unmatched.push(perfume);
    }
  } else {
    unmatched.push(perfume);
  }
});

console.log(`\n=== MATCHING RESULTS ===`);
console.log(`Successfully matched: ${matches} perfumes`);
console.log(`Unmatched perfumes: ${unmatched.length}`);

// Show some unmatched examples
console.log(`\n=== UNMATCHED EXAMPLES ===`);
unmatched.slice(0, 10).forEach(perfume => {
  console.log(`- ${perfume.fullName}`);
});

// Save unmatched perfumes to file
fs.writeFileSync('unmatched-perfumes.json', JSON.stringify(unmatched, null, 2));
console.log(`\nUnmatched perfumes saved to unmatched-perfumes.json`);

// Create a summary report
const summary = {
  totalExcelPerfumes: perfumeData.length,
  totalProcessedPerfumes: processedPerfumes.length,
  matchedPerfumes: matches,
  unmatchedPerfumes: unmatched.length,
  matchRate: ((matches / perfumeData.length) * 100).toFixed(2) + '%'
};

fs.writeFileSync('matching-summary.json', JSON.stringify(summary, null, 2));
console.log(`\nSummary saved to matching-summary.json`);
console.log(`Match rate: ${summary.matchRate}`);