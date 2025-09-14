const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('182 perfumes.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const rawData = XLSX.utils.sheet_to_json(worksheet);

console.log('Total perfumes in file:', rawData.length);

// Extract column names
const columns = Object.keys(rawData[0] || {});
console.log('Column names:', columns);

// The columns seem to be:
// [0] - Price
// [1] - Barcode/EAN
// [2] - Product name and description

// Function to parse product name and extract brand, volume, type
function parseProductName(productName) {
  // Extract brand (everything before the first space or parenthesis)
  let brand = "";
  let name = "";
  let volume = "100ml"; // Default volume
  let category = "unisex"; // Default category
  let type = "EDP"; // Default type
  
  // Extract brand from the beginning
  const brandMatch = productName.match(/^([A-Z]+(?:\s+[A-Z]+)*?)\s+/);
  if (brandMatch) {
    brand = brandMatch[1];
    name = productName.substring(brand.length).trim();
  } else {
    // Try to extract brand from parentheses
    const parenMatch = productName.match(/\(([^)]+)\)/);
    if (parenMatch) {
      const gender = parenMatch[1].toLowerCase();
      if (gender.includes('m') || gender.includes('homme') || gender.includes('man')) {
        category = "men";
      } else if (gender.includes('w') || gender.includes('femme') || gender.includes('woman')) {
        category = "women";
      }
    }
    // Extract brand from the beginning until the first parenthesis or space
    const firstWordMatch = productName.match(/^([A-Z][a-zA-Z]+)/);
    if (firstWordMatch) {
      brand = firstWordMatch[1];
      name = productName.substring(brand.length).trim();
    }
  }
  
  // Extract volume
  const volumeMatch = productName.match(/(\d+)\s*ml/i);
  if (volumeMatch) {
    volume = volumeMatch[1] + "ml";
  }
  
  // Extract type (EDP, EDT, Parfum, etc.)
  const typeMatch = productName.match(/\b(EDP|EDT|PARFUM|COLOGNE)\b/i);
  if (typeMatch) {
    type = typeMatch[1].toUpperCase();
  }
  
  // Clean up the name by removing the gender indicator and extra info
  name = name.replace(/\([^)]*\)/g, '').trim();
  name = name.replace(/\s+\d+ml.*/i, '').trim();
  name = name.replace(/\s+(EDP|EDT|PARFUM|COLOGNE).*/i, '').trim();
  
  // Special handling for some brands
  if (brand.includes('CHANEL')) {
    brand = 'CHANEL';
  } else if (brand.includes('VERSACE')) {
    brand = 'VERSACE';
  } else if (brand.includes('XERJOFF')) {
    brand = 'XERJOFF';
  }
  
  return {
    brand: brand,
    name: name || productName,
    volume: volume,
    category: category,
    type: type
  };
}

// Process all perfumes
const processedPerfumes = rawData.map((row, index) => {
  const price = row[columns[0]];
  const barcode = row[columns[1]];
  const fullName = row[columns[2]];
  
  const parsed = parseProductName(fullName);
  
  return {
    id: (100 + index).toString(), // Start from ID 100 to avoid conflicts
    name: parsed.name,
    brand: parsed.brand,
    price: price.toString(),
    volume: parsed.volume,
    category: parsed.category,
    barcode: barcode,
    fullName: fullName,
    type: parsed.type
  };
});

console.log('\nFirst 10 processed perfumes:');
processedPerfumes.slice(0, 10).forEach((perfume, index) => {
  console.log(`${index + 1}. ${perfume.brand} - ${perfume.name} (${perfume.volume}) - ${perfume.price} AED`);
});

// Group perfumes by brand
const brands = {};
processedPerfumes.forEach(perfume => {
  if (!brands[perfume.brand]) {
    brands[perfume.brand] = [];
  }
  brands[perfume.brand].push(perfume);
});

console.log('\nBrands found:');
Object.keys(brands).forEach(brand => {
  console.log(`${brand}: ${brands[brand].length} products`);
});

// Save processed data
fs.writeFileSync('processed-perfumes.json', JSON.stringify(processedPerfumes, null, 2));
console.log('\nProcessed perfumes saved to processed-perfumes.json');

// Save brand summary
fs.writeFileSync('brands-summary.json', JSON.stringify(brands, null, 2));
console.log('Brand summary saved to brands-summary.json');