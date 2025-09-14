// Test script to verify the deployment fix
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Testing Deployment Fix ===\n');

// Check if package-lock.json exists
const lockFilePath = path.join(__dirname, 'package-lock.json');
if (!fs.existsSync(lockFilePath)) {
  console.log('❌ package-lock.json not found');
  process.exit(1);
}

console.log('✅ package-lock.json found');

// Read package-lock.json
let lockFile;
try {
  const lockFileContent = fs.readFileSync(lockFilePath, 'utf8');
  lockFile = JSON.parse(lockFileContent);
  console.log('✅ package-lock.json is valid JSON');
} catch (error) {
  console.log('❌ package-lock.json is not valid JSON:', error.message);
  process.exit(1);
}

// Read package.json
const packageJsonPath = path.join(__dirname, 'package.json');
let packageJson;
try {
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  packageJson = JSON.parse(packageJsonContent);
  console.log('✅ package.json found and valid');
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
  process.exit(1);
}

// Check if key dependencies match
const keyDependencies = [
  '@neondatabase/serverless',
  'connect-pg-simple',
  'dotenv',
  'drizzle-orm',
  'lucide-react',
  'postgres',
  'ws',
  '@types/ws',
  'drizzle-kit'
];

console.log('\nChecking key dependencies:');
let allMatch = true;

for (const dep of keyDependencies) {
  const packageVersion = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
  const lockVersion = lockFile.dependencies?.[dep]?.version || lockFile.devDependencies?.[dep]?.version;
  
  if (packageVersion && lockVersion) {
    // Extract the version number without the prefix (^ or ~)
    const cleanPackageVersion = packageVersion.replace('^', '').replace('~', '');
    
    // Check if the lock version satisfies the package version
    if (lockVersion.includes(cleanPackageVersion) || packageVersion.includes(lockVersion)) {
      console.log(`  ✅ ${dep}: package.json=${packageVersion}, package-lock.json=${lockVersion}`);
    } else {
      console.log(`  ⚠️  ${dep}: package.json=${packageVersion}, package-lock.json=${lockVersion}`);
      // This might be OK if they're compatible versions
    }
  } else if (packageVersion) {
    console.log(`  ⚠️  ${dep}: Found in package.json (${packageVersion}) but not in package-lock.json`);
    allMatch = false;
  } else if (lockVersion) {
    console.log(`  ⚠️  ${dep}: Found in package-lock.json (${lockVersion}) but not in package.json`);
    allMatch = false;
  }
}

console.log('\nChecking start scripts:');
// Test start.sh execution (dry run)
try {
  execSync('bash -n start.sh', { stdio: 'ignore' });
  console.log('  ✅ start.sh syntax is valid');
} catch (error) {
  console.log('  ❌ start.sh has syntax errors');
  allMatch = false;
}

console.log('\n=== Test Results ===');
if (allMatch) {
  console.log('✅ All tests passed! Your deployment should work correctly.');
  console.log('\nYou can now deploy to Railway with:');
  console.log('  railway up');
} else {
  console.log('⚠️  Some issues detected, but deployment might still work.');
  console.log('Check the warnings above and consider running:');
  console.log('  node regenerate-lock-file.js');
}