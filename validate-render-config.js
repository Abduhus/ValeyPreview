const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Render configuration...');

// Check if render.json exists
const renderConfigPath = path.join(__dirname, 'render.json');
if (!fs.existsSync(renderConfigPath)) {
  console.error('❌ render.json not found');
  process.exit(1);
}

try {
  const renderConfig = JSON.parse(fs.readFileSync(renderConfigPath, 'utf8'));
  console.log('✅ render.json found and valid JSON');

  // Check required properties
  if (!renderConfig.buildCommand) {
    console.error('❌ buildCommand is required in render.json');
    process.exit(1);
  }

  if (!renderConfig.startCommand) {
    console.error('❌ startCommand is required in render.json');
    process.exit(1);
  }

  console.log('✅ Required properties found');

  // Check for PORT environment variable (should NOT be set in render.json)
  const hasPortEnvVar = renderConfig.envVars && renderConfig.envVars.some(envVar => 
    envVar.key === 'PORT'
  );

  if (hasPortEnvVar) {
    console.warn('⚠️  Warning: PORT should not be set in render.json');
    console.warn('   Render automatically provides the PORT environment variable');
    console.warn('   Remove the PORT envVar from render.json to use Render\'s provided port');
  } else {
    console.log('✅ PORT environment variable correctly omitted (will use Render\'s provided port)');
  }

  // Check for server-render.js
  const serverRenderPath = path.join(__dirname, 'server-render.js');
  if (!fs.existsSync(serverRenderPath)) {
    console.error('❌ server-render.js not found');
    process.exit(1);
  }
  console.log('✅ server-render.js found');

  // Check package.json for build scripts
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts || !packageJson.scripts.build) {
    console.error('❌ No build script found in package.json');
    process.exit(1);
  }
  
  console.log('✅ Build script found in package.json');

  console.log('🎉 Render configuration validation passed!');
  console.log('   You can now deploy with: git push origin main');
  console.log('   Or use the Render dashboard to deploy');

} catch (error) {
  console.error('❌ Error validating render.json:', error.message);
  process.exit(1);
}