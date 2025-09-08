import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Rabdan product names that we have in our inventory
const rabdanProducts = [
  "Chill Vibes",
  "Cigar Honey",
  "Ginger Time",
  "GWY",
  "Hibiscus",
  "Il Mio Viziato",
  "Iris Tabac",
  "Lignum Vitae",
  "Love Confession",
  "Oud of King",
  "Rolling in the Deep",
  "Room 816",
  "The Vert Vetiver",
  "Saint Petersburg"
];

console.log("Rabdan Products in our inventory:");
rabdanProducts.forEach((product, index) => {
  console.log(`${index + 1}. ${product}`);
});

console.log("\nTo get the correct URLs for these products, please:");
console.log("1. Visit https://rabdanperfumes.com/");
console.log("2. Search for each product name");
console.log("3. Find the product page");
console.log("4. Inspect the product images to get the correct URLs");
console.log("5. Update the highQualityImageSources object in the upgrade script with the correct URLs");

console.log("\nExample of how to find URLs:");
console.log("- Right-click on the product image");
console.log("- Select 'Inspect' or 'Inspect Element'");
console.log("- Look for the <img> tag");
console.log("- Copy the 'src' attribute value");
console.log("- Make sure it's the full-size image, not a thumbnail");