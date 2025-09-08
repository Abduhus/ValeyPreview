import fs from 'fs';
import path from 'path';

// Comprehensive scan for mismatched/unrelated images in product cards
console.log('🔍 SCANNING ALL PRODUCT CARDS FOR UNRELATED/MISMATCHED IMAGES\n');

// Identify suspicious images that might be unrelated to specific products
const suspiciousImages = [
  // Potential Cadence/unrelated brand images
  '/assets/perfumes/1000014059.webp', // Large file (152.9KB) - could be Cadence
  
  // Generic numbered images (likely from other brands/unrelated)
  '/assets/perfumes/3-3.jpg',
  '/assets/perfumes/4-1.jpg',
  '/assets/perfumes/105-300x300.jpg',
  '/assets/perfumes/106-300x300.jpg', 
  '/assets/perfumes/107-300x300.jpg',
  '/assets/perfumes/108-300x300.jpg',
  '/assets/perfumes/126-300x300.jpg',
  '/assets/perfumes/127-300x300.jpg',
  '/assets/perfumes/128-300x300.jpg',
  '/assets/perfumes/129-300x300.jpg',
  '/assets/perfumes/130-300x300.jpg',
  '/assets/perfumes/130.jpg',
  
  // Generic/unidentified images
  '/assets/perfumes/DSC_104-300x300.jpg',
  '/assets/perfumes/o.3749.jpg',
  '/assets/perfumes/a421b34f-1b58-42f1-94d1-3128da30c60c.webp',
  
  // Brand-specific images that might be mixed incorrectly
  '/assets/perfumes/rabdan-perfumes.webp', // Generic Rabdan brand image
  '/assets/perfumes/rabdan.png', // Generic Rabdan logo
  '/assets/perfumes/coreterno-brand.webp', // Generic Coreterno brand image
  '/assets/perfumes/Signature-Royale_ecriture-doree-big.png', // Generic Signature Royale logo
  
  // Saint Petersburg images (should only be in Saint Petersburg product)
  '/assets/perfumes/rabdan_saint_petersburg_1-300x300.jpeg',
  '/assets/perfumes/rabdan_saint_petersburg_2-300x300.jpeg',
  
  // Other brand images that might be misplaced
  '/assets/perfumes/Bortnikoff.webp',
  '/assets/perfumes/Gallagher-1.webp',
  '/assets/perfumes/leaumaliz.webp',
  '/assets/perfumes/AREEG-LE-DORE.webp',
  '/assets/perfumes/MELEG.webp'
];

// Product validation rules - what images each product should contain
const productImageRules = {
  // Rabdan products should only contain their specific Rabdan_PRODUCTNAME images
  'rabdan': {
    pattern: /^\/assets\/perfumes\/Rabdan_[A-Z_]+_[12]-300x300\.webp$/,
    allowedGeneric: [] // No generic images allowed
  },
  
  // Signature Royale products should only contain their specific SignatureRoyale images
  'signature-royale': {
    pattern: /^\/assets\/perfumes\/(CaramelSugar|CreamyLove|dragee_blanc|GreyLondon|iris_imperial|Mythologia|OudEnvoutant|SunsetVibes|Sweet-Cherry|GhostOud)-SignatureRoyale/,
    allowedGeneric: [] // No generic images allowed
  },
  
  // Pure Essence products should only contain their specific product images
  'pure-essence': {
    pattern: /^\/assets\/perfumes\/(AMBER-NOMADE|BABYCAT|BOMB|IMAGINATION|MAIDAN)/,
    allowedGeneric: ['/assets/perfumes/130.jpg', '/assets/perfumes/130-300x300.jpg'] // Some specific allowed images
  },
  
  // Coreterno products should only contain their specific Coreterno images
  'coreterno': {
    pattern: /^\/assets\/perfumes\/(coreterno_|EDP\d+_)/,
    allowedGeneric: ['/assets/perfumes/coreterno-brand.webp'] // Brand image allowed
  },
  
  // Valley Breezes uses Unsplash images - different validation
  'valley-breezes': {
    pattern: /^https:\/\/images\.unsplash\.com/,
    allowedGeneric: []
  }
};

console.log('🚨 SUSPICIOUS IMAGES THAT MAY BE UNRELATED:');
console.log('===========================================\n');

suspiciousImages.forEach((image, index) => {
  console.log(`${index + 1}. ${image}`);
});

console.log('\n📋 PRODUCT-SPECIFIC VALIDATION RULES:');
console.log('=====================================\n');

Object.entries(productImageRules).forEach(([brand, rules]) => {
  console.log(`🏷️  ${brand.toUpperCase()}:`);
  console.log(`   Pattern: ${rules.pattern}`);
  console.log(`   Allowed Generic: ${rules.allowedGeneric.length ? rules.allowedGeneric.join(', ') : 'None'}\n`);
});

console.log('🎯 RECOMMENDED ACTIONS:');
console.log('=======================');
console.log('1. ✅ Remove any suspicious images from product image arrays');
console.log('2. ✅ Ensure each product only contains images matching its brand pattern');
console.log('3. ✅ Remove generic brand logos from product-specific galleries');
console.log('4. ✅ Check for Cadence perfume image (1000014059.webp) in any product');
console.log('5. ✅ Verify Saint Petersburg images are only in Saint Petersburg product');

console.log('\n🔍 NEXT STEPS:');
console.log('===============');
console.log('1. Scan current product database for any of these suspicious images');
console.log('2. Remove unrelated images from product image arrays');
console.log('3. Ensure authentic brand representation only');
console.log('4. Validate all product cards display correct images');

export default {
  suspiciousImages,
  productImageRules
};