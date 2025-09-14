// Script to verify deployment configuration
const fs = require('fs');
const path = require('path');

console.log('=== ValleyPreview Deployment Verification ===\n');

// Check if required files exist
const requiredFiles = [
  'start.sh',
  'railway.json',
  'Dockerfile',
  'package.json',
  'server/index.ts',
  'vite.config.ts'
];

let allFilesExist = true;
console.log('Checking required files:');
requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} (MISSING)`);
    allFilesExist = false;
  }
});

console.log('');

// Check package.json scripts
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const requiredScripts = ['dev', 'build', 'start', 'deploy'];
const scripts = packageJson.scripts || {};

console.log('Checking required npm scripts:');
requiredScripts.forEach(script => {
  if (scripts[script]) {
    console.log(`  ✅ ${script}: ${scripts[script]}`);
  } else {
    console.log(`  ❌ ${script} (MISSING)`);
  }
});

console.log('');

// Check railway.json configuration
try {
  const railwayConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'railway.json'), 'utf8'));
  console.log('Railway configuration:');
  console.log(`  Build strategy: ${railwayConfig.build?.builder || 'default'}`);
  console.log(`  Start command: ${railwayConfig.deploy?.startCommand || 'default'}`);
  console.log(`  Health check path: ${railwayConfig.deploy?.healthcheckPath || '/'}`);
} catch (error) {
  console.log('  ❌ railway.json parsing error:', error.message);
}

console.log('');

// Check start.sh permissions
try {
  const startShPath = path.join(__dirname, 'start.sh');
  const stats = fs.statSync(startShPath);
  const isExecutable = !!(stats.mode & (fs.constants.S_IXUSR | fs.constants.S_IXGRP | fs.constants.S_IXOTH));
  
  console.log('Start script check:');
  console.log(`  Exists: ✅`);
  console.log(`  Executable: ${isExecutable ? '✅' : '⚠️ (May need chmod +x start.sh)'}`);
} catch (error) {
  console.log('  ❌ start.sh check failed:', error.message);
}

console.log('');

// Final status
if (allFilesExist) {
  console.log('✅ All required files are present');
  console.log('✅ Deployment verification passed');
  console.log('\nYou can now deploy to Railway with:');
  console.log('  railway up');
} else {
  console.log('❌ Some required files are missing');
  console.log('❌ Please check the missing files before deploying');
}