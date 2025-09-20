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
  
  // Handle special cases
  if (productName.includes('allure-homme-sport')) {
    productName = 'ALLURE HOMME SPORT';
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

// Function to match product names
function matchProductNames(productName1: string, productName2: string): boolean {
  // Normalize both names by removing extra spaces and converting to uppercase
  const normalized1 = productName1.replace(/\s+/g, ' ').trim().toUpperCase();
  const normalized2 = productName2.replace(/\s+/g, ' ').trim().toUpperCase();
  
  // Direct match
  if (normalized1 === normalized2) {
    return true;
  }
  
  // Partial matches for complex names
  if (normalized1.includes('ALLURE HOMME EDITION BLANCHE') && normalized2.includes('ALLURE HOMME EDITION BLANCHE')) {
    return true;
  }
  
  if (normalized1.includes('ALLURE HOMME SPORT COLOGNE') && normalized2.includes('ALLURE HOMME SPORT COLOGNE')) {
    return true;
  }
  
  if (normalized1.includes('ALLURE HOMME SPORT EAU EXTREME') && normalized2.includes('ALLURE HOMME SPORT EAU EXTREME')) {
    return true;
  }
  
  if (normalized1.includes('BLEU DE CHANEL POUR HOMME') && normalized2.includes('BLEU DE CHANEL POUR HOMME')) {
    return true;
  }
  
  if (normalized1.includes('COCO MADEMOISELLE L\'EAU PRIVEE') && normalized2.includes('COCO MADEMOISELLE L\'EAU PRIVEE')) {
    return true;
  }
  
  if (normalized1.includes('EGOISTE PLATINUM') && normalized2.includes('EGOISTE PLATINUM')) {
    return true;
  }
  
  if (normalized1.includes('GABRIELLE ESSENCE') && normalized2.includes('GABRIELLE ESSENCE')) {
    return true;
  }
  
  if (normalized1.includes('NO.5') && normalized2.includes('NO.5')) {
    return true;
  }
  
  if (normalized1.includes('NO.19') && normalized2.includes('NO.19')) {
    return true;
  }
  
  if (normalized1.includes('POUR MONSIEUR') && normalized2.includes('POUR MONSIEUR')) {
    return true;
  }
  
  return false;
}

// Debug matching for products with empty images
console.log('\nProducts with empty image URLs:');
chanelPerfumes.forEach((perfume: any) => {
  if (perfume.imageUrl === "" || perfume.images === "[]") {
    console.log(`\nProduct: ${perfume.name} (${perfume.fullName})`);
    console.log(`Barcode: ${perfume.barcode}`);
    
    // Try to match with images
    const matchingImages: string[] = [];
    imageFiles.forEach((imageFile: string) => {
      const imageProductName = extractProductNameFromImage(imageFile);
      const productName = perfume.name.toUpperCase();
      
      console.log(`  Comparing "${productName}" with "${imageProductName}"`);
      
      if (matchProductNames(productName, imageProductName)) {
        const imagePath = `/assets/perfumes/CHANEL/${imageFile}`;
        matchingImages.push(imagePath);
        console.log(`    MATCH FOUND: ${imageFile}`);
      }
    });
    
    if (matchingImages.length > 0) {
      console.log(`  Total matches: ${matchingImages.length}`);
    } else {
      console.log(`  No matches found`);
    }
  }
});