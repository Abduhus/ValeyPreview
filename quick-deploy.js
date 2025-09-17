// Quick Railway deployment check and guide
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 ValleyPreview Railway Deployment Assistant');
console.log('='.repeat(50));

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this from the project root.');
  process.exit(1);
}

console.log('✅ Project structure verified');

// Check Railway CLI
try {
  execSync('railway --version', { stdio: 'pipe' });
  console.log('✅ Railway CLI is installed');
} catch (error) {
  console.log('❌ Railway CLI not found');
  console.log('📋 To install Railway CLI, run:');
  console.log('   npm install -g @railway/cli');
  console.log('');
  console.log('🔗 Alternative: Deploy via Railway Web Interface');
  console.log('   1. Go to https://railway.app/');
  console.log('   2. Sign in with GitHub');
  console.log('   3. Click "New Project"');
  console.log('   4. Select "Deploy from GitHub repo"');
  console.log('   5. Choose your repository: Abduhus/ValeyPreview');
  console.log('   6. Railway will automatically detect the configuration');
  console.log('');
  process.exit(0);
}

// Check Railway login
try {
  const whoami = execSync('railway whoami', { encoding: 'utf8' });
  console.log('✅ Logged in to Railway as:', whoami.trim());
} catch (error) {
  console.log('❌ Not logged in to Railway');
  console.log('📋 To log in, run: railway login');
  process.exit(0);
}

// Check git status
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    console.log('⚠️ Uncommitted changes detected');
    console.log('📋 Please commit changes first:');
    console.log('   git add .');
    console.log('   git commit -m "Prepare for Railway deployment"');
    console.log('   git push origin main');
    process.exit(0);
  }
  console.log('✅ Git repository is clean');
} catch (error) {
  console.log('⚠️ Git status check failed');
}

// Check if Railway project exists
if (fs.existsSync('.railway')) {
  console.log('✅ Railway project already configured');
} else {
  console.log('⚠️ Railway project not initialized');
  console.log('📋 Run: railway init');
}

console.log('');
console.log('🚀 Ready to deploy! Run one of these commands:');
console.log('   railway up                    # Deploy to Railway');
console.log('   node deploy-to-railway.js     # Use automated script');
console.log('   ./deploy-railway.ps1          # Use PowerShell script');
console.log('');
console.log('📊 After deployment, monitor at: https://railway.app/dashboard');
console.log('📋 View logs with: railway logs');
console.log('🔧 Set variables with: railway variables set KEY=value');