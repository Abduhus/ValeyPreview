// Vercel Configuration Validator
// This script checks for common Vercel configuration issues

const fs = require('fs');

console.log('🔍 Validating Vercel configuration...');
console.log('='.repeat(50));

let hasErrors = false;

// Check if vercel.json exists
if (!fs.existsSync('vercel.json')) {
  console.log('❌ vercel.json not found');
  hasErrors = true;
  process.exit(1);
}

// Read and parse vercel.json
let vercelConfig;
try {
  const configContent = fs.readFileSync('vercel.json', 'utf8');
  vercelConfig = JSON.parse(configContent);
  console.log('✅ vercel.json found and valid JSON');
} catch (error) {
  console.log('❌ vercel.json is not valid JSON:', error.message);
  hasErrors = true;
  process.exit(1);
}

// Check for conflicting properties
console.log('\n🔧 Checking for configuration conflicts...');

if (vercelConfig.builds && vercelConfig.functions) {
  console.log('❌ ERROR: Both "builds" and "functions" properties found');
  console.log('   The "functions" property cannot be used with "builds"');
  console.log('   Please remove the "functions" property');
  hasErrors = true;
}

// Check for routes vs modern properties conflict
const modernProperties = ['rewrites', 'redirects', 'headers', 'cleanUrls', 'trailingSlash'];
const hasModernProperties = modernProperties.some(prop => vercelConfig[prop]);

if (vercelConfig.routes && hasModernProperties) {
  console.log('❌ ERROR: "routes" property conflicts with modern properties');
  console.log('   Found routes with:', modernProperties.filter(prop => vercelConfig[prop]).join(', '));
  console.log('   Please use "rewrites" instead of "routes"');
  hasErrors = true;
}

if (!hasErrors) {
  console.log('✅ No conflicting properties found');
}

// Validate builds configuration
if (vercelConfig.builds) {
  console.log('\n📦 Validating builds configuration...');
  console.log(`✅ Found ${vercelConfig.builds.length} build(s)`);
  
  vercelConfig.builds.forEach((build, index) => {
    console.log(`\n   Build ${index + 1}:`);
    console.log(`   ✅ Source: ${build.src}`);
    console.log(`   ✅ Builder: ${build.use}`);
    
    if (build.config) {
      console.log(`   ✅ Config: ${JSON.stringify(build.config)}`);
    }
    
    // Check if source files exist
    if (build.src !== 'package.json' && !fs.existsSync(build.src)) {
      console.log(`   ⚠️  Warning: Source file "${build.src}" not found`);
    }
  });
}

// Validate routing configuration
if (vercelConfig.routes) {
  console.log('\n🛣️  Validating routes configuration (legacy)...');
  console.log(`✅ Found ${vercelConfig.routes.length} route(s)`);
  
  vercelConfig.routes.forEach((route, index) => {
    console.log(`   Route ${index + 1}: ${route.src} → ${route.dest}`);
  });
}

if (vercelConfig.rewrites) {
  console.log('\n🔄 Validating rewrites configuration...');
  console.log(`✅ Found ${vercelConfig.rewrites.length} rewrite(s)`);
  
  vercelConfig.rewrites.forEach((rewrite, index) => {
    console.log(`   Rewrite ${index + 1}: ${rewrite.source} → ${rewrite.destination}`);
  });
}

if (vercelConfig.headers) {
  console.log('\n📋 Validating headers configuration...');
  console.log(`✅ Found ${vercelConfig.headers.length} header rule(s)`);
  
  vercelConfig.headers.forEach((header, index) => {
    console.log(`   Header rule ${index + 1}: ${header.source}`);
    header.headers.forEach(h => {
      console.log(`     ${h.key}: ${h.value}`);
    });
  });
}

// Check API directory
console.log('\n🖥️  Checking API configuration...');
if (fs.existsSync('api')) {
  console.log('✅ api directory found');
  
  if (fs.existsSync('api/index.js')) {
    console.log('✅ api/index.js found');
  } else {
    console.log('⚠️  api/index.js not found');
  }
} else {
  console.log('⚠️  api directory not found');
}

// Check package.json
console.log('\n📦 Checking package.json...');
if (fs.existsSync('package.json')) {
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log('✅ package.json found and valid');
    
    if (pkg.scripts && pkg.scripts['vercel-build']) {
      console.log('✅ vercel-build script found');
    } else {
      console.log('⚠️  vercel-build script not found');
    }
    
    if (pkg.scripts && pkg.scripts.build) {
      console.log('✅ build script found');
    } else {
      console.log('⚠️  build script not found');
    }
  } catch (error) {
    console.log('❌ package.json is not valid JSON');
    hasErrors = true;
  }
} else {
  console.log('❌ package.json not found');
  hasErrors = true;
}

// Final validation result
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Configuration validation FAILED');
  console.log('Please fix the errors above before deploying to Vercel');
  process.exit(1);
} else {
  console.log('✅ Configuration validation PASSED');
  console.log('Your Vercel configuration is valid and ready for deployment!');
  console.log('');
  console.log('🚀 Ready to deploy:');
  console.log('   vercel --prod');
  console.log('   or use the deployment scripts');
}

console.log('\n📖 Vercel Documentation: https://vercel.com/docs/concepts/projects/project-configuration');