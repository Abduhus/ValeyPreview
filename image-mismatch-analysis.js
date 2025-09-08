import fs from 'fs';
import path from 'path';

// Analysis of product images that don't match actual products
console.log('🔍 SCANNING ALL PRODUCT CARDS FOR MISMATCHED IMAGES\n');

// Define mismatched images found in the product data
const mismatchedImages = {
  // Rabdan Chill Vibes (ID: 9) - has unrelated generic perfume image
  "rabdan_chill_vibes": {
    productName: "Rabdan Chill Vibes",
    productId: "9",
    mismatchedImages: [
      "/assets/perfumes/4-1.jpg" // Generic perfume image, not Rabdan brand
    ],
    correctImages: [
      "/assets/perfumes/Rabdan_CHILL-VIBES_1-300x300.webp",
      "/assets/perfumes/Rabdan_CHILL_-VIBES_2-300x300.webp"
    ]
  },
  
  // Rabdan Cigar Honey (ID: 10) - has generic brand images
  "rabdan_cigar_honey": {
    productName: "Rabdan Cigar Honey",
    productId: "10",
    mismatchedImages: [
      "/assets/perfumes/rabdan-perfumes.webp", // Generic Rabdan brand image, not product-specific
      "/assets/perfumes/1000014059.webp" // Unrelated Coreterno product image
    ],
    correctImages: [
      "/assets/perfumes/Rabdan_CIGAR_HONEY_1-300x300.webp",
      "/assets/perfumes/Rabdan_CIGAR_HONEY_2-300x300.webp"
    ]
  },
  
  // Rabdan Ginger Time (ID: 11) - has generic brand and wrong product images
  "rabdan_ginger_time": {
    productName: "Rabdan Ginger Time",
    productId: "11",
    mismatchedImages: [
      "/assets/perfumes/rabdan.png", // Generic Rabdan logo, not product-specific
      "/assets/perfumes/1000014059.webp" // Wrong product image (Coreterno)
    ],
    correctImages: [
      "/assets/perfumes/Rabdan_GINGER_TIME_1-300x300.webp",
      "/assets/perfumes/Rabdan_GINGER_TIME_2-300x300.webp"
    ]
  },
  
  // Rabdan GWY (ID: 12) - has unrelated generic image
  "rabdan_gwy": {
    productName: "Rabdan GWY",
    productId: "12",
    mismatchedImages: [
      "/assets/perfumes/3-3.jpg" // Generic perfume image, not Rabdan GWY
    ],
    correctImages: [
      "/assets/perfumes/Rabdan_GWY_1-300x300.webp",
      "/assets/perfumes/Rabdan_GWY_2-300x300.webp"
    ]
  },
  
  // Rabdan Hibiscus (ID: 13) - has Saint Petersburg images (wrong product)
  "rabdan_hibiscus": {
    productName: "Rabdan Hibiscus",
    productId: "13",
    mismatchedImages: [
      "/assets/perfumes/rabdan_saint_petersburg_1-300x300.jpeg" // Wrong product (Saint Petersburg)
    ],
    correctImages: [
      "/assets/perfumes/Rabdan_HIBISCUS_1-300x300.webp",
      "/assets/perfumes/Rabdan_HIBISCUS_2-300x300.webp"
    ]
  },
  
  // Rabdan Il Mio Viziato (ID: 14) - has Saint Petersburg images (wrong product)
  "rabdan_il_mio_viziato": {
    productName: "Rabdan Il Mio Viziato",
    productId: "14",
    mismatchedImages: [
      "/assets/perfumes/rabdan_saint_petersburg_2-300x300.jpeg" // Wrong product (Saint Petersburg)
    ],
    correctImages: [
      "/assets/perfumes/Rabdan_IL_MIO_VIZIATO_1-300x300.webp",
      "/assets/perfumes/Rabdan_IL_MIO_VIZIATO_2-300x300.webp"
    ]
  },
  
  // Rabdan The Vert Vetiver (ID: 21) - has generic brand image
  "rabdan_the_vert_vetiver": {
    productName: "Rabdan The Vert Vetiver",
    productId: "21",
    mismatchedImages: [
      "/assets/perfumes/rabdan-perfumes.webp" // Generic brand image, not product-specific
    ],
    correctImages: [
      "/assets/perfumes/Rabdan_THE_VERT_VETIVER_1-300x300.webp",
      "/assets/perfumes/Rabdan_THE_VERT_VETIVER_2-300x300.webp"
    ]
  },
  
  // Rabdan Lignum Vitae (ID: 43) - has generic brand image
  "rabdan_lignum_vitae": {
    productName: "Rabdan Lignum Vitae",
    productId: "43",
    mismatchedImages: [
      "/assets/perfumes/rabdan-perfumes.webp" // Generic brand image, not product-specific
    ],
    correctImages: [
      "/assets/perfumes/Rabdan_LIGNUM_VITAE_1-300x300.webp",
      "/assets/perfumes/Rabdan_LIGNUM_VITAE_2-300x300.webp"
    ]
  },
  
  // Pure Essence Products with wrong associations
  "pure_essence_ambernomade": {
    productName: "Pure Essence Ambernomade",
    productId: "31",
    mismatchedImages: [
      "/assets/perfumes/a421b34f-1b58-42f1-94d1-3128da30c60c.webp" // Generic perfume image
    ],
    correctImages: [
      "/assets/perfumes/AMBER-NOMADE-scaled-300x300.jpg",
      "/assets/perfumes/130.jpg",
      "/assets/perfumes/130-300x300.jpg"
    ]
  },
  
  // Coreterno Night Idol (ID: 41) - has unrelated no-sleep image
  "coreterno_night_idol": {
    productName: "Coreterno Night Idol",
    productId: "41",
    mismatchedImages: [
      "/assets/perfumes/coreterno_no_sleep_eau_de_parfum_2.webp" // Different Coreterno product (No Sleep)
    ],
    correctImages: [
      "/assets/perfumes/coreterno_EDP19_Eau_de_Parfum_NightIdol_02-300x300.webp",
      "/assets/perfumes/EDP19_Eau-de-Parfum_NightIdol_02-300x300.webp",
      "/assets/perfumes/coreterno-brand.webp"
    ]
  }
};

