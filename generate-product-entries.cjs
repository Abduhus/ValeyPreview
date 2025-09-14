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

// Function to determine category based on gender indicators
function determineCategory(fullName) {
  const name = fullName.toLowerCase();
  
  // Check for gender indicators
  if (name.includes('(m)') || name.includes('homme') || name.includes('man') || name.includes('pour homme') || name.includes('men')) {
    return "men";
  } else if (name.includes('(w)') || name.includes('femme') || name.includes('woman') || name.includes('women') || name.includes('pour femme')) {
    return "women";
  } else {
    return "unisex";
  }
}

// Function to extract volume from product name
function extractVolume(fullName) {
  const volumeMatch = fullName.match(/(\d+)\s*(ml|mls)/i);
  if (volumeMatch) {
    return volumeMatch[1] + "ml";
  }
  // Special case for travel sizes
  if (fullName.includes('20 ml')) {
    return "20ml";
  }
  if (fullName.includes('15 ml')) {
    return "15ml";
  }
  if (fullName.includes('35 ml')) {
    return "35ml";
  }
  return "100ml"; // Default
}

// Function to extract fragrance type
function extractType(fullName) {
  const name = fullName.toLowerCase();
  
  if (name.includes('edp') || name.includes('eau de parfum')) {
    return "EDP";
  } else if (name.includes('edt') || name.includes('eau de toilette')) {
    return "EDT";
  } else if (name.includes('parfum') || name.includes('extrait')) {
    return "PARFUM";
  } else if (name.includes('cologne')) {
    return "COLOGNE";
  } else {
    return "EDP"; // Default
  }
}

// Function to clean product name
function cleanProductName(fullName) {
  // Remove brand name from the beginning
  let cleanedName = fullName.replace(/^([A-Z]+(?:\s+[A-Z]+)*?)\s+/, '');
  
  // Remove gender indicators
  cleanedName = cleanedName.replace(/\([^)]*\)/g, '');
  
  // Remove volume and type information
  cleanedName = cleanedName.replace(/\d+\s*ml.*/i, '');
  cleanedName = cleanedName.replace(/\b(EDP|EDT|PARFUM|COLOGNE|EXTRAIT|COLOGNE)\b.*/i, '');
  
  // Remove extra spaces and trim
  cleanedName = cleanedName.replace(/\s+/g, ' ').trim();
  
  return cleanedName || fullName;
}

// Process all perfumes
const processedPerfumes = rawData.map((row, index) => {
  const price = row[columns[0]];
  const barcode = row[columns[1]];
  const fullName = row[columns[2]];
  
  // Extract brand from the beginning of the full name
  const brandMatch = fullName.match(/^([A-Z]+(?:\s+[A-Z]+)*?)\s+/);
  const brand = brandMatch ? brandMatch[1] : fullName.split(' ')[0];
  
  const name = cleanProductName(fullName);
  const volume = extractVolume(fullName);
  const category = determineCategory(fullName);
  const type = extractType(fullName);
  
  return {
    id: (200 + index).toString(), // Start from ID 200 to avoid conflicts
    name: name,
    brand: brand,
    price: price.toString(),
    volume: volume,
    category: category,
    barcode: barcode,
    fullName: fullName,
    type: type
  };
});

console.log('\nFirst 10 processed perfumes:');
processedPerfumes.slice(0, 10).forEach((perfume, index) => {
  console.log(`${index + 1}. ${perfume.brand} - ${perfume.name} (${perfume.volume}) - ${perfume.price} AED - ${perfume.category}`);
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

// Generate product entries for storage.ts
let productEntries = "";
let currentIndex = 200;

Object.keys(brands).forEach(brand => {
  productEntries += `\n      // ${brand} BRAND PRODUCTS\n`;
  
  brands[brand].forEach(perfume => {
    // Generate a basic description based on the brand and type
    let description = "";
    switch(brand) {
      case "CHANEL":
        description = "Premium haute couture fragrance with timeless elegance, perfect for those who appreciate fine perfumery";
        break;
      case "VERSACE":
        description = "Luxury Italian fragrance with bold and vibrant character, perfect for those who appreciate fine perfumery";
        break;
      case "XERJOFF":
        description = "Exclusive luxury fragrance with sophisticated and complex compositions, perfect for those who appreciate fine perfumery";
        break;
      default:
        description = "Luxury fragrance with sophisticated composition, perfect for those who appreciate fine perfumery";
    }
    
    productEntries += `      {\n`;
    productEntries += `        id: "${perfume.id}",\n`;
    productEntries += `        name: "${perfume.brand} ${perfume.name}",\n`;
    productEntries += `        description: "${description}",\n`;
    productEntries += `        price: "${perfume.price}.00",\n`;
    productEntries += `        category: "${perfume.category}",\n`;
    productEntries += `        brand: "${brand}",\n`;
    productEntries += `        volume: "${perfume.volume}",\n`;
    productEntries += `        rating: "5.0",\n`;
    productEntries += `        imageUrl: "/perfumes/${brand.toLowerCase().replace(/\s+/g, '_')}_${perfume.name.toLowerCase().replace(/\s+/g, '_')}_${perfume.volume.replace('ml', '')}.jpg",\n`;
    productEntries += `        moodImageUrl: "/perfumes/${brand.toLowerCase().replace(/\s+/g, '_')}_${perfume.name.toLowerCase().replace(/\s+/g, '_')}_${perfume.volume.replace('ml', '')}.jpg",\n`;
    productEntries += `        images: JSON.stringify([\n`;
    productEntries += `          "/perfumes/${brand.toLowerCase().replace(/\s+/g, '_')}_${perfume.name.toLowerCase().replace(/\s+/g, '_')}_${perfume.volume.replace('ml', '')}.jpg"\n`;
    productEntries += `        ]),\n`;
    productEntries += `        inStock: true,\n`;
    productEntries += `      },\n`;
  });
});

// Save the product entries to a file
fs.writeFileSync('product-entries.txt', productEntries);
console.log('\nProduct entries generated and saved to product-entries.txt');

// Also save the processed perfumes for reference
fs.writeFileSync('processed-perfumes-detailed.json', JSON.stringify(processedPerfumes, null, 2));
console.log('Detailed processed perfumes saved to processed-perfumes-detailed.json');