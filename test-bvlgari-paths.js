import fs from 'fs';
import path from 'path';

// Test if Bvlgari image paths exist
const testPaths = [
  "/perfumes/bvlgari/Bvlgari Le Gemme Tygar Eau De Parfum.avif",
  "/perfumes/bvlgari/Bvlgari Le Gemme Tygar Eau De Parfum 1.avif",
  "/perfumes/bvlgari/Bvlgari Le Gemme Kobraa.avif",
  "/perfumes/bvlgari/Bvlgari Le Gemme Kobraa 1.avif",
  "/perfumes/bvlgari/Bvlgari Le Gemme Sahare.avif",
  "/perfumes/bvlgari/Bvlgari Le Gemme Sahare 1.avif"
];

console.log("Testing Bvlgari image paths:");

testPaths.forEach(testPath => {
  // Create full path - images are in assets/perfumes
  const fullPath = path.join('assets', testPath.substring(1)); // Remove leading slash
  
  // Check if file exists
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${testPath} - EXISTS`);
  } else {
    console.log(`❌ ${testPath} - NOT FOUND`);
    console.log(`   Looking for: ${fullPath}`);
  }
});