// Vercel Configuration Validator
// This script checks for common Vercel configuration issues

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Vercel configuration...');

// Check if vercel.json exists
const vercelConfigPath = path.join(__dirname, 'vercel.json');
if (!fs.existsSync(vercelConfigPath)) {
  console.error('❌ vercel.json not found');
  process.exit(1);
}

try {
  const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
  console.log('✅ vercel.json found and valid JSON');

  // Check for conflicting properties
  if (vercelConfig.functions && vercelConfig.builds) {
    console.error('❌ The "functions" property cannot be used with "builds" property');
    process.exit(1);
  }

  if (vercelConfig.routes && (vercelConfig.rewrites || vercelConfig.redirects || vercelConfig.headers)) {
    console.error('❌ The "routes" property cannot be used with "rewrites", "redirects", or "headers"');
    process.exit(1);
  }

  console.log('✅ No conflicting properties found');

  // Check for client-side routing support
  const hasCatchAllRewrite = vercelConfig.rewrites && vercelConfig.rewrites.some(rewrite => 
    rewrite.source === '/(.*)' && rewrite.destination === '/index.html'
  );

  if (!hasCatchAllRewrite) {
    console.warn('⚠️  Warning: No catch-all rewrite rule found for client-side routing');
    console.warn('   Add this to your rewrites array:');
    console.warn('   {');
    console.warn('     "source": "/(.*)",');
    console.warn('     "destination": "/index.html"');
    console.warn('   }');
  } else {
    console.log('✅ Client-side routing support configured');
  }

  // Check for required files
  const requiredFiles = ['package.json', 'client/index.html'];
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Required file not found: ${file}`);
      process.exit(1);
    }
  }
  console.log('✅ All required files found');

  // Check package.json for build scripts
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts || !packageJson.scripts.build) {
    console.error('❌ No build script found in package.json');
    process.exit(1);
  }
  
  console.log('✅ Build script found in package.json');

  console.log('🎉 Vercel configuration validation passed!');
  console.log('   You can now deploy with: vercel --prod');

} catch (error) {
  console.error('❌ Error validating vercel.json:', error.message);
  process.exit(1);
}

console.log('\n📖 Vercel Documentation: https://vercel.com/docs/concepts/projects/project-configuration');