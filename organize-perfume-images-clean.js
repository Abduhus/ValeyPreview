const fs = require('fs');
const path = require('path');

// Create brand folders and move images
const brands = [
  'BOHOBOCO',
  'BVLGARI',
  'CHANEL',
  'CHRISTIAN DIOR',
  'CORETERNO',
  'DIPTYQUE',
  'ESCENTRIC MOLECULE',
  'GIARDINI DI TOSCANA',
  'MARC ANTOINE BARRIOS',
  'MARC ANTOINE BARROIS',
  'PURE ESSENCE',
  'RABDAN',
  'SIGNATURE ROYALE',
  'VERSACE',
  'XERJOFF'
];

// Brand name to folder name mapping
const brandFolderMapping = {
  'BOHOBOCO': 'Bohoboco',
  'BVLGARI': 'bvlgari',
  'CHANEL': 'chanel',
  'CHRISTIAN DIOR': 'dior',
  'CORETERNO': 'Coreterno',
  'DIPTYQUE': 'diptyque',
  'ESCENTRIC MOLECULE': 'Escentric',
  'GIARDINI DI TOSCANA': 'Giardini',
  'MARC ANTOINE BARRIOS': 'marc antoine',
  'MARC ANTOINE BARROIS': 'marc antoine',
  'PURE ESSENCE': 'PureEssence',
  'RABDAN': 'Rabdan',
  'SIGNATURE ROYALE': 'SignatureRoyale',
  'VERSACE': 'Versace',
  'XERJOFF': 'Xerjoff'
};

