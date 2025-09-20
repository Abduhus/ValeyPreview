const XLSX = require('xlsx');

// Read the Excel file
const workbook = XLSX.readFile('182 perfumes.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Get the raw data with proper headers
const rawData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

// The first row seems to contain the actual headers
const headers = rawData[0];
const dataRows = rawData.slice(1);

console.log('=== EXCEL FILE STRUCTURE ===');
console.log('Headers:', headers);
console.log('Total data rows:', dataRows.length);

// Try to interpret the data based on the pattern we see
console.log('\n=== DATA INTERPRETATION ===');
console.log('Based on the sample data, it appears the columns represent:');
console.log('Column 1 (415): Price');
console.log('Column 2 (3145891214604): Barcode/EAN');
console.log('Column 3 (CHANEL ALLURE HOMME (M) EDT 100 ml FR): Full product name');

// Let's process the data with proper field names
const processedData = dataRows.map((row, index) => {
  return {
    id: index + 1,
    price: row[0],
    barcode: row[1],
    fullName: row[2]
  };
});

console.log('\n=== SAMPLE PROCESSED DATA ===');
console.log(JSON.stringify(processedData.slice(0, 5), null, 2));

// Extract perfume information from full names
const perfumeInfo = processedData.map(item => {
  const fullName = item.fullName || '';
  
  // Extract brand (first word/part before space)
  const brandMatch = fullName.match(/^([A-Z]+)/);
  const brand = brandMatch ? brandMatch[1] : 'UNKNOWN';
  
  // Extract type (EDT, EDP, Parfum, Cologne, etc.)
  let type = 'UNKNOWN';
  if (fullName.includes('EDT')) type = 'EDT';
  else if (fullName.includes('EDP')) type = 'EDP';
  else if (fullName.includes('PARFUM')) type = 'PARFUM';
  else if (fullName.includes('COLOGNE')) type = 'COLOGNE';
  
  // Extract volume (e.g., 100ml, 50ml, etc.)
  const volumeMatch = fullName.match(/(\d+ml)/i);
  const volume = volumeMatch ? volumeMatch[1] : 'UNKNOWN';
  
  // Extract gender (M for men, W for women, U for unisex)
  let gender = 'UNISEX';
  if (fullName.includes('(M)')) gender = 'MEN';
  else if (fullName.includes('(W)')) gender = 'WOMEN';
  else if (fullName.includes('(U)')) gender = 'UNISEX';
  
  return {
    ...item,
    brand,
    type,
    volume,
    gender
  };
});

console.log('\n=== PERFUME TYPE ANALYSIS ===');
const typeCounts = {};
const brandCounts = {};
const genderCounts = {};

perfumeInfo.forEach(item => {
  typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
  brandCounts[item.brand] = (brandCounts[item.brand] || 0) + 1;
  genderCounts[item.gender] = (genderCounts[item.gender] || 0) + 1;
});

console.log('Perfume Types:');
Object.keys(typeCounts).sort().forEach(type => {
  console.log(`  ${type}: ${typeCounts[type]} products`);
});

console.log('\nBrands:');
Object.keys(brandCounts).sort().forEach(brand => {
  console.log(`  ${brand}: ${brandCounts[brand]} products`);
});

console.log('\nGender Distribution:');
Object.keys(genderCounts).forEach(gender => {
  console.log(`  ${gender}: ${genderCounts[gender]} products`);
});

// Save the processed data
const fs = require('fs');
fs.writeFileSync('182-perfumes-processed.json', JSON.stringify(perfumeInfo, null, 2));
console.log('\nProcessed data saved to 182-perfumes-processed.json');