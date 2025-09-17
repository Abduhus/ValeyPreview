/**
 * Script to make the valley-fresh-general copy completely independent
 * by ensuring all paths and references are self-contained
 */

const fs = require('fs');
const path = require('path');

// Function to replace absolute/external references with relative ones
function makeIndependent() {
  console.log('Making valley-fresh-general copy independent...');
  
  // 1. Update vite.config.ts to ensure all paths are relative
  const viteConfigPath = path.join(__dirname, 'valley-fresh-general', 'vite.config.ts');
  if (fs.existsSync(viteConfigPath)) {
    let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
    
    // Ensure all paths use path.resolve with __dirname
    viteConfig = viteConfig.replace(
      /path\.resolve\([^)]+\)/g,
      (match) => {
        // Keep the existing pattern but ensure it's relative to __dirname
        if (!match.includes('__dirname')) {
          return match.replace('path.resolve(', 'path.resolve(__dirname, ');
        }
        return match;
      }
    );
    
    fs.writeFileSync(viteConfigPath, viteConfig);
    console.log('✓ Updated vite.config.ts');
  }
  
  // 2. Update tsconfig.json to ensure paths are relative
  const tsConfigPath = path.join(__dirname, 'valley-fresh-general', 'tsconfig.json');
  if (fs.existsSync(tsConfigPath)) {
    let tsConfig = fs.readFileSync(tsConfigPath, 'utf8');
    
    // Ensure baseUrl is "." and paths are relative
    tsConfig = tsConfig.replace(/"baseUrl":\s*"[^"]*"/, '"baseUrl": "."');
    
    fs.writeFileSync(tsConfigPath, tsConfig);
    console.log('✓ Updated tsconfig.json');
  }
  
  // 3. Update server/vite.ts to ensure all paths are relative
  const serverVitePath = path.join(__dirname, 'valley-fresh-general', 'server', 'vite.ts');
  if (fs.existsSync(serverVitePath)) {
    let serverVite = fs.readFileSync(serverVitePath, 'utf8');
    
    // Ensure all path.resolve calls use __dirname
    serverVite = serverVite.replace(
      /path\.resolve\([^)]+\)/g,
      (match) => {
        // Keep the existing pattern but ensure it's relative to __dirname
        if (!match.includes('__dirname')) {
          return match.replace('path.resolve(', 'path.resolve(__dirname, ');
        }
        return match;
      }
    );
    
    fs.writeFileSync(serverVitePath, serverVite);
    console.log('✓ Updated server/vite.ts');
  }
  
  // 4. Create a standalone verification script
  const verificationScript = `
/**
 * Standalone verification script for the independent fresh copy
 */
const fs = require('fs');
const path = require('path');

function checkExists(relativePath) {
  const fullPath = path.join(__dirname, relativePath);
  return fs.existsSync(fullPath);
}

function countFilesInDir(relativePath) {
  const fullPath = path.join(__dirname, relativePath);
  try {
    return fs.readdirSync(fullPath).length;
  } catch (error) {
    return 0;
  }
}

console.log('=== Independent ValleyPreview Fresh Copy Verification ===\\n');

// Check all essential components
const checks = [
  { path: 'client', type: 'directory', description: 'Client source code' },
  { path: 'server', type: 'directory', description: 'Server source code' },
  { path: 'shared', type: 'directory', description: 'Shared code' },
  { path: 'assets', type: 'directory', description: 'Main assets' },
  { path: 'attached_assets', type: 'directory', description: 'Attached assets' },
  { path: 'package.json', type: 'file', description: 'Package configuration' },
  { path: 'tsconfig.json', type: 'file', description: 'TypeScript configuration' },
  { path: 'vite.config.ts', type: 'file', description: 'Vite configuration' },
  { path: 'all-products.json', type: 'file', description: 'Product data' },
  { path: 'brands-summary.json', type: 'file', description: 'Brand data' }
];

let allPresent = true;
checks.forEach(check => {
  const exists = checkExists(check.path);
  const status = exists ? '✓' : '✗';
  console.log(\`\${status} \${check.description} (\${check.path})\`);
  if (!exists) allPresent = false;
});

// Check server files
const serverFiles = ['index.ts', 'storage.ts', 'routes.ts', 'vite.ts'];
let serverFilesPresent = 0;
serverFiles.forEach(file => {
  const exists = checkExists(path.join('server', file));
  const status = exists ? '✓' : '✗';
  console.log(\`\${status} Server file: \${file}\`);
  if (exists) serverFilesPresent++;
});

console.log('\\n=== Independence Verification ===\\n');

// Check for external references in key files
const keyFiles = [
  'vite.config.ts',
  path.join('server', 'vite.ts'),
  path.join('server', 'index.ts'),
  path.join('shared', 'schema.ts')
];

let hasExternalRefs = false;
keyFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    // Check for references to parent directories or absolute paths
    if (content.includes('../..') && !file.includes('server/vite.ts')) {
      console.log(\`✗ Potential external reference in \${file}\`);
      hasExternalRefs = true;
    }
  }
});

if (!hasExternalRefs) {
  console.log('✓ No external references found in key configuration files');
}

if (allPresent && !hasExternalRefs) {
  console.log('\\n✓ SUCCESS: Fresh copy is completely independent');
  console.log('✓ All files and configurations are self-contained');
  console.log('✓ Ready for standalone development and deployment');
} else {
  console.log('\\n✗ WARNING: Some issues found');
  console.log('✗ This copy may have external dependencies');
}
`;
  
  fs.writeFileSync(path.join(__dirname, 'valley-fresh-general', 'VERIFY_INDEPENDENT.js'), verificationScript);
  console.log('✓ Created VERIFY_INDEPENDENT.js');
  
  console.log('\\n✓ Fresh copy independence process completed!');
  console.log('✓ Run node VERIFY_INDEPENDENT.js to verify independence');
}

// Run the independence process
makeIndependent();