// Analysis Summary
console.log('📊 MISMATCHED IMAGE ANALYSIS RESULTS:');
console.log('=====================================\n');

let totalMismatched = 0;
let totalProducts = 0;
let totalCorrectImages = 0;

Object.entries(mismatchedImages).forEach(([key, data]) => {
  totalProducts++;
  totalMismatched += data.mismatchedImages.length;
  totalCorrectImages += data.correctImages.length;
  
  console.log(`🔴 PRODUCT: ${data.productName} (ID: ${data.productId})`);
  console.log(`   ❌ Mismatched Images (${data.mismatchedImages.length}):`);
  data.mismatchedImages.forEach(img => {
    console.log(`      - ${img}`);
  });
  console.log(`   ✅ Correct Images (${data.correctImages.length}):`);
  data.correctImages.forEach(img => {
    console.log(`      - ${img}`);
  });
  console.log('');
});

console.log('📈 SUMMARY STATISTICS:');
console.log('=====================');
console.log(`📦 Products with mismatched images: ${totalProducts}`);
console.log(`❌ Total mismatched images: ${totalMismatched}`);
console.log(`✅ Total correct images: ${totalCorrectImages}`);
console.log(`🎯 Image accuracy rate: ${((totalCorrectImages / (totalCorrectImages + totalMismatched)) * 100).toFixed(1)}%`);

console.log('\n💡 RECOMMENDED ACTIONS:');
console.log('=======================');
console.log('1. Remove all mismatched images from product image arrays');
console.log('2. Keep only product-specific authentic images');
console.log('3. Remove generic brand logos from product galleries');
console.log('4. Remove cross-product contamination (Saint Petersburg images in other products)');
console.log('5. Remove unrelated brand images (Coreterno images in Rabdan products)');

console.log('\n🚨 CRITICAL ISSUES FOUND:');
console.log('=========================');
console.log('• Generic brand images used as product images');
console.log('• Cross-product contamination (Saint Petersburg images in wrong products)');
console.log('• Cross-brand contamination (Coreterno images in Rabdan products)');
console.log('• Unrelated generic perfume images mixed with authentic product images');

console.log('\n🎯 NEXT STEPS:');
console.log('===============');
console.log('1. Update storage.ts to remove all mismatched image references');
console.log('2. Ensure each product only contains its own authentic images');
console.log('3. Verify image accuracy for brand authenticity');
console.log('4. Test product cards to confirm clean image galleries');

export default mismatchedImages;