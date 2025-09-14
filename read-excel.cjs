const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('565 .xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('Columns:', Object.keys(data[0] || {}));
console.log('Total rows:', data.length);
console.log('First 5 rows:');
console.log(JSON.stringify(data.slice(0, 5), null, 2));