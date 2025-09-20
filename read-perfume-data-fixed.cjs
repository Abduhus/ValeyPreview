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

// Based on the output, it seems the columns are:
// Column 0: EAN/Barcode
// Column 1: Full product name
// Column 2: Price

// Let's process the data with proper field names
const processedData = dataRows.map((row, index) => {
  return {
    id: index + 1,
    barcode: row[0],
    fullName: row[1],
    price: row[2]
  };
});

console.log('\n=== SAMPLE PROCESSED DATA ===');
console.log(JSON.stringify(processedData.slice(0, 5), null, 2));

// Extract perfume information from full names
const perfumeInfo = processedData.map(item => {
  const fullName = item.fullName || '';
  
  // Extract brand (first word/part before space)
  const brandMatch = fullName.match(/^([A-Z]+(?:\s+[A-Z]+)?)/);
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
  // Only count valid items
  if (item.fullName) {
    typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    brandCounts[item.brand] = (brandCounts[item.brand] || 0) + 1;
    genderCounts[item.gender] = (genderCounts[item.gender] || 0) + 1;
  }
});

console.log('Perfume Types:');
Object.keys(typeCounts).sort().forEach(type => {
  console.log(`  ${type}: ${typeCounts[type]} products`);
});

console.log('\nTop Brands:');
Object.entries(brandCounts)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .forEach(([brand, count]) => {
    console.log(`  ${brand}: ${count} products`);
  });

console.log('\nGender Distribution:');
Object.keys(genderCounts).forEach(gender => {
  console.log(`  ${gender}: ${genderCounts[gender]} products`);
});

// Show some examples of each type
console.log('\n=== EXAMPLES BY TYPE ===');
const typesToShow = ['EDT', 'EDP', 'PARFUM', 'COLOGNE'];
typesToShow.forEach(type => {
  const examples = perfumeInfo.filter(item => item.type === type).slice(0, 3);
  console.log(`\n${type} Examples:`);
  examples.forEach(item => {
    console.log(`  - ${item.fullName}`);
  });
});

// Save the processed data
const fs = require('fs');
fs.writeFileSync('182-perfumes-processed.json', JSON.stringify(perfumeInfo, null, 2));
console.log('\nProcessed data saved to 182-perfumes-processed.json');