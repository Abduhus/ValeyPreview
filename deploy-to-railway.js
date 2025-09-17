#!/usr/bin/env node

/**
 * Railway Deployment Script for ValleyPreview Perfume E-commerce Platform
 * This script automates the deployment process to Railway
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Railway deployment for ValleyPreview...');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Check if railway.json exists
if (!fs.existsSync('railway.json')) {
  console.error('❌ Error: railway.json not found. This file is required for Railway deployment.');
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

// Function to check if Railway CLI is installed
function checkRailwayCLI() {
  try {
    execSync('railway --version', { stdio: 'pipe' });
    console.log('✅ Railway CLI is installed');
    return true;
  } catch (error) {
    console.log('⚠️ Railway CLI not found. Installing...');
    try {
      runCommand('npm install -g @railway/cli', 'Installing Railway CLI');
      return true;
    } catch (installError) {
      console.error('❌ Failed to install Railway CLI. Please install manually:');
      console.error('npm install -g @railway/cli');
      return false;
    }
  }
}

// Function to check if user is logged in to Railway
function checkRailwayLogin() {
  try {
    execSync('railway whoami', { stdio: 'pipe' });
    console.log('✅ Already logged in to Railway');
    return true;
  } catch (error) {
    console.log('⚠️ Not logged in to Railway. Please log in...');
    try {
      runCommand('railway login', 'Logging in to Railway');
      return true;
    } catch (loginError) {
      console.error('❌ Failed to log in to Railway. Please run: railway login');
      return false;
    }
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

// Function to initialize Railway project
function initializeRailway() {
  try {
    // Check if already initialized
    if (fs.existsSync('.railway')) {
      console.log('✅ Railway project already initialized');
      return true;
    }
    
    console.log('🔧 Initializing Railway project...');
    execSync('railway init', { stdio: 'inherit' });
    console.log('✅ Railway project initialized');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Railway project:', error.message);
    return false;
  }
}

// Function to set environment variables
function setEnvironmentVariables() {
  console.log('🔧 Setting environment variables...');
  
  const envVars = [
    'NODE_ENV=production',
    'PORT=5000'
  ];
  
  for (const envVar of envVars) {
    try {
      runCommand(`railway variables set ${envVar}`, `Setting ${envVar}`);
    } catch (error) {
      console.error(`⚠️ Failed to set ${envVar}, continuing...`);
    }
  }
}

// Function to deploy to Railway
function deployToRailway() {
  console.log('🚀 Deploying to Railway...');
  try {
    execSync('railway up', { stdio: 'inherit' });
    console.log('✅ Successfully deployed to Railway!');
    return true;
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    return false;
  }
}

// Function to get deployment URL
function getDeploymentURL() {
  try {
    const url = execSync('railway domain', { encoding: 'utf8' }).trim();
    if (url && url !== 'No custom domain set') {
      console.log(`🌍 Your application is available at: ${url}`);
    } else {
      console.log('🌍 Your application is deployed! Check the Railway dashboard for the URL.');
    }
  } catch (error) {
    console.log('🌍 Deployment completed! Check the Railway dashboard for the URL.');
  }
}

// Main deployment process
async function main() {
  try {
    console.log('🔍 Pre-deployment checks...');
    
    // Check Railway CLI
    if (!checkRailwayCLI()) {
      process.exit(1);
    }
    
    // Check Railway login
    if (!checkRailwayLogin()) {
      process.exit(1);
    }
    
    // Check git status
    if (!checkGitStatus()) {
      process.exit(1);
    }
    
    // Push to GitHub
    if (!pushToGitHub()) {
      process.exit(1);
    }
    
    // Initialize Railway project
    if (!initializeRailway()) {
      process.exit(1);
    }
    
    // Set environment variables
    setEnvironmentVariables();
    
    // Deploy to Railway
    if (!deployToRailway()) {
      process.exit(1);
    }
    
    // Get deployment URL
    getDeploymentURL();
    
    console.log('\n🎉 Deployment completed successfully!');
    console.log('📊 You can monitor your deployment at: https://railway.app/dashboard');
    console.log('📋 Check logs with: railway logs');
    console.log('🔧 Manage environment variables with: railway variables');
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Ensure Railway CLI is installed: npm install -g @railway/cli');
    console.log('2. Login to Railway: railway login');
    console.log('3. Check git status: git status');
    console.log('4. Commit any changes: git add . && git commit -m "Deploy to Railway"');
    console.log('5. Try again: node deploy-to-railway.js');
    process.exit(1);
  }
}

// Run the deployment
main();