#!/usr/bin/env node

/**
 * Health check script for deployment verification
 * This script can be run to verify the application is working correctly
 */

const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
const PROTOCOL = process.env.NODE_ENV === 'production' ? 'https' : 'http';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data,
          headers: res.headers
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function runHealthChecks() {
  console.log('🏥 Running health checks...');
  console.log(`Target: ${PROTOCOL}://${HOST}:${PORT}`);
  
  const checks = [
    {
      name: 'Root Health Check',
      url: `${PROTOCOL}://${HOST}:${PORT}/`,
      expectedStatus: 200
    },
    {
      name: 'API Health Check',
      url: `${PROTOCOL}://${HOST}:${PORT}/health`,
      expectedStatus: 200
    },
    {
      name: 'Products API',
      url: `${PROTOCOL}://${HOST}:${PORT}/api/products`,
      expectedStatus: 200
    }
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    try {
      console.log(`\n🔍 Testing: ${check.name}`);
      const response = await makeRequest(check.url);
      
      if (response.statusCode === check.expectedStatus) {
        console.log(`✅ ${check.name}: PASSED (${response.statusCode})`);
      } else {
        console.log(`❌ ${check.name}: FAILED (${response.statusCode})`);
        allPassed = false;
      }
    } catch (error) {
      console.log(`❌ ${check.name}: ERROR - ${error.message}`);
      allPassed = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('🎉 All health checks passed!');
    process.exit(0);
  } else {
    console.log('💥 Some health checks failed!');
    process.exit(1);
  }
}

// Run health checks
runHealthChecks().catch(error => {
  console.error('💥 Health check script failed:', error);
  process.exit(1);
});