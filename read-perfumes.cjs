const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('182 perfumes.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('Columns:', Object.keys(data[0] || {}));
console.log('Total rows:', data.length);
console.log('First 10 rows:');
console.log(JSON.stringify(data.slice(0, 10), null, 2));

// Save to a JSON file for easier analysis
fs.writeFileSync('perfumes-data.json', JSON.stringify(data, null, 2));
console.log('Data saved to perfumes-data.json');