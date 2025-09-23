import fs from 'fs';
import path from 'path';

// Function to copy directory recursively
function copyDir(src, dest) {
  console.log(`Creating directory: ${dest}`);
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  console.log(`Found ${entries.length} entries in ${src}`);
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      console.log(`Copying directory: ${entry.name}`);
      copyDir(srcPath, destPath);
    } else {
      console.log(`Copying file: ${entry.name}`);
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy perfumes directory
const srcPerfumes = path.join('assets', 'perfumes');
const destPerfumes = path.join('dist', 'public', 'assets', 'perfumes');

console.log('Copying perfumes assets...');
console.log(`Source path: ${srcPerfumes}`);
console.log(`Destination path: ${destPerfumes}`);
console.log(`Source exists: ${fs.existsSync(srcPerfumes)}`);

try {
  if (fs.existsSync(srcPerfumes)) {
    copyDir(srcPerfumes, destPerfumes);
    console.log('✅ Perfumes assets copied successfully');
  } else {
    console.log('⚠️  Source perfumes directory not found');
  }
} catch (error) {
  console.error('❌ Error copying perfumes assets:', error.message);
  console.error('Error stack:', error.stack);
  process.exit(1);
}