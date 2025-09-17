// Vercel Deployment Readiness Checker
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Vercel deployment readiness for ValleyPreview...');
console.log('='.repeat(60));

let allChecksPass = true;

// Check required files
const requiredFiles = [
  { file: 'package.json', description: 'Package configuration' },
  { file: 'vercel.json', description: 'Vercel deployment configuration' },
  { file: 'api/index.js', description: 'Vercel serverless function entry point' }
];

console.log('📁 Checking required files:');
for (const { file, description } of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - ${description}`);
  } else {
    console.log(`❌ ${file} - MISSING (${description})`);
    allChecksPass = false;
  }
}

// Check package.json scripts
console.log('\n📦 Checking package.json scripts:');
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = [
    'build',
    'vercel-build',
    'vercel:deploy',
    'vercel:dev'
  ];
  
  for (const script of requiredScripts) {
    if (pkg.scripts && pkg.scripts[script]) {
      console.log(`✅ ${script}: ${pkg.scripts[script]}`);
    } else {
      console.log(`❌ ${script} - MISSING`);
      allChecksPass = false;
    }
  }
}

// Check vercel.json configuration
console.log('\n🔧 Checking vercel.json configuration:');
if (fs.existsSync('vercel.json')) {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  
  console.log(`✅ Version: ${vercelConfig.version || 'Not specified'}`);
  console.log(`✅ Name: ${vercelConfig.name || 'Not specified'}`);
  console.log(`✅ Builds: ${vercelConfig.builds ? vercelConfig.builds.length : 0} configured`);
  console.log(`✅ Routes: ${vercelConfig.routes ? vercelConfig.routes.length : 0} configured`);
  
  if (vercelConfig.functions) {
    console.log('✅ Functions configuration:');
    Object.keys(vercelConfig.functions).forEach(func => {
      const config = vercelConfig.functions[func];
      console.log(`   ${func}: maxDuration=${config.maxDuration || 'default'}, memory=${config.memory || 'default'}`);
    });
  }
  
  if (vercelConfig.env) {
    console.log('✅ Environment Variables:');
    Object.keys(vercelConfig.env).forEach(key => {
      console.log(`   ${key} = ${vercelConfig.env[key]}`);
    });
  }
}

// Check API function
console.log('\n🖥️ Checking API function:');
if (fs.existsSync('api/index.js')) {
  const apiContent = fs.readFileSync('api/index.js', 'utf8');
  
  if (apiContent.includes('/health')) {
    console.log('✅ Health check endpoint configured');
  } else {
    console.log('⚠️ Health check endpoint not found');
  }
  
  if (apiContent.includes('/vercel/health')) {
    console.log('✅ Vercel-specific health check configured');
  } else {
    console.log('⚠️ Vercel-specific health check not found');
  }
  
  if (apiContent.includes('module.exports')) {
    console.log('✅ Proper serverless function export');
  } else {
    console.log('⚠️ Serverless function export not found');
  }
  
  if (apiContent.includes('vercel.app')) {
    console.log('✅ Vercel domain CORS configuration');
  } else {
    console.log('⚠️ Vercel domain CORS not configured');
  }
}

// Check build output directory
console.log('\n📂 Checking build configuration:');
if (fs.existsSync('dist')) {
  console.log('✅ dist directory exists');
  if (fs.existsSync('dist/public')) {
    console.log('✅ dist/public directory exists (static files output)');
  } else {
    console.log('⚠️ dist/public directory not found (will be created during build)');
  }
} else {
  console.log('⚠️ dist directory not found (will be created during build)');
}

// Check git repository
console.log('\n📋 Checking git repository:');
try {
  const { execSync } = require('child_process');
  
  // Check if git repo exists
  execSync('git status', { stdio: 'pipe' });
  console.log('✅ Git repository initialized');
  
  // Check remote origin
  const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
  console.log(`✅ Remote repository: ${remote}`);
  
  // Check for uncommitted changes
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    console.log('⚠️ Uncommitted changes detected');
    console.log('   Please commit changes before deploying');
  } else {
    console.log('✅ Repository is clean');
  }
} catch (error) {
  console.log('❌ Git repository check failed');
  allChecksPass = false;
}

// Check Vercel CLI
console.log('\n🔧 Checking Vercel CLI:');
try {
  const { execSync } = require('child_process');
  const version = execSync('vercel --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Vercel CLI installed: ${version}`);
  
  // Check if logged in
  try {
    const whoami = execSync('vercel whoami', { encoding: 'utf8' }).trim();
    console.log(`✅ Logged in as: ${whoami}`);
  } catch (error) {
    console.log('⚠️ Not logged in to Vercel. Run: vercel login');
  }
} catch (error) {
  console.log('⚠️ Vercel CLI not installed. Run: npm install -g vercel');
}

// Final assessment
console.log('\n' + '='.repeat(60));
if (allChecksPass) {
  console.log('🎉 ALL CHECKS PASSED! Ready for Vercel deployment!');
  console.log('');
  console.log('🚀 Next Steps:');
  console.log('1. Run: node deploy-to-vercel.js');
  console.log('2. Or: powershell -ExecutionPolicy Bypass -File deploy-vercel.ps1');
  console.log('3. Or: DEPLOY_TO_VERCEL.bat');
  console.log('4. Or: vercel --prod');
  console.log('');
  console.log('🌐 Manual Deployment:');
  console.log('1. Go to https://vercel.com/');
  console.log('2. Sign in with GitHub');
  console.log('3. Import project: Abduhus/ValeyPreview');
  console.log('4. Configure build settings');
  console.log('5. Deploy!');
} else {
  console.log('❌ Some checks failed. Please fix the issues above before deploying.');
}

console.log('\n📊 Deployment Dashboard: https://vercel.com/dashboard');
console.log('📖 Vercel Docs: https://vercel.com/docs');
console.log('🔗 GitHub Repo: https://github.com/Abduhus/ValeyPreview');

// Display Vercel-specific features
console.log('\n🎯 Vercel Features Available:');
console.log('✅ Serverless Functions - Automatic scaling');
console.log('✅ Edge Network - Global CDN');
console.log('✅ Preview Deployments - Test before production');
console.log('✅ Custom Domains - Free SSL certificates');
console.log('✅ Analytics - Built-in performance monitoring');
console.log('✅ Git Integration - Auto-deploy on push');