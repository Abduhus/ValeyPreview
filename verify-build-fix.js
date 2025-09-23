// Test script to verify build fix
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== Build Fix Verification ===');

// Check if package.json has the correct build script
const packageJsonPath = path.resolve(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log('Build script:', packageJson.scripts.build);
  const hasCorrectBuildScript = packageJson.scripts.build && packageJson.scripts.build.includes('npm install --include=dev');
  console.log('Has correct build script:', hasCorrectBuildScript);
  
  // Check if Vite is in dependencies
  const hasViteInDeps = packageJson.dependencies && packageJson.dependencies.vite;
  console.log('Vite in dependencies:', !!hasViteInDeps);
  
  if (hasViteInDeps) {
    console.log('Vite version in dependencies:', packageJson.dependencies.vite);
  }
}

// Check if render.json has the correct build command
const renderJsonPath = path.resolve(__dirname, 'render.json');
if (fs.existsSync(renderJsonPath)) {
  const renderJson = JSON.parse(fs.readFileSync(renderJsonPath, 'utf8'));
  console.log('Render build command:', renderJson.buildCommand);
  const hasBuildCommand = renderJson.buildCommand && renderJson.buildCommand.includes('npm run build');
  console.log('Has render build command:', hasBuildCommand);
}

console.log('\n=== Test Completed ===');
