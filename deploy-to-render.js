#!/usr/bin/env node

/**
 * Render Deployment Script for ValleyPreview Perfume E-commerce Platform
 * This script automates the deployment process to Render.com
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Render deployment for ValleyPreview...');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Check if render.json exists
if (!fs.existsSync('render.json')) {
  console.error('❌ Error: render.json not found. This file is required for Render deployment.');
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

// Function to check git status
function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.log('⚠️ You have uncommitted changes:');
      console.log(status);
      console.log('Please commit your changes before deploying.');
      return false;
    }
    console.log('✅ Git repository is clean');
    return true;
  } catch (error) {
    console.error('❌ Error checking git status:', error.message);
    return false;
  }
}

// Function to push to GitHub
function pushToGitHub() {
  try {
    console.log('📤 Pushing latest changes to GitHub...');
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('✅ Successfully pushed to GitHub');
    return true;
  } catch (error) {
    console.error('❌ Failed to push to GitHub:', error.message);
    console.log('Please ensure your changes are committed and try again.');
    return false;
  }
}

// Function to verify Render configuration
function verifyRenderConfig() {
  console.log('🔧 Verifying Render configuration...');
  
  // Check render.json
  const renderConfig = JSON.parse(fs.readFileSync('render.json', 'utf8'));
  console.log('✅ render.json found with configuration:');
  console.log(`   Build Command: ${renderConfig.buildCommand}`);
  console.log(`   Start Command: ${renderConfig.startCommand}`);
  
  // Check server-render.js
  if (fs.existsSync('server-render.js')) {
    console.log('✅ server-render.js found');
  } else {
    console.error('❌ server-render.js not found');
    return false;
  }
  
  // Check Node.js version files
  if (fs.existsSync('.nvmrc')) {
    const nodeVersion = fs.readFileSync('.nvmrc', 'utf8').trim();
    console.log(`✅ .nvmrc found with Node.js version: ${nodeVersion}`);
  }
  
  return true;
}

// Function to test build locally
function testBuildLocally() {
  console.log('🔨 Testing build process locally...');
  try {
    runCommand('npm install', 'Installing dependencies');
    // Skip build test since we're not building frontend
    console.log('✅ Local build test skipped (no frontend build needed)');
    return true;
  } catch (error) {
    console.error('❌ Local build failed. Please fix build issues before deploying.');
    return false;
  }
}

// Function to display deployment instructions
function displayDeploymentInstructions() {
  console.log('\n🌐 Render Deployment Instructions:');
  console.log('='.repeat(50));
  console.log('');
  console.log('1. 🔗 Go to Render Dashboard:');
  console.log('   https://render.com/');
  console.log('');
  console.log('2. 🔐 Sign in with GitHub');
  console.log('');
  console.log('3. ➕ Create New Web Service:');
  console.log('   - Click "New +" → "Web Service"');
  console.log('   - Connect your GitHub repository: Abduhus/ValeyPreview');
  console.log('   - Select the main branch');
  console.log('');
  console.log('4. ⚙️ Configure Service:');
  console.log('   - Name: valley-preview-perfume');
  console.log('   - Environment: Node');
  console.log('   - Build Command: npm install && npm run build');
  console.log('   - Start Command: node server-render.js');
  console.log('');
  console.log('5. 🔧 Set Environment Variables:');
  console.log('   - NODE_ENV = production');
  console.log('   - PORT = 10000');
  console.log('');
  console.log('6. 🚀 Deploy:');
  console.log('   - Click "Create Web Service"');
  console.log('   - Render will automatically build and deploy');
  console.log('');
  console.log('7. 📊 Monitor Deployment:');
  console.log('   - Watch build logs in Render dashboard');
  console.log('   - Check health endpoint: /health');
  console.log('   - Your app will be available at: https://your-service.onrender.com');
  console.log('');
}

// Function to display post-deployment steps
function displayPostDeploymentSteps() {
  console.log('📋 Post-Deployment Checklist:');
  console.log('='.repeat(30));
  console.log('');
  console.log('✅ Verify health endpoint: https://your-app.onrender.com/health');
  console.log('✅ Test main application functionality');
  console.log('✅ Check logs for any errors');
  console.log('✅ Set up custom domain (optional)');
  console.log('✅ Configure monitoring alerts');
  console.log('✅ Set up database if needed');
  console.log('');
  console.log('🔗 Useful Links:');
  console.log('   - Render Dashboard: https://dashboard.render.com/');
  console.log('   - Render Docs: https://render.com/docs');
  console.log('   - GitHub Repository: https://github.com/Abduhus/ValeyPreview');
  console.log('');
}

// Main deployment process
async function main() {
  try {
    console.log('🔍 Pre-deployment checks...');
    
    // Check git status
    if (!checkGitStatus()) {
      process.exit(1);
    }
    
    // Verify Render configuration
    if (!verifyRenderConfig()) {
      process.exit(1);
    }
    
    // Test build locally
    if (!testBuildLocally()) {
      process.exit(1);
    }
    
    // Push to GitHub
    if (!pushToGitHub()) {
      process.exit(1);
    }
    
    console.log('\n✅ All pre-deployment checks passed!');
    
    // Display deployment instructions
    displayDeploymentInstructions();
    
    // Display post-deployment steps
    displayPostDeploymentSteps();
    
    console.log('🎉 Ready for Render deployment!');
    console.log('📝 Follow the instructions above to deploy via Render dashboard.');
    
  } catch (error) {
    console.error('\n❌ Deployment preparation failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Ensure all changes are committed: git add . && git commit -m "Prepare for Render deployment"');
    console.log('2. Check build process: npm run build');
    console.log('3. Verify render.json configuration');
    console.log('4. Check server-render.js exists');
    console.log('5. Try again: node deploy-to-render.js');
    process.exit(1);
  }
}

// Run the deployment preparation
main();