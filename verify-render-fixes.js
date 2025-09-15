#!/usr/bin/env node

// Script to verify all Render deployment fixes are in place

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Render Deployment Fixes...\n');

// Check 1: render.json build command
const renderJsonPath = path.join(__dirname, 'render.json');
if (fs.existsSync(renderJsonPath)) {
  const renderJson = JSON.parse(fs.readFileSync(renderJsonPath, 'utf8'));
  if (renderJson.buildCommand === 'yarn build') {
    console.log('✅ render.json buildCommand is correctly set to "yarn build"');
  } else {
    console.log('❌ render.json buildCommand is not set to "yarn build"');
    console.log(`   Current value: ${renderJson.buildCommand}`);
  }
} else {
  console.log('❌ render.json file not found');
}

// Check 2: Node.js version files
const nvmrcPath = path.join(__dirname, '.nvmrc');
const nodeVersionPath = path.join(__dirname, '.node-version');

if (fs.existsSync(nvmrcPath)) {
  const nvmrcContent = fs.readFileSync(nvmrcPath, 'utf8').trim();
  if (nvmrcContent === '20.19.5') {
    console.log('✅ .nvmrc file correctly specifies Node.js version 20.19.5');
  } else {
    console.log(`❌ .nvmrc file has incorrect version: ${nvmrcContent}`);
  }
} else {
  console.log('❌ .nvmrc file not found');
}

if (fs.existsSync(nodeVersionPath)) {
  const nodeVersionContent = fs.readFileSync(nodeVersionPath, 'utf8').trim();
  if (nodeVersionContent === '20.19.5') {
    console.log('✅ .node-version file correctly specifies Node.js version 20.19.5');
  } else {
    console.log(`❌ .node-version file has incorrect version: ${nodeVersionContent}`);
  }
} else {
  console.log('❌ .node-version file not found');
}

// Check 3: render-entry.js exists and has proper content
const renderEntryPath = path.join(__dirname, 'render-entry.js');
if (fs.existsSync(renderEntryPath)) {
  const renderEntryContent = fs.readFileSync(renderEntryPath, 'utf8');
  if (renderEntryContent.includes('Server module loaded successfully')) {
    console.log('✅ render-entry.js has proper logging for server startup');
  } else {
    console.log('❌ render-entry.js may be missing proper server startup logging');
  }
} else {
  console.log('❌ render-entry.js file not found');
}

// Check 4: Server code has proper logging
const serverIndexPath = path.join(__dirname, 'dist', 'server', 'index.cjs');
if (fs.existsSync(serverIndexPath)) {
  const serverIndexContent = fs.readFileSync(serverIndexPath, 'utf8');
  if (serverIndexContent.includes('Server successfully started on port')) {
    console.log('✅ Server code has proper port binding confirmation logging');
  } else {
    console.log('❌ Server code may be missing port binding confirmation logging');
  }
} else {
  console.log('❌ Server index.cjs file not found (may not be built yet)');
}

// Check 5: Package.json engines section
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (packageJson.engines && packageJson.engines.node === '>=20.0.0') {
    console.log('✅ package.json engines section correctly specifies Node.js >=20.0.0');
  } else {
    console.log('❌ package.json engines section may be incorrect');
  }
} else {
  console.log('❌ package.json file not found');
}

console.log('\n📋 Verification complete. Please review any issues marked with ❌');
console.log('\n📝 Next steps:');
console.log('1. Commit all changes to your repository');
console.log('2. Push to trigger a new Render deployment');
console.log('3. Monitor the deployment logs for successful port binding');