// Create brand folders if they don't exist
brands.forEach(brand => {
  const folderName = brandFolderMapping[brand];
  const folderPath = path.join('assets', 'perfumes', folderName);
  
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created folder: ${folderPath}`);
  }
});

// Get all image files in the perfumes directory (only from root, not subdirectories)
function getImageFilesFromRoot(dirPath) {
  let results = [];
  const list = fs.readdirSync(dirPath);
  list.forEach(file => {
    const fullPath = path.resolve(dirPath, file);
    const stat = fs.statSync(fullPath);
    // Only process files in the root directory, not subdirectories
    if (stat && stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.webp' || ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        results.push({
          name: file,
          fullPath: fullPath
        });
      }
    }
  });
  return results;
}

// Get all image files from root perfumes directory
const perfumesDir = path.join('assets', 'perfumes');
const imageFiles = getImageFilesFromRoot(perfumesDir);

console.log(`Found ${imageFiles.length} image files in the root perfumes directory`);

// Match images to brands based on naming patterns
let movedCount = 0;

imageFiles.forEach(image => {
  const imageName = image.name.toLowerCase();
  let targetFolder = null;
  
  // Check each brand to see if it matches the image name
  for (const brand of brands) {
    const brandName = brand.toLowerCase();
    const folderName = brandFolderMapping[brand];
    
    // Check for brand name in image filename
    if (imageName.includes(brandName.replace(/\s+/g, '')) || 
        imageName.includes(brandName.replace(/\s+/g, '_')) ||
        imageName.includes(brandName.split(' ')[0].toLowerCase())) {
      targetFolder = folderName;
      break;
    }
    
    // Special cases for brand matching
    if (brand === 'CHRISTIAN DIOR' && (imageName.includes('dior') || imageName.includes('christian'))) {
      targetFolder = folderName;
      break;
    }
    
    if (brand === 'ESCENTRIC MOLECULE' && imageName.includes('escentric')) {
      targetFolder = folderName;
      break;
    }
    
    if (brand === 'GIARDINI DI TOSCANA' && (imageName.includes('giardini') || imageName.includes('toscano'))) {
      targetFolder = folderName;
      break;
    }
    
    if ((brand === 'MARC ANTOINE BARRIOS' || brand === 'MARC ANTOINE BARROIS') && imageName.includes('marc')) {
      targetFolder = folderName;
      break;
    }
    
    // Check for Signature Royale special cases
    if (brand === 'SIGNATURE ROYALE' && 
        (imageName.includes('signature') || imageName.includes('royale') || 
         imageName.includes('caramel') || imageName.includes('creamy') || 
         imageName.includes('dragee') || imageName.includes('grey') || 
         imageName.includes('ghost') || imageName.includes('oud') ||
         imageName.includes('iris') || imageName.includes('mytho') ||
         imageName.includes('sunset') || imageName.includes('sweet') ||
         imageName.includes('cherry'))) {
      targetFolder = folderName;
      break;
    }
    
    // Check for RABDAN special cases
    if (brand === 'RABDAN' && 
        (imageName.includes('rabdan') || imageName.includes('chill') || 
         imageName.includes('cigar') || imageName.includes('ginger') || 
         imageName.includes('gwy') || imageName.includes('hibiscus') || 
         imageName.includes('viz') || imageName.includes('iris') || 
         imageName.includes('love') || imageName.includes('room') || 
         imageName.includes('saint') || imageName.includes('vert'))) {
      targetFolder = folderName;
      break;
    }
    
    // Check for PURE ESSENCE special cases
    if (brand === 'PURE ESSENCE' && 
        (imageName.includes('pure') || imageName.includes('essence') ||
         imageName.includes('amber') || imageName.includes('babycat') ||
         imageName.includes('flowerbomb') || imageName.includes('imagination') ||
         imageName.includes('maidan'))) {
      targetFolder = folderName;
      break;
    }
    
    // Check for CORETERNO special cases
    if (brand === 'CORETERNO' && 
        (imageName.includes('coreterno') || imageName.includes('catharsis') ||
         imageName.includes('freakincense') || imageName.includes('godimenta') ||
         imageName.includes('hardkor') || imageName.includes('hierba') ||
         imageName.includes('night') || imageName.includes('punk'))) {
      targetFolder = folderName;
      break;
    }
    
    // Check for BOHOBOCO special cases
    if (brand === 'BOHOBOCO' && 
        (imageName.includes('bohoboco') || imageName.includes('vinyl') ||
         imageName.includes('wine') || imageName.includes('caramel') ||
         imageName.includes('cherry') || imageName.includes('carrot') ||
         imageName.includes('eucalyptus') || imageName.includes('patchouli') ||
         imageName.includes('potatoes') || imageName.includes('saffron'))) {
      targetFolder = folderName;
      break;
    }
    
    // Check for BVLGARI special cases
    if (brand === 'BVLGARI' && 
        (imageName.includes('bvlgari') || imageName.includes('gemme') ||
         imageName.includes('tygar') || imageName.includes('kobraa') ||
         imageName.includes('sahare') || imageName.includes('onekh') ||
         imageName.includes('orom') || imageName.includes('falkar') ||
         imageName.includes('gyan') || imageName.includes('amune'))) {
      targetFolder = folderName;
      break;
    }
    
    // Check for CHANEL special cases
    if (brand === 'CHANEL' && 
        (imageName.includes('chanel') || imageName.includes('allure') ||
         imageName.includes('bleu') || imageName.includes('chance') ||
         imageName.includes('coco') || imageName.includes('egoiste') ||
         imageName.includes('gabrielle') || imageName.includes('no.1') ||
         imageName.includes('no.5') || imageName.includes('no.19') ||
         imageName.includes('pour'))) {
      targetFolder = folderName;
      break;
    }
    
    // Check for VERSACE special cases
    if (brand === 'VERSACE' && 
        (imageName.includes('versace') || imageName.includes('blue') ||
         imageName.includes('crystal') || imageName.includes('eros') ||
         imageName.includes('jeans') || imageName.includes('red') ||
         imageName.includes('dylan') || imageName.includes('yellow'))) {
      targetFolder = folderName;
      break;
    }
    
    // Check for XERJOFF special cases
    if (brand === 'XERJOFF' && 
        (imageName.includes('xerjoff') || imageName.includes('accento') ||
         imageName.includes('amabile') || imageName.includes('casamorati') ||
         imageName.includes('coffee') || imageName.includes('erba') ||
         imageName.includes('groove') || imageName.includes('join') ||
         imageName.includes('kemi') || imageName.includes('laylati') ||
         imageName.includes('muse') || imageName.includes('newcleus') ||
         imageName.includes('opera') || imageName.includes('oud') ||
         imageName.includes('ouverture') || imageName.includes('shooting') ||
         imageName.includes('soprano') || imageName.includes('tony') ||
         imageName.includes('torino') || imageName.includes('via') ||
         imageName.includes('wardasina') || imageName.includes('stone'))) {
      targetFolder = folderName;
      break;
    }
    
    // Check for DIPTYQUE special cases
    if (brand === 'DIPTYQUE' && 
        (imageName.includes('diptyque') || imageName.includes('tam') ||
         imageName.includes('do son') || imageName.includes('fleur') ||
         imageName.includes('ombre') || imageName.includes('capitale') ||
         imageName.includes('tempo') || imageName.includes('orpheon'))) {
      targetFolder = folderName;
      break;
    }
  }
  
  // Move image to appropriate brand folder
  if (targetFolder) {
    const targetPath = path.join('assets', 'perfumes', targetFolder, image.name);
    const sourcePath = image.fullPath;
    
    try {
      fs.renameSync(sourcePath, targetPath);
      console.log(`Moved ${image.name} to ${targetFolder}/`);
      movedCount++;
    } catch (error) {
      console.error(`Error moving ${image.name}:`, error.message);
    }
  } else {
    console.log(`No brand match found for ${image.name}`);
  }
});

console.log(`\n✅ Organization complete! Moved ${movedCount} images to brand folders.`);
console.log('\nFolders created for all brands. Images have been organized accordingly.');