const fs = require('fs');
const path = require('path');

// Load the processed perfumes data
let perfumesData = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));

// Signature Royale products that need image assignment
const signatureRoyaleProducts = perfumesData.filter(product => 
  product.brand === "SIGNATURE ROYALE" && 
  (product.id === "signature-royale-5" || 
   product.id === "signature-royale-6" || 
   product.id === "signature-royale-7" || 
   product.id === "signature-royale-8" || 
   product.id === "signature-royale-9")
);

console.log(`Found ${signatureRoyaleProducts.length} Signature Royale products needing image assignment:`);
signatureRoyaleProducts.forEach(product => {
  console.log(`- ${product.id}: ${product.name}`);
});

// Get all image files from the perfumes directory
function getAllImageFiles(dirPath) {
  let results = [];
  const list = fs.readdirSync(dirPath);
  list.forEach(file => {
    const fullPath = path.resolve(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllImageFiles(fullPath));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.webp' || ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        results.push(file);
      }
    }
  });
  return results;
}

// Available images (all image files in the perfumes directory)
const availableImages = getAllImageFiles('./assets/perfumes');

console.log(`\nFound ${availableImages.length} total image files in the perfumes directory`);

// Mapping product names to image patterns
const productImageMapping = {
  'IRIS IMPÉRIAL': ['iris_imperial', 'iris', 'Iris', 'IRIS'],
  'MYTHOLOGIA': ['Mythologia', 'mytho', 'myth', 'Myth'],
  'OUD ENVOÛTANT': ['OudEnvoutant', 'oud', 'Oud', 'OUD'],
  'SUNSET VIBES': ['SunsetVibes', 'sunset', 'Sunset', 'SUNSET'],
  'SWEET CHERRY': ['Sweet-Cherry', 'cherry', 'Cherry', 'CHERRY']
};

// Try to find matching images for each product
signatureRoyaleProducts.forEach(product => {
  const productName = product.name.toUpperCase();
  console.log(`\nProcessing ${product.id}: ${product.name}`);
  
  // Find matching images based on product name
  const imageMatches = availableImages.filter(image => {
    const imageLower = image.toLowerCase();
    const mappings = productImageMapping[productName];
    
    if (mappings) {
      return mappings.some(mapping => imageLower.includes(mapping.toLowerCase()));
    }
    
    // Fallback: check if product name words are in the image name
    const productWords = productName.split(' ');
    return productWords.some(word => 
      word.length > 3 && imageLower.includes(word.toLowerCase())
    );
  });
  
  if (imageMatches.length > 0) {
    console.log(`  Found ${imageMatches.length} matching images:`);
    imageMatches.forEach(img => console.log(`    - ${img}`));
    
    // Assign the first two images as imageUrl and moodImageUrl
    if (imageMatches.length >= 2) {
      product.imageUrl = `/assets/perfumes/${imageMatches[0]}`;
      product.moodImageUrl = `/assets/perfumes/${imageMatches[1]}`;
      product.images = JSON.stringify([
        `/assets/perfumes/${imageMatches[0]}`,
        `/assets/perfumes/${imageMatches[1]}`
      ]);
      console.log(`  Assigned images to ${product.id}`);
    } else if (imageMatches.length === 1) {
      product.imageUrl = `/assets/perfumes/${imageMatches[0]}`;
      product.moodImageUrl = `/assets/perfumes/${imageMatches[0]}`;
      product.images = JSON.stringify([`/assets/perfumes/${imageMatches[0]}`]);
      console.log(`  Assigned single image to ${product.id}`);
    }
  } else {
    console.log(`  No matching images found for ${product.id}`);
  }
});

// Update the perfumes data with the new image assignments
perfumesData = perfumesData.map(product => {
  const updatedProduct = signatureRoyaleProducts.find(p => p.id === product.id);
  return updatedProduct ? updatedProduct : product;
});

// Save the updated data
fs.writeFileSync('processed-perfumes.json', JSON.stringify(perfumesData, null, 2));
console.log('\n✅ Updated processed-perfumes.json with Signature Royale image assignments');