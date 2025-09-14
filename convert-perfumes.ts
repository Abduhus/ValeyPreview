import fs from 'fs';
import path from 'path';

// Read the processed perfumes data
const perfumesData = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));

// Function to generate a description based on the perfume name and brand
function generateDescription(brand: string, name: string, type: string): string {
  // Create a generic description based on the perfume information
  const brandDescription = {
    'CHANEL': 'Luxury French fragrance with sophisticated and timeless appeal, perfect for those who appreciate fine perfumery',
    'VERSACE': 'Italian luxury fragrance with bold and contemporary style, perfect for those who dare to be different',
    'XERJOFF': 'Premium niche fragrance with exceptional quality and unique compositions, perfect for connoisseurs of fine fragrances'
  };

  const typeDescription = {
    'EDT': 'Eau de Toilette - a light and refreshing fragrance concentration perfect for daily wear',
    'EDP': 'Eau de Parfum - a rich and long-lasting fragrance concentration ideal for evening wear',
    'PARFUM': 'Parfum - the most concentrated and longest-lasting fragrance formulation',
    'COLOGNE': 'Cologne - a fresh and light fragrance concentration perfect for casual wear'
  };

  const baseDescription = brandDescription[brand as keyof typeof brandDescription] || 'Premium fragrance with exceptional quality and sophisticated appeal';
  const typeDesc = typeDescription[type as keyof typeof typeDescription] || 'Fine fragrance';

  return `${baseDescription}. ${typeDesc}.`;
}

// Function to generate image URLs
function generateImageUrls(brand: string, name: string, id: string): { imageUrl: string; moodImageUrl: string; images: string } {
  // For now, we'll use placeholder images since we don't have specific images for these perfumes
  // In a real implementation, you would map to actual image files
  const imageUrl = `/perfumes/${brand.toLowerCase()}_${name.toLowerCase().replace(/\s+/g, '_')}_1.webp`;
  const moodImageUrl = `/perfumes/${brand.toLowerCase()}_${name.toLowerCase().replace(/\s+/g, '_')}_2.webp`;
  const images = JSON.stringify([
    imageUrl,
    moodImageUrl
  ]);

  return { imageUrl, moodImageUrl, images };
}

// Convert perfumes to the required format
const convertedPerfumes = perfumesData.map((perfume: any) => {
  // Generate description
  const description = generateDescription(perfume.brand, perfume.name, perfume.type);
  
  // Generate image URLs
  const { imageUrl, moodImageUrl, images } = generateImageUrls(perfume.brand, perfume.name, perfume.id);
  
  // Determine category based on the "fullName" field which contains (W) for women, (M) for men
  let category = 'unisex';
  if (perfume.fullName.includes('(W)')) {
    category = 'women';
  } else if (perfume.fullName.includes('(M)')) {
    category = 'men';
  }
  
  // Generate a rating based on price (higher price = higher rating)
  const price = parseFloat(perfume.price);
  let rating = '4.5';
  if (price > 800) {
    rating = '5.0';
  } else if (price > 600) {
    rating = '4.9';
  } else if (price > 400) {
    rating = '4.8';
  } else if (price > 200) {
    rating = '4.7';
  }
  
  return {
    id: perfume.id,
    name: `${perfume.brand} ${perfume.name}`,
    description: description,
    price: `${price.toFixed(2)}`,
    category: category,
    brand: perfume.brand,
    volume: perfume.volume,
    rating: rating,
    imageUrl: imageUrl,
    moodImageUrl: moodImageUrl,
    images: images,
    inStock: true
  };
});

// Write the converted perfumes to a file
fs.writeFileSync('converted-perfumes.json', JSON.stringify(convertedPerfumes, null, 2));

console.log(`Converted ${convertedPerfumes.length} perfumes.`);
console.log('Perfumes have been converted and saved to converted-perfumes.json');