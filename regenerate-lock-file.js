// Script to forcefully regenerate package-lock.json
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Forcefully Regenerating package-lock.json ===\n');

const lockFilePath = path.join(__dirname, 'package-lock.json');
const nodeModulesPath = path.join(__dirname, 'node_modules');

try {
  // Backup the old lock file if it exists
  if (fs.existsSync(lockFilePath)) {
    console.log('Creating backup of package-lock.json...');
    fs.copyFileSync(lockFilePath, lockFilePath + '.backup');
    console.log('✅ Backup created as package-lock.json.backup');
  }
  
  // Remove node_modules directory if it exists
  if (fs.existsSync(nodeModulesPath)) {
    console.log('Removing node_modules directory...');
    fs.rmSync(nodeModulesPath, { recursive: true, force: true });
    console.log('✅ node_modules directory removed');
  }
  
  // Remove package-lock.json
  if (fs.existsSync(lockFilePath)) {
    console.log('Removing package-lock.json...');
    fs.unlinkSync(lockFilePath);
    console.log('✅ package-lock.json removed');
  }
  
  // Run npm install to generate a fresh lock file
  console.log('Running npm install to generate new package-lock.json...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('\n✅ Successfully regenerated package-lock.json');
  
  console.log('\n=== Next Steps ===');
  console.log('1. Test your application locally:');
  console.log('   npm run dev');
  console.log('2. If everything works, commit the new package-lock.json:');
  console.log('   git add package-lock.json');
  console.log('   git commit -m "Regenerate package-lock.json"');
  console.log('3. Redeploy to Railway:');
  console.log('   railway up');
  
} catch (error) {
  console.error('\n❌ Error during lock file regeneration:', error.message);
  console.error('Try running these commands manually:');
  console.error('  rm -rf node_modules package-lock.json');
  console.error('  npm install');
  process.exit(1);
}