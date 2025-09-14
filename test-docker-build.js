// Script to test Docker build configuration
const fs = require('fs');
const path = require('path');

console.log('=== Testing Docker Build Configuration ===\n');

// Check if Dockerfile exists
const dockerfilePath = path.join(__dirname, 'Dockerfile');
if (!fs.existsSync(dockerfilePath)) {
  console.log('❌ Dockerfile not found');
  process.exit(1);
}

console.log('✅ Dockerfile found');

// Read Dockerfile content
const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');

// Check for key elements
const checks = [
  {
    pattern: /FROM node:20-alpine AS builder/,
    description: 'Multi-stage build with builder stage'
  },
  {
    pattern: /npm install --include=dev/,
    description: 'Dev dependencies installation'
  },
  {
    pattern: /RUN npm run build/,
    description: 'Build command execution'
  },
  {
    pattern: /FROM node:20-alpine AS production/,
    description: 'Production stage'
  },
  {
    pattern: /apk add.*libwebp-tools/,
    description: 'WebP tools installation'
  }
];

console.log('Checking Dockerfile configuration:');
let allChecksPassed = true;

for (const check of checks) {
  if (check.pattern.test(dockerfileContent)) {
    console.log(`  ✅ ${check.description}`);
  } else {
    console.log(`  ❌ ${check.description}`);
    allChecksPassed = false;
  }
}

console.log('\n=== Docker Build Test ===');
if (allChecksPassed) {
  console.log('✅ Dockerfile is properly configured for building');
  console.log('\nYou can now build the Docker image with:');
  console.log('  docker build -t valley-preview .');
  console.log('\nOr using the npm script:');
  console.log('  npm run build:docker');
} else {
  console.log('❌ Dockerfile is missing some required configurations');
}

console.log('\nNote: This test only verifies the Dockerfile content.');
console.log('To actually test the build, run: npm run build:docker');