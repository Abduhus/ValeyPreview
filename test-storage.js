const fs = require('fs');

// Simulate the MemStorage initialization
async function testStorage() {
  try {
    if (fs.existsSync('processed-perfumes.json')) {
      const perfumesData = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));
      const sampleProducts = perfumesData;
      
      console.log(`Loading ${sampleProducts.length} sample products into memory storage...`);
      
      // Simulate the MemStorage initialization logic
      const products = [];
      
      // Mark ALL products as in stock, regardless of brand
      for (const product of sampleProducts) {
        const newProduct = { 
          id: product.id || Math.random().toString(36).substr(2, 9),
          images: null,
          // Set all products as in stock
          inStock: true,
          topNotes: null,
          middleNotes: null,
          baseNotes: null,
          ...product 
        };
        products.push(newProduct);
      }
      
      const inStockCount = products.filter(p => p.inStock).length;
      console.log(`✅ Successfully loaded ${products.length} products into memory storage (${inStockCount} in stock)`);
      
      // Test brand filtering
      const chanelProducts = products.filter((product) => 
        product.brand && product.brand.toLowerCase() === 'CHANEL'.toLowerCase()
      );
      console.log(`Chanel products found: ${chanelProducts.length}`);
      
      // Test the brand mapping logic
      const brandIdToNameMap = {
        'rabdan': 'RABDAN',
        'signature-royale': 'SIGNATURE ROYALE',
        'pure-essence': 'PURE ESSENCE',
        'coreterno': 'CORETERNO',
        'bvlgari': 'BVLGARI',
        'christian': 'CHRISTIAN DIOR',
        'marc': 'MARC ANTOINE BARROIS',
        'escentric': 'ESCENTRIC MOLECULE',
        'diptyque': 'DIPTYQUE',
        'giardini': 'GIARDINI DI TOSCANA',
        'bohoboco': 'BOHOBOCO',
        'tom-ford': 'TOM FORD',
        'chanel': 'CHANEL',
        'yves-saint-laurent': 'YVES SAINT LAURENT',
        'creed': 'CREED',
        'montale': 'MONTALE',
        'gucci': 'GUCCI',
        'dior': 'DIOR',
        'armani': 'ARMANI',
        'burberry': 'BURBERRY',
        'lancome': 'LANCÔME',
        'mont-blanc': 'MONT BLANC',
        'hugo-boss': 'HUGO BOSS',
        'versace': 'VERSACE',
        'xerjoff': 'XERJOFF'
      };

      // Test with 'chanel' brand ID
      const actualBrandName = brandIdToNameMap['chanel'.toLowerCase()] || 'chanel';
      console.log(`Brand mapping: chanel -> ${actualBrandName}`);
      
      const mappedChanelProducts = products.filter((product) => 
        product.brand && product.brand.toLowerCase() === actualBrandName.toLowerCase()
      );
      console.log(`Mapped Chanel products found: ${mappedChanelProducts.length}`);
    } else {
      console.log('⚠️  No processed-perfumes.json file found, storage will be empty');
    }
  } catch (error) {
    console.log('⚠️  Could not load sample data, storage will be empty:', error.message || error);
  }
}

testStorage();