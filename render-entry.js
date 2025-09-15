// Render entry point for ValleyPreview Perfume E-commerce Platform
// This file ensures proper startup on Render platform

import { spawn } from 'child_process';
import path from 'path';

// Function to start the application
function startApp() {
  console.log('=== ValleyPreview Perfume E-commerce Platform ===');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Port:', process.env.PORT || '10000');
  
  // Check if we're in production mode
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    console.log('Starting production server...');
    
    // In production, run the built application
    const serverProcess = spawn('node', ['dist/server/index.cjs'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production'
      }
    });
    
    serverProcess.on('error', (err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
    
    serverProcess.on('exit', (code) => {
      console.log(`Server process exited with code ${code}`);
      if (code !== 0) {
        process.exit(code || 1);
      }
    });
  } else {
    console.log('Starting development server...');
    
    // In development, run with tsx
    const devProcess = spawn('npx', ['tsx', 'server/index.ts'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'development'
      }
    });
    
    devProcess.on('error', (err) => {
      console.error('Failed to start development server:', err);
      process.exit(1);
    });
    
    devProcess.on('exit', (code) => {
      console.log(`Development server process exited with code ${code}`);
      if (code !== 0) {
        process.exit(code || 1);
      }
    });
  }
}

// Handle process signals
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT signal, shutting down gracefully...');
  process.exit(0);
});

// Start the application
try {
  startApp();
} catch (error) {
  console.error('Failed to start application:', error);
  process.exit(1);
}