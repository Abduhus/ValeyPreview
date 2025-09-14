// Script to fix package-lock.json issues
const fs = require('fs');
const path = require('path');

console.log('=== Fixing package-lock.json issues ===\n');

// Check if package-lock.json exists
const lockFilePath = path.join(__dirname, 'package-lock.json');
if (!fs.existsSync(lockFilePath)) {
  console.log('package-lock.json not found, creating a new one...');
  try {
    // Run npm install to generate a new lock file
    const { execSync } = require('child_process');
    execSync('npm install', { stdio: 'inherit' });
    console.log('\n✅ Successfully created new package-lock.json');
  } catch (error) {
    console.error('❌ Failed to create package-lock.json:', error.message);
    process.exit(1);
  }
} else {
  console.log('package-lock.json found, checking for issues...');
  
  try {
    // Read package-lock.json
    const lockFileContent = fs.readFileSync(lockFilePath, 'utf8');
    const lockFile = JSON.parse(lockFileContent);
    
    // Read package.json
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    
    // Compare dependencies
    let hasMismatch = false;
    
    // Check dependencies
    for (const [name, version] of Object.entries(packageJson.dependencies || {})) {
      const lockVersion = lockFile.dependencies?.[name]?.version;
      if (lockVersion && lockVersion !== version.replace('^', '').replace('~', '')) {
        // Check if it's just a prefix difference
        const cleanVersion = version.replace('^', '').replace('~', '');
        if (!lockVersion.includes(cleanVersion)) {
          console.log(`⚠️  Dependency mismatch: ${name} - package.json: ${version}, package-lock.json: ${lockVersion}`);
          hasMismatch = true;
        }
      }
    }
    
    // Check devDependencies
    for (const [name, version] of Object.entries(packageJson.devDependencies || {})) {
      const lockVersion = lockFile.devDependencies?.[name]?.version;
      if (lockVersion && lockVersion !== version.replace('^', '').replace('~', '')) {
        // Check if it's just a prefix difference
        const cleanVersion = version.replace('^', '').replace('~', '');
        if (!lockVersion.includes(cleanVersion)) {
          console.log(`⚠️  DevDependency mismatch: ${name} - package.json: ${version}, package-lock.json: ${lockVersion}`);
          hasMismatch = true;
        }
      }
    }
    
    if (hasMismatch) {
      console.log('\n🔧 Fixing lock file by regenerating it...');
      try {
        // Backup the old lock file
        fs.copyFileSync(lockFilePath, lockFilePath + '.backup');
        console.log('  Created backup of package-lock.json');
        
        // Remove node_modules and lock file
        if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
          console.log('  Removing node_modules directory...');
          fs.rmSync(path.join(__dirname, 'node_modules'), { recursive: true, force: true });
        }
        
        // Remove package-lock.json
        fs.unlinkSync(lockFilePath);
        console.log('  Removed package-lock.json');
        
        // Run npm install to generate a new lock file
        const { execSync } = require('child_process');
        console.log('  Running npm install...');
        execSync('npm install', { stdio: 'inherit' });
        console.log('\n✅ Successfully regenerated package-lock.json');
      } catch (error) {
        console.error('❌ Failed to regenerate package-lock.json:', error.message);
        process.exit(1);
      }
    } else {
      console.log('\n✅ No significant version mismatches found in package-lock.json');
    }
  } catch (error) {
    console.error('❌ Error reading package-lock.json:', error.message);
    process.exit(1);
  }
}

console.log('\n=== Lock file fix complete ===');