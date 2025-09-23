import fs from 'fs';
import path from 'path';

// Function to copy directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy perfumes directory
const srcPerfumes = path.join('assets', 'perfumes');
const destPerfumes = path.join('dist', 'public', 'assets', 'perfumes');

console.log('Copying perfumes assets...');
try {
  if (fs.existsSync(srcPerfumes)) {
    copyDir(srcPerfumes, destPerfumes);
    console.log('✅ Perfumes assets copied successfully');
  } else {
    console.log('⚠️  Source perfumes directory not found');
  }
} catch (error) {
  console.error('❌ Error copying perfumes assets:', error.message);
  process.exit(1);
}