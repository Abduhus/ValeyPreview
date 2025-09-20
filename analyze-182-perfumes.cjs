const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('182 perfumes.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('=== 182 PERFUMES ANALYSIS ===');
console.log('Total rows:', data.length);
console.log('Columns:', Object.keys(data[0] || {}));
console.log('\nFirst 10 rows:');
console.log(JSON.stringify(data.slice(0, 10), null, 2));

// Analyze perfume types
const typeCounts = {};
const brandCounts = {};

data.forEach(row => {
  // Count perfume types
  if (row.Type) {
    const type = row.Type.toString().trim().toUpperCase();
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  }
  
  // Count brands
  if (row.Brand) {
    const brand = row.Brand.toString().trim().toUpperCase();
    brandCounts[brand] = (brandCounts[brand] || 0) + 1;
  }
});

console.log('\n=== PERFUME TYPE ANALYSIS ===');
Object.keys(typeCounts).sort().forEach(type => {
  console.log(`${type}: ${typeCounts[type]} products`);
});

console.log('\n=== BRAND ANALYSIS ===');
Object.keys(brandCounts).sort().forEach(brand => {
  console.log(`${brand}: ${brandCounts[brand]} products`);
});

// Save detailed analysis to file
const analysis = {
  totalProducts: data.length,
  columns: Object.keys(data[0] || {}),
  perfumeTypes: typeCounts,
  brands: brandCounts,
  sampleData: data.slice(0, 5)
};

fs.writeFileSync('182-perfumes-analysis.json', JSON.stringify(analysis, null, 2));
console.log('\nDetailed analysis saved to 182-perfumes-analysis.json');