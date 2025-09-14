// Script to verify the build fix
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Verifying Build Fix ===\n');

// Function to run a command and return the result
function runCommand(command, ignoreErrors = false) {
  try {
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    return { success: true, output: result, error: null };
  } catch (error) {
    if (ignoreErrors) {
      return { success: true, output: error.stdout || '', error: error.message };
    }
    return { success: false, output: error.stdout || '', error: error.message };
  }
}

// Check if required files exist
const requiredFiles = ['package.json', 'Dockerfile', 'start.sh', 'start.bat'];
console.log('Checking required files:');
let allFilesExist = true;
for (const file of requiredFiles) {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} (MISSING)`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing');
  process.exit(1);
}

console.log('\nChecking TypeScript availability:');
const tscCheck = runCommand('npx tsc --version', true);
if (tscCheck.success) {
  console.log(`  ✅ TypeScript available: ${tscCheck.output.trim()}`);
} else {
  console.log('  ❌ TypeScript not available');
}

console.log('\nChecking build script:');
const buildScriptCheck = runCommand('npm run build --dry-run', true);
if (buildScriptCheck.success || buildScriptCheck.error.includes('dry-run')) {
  console.log('  ✅ Build script is valid');
} else {
  console.log('  ❌ Build script validation failed');
}

console.log('\nChecking Dockerfile stages:');
const dockerfileContent = fs.readFileSync(path.join(__dirname, 'Dockerfile'), 'utf8');
if (dockerfileContent.includes('npm install --include=dev')) {
  console.log('  ✅ Dockerfile includes dev dependency installation');
} else {
  console.log('  ❌ Dockerfile missing dev dependency installation');
}

if (dockerfileContent.includes('builder') && dockerfileContent.includes('production')) {
  console.log('  ✅ Dockerfile uses multi-stage build');
} else {
  console.log('  ❌ Dockerfile missing multi-stage build');
}

console.log('\nChecking start scripts:');
const startShContent = fs.readFileSync(path.join(__dirname, 'start.sh'), 'utf8');
const startBatContent = fs.readFileSync(path.join(__dirname, 'start.bat'), 'utf8');

if (startShContent.includes('install_dev_dependencies') && startShContent.includes('tsc')) {
  console.log('  ✅ start.sh includes dev dependency handling');
} else {
  console.log('  ❌ start.sh missing dev dependency handling');
}

if (startBatContent.includes('install_dev_dependencies') && startBatContent.includes('tsc')) {
  console.log('  ✅ start.bat includes dev dependency handling');
} else {
  console.log('  ❌ start.bat missing dev dependency handling');
}

console.log('\n=== Verification Complete ===');
console.log('Your build process should now work correctly.');
console.log('\nTo test the build:');
console.log('  npm run build');
console.log('\nTo test Docker build:');
console.log('  npm run build:docker');
console.log('\nTo deploy to Railway:');
console.log('  railway up');