// Render Deployment Readiness Checker
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Render deployment readiness for ValleyPreview...');
console.log('='.repeat(60));

let allChecksPass = true;

// Check required files
const requiredFiles = [
  { file: 'package.json', description: 'Package configuration' },
  { file: 'render.json', description: 'Render deployment configuration' },
  { file: 'server-render.js', description: 'Render server entry point' },
  { file: '.nvmrc', description: 'Node.js version specification' }
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
    'start',
    'render:build',
    'render:start'
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

// Check render.json configuration
console.log('\n🔧 Checking render.json configuration:');
if (fs.existsSync('render.json')) {
  const renderConfig = JSON.parse(fs.readFileSync('render.json', 'utf8'));
  
  console.log(`✅ Build Command: ${renderConfig.buildCommand || 'Not specified'}`);
  console.log(`✅ Start Command: ${renderConfig.startCommand || 'Not specified'}`);
  console.log(`✅ Health Check: ${renderConfig.healthCheckPath || 'Not specified'}`);
  
  if (renderConfig.envVars && renderConfig.envVars.length > 0) {
    console.log('✅ Environment Variables:');
    renderConfig.envVars.forEach(env => {
      console.log(`   ${env.key} = ${env.value}`);
    });
  } else {
    console.log('⚠️ No environment variables specified');
  }
}

// Check Node.js version
console.log('\n🔧 Checking Node.js version:');
if (fs.existsSync('.nvmrc')) {
  const nodeVersion = fs.readFileSync('.nvmrc', 'utf8').trim();
  console.log(`✅ Node.js version specified: ${nodeVersion}`);
} else {
  console.log('⚠️ .nvmrc not found - Render will use default Node.js version');
}

// Check server-render.js
console.log('\n🖥️ Checking server configuration:');
if (fs.existsSync('server-render.js')) {
  const serverContent = fs.readFileSync('server-render.js', 'utf8');
  
  if (serverContent.includes('/health')) {
    console.log('✅ Health check endpoint configured');
  } else {
    console.log('⚠️ Health check endpoint not found');
  }
  
  if (serverContent.includes('process.env.PORT')) {
    console.log('✅ Port configuration from environment');
  } else {
    console.log('⚠️ Port configuration not found');
  }
  
  if (serverContent.includes('0.0.0.0')) {
    console.log('✅ Server binds to all interfaces');
  } else {
    console.log('⚠️ Server binding configuration not verified');
  }
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

// Final assessment
console.log('\n' + '='.repeat(60));
if (allChecksPass) {
  console.log('🎉 ALL CHECKS PASSED! Ready for Render deployment!');
  console.log('');
  console.log('🚀 Next Steps:');
  console.log('1. Run: node deploy-to-render.js');
  console.log('2. Or: powershell -ExecutionPolicy Bypass -File deploy-render.ps1');
  console.log('3. Or: DEPLOY_TO_RENDER.bat');
  console.log('');
  console.log('🌐 Manual Deployment:');
  console.log('1. Go to https://render.com/');
  console.log('2. Sign in with GitHub');
  console.log('3. Create new Web Service');
  console.log('4. Connect repository: Abduhus/ValeyPreview');
  console.log('5. Use configuration from render.json');
} else {
  console.log('❌ Some checks failed. Please fix the issues above before deploying.');
}

console.log('\n📊 Deployment Dashboard: https://dashboard.render.com/');
console.log('📖 Render Docs: https://render.com/docs');
console.log('🔗 GitHub Repo: https://github.com/Abduhus/ValeyPreview');