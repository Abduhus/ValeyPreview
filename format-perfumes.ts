import fs from 'fs';
import path from 'path';

// Read the converted perfumes data
const perfumesData = JSON.parse(fs.readFileSync('converted-perfumes.json', 'utf-8'));

// Function to convert a perfume object to the TypeScript format
function convertPerfumeToTSFormat(perfume: any): string {
  // Parse the images array
  const imagesArray = JSON.parse(perfume.images);
  
  // Create the TypeScript object format
  const tsFormat = `      {
        id: "${perfume.id}",
        name: "${perfume.name}",
        description: "${perfume.description}",
        price: "${perfume.price}",
        category: "${perfume.category}",
        brand: "${perfume.brand}",
        volume: "${perfume.volume}",
        rating: "${perfume.rating}",
        imageUrl: "${perfume.imageUrl}",
        moodImageUrl: "${perfume.moodImageUrl}",
        images: JSON.stringify(${JSON.stringify(imagesArray)}),
        inStock: true
      }`;
  
  return tsFormat;
}

// Convert all perfumes
const formattedPerfumes = perfumesData.map(convertPerfumeToTSFormat);

// Join all formatted perfumes with commas and newlines
const result = formattedPerfumes.join(',\n');

// Write to a file
fs.writeFileSync('formatted-perfumes.txt', result);

console.log(`Formatted ${perfumesData.length} perfumes.`);
console.log('Perfumes have been formatted and saved to formatted-perfumes.txt');