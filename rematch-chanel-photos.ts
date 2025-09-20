import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the processed perfumes file
const processedPerfumes = JSON.parse(fs.readFileSync(path.join(__dirname, 'processed-perfumes.json'), 'utf8'));

// Get all Chanel products
const chanelPerfumes = processedPerfumes.filter((p: any) => p.brand === 'CHANEL');

// Get all image files in the Chanel directory
const imageDir = path.join(__dirname, 'assets', 'perfumes', 'CHANEL');
const imageFiles = fs.readdirSync(imageDir);

console.log(`Found ${chanelPerfumes.length} Chanel products and ${imageFiles.length} image files.`);

// Function to extract product name from image filename
function extractProductNameFromImage(filename: string): string {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.(avif|webp)$/, '');
  
  // Remove leading numbers and hyphens (e.g., "1-", "2-")
  let productName = nameWithoutExt.replace(/^\d+-/, '');
  
  // Handle special cases more specifically
  if (productName.includes('allure-homme-sport-eau-extreme')) {
    productName = 'ALLURE HOMME SPORT EAU EXTREME';
  } else if (productName.includes('allure-homme-sport-cologne')) {
    productName = 'ALLURE HOMME SPORT COLOGNE';
  } else if (productName.includes('allure-homme-sport')) {
    productName = 'ALLURE HOMME SPORT';
  } else if (productName.includes('allure-homme-edition-blanche')) {
    productName = 'ALLURE HOMME EDITION BLANCHE';
  } else if (productName.includes('allure-homme')) {
    productName = 'ALLURE HOMME';
  } else if (productName.includes('allure-sensuelle')) {
    productName = 'ALLURE SENSUELLE';
  } else if (productName.includes('antaeus')) {
    productName = 'ANTAEUS POUR HOMME';
  } else if (productName.includes('bleu-de-chanel')) {
    productName = 'BLEU DE CHANEL POUR HOMME';
  } else if (productName.includes('chance-eau-fraiche')) {
    productName = 'CHANCE EAU FRAICHE';
  } else if (productName.includes('chance-eau-tendre')) {
    productName = 'CHANCE EAU TENDRE';
  } else if (productName.includes('chance')) {
    productName = 'CHANCE';
  } else if (productName.includes('coco-mademoiselle-l-eau-privee')) {
    productName = 'COCO MADEMOISELLE L\'EAU PRIVEE';
  } else if (productName.includes('coco-mademoiselle')) {
    productName = 'COCO MADEMOISELLE';
  } else if (productName.includes('coco-noir')) {
    productName = 'COCO NOIR';
  } else if (productName.includes('coco')) {
    productName = 'COCO';
  } else if (productName.includes('egoiste')) {
    productName = 'EGOISTE PLATINUM POUR HOMME';
  } else if (productName.includes('gabrielle')) {
    productName = 'GABRIELLE';
  } else if (productName.includes('no-5') || productName.includes('no5')) {
    productName = 'NO.5';
  } else if (productName.includes('no-19') || productName.includes('no19')) {
    productName = 'NO.19 POUDRE';
  } else if (productName.includes('pour-monsieur')) {
    productName = 'POUR MONSIEUR';
  }
  
  return productName.toUpperCase();
}

// Function to match product names with more precise matching
function matchProductNames(productName1: string, productName2: string): boolean {
  // Normalize both names by removing extra spaces and converting to uppercase
  const normalized1 = productName1.replace(/\s+/g, ' ').trim().toUpperCase();
  const normalized2 = productName2.replace(/\s+/g, ' ').trim().toUpperCase();
  
  // Direct match
  if (normalized1 === normalized2) {
    return true;
  }
  
  // Check if one name contains the other (but not partial word matches)
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return true;
  }
  
  return false;
}

// Match images to products with more precision
const updatedPerfumes = [...processedPerfumes];
let matchedImages = 0;
let updatedProducts = 0;

chanelPerfumes.forEach((perfume: any) => {
  const productName = perfume.name.toUpperCase();
  const productId = parseInt(perfume.id);
  
  // Find matching images
  const matchingImages: string[] = [];
  
  imageFiles.forEach((imageFile: string) => {
    const imageProductName = extractProductNameFromImage(imageFile);
    
    if (matchProductNames(productName, imageProductName)) {
      const imagePath = `/assets/perfumes/CHANEL/${imageFile}`;
      matchingImages.push(imagePath);
    }
  });
  
  // Update the product with matching images if it doesn't already have proper images
  if (matchingImages.length > 0) {
    const productIndex = updatedPerfumes.findIndex((p: any) => p.id === perfume.id);
    
    if (productIndex !== -1) {
      // Set the first image as the main image URL
      updatedPerfumes[productIndex].imageUrl = matchingImages[0];
      
      // Set the second image (if available) as the mood image
      if (matchingImages.length > 1) {
        updatedPerfumes[productIndex].moodImageUrl = matchingImages[1];
      } else {
        updatedPerfumes[productIndex].moodImageUrl = matchingImages[0];
      }
      
      // Add all matching images to the images array
      updatedPerfumes[productIndex].images = JSON.stringify(matchingImages);
      
      matchedImages += matchingImages.length;
      updatedProducts++;
      console.log(`Matched ${matchingImages.length} images to ${perfume.name}`);
    }
  }
});

// Save the updated processed-perfumes.json file
fs.writeFileSync(
  path.join(__dirname, 'processed-perfumes.json'),
  JSON.stringify(updatedPerfumes, null, 2),
  'utf8'
);

console.log(`Successfully updated image URLs for ${updatedProducts} Chanel products. Matched ${matchedImages} images.`);