const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel deployment process...\n');

try {
  // Check if we're in a git repository
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    console.log('✅ Git repository detected');
  } catch (error) {
    console.error('❌ This project must be a git repository to deploy to Vercel');
    console.log('   Please initialize git with: git init && git add . && git commit -m "Initial commit"');
    process.exit(1);
  }

  // Validate Vercel configuration
  console.log('🔍 Validating Vercel configuration...');
  if (!fs.existsSync(path.join(__dirname, 'vercel.json'))) {
    console.error('❌ vercel.json not found');
    process.exit(1);
  }
  
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    console.log('✅ Vercel CLI detected');
  } catch (error) {
    console.error('❌ Vercel CLI not found');
    console.log('   Please install it with: npm install -g vercel');
    process.exit(1);
  }

  // Check if we're logged in to Vercel
  try {
    const user = execSync('vercel whoami', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    console.log(`✅ Logged in to Vercel as: ${user.trim()}`);
  } catch (error) {
    console.error('❌ Not logged in to Vercel');
    console.log('   Please login with: vercel login');
    process.exit(1);
  }

  // Build the project
  console.log('\n🔨 Building the project...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully\n');
  } catch (error) {
    console.error('❌ Build failed');
    process.exit(1);
  }

  // Deploy to Vercel
  console.log('🌐 Deploying to Vercel...');
  try {
    const output = execSync('vercel --prod --yes', { encoding: 'utf8' });
    console.log('✅ Deployment completed successfully!\n');
    
    // Extract and display the deployment URL
    const urlMatch = output.match(/https?:\/\/[^\s]+\.vercel\.app/g);
    if (urlMatch) {
      console.log('🌍 Your application is now live at:');
      urlMatch.forEach(url => console.log(`   ${url}`));
    }
    
    console.log('\n🎉 Deployment process completed!');
  } catch (error) {
    console.error('❌ Deployment failed');
    console.error(error.message);
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Deployment process failed:', error.message);
  process.exit(1);
}