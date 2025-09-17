#!/usr/bin/env node

/**
 * Vercel Deployment Script for ValleyPreview Perfume E-commerce Platform
 * This script automates the deployment process to Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel deployment for ValleyPreview...');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Check if vercel.json exists
if (!fs.existsSync('vercel.json')) {
  console.error('❌ Error: vercel.json not found. This file is required for Vercel deployment.');
  process.exit(1);
}

// Function to run commands with error handling
function runCommand(command, description) {
  console.log(`\n📋 ${description}...`);
  try {
    const output = execSync(command, { stdio: 'inherit', encoding: 'utf8' });
    console.log(`✅ ${description} completed successfully`);
    return output;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    throw error;
  }
}

// Function to check if Vercel CLI is installed
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI is installed');
    return true;
  } catch (error) {
    console.log('⚠️ Vercel CLI not found. Installing...');
    try {
      runCommand('npm install -g vercel', 'Installing Vercel CLI');
      return true;
    } catch (installError) {
      console.error('❌ Failed to install Vercel CLI. Please install manually:');
      console.error('npm install -g vercel');
      return false;
    }
  }
}\n\n// Function to check if user is logged in to Vercel\nfunction checkVercelLogin() {\n  try {\n    execSync('vercel whoami', { stdio: 'pipe' });\n    console.log('✅ Already logged in to Vercel');\n    return true;\n  } catch (error) {\n    console.log('⚠️ Not logged in to Vercel. Please log in...');\n    try {\n      runCommand('vercel login', 'Logging in to Vercel');\n      return true;\n    } catch (loginError) {\n      console.error('❌ Failed to log in to Vercel. Please run: vercel login');\n      return false;\n    }\n  }\n}\n\n// Function to check git status\nfunction checkGitStatus() {\n  try {\n    const status = execSync('git status --porcelain', { encoding: 'utf8' });\n    if (status.trim()) {\n      console.log('⚠️ You have uncommitted changes:');\n      console.log(status);\n      console.log('Please commit your changes before deploying.');\n      return false;\n    }\n    console.log('✅ Git repository is clean');\n    return true;\n  } catch (error) {\n    console.error('❌ Error checking git status:', error.message);\n    return false;\n  }\n}\n\n// Function to push to GitHub\nfunction pushToGitHub() {\n  try {\n    console.log('📤 Pushing latest changes to GitHub...');\n    execSync('git push origin main', { stdio: 'inherit' });\n    console.log('✅ Successfully pushed to GitHub');\n    return true;\n  } catch (error) {\n    console.error('❌ Failed to push to GitHub:', error.message);\n    console.log('Please ensure your changes are committed and try again.');\n    return false;\n  }\n}\n\n// Function to verify Vercel configuration\nfunction verifyVercelConfig() {\n  console.log('🔧 Verifying Vercel configuration...');\n  \n  // Check vercel.json\n  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));\n  console.log('✅ vercel.json found with configuration:');\n  console.log(`   Version: ${vercelConfig.version}`);\n  console.log(`   Name: ${vercelConfig.name || 'Not specified'}`);\n  console.log(`   Builds: ${vercelConfig.builds ? vercelConfig.builds.length : 0} configured`);\n  console.log(`   Routes: ${vercelConfig.routes ? vercelConfig.routes.length : 0} configured`);\n  \n  // Check api/index.js\n  if (fs.existsSync('api/index.js')) {\n    console.log('✅ api/index.js found');\n  } else {\n    console.error('❌ api/index.js not found');\n    return false;\n  }\n  \n  return true;\n}\n\n// Function to test build locally\nfunction testBuildLocally() {\n  console.log('🔨 Testing build process locally...');\n  try {\n    runCommand('npm install', 'Installing dependencies');\n    runCommand('npm run build', 'Building application');\n    console.log('✅ Local build successful');\n    return true;\n  } catch (error) {\n    console.error('❌ Local build failed. Please fix build issues before deploying.');\n    return false;\n  }\n}\n\n// Function to deploy to Vercel\nfunction deployToVercel() {\n  console.log('🚀 Deploying to Vercel...');\n  try {\n    // Deploy to production\n    execSync('vercel --prod', { stdio: 'inherit' });\n    console.log('✅ Successfully deployed to Vercel!');\n    return true;\n  } catch (error) {\n    console.error('❌ Deployment failed:', error.message);\n    return false;\n  }\n}\n\n// Function to get deployment URL\nfunction getDeploymentURL() {\n  try {\n    const url = execSync('vercel ls --scope=team', { encoding: 'utf8' }).trim();\n    console.log('🌍 Deployment completed! Check Vercel dashboard for the URL.');\n  } catch (error) {\n    console.log('🌍 Deployment completed! Check the Vercel dashboard for the URL.');\n  }\n}\n\n// Function to display deployment instructions\nfunction displayDeploymentInstructions() {\n  console.log('\\n🌐 Vercel Deployment Instructions:');\n  console.log('='.repeat(50));\n  console.log('');\n  console.log('1. 🔗 Go to Vercel Dashboard:');\n  console.log('   https://vercel.com/dashboard');\n  console.log('');\n  console.log('2. 🔐 Sign in with GitHub');\n  console.log('');\n  console.log('3. ➕ Import Project:');\n  console.log('   - Click \"Add New...\" → \"Project\"');\n  console.log('   - Import from GitHub: Abduhus/ValeyPreview');\n  console.log('   - Vercel will auto-detect the configuration');\n  console.log('');\n  console.log('4. ⚙️ Configure Project:');\n  console.log('   - Framework Preset: Other');\n  console.log('   - Build Command: npm run build');\n  console.log('   - Output Directory: dist/public');\n  console.log('   - Install Command: npm install');\n  console.log('');\n  console.log('5. 🔧 Environment Variables (if needed):');\n  console.log('   - NODE_ENV = production');\n  console.log('   - DATABASE_URL = (your database URL)');\n  console.log('');\n  console.log('6. 🚀 Deploy:');\n  console.log('   - Click \"Deploy\"');\n  console.log('   - Vercel will build and deploy automatically');\n  console.log('');\n}\n\n// Function to display post-deployment steps\nfunction displayPostDeploymentSteps() {\n  console.log('📋 Post-Deployment Checklist:');\n  console.log('='.repeat(30));\n  console.log('');\n  console.log('✅ Verify health endpoint: https://your-app.vercel.app/health');\n  console.log('✅ Test main application functionality');\n  console.log('✅ Check function logs in Vercel dashboard');\n  console.log('✅ Set up custom domain (optional)');\n  console.log('✅ Configure environment variables');\n  console.log('✅ Set up database if needed');\n  console.log('');\n  console.log('🔗 Useful Links:');\n  console.log('   - Vercel Dashboard: https://vercel.com/dashboard');\n  console.log('   - Vercel Docs: https://vercel.com/docs');\n  console.log('   - GitHub Repository: https://github.com/Abduhus/ValeyPreview');\n  console.log('');\n}\n\n// Main deployment process\nasync function main() {\n  try {\n    console.log('🔍 Pre-deployment checks...');\n    \n    // Check Vercel CLI\n    if (!checkVercelCLI()) {\n      process.exit(1);\n    }\n    \n    // Check Vercel login\n    if (!checkVercelLogin()) {\n      process.exit(1);\n    }\n    \n    // Check git status\n    if (!checkGitStatus()) {\n      process.exit(1);\n    }\n    \n    // Verify Vercel configuration\n    if (!verifyVercelConfig()) {\n      process.exit(1);\n    }\n    \n    // Test build locally\n    if (!testBuildLocally()) {\n      process.exit(1);\n    }\n    \n    // Push to GitHub\n    if (!pushToGitHub()) {\n      process.exit(1);\n    }\n    \n    // Deploy to Vercel\n    if (!deployToVercel()) {\n      process.exit(1);\n    }\n    \n    // Get deployment URL\n    getDeploymentURL();\n    \n    // Display post-deployment steps\n    displayPostDeploymentSteps();\n    \n    console.log('🎉 Deployment completed successfully!');\n    console.log('📊 You can monitor your deployment at: https://vercel.com/dashboard');\n    console.log('📋 Check logs with: vercel logs');\n    console.log('🔧 Manage environment variables in Vercel dashboard');\n    \n  } catch (error) {\n    console.error('\\n❌ Deployment failed:', error.message);\n    console.log('\\n🔧 Troubleshooting tips:');\n    console.log('1. Ensure Vercel CLI is installed: npm install -g vercel');\n    console.log('2. Login to Vercel: vercel login');\n    console.log('3. Check git status: git status');\n    console.log('4. Commit any changes: git add . && git commit -m \"Deploy to Vercel\"');\n    console.log('5. Try again: node deploy-to-vercel.js');\n    process.exit(1);\n  }\n}\n\n// Run the deployment\nmain();"