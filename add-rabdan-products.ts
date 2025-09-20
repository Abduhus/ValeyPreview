import fs from 'fs';

// Rabdan products data
const rabdanProducts = [
  // RABDAN BRAND (375 AED each)
  {
    "id": "rabdan-1",
    "name": "CHILL VIBES",
    "brand": "RABDAN",
    "price": "375",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "A refreshing and contemporary fragrance perfect for relaxed moments"
  },
  {
    "id": "rabdan-2",
    "name": "CIGAR HONEY",
    "brand": "RABDAN",
    "price": "375",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Rich tobacco and honey blend for sophisticated evening wear"
  },
  {
    "id": "rabdan-3",
    "name": "GINGER TIME",
    "brand": "RABDAN",
    "price": "375",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Vibrant ginger-based composition with warm spices"
  },
  {
    "id": "rabdan-4",
    "name": "GWY",
    "brand": "RABDAN",
    "price": "375",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Modern unisex fragrance with fresh contemporary appeal"
  },
  {
    "id": "rabdan-5",
    "name": "HIBISCUS",
    "brand": "RABDAN",
    "price": "375",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Floral masterpiece featuring exotic hibiscus blooms"
  },
  {
    "id": "rabdan-6",
    "name": "IL MIO VIZIATO",
    "brand": "RABDAN",
    "price": "375",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Indulgent and luxurious fragrance for special occasions"
  },
  {
    "id": "rabdan-7",
    "name": "IRIS TABAC",
    "brand": "RABDAN",
    "price": "375",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Elegant iris combined with rich tobacco notes"
  },
  {
    "id": "rabdan-8",
    "name": "LOVE CONFESSION DARING",
    "brand": "RABDAN",
    "price": "375",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Bold and romantic fragrance for confident personalities"
  },
  {
    "id": "rabdan-9",
    "name": "OUD OF KING",
    "brand": "RABDAN",
    "price": "375",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Royal oud composition fit for royalty"
  },
  {
    "id": "rabdan-10",
    "name": "ROLLING IN THE DEEP",
    "brand": "RABDAN",
    "price": "375",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Deep and mysterious fragrance with complex layers"
  },
  {
    "id": "rabdan-11",
    "name": "ROOM 816",
    "brand": "RABDAN",
    "price": "375",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Intimate and personal fragrance inspired by private moments"
  },
  {
    "id": "rabdan-12",
    "name": "SAINT PETERSBURG",
    "brand": "RABDAN",
    "price": "375",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Classic European-inspired elegance"
  },
  {
    "id": "rabdan-13",
    "name": "THE VERT VETIVER",
    "brand": "RABDAN",
    "price": "375",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Fresh green vetiver with natural sophistication"
  },

  // SIGNATURE ROYALE BRAND (380 AED each)
  {
    "id": "signature-royale-1",
    "name": "CARAMEL SUGAR",
    "brand": "SIGNATURE ROYALE",
    "price": "380",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Sweet and gourmand fragrance with caramel sweetness"
  },
  {
    "id": "signature-royale-2",
    "name": "CREAMY LOVE",
    "brand": "SIGNATURE ROYALE",
    "price": "380",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Romantic and creamy composition for intimate moments"
  },
  {
    "id": "signature-royale-3",
    "name": "DRAGÉE BLANC",
    "brand": "SIGNATURE ROYALE",
    "price": "380",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Pure white floral elegance with almond sweetness"
  },
  {
    "id": "signature-royale-4",
    "name": "GREY LONDON",
    "brand": "SIGNATURE ROYALE",
    "price": "380",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Urban sophistication inspired by London's elegance"
  },
  {
    "id": "signature-royale-5",
    "name": "IRIS IMPÉRIAL",
    "brand": "SIGNATURE ROYALE",
    "price": "380",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Imperial iris composition of royal quality"
  },
  {
    "id": "signature-royale-6",
    "name": "MYTHOLOGIA",
    "brand": "SIGNATURE ROYALE",
    "price": "380",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Mythical and mysterious fragrance with ancient allure"
  },
  {
    "id": "signature-royale-7",
    "name": "OUD ENVOÛTANT",
    "brand": "SIGNATURE ROYALE",
    "price": "380",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Enchanting oud blend with hypnotic appeal"
  },
  {
    "id": "signature-royale-8",
    "name": "SUNSET VIBES",
    "brand": "SIGNATURE ROYALE",
    "price": "380",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Warm sunset-inspired fragrance for golden hour moments"
  },
  {
    "id": "signature-royale-9",
    "name": "SWEET CHERRY",
    "brand": "SIGNATURE ROYALE",
    "price": "380",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Luscious cherry fragrance with fruity sophistication"
  },

  // PURE ESSENCE BRAND (265 AED each)
  {
    "id": "pure-essence-1",
    "name": "AMBERNOMADE",
    "brand": "PURE ESSENCE",
    "price": "265",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Amber-based nomadic fragrance for the adventurous spirit"
  },
  {
    "id": "pure-essence-2",
    "name": "BABYCAT",
    "brand": "PURE ESSENCE",
    "price": "265",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Playful and charming fragrance with youthful energy"
  },
  {
    "id": "pure-essence-3",
    "name": "FLOWERBOMB",
    "brand": "PURE ESSENCE",
    "price": "265",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Explosive floral bouquet with vibrant energy"
  },
  {
    "id": "pure-essence-4",
    "name": "IMAGINATION",
    "brand": "PURE ESSENCE",
    "price": "265",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Creative and artistic fragrance that sparks imagination"
  },
  {
    "id": "pure-essence-5",
    "name": "MAIDAN",
    "brand": "PURE ESSENCE",
    "price": "265",
    "volume": "50ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Field-inspired natural fragrance with green freshness"
  },

  // CORETERNO BRAND (715 AED for fragrances)
  {
    "id": "coreterno-1",
    "name": "CATHARSIS",
    "brand": "CORETERNO",
    "price": "715",
    "volume": "100ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Emotionally powerful fragrance for inner transformation"
  },
  {
    "id": "coreterno-2",
    "name": "FREAKINCENSE",
    "brand": "CORETERNO",
    "price": "715",
    "volume": "100ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Rebellious incense blend with punk rock attitude"
  },
  {
    "id": "coreterno-3",
    "name": "GODIMENTA",
    "brand": "CORETERNO",
    "price": "715",
    "volume": "100ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Divine and transcendent fragrance experience"
  },
  {
    "id": "coreterno-4",
    "name": "HARDKOR",
    "brand": "CORETERNO",
    "price": "715",
    "volume": "100ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Hardcore intensity for bold personalities"
  },
  {
    "id": "coreterno-5",
    "name": "HIERBA NERA",
    "brand": "CORETERNO",
    "price": "715",
    "volume": "100ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Dark herbal composition with mysterious allure"
  },
  {
    "id": "coreterno-6",
    "name": "NIGHT IDOL",
    "brand": "CORETERNO",
    "price": "715",
    "volume": "100ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Nocturnal fragrance for night-time adventures"
  },
  {
    "id": "coreterno-7",
    "name": "PUNK MOTEL",
    "brand": "CORETERNO",
    "price": "715",
    "volume": "100ml",
    "category": "unisex",
    "type": "EDP",
    "description": "Edgy and unconventional fragrance with punk spirit"
  }
];

// Read existing processed-perfumes.json
const existingPerfumes = JSON.parse(fs.readFileSync('processed-perfumes.json', 'utf-8'));

// Combine existing perfumes with new Rabdan products
const updatedPerfumes = [...existingPerfumes, ...rabdanProducts];

// Write updated data back to file
fs.writeFileSync('processed-perfumes.json', JSON.stringify(updatedPerfumes, null, 2));

console.log(`Successfully added ${rabdanProducts.length} Rabdan products to processed-perfumes.json`);
console.log(`Total products now: ${updatedPerfumes.length}`);